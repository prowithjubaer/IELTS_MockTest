"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button, Skeleton } from "@/components/ui";
import { dashboardService, scoringService } from "@/lib/services";
import type { AdminDashboardStats } from "@/types/database";
import {
  Users, FileText, BarChart3, TrendingUp,
  CheckCircle, Eye, Plus,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<{ id: string; student_name: string; test_title: string; module: string; submitted_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        dashboardService.getAdminStats(),
        scoringService.getPendingSubmissions(),
      ]);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (pendingRes.success && pendingRes.data) setPendingSubmissions(pendingRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" subtitle="Loading...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Students", value: stats?.totalStudents?.toLocaleString() || "0", icon: <Users className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Tests", value: stats?.totalTests?.toString() || "0", icon: <FileText className="w-6 h-6" />, color: "bg-green-50 text-green-600" },
    { label: "Tests Taken", value: stats?.totalAttempts?.toLocaleString() || "0", icon: <BarChart3 className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
    { label: "Pending Reviews", value: ((stats?.pendingWriting || 0) + (stats?.pendingSpeaking || 0)).toString(), icon: <TrendingUp className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of your IELTS platform.">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Feedback */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CardTitle>Pending Feedback</CardTitle>
                {pendingSubmissions.length > 0 && (
                  <Badge variant="warning" size="md">{pendingSubmissions.length} pending</Badge>
                )}
              </div>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">All caught up! No pending reviews.</p>
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
                    {pendingSubmissions.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">{item.student_name}</td>
                        <td className="py-3">
                          <Badge variant={item.module === "writing" ? "info" : "completed"}>
                            {item.module}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{item.test_title}</td>
                        <td className="py-3 text-sm text-gray-500">{new Date(item.submitted_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Create Test", icon: <Plus className="w-5 h-5" />, href: "/admin/tests", color: "bg-brand-red-50 text-brand-red-600" },
              { label: "Manage Users", icon: <Users className="w-5 h-5" />, href: "/admin/users", color: "bg-blue-50 text-blue-600" },
              { label: "View Results", icon: <BarChart3 className="w-5 h-5" />, href: "/admin/tests", color: "bg-green-50 text-green-600" },
              { label: "Settings", icon: <FileText className="w-5 h-5" />, href: "/admin/settings", color: "bg-gray-50 text-gray-600" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <Card hover className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-lg mx-auto flex items-center justify-center ${action.color}`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">{action.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="p-6">
            <CardTitle className="mb-4">Platform Stats</CardTitle>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Writing</span>
                <span className="text-sm font-medium text-gray-900">{stats?.pendingWriting || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Speaking</span>
                <span className="text-sm font-medium text-gray-900">{stats?.pendingSpeaking || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Full Mocks Completed</span>
                <span className="text-sm font-medium text-gray-900">{stats?.completedFullMocks || 0}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-gray-600">Server Status</span>
                <Badge variant="success">Online</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
