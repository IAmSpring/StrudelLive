// Strudel Live Coding Knowledge Base
// This file contains comprehensive Strudel syntax and patterns for AI assistance

export const strudelKnowledge = {
  // Core Strudel syntax patterns
  basicPatterns: {
    sounds: `
// Basic drum sounds
s("bd sd hh oh")  // kick, snare, hihat, open hihat
s("bd*4, hh*8, ~ sd ~")  // parallel patterns with commas

// Sample banks
s("bd sd hh").bank("RolandTR909")
s("bd sd hh").bank("RolandTR808") 

// Sample numbers
s("hh:0 hh:1 hh:2")  // select different samples
n("0 1 2 3").s("jazz")  // alternative syntax
`,

    notes: `
// Notes with numbers (MIDI)
note("48 52 55 59").s("piano")

// Notes with letters
note("c e g b").s("piano")
note("c2 e3 g4 b5").s("piano")  // octaves

// Scales make everything sound good
n("0 2 4 6").scale("C:minor").s("piano")
n("0 2 4 <[6,8] [7,9]>").scale("C:minor").s("piano")
`,

    miniNotation: `
// Mini-notation patterns
"bd sd hh oh"           // sequence
"bd*4"                  // repeat 4 times  
"bd/2"                  // slow down by 2
"bd@3 sd"               // elongate bd by 3
"bd!3"                  // replicate 3 times
"[bd sd]*2"             // sub-sequences
"<bd sd hh>"            // alternate (one per cycle)
"bd ~ sd ~"             // rests with ~ or -
"bd, hh*4"              // parallel with comma
"bd(3,8)"               // euclidean rhythm
`,

    stackingPatterns: `
// Stack multiple patterns with $:
$: s("bd*4, hh*8")
$: note("c e g").s("piano")
$: s("~ sd ~").room(.5)

// Hydra integration
await initHydra({feedStrudel:1})
src(s0).kaleid(H("<4 5 6>"))
.diff(osc(1,0.5,5))
.modulateScale(osc(2,-0.25,1))
.out()
`
  },

  // Audio effects and processing
  effects: {
    filters: `
// Filters
.lpf(1000)              // low-pass filter
.hpf(200)               // high-pass filter  
.bpf(800)               // band-pass filter
.lpq(10)                // resonance/Q factor
.vowel("a e i o")       // formant filter

// Pattern filters
.lpf("200 1000 500")    // pattern the cutoff
.lpf(sine.range(200,2000).slow(4))  // modulate with LFO
`,

    envelope: `
// ADSR envelope
.attack(.1)
.decay(.2) 
.sustain(.5)
.release(.3)

// Short notation
.adsr(".1:.2:.5:.3")

// Filter envelope
.lpf(400).lpenv(2).lpa(.1).lpd(.2).lps(.3).lpr(.4)
`,

    timeEffects: `
// Time-based effects  
.delay(.5)              // delay time
.delay(".5:.125:.8")    // time:feedback:wet
.room(.5)               // reverb
.pan("0 .5 1")          // stereo panning
.gain(".5 1 .25")       // volume/dynamics

// Modulation
.speed("<1 2 -1>")      // playback speed
.fast(2)                // speed up pattern
.slow(2)                // slow down pattern
`
  },

  // Pattern transformation functions
  transformations: {
    patternEffects: `
// Classic Tidal pattern functions
.rev()                  // reverse pattern
.jux(rev)              // split stereo, modify right
.add("0 1 2")          // add to notes/numbers
.ply("<1 2 3>")        // multiply each event
.off(1/8, x=>x.add(7)) // offset copy with modification

// Probability and conditionals
.sometimes(rev)         // sometimes apply function
.often(fast(2))        // often apply function
.rarely(add(12))       // rarely apply function
`,

    euclidean: `
// Euclidean rhythms - distribute N hits across M beats
s("bd(3,8)")           // 3 kicks in 8 beats
s("bd(3,8,2)")         // offset by 2
s("bd(5,8), hh(7,16)") // polyrhythmic patterns

// Conditional patterns
"bd(3,8,<0 1 2>)"      // rotating offset
"<bd sd>(3,8)"         // alternating sounds
`
  },

  // Advanced Strudel techniques
  advanced: {
    chords: `
// Chord progressions
chord("C^7 Am7 Dm7 G7").voicing().s("piano")
chord("<C^7 Dm7>/2").dict('ireal').voicing()

// Arpeggios and voicings  
note("c e g").add("<0 [0,7] [0,7,12]>").s("piano")
`,

    synthesis: `
// Built-in synths
.s("sawtooth square triangle sine")
.s("sawtooth").lpf(800).adsr(".1:.1:.5:.2")

// FM synthesis
.fm(4).fmh(1.5)        // FM modulation

// Wavetables (samples starting with wt_)
.s("wt_flute").loopBegin("<0 .25 .5>")

// ZZFX synth
.s("z_sawtooth").attack(.01).decay(.1).curve(1)
`,

    sampling: `
// Sample manipulation
.begin("<0 .25 .5>")    // start point in sample
.end("<1 .75 .5>")      // end point  
.speed("<1 2 -1>")      // playback speed
.chop(8)                // granular chopping
.slice(8, "0 1 2 3")    // slice and sequence
.loopAt(2)              // fit to 2 cycles
.fit()                  // fit to event duration
`
  },

  // Common live coding patterns
  livePatterns: {
    drums: `
// House beat
s("bd*4, [~ cp]*2, hh*8").bank("RolandTR909")

// Breakbeat
s("bd sd, hh*16").fast(1.5).sometimes(rev)

// Minimal techno
s("bd ~ ~ ~, ~ ~ sd ~, hh ~ hh ~")

// Complex polyrhythm
s("bd(3,8), sd(5,16), hh(7,32)").bank("RolandTR808")
`,

    bass: `
// Acid bassline
note("<c2 c3>*4 [bb1 bb2]*4").s("sawtooth")
.lpf(sine.range(200,1000).fast(4)).lpq(10)

// Sub bass
note("c1 ~ eb1 ~").s("sine").room(.2)

// Funky bass
note("c2 [~ c2] eb2 [f2 ~]").s("sawtooth").clip(.8)
`,

    melodies: `
// Pentatonic melody
n("0 2 4 <[6,8] [7,9]>").scale("C4:minor:pentatonic").s("piano")

// Arpeggiated chords  
note("c e g c5").ply("<1 2 4>").s("piano").room(.3)

// Lead synth
note("c4 eb4 f4 g4").s("sawtooth").lpf(2000).delay(.125)
.sometimes(add(12)).room(.4)
`
  },

  // Performance techniques
  performance: {
    transitions: `
// Gradual changes
.lpf(sine.range(200,2000).slow(8))  // slow filter sweep
.gain(sine.range(.5,1).fast(16))    // tremolo effect

// Conditional modifications
.sometimes(fast(2))      // occasional speedup
.often(rev)             // frequent reversal  
.rarely(add(12))        // rare octave jump

// Build-ups and breakdowns
.mask("<1 1 1 0>/4")    // pattern masking
.degradeBy(.25)         // random dropouts
`,

    liveControls: `
// Real-time control
all(gain(.5))           // affect all patterns
hush()                  // stop everything  
panic()                 // emergency stop

// Crossfading
xfade(s("bd*4"), .5, s("hh*8"))

// Global effects
all(x=>x.room(.5))      // add reverb to everything
all(x=>x.lpf(1000))     // filter everything
`
  },

  // Integration examples
  integration: {
    hydraVisuals: `
// Strudel + Hydra integration
await initHydra({feedStrudel:1})

// Use Strudel patterns in Hydra
src(s0).kaleid(H("<4 5 6>"))
.diff(osc(1,0.5,5))
.modulateScale(osc(2,-0.25,1))
.out()

// Audio-reactive visuals
osc().modulate(s0).out()
`,

    midiOut: `
// MIDI output to external gear
note("c e g b").midi('IAC Driver')
ccv(sine.slow(4)).ccn(74).midi()  // control change

// Program changes
progNum("<0 1 2>").midi()
`
  }
};

export const strudelTips = {
  performance: [
    "Use Ctrl+Enter to evaluate code",
    "Use Ctrl+. to stop playback", 
    "Start simple and build complexity gradually",
    "Use .sometimes(), .often(), .rarely() for variation",
    "Layer patterns with $: for polyphonic music",
    "Use scales to keep everything in key",
    "Euclidean rhythms create interesting polyrhythms",
    "Filter sweeps and delays add movement",
    "Use .jux() for instant stereo effects"
  ],
  
  troubleshooting: [
    "If no sound: check if Web Audio is enabled",
    "If patterns don't sync: use <> brackets for timing",
    "If too fast: use .slow() or longer patterns", 
    "If too repetitive: add .sometimes() variations",
    "If muddy mix: use different frequency ranges",
    "If clipping: reduce .gain() or use compression"
  ],

  workflow: [
    "Start with drums, add bass, then melody",
    "Build patterns incrementally", 
    "Use comments to organize sections",
    "Save snapshots of good patterns",
    "Experiment with small changes",
    "Listen to how patterns interact",
    "Use visual feedback when available"
  ]
};

// Generate context-aware Strudel code suggestions
export function generateStrudelSuggestion(description: string, context: string = ""): string {
  // This would be enhanced with more sophisticated matching
  const keywords = description.toLowerCase();
  
  if (keywords.includes('drum') || keywords.includes('beat')) {
    return `// ${description}
s("bd*4, [~ sd]*2, hh*8")
.bank("RolandTR909")
.room(.2).gain(.8)`;
  }
  
  if (keywords.includes('bass')) {
    return `// ${description}  
note("<c2 c3>*4 [bb1 bb2]*4")
.s("sawtooth").lpf(800)
.decay(.1).room(.3)`;
  }
  
  if (keywords.includes('melody') || keywords.includes('lead')) {
    return `// ${description}
n("0 2 4 <[6,8] [7,9]>")
.scale("C4:minor").s("piano")
.delay(.125).room(.4)`;
  }
  
  if (keywords.includes('ambient') || keywords.includes('pad')) {
    return `// ${description}
note("c3 eb3 g3 bb3").s("sawtooth")
.lpf(sine.range(400,1200).slow(8))
.room(1).attack(2).release(3)`;
  }
  
  // Default pattern
  return `// ${description}
s("bd ~ sd ~, hh*4")
.room(.3).gain(.7)`;
}