import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export function useAutoSave(projectId: number | null, code: string, enabled: boolean = true) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedCodeRef = useRef<string>("");

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't auto-save if disabled, no project, or code hasn't changed
    if (!enabled || !projectId || code === lastSavedCodeRef.current) {
      return;
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        await apiRequest("POST", `/api/projects/${projectId}/autosave`, { code });
        lastSavedCodeRef.current = code;
        console.log("Auto-saved project");
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [projectId, code, enabled]);

  // Update the last saved code when project changes
  useEffect(() => {
    lastSavedCodeRef.current = code;
  }, [projectId]);
}

export function useAutoSaveToggle() {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  
  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(prev => !prev);
  };

  return { isAutoSaveEnabled, toggleAutoSave };
}
