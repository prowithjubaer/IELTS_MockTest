"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400",
              error
                ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                : "border-gray-200 focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showWordCount?: boolean;
  wordCount?: number;
  minWords?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showWordCount, wordCount = 0, minWords, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-y min-h-[120px]",
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500"
              : "border-gray-200 focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500",
            className
          )}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          <div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
          </div>
          {showWordCount && (
            <p className={cn("text-sm", wordCount < (minWords || 0) ? "text-orange-500" : "text-gray-500")}>
              {wordCount} words{minWords ? ` / ${minWords} min` : ""}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
