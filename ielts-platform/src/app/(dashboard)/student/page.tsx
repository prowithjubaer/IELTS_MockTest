"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button, Progress, Skeleton } from "@/components/ui";
import { dashboardService, attemptsService } from "@/lib/services";
import { useAuthStore } from "@/stores/authStore";
import type { StudentDashboardStats, AttemptWithScore } from "@/types/database";
import {
  Headphones, BookOpen, Pencil, Mic, Trophy, Clock,
  TrendingUp, PlayCircle, ArrowRight, CheckCircle,
  AlertCircle, Calendar,
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<AttemptWithScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);

      const [statsRes, attemptsRes] = await Promise.all([
        dashboardService.getStudentStats(user.id),
        attemptsService.getStudentAttempts(user.id),
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (attemptsRes.success && attemptsRes.data) setRecentAttempts(attemptsRes.data.slice(0, 5));
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your IELTS preparation overview...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const overallBand = stats?.overallBand || 0;
  const moduleScores = stats?.moduleScores || { listening: null, reading: null, writing: null, speaking: null };

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your IELTS preparation overview.">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Band</p>
              <p className="text-3xl font-bold text-brand-navy-900 mt-1">{overallBand || "—"}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.testsTaken || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-1">{Math.round((stats?.testsTaken || 0) * 1.5)}</p>
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
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats?.pendingFeedback || 0}</p>
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
              <Link href="/tests" className="text-sm text-brand-red-500 hover:underline flex items-center gap-1">
                Take Test <ArrowRight className="w-3 h-3" />
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
                    <span className="text-2xl font-bold text-gray-900">{item.score ?? "—"}</span>
                    {item.score && <Progress value={item.score} max={9} size="sm" color="navy" className="w-20" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Attempts */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Recent Attempts</CardTitle>
            </div>
            {recentAttempts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No attempts yet. Start your first test!</p>
                <Link href="/tests">
                  <Button variant="primary" size="sm" className="mt-3">Browse Tests</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-navy-50 rounded-lg flex items-center justify-center">
                        {attempt.module === "listening" ? <Headphones className="w-4 h-4 text-brand-navy-900" /> :
                         attempt.module === "reading" ? <BookOpen className="w-4 h-4 text-brand-navy-900" /> :
                         attempt.module === "writing" ? <Pencil className="w-4 h-4 text-brand-navy-900" /> :
                         attempt.module === "speaking" ? <Mic className="w-4 h-4 text-brand-navy-900" /> :
                         <Trophy className="w-4 h-4 text-brand-navy-900" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{attempt.module} Test</p>
                        <p className="text-xs text-gray-500">{new Date(attempt.started_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {attempt.status === "completed" || attempt.status === "reviewed" ? (
                        <span className="text-lg font-bold text-brand-navy-900">
                          {(attempt as unknown as { score?: { band_score: number } }).score?.band_score ?? "—"}
                        </span>
                      ) : attempt.status === "pending_review" ? (
                        <Badge variant="pending">Pending Review</Badge>
                      ) : (
                        <Badge variant="warning">In Progress</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-brand-red-500">
            <div className="flex items-center gap-2 mb-3">
              <PlayCircle className="w-5 h-5 text-brand-red-500" />
              <h3 className="font-semibold text-gray-900">Take a Test</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Practice with real IELTS-style tests. Choose a module or take a full mock.
            </p>
            <Link href="/tests">
              <Button variant="primary" size="sm" fullWidth>Browse Tests</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Band Score Target</CardTitle>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-red-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Target: 7.5</p>
                <p className="text-xs text-gray-500">
                  {overallBand ? `Current: ${overallBand} (${overallBand >= 7.5 ? "Achieved!" : `${(7.5 - overallBand).toFixed(1)} to go`})` : "Start practicing!"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Quick Links</CardTitle>
            <div className="space-y-3">
              <Link href="/tests?module=listening" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="text-sm font-medium text-blue-900">Listening Practice</p>
                <p className="text-xs text-blue-700 mt-1">30 min · 40 questions</p>
              </Link>
              <Link href="/tests?module=writing" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <p className="text-sm font-medium text-purple-900">Writing Practice</p>
                <p className="text-xs text-purple-700 mt-1">60 min · Expert feedback</p>
              </Link>
              <Link href="/tests?module=speaking" className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <p className="text-sm font-medium text-orange-900">Speaking Practice</p>
                <p className="text-xs text-orange-700 mt-1">14 min · Record answers</p>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
