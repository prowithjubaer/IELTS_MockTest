"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_FULL_MOCK_TEST } from "@/lib/full-mock-data";
import { Button } from "@/components/ui";
import { cn, formatTime } from "@/lib/utils";
import {
  Headphones, BookOpen, Pencil, Mic, CheckCircle,
  ArrowRight, Clock, Trophy, AlertCircle, Loader2,
} from "lucide-react";

type ModuleStep = "listening" | "reading" | "writing" | "speaking";
type Phase = "module" | "transition" | "complete";

interface ModuleResult {
  band?: number;
  raw?: number;
  status: "not_started" | "completed" | "pending";
}

export default function FullMockExamPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_FULL_MOCK_TEST;

  const [currentModule, setCurrentModule] = useState<ModuleStep>("listening");
  const [phase, setPhase] = useState<Phase>("module");
  const [results, setResults] = useState<Record<ModuleStep, ModuleResult>>({
    listening: { status: "not_started" },
    reading: { status: "not_started" },
    writing: { status: "not_started" },
    speaking: { status: "not_started" },
  });
  const [startedAt] = useState(new Date().toISOString());

  // Restore state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`fullmock_progress_${params.mockId}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentModule) setCurrentModule(data.currentModule);
        if (data.phase) setPhase(data.phase);
        if (data.results) setResults(data.results);
      }
    } catch {}
  }, [params.mockId]);

  // Save progress
  useEffect(() => {
    localStorage.setItem(`fullmock_progress_${params.mockId}`, JSON.stringify({
      currentModule, phase, results,
    }));
  }, [currentModule, phase, results, params.mockId]);

  // Check if a module was just completed (poll localStorage for module results)
  useEffect(() => {
    const checkModuleResults = () => {
      // Check listening result
      const lr = localStorage.getItem(`listening_result_${test.listening_test_id}`);
      if (lr && results.listening.status === "not_started") {
        const data = JSON.parse(lr);
        setResults(prev => ({ ...prev, listening: { band: data.band, raw: data.rawScore, status: "completed" } }));
        if (currentModule === "listening") {
          setPhase("transition");
        }
      }

      // Check reading result
      const rr = localStorage.getItem(`reading_result_${test.reading_test_id}`);
      if (rr && results.reading.status === "not_started") {
        const data = JSON.parse(rr);
        setResults(prev => ({ ...prev, reading: { band: data.band, raw: data.rawScore, status: "completed" } }));
        if (currentModule === "reading") {
          setPhase("transition");
        }
      }

      // Check writing result
      const wr = localStorage.getItem(`writing_result_${test.writing_test_id}`);
      if (wr && results.writing.status === "not_started") {
        setResults(prev => ({ ...prev, writing: { status: "pending" } }));
        if (currentModule === "writing") {
          setPhase("transition");
        }
      }

      // Check speaking result
      const sr = localStorage.getItem(`speaking_result_${test.speaking_test_id}`);
      if (sr && results.speaking.status === "not_started") {
        setResults(prev => ({ ...prev, speaking: { status: "pending" } }));
        if (currentModule === "speaking") {
          setPhase("complete");
        }
      }
    };

    const interval = setInterval(checkModuleResults, 1000);
    checkModuleResults(); // Check immediately
    return () => clearInterval(interval);
  }, [currentModule, results, test, params.mockId]);

  const moduleOrder: ModuleStep[] = ["listening", "reading", "writing", "speaking"];
  const currentIdx = moduleOrder.indexOf(currentModule);

  const moduleInfo: Record<ModuleStep, { name: string; icon: React.ReactNode; color: string; duration: string }> = {
    listening: { name: "Listening", icon: <Headphones className="w-6 h-6" />, color: "text-blue-600 bg-blue-50", duration: "30 min" },
    reading: { name: "Reading", icon: <BookOpen className="w-6 h-6" />, color: "text-green-600 bg-green-50", duration: "60 min" },
    writing: { name: "Writing", icon: <Pencil className="w-6 h-6" />, color: "text-purple-600 bg-purple-50", duration: "60 min" },
    speaking: { name: "Speaking", icon: <Mic className="w-6 h-6" />, color: "text-orange-600 bg-orange-50", duration: "13 min" },
  };

  const handleStartModule = () => {
    const routes: Record<ModuleStep, string> = {
      listening: `/listening/${test.listening_test_id}`,
      reading: `/reading/${test.reading_test_id}`,
      writing: `/writing/${test.writing_test_id}`,
      speaking: `/speaking/${test.speaking_test_id}`,
    };
    router.push(routes[currentModule]);
  };

  const handleNextModule = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < moduleOrder.length) {
      setCurrentModule(moduleOrder[nextIdx]);
      setPhase("module");
    } else {
      setPhase("complete");
    }
  };

  const handleViewResult = () => {
    // Save full mock result
    localStorage.setItem(`fullmock_result_${params.mockId}`, JSON.stringify({
      test_id: test.id,
      status: (results.writing.status === "pending" || results.speaking.status === "pending") ? "partially_checked" : "completed",
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      listening_band: results.listening.band,
      listening_raw: results.listening.raw,
      reading_band: results.reading.band,
      reading_raw: results.reading.raw,
      writing_band: results.writing.band,
      speaking_band: results.speaking.band,
    }));
    localStorage.removeItem(`fullmock_progress_${params.mockId}`);
    router.push(`/mock-tests/${params.mockId}/result`);
  };

  // MODULE START PHASE
  if (phase === "module") {
    const info = moduleInfo[currentModule];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {moduleOrder.map((mod, idx) => (
              <React.Fragment key={mod}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  idx < currentIdx ? "bg-green-500 text-white" :
                  idx === currentIdx ? "bg-brand-navy-900 text-white ring-4 ring-brand-navy-100" :
                  "bg-gray-200 text-gray-500"
                )}>
                  {idx < currentIdx ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < moduleOrder.length - 1 && (
                  <div className={cn("w-8 h-1 rounded-full", idx < currentIdx ? "bg-green-500" : "bg-gray-200")} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Module Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6", info.color)}>
              {info.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Module {currentIdx + 1}: {info.name}
            </h2>
            <p className="text-gray-500 mb-6">
              {currentModule === "listening" && "Listen to recordings and answer 40 questions. Audio plays once only."}
              {currentModule === "reading" && "Read 3 passages and answer 40 questions in 60 minutes."}
              {currentModule === "writing" && "Complete Task 1 and Task 2. Expert teacher will evaluate."}
              {currentModule === "speaking" && "Record your answers to examiner questions. Expert teacher will evaluate."}
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {info.duration}
              </div>
            </div>

            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={handleStartModule}>
              Start {info.name}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // TRANSITION PHASE
  if (phase === "transition") {
    const completedInfo = moduleInfo[currentModule];
    const nextModule = moduleOrder[currentIdx + 1];
    const nextInfo = nextModule ? moduleInfo[nextModule] : null;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {moduleOrder.map((mod, idx) => (
              <React.Fragment key={mod}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  idx <= currentIdx ? "bg-green-500 text-white" :
                  idx === currentIdx + 1 ? "bg-brand-navy-900 text-white" :
                  "bg-gray-200 text-gray-500"
                )}>
                  {idx <= currentIdx ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < moduleOrder.length - 1 && (
                  <div className={cn("w-8 h-1 rounded-full", idx <= currentIdx ? "bg-green-500" : "bg-gray-200")} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {completedInfo.name} Completed!
            </h2>

            {/* Show score if auto-scored */}
            {results[currentModule].band != null && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 inline-block">
                <p className="text-sm text-green-700">Band Score</p>
                <p className="text-3xl font-bold text-green-800">{results[currentModule].band}</p>
                {results[currentModule].raw != null && (
                  <p className="text-xs text-green-600">{results[currentModule].raw}/40 correct</p>
                )}
              </div>
            )}

            {results[currentModule].status === "pending" && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-orange-700 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Submitted for expert teacher evaluation
                </p>
              </div>
            )}

            {nextInfo ? (
              <>
                <p className="text-gray-500 mb-6">
                  Take a short break if needed. Next module: <strong>{nextInfo.name}</strong>
                </p>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={handleNextModule}>
                  Continue to {nextInfo.name}
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-6">
                  All modules complete! View your results.
                </p>
                <Button variant="primary" size="lg" rightIcon={<Trophy className="w-5 h-5" />}
                  onClick={handleViewResult}>
                  View Full Mock Result
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE PHASE
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* All done progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {moduleOrder.map((mod, idx) => (
            <React.Fragment key={mod}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              {idx < moduleOrder.length - 1 && <div className="w-8 h-1 rounded-full bg-green-500" />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-brand-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-brand-navy-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Full Mock Test Complete!</h2>
          <p className="text-gray-500 mb-6">
            You have completed all 4 modules. View your unified result report.
          </p>

          {/* Quick Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {moduleOrder.map((mod) => {
              const info = moduleInfo[mod];
              const r = results[mod];
              return (
                <div key={mod} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">{info.name}</p>
                  {r.band != null ? (
                    <p className="text-lg font-bold text-gray-900">{r.band}</p>
                  ) : r.status === "pending" ? (
                    <p className="text-sm font-medium text-orange-600">Pending</p>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
              );
            })}
          </div>

          <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={handleViewResult}>
            View Full Result Report
          </Button>
        </div>
      </div>
    </div>
  );
}
