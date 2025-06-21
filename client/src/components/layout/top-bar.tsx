import { PerformanceControls } from "@/components/controls/performance-controls";
import type { Project } from "@shared/schema";

interface TopBarProps {
  currentProject?: Project;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStop: () => void;
  isStudioMode: boolean;
  onStudioModeToggle: () => void;
  isAutoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  onGenerateRandomBeat: () => void;
}

export function TopBar({ 
  currentProject, 
  isPlaying, 
  onPlayToggle, 
  onStop, 
  isStudioMode, 
  onStudioModeToggle,
  isAutoSaveEnabled,
  onToggleAutoSave,
  onGenerateRandomBeat
}: TopBarProps) {
  return (
    <div className="h-16 bg-strudel-surface border-b border-strudel-surface-light flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-300">Current Project:</span>
            <span className="text-sm font-semibold text-slate-100">
              {currentProject?.name || "Welcome Playground"}
            </span>
          </div>
          <button 
            onClick={onToggleAutoSave}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-strudel-surface-light"
          >
            <div className={`w-2 h-2 rounded-full ${isAutoSaveEnabled ? 'bg-strudel-accent' : 'bg-slate-500'}`}></div>
            <span className={isAutoSaveEnabled ? 'strudel-accent' : 'text-slate-500'}>
              Auto-save {isAutoSaveEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
          <button 
            onClick={onGenerateRandomBeat}
            className="px-3 py-1 bg-strudel-warning hover:bg-strudel-warning/80 text-white text-xs rounded-lg transition-colors"
          >
            Generate Beat
          </button>
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
