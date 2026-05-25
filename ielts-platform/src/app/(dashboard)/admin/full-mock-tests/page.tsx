"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Search, Eye, Edit, Trash2, Copy, Trophy } from "lucide-react";
import Link from "next/link";

export default function AdminFullMockTestsPage() {
  const tests = [
    { id: "full-mock-001", title: "Full IELTS Mock Test 01", difficulty: "medium", status: "published", access: "free", attempts: 89, modules: 4, created: "Jan 10, 2024" },
    { id: "full-mock-002", title: "Full IELTS Mock Test 02", difficulty: "hard", status: "draft", access: "paid", attempts: 0, modules: 4, created: "Jan 22, 2024" },
  ];

  return (
    <DashboardLayout title="Full Mock Tests" subtitle="Create and manage complete IELTS mock tests with all 4 modules.">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search full mock tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200" />
        </div>
        <Link href="/admin/full-mock-tests/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Create Full Mock Test</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-sm text-gray-500">Total Tests</p><p className="text-2xl font-bold text-gray-900">2</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Total Attempts</p><p className="text-2xl font-bold text-brand-navy-900">89</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Pending Feedback</p><p className="text-2xl font-bold text-orange-600">7</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Avg Overall Band</p><p className="text-2xl font-bold text-green-600">6.3</p></Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-navy-50 rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-brand-navy-900" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.modules} modules (L + R + W + S)</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={test.status === "published" ? "success" : "default"}>{test.status}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={test.access === "free" ? "free" : "paid"}>{test.access}</Badge></td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm capitalize", test.difficulty === "easy" ? "text-green-600" : test.difficulty === "hard" ? "text-red-600" : "text-yellow-600")}>{test.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.attempts}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{test.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/mock-tests/${test.id}`}><button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview"><Eye className="w-4 h-4" /></button></Link>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Duplicate"><Copy className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded hover:bg-red-100 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
