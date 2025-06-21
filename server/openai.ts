import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function chatWithAI(userMessage: string, currentCode?: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert Strudel live coding assistant. Strudel is a pattern-based music programming language for live coding performances.

Key Strudel concepts:
- Patterns are sequences like "bd hh sn hh" (kick, hihat, snare, hihat)
- Functions like .s() for volume, .note() for pitch, .lpf() for low-pass filter
- Stacking patterns with stack() for layering
- Time manipulation with .fast(), .slow(), .rev()
- Sample triggering with sound names like "bd", "sn", "hh", "piano"
- Chord progressions and scales
- Effects like reverb, delay, distortion

Current user's code:
${currentCode || "No code yet"}

Provide helpful, practical advice for live coding. If the user has errors, suggest fixes. If they want creative ideas, provide Strudel pattern examples. Keep responses concise and focused on the music/code.`;

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

export async function generateStrudelPattern(description: string, bpm: number = 120): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Strudel code generator. Create valid Strudel patterns based on user descriptions. 
          
          Respond with only the Strudel code, no explanations. Use proper Strudel syntax:
          - stack() for layering patterns
          - Sample names: bd, sn, hh, cp, etc.
          - Functions: .s() for gain, .note() for pitch, .lpf() for filter
          - Patterns in quotes like "bd ~ sn ~"
          - BPM should be considered: ${bpm}
          
          Keep it concise and performance-ready.`
        },
        {
          role: "user", 
          content: `Generate a Strudel pattern for: ${description}`
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    return response.choices[0].message.content || '// AI generation failed\nstack(\n  "bd ~ ~ ~",\n  "~ ~ sn ~",\n  "hh hh hh hh"\n).s(0.7)';
  } catch (error) {
    console.error("Pattern generation error:", error);
    return '// Pattern generation failed\nstack(\n  "bd ~ ~ ~",\n  "~ ~ sn ~",\n  "hh hh hh hh"\n).s(0.7)';
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
