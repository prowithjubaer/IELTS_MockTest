"use client";

import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface SplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function SplitScreen({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  className,
}: SplitScreenProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth >= minLeftWidth && newWidth <= maxLeftWidth) {
        setLeftWidth(newWidth);
      }
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-[calc(100vh-3.5rem)] overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <div
        className="overflow-y-auto"
        style={{ width: `${leftWidth}%` }}
      >
        <div className="p-6 h-full">{left}</div>
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "w-1.5 bg-gray-200 hover:bg-brand-navy-300 cursor-col-resize flex items-center justify-center transition-colors relative group",
          isDragging && "bg-brand-navy-400"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
        <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-brand-navy-600" />
      </div>

      {/* Right Panel */}
      <div
        className="overflow-y-auto flex-1"
      >
        <div className="p-6 h-full">{right}</div>
      </div>
    </div>
  );
}
