import { useState } from "react";
import { ProjectsPanel } from "./projects-panel";
import { ChatPanel } from "./chat-panel";
import { AIComposer } from "../ai/ai-composer";

interface SidebarProps {
  currentProjectId: number | null;
  onProjectSelect: (projectId: number) => void;
  onCreateProject: (name: string) => void;
  onCodeGenerated?: (code: string) => void;
  onPlay?: () => void;
  isPlaying?: boolean;
}

export function Sidebar({ 
  currentProjectId, 
  onProjectSelect, 
  onCreateProject,
  onCodeGenerated,
  onPlay,
  isPlaying = false
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "chat" | "composer">("projects");
  const [isStreaming] = useState(true);

  return (
    <div className="w-80 bg-strudel-surface border-r border-strudel-surface-light flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-strudel-surface-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-strudel-primary to-strudel-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-music text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-strudel-primary to-strudel-secondary bg-clip-text text-transparent">
              Strudel
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? "bg-strudel-accent animate-pulse" : "bg-slate-500"}`}></div>
              <span className={isStreaming ? "strudel-accent" : "text-slate-500"}>
                {isStreaming ? "LIVE" : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-strudel-surface-light">
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center ${
            activeTab === "projects"
              ? "bg-strudel-surface-light strudel-primary border-b-2 border-strudel-primary"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          <i className="fas fa-folder mr-2"></i>
          Projects
        </button>
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center ${
            activeTab === "chat"
              ? "bg-strudel-surface-light strudel-primary border-b-2 border-strudel-primary"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <i className="fas fa-robot mr-2"></i>
          AI Chat
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "projects" && (
          <ProjectsPanel
            currentProjectId={currentProjectId}
            onProjectSelect={onProjectSelect}
            onCreateProject={onCreateProject}
          />
        )}
        {activeTab === "chat" && (
          <ChatPanel currentProjectId={currentProjectId} />
        )}
      </div>
    </div>
  );
}
