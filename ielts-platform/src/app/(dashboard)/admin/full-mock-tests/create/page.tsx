"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Button, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Save, ArrowLeft, Eye, Trophy, Headphones, BookOpen, Pencil, Mic, CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function CreateFullMockTestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [access, setAccess] = useState("free");
  const [instruction, setInstruction] = useState(
    "This is a full IELTS mock test containing all 4 modules. Complete them in order: Listening → Reading → Writing → Speaking."
  );
  const [listeningTest, setListeningTest] = useState("listening-test-001");
  const [readingTest, setReadingTest] = useState("reading-test-001");
  const [writingTest, setWritingTest] = useState("writing-test-001");
  const [speakingTest, setSpeakingTest] = useState("speaking-test-001");

  const moduleSelections = [
    { label: "Listening Test", icon: <Headphones className="w-4 h-4 text-blue-600" />, value: listeningTest, onChange: setListeningTest, options: [
      { value: "listening-test-001", label: "IELTS Listening Practice Test 01" },
      { value: "listening-test-002", label: "IELTS Listening Practice Test 02" },
      { value: "listening-test-003", label: "IELTS Listening Practice Test 03" },
    ]},
    { label: "Reading Test", icon: <BookOpen className="w-4 h-4 text-green-600" />, value: readingTest, onChange: setReadingTest, options: [
      { value: "reading-test-001", label: "IELTS Academic Reading Practice Test 01" },
      { value: "reading-test-002", label: "IELTS Academic Reading Practice Test 02" },
      { value: "reading-test-003", label: "IELTS General Training Reading Test 01" },
    ]},
    { label: "Writing Test", icon: <Pencil className="w-4 h-4 text-purple-600" />, value: writingTest, onChange: setWritingTest, options: [
      { value: "writing-test-001", label: "IELTS Academic Writing Practice Test 01" },
      { value: "writing-test-002", label: "IELTS Academic Writing Practice Test 02" },
      { value: "writing-test-003", label: "IELTS General Training Writing Test 01" },
    ]},
    { label: "Speaking Test", icon: <Mic className="w-4 h-4 text-orange-600" />, value: speakingTest, onChange: setSpeakingTest, options: [
      { value: "speaking-test-001", label: "IELTS Speaking Practice Test 01" },
      { value: "speaking-test-002", label: "IELTS Speaking Practice Test 02" },
    ]},
  ];

  return (
    <DashboardLayout title="Create Full Mock Test" subtitle="Combine 4 module tests into one full IELTS mock exam.">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/full-mock-tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
          <ArrowLeft className="w-4 h-4" /> Back to Full Mock Tests
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>Preview</Button>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>Save & Publish</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <CardTitle className="mb-4">Test Information</CardTitle>
            <div className="space-y-4">
              <Input label="Test Title" placeholder="e.g. Full IELTS Mock Test 03" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this full mock test..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
                <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
              </div>
            </div>
          </Card>

          {/* Module Selection */}
          <Card className="p-6">
            <CardTitle className="mb-4">Select Module Tests</CardTitle>
            <p className="text-sm text-gray-500 mb-4">Choose one existing test for each IELTS module. Students will complete them in order.</p>
            <div className="space-y-4">
              {moduleSelections.map((mod) => (
                <div key={mod.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 w-36 flex-shrink-0">
                    {mod.icon}
                    <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                  </div>
                  <select value={mod.value} onChange={(e) => mod.onChange(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy-200">
                    {mod.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Settings Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <CardTitle className="mb-4">Settings</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Access</label>
                <select value={access} onChange={(e) => setAccess(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="free">Free</option>
                  <option value="paid">Paid / Premium</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Estimated Duration</CardTitle>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Listening:</span><span className="font-medium">30 min</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reading:</span><span className="font-medium">60 min</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Writing:</span><span className="font-medium">60 min</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Speaking:</span><span className="font-medium">13 min</span></div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-brand-navy-900">~2h 43min</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-brand-navy-50 border-brand-navy-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-brand-navy-900" />
              <h4 className="font-bold text-brand-navy-900">Scoring</h4>
            </div>
            <ul className="text-xs text-brand-navy-700 space-y-1">
              <li>• Listening & Reading: Auto-scored</li>
              <li>• Writing & Speaking: Teacher-scored</li>
              <li>• Overall band: Average of 4 modules</li>
              <li>• IELTS rounding applied</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
