import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  const [volume, setVolume] = useState([75]);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      {/* Playback Controls */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={onPlayToggle}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors text-lg ${
            isPlaying
              ? "bg-strudel-warning hover:bg-strudel-warning/80"
              : "bg-strudel-accent hover:bg-strudel-accent/80"
          } text-white`}
        >
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </Button>
        
        <Button
          onClick={onStop}
          className="w-10 h-10 bg-strudel-surface-light hover:bg-strudel-surface-light/80 text-slate-300 rounded-lg flex items-center justify-center transition-colors"
        >
          <i className="fas fa-stop"></i>
        </Button>
        
        <Button
          onClick={() => setIsRecording(!isRecording)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isRecording
              ? "bg-strudel-error hover:bg-strudel-error/80 text-white"
              : "bg-strudel-surface-light hover:bg-strudel-surface-light/80 text-slate-300"
          }`}
        >
          <i className={`fas ${isRecording ? "fa-stop" : "fa-circle"}`}></i>
        </Button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-1 bg-strudel-surface-light rounded-lg p-1">
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            !isStudioMode
              ? "bg-strudel-primary text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => !isStudioMode || onStudioModeToggle()}
        >
          Code
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            isStudioMode
              ? "bg-strudel-primary text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={onStudioModeToggle}
        >
          Studio
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <i className="fas fa-volume-up text-slate-400 text-sm"></i>
        <div className="w-16">
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>
        <span className="text-xs text-slate-400 w-8">{volume[0]}%</span>
      </div>
    </div>
  );
}
