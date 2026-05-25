"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button, Tabs, Modal, ConfirmModal, Input, Skeleton } from "@/components/ui";
import { testsService } from "@/lib/services";
import { useAuthStore } from "@/stores/authStore";
import type { TestRow, TestModule, TestStatus } from "@/types/database";
import {
  Plus, Search, Eye, Edit, Trash2, Copy,
  Headphones, BookOpen, Pencil, Mic, FileText,
  Globe, Lock, CheckCircle, Archive,
} from "lucide-react";

export default function AdminTestsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch tests
  const fetchTests = useCallback(async () => {
    setLoading(true);
    const moduleFilter = activeTab === "all" ? undefined : activeTab as TestModule;
    const result = await testsService.listTests({
      module: moduleFilter,
      status: statusFilter as TestStatus || undefined,
    });
    if (result.success && result.data) {
      setTests(result.data);
    }
    setLoading(false);
  }, [activeTab, statusFilter]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  // Filtered tests
  const filteredTests = tests.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (accessFilter && t.access !== accessFilter) return false;
    return true;
  });

  const tabCounts = {
    all: tests.length,
    listening: tests.filter(t => t.module === "listening").length,
    reading: tests.filter(t => t.module === "reading").length,
    writing: tests.filter(t => t.module === "writing").length,
    speaking: tests.filter(t => t.module === "speaking").length,
    full: tests.filter(t => t.module === "full").length,
  };

  const tabs = [
    { id: "all", label: "All Tests", count: tabCounts.all },
    { id: "listening", label: "Listening", count: tabCounts.listening },
    { id: "reading", label: "Reading", count: tabCounts.reading },
    { id: "writing", label: "Writing", count: tabCounts.writing },
    { id: "speaking", label: "Speaking", count: tabCounts.speaking },
    { id: "full", label: "Full Mock", count: tabCounts.full },
  ];


  const moduleIcons: Record<string, React.ReactNode> = {
    listening: <Headphones className="w-4 h-4" />,
    reading: <BookOpen className="w-4 h-4" />,
    writing: <Pencil className="w-4 h-4" />,
    speaking: <Mic className="w-4 h-4" />,
    full: <FileText className="w-4 h-4" />,
  };

  // Actions
  const handlePublish = async (id: string) => {
    setActionLoading(id);
    await testsService.publishTest(id);
    await fetchTests();
    setActionLoading(null);
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(id);
    await testsService.unpublishTest(id);
    await fetchTests();
    setActionLoading(null);
  };

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    await testsService.archiveTest(id);
    await fetchTests();
    setActionLoading(null);
  };

  const handleDuplicate = async (id: string) => {
    setActionLoading(id);
    await testsService.duplicateTest(id);
    await fetchTests();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    await testsService.deleteTest(id);
    setShowDeleteConfirm(null);
    await fetchTests();
    setActionLoading(null);
  };

  return (
    <DashboardLayout title="Test Management" subtitle="Create, edit, and manage all IELTS mock tests.">
      {/* Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="default" />
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All Access</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </Card>


      {/* Tests Table */}
      {loading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </Card>
      ) : filteredTests.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No tests found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery ? "Try adjusting your search query." : "Create your first test to get started."}
          </p>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            Create Test
          </Button>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{test.title}</p>
                      {test.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{test.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {moduleIcons[test.module]}
                        <span className="text-sm text-gray-600 capitalize">{test.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={test.status === "published" ? "success" : test.status === "archived" ? "default" : "warning"}>
                        {test.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={test.access === "free" ? "free" : "paid"}>
                        {test.access === "free" ? <><Globe className="w-3 h-3 mr-1" />Free</> : <><Lock className="w-3 h-3 mr-1" />Paid</>}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{test.total_questions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{new Date(test.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {test.status === "draft" && (
                          <button
                            onClick={() => handlePublish(test.id)}
                            className="p-1.5 rounded hover:bg-green-100 text-green-600"
                            title="Publish"
                            disabled={actionLoading === test.id}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {test.status === "published" && (
                          <button
                            onClick={() => handleUnpublish(test.id)}
                            className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"
                            title="Unpublish"
                            disabled={actionLoading === test.id}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(test.id)}
                          className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                          title="Duplicate"
                          disabled={actionLoading === test.id}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(test.id)}
                          className="p-1.5 rounded hover:bg-red-100 text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {filteredTests.length} tests</p>
          </div>
        </Card>
      )}


      {/* Create Test Modal */}
      {showCreateModal && (
        <CreateTestModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchTests(); }}
          userId={user?.id || ""}
        />
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={true}
          title="Delete Test"
          message="Are you sure you want to delete this test? This action cannot be undone. All associated questions, attempts, and scores will be permanently removed."
          confirmText="Delete"
          variant="danger"
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onClose={() => setShowDeleteConfirm(null)}
          isLoading={actionLoading === showDeleteConfirm}
        />
      )}
    </DashboardLayout>
  );
}

// ==========================================
// CREATE TEST MODAL
// ==========================================

function CreateTestModal({ onClose, onCreated, userId }: { onClose: () => void; onCreated: () => void; userId: string }) {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState<TestModule>("listening");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(30);
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [access, setAccess] = useState("free");
  const [testType, setTestType] = useState("academic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-set defaults based on module
  useEffect(() => {
    switch (module) {
      case "listening": setDuration(30); setTotalQuestions(40); break;
      case "reading": setDuration(60); setTotalQuestions(40); break;
      case "writing": setDuration(60); setTotalQuestions(2); break;
      case "speaking": setDuration(14); setTotalQuestions(12); break;
      case "full": setDuration(170); setTotalQuestions(0); break;
    }
  }, [module]);

  const handleCreate = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    setError("");
    setLoading(true);

    const result = await testsService.createTest({
      title: title.trim(),
      description: description.trim() || undefined,
      module,
      difficulty: difficulty as "easy" | "medium" | "hard",
      duration_minutes: duration,
      total_questions: totalQuestions,
      access: access as "free" | "paid",
      test_type: testType as "academic" | "general",
      created_by: userId,
    });

    if (result.success) {
      onCreated();
    } else {
      setError(result.error || "Failed to create test");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Test" size="lg">
      <div className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        <Input label="Test Title *" placeholder="e.g., IELTS Listening Practice Test #3" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module *</label>
            <select value={module} onChange={(e) => setModule(e.target.value as TestModule)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="speaking">Speaking</option>
              <option value="full">Full Mock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
            <select value={testType} onChange={(e) => setTestType(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
            <input type="number" value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access</label>
          <select value={access} onChange={(e) => setAccess(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of this test..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} isLoading={loading}>Create Test</Button>
        </div>
      </div>
    </Modal>
  );
}
