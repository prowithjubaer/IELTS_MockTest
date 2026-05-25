"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_LISTENING_TEST } from "@/lib/listening-data";
import { Button } from "@/components/ui";
import { cn, formatTime } from "@/lib/utils";
import {
  Trophy, CheckCircle, X, Clock, Target,
  ArrowLeft, RotateCcw, Headphones, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface ResultData {
  rawScore: number;
  band: number;
  details: { questionNumber: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }[];
  responses: Record<string, string>;
  submittedAt: string;
  timeSpent: number;
}


export default function ListeningResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedPart, setExpandedPart] = useState<number | null>(null);
  const test = DEMO_LISTENING_TEST;

  useEffect(() => {
    try {
      const data = localStorage.getItem(`listening_result_${params.testId}`);
      if (data) setResult(JSON.parse(data));
      else router.push("/tests");
    } catch { router.push("/tests"); }
  }, [params.testId, router]);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading result...</div>
    </div>
  );

  const partScores = test.parts.map((part) => {
    const partDetails = result.details.filter(
      (d) => d.questionNumber >= part.question_start && d.questionNumber <= part.question_end
    );
    const correct = partDetails.filter((d) => d.isCorrect).length;
    const total = partDetails.length;
    return { part: part.part_number, title: part.title, correct, total };
  });

  const percentage = Math.round((result.rawScore / 40) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
            <ArrowLeft className="w-4 h-4" /> Back to Tests
          </Link>
          <span className="text-sm font-medium text-gray-500">Test Result</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-navy-900 to-brand-navy-800 px-8 py-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Headphones className="w-5 h-5" />
              <span className="text-sm opacity-80">{test.title}</span>
            </div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div>
                <p className="text-5xl font-bold">{result.band}</p>
                <p className="text-sm opacity-80 mt-1">Band Score</p>
              </div>
              <div className="w-px h-16 bg-white/20" />
              <div>
                <p className="text-5xl font-bold">{result.rawScore}<span className="text-2xl opacity-60">/40</span></p>
                <p className="text-sm opacity-80 mt-1">Correct Answers</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{percentage}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
              <p className="text-xs text-gray-500">Time Spent</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-600">{result.rawScore}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-lg font-bold text-red-600">{40 - result.rawScore}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
          </div>
        </div>


        {/* Part-wise Performance */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Part-wise Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partScores.map((ps) => (
              <div key={ps.part} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{ps.title}</p>
                <p className="text-2xl font-bold text-gray-900">{ps.correct}<span className="text-sm text-gray-400">/{ps.total}</span></p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-navy-900 rounded-full transition-all"
                    style={{ width: `${(ps.correct / ps.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Review Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold text-gray-900">Answer Review</h3>
            {showAnswers ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showAnswers && (
            <div className="border-t border-gray-100">
              {test.parts.map((part, idx) => (
                <div key={part.id}>
                  <button
                    onClick={() => setExpandedPart(expandedPart === idx ? null : idx)}
                    className="w-full px-6 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {part.title} (Q{part.question_start}-{part.question_end})
                    </span>
                    <span className="text-sm text-gray-500">
                      {partScores[idx].correct}/{partScores[idx].total}
                    </span>
                  </button>
                  {expandedPart === idx && (
                    <div className="divide-y divide-gray-50">
                      {result.details
                        .filter((d) => d.questionNumber >= part.question_start && d.questionNumber <= part.question_end)
                        .map((d) => (
                          <div key={d.questionNumber} className="px-6 py-3 flex items-center gap-4">
                            <span className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                              d.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {d.questionNumber}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-500">Your answer:</span>
                                <span className={cn("text-sm font-medium", d.isCorrect ? "text-green-700" : "text-red-600")}>
                                  {d.studentAnswer || "(no answer)"}
                                </span>
                              </div>
                              {!d.isCorrect && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-sm text-gray-500">Correct:</span>
                                  <span className="text-sm font-medium text-green-700">{d.correctAnswer}</span>
                                </div>
                              )}
                            </div>
                            {d.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/tests">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Tests</Button>
          </Link>
          <Link href={`/listening/${params.testId}`}>
            <Button variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>Retake Test</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
