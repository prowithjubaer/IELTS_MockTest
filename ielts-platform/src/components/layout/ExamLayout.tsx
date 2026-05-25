"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/stores/examStore";
import { Timer, Button, ConfirmModal } from "@/components/ui";
import {
  Maximize,
  Minimize,
  Settings,
  Save,
  LogOut,
  BookOpen,
  Type,
  Monitor,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface ExamLayoutProps {
  children: React.ReactNode;
  testTitle: string;
  onSubmit: () => void;
  onExit: () => void;
}

export function ExamLayout({ children, testTitle, onSubmit, onExit }: ExamLayoutProps) {
  const {
    timeRemaining,
    fontSize,
    isFullscreen,
    showSubmitModal,
    showExitModal,
    showTimeoutModal,
    autosaveStatus,
    setFontSize,
    toggleFullscreen,
    setShowSubmitModal,
    setShowExitModal,
    setShowTimeoutModal,
    getAnsweredCount,
    getUnansweredCount,
    totalQuestions,
  } = useExamStore();

  const [showSettings, setShowSettings] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    toggleFullscreen();
  };

  const AutosaveIndicator = () => {
    const statusConfig = {
      idle: { icon: <CheckCircle className="w-3.5 h-3.5" />, text: "Ready", color: "text-gray-400" },
      saving: { icon: <Save className="w-3.5 h-3.5 animate-pulse" />, text: "Saving...", color: "text-blue-500" },
      saved: { icon: <CheckCircle className="w-3.5 h-3.5" />, text: "Saved", color: "text-green-500" },
      error: { icon: <AlertCircle className="w-3.5 h-3.5" />, text: "Error", color: "text-red-500" },
      offline: { icon: <WifiOff className="w-3.5 h-3.5" />, text: "Offline", color: "text-orange-500" },
    };

    const config = statusConfig[autosaveStatus];

    return (
      <div className={cn("flex items-center gap-1.5 text-xs", config.color)}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen bg-white", `text-exam-${fontSize}`)}>
      {/* Exam Header */}
      <header className="exam-header h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-navy-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-brand-navy-900">{testTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave Status */}
          <AutosaveIndicator />

          {/* Timer */}
          <Timer seconds={timeRemaining} size="sm" />

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50">
                <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Text Size</p>
                  <div className="flex gap-2 mt-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-md transition-colors capitalize",
                          fontSize === size
                            ? "bg-brand-navy-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { setShowSettings(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  <BookOpen className="w-4 h-4" />
                  View Instructions
                </button>
                <button
                  onClick={() => { handleFullscreen(); setShowSettings(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { setShowExitModal(true); setShowSettings(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Save & Exit
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-gray-600" />
            ) : (
              <Maximize className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Submit */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
          >
            Submit
          </Button>
        </div>
      </header>

      {/* Exam Body */}
      <main className="pt-14 pb-0">{children}</main>

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => {
          setShowSubmitModal(false);
          onSubmit();
        }}
        title="Submit Test"
        message={`You have answered ${getAnsweredCount()} out of ${totalQuestions} questions. ${getUnansweredCount() > 0 ? `${getUnansweredCount()} questions are unanswered.` : ""} Are you sure you want to submit?`}
        confirmText="Submit Test"
        variant="info"
      />

      {/* Exit Confirmation Modal */}
      <ConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          onExit();
        }}
        title="Save & Exit"
        message="Your progress will be saved. You can continue this test later. Are you sure you want to exit?"
        confirmText="Save & Exit"
        variant="warning"
      />

      {/* Timeout Modal */}
      <ConfirmModal
        isOpen={showTimeoutModal}
        onClose={() => setShowTimeoutModal(false)}
        onConfirm={() => {
          setShowTimeoutModal(false);
          onSubmit();
        }}
        title="Time's Up!"
        message="Your time has expired. Your answers will be submitted automatically."
        confirmText="View Results"
        cancelText=""
        variant="danger"
      />
    </div>
  );
}
