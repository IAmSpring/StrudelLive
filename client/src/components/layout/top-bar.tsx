import { PerformanceControls } from "@/components/controls/performance-controls";
import type { Project } from "@shared/schema";

interface TopBarProps {
  currentProject?: Project;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStop: () => void;
  isStudioMode: boolean;
  onStudioModeToggle: () => void;
}

export function TopBar({ 
  currentProject, 
  isPlaying, 
  onPlayToggle, 
  onStop, 
  isStudioMode, 
  onStudioModeToggle 
}: TopBarProps) {
  return (
    <div className="h-16 bg-strudel-surface border-b border-strudel-surface-light flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-300">Current Project:</span>
          <span className="text-sm font-semibold text-slate-100">
            {currentProject?.name || "No project selected"}
          </span>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-strudel-accent rounded-full"></div>
            <span className="strudel-accent">Auto-saved</span>
          </div>
        </div>
      </div>

      <PerformanceControls
        isPlaying={isPlaying}
        onPlayToggle={onPlayToggle}
        onStop={onStop}
        isStudioMode={isStudioMode}
        onStudioModeToggle={onStudioModeToggle}
      />
    </div>
  );
}
