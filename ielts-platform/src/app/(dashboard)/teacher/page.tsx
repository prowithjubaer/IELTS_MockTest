"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button, Skeleton } from "@/components/ui";
import { dashboardService, scoringService } from "@/lib/services";
import { useAuthStore } from "@/stores/authStore";
import type { TeacherDashboardStats } from "@/types/database";
import {
  Pencil, Mic, CheckCircle, Clock, Eye, Users,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [pending, setPending] = useState<{ id: string; student_name: string; test_title: string; module: string; submitted_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        dashboardService.getTeacherStats(user.id),
        scoringService.getPendingSubmissions(),
      ]);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (pendingRes.success && pendingRes.data) setPending(pendingRes.data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard" subtitle="Loading...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Review student submissions and provide feedback.">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Writing</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats?.pendingWriting || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Pencil className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Speaking</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats?.pendingSpeaking || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviewed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats?.totalReviewed || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assigned Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats?.assignedStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Submissions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CardTitle>Submissions to Review</CardTitle>
            {pending.length > 0 && <Badge variant="warning" size="md">{pending.length} pending</Badge>}
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">All caught up!</h3>
            <p className="text-sm text-gray-500">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Module</th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-navy-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-brand-navy-700">{item.student_name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.student_name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={item.module === "writing" ? "info" : "completed"}>
                        <span className="flex items-center gap-1">
                          {item.module === "writing" ? <Pencil className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                          {item.module}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{item.test_title}</td>
                    <td className="py-4">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <Button variant="primary" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
