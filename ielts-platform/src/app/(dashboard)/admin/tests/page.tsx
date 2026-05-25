"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button, Tabs } from "@/components/ui";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  FileText,
} from "lucide-react";

export default function AdminTestsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Tests", count: 24 },
    { id: "listening", label: "Listening", count: 8 },
    { id: "reading", label: "Reading", count: 6 },
    { id: "writing", label: "Writing", count: 5 },
    { id: "speaking", label: "Speaking", count: 3 },
    { id: "full", label: "Full Mock", count: 2 },
  ];

  const tests = [
    { id: "1", title: "IELTS Listening Test #1", module: "listening", status: "published", access: "free", difficulty: "easy", attempts: 342, created: "Jan 5, 2024" },
    { id: "2", title: "Academic Reading Test #1", module: "reading", status: "published", access: "free", difficulty: "medium", attempts: 278, created: "Jan 3, 2024" },
    { id: "3", title: "Writing Task - Academic #1", module: "writing", status: "published", access: "paid", difficulty: "medium", attempts: 156, created: "Dec 28, 2023" },
    { id: "4", title: "Speaking Test #1", module: "speaking", status: "draft", access: "paid", difficulty: "medium", attempts: 0, created: "Dec 25, 2023" },
    { id: "5", title: "Full IELTS Mock Test #1", module: "full", status: "published", access: "paid", difficulty: "hard", attempts: 89, created: "Dec 20, 2023" },
    { id: "6", title: "IELTS Listening Test #2", module: "listening", status: "draft", access: "free", difficulty: "hard", attempts: 0, created: "Dec 18, 2023" },
  ];

  const moduleIcons: Record<string, React.ReactNode> = {
    listening: <Headphones className="w-4 h-4" />,
    reading: <BookOpen className="w-4 h-4" />,
    writing: <Pencil className="w-4 h-4" />,
    speaking: <Mic className="w-4 h-4" />,
    full: <FileText className="w-4 h-4" />,
  };

  return (
    <DashboardLayout title="Test Management" subtitle="Create, edit, and manage all IELTS mock tests.">
      {/* Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="default" />
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Create New Test
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by title..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Access</option>
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tests Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
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
                    <p className="text-sm font-medium text-gray-900">{test.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {moduleIcons[test.module]}
                      <span className="text-sm text-gray-600 capitalize">{test.module}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={test.status === "published" ? "success" : "default"}>
                      {test.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={test.access === "free" ? "free" : "paid"}>
                      {test.access}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{test.difficulty}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 font-medium">{test.attempts}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{test.created}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-100 text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-6 of 24 tests</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1.5 text-sm bg-brand-navy-900 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
