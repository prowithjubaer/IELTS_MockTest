"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/stores/examStore";
import { Flag } from "lucide-react";

interface QuestionPaletteProps {
  totalQuestions: number;
  onQuestionClick: (questionNumber: number) => void;
  className?: string;
  compact?: boolean;
}

export function QuestionPalette({
  totalQuestions,
  onQuestionClick,
  className,
  compact = false,
}: QuestionPaletteProps) {
  const { currentQuestion, responses, flaggedQuestions } = useExamStore();

  const getStatus = (num: number) => {
    if (num === currentQuestion) return "current";
    if (flaggedQuestions.has(num)) return "flagged";
    if (responses[`q${num}`] && responses[`q${num}`].trim() !== "") return "answered";
    return "unanswered";
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Questions</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-success-500" /> Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-warning-500" /> Flagged
          </span>
        </div>
      </div>

      <div className={cn("grid gap-1.5", compact ? "grid-cols-10" : "grid-cols-8")}>
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const status = getStatus(num);
          return (
            <button
              key={num}
              onClick={() => onQuestionClick(num)}
              className={cn(
                "question-palette-item relative",
                status === "current" && "question-palette-current",
                status === "answered" && "question-palette-answered",
                status === "flagged" && "question-palette-flagged",
                status === "unanswered" && "question-palette-unanswered"
              )}
            >
              {num}
              {flaggedQuestions.has(num) && (
                <Flag className="absolute -top-1 -right-1 w-2.5 h-2.5 text-warning-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
