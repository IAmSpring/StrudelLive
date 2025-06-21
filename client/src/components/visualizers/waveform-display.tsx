import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface WaveformDisplayProps {
  isPlaying: boolean;
  currentCode: string;
}

export function WaveformDisplay({ isPlaying, currentCode }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    // Generate waveform data based on current code patterns
    const generateWaveformFromCode = (code: string) => {
      const patterns = code.match(/"([^"]+)"/g) || [];
      const waveform: number[] = [];
      
      patterns.forEach((pattern, patternIndex) => {
        const cleanPattern = pattern.replace(/"/g, '');
        const steps = cleanPattern.split(/\s+/);
        
        steps.forEach((step, stepIndex) => {
          if (step !== '~' && step !== '') {
            // Create waveform peaks based on sample names
            let amplitude = 0.5;
            if (step.includes('bd') || step.includes('kick')) amplitude = 0.9;
            else if (step.includes('sd') || step.includes('sn')) amplitude = 0.7;
            else if (step.includes('hh') || step.includes('hihat')) amplitude = 0.4;
            else if (step.includes('cp')) amplitude = 0.6;
            
            const sampleLength = 20; // Points per sample
            for (let i = 0; i < sampleLength; i++) {
              const envelope = Math.exp(-(i / sampleLength) * 3); // Decay envelope
              const noise = (Math.random() - 0.5) * 0.2; // Add some variation
              waveform.push((amplitude * envelope + noise) * (isPlaying ? 1 : 0.3));
            }
          } else {
            // Silent section
            for (let i = 0; i < 20; i++) {
              waveform.push(0);
            }
          }
        });
      });
      
      // Ensure we have enough data
      while (waveform.length < 400) {
        waveform.push(0);
      }
      
      return waveform.slice(0, 400); // Limit to 400 points
    };

    setWaveformData(generateWaveformFromCode(currentCode));
  }, [currentCode, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid lines
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let i = 0; i <= 8; i++) {
        const x = (width / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      if (waveformData.length === 0) return;
      
      // Draw waveform
      const centerY = height / 2;
      const maxAmplitude = height * 0.4;
      
      ctx.strokeStyle = isPlaying ? '#00ff41' : '#0066cc';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      waveformData.forEach((amplitude, index) => {
        const x = (index / waveformData.length) * width;
        const y = centerY + (amplitude * maxAmplitude);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw negative waveform (mirror)
      ctx.strokeStyle = isPlaying ? '#00cc33' : '#0055aa';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      waveformData.forEach((amplitude, index) => {
        const x = (index / waveformData.length) * width;
        const y = centerY - (amplitude * maxAmplitude);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw center line
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
    };

    const animate = () => {
      if (isPlaying) {
        // Animate waveform by shifting data
        setWaveformData(prev => {
          const shifted = [...prev.slice(1), prev[0]];
          return shifted;
        });
      }
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveformData, isPlaying]);

  return (
    <Card className="bg-black/90 border-green-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono text-green-400 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          WAVEFORM
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          className="w-full h-[120px] border border-green-900/30 rounded"
        />
      </CardContent>
    </Card>
  );
}