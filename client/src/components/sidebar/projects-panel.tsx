import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Project } from "@shared/schema";

interface ProjectsPanelProps {
  currentProjectId: number | null;
  onProjectSelect: (projectId: number) => void;
  onCreateProject: (name: string) => void;
}

export function ProjectsPanel({ currentProjectId, onProjectSelect, onCreateProject }: ProjectsPanelProps) {
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      return apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteProject = (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const getProjectStatusColor = (project: Project) => {
    if (project.id === currentProjectId) return "strudel-accent";
    return "strudel-secondary";
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Recent Projects</h3>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-strudel-primary hover:bg-strudel-primary/80 text-white">
                <i className="fas fa-plus mr-1 text-xs"></i>
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-strudel-surface border-strudel-surface-light">
              <DialogHeader>
                <DialogTitle className="text-slate-200">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  className="bg-strudel-surface-light border-strudel-surface-light text-slate-200"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                    className="bg-strudel-primary hover:bg-strudel-primary/80"
                  >
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-strudel-surface-light text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {projects.map((project: Project) => (
            <div
              key={project.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                project.id === currentProjectId
                  ? "bg-strudel-primary/20 border border-strudel-primary/50"
                  : "bg-strudel-surface-light hover:bg-strudel-surface-light/80"
              }`}
              onClick={() => onProjectSelect(project.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-200">{project.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Modified {formatTimeAgo(project.updatedAt!)}
                  </p>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement duplicate functionality
                    }}
                  >
                    <i className="fas fa-copy text-xs"></i>
                  </button>
                  <button
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-strudel-error"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded ${getProjectStatusColor(project)} bg-opacity-20`}>
                  {project.id === currentProjectId ? "Active" : "Stored"}
                </span>
                <span className="text-xs text-slate-500">
                  {project.metadata?.duration ? `${Math.floor(project.metadata.duration / 60)}:${String(project.metadata.duration % 60).padStart(2, '0')}` : "0:00"}
                </span>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-folder-open text-slate-500 text-2xl mb-2"></i>
              <p className="text-slate-400 text-sm">No projects yet</p>
              <p className="text-slate-500 text-xs">Create your first project to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Actions */}
      <div className="p-4 border-t border-strudel-surface-light mt-auto">
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-strudel-surface-light hover:bg-strudel-surface-light/80 text-slate-300 text-sm rounded-lg transition-colors flex items-center">
            <i className="fas fa-upload mr-2"></i>
            Import Project
          </button>
          <button className="w-full px-3 py-2 bg-strudel-surface-light hover:bg-strudel-surface-light/80 text-slate-300 text-sm rounded-lg transition-colors flex items-center">
            <i className="fas fa-download mr-2"></i>
            Export Current
          </button>
        </div>
      </div>
    </div>
  );
}
