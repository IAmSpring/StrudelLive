import { useEffect, useState } from "react";

interface PatternVisualizerProps {
  isPlaying: boolean;
  code: string;
  className?: string;
}

interface PatternLayer {
  name: string;
  pattern: boolean[];
  color: string;
}

export function PatternVisualizer({ isPlaying, code, className = "" }: PatternVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [layers, setLayers] = useState<PatternLayer[]>([]);

  // Parse Strudel code to extract patterns
  useEffect(() => {
    const extractedLayers: PatternLayer[] = [];
    
    // Extract drum patterns from code
    const drumsMatch = code.match(/s\("([^"]+)"\)/g);
    if (drumsMatch) {
      drumsMatch.forEach((match, index) => {
        const pattern = match.match(/s\("([^"]+)"\)/)?.[1] || "";
        const steps = parsePattern(pattern);
        const colors = ['#06b6d4', '#f97316', '#eab308', '#10b981', '#8b5cf6'];
        
        extractedLayers.push({
          name: getPatternName(pattern, index),
          pattern: steps,
          color: colors[index % colors.length]
        });
      });
    }

    // Add bass patterns
    const bassMatch = code.match(/note\("([^"]+)"\)/g);
    if (bassMatch) {
      bassMatch.forEach((match, index) => {
        const pattern = match.match(/note\("([^"]+)"\)/)?.[1] || "";
        const steps = parseNotePattern(pattern);
        
        extractedLayers.push({
          name: `BASS ${index + 1}`,
          pattern: steps,
          color: '#dc2626'
        });
      });
    }

    // Fallback patterns if no code
    if (extractedLayers.length === 0) {
      extractedLayers.push(
        { name: 'KICK', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], color: '#06b6d4' },
        { name: 'SNARE', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], color: '#f97316' },
        { name: 'HIHAT', pattern: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true], color: '#eab308' }
      );
    }

    setLayers(extractedLayers);
  }, [code]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 16);
    }, 120); // ~125 BPM

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Reset step when stopped
  useEffect(() => {
    if (!isPlaying) {
      setCurrentStep(0);
    }
  }, [isPlaying]);

  const parsePattern = (pattern: string): boolean[] => {
    const steps = Array(16).fill(false);
    const parts = pattern.split(/[,\s]+/).filter(p => p.trim());
    
    parts.forEach((part, index) => {
      if (part.includes('*')) {
        const [sound, mult] = part.split('*');
        const multiplier = parseInt(mult) || 1;
        for (let i = 0; i < 16; i += Math.floor(16 / multiplier)) {
          if (i < 16) steps[i] = true;
        }
      } else if (part !== '~' && part.trim()) {
        steps[index % 16] = true;
      }
    });
    
    return steps;
  };

  const parseNotePattern = (pattern: string): boolean[] => {
    const steps = Array(16).fill(false);
    const notes = pattern.split(/\s+/).filter(n => n.trim());
    
    notes.forEach((note, index) => {
      if (note !== '~' && note.trim()) {
        steps[index % 16] = true;
      }
    });
    
    return steps;
  };

  const getPatternName = (pattern: string, index: number): string => {
    if (pattern.includes('bd')) return 'KICK';
    if (pattern.includes('sd')) return 'SNARE';
    if (pattern.includes('hh')) return 'HIHAT';
    if (pattern.includes('cp')) return 'CLAP';
    if (pattern.includes('oh')) return 'OPENHAT';
    return `LAYER ${index + 1}`;
  };

  return (
    <div className={`bg-black rounded border border-cyan-700/30 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-cyan-300 text-xs font-mono font-semibold">PATTERN GRID</span>
        <div className="flex items-center gap-2">
          <span className="text-cyan-500 text-xs font-mono">
            STEP: {String(currentStep + 1).padStart(2, '0')}/16
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex} className="flex items-center gap-2">
            <div className="w-12 text-right">
              <span className="text-xs font-mono font-semibold" style={{ color: layer.color }}>
                {layer.name}
              </span>
            </div>
            <div className="flex gap-1">
              {layer.pattern.map((active, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`w-3 h-3 rounded-sm border transition-all duration-75 ${
                    stepIndex === currentStep && isPlaying
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-gray-600'
                  } ${
                    active
                      ? stepIndex === currentStep && isPlaying
                        ? 'shadow-lg'
                        : ''
                      : 'opacity-30'
                  }`}
                  style={{
                    backgroundColor: active ? layer.color : 'transparent',
                    boxShadow: stepIndex === currentStep && isPlaying && active 
                      ? `0 0 8px ${layer.color}` 
                      : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Beat indicator */}
      <div className="flex justify-between mt-3 pt-2 border-t border-cyan-700/30">
        <div className="flex gap-1">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                Math.floor(currentStep / 4) === i && isPlaying
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-cyan-500 text-xs font-mono">
          {isPlaying ? 'PLAYING' : 'STOPPED'}
        </span>
      </div>
    </div>
  );
}