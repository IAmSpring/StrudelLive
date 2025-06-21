import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          (event.target as any)?.contentEditable === 'true') {
        return;
      }

      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatches = event.code === shortcut.key || event.key === shortcut.key;
        const ctrlMatches = !!shortcut.ctrl === event.ctrlKey || !!shortcut.ctrl === event.metaKey;
        const shiftMatches = !!shortcut.shift === event.shiftKey;
        const altMatches = !!shortcut.alt === event.altKey;
        
        return keyMatches && ctrlMatches && shiftMatches && altMatches;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return shortcuts;
}

// Predefined shortcuts for the Strudel app
export const useStrudelShortcuts = (callbacks: {
  onPlayToggle: () => void;
  onStop: () => void;
  onEvaluate: () => void;
  onSave: () => void;
  onNewProject: () => void;
  onToggleHelp: () => void;
  onStudioMode: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Space',
      callback: callbacks.onPlayToggle,
      description: 'Play/Pause'
    },
    {
      key: 'Space',
      shift: true,
      callback: callbacks.onStop,
      description: 'Stop'
    },
    {
      key: 'Enter',
      ctrl: true,
      callback: callbacks.onEvaluate,
      description: 'Evaluate Code'
    },
    {
      key: 's',
      ctrl: true,
      callback: callbacks.onSave,
      description: 'Save Project'
    },
    {
      key: 'n',
      ctrl: true,
      callback: callbacks.onNewProject,
      description: 'New Project'
    },
    {
      key: '?',
      shift: true,
      callback: callbacks.onToggleHelp,
      description: 'Show/Hide Shortcuts'
    },
    {
      key: 'F11',
      callback: callbacks.onStudioMode,
      description: 'Toggle Studio Mode'
    },
    {
      key: 'ArrowUp',
      ctrl: true,
      callback: callbacks.onVolumeUp,
      description: 'Volume Up'
    },
    {
      key: 'ArrowDown',
      ctrl: true,
      callback: callbacks.onVolumeDown,
      description: 'Volume Down'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};
