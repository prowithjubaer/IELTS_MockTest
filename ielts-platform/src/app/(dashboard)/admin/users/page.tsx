"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button, Tabs, Skeleton } from "@/components/ui";
import { dashboardService } from "@/lib/services";
import type { ProfileRow } from "@/types/database";
import { Search, Users, Shield, GraduationCap, BookOpen } from "lucide-react";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const roleFilter = activeTab === "all" ? undefined : activeTab;
    const result = await dashboardService.listUsers({
      role: roleFilter,
      search: searchQuery || undefined,
    });
    if (result.success && result.data) {
      setUsers(result.data);
    }
    setLoading(false);
  }, [activeTab, searchQuery]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "student", label: "Students" },
    { id: "teacher", label: "Teachers" },
    { id: "admin", label: "Admins" },
  ];

  const roleIcons: Record<string, React.ReactNode> = {
    student: <GraduationCap className="w-4 h-4 text-blue-600" />,
    teacher: <BookOpen className="w-4 h-4 text-green-600" />,
    admin: <Shield className="w-4 h-4 text-purple-600" />,
    super_admin: <Shield className="w-4 h-4 text-red-600" />,
  };

  const roleColors: Record<string, string> = {
    student: "info",
    teacher: "success",
    admin: "warning",
    super_admin: "paid",
  };

  return (
    <DashboardLayout title="User Management" subtitle="Manage students, teachers, and administrators.">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="default" />
      </div>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200"
          />
        </div>
      </Card>

      {loading ? (
        <Card className="p-6"><div className="space-y-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></Card>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No users found</h3>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-navy-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-navy-700">{u.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {roleIcons[u.role]}
                        <Badge variant={(roleColors[u.role] || "default") as "info" | "success" | "warning" | "paid" | "default"}>
                          {u.role.replace("_", " ")}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.is_active ? "success" : "default"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {users.length} users</p>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
