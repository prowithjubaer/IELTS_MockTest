"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import {
  ClipboardCheck,
  FileText,
  MessageSquare,
  Clock,
  Pencil,
  Mic,
  Eye,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const stats = [
    { label: "Pending Reviews", value: "8", icon: <Clock className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
    { label: "Completed Today", value: "5", icon: <CheckCircle className="w-6 h-6" />, color: "bg-green-50 text-green-600" },
    { label: "Total Reviewed", value: "234", icon: <ClipboardCheck className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
    { label: "Avg Rating", value: "4.8", icon: <Star className="w-6 h-6" />, color: "bg-yellow-50 text-yellow-600" },
  ];

  const pendingSubmissions = [
    { id: 1, student: "Rahim Uddin", module: "Writing", task: "Academic Task 2 - Opinion Essay", submitted: "30 min ago", wordCount: 287 },
    { id: 2, student: "Fatima Akter", module: "Speaking", task: "Speaking Test #3 - Full Test", submitted: "1 hour ago", duration: "12 min" },
    { id: 3, student: "Kabir Hossain", module: "Writing", task: "GT Task 1 - Formal Letter", submitted: "2 hours ago", wordCount: 168 },
    { id: 4, student: "Nusrat Jahan", module: "Writing", task: "Academic Task 1 - Line Graph", submitted: "3 hours ago", wordCount: 172 },
    { id: 5, student: "Tanvir Islam", module: "Speaking", task: "Speaking Test #5 - Part 2 & 3", submitted: "4 hours ago", duration: "8 min" },
  ];

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Review student submissions and provide feedback.">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Submissions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CardTitle>Pending Submissions</CardTitle>
            <Badge variant="warning" size="md">{pendingSubmissions.length} to review</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Writing Only</Button>
            <Button variant="ghost" size="sm">Speaking Only</Button>
          </div>
        </div>

        <div className="space-y-3">
          {pendingSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-navy-200 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  submission.module === "Writing" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {submission.module === "Writing" ? <Pencil className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{submission.student}</p>
                  <p className="text-xs text-gray-500">{submission.task}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">{submission.submitted}</p>
                  <p className="text-xs text-gray-400">
                    {submission.wordCount ? `${submission.wordCount} words` : submission.duration}
                  </p>
                </div>
                <Badge variant={submission.module === "Writing" ? "info" : "completed"}>
                  {submission.module}
                </Badge>
                <Link href={`/teacher/marking/${submission.id}`}>
                  <Button variant="secondary" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Marking Guidelines */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <CardTitle className="mb-4">Writing Rubric</CardTitle>
          <div className="space-y-2">
            {[
              "Task Achievement / Task Response",
              "Coherence & Cohesion",
              "Lexical Resource",
              "Grammatical Range & Accuracy",
            ].map((criterion) => (
              <div key={criterion} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">{criterion}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="mb-4">Speaking Rubric</CardTitle>
          <div className="space-y-2">
            {[
              "Fluency & Coherence",
              "Lexical Resource",
              "Grammatical Range & Accuracy",
              "Pronunciation",
            ].map((criterion) => (
              <div key={criterion} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">{criterion}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
