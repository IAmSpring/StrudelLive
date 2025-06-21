import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { audioEngine, StrudelAudioEngine } from "@/lib/audio-utils";
import { useToast } from "@/hooks/use-toast";

interface AudioEngineContextType {
  engine: StrudelAudioEngine;
  isInitialized: boolean;
  isPlaying: boolean;
  cpuUsage: number;
  latency: number;
  masterVolume: number;
  evaluate: (code: string) => Promise<void>;
  play: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (volume: number) => void;
  playSample: (sampleName: string, gain?: number) => void;
}

const AudioEngineContext = createContext<AudioEngineContextType | null>(null);

interface AudioEngineProviderProps {
  children: ReactNode;
}

export function AudioEngineProvider({ children }: AudioEngineProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [latency, setLatency] = useState(0);
  const [masterVolume, setMasterVolume] = useState(75);
  const { toast } = useToast();
  const metricsInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        await audioEngine.loadDefaultSamples();
        setIsInitialized(true);
        
        // Start metrics monitoring
        metricsInterval.current = setInterval(() => {
          setCpuUsage(audioEngine.getCPUUsage());
          setLatency(audioEngine.getLatency());
        }, 1000);
        
      } catch (error) {
        console.error("Failed to initialize audio engine:", error);
        toast({
          title: "Audio Initialization Failed",
          description: "Could not initialize the audio engine. Please check your browser's audio permissions.",
          variant: "destructive",
        });
      }
    };

    initializeEngine();

    return () => {
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
      }
    };
  }, [toast]);

  const evaluate = async (code: string): Promise<void> => {
    if (!isInitialized) {
      throw new Error("Audio engine not initialized");
    }

    try {
      await audioEngine.evaluatePattern(code);
    } catch (error) {
      console.error("Pattern evaluation failed:", error);
      throw error;
    }
  };

  const play = async (): Promise<void> => {
    if (!isInitialized) {
      throw new Error("Audio engine not initialized");
    }

    try {
      await audioEngine.start();
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback failed:", error);
      throw error;
    }
  };

  const stop = async (): Promise<void> => {
    try {
      audioEngine.stop();
      setIsPlaying(false);
    } catch (error) {
      console.error("Stop failed:", error);
      throw error;
    }
  };

  const setVolume = (volume: number): void => {
    const normalizedVolume = volume / 100;
    audioEngine.setMasterVolume(normalizedVolume);
    setMasterVolume(volume);
  };

  const playSample = (sampleName: string, gain: number = 0.7): void => {
    if (!isInitialized) return;
    audioEngine.playSample(sampleName, 0, gain);
  };

  const value: AudioEngineContextType = {
    engine: audioEngine,
    isInitialized,
    isPlaying,
    cpuUsage,
    latency,
    masterVolume,
    evaluate,
    play,
    stop,
    setVolume,
    playSample,
  };

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine(): AudioEngineContextType {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error("useAudioEngine must be used within an AudioEngineProvider");
  }
  return context;
}
