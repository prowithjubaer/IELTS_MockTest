"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button, Progress } from "@/components/ui";
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  Trophy,
  Clock,
  TrendingUp,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  // Mock data
  const overallBand = 6.5;
  const moduleScores = {
    listening: 7.0,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.5,
  };

  const fullMockAttempts = [
    { id: "fma-001", title: "Full IELTS Mock Test 01", date: "Jan 20, 2024", listening: 7.0, reading: 6.5, writing: null, speaking: null, overall: null, status: "partially_checked" },
    { id: "fma-002", title: "Full IELTS Mock Test 01", date: "Jan 18, 2024", listening: 6.0, reading: 5.5, writing: 5.0, speaking: 5.5, overall: 5.5, status: "completed" },
  ];

  const recentAttempts = [
    { id: 1, title: "Listening Practice #3", module: "Listening", band: 7.0, date: "Jan 15, 2024", status: "completed" },
    { id: 2, title: "Academic Reading #1", module: "Reading", band: 6.5, date: "Jan 14, 2024", status: "completed" },
    { id: 3, title: "Writing Task - Academic", module: "Writing", band: null, date: "Jan 13, 2024", status: "pending" },
    { id: 4, title: "Speaking Test #1", module: "Speaking", band: null, date: "Jan 12, 2024", status: "pending" },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your IELTS preparation overview.">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Band</p>
              <p className="text-3xl font-bold text-brand-navy-900 mt-1">{overallBand}</p>
            </div>
            <div className="w-12 h-12 bg-brand-navy-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-brand-navy-900" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tests Taken</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">14</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Full Mocks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Feedback</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">2</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Full Mock Results */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-navy-900" /> Full Mock Test Results
              </CardTitle>
              <Link href="/tests" className="text-sm text-brand-red-500 hover:underline flex items-center gap-1">
                Take Mock <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-2 text-xs font-medium text-gray-500">Test</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">L</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">R</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">W</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">S</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">Overall</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fullMockAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <p className="text-sm font-medium text-gray-900">{attempt.title}</p>
                        <p className="text-xs text-gray-500">{attempt.date}</p>
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">{attempt.listening}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{attempt.reading}</td>
                      <td className="py-3">
                        {attempt.writing != null
                          ? <span className="text-sm font-medium text-gray-900">{attempt.writing}</span>
                          : <span className="text-xs text-orange-600">Pending</span>}
                      </td>
                      <td className="py-3">
                        {attempt.speaking != null
                          ? <span className="text-sm font-medium text-gray-900">{attempt.speaking}</span>
                          : <span className="text-xs text-orange-600">Pending</span>}
                      </td>
                      <td className="py-3">
                        {attempt.overall != null
                          ? <span className="text-lg font-bold text-brand-navy-900">{attempt.overall}</span>
                          : <span className="text-xs text-orange-600">Pending</span>}
                      </td>
                      <td className="py-3">
                        <Badge variant={attempt.status === "completed" ? "success" : "pending"}>
                          {attempt.status === "completed" ? "Complete" : "Partial"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Module-wise Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Module Performance</CardTitle>
              <Link href="/student/results" className="text-sm text-brand-red-500 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { module: "Listening", score: moduleScores.listening, icon: <Headphones className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
                { module: "Reading", score: moduleScores.reading, icon: <BookOpen className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
                { module: "Writing", score: moduleScores.writing, icon: <Pencil className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
                { module: "Speaking", score: moduleScores.speaking, icon: <Mic className="w-5 h-5" />, color: "text-orange-600 bg-orange-50" },
              ].map((item) => (
                <div key={item.module} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.module}</p>
                      <p className="text-xs text-gray-500">Latest score</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">{item.score}</span>
                    <Progress value={item.score} max={9} size="sm" color="navy" className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Module Attempts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Recent Module Tests</CardTitle>
              <Link href="/tests" className="text-sm text-brand-red-500 hover:underline">See All</Link>
            </div>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy-50 rounded-lg flex items-center justify-center">
                      {attempt.module === "Listening" ? <Headphones className="w-4 h-4 text-brand-navy-900" /> :
                       attempt.module === "Reading" ? <BookOpen className="w-4 h-4 text-brand-navy-900" /> :
                       attempt.module === "Writing" ? <Pencil className="w-4 h-4 text-brand-navy-900" /> :
                       <Mic className="w-4 h-4 text-brand-navy-900" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attempt.title}</p>
                      <p className="text-xs text-gray-500">{attempt.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {attempt.status === "completed" ? (
                      <span className="text-lg font-bold text-brand-navy-900">{attempt.band}</span>
                    ) : (
                      <Badge variant="pending">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Continue Full Mock */}
          <Card className="p-6 border-l-4 border-l-brand-red-500">
            <div className="flex items-center gap-2 mb-3">
              <PlayCircle className="w-5 h-5 text-brand-red-500" />
              <h3 className="font-semibold text-gray-900">Continue Full Mock</h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">Full IELTS Mock Test 01</p>
            <p className="text-xs text-gray-400 mb-4">Writing and Speaking pending feedback</p>
            <Link href="/mock-tests/full-mock-001/result">
              <Button variant="primary" size="sm" fullWidth>
                View Result
              </Button>
            </Link>
          </Card>

          {/* Pending Feedback */}
          <Card className="p-6">
            <CardTitle className="mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Pending Feedback
            </CardTitle>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                <Pencil className="w-4 h-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Writing Task - Academic</p>
                  <p className="text-xs text-gray-500">Submitted Jan 13</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                <Mic className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Speaking Test #1</p>
                  <p className="text-xs text-gray-500">Submitted Jan 12</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Band Score History */}
          <Card className="p-6">
            <CardTitle className="mb-4">Band Score Trend</CardTitle>
            <div className="space-y-3">
              {[7.0, 6.5, 6.5, 6.0, 5.5].map((band, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Mock #{5 - i}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-navy-900 rounded-full" style={{ width: `${(band / 9) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{band}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+1.5 improvement</span>
            </div>
          </Card>

          {/* Recommended */}
          <Card className="p-6">
            <CardTitle className="mb-4">Recommended</CardTitle>
            <div className="space-y-3">
              <Link href="/mock-tests/full-mock-001" className="block p-3 bg-brand-navy-50 rounded-lg hover:bg-brand-navy-100 transition-colors">
                <p className="text-sm font-medium text-brand-navy-900">Take Full Mock Test</p>
                <p className="text-xs text-brand-navy-700 mt-1">Complete all 4 modules</p>
              </Link>
              <Link href="/tests" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="text-sm font-medium text-blue-900">Listening Practice #4</p>
                <p className="text-xs text-blue-700 mt-1">Focus on map labelling</p>
              </Link>
            </div>
          </Card>

          {/* IELTS Exam Date */}
          <Card className="p-6">
            <CardTitle className="mb-4">IELTS Exam Date</CardTitle>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-red-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-brand-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">March 15, 2024</p>
                <p className="text-xs text-gray-500">52 days remaining</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
