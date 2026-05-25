"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  isSupported: boolean;
  permissionGranted: boolean;
}

interface UseMediaRecorderOptions {
  maxDuration?: number; // seconds
  onRecordingComplete?: (blob: Blob, duration: number) => void;
  onError?: (error: string) => void;
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}) {
  const { maxDuration, onRecordingComplete, onError } = options;

  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
    isSupported: typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia,
    permissionGranted: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setState(s => ({ ...s, permissionGranted: true, error: null }));
      // Stop tracks immediately - we'll request again when recording
      stream.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Microphone access denied";
      setState(s => ({ ...s, permissionGranted: false, error: msg }));
      onError?.(msg);
      return false;
    }
  }, [onError]);

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        setState(s => ({
          ...s,
          isRecording: false,
          isPaused: false,
          audioBlob: blob,
          audioUrl: url,
        }));

        onRecordingComplete?.(blob, duration);

        // Cleanup stream
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };

      recorder.onerror = () => {
        const msg = "Recording error occurred";
        setState(s => ({ ...s, isRecording: false, error: msg }));
        onError?.(msg);
      };

      recorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();

      // Duration timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setState(s => ({ ...s, duration: elapsed }));

        // Auto-stop at max duration
        if (maxDuration && elapsed >= maxDuration) {
          stopRecording();
        }
      }, 1000);

      setState(s => ({
        ...s,
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioBlob: null,
        audioUrl: null,
        error: null,
        permissionGranted: true,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start recording";
      setState(s => ({ ...s, error: msg }));
      onError?.(msg);
    }
  }, [maxDuration, onRecordingComplete, onError]);


  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setState(s => ({ ...s, isPaused: true }));
    }
  }, []);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setState(s => ({ ...s, duration: elapsed }));
      }, 1000);
      setState(s => ({ ...s, isPaused: false }));
    }
  }, []);

  /**
   * Reset state (clear recorded audio)
   */
  const reset = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    setState(s => ({
      ...s,
      audioBlob: null,
      audioUrl: null,
      duration: 0,
      error: null,
    }));
    chunksRef.current = [];
  }, [state.audioUrl]);

  /**
   * Test microphone (record short clip and play back)
   */
  const testMicrophone = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Just test permission works
      stream.getTracks().forEach(t => t.stop());
      setState(s => ({ ...s, permissionGranted: true, error: null }));
      return true;
    } catch {
      setState(s => ({ ...s, permissionGranted: false, error: "Microphone test failed" }));
      return false;
    }
  }, []);

  return {
    ...state,
    requestPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
    testMicrophone,
  };
}
