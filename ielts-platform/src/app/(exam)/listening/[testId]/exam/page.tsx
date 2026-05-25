"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_LISTENING_TEST, scoreListeningTest } from "@/lib/listening-data";
import { formatTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  Play,
  Clock,
  Headphones,
  CheckCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Settings,
  Save,
  LogOut,
  AlertCircle,
  Volume2,
  X,
} from "lucide-react";

type ExamPhase = "overlay" | "playing" | "review";


export default function ListeningExamPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_LISTENING_TEST;

  // State
  const [phase, setPhase] = useState<ExamPhase>("overlay");
  const [timeRemaining, setTimeRemaining] = useState(test.duration_minutes * 60);
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);


  // Timer
  useEffect(() => {
    if (phase === "playing" || phase === "review") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Autosave
  useEffect(() => {
    autosaveRef.current = setInterval(() => {
      if (Object.keys(responses).length > 0) {
        setAutosaveStatus("saving");
        try {
          localStorage.setItem(`listening_${params.testId}`, JSON.stringify(responses));
        } catch {}
        setTimeout(() => setAutosaveStatus("saved"), 500);
        setTimeout(() => setAutosaveStatus("idle"), 2000);
      }
    }, 5000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [responses, params.testId]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`listening_${params.testId}`);
      if (saved) setResponses(JSON.parse(saved));
    } catch {}
  }, [params.testId]);


  const handleStartAudio = () => {
    setPhase("playing");
    setAudioPlaying(true);
    // Simulate audio ending after a while (in production, use real audio events)
    setTimeout(() => {
      setAudioPlaying(false);
      setPhase("review");
    }, 15000); // 15s demo; real audio would be full length
  };

  const handleSetResponse = (qNum: number, value: string) => {
    setResponses((prev) => ({ ...prev, [`q${qNum}`]: value }));
  };

  const toggleFlag = (qNum: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qNum)) next.delete(qNum);
      else next.add(qNum);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    // Score the test
    const result = scoreListeningTest(responses, test);
    // Save result
    localStorage.setItem(`listening_result_${params.testId}`, JSON.stringify({
      ...result,
      responses,
      submittedAt: new Date().toISOString(),
      timeSpent: test.duration_minutes * 60 - timeRemaining,
    }));
    localStorage.removeItem(`listening_${params.testId}`);
    router.push(`/listening/${params.testId}/result`);
  }, [responses, test, params.testId, timeRemaining, router]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const answeredCount = Object.values(responses).filter((v) => v.trim() !== "").length;
  const unansweredCount = 40 - answeredCount;


  const fontClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  // Get current part data
  const currentPartData = test.parts[currentPart];

  return (
    <div className={cn("min-h-screen bg-white flex flex-col", fontClass)}>
      {/* Audio Start Overlay */}
      {phase === "overlay" && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center animate-slide-up">
            <div className="w-16 h-16 bg-brand-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-8 h-8 text-brand-navy-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Audio Will Begin Playing</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You will be listening to an audio clip during this test. You will{" "}
              <strong className="text-red-600">not be permitted to pause or rewind</strong>{" "}
              the audio while answering the questions. To continue, click Play.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-orange-800 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                The audio will play once only. Make sure you are ready.
              </p>
            </div>
            <Button
              variant="primary"
              size="xl"
              leftIcon={<Play className="w-5 h-5" />}
              onClick={handleStartAudio}
              className="px-12"
            >
              Play Audio & Start Test
            </Button>
          </div>
        </div>
      )}


      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Test</h3>
            <p className="text-gray-600 text-sm mb-4">
              You have answered <strong>{answeredCount}</strong> out of <strong>40</strong> questions.
              {unansweredCount > 0 && (
                <span className="text-orange-600"> {unansweredCount} questions are unanswered.</span>
              )}
            </p>
            {unansweredCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Unanswered questions will be marked as incorrect.
                </p>
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
            <p className="text-gray-600 text-sm mb-4">
              Your progress will be saved. You can continue this test later.
              Note: the audio cannot be replayed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="secondary" onClick={() => router.push("/tests")}>Save & Exit</Button>
            </div>
          </div>
        </div>
      )}


      {/* Exam Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-navy-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-brand-navy-900">
              {test.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Status */}
            {audioPlaying && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700">Audio Playing</span>
              </div>
            )}
            {!audioPlaying && phase !== "overlay" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
                <CheckCircle className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Audio Complete</span>
              </div>
            )}

            {/* Autosave Status */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              {autosaveStatus === "saving" && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
              {autosaveStatus === "saved" && <><CheckCircle className="w-3 h-3 text-green-500" /> Saved</>}
            </div>

            {/* Timer */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
              timeRemaining < 60 ? "bg-red-100 text-red-700 animate-pulse" :
              timeRemaining < 300 ? "bg-orange-100 text-orange-700" :
              "bg-brand-navy-50 text-brand-navy-900"
            )}>
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>

            {/* Settings */}
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Text Size</p>
                    <div className="flex gap-1">
                      {(["small", "medium", "large"] as const).map((s) => (
                        <button key={s} onClick={() => setFontSize(s)}
                          className={cn("px-2 py-1 text-xs rounded capitalize",
                            fontSize === s ? "bg-brand-navy-900 text-white" : "bg-gray-100 text-gray-600")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { handleFullscreen(); setShowSettings(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                  <button onClick={() => { setShowExitModal(true); setShowSettings(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="w-4 h-4" /> Save & Exit
                  </button>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={handleFullscreen}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100">
              {isFullscreen ? <Minimize className="w-4 h-4 text-gray-600" /> : <Maximize className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Submit */}
            <Button variant="primary" size="sm" onClick={() => setShowSubmitModal(true)}>
              Submit
            </Button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Part Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-brand-navy-900 text-white text-xs font-bold rounded-full">
                {currentPartData.title}
              </span>
              <span className="text-sm text-gray-500">
                Questions {currentPartData.question_start}–{currentPartData.question_end}
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-800">{currentPartData.instruction}</p>
            </div>
          </div>

          {/* Question Groups */}
          {currentPartData.groups.map((group) => (
            <div key={group.id} className="mb-8">
              {/* Group Header */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-1">{group.title}</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{group.instruction}</p>
                </div>
              </div>

              {/* Group Image */}
              {group.asset_url && (
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <img src={group.asset_url} alt="Question context" className="max-w-full" />
                </div>
              )}

              {/* Questions */}
              <div className="space-y-4">
                {group.questions.map((q) => (
                  <QuestionItem
                    key={q.id}
                    question={q}
                    value={responses[`q${q.question_number}`] || ""}
                    onChange={(val) => handleSetResponse(q.question_number, val)}
                    isCurrent={currentQuestion === q.question_number}
                    isFlagged={flagged.has(q.question_number)}
                    onFlag={() => toggleFlag(q.question_number)}
                    onFocus={() => setCurrentQuestion(q.question_number)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>


      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Part Tabs */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {test.parts.map((part, idx) => {
                const partAnswered = Array.from(
                  { length: part.question_end - part.question_start + 1 },
                  (_, i) => part.question_start + i
                ).filter((n) => responses[`q${n}`]?.trim()).length;
                const partTotal = part.question_end - part.question_start + 1;

                return (
                  <button
                    key={part.id}
                    onClick={() => { setCurrentPart(idx); setCurrentQuestion(part.question_start); }}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      currentPart === idx
                        ? "bg-brand-navy-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    Part {part.part_number}
                    <span className="ml-1 opacity-70">({partAnswered}/{partTotal})</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => { if (currentQuestion > 1) setCurrentQuestion(currentQuestion - 1); }}
                disabled={currentQuestion <= 1}>
                Prev
              </Button>
              <Button variant="ghost" size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => { if (currentQuestion < 40) setCurrentQuestion(currentQuestion + 1); }}
                disabled={currentQuestion >= 40}>
                Next
              </Button>
            </div>
          </div>

          {/* Question Palette */}
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
              const isAnswered = responses[`q${num}`]?.trim();
              const isCurrent = currentQuestion === num;
              const isFlagged = flagged.has(num);
              return (
                <button
                  key={num}
                  onClick={() => {
                    setCurrentQuestion(num);
                    // Switch to correct part
                    const partIdx = test.parts.findIndex(
                      (p) => num >= p.question_start && num <= p.question_end
                    );
                    if (partIdx >= 0) setCurrentPart(partIdx);
                  }}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded text-xs font-medium border transition-all",
                    isCurrent ? "bg-brand-navy-900 text-white border-brand-navy-900 scale-110" :
                    isFlagged ? "bg-orange-400 text-white border-orange-400" :
                    isAnswered ? "bg-green-500 text-white border-green-500" :
                    "bg-white text-gray-600 border-gray-300 hover:border-brand-navy-400"
                  )}
                  title={`Question ${num}`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}


// ============================================
// Question Item Component
// ============================================
interface QuestionItemProps {
  question: {
    id: string;
    question_number: number;
    prompt: string;
    input_type: "text" | "radio" | "checkbox" | "dropdown";
    options?: { label: string; value: string }[];
    word_limit?: number;
  };
  value: string;
  onChange: (val: string) => void;
  isCurrent: boolean;
  isFlagged: boolean;
  onFlag: () => void;
  onFocus: () => void;
}

function QuestionItem({ question, value, onChange, isCurrent, isFlagged, onFlag, onFocus }: QuestionItemProps) {
  return (
    <div
      id={`question-${question.question_number}`}
      className={cn(
        "relative p-4 rounded-lg border transition-all",
        isCurrent ? "border-brand-navy-300 bg-brand-navy-50/30 shadow-sm" : "border-gray-100",
        isFlagged && "ring-2 ring-orange-300"
      )}
      onClick={onFocus}
    >
      <div className="flex items-start gap-3">
        {/* Question Number */}
        <span className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
          value.trim() ? "bg-green-500 text-white" : "bg-brand-navy-900 text-white"
        )}>
          {question.question_number}
        </span>

        <div className="flex-1 min-w-0">
          {/* Prompt */}
          <p className="text-sm text-gray-800 mb-2 font-medium leading-relaxed">
            {question.prompt}
          </p>

          {/* Input */}
          {question.input_type === "text" && (
            <div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                placeholder="Type your answer..."
                className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none transition-all"
              />
              {question.word_limit && (
                <p className="text-xs text-gray-400 mt-1">
                  Write no more than {question.word_limit} word{question.word_limit > 1 ? "s" : ""} and/or a number
                </p>
              )}
            </div>
          )}

          {question.input_type === "radio" && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <label key={opt.value}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                    value === opt.value ? "border-brand-navy-500 bg-brand-navy-50" : "border-gray-200 hover:border-gray-300"
                  )}>
                  <input type="radio" name={`q${question.question_number}`}
                    value={opt.value} checked={value === opt.value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    className="w-4 h-4 text-brand-navy-900 focus:ring-brand-navy-500" />
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
                  <label key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                      isChecked ? "border-brand-navy-500 bg-brand-navy-50" : "border-gray-200 hover:border-gray-300"
                    )}>
                    <input type="checkbox" value={opt.value} checked={isChecked}
                      onChange={(e) => {
                        let next = [...selected];
                        if (e.target.checked) next.push(opt.value);
                        else next = next.filter((v) => v !== opt.value);
                        onChange(next.join(","));
                      }}
                      onFocus={onFocus}
                      className="w-4 h-4 rounded text-brand-navy-900 focus:ring-brand-navy-500" />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.input_type === "dropdown" && question.options && (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 outline-none bg-white"
            >
              <option value="">— Select answer —</option>
              {question.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Flag */}
        <button onClick={(e) => { e.stopPropagation(); onFlag(); }}
          className={cn(
            "p-1.5 rounded-md transition-colors flex-shrink-0",
            isFlagged ? "bg-orange-400 text-white" : "hover:bg-gray-100 text-gray-400"
          )}
          title={isFlagged ? "Remove flag" : "Flag for review"}>
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
