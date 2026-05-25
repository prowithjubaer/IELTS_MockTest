"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-200 focus:border-brand-navy-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red-500 rounded-full" />
              </button>

              {/* User */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-brand-navy-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-navy-900 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
