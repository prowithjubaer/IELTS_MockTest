import { create } from "zustand";
import { AutosaveData } from "@/types";

type ExamFontSize = "small" | "medium" | "large";

interface ExamState {
  // Timer
  timeRemaining: number;
  isTimerRunning: boolean;
  timerInterval: NodeJS.Timeout | null;

  // Navigation
  currentSection: number;
  currentQuestion: number;
  totalQuestions: number;

  // Answers
  responses: Record<string, string>;
  flaggedQuestions: Set<number>;

  // UI State
  fontSize: ExamFontSize;
  isFullscreen: boolean;
  showInstructions: boolean;
  showSubmitModal: boolean;
  showExitModal: boolean;
  showTimeoutModal: boolean;

  // Autosave
  autosaveStatus: "idle" | "saving" | "saved" | "error" | "offline";
  lastSavedAt: string | null;

  // Actions
  setTimeRemaining: (time: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  setCurrentSection: (section: number) => void;
  setCurrentQuestion: (question: number) => void;
  setTotalQuestions: (total: number) => void;
  setResponse: (questionId: string, answer: string) => void;
  toggleFlag: (questionNumber: number) => void;
  setFontSize: (size: ExamFontSize) => void;
  toggleFullscreen: () => void;
  setShowInstructions: (show: boolean) => void;
  setShowSubmitModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  setShowTimeoutModal: (show: boolean) => void;
  setAutosaveStatus: (status: "idle" | "saving" | "saved" | "error" | "offline") => void;
  getAutosaveData: (attemptId: string) => AutosaveData;
  loadAutosaveData: (data: AutosaveData) => void;
  resetExam: () => void;
  getAnsweredCount: () => number;
  getUnansweredCount: () => number;
}

export const useExamStore = create<ExamState>((set, get) => ({
  // Timer
  timeRemaining: 0,
  isTimerRunning: false,
  timerInterval: null,

  // Navigation
  currentSection: 0,
  currentQuestion: 1,
  totalQuestions: 40,

  // Answers
  responses: {},
  flaggedQuestions: new Set(),

  // UI State
  fontSize: "medium",
  isFullscreen: false,
  showInstructions: false,
  showSubmitModal: false,
  showExitModal: false,
  showTimeoutModal: false,

  // Autosave
  autosaveStatus: "idle",
  lastSavedAt: null,

  // Actions
  setTimeRemaining: (time) => set({ timeRemaining: time }),

  startTimer: () => {
    const interval = setInterval(() => {
      get().tick();
    }, 1000);
    set({ isTimerRunning: true, timerInterval: interval });
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ isTimerRunning: false, timerInterval: null });
  },

  tick: () => {
    const { timeRemaining } = get();
    if (timeRemaining <= 0) {
      get().stopTimer();
      set({ showTimeoutModal: true });
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  setCurrentSection: (section) => set({ currentSection: section }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setTotalQuestions: (total) => set({ totalQuestions: total }),

  setResponse: (questionId, answer) => {
    const { responses } = get();
    set({ responses: { ...responses, [questionId]: answer } });
  },

  toggleFlag: (questionNumber) => {
    const { flaggedQuestions } = get();
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionNumber)) {
      newFlagged.delete(questionNumber);
    } else {
      newFlagged.add(questionNumber);
    }
    set({ flaggedQuestions: newFlagged });
  },

  setFontSize: (fontSize) => set({ fontSize }),
  toggleFullscreen: () => set({ isFullscreen: !get().isFullscreen }),
  setShowInstructions: (show) => set({ showInstructions: show }),
  setShowSubmitModal: (show) => set({ showSubmitModal: show }),
  setShowExitModal: (show) => set({ showExitModal: show }),
  setShowTimeoutModal: (show) => set({ showTimeoutModal: show }),

  setAutosaveStatus: (autosaveStatus) =>
    set({ autosaveStatus, lastSavedAt: autosaveStatus === "saved" ? new Date().toISOString() : get().lastSavedAt }),

  getAutosaveData: (attemptId) => {
    const { responses, currentQuestion, currentSection } = get();
    return {
      attempt_id: attemptId,
      responses,
      current_question: currentQuestion,
      current_section: String(currentSection),
      saved_at: new Date().toISOString(),
      synced: true,
    };
  },

  loadAutosaveData: (data) => {
    set({
      responses: data.responses,
      currentQuestion: data.current_question,
      currentSection: Number(data.current_section),
    });
  },

  resetExam: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({
      timeRemaining: 0,
      isTimerRunning: false,
      timerInterval: null,
      currentSection: 0,
      currentQuestion: 1,
      responses: {},
      flaggedQuestions: new Set(),
      fontSize: "medium",
      isFullscreen: false,
      showInstructions: false,
      showSubmitModal: false,
      showExitModal: false,
      showTimeoutModal: false,
      autosaveStatus: "idle",
      lastSavedAt: null,
    });
  },

  getAnsweredCount: () => {
    return Object.keys(get().responses).filter((k) => get().responses[k].trim() !== "").length;
  },

  getUnansweredCount: () => {
    const { totalQuestions } = get();
    return totalQuestions - get().getAnsweredCount();
  },
}));
