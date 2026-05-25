"use client";

import { useEffect, useRef, useCallback } from "react";
import { useExamStore } from "@/stores/examStore";

interface UseAutosaveOptions {
  attemptId: string;
  interval?: number; // milliseconds
  onSave?: (data: Record<string, string>) => Promise<void>;
  enabled?: boolean;
}

export function useAutosave({ attemptId, interval = 5000, onSave, enabled = true }: UseAutosaveOptions) {
  const { responses, setAutosaveStatus } = useExamStore();
  const lastSavedRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveToLocal = useCallback(() => {
    try {
      const data = {
        attempt_id: attemptId,
        responses,
        saved_at: new Date().toISOString(),
      };
      localStorage.setItem(`autosave_${attemptId}`, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }, [attemptId, responses]);

  const saveToServer = useCallback(async () => {
    const currentState = JSON.stringify(responses);

    // Skip if no changes
    if (currentState === lastSavedRef.current) return;

    setAutosaveStatus("saving");

    try {
      // Save to localStorage first (offline backup)
      saveToLocal();

      // Save to server if callback provided
      if (onSave) {
        await onSave(responses);
      }

      lastSavedRef.current = currentState;
      setAutosaveStatus("saved");
    } catch {
      setAutosaveStatus("error");
      // Keep local copy as backup
      saveToLocal();
    }
  }, [responses, onSave, setAutosaveStatus, saveToLocal]);

  // Set up interval
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(saveToServer, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, saveToServer]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveToLocal();
    };
  }, [saveToLocal]);

  // Restore from local storage
  const restore = useCallback(() => {
    try {
      const saved = localStorage.getItem(`autosave_${attemptId}`);
      if (saved) {
        const data = JSON.parse(saved);
        return data.responses as Record<string, string>;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }, [attemptId]);

  // Clear local storage
  const clear = useCallback(() => {
    localStorage.removeItem(`autosave_${attemptId}`);
  }, [attemptId]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setAutosaveStatus("saved");
    const handleOffline = () => setAutosaveStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setAutosaveStatus]);

  return { saveToServer, saveToLocal, restore, clear };
}
