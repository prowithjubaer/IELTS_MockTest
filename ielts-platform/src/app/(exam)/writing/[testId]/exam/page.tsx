"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_WRITING_TEST, countWords } from "@/lib/writing-data";
import { formatTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  Clock, CheckCircle, ChevronLeft, ChevronRight,
  Maximize, Minimize, Settings, Save, LogOut, AlertCircle,
  Pencil, GripVertical, X, FileText, Image,
} from "lucide-react";

export default function WritingExamPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_WRITING_TEST;

  const [timeRemaining, setTimeRemaining] = useState(test.duration_minutes * 60);
  const [currentTask, setCurrentTask] = useState(0);
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const task1Words = countWords(task1Text);
  const task2Words = countWords(task2Text);
  const currentTaskData = test.tasks[currentTask];

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Autosave
  useEffect(() => {
    autosaveRef.current = setInterval(() => {
      if (task1Text || task2Text) {
        setAutosaveStatus("saving");
        try {
          localStorage.setItem(`writing_${params.testId}`, JSON.stringify({ task1Text, task2Text }));
        } catch {}
        setTimeout(() => setAutosaveStatus("saved"), 500);
        setTimeout(() => setAutosaveStatus("idle"), 2000);
      }
    }, 3000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [task1Text, task2Text, params.testId]);

  // Restore
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`writing_${params.testId}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.task1Text) setTask1Text(data.task1Text);
        if (data.task2Text) setTask2Text(data.task2Text);
      }
    } catch {}
  }, [params.testId]);

  const handleSubmit = useCallback(() => {
    const result = {
      test_id: test.id,
      status: "pending",
      submitted_at: new Date().toISOString(),
      time_spent: test.duration_minutes * 60 - timeRemaining,
      task1_answer: task1Text,
      task1_word_count: countWords(task1Text),
      task2_answer: task2Text,
      task2_word_count: countWords(task2Text),
    };
    localStorage.setItem(`writing_result_${params.testId}`, JSON.stringify(result));
    localStorage.removeItem(`writing_${params.testId}`);
    router.push(`/writing/${params.testId}/result`);
  }, [task1Text, task2Text, test, params.testId, timeRemaining, router]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }
    else { document.exitFullscreen?.(); setIsFullscreen(false); }
  };

  // Resizer
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    if (pct >= 25 && pct <= 60) setLeftWidth(pct);
  }, [isDragging]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const fontClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  return (
    <div className={cn("min-h-screen bg-white flex flex-col", fontClass)}>
      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Submit Writing Test</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Task 1 Words:</span>
                <span className={cn("text-sm font-bold", task1Words >= 150 ? "text-green-600" : "text-orange-600")}>{task1Words} / 150</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Task 2 Words:</span>
                <span className={cn("text-sm font-bold", task2Words >= 250 ? "text-green-600" : "text-orange-600")}>{task2Words} / 250</span>
              </div>
            </div>
            {(task1Words < 150 || task2Words < 250) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {task1Words < 150 && "Task 1 is below 150 words. "}
                    {task2Words < 250 && "Task 2 is below 250 words. "}
                    This may affect your band score.
                  </span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-4">
              After submission, your writing will be evaluated by an expert teacher. You cannot edit after submitting.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>Submit for Review</Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Save & Exit</h3>
            <p className="text-gray-600 text-sm mb-4">Your progress will be saved. You can continue later.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="secondary" onClick={() => router.push("/tests")}>Save & Exit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-navy-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-brand-navy-900">{test.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              {autosaveStatus === "saving" && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
              {autosaveStatus === "saved" && <><CheckCircle className="w-3 h-3 text-green-500" /> Saved</>}
            </div>
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
              timeRemaining < 60 ? "bg-red-100 text-red-700 animate-pulse" :
              timeRemaining < 300 ? "bg-orange-100 text-orange-700" : "bg-brand-navy-50 text-brand-navy-900")}>
              <Clock className="w-4 h-4" />{formatTime(timeRemaining)}
            </div>
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Text Size</p>
                    <div className="flex gap-1">
                      {(["small","medium","large"] as const).map((s) => (
                        <button key={s} onClick={() => setFontSize(s)} className={cn("px-2 py-1 text-xs rounded capitalize", fontSize === s ? "bg-brand-navy-900 text-white" : "bg-gray-100 text-gray-600")}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { handleFullscreen(); setShowSettings(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />} {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                  <button onClick={() => { setShowExitModal(true); setShowSettings(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="w-4 h-4" /> Save & Exit
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleFullscreen} className="hidden md:block p-2 rounded-lg hover:bg-gray-100">
              {isFullscreen ? <Minimize className="w-4 h-4 text-gray-600" /> : <Maximize className="w-4 h-4 text-gray-600" />}
            </button>
            <Button variant="primary" size="sm" onClick={() => setShowSubmitModal(true)}>Submit</Button>
          </div>
        </div>
      </header>

      {/* Split Screen Body */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 3.5rem - 4rem)" }}>
        {/* Left Panel - Prompt */}
        <div className="overflow-y-auto" style={{ width: `${leftWidth}%` }}>
          <div className="p-6">
            {/* Task Instruction Banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-800 font-medium">{currentTaskData.instruction}</p>
            </div>

            {/* Task Prompt */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Task {currentTaskData.task_number}
              </h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {currentTaskData.prompt}
              </p>
            </div>

            {/* Chart/Image placeholder for Task 1 */}
            {currentTaskData.asset_url && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">Chart / Graph Image</p>
                <p className="text-xs text-gray-400 mt-1">(Bar chart showing housing data 1918-2011)</p>
                <p className="text-xs text-gray-400 mt-1">In production, the actual chart image will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div className={cn("w-1.5 bg-gray-200 hover:bg-purple-300 cursor-col-resize flex items-center justify-center transition-colors relative group flex-shrink-0", isDragging && "bg-purple-400")}
          onMouseDown={handleMouseDown}>
          <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
          <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-purple-700" />
        </div>

        {/* Right Panel - Writing Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 flex flex-col">
            <textarea
              value={currentTask === 0 ? task1Text : task2Text}
              onChange={(e) => currentTask === 0 ? setTask1Text(e.target.value) : setTask2Text(e.target.value)}
              placeholder={`Start writing your Task ${currentTask + 1} response here...\n\nRemember to write at least ${currentTaskData.minimum_words} words.`}
              className={cn(
                "flex-1 w-full p-4 border border-gray-200 rounded-xl outline-none resize-none transition-all",
                "focus:ring-2 focus:ring-purple-200 focus:border-purple-400",
                "text-gray-900 leading-relaxed placeholder:text-gray-400",
                fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base"
              )}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

          {/* Word Count Bar */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                Task {currentTask + 1}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-mono font-bold",
                (currentTask === 0 ? task1Words >= 150 : task2Words >= 250) ? "text-green-600" : 
                (currentTask === 0 ? task1Words > 0 : task2Words > 0) ? "text-orange-600" : "text-gray-400"
              )}>
                {currentTask === 0 ? task1Words : task2Words}
              </span>
              <span className="text-xs text-gray-400">
                / {currentTaskData.minimum_words} words
              </span>
              {(currentTask === 0 ? task1Words >= 150 : task2Words >= 250) && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Task Tabs */}
          <div className="flex gap-2">
            {test.tasks.map((task, idx) => {
              const wc = idx === 0 ? task1Words : task2Words;
              const min = task.minimum_words;
              return (
                <button key={task.id} onClick={() => setCurrentTask(idx)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    currentTask === idx ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                  <FileText className="w-4 h-4" />
                  Task {task.task_number}
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                    currentTask === idx 
                      ? (wc >= min ? "bg-green-400/30 text-green-100" : "bg-white/20 text-white/80")
                      : (wc >= min ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500")
                  )}>
                    {wc}/{min}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentTask(0)} disabled={currentTask === 0}>
              Task 1
            </Button>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setCurrentTask(1)} disabled={currentTask === 1}>
              Task 2
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
