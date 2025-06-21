import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@shared/schema";

interface ChatPanelProps {
  projectId: number | null;
}

export function ChatPanel({ projectId }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/projects", projectId, "chat"],
    enabled: !!projectId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/projects/${projectId}/chat`, {
        role: "user",
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "chat"] });
      setMessage("");
    },
  });

  const handleSendMessage = () => {
    if (message.trim() && projectId) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="text-slate-500 text-3xl mb-3">🤖</div>
          <p className="text-slate-400 text-sm font-mono">SELECT PROJECT TO CHAT</p>
          <p className="text-slate-500 text-xs mt-1 font-mono">AI assistant will help with Strudel patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-mono text-lg">AI</span>
              </div>
              <p className="text-green-300 text-sm mb-1 font-mono">STRUDEL AI READY</p>
              <p className="text-green-500 text-xs font-mono">Ask about patterns, samples, or performance tips</p>
            </div>
          )}
          
          {messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user" 
                  ? "bg-orange-600" 
                  : "bg-green-600"
              }`}>
                <span className="text-white text-sm font-mono">
                  {msg.role === "user" ? "U" : "AI"}
                </span>
              </div>
              <div className="flex-1">
                <div className={`rounded-lg p-3 font-mono text-sm ${
                  msg.role === "user"
                    ? "bg-orange-900/20 border border-orange-700/30 text-orange-200"
                    : "bg-green-900/20 border border-green-700/30 text-green-200"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-xs text-cyan-500 mt-1 block font-mono">
                  {formatTimestamp(msg.createdAt!)}
                </span>
              </div>
            </div>
          ))}
          
          {sendMessageMutation.isPending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-strudel-primary rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <div className="bg-strudel-surface-light rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-strudel-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-strudel-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-strudel-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-xs text-slate-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-strudel-surface-light">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about Strudel patterns..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
            className="flex-1 bg-black/50 border-cyan-700 text-cyan-200 placeholder-cyan-500 focus:ring-cyan-400 focus:border-cyan-400 font-mono text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-mono text-sm"
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
}
