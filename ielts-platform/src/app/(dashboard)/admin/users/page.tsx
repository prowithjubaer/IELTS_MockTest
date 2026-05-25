"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { Plus, Search, Eye, Edit, Ban, UserCheck, MoreVertical } from "lucide-react";

export default function AdminUsersPage() {
  const users = [
    { id: "1", name: "Jubayer Ahmed", email: "jubayer@email.com", role: "student", status: "active", tests: 12, joined: "Jan 5, 2024" },
    { id: "2", name: "Sarah Johnson", email: "sarah@email.com", role: "teacher", status: "active", tests: 0, joined: "Dec 20, 2023" },
    { id: "3", name: "Rahim Uddin", email: "rahim@email.com", role: "student", status: "active", tests: 8, joined: "Jan 2, 2024" },
    { id: "4", name: "Fatima Akter", email: "fatima@email.com", role: "student", status: "blocked", tests: 3, joined: "Dec 28, 2023" },
    { id: "5", name: "Kabir Hossain", email: "kabir@email.com", role: "student", status: "active", tests: 15, joined: "Nov 15, 2023" },
    { id: "6", name: "Dr. Rahman", email: "rahman@email.com", role: "teacher", status: "active", tests: 0, joined: "Oct 1, 2023" },
  ];

  return (
    <DashboardLayout title="User Management" subtitle="Manage all registered users, roles, and access.">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">5,234</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-2xl font-bold text-blue-600">5,218</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Teachers</p>
          <p className="text-2xl font-bold text-green-600">14</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Blocked</p>
          <p className="text-2xl font-bold text-red-600">2</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200"
            />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option>All Roles</option>
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add User
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-brand-navy-900">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === "teacher" ? "info" : "default"} className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === "active" ? "success" : "danger"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.tests}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded hover:bg-red-100 text-red-500"><Ban className="w-4 h-4" /></button>
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
