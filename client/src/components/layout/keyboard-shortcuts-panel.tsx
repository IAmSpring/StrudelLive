import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeyboardShortcut {
  key: string;
  description: string;
}

interface KeyboardShortcutsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsPanel({ isVisible, onClose }: KeyboardShortcutsPanelProps) {
  if (!isVisible) return null;

  const shortcuts: KeyboardShortcut[] = [
    { key: "Space", description: "Play/Pause" },
    { key: "Shift+Space", description: "Stop" },
    { key: "Cmd+Enter", description: "Evaluate Code" },
    { key: "Cmd+S", description: "Save Project" },
    { key: "Cmd+N", description: "New Project" },
    { key: "F11", description: "Studio Mode" },
    { key: "Ctrl+↑", description: "Volume Up" },
    { key: "Ctrl+↓", description: "Volume Down" },
    { key: "Shift+?", description: "Show/Hide Shortcuts" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-96 bg-strudel-surface border-strudel-surface-light">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-200">Keyboard Shortcuts</CardTitle>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 rounded"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-slate-300 text-sm">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-strudel-surface-light text-slate-200 text-xs rounded font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-strudel-surface-light">
            <p className="text-xs text-slate-500">
              Shortcuts work when the editor is focused and not typing in input fields.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
