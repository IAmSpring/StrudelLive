// Strudel core integration layer
// This provides a bridge between our audio engine and the Strudel pattern language

export interface StrudelPattern {
  samples: string[];
  steps: number;
  bpm: number;
  gain: number;
  effects: StrudelEffect[];
}

export interface StrudelEffect {
  type: 'lpf' | 'hpf' | 'reverb' | 'delay' | 'distortion';
  params: Record<string, number>;
}

export interface StrudelFunction {
  name: string;
  params: any[];
  target?: string;
}

// Parser for basic Strudel syntax
export class StrudelParser {
  static parse(code: string): StrudelPattern {
    const pattern: StrudelPattern = {
      samples: [],
      steps: 16,
      bpm: 120,
      gain: 0.7,
      effects: []
    };

    try {
      // Extract quoted patterns
      const patternMatches = code.match(/"([^"]+)"/g);
      if (patternMatches) {
        pattern.samples = patternMatches.map(match => match.slice(1, -1));
      }

      // Extract BPM if specified
      const bpmMatch = code.match(/\.bpm\((\d+)\)/);
      if (bpmMatch) {
        pattern.bpm = parseInt(bpmMatch[1]);
      }

      // Extract gain/volume
      const gainMatch = code.match(/\.s\(([\d.]+)\)/);
      if (gainMatch) {
        pattern.gain = parseFloat(gainMatch[1]);
      }

      // Extract low-pass filter
      const lpfMatch = code.match(/\.lpf\((\d+)\)/);
      if (lpfMatch) {
        pattern.effects.push({
          type: 'lpf',
          params: { frequency: parseInt(lpfMatch[1]) }
        });
      }

      // Extract reverb
      const reverbMatch = code.match(/\.reverb\(([\d.]+)\)/);
      if (reverbMatch) {
        pattern.effects.push({
          type: 'reverb',
          params: { roomSize: parseFloat(reverbMatch[1]) }
        });
      }

      // Extract delay
      const delayMatch = code.match(/\.delay\(([\d.]+)\)/);
      if (delayMatch) {
        pattern.effects.push({
          type: 'delay',
          params: { time: parseFloat(delayMatch[1]) }
        });
      }

    } catch (error) {
      console.error("Parse error:", error);
      throw new Error(`Strudel parsing failed: ${error}`);
    }

    return pattern;
  }

  static validate(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Check for basic syntax errors
      if (code.includes('stack(') && !code.includes(')')) {
        errors.push("Unclosed 'stack(' function");
      }

      // Check for unmatched quotes
      const quotes = code.match(/"/g);
      if (quotes && quotes.length % 2 !== 0) {
        errors.push("Unmatched quotes in pattern");
      }

      // Check for valid sample names
      const patterns = code.match(/"([^"]+)"/g);
      if (patterns) {
        patterns.forEach(pattern => {
          const cleanPattern = pattern.slice(1, -1);
          const tokens = cleanPattern.split(/\s+/);
          tokens.forEach(token => {
            if (token !== '~' && token !== '' && !this.isValidSample(token)) {
              errors.push(`Unknown sample: ${token}`);
            }
          });
        });
      }

      // Check for valid function calls
      const functionCalls = code.match(/\.\w+\([^)]*\)/g);
      if (functionCalls) {
        functionCalls.forEach(call => {
          const funcName = call.match(/\.(\w+)/)?.[1];
          if (funcName && !this.isValidFunction(funcName)) {
            errors.push(`Unknown function: ${funcName}`);
          }
        });
      }

    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidSample(sample: string): boolean {
    const validSamples = [
      'bd', 'sn', 'hh', 'oh', 'cp', 'perc', 'tom', 'kick', 'snare', 'hihat',
      'piano', 'bass', 'lead', 'pad', 'pluck', 'bell', 'organ', 'string',
      'drum', 'cymbal', 'crash', 'ride', 'clap', 'rim', 'cowbell', 'block'
    ];
    return validSamples.includes(sample);
  }

  private static isValidFunction(func: string): boolean {
    const validFunctions = [
      's', 'gain', 'note', 'n', 'lpf', 'hpf', 'bpf', 'reverb', 'delay',
      'fast', 'slow', 'rev', 'iter', 'every', 'when', 'unless',
      'pan', 'room', 'size', 'crush', 'shape', 'vowel', 'speed',
      'cut', 'cutoff', 'resonance', 'attack', 'release', 'sustain', 'decay'
    ];
    return validFunctions.includes(func);
  }
}

// Pattern scheduler for live coding
export class StrudelScheduler {
  private patterns: Map<string, StrudelPattern> = new Map();
  private isRunning = false;
  private currentStep = 0;
  private stepInterval: NodeJS.Timeout | null = null;

  constructor(private audioEngine: any, private bpm: number = 120) {}

  addPattern(id: string, pattern: StrudelPattern): void {
    this.patterns.set(id, pattern);
  }

  removePattern(id: string): void {
    this.patterns.delete(id);
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentStep = 0;
    
    const stepDuration = (60 / this.bpm / 4) * 1000; // 16th notes
    
    this.stepInterval = setInterval(() => {
      this.executeStep();
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDuration);
  }

  stop(): void {
    this.isRunning = false;
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
  }

  setBPM(bpm: number): void {
    this.bpm = bpm;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  private executeStep(): void {
    this.patterns.forEach((pattern, id) => {
      pattern.samples.forEach(samplePattern => {
        const tokens = samplePattern.split(/\s+/);
        const token = tokens[this.currentStep % tokens.length];
        
        if (token && token !== '~') {
          this.audioEngine.playSample(token, 0, pattern.gain);
        }
      });
    });
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  isPlaying(): boolean {
    return this.isRunning;
  }
}

// Effects processor
export class StrudelEffects {
  private audioContext: AudioContext;
  private effectsChain: AudioNode[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  createLowPassFilter(frequency: number): BiquadFilterNode {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    return filter;
  }

  createHighPassFilter(frequency: number): BiquadFilterNode {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    return filter;
  }

  createReverb(roomSize: number = 0.3, decay: number = 2): ConvolverNode {
    const convolver = this.audioContext.createConvolver();
    const impulse = this.createReverbImpulse(roomSize, decay);
    convolver.buffer = impulse;
    return convolver;
  }

  createDelay(delayTime: number = 0.3, feedback: number = 0.3): DelayNode {
    const delay = this.audioContext.createDelay();
    const feedbackGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    
    return delay;
  }

  private createReverbImpulse(roomSize: number, decay: number): AudioBuffer {
    const length = this.audioContext.sampleRate * decay;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, roomSize);
      }
    }
    
    return impulse;
  }

  applyEffects(source: AudioNode, effects: StrudelEffect[]): AudioNode {
    let currentNode = source;
    
    effects.forEach(effect => {
      let effectNode: AudioNode;
      
      switch (effect.type) {
        case 'lpf':
          effectNode = this.createLowPassFilter(effect.params.frequency || 1000);
          break;
        case 'hpf':
          effectNode = this.createHighPassFilter(effect.params.frequency || 100);
          break;
        case 'reverb':
          effectNode = this.createReverb(effect.params.roomSize || 0.3);
          break;
        case 'delay':
          effectNode = this.createDelay(effect.params.time || 0.3);
          break;
        default:
          return;
      }
      
      currentNode.connect(effectNode);
      currentNode = effectNode;
    });
    
    return currentNode;
  }
}

// Sample library manager
export class StrudelSampleLibrary {
  private samples: Map<string, AudioBuffer> = new Map();
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async loadSample(name: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.samples.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sample ${name}:`, error);
      // Create synthetic fallback
      this.samples.set(name, this.createSyntheticSample(name));
    }
  }

  getSample(name: string): AudioBuffer | undefined {
    return this.samples.get(name);
  }

  getSampleNames(): string[] {
    return Array.from(this.samples.keys());
  }

  private createSyntheticSample(name: string): AudioBuffer {
    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (name) {
        case 'bd':
          value = Math.sin(60 * 2 * Math.PI * t) * Math.exp(-t * 10);
          break;
        case 'sn':
          value = (Math.random() * 2 - 1) * Math.exp(-t * 15);
          break;
        case 'hh':
          value = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.5;
          break;
        case 'cp':
          value = (Math.random() * 2 - 1) * Math.exp(-t * 20);
          break;
        default:
          value = Math.sin(440 * 2 * Math.PI * t) * Math.exp(-t * 5);
      }

      data[i] = value * 0.3;
    }

    return buffer;
  }
}

// Main Strudel engine integration
export class StrudelEngine {
  private scheduler: StrudelScheduler;
  private effects: StrudelEffects;
  private sampleLibrary: StrudelSampleLibrary;
  private audioContext: AudioContext;

  constructor(audioEngine: any) {
    this.audioContext = audioEngine.audioContext;
    this.scheduler = new StrudelScheduler(audioEngine);
    this.effects = new StrudelEffects(this.audioContext);
    this.sampleLibrary = new StrudelSampleLibrary(this.audioContext);
  }

  async evaluate(code: string): Promise<void> {
    const validation = StrudelParser.validate(code);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const pattern = StrudelParser.parse(code);
    this.scheduler.addPattern('main', pattern);
  }

  start(): void {
    this.scheduler.start();
  }

  stop(): void {
    this.scheduler.stop();
  }

  setBPM(bpm: number): void {
    this.scheduler.setBPM(bpm);
  }

  isPlaying(): boolean {
    return this.scheduler.isPlaying();
  }

  getCurrentStep(): number {
    return this.scheduler.getCurrentStep();
  }
}
