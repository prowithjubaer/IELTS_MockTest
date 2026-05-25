"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_WRITING_TEST } from "@/lib/writing-data";
import { Button } from "@/components/ui";
import {
  Pencil, Clock, FileText, ArrowRight, AlertCircle, Info, Columns,
} from "lucide-react";

export default function WritingIntroPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_WRITING_TEST;

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
          <span className="text-sm text-gray-500">IELTS Writing Mock Test</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{test.title}</h1>
                <p className="text-sm text-purple-100">
                  {test.test_type === "academic" ? "Academic" : "General Training"} • Computer-Based Mock Test
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{test.duration_minutes} min</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Tasks</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Pencil className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">400+</p>
                <p className="text-xs text-gray-500">Min Words</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Columns className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">Expert</p>
                <p className="text-xs text-gray-500">Scoring</p>
              </div>
            </div>

            {/* Task Overview */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                <h3 className="font-bold text-purple-900 mb-2">Task 1 — 20 minutes</h3>
                <p className="text-sm text-purple-800 mb-2">
                  {test.test_type === "academic"
                    ? "Describe visual information (graph, chart, table, or diagram)"
                    : "Write a letter (formal, semi-formal, or informal)"}
                </p>
                <p className="text-xs text-purple-600">Minimum 150 words</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                <h3 className="font-bold text-purple-900 mb-2">Task 2 — 40 minutes</h3>
                <p className="text-sm text-purple-800 mb-2">
                  Write an essay in response to a point of view, argument, or problem
                </p>
                <p className="text-xs text-purple-600">Minimum 250 words</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Test Instructions
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    The question/prompt will appear on the <strong>left panel</strong> and your writing area on the <strong>right panel</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Task 2 contributes <strong>twice as much</strong> as Task 1 to the Writing score.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Your writing is <strong>auto-saved</strong> every few seconds.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    After submission, your writing will be <strong>evaluated by an expert teacher</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    You will receive detailed band scores and feedback within 24-48 hours.
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
                <p className="text-sm font-semibold text-orange-800">Important</p>
                <p className="text-sm text-orange-700">
                  No spell-check, grammar-check, or AI assistance is available during the test.
                  This simulates real IELTS exam conditions. The timer starts when you click Start.
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push(`/writing/${params.testId}/exam`)}
              >
                Start Writing Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
