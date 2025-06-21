import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@shared/schema";

interface ChatPanelProps {
  currentProjectId: number | null;
}

export function ChatPanel({ currentProjectId }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/projects", currentProjectId, "chat"],
    enabled: !!currentProjectId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/projects/${currentProjectId}/chat`, {
        role: "user",
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", currentProjectId, "chat"] });
      setMessage("");
    },
  });

  const handleSendMessage = () => {
    if (message.trim() && currentProjectId) {
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

  if (!currentProjectId) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <i className="fas fa-robot text-slate-500 text-3xl mb-3"></i>
          <p className="text-slate-400 text-sm">Select a project to start chatting</p>
          <p className="text-slate-500 text-xs mt-1">AI assistant will help with your Strudel patterns</p>
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
              <div className="w-12 h-12 bg-strudel-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-robot text-white"></i>
              </div>
              <p className="text-slate-300 text-sm mb-1">AI Assistant Ready</p>
              <p className="text-slate-500 text-xs">Ask me anything about Strudel patterns, samples, or performance tips!</p>
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
                  ? "bg-strudel-accent" 
                  : "bg-strudel-primary"
              }`}>
                <i className={`fas ${msg.role === "user" ? "fa-user" : "fa-robot"} text-white text-sm`}></i>
              </div>
              <div className="flex-1">
                <div className={`rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-strudel-accent/20 border border-strudel-accent/30"
                    : "bg-strudel-surface-light"
                }`}>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
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
            placeholder="Ask me anything about Strudel..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
            className="flex-1 bg-strudel-surface-light border-strudel-surface-light text-slate-200 placeholder-slate-400 focus:ring-strudel-primary focus:border-transparent"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-strudel-primary hover:bg-strudel-primary/80 text-white"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
