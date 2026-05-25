"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimerProps {
  seconds: number;
  isWarning?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Timer({ seconds, isWarning, showIcon = true, size = "md", className }: TimerProps) {
  const warning = isWarning ?? seconds < 300; // Less than 5 minutes
  const critical = seconds < 60; // Less than 1 minute

  const sizeStyles = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-bold rounded-lg",
        sizeStyles[size],
        critical
          ? "bg-red-100 text-red-700 animate-pulse"
          : warning
          ? "bg-orange-100 text-orange-700"
          : "bg-brand-navy-50 text-brand-navy-900",
        className
      )}
    >
      {showIcon && <Clock className={cn("w-4 h-4", size === "lg" && "w-5 h-5")} />}
      <span>{formatTime(seconds)}</span>
    </div>
  );
}
