import { useEffect, useRef } from "react";

interface WaveformDisplayProps {
  isPlaying: boolean;
  audioData?: Float32Array;
  className?: string;
}

export function WaveformDisplay({ isPlaying, audioData, className = "" }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform grid
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 2]);
      
      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Vertical grid lines
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      if (isPlaying) {
        // Generate animated waveform
        const time = Date.now() * 0.001;
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const frequency1 = 0.02;
          const frequency2 = 0.05;
          const frequency3 = 0.08;
          
          const amplitude1 = Math.sin(time * 2 + x * frequency1) * 20;
          const amplitude2 = Math.sin(time * 3 + x * frequency2) * 15;
          const amplitude3 = Math.sin(time * 5 + x * frequency3) * 10;
          
          const y = height / 2 + amplitude1 + amplitude2 + amplitude3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();

        // Add bass frequency visualization
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < width; x += 2) {
          const bassFreq = 0.01;
          const bassAmp = Math.sin(time * 1.5 + x * bassFreq) * 30;
          const y = height / 2 + bassAmp;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      } else {
        // Static waveform
        ctx.strokeStyle = '#0f4a5c';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      // Continue animation if playing
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className={`bg-black rounded border border-cyan-700/30 p-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-cyan-300 text-xs font-mono font-semibold">WAVEFORM</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-cyan-500 text-xs font-mono">
            {isPlaying ? 'PLAYING' : 'STOPPED'}
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={80}
        className="w-full h-20 rounded"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}