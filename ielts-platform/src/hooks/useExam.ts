"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useExamStore } from "@/stores/examStore";
import { useAuthStore } from "@/stores/authStore";
import { examService, type ExamTestData, type ExamResult } from "@/lib/services";
import type { TestModule, AttemptRow } from "@/types/database";
import { AUTOSAVE_INTERVAL } from "@/config/constants";

interface UseExamOptions {
  testId: string;
  module: TestModule;
  fullMockAttemptId?: string;
}

interface UseExamReturn {
  testData: ExamTestData | null;
  attempt: AttemptRow | null;
  loading: boolean;
  error: string | null;
  result: ExamResult | null;
  isSubmitting: boolean;
  startExam: () => Promise<void>;
  submitExam: (timeSpent: number) => Promise<void>;
}

export function useExam({ testId, module, fullMockAttemptId }: UseExamOptions): UseExamReturn {
  const { user } = useAuthStore();
  const { responses, currentQuestion } = useExamStore();
  const [testData, setTestData] = useState<ExamTestData | null>(null);
  const [attempt, setAttempt] = useState<AttemptRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch test data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let res;
      if (module === 'listening') {
        res = await examService.getListeningExamData(testId);
      } else if (module === 'reading') {
        res = await examService.getReadingExamData(testId);
      } else {
        // Writing/Speaking use different flow
        setLoading(false);
        return;
      }

      if (res.success && res.data) {
        setTestData(res.data);
      } else {
        setError(res.error || 'Failed to load test');
      }
      setLoading(false);
    }
    fetchData();
  }, [testId, module]);

  // Start exam
  const startExam = useCallback(async () => {
    if (!user) { setError('Not authenticated'); return; }
    const res = await examService.startExam(testId, user.id, module, fullMockAttemptId);
    if (res.success && res.data) {
      setAttempt(res.data);
      // Try to restore autosave
      const restored = await examService.restoreAutosave(res.data.id);
      if (restored.success && restored.data) {
        const { loadAutosaveData } = useExamStore.getState();
        loadAutosaveData({
          attempt_id: res.data.id,
          responses: restored.data.responses,
          current_question: restored.data.current_question,
          current_section: '0',
          saved_at: new Date().toISOString(),
          synced: true,
        });
      }
      // Start autosave interval
      autosaveRef.current = setInterval(() => {
        if (user && res.data) {
          const { responses: currentResponses, currentQuestion: cq } = useExamStore.getState();
          examService.autosave(res.data.id, user.id, currentResponses, cq);
        }
      }, AUTOSAVE_INTERVAL);
    } else {
      setError(res.error || 'Failed to start exam');
    }
  }, [user, testId, module, fullMockAttemptId]);

  // Submit exam
  const submitExam = useCallback(async (timeSpent: number) => {
    if (!attempt) return;
    setIsSubmitting(true);

    // Clear autosave
    if (autosaveRef.current) { clearInterval(autosaveRef.current); autosaveRef.current = null; }

    if (module === 'listening' || module === 'reading') {
      const res = await examService.submitAndScore(attempt.id, module, responses, timeSpent);
      if (res.success && res.data) setResult(res.data);
      else setError(res.error || 'Submission failed');
    } else if (module === 'speaking') {
      const res = await examService.submitSpeaking(attempt.id, timeSpent);
      if (res.success && res.data) setResult(res.data);
    }

    setIsSubmitting(false);
  }, [attempt, module, responses]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autosaveRef.current) clearInterval(autosaveRef.current);
    };
  }, []);

  return { testData, attempt, loading, error, result, isSubmitting, startExam, submitExam };
}
