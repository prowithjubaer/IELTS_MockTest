"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_SPEAKING_TEST } from "@/lib/speaking-data";
import { formatTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  Mic, Square, Play, Clock, CheckCircle, AlertCircle,
  Video, ChevronRight, LogOut, Settings, Maximize, Minimize,
  X, StickyNote, Loader2,
} from "lucide-react";

type RecordingState = "idle" | "thinking" | "ready" | "recording" | "stopped" | "uploading" | "uploaded";
type ExamPhase = "question" | "cue-card-prep" | "cue-card-speak" | "complete";

interface RecordingEntry {
  questionId: string;
  partNumber: number;
  duration: number;
  status: "recorded" | "uploaded";
}

export default function SpeakingExamPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_SPEAKING_TEST;

  // Flatten all questions for sequential navigation
  const allQuestions = test.parts.flatMap((part) =>
    part.questions.map((q) => ({ ...q, partNumber: part.part_number, partTitle: part.title, cueCard: part.cue_card }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [phase, setPhase] = useState<ExamPhase>("question");
  const [thinkTime, setThinkTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [cueCardNotes, setCueCardNotes] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const thinkRef = useRef<NodeJS.Timeout | null>(null);
  const recordRef = useRef<NodeJS.Timeout | null>(null);
  const prepRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = allQuestions[currentIndex];
  const currentPart = currentQ?.partNumber || 1;
  const isCueCard = currentPart === 2 && currentQ?.cueCard;
  const maxAnswer = currentQ?.max_answer_seconds || 60;

  // Start question flow: simulate video then think time
  useEffect(() => {
    if (!currentQ) return;

    // Reset states for new question
    setRecordingState("idle");
    setRecordingTime(0);
    setVideoPlaying(true);

    // Simulate examiner video playing (2s demo)
    const videoTimer = setTimeout(() => {
      setVideoPlaying(false);

      // For Part 2 cue card, go to prep phase
      if (isCueCard && phase !== "cue-card-speak") {
        setPhase("cue-card-prep");
        setPrepTime(currentQ.cueCard!.preparation_seconds);
        return;
      }

      // Start think time
      const tt = currentQ.think_time_seconds;
      if (tt > 0) {
        setRecordingState("thinking");
        setThinkTime(tt);
      } else {
        setRecordingState("ready");
      }
    }, 2000);

    return () => clearTimeout(videoTimer);
  }, [currentIndex]);

  // Think time countdown
  useEffect(() => {
    if (recordingState !== "thinking" || thinkTime <= 0) return;
    thinkRef.current = setInterval(() => {
      setThinkTime((prev) => {
        if (prev <= 1) {
          clearInterval(thinkRef.current!);
          setRecordingState("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (thinkRef.current) clearInterval(thinkRef.current); };
  }, [recordingState, thinkTime]);

  // Cue card preparation countdown
  useEffect(() => {
    if (phase !== "cue-card-prep" || prepTime <= 0) return;
    prepRef.current = setInterval(() => {
      setPrepTime((prev) => {
        if (prev <= 1) {
          clearInterval(prepRef.current!);
          setPhase("cue-card-speak");
          setRecordingState("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (prepRef.current) clearInterval(prepRef.current); };
  }, [phase, prepTime]);

  // Recording timer
  useEffect(() => {
    if (recordingState !== "recording") return;
    recordRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= maxAnswer) {
          handleStopRecording();
          return maxAnswer;
        }
        return prev + 1;
      });
    }, 1000);
    return () => { if (recordRef.current) clearInterval(recordRef.current); };
  }, [recordingState, maxAnswer]);

  const handleStartRecording = () => {
    setRecordingState("recording");
    setRecordingTime(0);
  };

  const handleStopRecording = useCallback(() => {
    if (recordRef.current) clearInterval(recordRef.current);
    setRecordingState("uploading");
    // Simulate upload
    setTimeout(() => {
      setRecordings((prev) => [...prev, {
        questionId: currentQ.id,
        partNumber: currentPart,
        duration: recordingTime || 1,
        status: "uploaded",
      }]);
      setRecordingState("uploaded");
    }, 800);
  }, [currentQ, currentPart, recordingTime]);

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhase("question");
    } else {
      setPhase("complete");
    }
  };

  const handleSubmit = () => {
    const result = {
      test_id: test.id,
      status: "pending",
      submitted_at: new Date().toISOString(),
      total_duration_seconds: recordings.reduce((a, r) => a + r.duration, 0),
      recordings_count: recordings.length,
      cue_card_notes: cueCardNotes,
      recordings: recordings,
    };
    localStorage.setItem(`speaking_result_${params.testId}`, JSON.stringify(result));
    router.push(`/speaking/${params.testId}/result`);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }
    else { document.exitFullscreen?.(); setIsFullscreen(false); }
  };

  // Complete screen
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Speaking Test Complete!</h2>
          <p className="text-gray-500 mb-6">
            You have answered all {allQuestions.length} questions across 3 parts.
            Total recordings: {recordings.length}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Part 1 recordings:</span><span className="font-medium">{recordings.filter(r => r.partNumber === 1).length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Part 2 recording:</span><span className="font-medium">{recordings.filter(r => r.partNumber === 2).length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Part 3 recordings:</span><span className="font-medium">{recordings.filter(r => r.partNumber === 3).length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total speaking time:</span><span className="font-medium">{formatTime(recordings.reduce((a, r) => a + r.duration, 0))}</span></div>
          </div>
          <Button variant="primary" size="xl" onClick={() => setShowSubmitModal(true)}>
            Submit for Expert Review
          </Button>
        </div>

        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Speaking Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your {recordings.length} recordings will be sent to an expert examiner for evaluation. You cannot redo this after submitting.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Save & Exit</h3>
            <p className="text-gray-600 text-sm mb-4">Your recordings will be lost if you exit now.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="secondary" onClick={() => router.push("/tests")}>Exit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-navy-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-brand-navy-900">{test.title}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress */}
            <span className="text-xs text-gray-500 hidden sm:block">
              Q {currentIndex + 1}/{allQuestions.length}
            </span>
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button onClick={() => { handleFullscreen(); setShowSettings(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                  <button onClick={() => { setShowExitModal(true); setShowSettings(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="w-4 h-4" /> Exit Test
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleFullscreen} className="hidden md:block p-2 rounded-lg hover:bg-gray-100">
              {isFullscreen ? <Minimize className="w-4 h-4 text-gray-600" /> : <Maximize className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Part Badge */}
          <div className="text-center mb-6">
            <span className="px-4 py-1.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
              {currentQ.partTitle}
            </span>
          </div>

          {/* Examiner Video Area */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6 aspect-video max-h-48 flex items-center justify-center relative">
            {videoPlaying ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 text-white animate-pulse" />
                </div>
                <p className="text-white/80 text-sm">Examiner is asking...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-xs">Examiner Video</p>
              </div>
            )}
            {videoPlaying && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/80">Playing</span>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-center shadow-sm">
            <p className="text-lg text-gray-900 font-medium leading-relaxed">
              &ldquo;{currentQ.question_text}&rdquo;
            </p>
          </div>

          {/* Cue Card (Part 2) */}
          {isCueCard && (phase === "cue-card-prep" || phase === "cue-card-speak") && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Cue Card */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">CUE CARD</h4>
                <p className="font-medium text-gray-800 mb-3">{currentQ.cueCard!.topic}</p>
                <p className="text-sm text-gray-600 mb-2">You should say:</p>
                <ul className="space-y-1">
                  {currentQ.cueCard!.bullet_points.map((bp, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span> {bp}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Note Box */}
              {currentQ.cueCard!.note_enabled && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">Your Notes</span>
                  </div>
                  <textarea
                    value={cueCardNotes}
                    onChange={(e) => setCueCardNotes(e.target.value)}
                    placeholder="Jot quick notes here..."
                    disabled={phase === "cue-card-speak"}
                    className="flex-1 w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Status Area */}
          <div className="flex flex-col items-center gap-4">
            {/* Preparation Timer (Part 2) */}
            {phase === "cue-card-prep" && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Preparation Time</p>
                <div className="text-4xl font-mono font-bold text-orange-600">{formatTime(prepTime)}</div>
                <p className="text-xs text-gray-400 mt-1">Take notes and prepare your answer</p>
              </div>
            )}

            {/* Think Time */}
            {recordingState === "thinking" && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Think Time</p>
                <div className="text-4xl font-mono font-bold text-blue-600">{thinkTime}s</div>
                <p className="text-xs text-gray-400 mt-1">Prepare your answer...</p>
              </div>
            )}

            {/* Record Button */}
            {recordingState === "ready" && (
              <div className="text-center">
                <button onClick={handleStartRecording}
                  className="w-24 h-24 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-xl hover:shadow-2xl active:scale-95 mb-3">
                  <Mic className="w-10 h-10 text-white" />
                </button>
                <p className="text-sm text-gray-600">Tap to start recording</p>
                <p className="text-xs text-gray-400 mt-1">Max {maxAnswer} seconds</p>
              </div>
            )}

            {/* Recording */}
            {recordingState === "recording" && (
              <div className="text-center">
                <button onClick={handleStopRecording}
                  className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-xl mb-3">
                  <Square className="w-10 h-10 text-white" />
                </button>
                <p className="text-sm text-red-600 font-mono font-bold">{formatTime(recordingTime)} / {formatTime(maxAnswer)}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-600 font-medium">Recording...</span>
                </div>
              </div>
            )}

            {/* Uploading */}
            {recordingState === "uploading" && (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-600">Saving recording...</p>
              </div>
            )}

            {/* Uploaded */}
            {recordingState === "uploaded" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-green-700 font-medium mb-4">Answer recorded! ({recordingTime}s)</p>
                <Button variant="primary" size="lg" rightIcon={<ChevronRight className="w-5 h-5" />}
                  onClick={handleNext}>
                  {currentIndex < allQuestions.length - 1 ? "Next Question" : "Finish Test"}
                </Button>
              </div>
            )}

            {/* Video playing state */}
            {videoPlaying && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Listen to the examiner...</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs text-gray-500">{currentIndex + 1} of {allQuestions.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
