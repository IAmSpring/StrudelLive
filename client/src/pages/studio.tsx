import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MonacoEditor } from "@/components/editor/monaco-editor";
import { SamplesPanel } from "@/components/panels/samples-panel";
import { ConsolePanel } from "@/components/panels/console-panel";
import { WaveformDisplay } from "@/components/visualizers/waveform-display";
import { PatternVisualizer } from "@/components/visualizers/pattern-visualizer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAutoSave, useAutoSaveToggle } from "@/hooks/use-auto-save";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

export default function Studio() {
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [code, setCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"samples" | "console">("samples");
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<Array<{
    timestamp: string;
    level: string;
    content: string;
  }>>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAutoSaveEnabled, toggleAutoSave } = useAutoSaveToggle();

  // Fetch projects list
  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch current project
  const { data: currentProject } = useQuery({
    queryKey: ["/api/projects", currentProjectId],
    enabled: !!currentProjectId,
  });

  // Auto-save hook
  useAutoSave(currentProjectId, code, isAutoSaveEnabled);

  // Initialize with random project if no projects exist and no current project
  useEffect(() => {
    if (projects.length === 0 && !currentProjectId && !code) {
      handleGenerateRandomBeat();
    }
  }, [projects, currentProjectId, code]);

  // Audio engine hook
  const audioEngine = useAudioEngine();

  // WebSocket hook for real-time collaboration
  useWebSocket((message) => {
    if (message.type === "code_update" && message.projectId === currentProjectId) {
      setCode(message.code);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Project> }) => {
      return apiRequest("PUT", `/api/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  // Load project code when project changes
  useEffect(() => {
    if (currentProject) {
      setCode(currentProject.code || "");
      setSelectedProject(currentProject);
    }
  }, [currentProject]);

  const handlePlayToggle = async () => {
    try {
      if (isPlaying) {
        await audioEngine.stop();
        setIsPlaying(false);
        addConsoleMessage("info", "Playback stopped");
      } else {
        await audioEngine.evaluate(code);
        await audioEngine.play();
        setIsPlaying(true);
        addConsoleMessage("info", "Playback started");
      }
    } catch (error) {
      addConsoleMessage("error", `Playback error: ${error}`);
      toast({
        title: "Playback Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleStop = async () => {
    try {
      await audioEngine.stop();
      setIsPlaying(false);
      addConsoleMessage("info", "Playback stopped");
    } catch (error) {
      addConsoleMessage("error", `Stop error: ${error}`);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    // Send code update via WebSocket for real-time collaboration
    if (currentProjectId) {
      // This would be handled by the WebSocket hook
    }
  };

  const handleCodeEvaluate = async () => {
    try {
      await audioEngine.evaluate(code);
      addConsoleMessage("eval", "Code evaluated successfully");
      
      if (isPlaying) {
        // Update playing pattern without stopping
        addConsoleMessage("info", "Pattern updated during playback");
      }
    } catch (error) {
      addConsoleMessage("error", `Evaluation error: ${error}`);
      toast({
        title: "Code Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const addConsoleMessage = (level: string, content: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleMessages(prev => [...prev, { timestamp, level, content }]);
  };

  const handleProjectSelect = (projectId: number) => {
    setCurrentProjectId(projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleCreateProject = async (name: string) => {
    try {
      const response = await apiRequest("POST", "/api/projects", {
        name,
        code: "",
        bpm: 120,
        metadata: {}
      });
      const newProject = await response.json();
      setCurrentProjectId(newProject.id);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created",
        description: `"${name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRandomBeat = async () => {
    try {
      const response = await apiRequest("POST", "/api/generate/random-beat");
      const data = await response.json();
      setCode(data.code);
      addConsoleMessage("info", "Random beat generated");
      
      // Only show toast if user actively clicked the button (not on startup)
      if (currentProjectId || projects.length > 0) {
        toast({
          title: "Beat Generated",
          description: "A random beat pattern has been created.",
        });
      }
    } catch (error) {
      // Fallback to a basic pattern if API fails
      const fallbackPattern = `// Welcome to Strudel Live Coding!
// Press Ctrl+Enter to evaluate code, Space to play/pause

stack(
  "bd ~ ~ ~",
  "~ ~ sn ~", 
  "hh hh hh hh"
).s(0.7)`;
      
      setCode(fallbackPattern);
      addConsoleMessage("info", "Loaded default pattern");
      
      if (currentProjectId || projects.length > 0) {
        addConsoleMessage("error", "Failed to generate random beat");
        toast({
          title: "Generation Failed",
          description: "Could not generate random beat. Loaded default pattern instead.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-strudel-dark">
      <Sidebar 
        currentProjectId={currentProjectId}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onCodeGenerated={setCode}
        onPlay={handlePlayToggle}
        isPlaying={isPlaying}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar
          currentProject={currentProject}
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
          onStop={handleStop}
          isStudioMode={isStudioMode}
          onStudioModeToggle={() => setIsStudioMode(!isStudioMode)}
          isAutoSaveEnabled={isAutoSaveEnabled}
          onToggleAutoSave={toggleAutoSave}
          onGenerateRandomBeat={handleGenerateRandomBeat}
        />
        
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1">
                <MonacoEditor
                  code={code}
                  onChange={handleCodeChange}
                  onEvaluate={handleCodeEvaluate}
                  isPerformanceMode={isStudioMode}
                />
              </div>
              {/* Visualizer Panel */}
              <div className="w-80 bg-black border-l border-cyan-900/50 flex flex-col">
                <div className="p-3 border-b border-cyan-900/50">
                  <h3 className="text-cyan-300 font-mono text-sm font-semibold">VISUALIZERS</h3>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  <WaveformDisplay isPlaying={isPlaying} />
                  <PatternVisualizer isPlaying={isPlaying} code={code} />
                </div>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="h-8 bg-black border-t border-cyan-900/50 flex items-center justify-between px-4 text-xs font-mono">
              <div className="flex items-center space-x-6">
                <span className="text-cyan-500">
                  BPM: <span className="text-cyan-300 font-semibold">{currentProject?.bpm || 120}</span>
                </span>
                <span className="text-cyan-500">
                  CPU: <span className="text-orange-300 font-semibold">{audioEngine.cpuUsage}%</span>
                </span>
                <span className="text-cyan-500">
                  Latency: <span className="text-green-300 font-semibold">{audioEngine.latency}ms</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">LIVE</span>
                </div>
                <span className="text-cyan-500">
                  Mode: <span className="text-purple-300 font-semibold">CODE</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Panel */}
          <div className="w-80 bg-black border-l border-cyan-900/50">
            <div className="flex border-b border-cyan-900/50">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium font-mono ${
                  rightPanelTab === "samples"
                    ? "bg-cyan-900/30 text-cyan-300 border-b-2 border-cyan-400"
                    : "text-cyan-500 hover:text-cyan-300"
                }`}
                onClick={() => setRightPanelTab("samples")}
              >
                Samples
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium font-mono ${
                  rightPanelTab === "console"
                    ? "bg-cyan-900/30 text-cyan-300 border-b-2 border-cyan-400"
                    : "text-cyan-500 hover:text-cyan-300"
                }`}
                onClick={() => setRightPanelTab("console")}
              >
                Console
              </button>
            </div>
            
            {rightPanelTab === "samples" && <SamplesPanel />}
            {rightPanelTab === "console" && <ConsolePanel messages={consoleMessages} />}
          </div>
        </div>
      </div>
      
      {/* Studio Mode Overlay */}
      {isStudioMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[90vw] h-[90vh] bg-strudel-dark rounded-2xl border border-strudel-surface-light shadow-2xl flex flex-col">
            <div className="p-6 border-b border-strudel-surface-light flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">Studio Mode</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-strudel-error rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium strudel-error">STREAMING</span>
                </div>
                <button
                  className="w-10 h-10 bg-strudel-surface-light hover:bg-strudel-surface-light/80 rounded-lg flex items-center justify-center"
                  onClick={() => setIsStudioMode(false)}
                >
                  <i className="fas fa-times text-slate-400"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 grid grid-cols-2 gap-6">
              <div className="bg-strudel-surface rounded-xl p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Visual Output</h3>
                <div className="flex-1 bg-strudel-dark rounded-lg flex items-center justify-center">
                  <div className="w-full h-64 bg-gradient-to-r from-strudel-primary/20 to-strudel-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400">Pattern Visualization</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-strudel-surface rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CPU Usage</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-strudel-surface-light rounded-full overflow-hidden">
                        <div className="h-full bg-strudel-warning rounded-full" style={{ width: `${audioEngine.cpuUsage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-200">{audioEngine.cpuUsage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Memory</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-strudel-surface-light rounded-full overflow-hidden">
                        <div className="h-full bg-strudel-primary rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-200">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Audio Latency</span>
                    <span className="text-sm font-medium strudel-accent">{audioEngine.latency}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stream Quality</span>
                    <span className="text-sm font-medium strudel-accent">1080p@60fps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
