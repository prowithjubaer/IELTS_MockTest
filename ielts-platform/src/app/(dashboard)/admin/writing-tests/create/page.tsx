"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Button, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Save, ArrowLeft, Upload, Plus, Eye, Pencil, Image } from "lucide-react";
import Link from "next/link";

export default function CreateWritingTestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testType, setTestType] = useState("academic");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("60");
  const [access, setAccess] = useState("free");
  const [instruction, setInstruction] = useState(
    "The Writing test has two tasks. Spend approximately 20 minutes on Task 1 and 40 minutes on Task 2."
  );
  const [task1Type, setTask1Type] = useState("bar_chart");
  const [task1Prompt, setTask1Prompt] = useState("");
  const [task2Type, setTask2Type] = useState("discussion_opinion");
  const [task2Prompt, setTask2Prompt] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "tasks">("settings");

  const academicTask1Types = ["line_graph", "bar_chart", "pie_chart", "table", "process_diagram", "map", "mixed_chart"];
  const generalTask1Types = ["formal_letter", "semi_formal_letter", "informal_letter"];
  const task2Types = ["opinion", "discussion_opinion", "advantage_disadvantage", "problem_solution", "two_part", "agree_disagree", "cause_effect"];

  return (
    <DashboardLayout title="Create Writing Test" subtitle="Build a new IELTS Writing mock test.">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/writing-tests" className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900">
          <ArrowLeft className="w-4 h-4" /> Back to Writing Tests
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
        <button onClick={() => setActiveTab("tasks")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "tasks" ? "bg-white shadow-sm text-brand-navy-900" : "text-gray-600")}>
          Tasks
        </button>
      </div>

      {activeTab === "settings" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <CardTitle className="mb-4">Basic Information</CardTitle>
              <div className="space-y-4">
                <Input label="Test Title" placeholder="e.g. IELTS Academic Writing Practice Test 04" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
                  <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[80px]" />
                </div>
              </div>
            </Card>
          </div>
          <div>
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

      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Task 1 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-purple-700 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</span>
              <CardTitle>Task 1 — {testType === "academic" ? "Describe Visual Information" : "Write a Letter"}</CardTitle>
              <Badge variant="info">20 min • 150 words min</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Type</label>
                <select value={task1Type} onChange={(e) => setTask1Type(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white capitalize">
                  {(testType === "academic" ? academicTask1Types : generalTask1Types).map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Prompt</label>
                <textarea value={task1Prompt} onChange={(e) => setTask1Prompt(e.target.value)}
                  placeholder={testType === "academic" ? "The graph below shows..." : "You recently..."}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[120px]" />
              </div>
              {testType === "academic" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Chart/Graph Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload chart image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (max 5MB)</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Task 2 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-purple-700 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</span>
              <CardTitle>Task 2 — Essay</CardTitle>
              <Badge variant="info">40 min • 250 words min</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Essay Type</label>
                <select value={task2Type} onChange={(e) => setTask2Type(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white capitalize">
                  {task2Types.map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Essay Prompt</label>
                <textarea value={task2Prompt} onChange={(e) => setTask2Prompt(e.target.value)}
                  placeholder="Some people believe that... Discuss both views and give your own opinion."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 min-h-[120px]" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
