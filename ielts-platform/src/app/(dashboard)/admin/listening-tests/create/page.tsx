"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Button, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Save, ArrowLeft, Upload, Plus, Trash2, GripVertical,
  Headphones, Eye, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";

export default function CreateListeningTestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("30");
  const [access, setAccess] = useState("free");
  const [ieltsMode, setIeltsMode] = useState(true);
  const [instruction, setInstruction] = useState(
    "You will listen to four recordings and answer questions. The recordings will be played ONCE only."
  );
  const [parts, setParts] = useState([
    { id: "1", title: "Part 1", instruction: "", groups: [] as any[] },
    { id: "2", title: "Part 2", instruction: "", groups: [] },
    { id: "3", title: "Part 3", instruction: "", groups: [] },
    { id: "4", title: "Part 4", instruction: "", groups: [] },
  ]);
  const [expandedPart, setExpandedPart] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"settings" | "parts">("settings");

  return (
    <DashboardLayout title="Create Listening Test" subtitle="Build a new IELTS Listening mock test.">
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/listening-tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
          <ArrowLeft className="w-4 h-4" /> Back to Listening Tests
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>Preview</Button>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>Save & Publish</Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab("settings")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "settings" ? "bg-white shadow-sm text-brand-navy-900" : "text-gray-600")}>
          Test Settings
        </button>
        <button onClick={() => setActiveTab("parts")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "parts" ? "bg-white shadow-sm text-brand-navy-900" : "text-gray-600")}>
          Parts & Questions
        </button>
      </div>


      {activeTab === "settings" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <CardTitle className="mb-4">Basic Information</CardTitle>
              <div className="space-y-4">
                <Input label="Test Title" placeholder="e.g. IELTS Listening Practice Test 04" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this test..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
                  <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[100px]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <CardTitle className="mb-4">Audio Upload</CardTitle>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-navy-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Upload main audio file</p>
                <p className="text-xs text-gray-500 mt-1">MP3, WAV, OGG (max 50MB)</p>
              </div>
            </Card>
          </div>

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
                <Input label="Duration (minutes)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Access</label>
                  <select value={access} onChange={(e) => setAccess(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="free">Free</option>
                    <option value="paid">Paid / Premium</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={ieltsMode} onChange={(e) => setIeltsMode(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-navy-900 focus:ring-brand-navy-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">IELTS Mode</span>
                      <p className="text-xs text-gray-500">No pause, rewind, or replay</p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}


      {activeTab === "parts" && (
        <div className="space-y-4">
          {parts.map((part, idx) => (
            <Card key={part.id} padding="none" className="overflow-hidden">
              <button
                onClick={() => setExpandedPart(expandedPart === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-navy-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{part.title}</p>
                    <p className="text-xs text-gray-500">Questions {idx * 10 + 1}–{(idx + 1) * 10}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{part.groups.length} groups</Badge>
                  {expandedPart === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {expandedPart === idx && (
                <div className="border-t border-gray-100 p-6">
                  <div className="space-y-4 mb-6">
                    <Input label="Part Title" value={part.title}
                      onChange={(e) => {
                        const next = [...parts];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setParts(next);
                      }} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Part Instruction</label>
                      <textarea value={part.instruction}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...next[idx], instruction: e.target.value };
                          setParts(next);
                        }}
                        placeholder="e.g. You will hear a conversation between..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
                    </div>
                  </div>

                  {/* Question Groups */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Question Groups</h4>
                      <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                        Add Group
                      </Button>
                    </div>

                    {part.groups.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                        <Headphones className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No question groups yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Add a group to start building questions.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {part.groups.map((group: any, gIdx: number) => (
                          <div key={gIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">{group.title || `Group ${gIdx + 1}`}</p>
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
