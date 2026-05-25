"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_FULL_MOCK_TEST } from "@/lib/full-mock-data";
import { Button } from "@/components/ui";
import {
  Headphones, BookOpen, Pencil, Mic, Clock, FileText,
  ArrowRight, AlertCircle, Info, Trophy, CheckCircle,
} from "lucide-react";

export default function FullMockIntroPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_FULL_MOCK_TEST;

  const modules = [
    { name: "Listening", icon: <Headphones className="w-5 h-5" />, duration: "30 min", questions: "40 questions", scoring: "Auto-scored", color: "bg-blue-50 text-blue-600" },
    { name: "Reading", icon: <BookOpen className="w-5 h-5" />, duration: "60 min", questions: "40 questions", scoring: "Auto-scored", color: "bg-green-50 text-green-600" },
    { name: "Writing", icon: <Pencil className="w-5 h-5" />, duration: "60 min", questions: "2 tasks", scoring: "Teacher-scored", color: "bg-purple-50 text-purple-600" },
    { name: "Speaking", icon: <Mic className="w-5 h-5" />, duration: "13 min", questions: "3 parts", scoring: "Teacher-scored", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-bold text-brand-navy-900 text-sm">Pro English</span>
              <span className="font-bold text-brand-red-500 text-sm ml-1">BD</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">Full IELTS Mock Test</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-brand-navy-900 to-brand-navy-800 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{test.title}</h1>
                <p className="text-sm text-gray-300">Complete IELTS Exam Simulation • 4 Modules</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">~{Math.round(test.total_duration_minutes / 60)}h {test.total_duration_minutes % 60}m</p>
                <p className="text-xs text-gray-500">Total Duration</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <FileText className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500">Modules</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">80</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Trophy className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">Band</p>
                <p className="text-xs text-gray-500">Overall Score</p>
              </div>
            </div>

            {/* Module Cards */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Test Modules (in order)</h2>
              <div className="space-y-3">
                {modules.map((mod, idx) => (
                  <div key={mod.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-brand-navy-900 text-white rounded-full text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.color}`}>
                      {mod.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{mod.name}</p>
                      <p className="text-xs text-gray-500">{mod.questions} • {mod.duration}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600">
                      {mod.scoring}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-navy-600" />
                How It Works
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    You will complete all 4 modules <strong>in sequence</strong>: Listening → Reading → Writing → Speaking.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <strong>Listening</strong> and <strong>Reading</strong> are auto-scored immediately after each module.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <strong>Writing</strong> and <strong>Speaking</strong> will be evaluated by an expert teacher within 24-48 hours.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Your <strong>overall IELTS band</strong> is calculated once all 4 module scores are available.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Between each module you will see a <strong>transition screen</strong> — take a short break if needed.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <strong>Do not close the browser</strong> during any module. Progress auto-saves.
                  </li>
                </ul>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Time Commitment</p>
                <p className="text-sm text-orange-700">
                  This full mock test takes approximately 2 hours and 50 minutes. Make sure you have enough uninterrupted time.
                  You will start with the Listening module first.
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push(`/mock-tests/${params.mockId}/exam`)}
              >
                Start Full Mock Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
