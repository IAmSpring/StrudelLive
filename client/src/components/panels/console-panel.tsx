import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ConsoleMessage {
  timestamp: string;
  level: string;
  content: string;
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
}

export function ConsolePanel({ messages }: ConsolePanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "strudel-error";
      case "warn":
      case "warning":
        return "strudel-warning";
      case "info":
        return "strudel-accent";
      case "eval":
        return "strudel-primary";
      default:
        return "text-slate-400";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "fa-exclamation-triangle";
      case "warn":
      case "warning":
        return "fa-exclamation-circle";
      case "info":
        return "fa-info-circle";
      case "eval":
        return "fa-code";
      default:
        return "fa-circle";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2 font-mono text-xs">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-terminal text-slate-500 text-2xl mb-2"></i>
              <p className="text-slate-400 text-sm">Console Output</p>
              <p className="text-slate-500 text-xs">Evaluation results and system messages will appear here</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2 group">
              <span className="text-slate-500 text-xs shrink-0">{message.timestamp}</span>
              <div className={`flex items-center space-x-1 shrink-0 ${getLevelColor(message.level)}`}>
                <i className={`fas ${getLevelIcon(message.level)} text-xs`}></i>
                <span className="font-semibold">[{message.level.toUpperCase()}]</span>
              </div>
              <span className="text-slate-300 break-all">{message.content}</span>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Console Input */}
      <div className="p-4 border-t border-strudel-surface-light">
        <div className="flex space-x-2">
          <span className="strudel-primary font-mono text-sm flex items-center">></span>
          <Input
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none text-slate-200 text-sm font-mono focus:outline-none focus:ring-0 p-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // TODO: Implement console command handling
                console.log("Console command:", e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
