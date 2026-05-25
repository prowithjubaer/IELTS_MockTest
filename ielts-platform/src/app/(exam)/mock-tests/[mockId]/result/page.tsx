"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_FULL_MOCK_TEST, calculateOverallBand } from "@/lib/full-mock-data";
import { Button } from "@/components/ui";
import { cn, formatTime } from "@/lib/utils";
import {
  Trophy, CheckCircle, Clock, ArrowLeft, Headphones,
  BookOpen, Pencil, Mic, AlertCircle, TrendingUp, Star,
} from "lucide-react";
import Link from "next/link";

interface FullMockResult {
  test_id: string;
  status: string;
  started_at: string;
  submitted_at: string;
  listening_band?: number;
  listening_raw?: number;
  reading_band?: number;
  reading_raw?: number;
  writing_band?: number;
  speaking_band?: number;
}

export default function FullMockResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<FullMockResult | null>(null);
  const test = DEMO_FULL_MOCK_TEST;

  useEffect(() => {
    try {
      const data = localStorage.getItem(`fullmock_result_${params.mockId}`);
      if (data) {
        setResult(JSON.parse(data));
      } else {
        router.push("/tests");
      }
    } catch {
      router.push("/tests");
    }
  }, [params.mockId, router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading result...</div>
      </div>
    );
  }

  const overallBand = calculateOverallBand(
    result.listening_band,
    result.reading_band,
    result.writing_band,
    result.speaking_band
  );

  const allChecked = result.listening_band != null && result.reading_band != null &&
    result.writing_band != null && result.speaking_band != null;

  const modules = [
    { key: "listening", name: "Listening", icon: <Headphones className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 border-blue-200", band: result.listening_band, raw: result.listening_raw, scoring: "Auto-scored" },
    { key: "reading", name: "Reading", icon: <BookOpen className="w-5 h-5" />, color: "bg-green-50 text-green-600 border-green-200", band: result.reading_band, raw: result.reading_raw, scoring: "Auto-scored" },
    { key: "writing", name: "Writing", icon: <Pencil className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 border-purple-200", band: result.writing_band, scoring: "Teacher-scored" },
    { key: "speaking", name: "Speaking", icon: <Mic className="w-5 h-5" />, color: "bg-orange-50 text-orange-600 border-orange-200", band: result.speaking_band, scoring: "Teacher-scored" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
            <ArrowLeft className="w-4 h-4" /> Back to Tests
          </Link>
          <span className="text-sm font-medium text-gray-500">Full Mock Test Result</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Band Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className={cn("px-8 py-10 text-white text-center",
            allChecked ? "bg-gradient-to-r from-brand-navy-900 to-brand-navy-800" : "bg-gradient-to-r from-gray-700 to-gray-600"
          )}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-5 h-5" />
              <span className="text-sm opacity-80">{test.title}</span>
            </div>

            {allChecked && overallBand != null ? (
              <div>
                <p className="text-6xl font-bold">{overallBand}</p>
                <p className="text-lg opacity-80 mt-2">Overall IELTS Band Score</p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-2xl font-bold">Overall Band: Pending</p>
                <p className="text-sm opacity-80 mt-1">Waiting for Writing and Speaking evaluation</p>
              </div>
            )}
          </div>

          {/* Module Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
            {modules.map((mod) => (
              <div key={mod.key} className="p-5 text-center">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", mod.color)}>
                  {mod.icon}
                </div>
                <p className="text-xs text-gray-500 mb-1">{mod.name}</p>
                {mod.band != null ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{mod.band}</p>
                    {mod.raw != null && <p className="text-xs text-gray-400">{mod.raw}/40</p>}
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Pending</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Info */}
        {!allChecked && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900 mb-1">Awaiting Teacher Evaluation</h3>
              <p className="text-sm text-orange-800 mb-3">
                Your Listening and Reading scores are available immediately. Writing and Speaking are being evaluated by an expert IELTS examiner. You will receive detailed feedback within 24-48 hours.
              </p>
              <div className="flex gap-4">
                {result.writing_band == null && (
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <Pencil className="w-4 h-4" /> Writing: Pending
                  </div>
                )}
                {result.speaking_band == null && (
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <Mic className="w-4 h-4" /> Speaking: Pending
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Completed celebration */}
        {allChecked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Star className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-900 mb-1">All Modules Evaluated!</h3>
                <p className="text-sm text-green-800">
                  Your full IELTS mock test has been completely evaluated. Your overall band score is <strong>{overallBand}</strong>.
                  Review each module&apos;s detailed feedback for improvement tips.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Module Detail Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {modules.map((mod) => (
            <div key={mod.key} className={cn("bg-white rounded-xl border p-5", mod.color.includes("border") ? "" : "border-gray-200")}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", mod.color)}>
                    {mod.icon}
                  </div>
                  <h4 className="font-bold text-gray-900">{mod.name}</h4>
                </div>
                {mod.band != null ? (
                  <span className="text-xl font-bold text-gray-900">{mod.band}</span>
                ) : (
                  <span className="text-sm text-orange-600 font-medium">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{mod.scoring}</span>
                {mod.raw != null && <span>{mod.raw}/40 correct</span>}
              </div>
              {mod.band != null && (
                <Link href={`/${mod.key}/${test[`${mod.key}_test_id` as keyof typeof test]}/result`}>
                  <Button variant="ghost" size="sm" className="mt-3 w-full">
                    View Detailed Result
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        {allChecked && overallBand != null && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-navy-600" /> Performance Summary
            </h3>
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.key} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">{mod.name}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-navy-900 rounded-full transition-all"
                      style={{ width: `${((mod.band || 0) / 9) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{mod.band || "—"}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 w-20">Overall</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red-500 rounded-full transition-all"
                    style={{ width: `${(overallBand / 9) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-brand-red-600 w-8">{overallBand}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/tests">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Tests</Button>
          </Link>
          <Link href={`/mock-tests/${params.mockId}`}>
            <Button variant="primary" leftIcon={<Trophy className="w-4 h-4" />}>Take Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
