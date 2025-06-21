// Audio utilities for Strudel integration and Web Audio API

export interface AudioConfig {
  sampleRate: number;
  bufferSize: number;
  latency: number;
  masterVolume: number;
}

export interface Sample {
  name: string;
  buffer: AudioBuffer;
  duration: number;
}

export class StrudelAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private samples: Map<string, Sample> = new Map();
  private scheduledEvents: number[] = [];

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required by browsers for user interaction)
      if (this.audioContext.state === 'suspended') {
        console.log("Audio context suspended, will resume on user interaction");
      }
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7;
      
      console.log("Audio context initialized:", this.audioContext.state);
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      throw new Error("Audio initialization failed");
    }
  }

  async loadSample(name: string, url: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized");
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.samples.set(name, {
        name,
        buffer: audioBuffer,
        duration: audioBuffer.duration * 1000 // Convert to milliseconds
      });
    } catch (error) {
      console.error(`Failed to load sample ${name}:`, error);
      throw new Error(`Sample loading failed: ${name}`);
    }
  }

  playSample(name: string, time: number = 0, gain: number = 1): void {
    if (!this.audioContext || !this.masterGain) {
      console.warn("Audio context not ready");
      return;
    }

    const sample = this.samples.get(name);
    if (!sample) {
      console.warn(`Sample not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = sample.buffer;
    gainNode.gain.value = gain;
    
    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    const playTime = time === 0 ? this.audioContext.currentTime : time;
    source.start(playTime);
  }

  async start(): Promise<void> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized");
    }

    if (this.audioContext.state === "suspended") {
      console.log("Resuming suspended audio context...");
      await this.audioContext.resume();
    }

    this.isPlaying = true;
    console.log("Audio engine started, context state:", this.audioContext.state);
    
    // Play a test tone to verify audio is working
    this.playTestTone();
  }

  stop(): void {
    this.isPlaying = false;
    this.clearScheduledEvents();
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getMasterVolume(): number {
    return this.masterGain?.gain.value || 0;
  }

  getCurrentTime(): number {
    return this.audioContext?.currentTime || 0;
  }

  getLatency(): number {
    if (!this.audioContext) return 0;
    
    // Estimate latency based on buffer size and sample rate
    const baseLatency = this.audioContext.baseLatency || 0;
    const outputLatency = this.audioContext.outputLatency || 0;
    return Math.round((baseLatency + outputLatency) * 1000); // Convert to milliseconds
  }

  getCPUUsage(): number {
    // This is a simplified estimation - in a real implementation,
    // you might use AudioWorklet or other methods to measure actual CPU usage
    const activeVoices = this.scheduledEvents.length;
    const sampleCount = this.samples.size;
    return Math.min(Math.round((activeVoices * 2 + sampleCount * 0.5) * 5), 100);
  }

  private clearScheduledEvents(): void {
    this.scheduledEvents.forEach(eventId => {
      clearTimeout(eventId);
    });
    this.scheduledEvents = [];
  }

  // Strudel pattern evaluation methods
  async evaluatePattern(code: string): Promise<void> {
    try {
      // This is where Strudel core would be integrated
      // For now, we'll simulate pattern evaluation
      console.log("Evaluating Strudel pattern:", code);
      
      // Clear previous pattern
      this.clearScheduledEvents();
      
      // Parse and schedule events (simplified)
      await this.parseAndSchedulePattern(code);
    } catch (error) {
      console.error("Pattern evaluation failed:", error);
      throw new Error(`Pattern evaluation failed: ${error}`);
    }
  }

  private async parseAndSchedulePattern(code: string): Promise<void> {
    // Simplified pattern parsing - in a real implementation,
    // this would use the full Strudel compiler/evaluator
    
    const patterns = this.extractPatterns(code);
    const bpm = 120; // Default BPM, could be extracted from code
    const stepDuration = (60 / bpm / 4) * 1000; // Quarter note in milliseconds
    
    patterns.forEach((pattern, index) => {
      this.schedulePattern(pattern, index * stepDuration);
    });
  }

  private extractPatterns(code: string): string[] {
    // Very basic pattern extraction - looks for quoted strings
    const patternRegex = /"([^"]+)"/g;
    const patterns: string[] = [];
    let match;
    
    while ((match = patternRegex.exec(code)) !== null) {
      patterns.push(match[1]);
    }
    
    return patterns;
  }

  private schedulePattern(pattern: string, startTime: number): void {
    const steps = pattern.split(/\s+/);
    const stepDuration = 250; // 250ms per step (roughly 120 BPM sixteenth notes)
    
    steps.forEach((step, index) => {
      if (step !== "~" && step !== "") {
        const eventId = window.setTimeout(() => {
          if (this.isPlaying) {
            this.playSample(step, 0, 0.7);
          }
        }, startTime + (index * stepDuration));
        
        this.scheduledEvents.push(eventId);
      }
    });
  }

  // Utility methods for common audio operations
  createLowPassFilter(frequency: number): BiquadFilterNode | null {
    if (!this.audioContext) return null;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    
    return filter;
  }

  createDelay(delayTime: number, feedback: number = 0.3): DelayNode | null {
    if (!this.audioContext) return null;
    
    const delay = this.audioContext.createDelay();
    const feedbackGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    
    return delay;
  }

  // Sample management
  getSampleNames(): string[] {
    return Array.from(this.samples.keys());
  }

  getSample(name: string): Sample | undefined {
    return this.samples.get(name);
  }

  async loadDefaultSamples(): Promise<void> {
    console.log("Loading default samples...");
    // Create synthetic samples since we don't have audio files
    const sampleNames = ["bd", "sd", "sn", "hh", "cp", "oh", "rim", "kick", "snare", "hihat"];
    sampleNames.forEach(name => this.createSyntheticSample(name));
    console.log("Default samples loaded:", Array.from(this.samples.keys()));
      { name: "hh", url: "/samples/hh.wav" },
      { name: "cp", url: "/samples/cp.wav" },
      { name: "oh", url: "/samples/oh.wav" },
    ];

    // For demo purposes, create synthetic samples if files don't exist
    for (const sample of defaultSamples) {
      try {
        await this.loadSample(sample.name, sample.url);
      } catch (error) {
        // Create synthetic sample as fallback
        this.createSyntheticSample(sample.name);
      }
    }
  }

  private createSyntheticSample(name: string): void {
    if (!this.audioContext) return;

    // Create a simple synthetic sample based on the name
    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate different waveforms based on sample name
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (name) {
        case "bd": // Bass drum - low frequency thump
          value = Math.sin(60 * 2 * Math.PI * t) * Math.exp(-t * 10);
          break;
        case "sn": // Snare - noise with envelope
          value = (Math.random() * 2 - 1) * Math.exp(-t * 15);
          break;
        case "hh": // Hi-hat - high frequency noise
          value = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.5;
          break;
        case "cp": // Clap - sharp attack
          value = (Math.random() * 2 - 1) * Math.exp(-t * 20);
          break;
        default:
          value = Math.sin(440 * 2 * Math.PI * t) * Math.exp(-t * 5);
      }

      data[i] = value * 0.3; // Reduce volume
    }

    this.samples.set(name, {
      name,
      buffer,
      duration: duration * 1000
    });
  }
}

// Global instance for easy access
export const audioEngine = new StrudelAudioEngine();

// Initialize with default samples
audioEngine.loadDefaultSamples().catch(console.error);

// Utility functions
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function bpmToMs(bpm: number, subdivision: number = 4): number {
  return (60 / bpm / subdivision) * 1000;
}

export function msToSamples(milliseconds: number, sampleRate: number): number {
  return Math.floor((milliseconds / 1000) * sampleRate);
}

export function samplesToMs(samples: number, sampleRate: number): number {
  return (samples / sampleRate) * 1000;
}

// Web Audio API feature detection
export function isWebAudioSupported(): boolean {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}

export function getAudioContextState(): string {
  if (!isWebAudioSupported()) return "unsupported";
  
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const state = context.state;
    context.close();
    return state;
  } catch (error) {
    return "error";
  }
}
