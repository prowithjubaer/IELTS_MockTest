"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Search, Eye, Edit, Trash2, Copy, Mic } from "lucide-react";
import Link from "next/link";

export default function AdminSpeakingTestsPage() {
  const tests = [
    { id: "speaking-test-001", title: "IELTS Speaking Practice Test 01", difficulty: "medium", status: "published", access: "free", submissions: 89, parts: 3, questions: 12, created: "Jan 12, 2024" },
    { id: "speaking-test-002", title: "IELTS Speaking Practice Test 02", difficulty: "hard", status: "draft", access: "paid", submissions: 0, parts: 3, questions: 11, created: "Jan 20, 2024" },
  ];

  return (
    <DashboardLayout title="Speaking Tests" subtitle="Create and manage IELTS Speaking mock tests.">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search speaking tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200" />
        </div>
        <Link href="/admin/speaking-tests/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Create Speaking Test</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-sm text-gray-500">Total Tests</p><p className="text-2xl font-bold text-gray-900">2</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Total Submissions</p><p className="text-2xl font-bold text-orange-600">89</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Pending Review</p><p className="text-2xl font-bold text-orange-600">5</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Avg Band Score</p><p className="text-2xl font-bold text-green-600">6.2</p></Card>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Mic className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.parts} parts • {test.questions} questions</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={test.status === "published" ? "success" : "default"}>{test.status}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={test.access === "free" ? "free" : "paid"}>{test.access}</Badge></td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm capitalize", test.difficulty === "easy" ? "text-green-600" : test.difficulty === "hard" ? "text-red-600" : "text-yellow-600")}>{test.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.submissions}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{test.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/speaking/${test.id}`}><button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview"><Eye className="w-4 h-4" /></button></Link>
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
