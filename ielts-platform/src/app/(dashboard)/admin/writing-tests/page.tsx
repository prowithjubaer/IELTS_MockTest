"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Search, Eye, Edit, Trash2, Copy, Pencil } from "lucide-react";
import Link from "next/link";

export default function AdminWritingTestsPage() {
  const tests = [
    { id: "writing-test-001", title: "IELTS Academic Writing Practice Test 01", test_type: "academic", difficulty: "medium", status: "published", access: "free", submissions: 156, tasks: 2, created: "Jan 10, 2024" },
    { id: "writing-test-002", title: "IELTS Academic Writing Practice Test 02", test_type: "academic", difficulty: "hard", status: "draft", access: "paid", submissions: 0, tasks: 2, created: "Jan 18, 2024" },
    { id: "writing-test-003", title: "IELTS General Training Writing Test 01", test_type: "general", difficulty: "easy", status: "published", access: "paid", submissions: 89, tasks: 2, created: "Dec 28, 2023" },
  ];

  return (
    <DashboardLayout title="Writing Tests" subtitle="Create and manage IELTS Writing mock tests.">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search writing tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200" />
        </div>
        <Link href="/admin/writing-tests/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Create Writing Test</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Tests</p>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Submissions</p>
          <p className="text-2xl font-bold text-purple-600">245</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg Band Score</p>
          <p className="text-2xl font-bold text-green-600">5.8</p>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
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
                      <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Pencil className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.tasks} tasks</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={test.test_type === "academic" ? "info" : "default"} className="capitalize">{test.test_type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={test.status === "published" ? "success" : "default"}>{test.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={test.access === "free" ? "free" : "paid"}>{test.access}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm capitalize",
                      test.difficulty === "easy" ? "text-green-600" : test.difficulty === "hard" ? "text-red-600" : "text-yellow-600"
                    )}>{test.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.submissions}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{test.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/writing/${test.id}`}><button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview"><Eye className="w-4 h-4" /></button></Link>
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
