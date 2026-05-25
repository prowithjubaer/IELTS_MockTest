"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_READING_TEST } from "@/lib/reading-data";
import { Button } from "@/components/ui";
import {
  BookOpen, Clock, FileText, CheckCircle,
  ArrowRight, AlertCircle, Info, Columns,
} from "lucide-react";

export default function ReadingIntroPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_READING_TEST;

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
          <span className="text-sm text-gray-500">IELTS Reading Mock Test</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{test.title}</h1>
                <p className="text-sm text-green-100">
                  {test.test_type === "academic" ? "Academic" : "General Training"} • Computer-Based Mock Test
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{test.duration_minutes} min</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <FileText className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">40</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">Passages</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Columns className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">Split</p>
                <p className="text-xs text-gray-500">Screen View</p>
              </div>
            </div>


            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600" />
                Test Instructions
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    You will read three passages and answer 40 questions in 60 minutes.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    The passage will appear on the <strong>left panel</strong> and questions on the <strong>right panel</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    You can resize the divider between panels and scroll each independently.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    You may highlight text and add notes while reading.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Your answers are auto-saved every few seconds.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Pay attention to word limits in completion questions.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <strong>Do not close or refresh the browser</strong> during the test.
                  </li>
                </ul>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Time Management</p>
                <p className="text-sm text-orange-700">
                  You have 60 minutes for all 3 passages. Spend approximately 20 minutes per passage.
                  The timer will start as soon as you click Start Test.
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push(`/reading/${params.testId}/exam`)}
              >
                Start Reading Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
