"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_WRITING_TEST, DEMO_WRITING_SUBMISSIONS, WritingFeedbackData } from "@/lib/writing-data";
import { Button } from "@/components/ui";
import { cn, formatTime } from "@/lib/utils";
import {
  CheckCircle, Clock, Target, ArrowLeft, RotateCcw, Pencil,
  AlertCircle, Star, TrendingUp, MessageSquare, BookOpen,
} from "lucide-react";
import Link from "next/link";

interface ResultData {
  test_id: string;
  status: "pending" | "checked";
  submitted_at: string;
  time_spent: number;
  task1_answer: string;
  task1_word_count: number;
  task2_answer: string;
  task2_word_count: number;
  task1_band?: number;
  task2_band?: number;
  final_band?: number;
  feedback?: WritingFeedbackData;
}

export default function WritingResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [showTask1, setShowTask1] = useState(false);
  const [showTask2, setShowTask2] = useState(false);
  const test = DEMO_WRITING_TEST;

  useEffect(() => {
    try {
      const data = localStorage.getItem(`writing_result_${params.testId}`);
      if (data) {
        const parsed = JSON.parse(data);
        // Check if we have a demo checked submission to show feedback
        const checkedDemo = DEMO_WRITING_SUBMISSIONS.find(s => s.status === "checked");
        if (checkedDemo && checkedDemo.feedback) {
          // For demo purposes, show the checked version with feedback
          setResult({
            ...parsed,
            status: "checked",
            task1_band: checkedDemo.task1_band,
            task2_band: checkedDemo.task2_band,
            final_band: checkedDemo.final_band,
            feedback: checkedDemo.feedback,
          });
        } else {
          setResult({ ...parsed, status: "pending" });
        }
      } else {
        router.push("/tests");
      }
    } catch { router.push("/tests"); }
  }, [params.testId, router]);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading result...</div>
    </div>
  );

  const isPending = result.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
            <ArrowLeft className="w-4 h-4" /> Back to Tests
          </Link>
          <span className="text-sm font-medium text-gray-500">Writing Result</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className={cn("px-8 py-8 text-white text-center",
            isPending ? "bg-gradient-to-r from-gray-600 to-gray-500" : "bg-gradient-to-r from-purple-700 to-purple-600")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Pencil className="w-5 h-5" />
              <span className="text-sm opacity-80">{test.title}</span>
            </div>
            {isPending ? (
              <div className="mt-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-2xl font-bold">Feedback Pending</p>
                <p className="text-sm opacity-80 mt-1">Your writing is being reviewed by an expert teacher</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-8 mt-4">
                <div>
                  <p className="text-5xl font-bold">{result.final_band}</p>
                  <p className="text-sm opacity-80 mt-1">Overall Band</p>
                </div>
                <div className="w-px h-16 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold">{result.task1_band}</p>
                  <p className="text-sm opacity-80 mt-1">Task 1</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold">{result.task2_band}</p>
                  <p className="text-sm opacity-80 mt-1">Task 2</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{formatTime(result.time_spent)}</p>
              <p className="text-xs text-gray-500">Time Spent</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Pencil className="w-5 h-5 text-purple-600" />
              </div>
              <p className={cn("text-lg font-bold", result.task1_word_count >= 150 ? "text-green-600" : "text-orange-600")}>{result.task1_word_count}</p>
              <p className="text-xs text-gray-500">Task 1 Words</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className={cn("text-lg font-bold", result.task2_word_count >= 250 ? "text-green-600" : "text-orange-600")}>{result.task2_word_count}</p>
              <p className="text-xs text-gray-500">Task 2 Words</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                {isPending ? <AlertCircle className="w-5 h-5 text-orange-500" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
              <p className="text-lg font-bold text-gray-900">{isPending ? "Pending" : "Checked"}</p>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>
        </div>

        {/* Feedback Section (only if checked) */}
        {!isPending && result.feedback && (
          <>
            {/* Criterion Scores */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Task 1 Scores */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Task 1 — Band {result.feedback.task1_band}
                </h3>
                <div className="space-y-3">
                  {result.feedback.task1_scores.map((s) => (
                    <div key={s.criterion} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{s.criterion}</span>
                        <span className="text-sm font-bold text-purple-700">{s.band}</span>
                      </div>
                      {s.comment && <p className="text-xs text-gray-500">{s.comment}</p>}
                      {s.improvement && <p className="text-xs text-blue-600 mt-1">→ {s.improvement}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task 2 Scores */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Task 2 — Band {result.feedback.task2_band}
                </h3>
                <div className="space-y-3">
                  {result.feedback.task2_scores.map((s) => (
                    <div key={s.criterion} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{s.criterion}</span>
                        <span className="text-sm font-bold text-purple-700">{s.band}</span>
                      </div>
                      {s.comment && <p className="text-xs text-gray-500">{s.comment}</p>}
                      {s.improvement && <p className="text-xs text-blue-600 mt-1">→ {s.improvement}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" /> Teacher Feedback
              </h3>
              <p className="text-sm text-gray-700 mb-4 bg-purple-50 border border-purple-100 rounded-lg p-4">
                {result.feedback.overall_feedback}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs font-semibold text-green-700 uppercase mb-2 flex items-center gap-1"><Star className="w-3 h-3" /> Strengths</h4>
                  <ul className="space-y-1">
                    {result.feedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Weaknesses</h4>
                  <ul className="space-y-1">
                    {result.feedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improvement Plan */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-blue-800 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Improvement Plan
                </h4>
                <p className="text-sm text-blue-800 whitespace-pre-line">{result.feedback.improvement_plan}</p>
              </div>
            </div>

            {/* Detailed Notes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Detailed Notes</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.feedback.grammar_notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Grammar</h4>
                    <p className="text-sm text-gray-700">{result.feedback.grammar_notes}</p>
                  </div>
                )}
                {result.feedback.vocabulary_notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Vocabulary</h4>
                    <p className="text-sm text-gray-700">{result.feedback.vocabulary_notes}</p>
                  </div>
                )}
                {result.feedback.coherence_notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Coherence</h4>
                    <p className="text-sm text-gray-700">{result.feedback.coherence_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Pending Message */}
        {isPending && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center mb-6">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Writing is Being Reviewed</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              A certified IELTS examiner will evaluate your Task 1 and Task 2 responses. 
              You will receive detailed band scores, criterion-wise feedback, and improvement suggestions within 24-48 hours.
            </p>
            <p className="text-xs text-gray-400">
              Submitted: {new Date(result.submitted_at).toLocaleString()}
            </p>
          </div>
        )}

        {/* View Answers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <button onClick={() => setShowTask1(!showTask1)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100">
            <span className="font-medium text-gray-900">Task 1 Answer ({result.task1_word_count} words)</span>
            <span className="text-xs text-gray-400">{showTask1 ? "Hide" : "Show"}</span>
          </button>
          {showTask1 && (
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.task1_answer || "(No answer submitted)"}</p>
            </div>
          )}
          <button onClick={() => setShowTask2(!showTask2)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="font-medium text-gray-900">Task 2 Answer ({result.task2_word_count} words)</span>
            <span className="text-xs text-gray-400">{showTask2 ? "Hide" : "Show"}</span>
          </button>
          {showTask2 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.task2_answer || "(No answer submitted)"}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/tests"><Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Tests</Button></Link>
          <Link href={`/writing/${params.testId}`}><Button variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>Take Again</Button></Link>
        </div>
      </div>
    </div>
  );
}
