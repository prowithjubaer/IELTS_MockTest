"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/stores/examStore";
import { Question, QuestionGroup, AnswerInputType } from "@/types";
import { Flag } from "lucide-react";

interface QuestionRendererProps {
  group: QuestionGroup;
  questions: Question[];
  className?: string;
}

export function QuestionRenderer({ group, questions, className }: QuestionRendererProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Group Instructions */}
      {group.instructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">{group.instructions}</p>
        </div>
      )}

      {/* Group Image */}
      {group.image_url && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <img src={group.image_url} alt="Question context" className="max-w-full h-auto" />
        </div>
      )}

      {/* Context Text */}
      {group.context_text && (
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {group.context_text}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <SingleQuestion key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

interface SingleQuestionProps {
  question: Question;
}

function SingleQuestion({ question }: SingleQuestionProps) {
  const { responses, setResponse, flaggedQuestions, toggleFlag, currentQuestion, setCurrentQuestion } = useExamStore();
  const answer = responses[`q${question.question_number}`] || "";
  const isFlagged = flaggedQuestions.has(question.question_number);
  const isCurrent = currentQuestion === question.question_number;

  const handleAnswerChange = (value: string) => {
    setResponse(`q${question.question_number}`, value);
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all",
        isCurrent ? "border-brand-navy-300 bg-brand-navy-50/30" : "border-gray-100 bg-white",
        isFlagged && "ring-2 ring-warning-500/20"
      )}
      onClick={() => setCurrentQuestion(question.question_number)}
    >
      <div className="flex items-start gap-3">
        {/* Question Number */}
        <span className="flex-shrink-0 w-7 h-7 bg-brand-navy-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {question.question_number}
        </span>

        <div className="flex-1 min-w-0">
          {/* Question Text */}
          {question.question_text && (
            <p className="text-sm text-gray-800 mb-3 font-medium">{question.question_text}</p>
          )}

          {/* Answer Input */}
          <AnswerInput
            type={question.input_type}
            value={answer}
            onChange={handleAnswerChange}
            options={question.options}
            wordLimit={question.word_limit}
          />
        </div>

        {/* Flag Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFlag(question.question_number);
          }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isFlagged ? "bg-warning-500 text-white" : "hover:bg-gray-100 text-gray-400"
          )}
          title={isFlagged ? "Remove flag" : "Flag for review"}
        >
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface AnswerInputProps {
  type: AnswerInputType;
  value: string;
  onChange: (value: string) => void;
  options?: { id: string; label: string; value: string }[];
  wordLimit?: number;
}

function AnswerInput({ type, value, onChange, options, wordLimit }: AnswerInputProps) {
  switch (type) {
    case "text":
      return (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none transition-all"
            placeholder="Type your answer..."
          />
          {wordLimit && (
            <p className="text-xs text-gray-400 mt-1">Write no more than {wordLimit} words</p>
          )}
        </div>
      );

    case "number":
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none transition-all"
          placeholder="0"
        />
      );

    case "radio":
      return (
        <div className="space-y-2">
          {options?.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                value === option.value
                  ? "border-brand-navy-500 bg-brand-navy-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <input
                type="radio"
                name={`option-${option.id}`}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-brand-navy-900 focus:ring-brand-navy-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {options?.map((option) => {
            const selectedValues = value ? value.split(",") : [];
            const isChecked = selectedValues.includes(option.value);
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  isChecked
                    ? "border-brand-navy-500 bg-brand-navy-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => {
                    let newValues = [...selectedValues];
                    if (e.target.checked) {
                      newValues.push(option.value);
                    } else {
                      newValues = newValues.filter((v) => v !== option.value);
                    }
                    onChange(newValues.join(","));
                  }}
                  className="w-4 h-4 text-brand-navy-900 focus:ring-brand-navy-500 rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            );
          })}
        </div>
      );

    case "dropdown":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none transition-all bg-white"
        >
          <option value="">Select an answer...</option>
          {options?.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none transition-all"
          placeholder="Type your answer..."
        />
      );
  }
}
