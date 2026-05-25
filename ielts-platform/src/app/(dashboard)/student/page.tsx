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
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  // Mock data
  const overallBand = 6.5;
  const moduleScores = {
    listening: 7.0,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.5,
  };

  const recentAttempts = [
    { id: 1, title: "IELTS Mock Test #5", module: "Full Test", band: 6.5, date: "2024-01-15", status: "completed" },
    { id: 2, title: "Listening Practice #3", module: "Listening", band: 7.0, date: "2024-01-14", status: "completed" },
    { id: 3, title: "Writing Task - Academic", module: "Writing", band: null, date: "2024-01-13", status: "pending" },
    { id: 4, title: "Reading Practice #7", module: "Reading", band: 6.5, date: "2024-01-12", status: "completed" },
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
              <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Study Hours</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">48</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
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
        {/* Module-wise Performance */}
        <div className="lg:col-span-2">
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

          {/* Recent Attempts */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Recent Attempts</CardTitle>
              <Link href="/student/tests" className="text-sm text-brand-red-500 hover:underline">
                See All
              </Link>
            </div>

            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy-50 rounded-lg flex items-center justify-center">
                      {attempt.module === "Listening" ? <Headphones className="w-4 h-4 text-brand-navy-900" /> :
                       attempt.module === "Reading" ? <BookOpen className="w-4 h-4 text-brand-navy-900" /> :
                       attempt.module === "Writing" ? <Pencil className="w-4 h-4 text-brand-navy-900" /> :
                       <Trophy className="w-4 h-4 text-brand-navy-900" />}
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
                      <Badge variant="pending">Pending Review</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Continue Test */}
          <Card className="p-6 border-l-4 border-l-brand-red-500">
            <div className="flex items-center gap-2 mb-3">
              <PlayCircle className="w-5 h-5 text-brand-red-500" />
              <h3 className="font-semibold text-gray-900">Continue Test</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              You have an unfinished Listening test. Continue from where you left off.
            </p>
            <Button variant="primary" size="sm" fullWidth>
              Continue Test
            </Button>
          </Card>

          {/* Band Score History */}
          <Card className="p-6">
            <CardTitle className="mb-4">Band Score History</CardTitle>
            <div className="space-y-3">
              {[7.0, 6.5, 6.5, 6.0, 5.5].map((band, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Test #{5 - i}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-navy-900 rounded-full"
                        style={{ width: `${(band / 9) * 100}%` }}
                      />
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
              <Link href="/tests" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="text-sm font-medium text-blue-900">Listening Practice #8</p>
                <p className="text-xs text-blue-700 mt-1">Focus on map labelling</p>
              </Link>
              <Link href="/tests" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <p className="text-sm font-medium text-purple-900">Writing Task 2</p>
                <p className="text-xs text-purple-700 mt-1">Opinion essay practice</p>
              </Link>
            </div>
          </Card>

          {/* Upcoming */}
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
