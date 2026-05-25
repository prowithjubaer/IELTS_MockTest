"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import {
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "5,234", change: "+12%", icon: <Users className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Tests", value: "156", change: "+5", icon: <FileText className="w-6 h-6" />, color: "bg-green-50 text-green-600" },
    { label: "Tests Taken", value: "12,847", change: "+340", icon: <BarChart3 className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
    { label: "Avg Band Score", value: "6.8", change: "+0.3", icon: <TrendingUp className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
  ];

  const pendingFeedback = [
    { id: 1, student: "Rahim Uddin", module: "Writing", test: "Academic Task 2", submitted: "2 hours ago" },
    { id: 2, student: "Fatima Akter", module: "Speaking", test: "Speaking Test #3", submitted: "4 hours ago" },
    { id: 3, student: "Kabir Hossain", module: "Writing", test: "GT Task 1", submitted: "6 hours ago" },
    { id: 4, student: "Nusrat Jahan", module: "Speaking", test: "Speaking Test #5", submitted: "8 hours ago" },
  ];

  const recentActivity = [
    { action: "New student registered", user: "Tanvir Islam", time: "5 min ago" },
    { action: "Writing feedback published", user: "Sarah Johnson (Teacher)", time: "15 min ago" },
    { action: "New test published", user: "Admin", time: "1 hour ago" },
    { action: "Payment received", user: "Anika Rahman", time: "2 hours ago" },
    { action: "Speaking test submitted", user: "Mashfiq Ahmed", time: "3 hours ago" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of your IELTS platform.">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{stat.change} this month</p>
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
                <Badge variant="warning" size="md">4 pending</Badge>
              </div>
              <Link href="/admin/feedback">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

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
                  {pendingFeedback.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{item.student}</td>
                      <td className="py-3">
                        <Badge variant={item.module === "Writing" ? "info" : "completed"}>
                          {item.module}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{item.test}</td>
                      <td className="py-3 text-sm text-gray-500">{item.submitted}</td>
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
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Create Test", icon: <Plus className="w-5 h-5" />, href: "/admin/tests", color: "bg-brand-red-50 text-brand-red-600" },
              { label: "Manage Users", icon: <Users className="w-5 h-5" />, href: "/admin/users", color: "bg-blue-50 text-blue-600" },
              { label: "View Results", icon: <BarChart3 className="w-5 h-5" />, href: "/admin/results", color: "bg-green-50 text-green-600" },
              { label: "Settings", icon: <AlertTriangle className="w-5 h-5" />, href: "/admin/settings", color: "bg-gray-50 text-gray-600" },
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

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <CardTitle className="mb-4">Recent Activity</CardTitle>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 bg-brand-navy-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} &middot; {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Health */}
          <Card className="p-6 mt-6">
            <CardTitle className="mb-4">Platform Health</CardTitle>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">2.4 GB / 10 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-gray-900">143 online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
