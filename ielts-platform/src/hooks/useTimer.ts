"use client";

import { useEffect, useCallback, useRef } from "react";
import { useExamStore } from "@/stores/examStore";

interface UseTimerOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onTimeout?: () => void;
}

export function useTimer({ initialSeconds, autoStart = false, onTimeout }: UseTimerOptions) {
  const { timeRemaining, isTimerRunning, setTimeRemaining, startTimer, stopTimer } = useExamStore();
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Initialize timer
  useEffect(() => {
    setTimeRemaining(initialSeconds);
    if (autoStart) {
      startTimer();
    }
    return () => {
      stopTimer();
    };
  }, [initialSeconds, autoStart, setTimeRemaining, startTimer, stopTimer]);

  // Handle timeout
  useEffect(() => {
    if (timeRemaining <= 0 && isTimerRunning) {
      stopTimer();
      onTimeoutRef.current?.();
    }
  }, [timeRemaining, isTimerRunning, stopTimer]);

  const pause = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const resume = useCallback(() => {
    if (timeRemaining > 0) {
      startTimer();
    }
  }, [timeRemaining, startTimer]);

  const reset = useCallback((seconds?: number) => {
    stopTimer();
    setTimeRemaining(seconds || initialSeconds);
  }, [initialSeconds, stopTimer, setTimeRemaining]);

  return {
    timeRemaining,
    isRunning: isTimerRunning,
    start: startTimer,
    pause,
    resume,
    reset,
    stop: stopTimer,
  };
}
