import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { setupStrudelSyntax } from "@/lib/strudel-syntax";

interface MonacoEditorProps {
  code: string;
  onChange: (code: string) => void;
  onEvaluate: () => void;
  isPerformanceMode?: boolean;
}

export function MonacoEditor({ code, onChange, onEvaluate, isPerformanceMode = false }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Setup Strudel syntax highlighting
    setupStrudelSyntax();

    // Create editor
    const editor = monaco.editor.create(editorRef.current, {
      value: code,
      language: "strudel",
      theme: "strudel-dark",
      automaticLayout: true,
      fontSize: isPerformanceMode ? 18 : 14,
      lineHeight: isPerformanceMode ? 28 : 20,
      fontFamily: "JetBrains Mono, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: "gutter",
      selectionHighlight: false,
      occurrencesHighlight: false,
      roundedSelection: false,
      contextmenu: false,
      links: false,
      glyphMargin: false,
      folding: false,
      lineNumbers: "on",
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      wordWrap: "on",
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });

    editorInstanceRef.current = editor;

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onEvaluate();
    });

    editor.addCommand(monaco.KeyCode.Space, () => {
      // This will be handled by the parent component's global keyboard handler
    });

    // Cleanup
    return () => {
      editor.dispose();
    };
  }, []);

  // Update editor content when code prop changes (e.g., from WebSocket)
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getValue() !== code) {
      editorInstanceRef.current.setValue(code);
    }
  }, [code]);

  // Update font size for performance mode
  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.updateOptions({
        fontSize: isPerformanceMode ? 18 : 14,
        lineHeight: isPerformanceMode ? 28 : 20,
      });
    }
  }, [isPerformanceMode]);

  return (
    <div className="flex-1 relative">
      <div 
        ref={editorRef} 
        className={`absolute inset-0 ${isPerformanceMode ? "performance-mode" : ""}`}
      />
      
      {/* Quick Help Overlay */}
      <div className="absolute top-4 right-4 bg-strudel-surface/90 backdrop-blur-sm border border-strudel-surface-light rounded-lg p-3 text-xs text-slate-400 hidden group-hover:block">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Evaluate</span>
            <span className="font-mono">Cmd+Enter</span>
          </div>
          <div className="flex justify-between">
            <span>Play/Pause</span>
            <span className="font-mono">Space</span>
          </div>
          <div className="flex justify-between">
            <span>Auto-save</span>
            <span className="strudel-accent">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
