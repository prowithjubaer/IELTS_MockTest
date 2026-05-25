"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Button, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Save, ArrowLeft, Plus, BookOpen, Eye, ChevronDown, ChevronUp, Trash2,
} from "lucide-react";
import Link from "next/link";

export default function CreateReadingTestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testType, setTestType] = useState("academic");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("60");
  const [access, setAccess] = useState("free");
  const [instruction, setInstruction] = useState(
    "You should spend about 20 minutes on each passage. Read carefully and answer all questions."
  );
  const [passages, setPassages] = useState([
    { id: "1", title: "", subtitle: "", content: "", questionStart: "1", questionEnd: "13", groups: [] as any[] },
    { id: "2", title: "", subtitle: "", content: "", questionStart: "14", questionEnd: "26", groups: [] },
    { id: "3", title: "", subtitle: "", content: "", questionStart: "27", questionEnd: "40", groups: [] },
  ]);
  const [expandedPassage, setExpandedPassage] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"settings" | "passages">("settings");

  return (
    <DashboardLayout title="Create Reading Test" subtitle="Build a new IELTS Reading mock test.">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/reading-tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
          <ArrowLeft className="w-4 h-4" /> Back to Reading Tests
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>Preview</Button>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>Save & Publish</Button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab("settings")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "settings" ? "bg-white shadow-sm text-brand-navy-900" : "text-gray-600")}>
          Test Settings
        </button>
        <button onClick={() => setActiveTab("passages")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "passages" ? "bg-white shadow-sm text-brand-navy-900" : "text-gray-600")}>
          Passages & Questions
        </button>
      </div>


      {activeTab === "settings" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <CardTitle className="mb-4">Basic Information</CardTitle>
              <div className="space-y-4">
                <Input label="Test Title" placeholder="e.g. IELTS Academic Reading Practice Test 04" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
                  <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[100px]" />
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <CardTitle className="mb-4">Settings</CardTitle>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Type</label>
                  <select value={testType} onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="academic">Academic</option>
                    <option value="general">General Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <Input label="Duration (minutes)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
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
          </div>
        </div>
      )}


      {activeTab === "passages" && (
        <div className="space-y-4">
          {passages.map((passage, idx) => (
            <Card key={passage.id} padding="none" className="overflow-hidden">
              <button onClick={() => setExpandedPassage(expandedPassage === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{passage.title || `Passage ${idx + 1}`}</p>
                    <p className="text-xs text-gray-500">Questions {passage.questionStart}–{passage.questionEnd}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{passage.groups.length} groups</Badge>
                  {expandedPassage === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {expandedPassage === idx && (
                <div className="border-t border-gray-100 p-6">
                  <div className="space-y-4 mb-6">
                    <Input label="Passage Title" value={passage.title} placeholder="e.g. The Evolution of Urban Green Spaces"
                      onChange={(e) => { const n = [...passages]; n[idx] = { ...n[idx], title: e.target.value }; setPassages(n); }} />
                    <Input label="Subtitle (optional)" value={passage.subtitle} placeholder="Optional subtitle"
                      onChange={(e) => { const n = [...passages]; n[idx] = { ...n[idx], subtitle: e.target.value }; setPassages(n); }} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Passage Text</label>
                      <p className="text-xs text-gray-500 mb-2">Enter paragraphs separated by blank lines. Each paragraph will automatically be labelled A, B, C, etc.</p>
                      <textarea value={passage.content}
                        onChange={(e) => { const n = [...passages]; n[idx] = { ...n[idx], content: e.target.value }; setPassages(n); }}
                        placeholder="Enter the full passage text here. Separate paragraphs with blank lines..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[200px] font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Question Start" type="number" value={passage.questionStart}
                        onChange={(e) => { const n = [...passages]; n[idx] = { ...n[idx], questionStart: e.target.value }; setPassages(n); }} />
                      <Input label="Question End" type="number" value={passage.questionEnd}
                        onChange={(e) => { const n = [...passages]; n[idx] = { ...n[idx], questionEnd: e.target.value }; setPassages(n); }} />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Question Groups</h4>
                      <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>Add Group</Button>
                    </div>
                    {passage.groups.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No question groups yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Add a group to start building questions for this passage.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {passage.groups.map((group: any, gIdx: number) => (
                          <div key={gIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{group.title || `Group ${gIdx + 1}`}</p>
                              <p className="text-xs text-gray-500">{group.question_type || "Not set"}</p>
                            </div>
                            <button className="p-1 rounded hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
