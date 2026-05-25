"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_SPEAKING_TEST, DEMO_SPEAKING_SUBMISSIONS, SpeakingFeedbackData } from "@/lib/speaking-data";
import { Button } from "@/components/ui";
import { cn, formatTime } from "@/lib/utils";
import {
  CheckCircle, Clock, Target, ArrowLeft, RotateCcw, Mic,
  AlertCircle, Star, TrendingUp, MessageSquare, Headphones,
} from "lucide-react";
import Link from "next/link";

interface ResultData {
  test_id: string;
  status: "pending" | "checked";
  submitted_at: string;
  total_duration_seconds: number;
  recordings_count: number;
  cue_card_notes?: string;
  final_band?: number;
  feedback?: SpeakingFeedbackData;
}

export default function SpeakingResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const test = DEMO_SPEAKING_TEST;

  useEffect(() => {
    try {
      const data = localStorage.getItem(`speaking_result_${params.testId}`);
      if (data) {
        const parsed = JSON.parse(data);
        // Check for demo checked submission
        const checkedDemo = DEMO_SPEAKING_SUBMISSIONS.find(s => s.status === "checked");
        if (checkedDemo?.feedback) {
          setResult({ ...parsed, status: "checked", final_band: checkedDemo.final_band, feedback: checkedDemo.feedback });
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
          <span className="text-sm font-medium text-gray-500">Speaking Result</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className={cn("px-8 py-8 text-white text-center",
            isPending ? "bg-gradient-to-r from-gray-600 to-gray-500" : "bg-gradient-to-r from-orange-600 to-orange-500")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mic className="w-5 h-5" />
              <span className="text-sm opacity-80">{test.title}</span>
            </div>
            {isPending ? (
              <div className="mt-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-2xl font-bold">Feedback Pending</p>
                <p className="text-sm opacity-80 mt-1">An expert examiner is reviewing your recordings</p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-5xl font-bold">{result.final_band}</p>
                <p className="text-sm opacity-80 mt-1">Overall Speaking Band</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{formatTime(result.total_duration_seconds)}</p>
              <p className="text-xs text-gray-500">Total Speaking</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Mic className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{result.recordings_count}</p>
              <p className="text-xs text-gray-500">Recordings</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Headphones className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Parts</p>
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

        {/* Feedback (checked) */}
        {!isPending && result.feedback && (
          <>
            {/* Criterion Scores */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Criterion Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                {result.feedback.scores.map((s) => (
                  <div key={s.criterion} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{s.criterion}</span>
                      <span className="text-lg font-bold text-orange-700">{s.band}</span>
                    </div>
                    {s.comment && <p className="text-xs text-gray-500 mb-1">{s.comment}</p>}
                    {s.improvement && <p className="text-xs text-blue-600">→ {s.improvement}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" /> Teacher Feedback
              </h3>
              <p className="text-sm text-gray-700 mb-4 bg-orange-50 border border-orange-100 rounded-lg p-4">
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
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <h4 className="text-xs font-semibold text-blue-800 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Improvement Plan
                </h4>
                <p className="text-sm text-blue-800 whitespace-pre-line">{result.feedback.improvement_plan}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {result.feedback.fluency_notes && <div className="bg-gray-50 rounded-lg p-3"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Fluency</h4><p className="text-sm text-gray-700">{result.feedback.fluency_notes}</p></div>}
                {result.feedback.vocabulary_notes && <div className="bg-gray-50 rounded-lg p-3"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Vocabulary</h4><p className="text-sm text-gray-700">{result.feedback.vocabulary_notes}</p></div>}
                {result.feedback.grammar_notes && <div className="bg-gray-50 rounded-lg p-3"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Grammar</h4><p className="text-sm text-gray-700">{result.feedback.grammar_notes}</p></div>}
                {result.feedback.pronunciation_notes && <div className="bg-gray-50 rounded-lg p-3"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Pronunciation</h4><p className="text-sm text-gray-700">{result.feedback.pronunciation_notes}</p></div>}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Recordings are Being Reviewed</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              A certified IELTS examiner will listen to your recordings and evaluate your speaking performance.
              You will receive detailed band scores and feedback within 24-48 hours.
            </p>
            <p className="text-xs text-gray-400">Submitted: {new Date(result.submitted_at).toLocaleString()}</p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Link href="/tests"><Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Tests</Button></Link>
          <Link href={`/speaking/${params.testId}`}><Button variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>Take Again</Button></Link>
        </div>
      </div>
    </div>
  );
}
