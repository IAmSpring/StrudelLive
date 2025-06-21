import OpenAI from "openai";
import { strudelKnowledge, strudelTips, generateStrudelSuggestion } from "./strudel-knowledge";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// OpenAI Assistant configuration for StrudelLive
const STRUDEL_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || null;

export async function chatWithAI(userMessage: string, currentCode?: string): Promise<string> {
  try {
    // Use custom assistant if available
    if (STRUDEL_ASSISTANT_ID && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "default_key") {
      return await chatWithAssistant(userMessage, currentCode);
    }

    const systemPrompt = `You are an expert Strudel live coding assistant. Help users create expressive algorithmic music with Strudel's pattern language.

CORE STRUDEL SYNTAX:
• Sounds: s("bd sd hh") with .bank("RolandTR909")
• Notes: note("c e g") or n("0 2 4").scale("C:minor")  
• Mini-notation: "bd*4" (repeat), "[bd sd]*2" (groups), "bd ~ sd ~" (rests), "<bd sd>" (alternate)
• Parallel: "bd*4, hh*8" (comma separates layers)
• Stack: Use $: before each pattern for polyphony

ESSENTIAL EFFECTS:
• Filters: .lpf(800) .hpf(200) .lpq(10) .vowel("a e i")
• Time: .delay(.5) .room(.3) .pan("0 1") .speed("<1 2>")
• Envelope: .attack(.1).decay(.2).sustain(.5).release(.3)
• Modulation: .lpf(sine.range(200,2000).slow(4))

PATTERN FUNCTIONS:
• .rev() .jux(rev) .add("0 1") .sometimes(fast(2))
• .off(1/8, x=>x.add(7)) .ply("<1 2 3>")
• Euclidean: s("bd(3,8)") distributes 3 hits in 8 beats

LIVE CODING TECHNIQUES:
• Start simple: s("bd ~ sd ~")  
• Build layers: $: s("bd*4") then $: s("hh*8")
• Add variation: .sometimes(rev) .often(fast(2))
• Use scales for melody: n("0 2 4 6").scale("C:minor")
• Filter sweeps: .lpf(sine.range(200,2000).slow(8))

PERFORMANCE TIPS:
• Ctrl+Enter evaluates, Ctrl+. stops
• Use .gain() for dynamics, .room() for space
• .jux(rev) creates instant stereo width
• euclidean rhythms: s("bd(5,8), hh(7,16)")
• all(x=>x.room(.5)) affects everything

Current code context:
${currentCode || "// Start with: s(\"bd ~ sd ~\")"}

Provide practical, musical advice. Give working code examples. Focus on helping create expressive live performances.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to the AI service. Please check your API key configuration and try again.";
  }
}

// Function to use OpenAI Assistant API
async function chatWithAssistant(userMessage: string, currentCode?: string): Promise<string> {
  try {
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add the user message with current code context
    const messageContent = currentCode 
      ? `Current Strudel code:\n\`\`\`\n${currentCode}\n\`\`\`\n\n${userMessage}`
      : userMessage;
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messageContent
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: STRUDEL_ASSISTANT_ID!
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (runStatus.status === 'completed') {
      // Get the assistant's response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
      
      if (assistantMessage && assistantMessage.content[0].type === 'text') {
        return assistantMessage.content[0].text.value;
      }
    }

    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
  } catch (error) {
    console.error("Assistant API error:", error);
    // Fall back to regular chat completion
    throw error;
  }
}

export async function generateStrudelPattern(description: string, bpm: number = 120): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Strudel pattern generator. Create authentic, playable Strudel code based on descriptions.

STRUDEL SYNTAX RULES:
• Use s("sample_name") for sounds: bd, sd, hh, oh, cp, rim
• Stack patterns with $: not stack()
• Parallel with commas: s("bd*4, hh*8") 
• Banks: .bank("RolandTR909")
• Notes: note("c e g") or n("0 2 4").scale("C:minor")
• Effects: .lpf(800) .room(.3) .delay(.125) .gain(.7)
• Mini-notation: * for repeat, ~ for rest, [] for groups, <> for alternate

RESPOND WITH ONLY CODE - NO EXPLANATIONS.
Target BPM: ${bpm}
Make it performance-ready and musically interesting.`
        },
        {
          role: "user", 
          content: `Create a Strudel pattern: ${description}`
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const content = response.choices[0].message.content || '';
    
    // Clean up the response - remove markdown formatting if present
    const cleanCode = content
      .replace(/```strudel\n?/g, '')
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return cleanCode || generateStrudelSuggestion(description);
  } catch (error) {
    console.error("Pattern generation error:", error);
    return generateStrudelSuggestion(description);
  }
}

export async function generateRandomBeat(): Promise<string> {
  const beatStyles = [
    "energetic house beat with rolling bassline",
    "minimal techno with sparse percussion", 
    "funky breakbeat with syncopated rhythms",
    "ambient downtempo with subtle percussion",
    "driving four-on-the-floor dance beat",
    "experimental glitchy rhythm",
    "classic hip-hop boom bap pattern",
    "fast-paced drum and bass breakbeat",
    "relaxed lo-fi hip hop groove",
    "industrial techno with heavy kicks",
    "tribal percussion with organic rhythms",
    "psychedelic trance with building energy",
    "jazzy swing with improvised fills",
    "reggaeton with Latin percussion",
    "UK garage with shuffled hi-hats"
  ];

  const randomStyle = beatStyles[Math.floor(Math.random() * beatStyles.length)];
  
  try {
    return await generateStrudelPattern(randomStyle, 120);
  } catch (error) {
    // Fallback patterns if AI generation fails
    const fallbackPatterns = [
      `// ${randomStyle}
stack(
  "bd ~ ~ ~",
  "~ ~ sn ~",
  "hh hh hh hh"
).s(0.7)`,
      `// ${randomStyle}
stack(
  "bd bd ~ ~",
  "~ sn ~ sn",
  "hh ~ hh ~"
).s(0.6).lpf(2000)`,
      `// ${randomStyle}
stack(
  "bd ~ sn ~",
  "hh hh hh hh",
  "~ cp ~ ~"
).s(0.8)`
    ];
    
    return fallbackPatterns[Math.floor(Math.random() * fallbackPatterns.length)];
  }
}

export async function analyzeStrudelCode(code: string): Promise<{
  suggestions: string[];
  errors: string[];
  improvements: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze Strudel code and provide feedback. Respond with JSON in this format:
          {
            "suggestions": ["suggestion1", "suggestion2"],
            "errors": ["error1", "error2"], 
            "improvements": ["improvement1", "improvement2"]
          }
          
          Focus on:
          - Syntax errors in Strudel patterns
          - Performance optimizations
          - Creative suggestions for live coding
          - Common patterns and techniques`
        },
        {
          role: "user",
          content: `Analyze this Strudel code:\n\n${code}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      suggestions: result.suggestions || [],
      errors: result.errors || [],
      improvements: result.improvements || []
    };
  } catch (error) {
    console.error("Code analysis error:", error);
    return {
      suggestions: ["Unable to analyze code at this time"],
      errors: [],
      improvements: []
    };
  }
}
