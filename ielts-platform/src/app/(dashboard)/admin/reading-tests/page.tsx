"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Search, Eye, Edit, Trash2, Copy, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AdminReadingTestsPage() {
  const tests = [
    { id: "reading-test-001", title: "IELTS Academic Reading Practice Test 01", test_type: "academic", difficulty: "medium", status: "published", access: "free", attempts: 278, passages: 3, questions: 40, created: "Jan 8, 2024" },
    { id: "reading-test-002", title: "IELTS Academic Reading Practice Test 02", test_type: "academic", difficulty: "hard", status: "draft", access: "paid", attempts: 0, passages: 3, questions: 40, created: "Jan 15, 2024" },
    { id: "reading-test-003", title: "IELTS General Training Reading Test 01", test_type: "general", difficulty: "easy", status: "published", access: "paid", attempts: 134, passages: 3, questions: 40, created: "Dec 22, 2023" },
  ];

  return (
    <DashboardLayout title="Reading Tests" subtitle="Create and manage IELTS Reading mock tests.">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search reading tests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200" />
        </div>
        <Link href="/admin/reading-tests/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Create Reading Test</Button>
        </Link>
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
                      <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.passages} passages • {test.questions} questions</p>
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.attempts}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{test.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/reading/${test.id}`}><button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview"><Eye className="w-4 h-4" /></button></Link>
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
