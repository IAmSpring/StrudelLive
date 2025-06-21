import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface PerformanceControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStop: () => void;
  isStudioMode: boolean;
  onStudioModeToggle: () => void;
}

export function PerformanceControls({
  isPlaying,
  onPlayToggle,
  onStop,
  isStudioMode,
  onStudioModeToggle,
}: PerformanceControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={onPlayToggle}
          variant={isPlaying ? "destructive" : "default"}
          size="sm"
          className="flex-1 font-mono text-sm"
        >
          {isPlaying ? (
            <>
              <Square className="h-4 w-4 mr-1" />
              STOP
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              PLAY
            </>
          )}
        </Button>
        
        <Button
          onClick={onStop}
          variant="outline"
          size="sm"
          disabled={!isPlaying}
          className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-cyan-300">MODE:</span>
        <Button
          onClick={onStudioModeToggle}
          variant={isStudioMode ? "default" : "outline"}
          size="sm"
          className={`text-xs font-mono ${isStudioMode ? 'bg-purple-600 hover:bg-purple-700' : 'border-cyan-700 text-cyan-400 hover:bg-cyan-900/30'}`}
        >
          {isStudioMode ? "STUDIO" : "CODE"}
        </Button>
      </div>
    </div>
  );
}
