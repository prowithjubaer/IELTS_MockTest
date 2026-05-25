"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_READING_TEST, scoreReadingTest } from "@/lib/reading-data";
import { formatTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  Clock, CheckCircle, Flag, ChevronLeft, ChevronRight,
  Maximize, Minimize, Settings, Save, LogOut, AlertCircle,
  BookOpen, GripVertical, Highlighter, StickyNote, X,
} from "lucide-react";

export default function ReadingExamPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_READING_TEST;

  const [timeRemaining, setTimeRemaining] = useState(test.duration_minutes * 60);
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);


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
      if (Object.keys(responses).length > 0) {
        setAutosaveStatus("saving");
        try { localStorage.setItem(`reading_${params.testId}`, JSON.stringify(responses)); } catch {}
        setTimeout(() => setAutosaveStatus("saved"), 500);
        setTimeout(() => setAutosaveStatus("idle"), 2000);
      }
    }, 5000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [responses, params.testId]);

  // Restore
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`reading_${params.testId}`);
      if (saved) setResponses(JSON.parse(saved));
    } catch {}
  }, [params.testId]);

  const handleSetResponse = (qNum: number, value: string) => {
    setResponses((prev) => ({ ...prev, [`q${qNum}`]: value }));
  };

  const toggleFlag = (qNum: number) => {
    setFlagged((prev) => { const n = new Set(prev); n.has(qNum) ? n.delete(qNum) : n.add(qNum); return n; });
  };

  const handleSubmit = useCallback(() => {
    const result = scoreReadingTest(responses, test);
    localStorage.setItem(`reading_result_${params.testId}`, JSON.stringify({
      ...result, responses, submittedAt: new Date().toISOString(),
      timeSpent: test.duration_minutes * 60 - timeRemaining,
    }));
    localStorage.removeItem(`reading_${params.testId}`);
    router.push(`/reading/${params.testId}/result`);
  }, [responses, test, params.testId, timeRemaining, router]);

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
    if (pct >= 25 && pct <= 75) setLeftWidth(pct);
  }, [isDragging]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Highlight handler
  const handleTextSelect = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 2) {
      const text = sel.toString().trim();
      if (!highlights.includes(text)) setHighlights((prev) => [...prev, text]);
    }
  };

  const answeredCount = Object.values(responses).filter((v) => v.trim() !== "").length;
  const unansweredCount = 40 - answeredCount;
  const fontClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const passageData = test.passages[currentPassage];


  return (
    <div className={cn("min-h-screen bg-white flex flex-col select-none", fontClass)}>
      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Test</h3>
            <p className="text-gray-600 text-sm mb-4">
              You have answered <strong>{answeredCount}</strong> out of <strong>40</strong> questions.
              {unansweredCount > 0 && <span className="text-orange-600"> {unansweredCount} unanswered.</span>}
            </p>
            {unansweredCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Unanswered questions will be marked incorrect.</p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>Submit Test</Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Save & Exit</h3>
            <p className="text-gray-600 text-sm mb-4">Your progress will be saved.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="secondary" onClick={() => router.push("/tests")}>Save & Exit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Note Input */}
      {showNoteInput && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-sm">Add Note</h4>
              <button onClick={() => setShowNoteInput(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-200" />
            <div className="flex justify-end mt-3">
              <Button variant="primary" size="sm" onClick={() => { if (noteText.trim()) { setNotes([...notes, noteText.trim()]); setNoteText(""); setShowNoteInput(false); } }}>Save Note</Button>
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
            {/* Autosave */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              {autosaveStatus === "saving" && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
              {autosaveStatus === "saved" && <><CheckCircle className="w-3 h-3 text-green-500" /> Saved</>}
            </div>
            {/* Timer */}
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
              timeRemaining < 60 ? "bg-red-100 text-red-700 animate-pulse" :
              timeRemaining < 300 ? "bg-orange-100 text-orange-700" : "bg-brand-navy-50 text-brand-navy-900")}>
              <Clock className="w-4 h-4" />{formatTime(timeRemaining)}
            </div>
            {/* Tools */}
            <button onClick={() => setShowNoteInput(true)} className="p-2 rounded-lg hover:bg-gray-100" title="Add Note">
              <StickyNote className="w-4 h-4 text-gray-600" />
            </button>
            {/* Settings */}
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
      <div ref={containerRef} className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 3.5rem - 5.5rem)" }}>
        {/* Left Panel - Passage */}
        <div className="overflow-y-auto select-text" style={{ width: `${leftWidth}%` }} onMouseUp={handleTextSelect}>
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{passageData.title}</h2>
              {passageData.subtitle && <p className="text-sm text-gray-500 italic">{passageData.subtitle}</p>}
            </div>
            <div className="space-y-4">
              {passageData.paragraphs.map((para) => (
                <div key={para.label} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {para.label}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{para.content}</p>
                </div>
              ))}
            </div>
            {/* Highlights list */}
            {highlights.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><Highlighter className="w-3 h-3" /> Highlights</h4>
                <div className="space-y-1">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                      <span className="text-xs text-yellow-800 flex-1 truncate">&ldquo;{h}&rdquo;</span>
                      <button onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="text-yellow-600 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Notes */}
            {notes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><StickyNote className="w-3 h-3" /> Notes</h4>
                <div className="space-y-1">
                  {notes.map((n, i) => (
                    <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                      <span className="text-xs text-blue-800 flex-1">{n}</span>
                      <button onClick={() => setNotes(notes.filter((_, idx) => idx !== i))} className="text-blue-600 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div className={cn("w-1.5 bg-gray-200 hover:bg-green-300 cursor-col-resize flex items-center justify-center transition-colors relative group flex-shrink-0", isDragging && "bg-green-400")}
          onMouseDown={handleMouseDown}>
          <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
          <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-green-700" />
        </div>

        {/* Right Panel - Questions */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            {passageData.groups.map((group) => (
              <div key={group.id} className="mb-8">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-1">{group.title}</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{group.instruction}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {group.questions.map((q) => (
                    <ReadingQuestionItem key={q.id} question={q}
                      value={responses[`q${q.question_number}`] || ""}
                      onChange={(val) => handleSetResponse(q.question_number, val)}
                      isCurrent={currentQuestion === q.question_number}
                      isFlagged={flagged.has(q.question_number)}
                      onFlag={() => toggleFlag(q.question_number)}
                      onFocus={() => setCurrentQuestion(q.question_number)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {test.passages.map((p, idx) => {
                const pAnswered = Array.from({ length: p.question_end - p.question_start + 1 }, (_, i) => p.question_start + i)
                  .filter((n) => responses[`q${n}`]?.trim()).length;
                const pTotal = p.question_end - p.question_start + 1;
                return (
                  <button key={p.id} onClick={() => { setCurrentPassage(idx); setCurrentQuestion(p.question_start); }}
                    className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      currentPassage === idx ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                    Passage {p.passage_number} <span className="ml-1 opacity-70">({pAnswered}/{pTotal})</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => { if (currentQuestion > 1) setCurrentQuestion(currentQuestion - 1); }} disabled={currentQuestion <= 1}>Prev</Button>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => { if (currentQuestion < 40) setCurrentQuestion(currentQuestion + 1); }} disabled={currentQuestion >= 40}>Next</Button>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
              const isAnswered = responses[`q${num}`]?.trim();
              const isCurrent = currentQuestion === num;
              const isFlagged = flagged.has(num);
              return (
                <button key={num} onClick={() => {
                  setCurrentQuestion(num);
                  const pIdx = test.passages.findIndex((p) => num >= p.question_start && num <= p.question_end);
                  if (pIdx >= 0) setCurrentPassage(pIdx);
                }} className={cn("w-7 h-7 flex items-center justify-center rounded text-xs font-medium border transition-all",
                  isCurrent ? "bg-green-700 text-white border-green-700 scale-110" :
                  isFlagged ? "bg-orange-400 text-white border-orange-400" :
                  isAnswered ? "bg-green-500 text-white border-green-500" :
                  "bg-white text-gray-600 border-gray-300 hover:border-green-400")} title={`Q${num}`}>{num}</button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}


// Question Item Component
interface RQProps {
  question: { id: string; question_number: number; prompt: string; input_type: "text"|"radio"|"checkbox"|"dropdown"; options?: { label: string; value: string }[]; word_limit?: number };
  value: string; onChange: (v: string) => void; isCurrent: boolean; isFlagged: boolean; onFlag: () => void; onFocus: () => void;
}

function ReadingQuestionItem({ question, value, onChange, isCurrent, isFlagged, onFlag, onFocus }: RQProps) {
  return (
    <div id={`rq-${question.question_number}`}
      className={cn("relative p-4 rounded-lg border transition-all",
        isCurrent ? "border-green-300 bg-green-50/30 shadow-sm" : "border-gray-100",
        isFlagged && "ring-2 ring-orange-300")} onClick={onFocus}>
      <div className="flex items-start gap-3">
        <span className={cn("flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
          value.trim() ? "bg-green-500 text-white" : "bg-brand-navy-900 text-white")}>{question.question_number}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 mb-2 font-medium leading-relaxed">{question.prompt}</p>
          {question.input_type === "text" && (
            <div>
              <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus}
                placeholder="Type your answer..." className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none" />
              {question.word_limit && <p className="text-xs text-gray-400 mt-1">No more than {question.word_limit} word{question.word_limit > 1 ? "s" : ""}</p>}
            </div>
          )}
          {question.input_type === "radio" && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <label key={opt.value} className={cn("flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                  value === opt.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300")}>
                  <input type="radio" name={`rq${question.question_number}`} value={opt.value} checked={value === opt.value}
                    onChange={(e) => onChange(e.target.value)} onFocus={onFocus} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
          {question.input_type === "checkbox" && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => {
                const selected = value ? value.split(",") : [];
                const isChecked = selected.includes(opt.value);
                return (
                  <label key={opt.value} className={cn("flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                    isChecked ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300")}>
                    <input type="checkbox" value={opt.value} checked={isChecked}
                      onChange={(e) => { let n = [...selected]; e.target.checked ? n.push(opt.value) : n = n.filter(v=>v!==opt.value); onChange(n.join(",")); }}
                      onFocus={onFocus} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}
          {question.input_type === "dropdown" && question.options && (
            <select value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus}
              className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none bg-white">
              <option value="">— Select —</option>
              {question.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onFlag(); }}
          className={cn("p-1.5 rounded-md transition-colors flex-shrink-0", isFlagged ? "bg-orange-400 text-white" : "hover:bg-gray-100 text-gray-400")}
          title={isFlagged ? "Remove flag" : "Flag for review"}>
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
