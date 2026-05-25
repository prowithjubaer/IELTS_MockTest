"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, Badge, Button, Tabs } from "@/components/ui";
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  Clock,
  FileText,
  Play,
  Lock,
  CheckCircle,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";

type ModuleFilter = "all" | "full" | "listening" | "reading" | "writing" | "speaking";

export default function TestsPage() {
  const [activeModule, setActiveModule] = useState<ModuleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "All Tests", count: 24 },
    { id: "full", label: "Full Mock Test", icon: <FileText className="w-4 h-4" />, count: 4 },
    { id: "listening", label: "Listening", icon: <Headphones className="w-4 h-4" />, count: 8 },
    { id: "reading", label: "Reading", icon: <BookOpen className="w-4 h-4" />, count: 6 },
    { id: "writing", label: "Writing", icon: <Pencil className="w-4 h-4" />, count: 4 },
    { id: "speaking", label: "Speaking", icon: <Mic className="w-4 h-4" />, count: 2 },
  ];

  const mockTests = [
    {
      id: "1",
      title: "IELTS Full Mock Test #1",
      module: "full" as const,
      difficulty: "medium",
      duration: 170,
      questions: 80,
      access: "free" as const,
      status: "completed",
      band: 6.5,
      attempts: 1,
    },
    {
      id: "2",
      title: "Listening Practice Test #1",
      module: "listening" as const,
      difficulty: "easy",
      duration: 30,
      questions: 40,
      access: "free" as const,
      status: "not_started",
      band: null,
      attempts: 0,
    },
    {
      id: "3",
      title: "Academic Reading Test #1",
      module: "reading" as const,
      difficulty: "medium",
      duration: 60,
      questions: 40,
      access: "free" as const,
      status: "completed",
      band: 7.0,
      attempts: 2,
    },
    {
      id: "4",
      title: "Listening Practice Test #2",
      module: "listening" as const,
      difficulty: "hard",
      duration: 30,
      questions: 40,
      access: "paid" as const,
      status: "not_started",
      band: null,
      attempts: 0,
    },
    {
      id: "5",
      title: "Writing Task - Academic #1",
      module: "writing" as const,
      difficulty: "medium",
      duration: 60,
      questions: 2,
      access: "paid" as const,
      status: "pending",
      band: null,
      attempts: 1,
    },
    {
      id: "6",
      title: "Speaking Test #1",
      module: "speaking" as const,
      difficulty: "medium",
      duration: 14,
      questions: 11,
      access: "paid" as const,
      status: "not_started",
      band: null,
      attempts: 0,
    },
    {
      id: "7",
      title: "Listening Practice Test #3",
      module: "listening" as const,
      difficulty: "medium",
      duration: 30,
      questions: 40,
      access: "free" as const,
      status: "in_progress",
      band: null,
      attempts: 1,
    },
    {
      id: "8",
      title: "Academic Reading Test #2",
      module: "reading" as const,
      difficulty: "hard",
      duration: 60,
      questions: 40,
      access: "paid" as const,
      status: "not_started",
      band: null,
      attempts: 0,
    },
  ];

  const filteredTests = mockTests.filter((test) => {
    if (activeModule !== "all" && test.module !== activeModule) return false;
    if (searchQuery && !test.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const moduleIcons = {
    full: <FileText className="w-5 h-5" />,
    listening: <Headphones className="w-5 h-5" />,
    reading: <BookOpen className="w-5 h-5" />,
    writing: <Pencil className="w-5 h-5" />,
    speaking: <Mic className="w-5 h-5" />,
  };

  const moduleColors = {
    full: "bg-brand-navy-50 text-brand-navy-900",
    listening: "bg-blue-50 text-blue-600",
    reading: "bg-green-50 text-green-600",
    writing: "bg-purple-50 text-purple-600",
    speaking: "bg-orange-50 text-orange-600",
  };

  const difficultyColors = {
    easy: "text-green-600",
    medium: "text-yellow-600",
    hard: "text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">IELTS Mock Tests</h1>
          <p className="text-gray-500">
            Practice with our realistic computer-based IELTS mock tests. Choose a module or take the full test.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeModule}
            onChange={(id) => setActiveModule(id as ModuleFilter)}
            variant="default"
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 w-64"
            />
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} hover className="overflow-hidden">
              {/* Card Header */}
              <div className={`px-6 py-3 ${moduleColors[test.module]} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {moduleIcons[test.module]}
                  <span className="text-sm font-medium capitalize">{test.module === "full" ? "Full Mock" : test.module}</span>
                </div>
                <Badge variant={test.access === "free" ? "free" : "paid"}>
                  {test.access === "free" ? "Free" : "Premium"}
                </Badge>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{test.title}</h3>

                <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {test.questions} Q
                  </span>
                  <span className={`font-medium capitalize ${difficultyColors[test.difficulty as keyof typeof difficultyColors]}`}>
                    {test.difficulty}
                  </span>
                </div>

                {/* Status */}
                {test.status === "completed" && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">Band {test.band}</span>
                  </div>
                )}
                {test.status === "in_progress" && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
                    <Play className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">In Progress</span>
                  </div>
                )}
                {test.status === "pending" && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700 font-medium">Awaiting Feedback</span>
                  </div>
                )}

                {/* Action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {test.attempts > 0 ? `${test.attempts} attempt(s)` : "Not attempted"}
                  </span>
                  <Link href={`/exam/${test.module}/${test.id}`}>
                    <Button
                      variant={test.status === "in_progress" ? "secondary" : "primary"}
                      size="sm"
                      leftIcon={test.access === "paid" && test.status === "not_started" ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    >
                      {test.status === "in_progress" ? "Continue" : test.status === "completed" ? "Retake" : "Start"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tests Found</h3>
            <p className="text-gray-500">Try changing your filter or search query.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
