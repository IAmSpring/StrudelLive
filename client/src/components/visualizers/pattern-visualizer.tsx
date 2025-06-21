import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface PatternVisualizerProps {
  isPlaying: boolean;
  currentCode: string;
  bpm: number;
}

interface PatternLayer {
  name: string;
  steps: boolean[];
  color: string;
  volume: number;
}

export function PatternVisualizer({ isPlaying, currentCode, bpm }: PatternVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentStep, setCurrentStep] = useState(0);
  const [patterns, setPatterns] = useState<PatternLayer[]>([]);

  useEffect(() => {
    // Parse code to extract patterns
    const parsePatterns = (code: string): PatternLayer[] => {
      const layers: PatternLayer[] = [];
      const patternRegex = /s\("([^"]+)"\)/g;
      let match;
      
      while ((match = patternRegex.exec(code)) !== null) {
        const patternStr = match[1];
        const steps = Array(16).fill(false);
        
        // Parse mini-notation pattern
        const parts = patternStr.split(/\s+/);
        parts.forEach((part, index) => {
          if (index < 16 && part !== '~' && part !== '') {
            // Handle multipliers like "bd*4"
            if (part.includes('*')) {
              const [sound, multiplier] = part.split('*');
              const count = parseInt(multiplier) || 1;
              for (let i = 0; i < count && (index + i) < 16; i++) {
                steps[index + i] = true;
              }
            } else {
              steps[index] = true;
            }
          }
        });
        
        // Determine color based on sample type
        let color = '#666';
        let name = 'UNKNOWN';
        if (patternStr.includes('bd') || patternStr.includes('kick')) {
          color = '#ff4444';
          name = 'KICK';
        } else if (patternStr.includes('sd') || patternStr.includes('sn')) {
          color = '#44ff44';
          name = 'SNARE';
        } else if (patternStr.includes('hh') || patternStr.includes('hihat')) {
          color = '#ffff44';
          name = 'HIHAT';
        } else if (patternStr.includes('cp')) {
          color = '#ff44ff';
          name = 'CLAP';
        } else if (patternStr.includes('oh')) {
          color = '#44ffff';
          name = 'OPEN HAT';
        }
        
        layers.push({
          name,
          steps,
          color,
          volume: 0.7
        });
      }
      
      return layers;
    };

    setPatterns(parsePatterns(currentCode));
  }, [currentCode]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const stepDuration = (60 / bpm / 4) * 1000; // 16th notes
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 16);
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      
      if (patterns.length === 0) {
        // Draw empty grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 16; i++) {
          const x = (i / 16) * width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        
        ctx.font = '12px monospace';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No patterns detected', width / 2, height / 2);
        return;
      }
      
      const rowHeight = height / Math.max(patterns.length, 1);
      const stepWidth = width / 16;
      
      patterns.forEach((pattern, rowIndex) => {
        const y = rowIndex * rowHeight;
        
        // Draw pattern name
        ctx.font = '10px monospace';
        ctx.fillStyle = pattern.color;
        ctx.textAlign = 'left';
        ctx.fillText(pattern.name, 4, y + 12);
        
        // Draw steps
        pattern.steps.forEach((active, stepIndex) => {
          const x = stepIndex * stepWidth;
          const isCurrentStep = stepIndex === currentStep && isPlaying;
          
          // Step background
          ctx.fillStyle = isCurrentStep ? '#333' : '#111';
          ctx.fillRect(x, y, stepWidth - 1, rowHeight - 1);
          
          // Step border
          ctx.strokeStyle = isCurrentStep ? '#fff' : '#222';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, stepWidth - 1, rowHeight - 1);
          
          // Active step indicator
          if (active) {
            ctx.fillStyle = isCurrentStep ? '#fff' : pattern.color;
            const padding = 3;
            ctx.fillRect(
              x + padding, 
              y + padding + 14, 
              stepWidth - padding * 2 - 1, 
              rowHeight - padding * 2 - 1 - 14
            );
          }
          
          // Step number
          if (rowIndex === 0) {
            ctx.font = '8px monospace';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText(
              stepIndex.toString(), 
              x + stepWidth / 2, 
              y + 10
            );
          }
        });
      });
      
      // Draw beat markers (every 4 steps)
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 16; i += 4) {
        const x = (i / 16) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [patterns, currentStep, isPlaying]);

  return (
    <Card className="bg-black/90 border-blue-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono text-blue-400 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          PATTERN GRID
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-[200px] border border-blue-900/30 rounded"
        />
      </CardContent>
    </Card>
  );
}