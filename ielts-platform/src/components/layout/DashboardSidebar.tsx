"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  MessageSquare,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
  GraduationCap,
  Trophy,
  User,
  Bell,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
      case "super_admin":
        return [
          { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { href: "/admin/full-mock-tests", label: "Full Mock Tests", icon: <Trophy className="w-5 h-5" /> },
          { href: "/admin/listening-tests", label: "Listening", icon: <Headphones className="w-5 h-5" /> },
          { href: "/admin/reading-tests", label: "Reading", icon: <BookOpen className="w-5 h-5" /> },
          { href: "/admin/writing-tests", label: "Writing", icon: <Pencil className="w-5 h-5" /> },
          { href: "/admin/speaking-tests", label: "Speaking", icon: <Mic className="w-5 h-5" /> },
          { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
          { href: "/admin/tests", label: "All Tests", icon: <FileText className="w-5 h-5" /> },
          { href: "/admin/feedback", label: "Feedback", icon: <MessageSquare className="w-5 h-5" />, badge: 5 },
          { href: "/admin/results", label: "Results", icon: <ClipboardCheck className="w-5 h-5" /> },
          { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
          { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
        ];
      case "teacher":
        return [
          { href: "/teacher", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { href: "/teacher/writing", label: "Writing Reviews", icon: <Pencil className="w-5 h-5" />, badge: 3 },
          { href: "/teacher/speaking", label: "Speaking Reviews", icon: <Mic className="w-5 h-5" />, badge: 2 },
          { href: "/teacher/feedback", label: "Published", icon: <MessageSquare className="w-5 h-5" /> },
        ];
      default:
        return [
          { href: "/student", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { href: "/tests", label: "Mock Tests", icon: <Trophy className="w-5 h-5" /> },
          { href: "/student/results", label: "Results", icon: <ClipboardCheck className="w-5 h-5" /> },
          { href: "/student/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-brand-navy-950 text-white z-40 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-brand-navy-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-brand-navy-900 font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">Pro English</span>
              <span className="font-display font-bold text-brand-red-400 text-sm ml-1">BD</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
            <span className="text-brand-navy-900 font-bold text-sm">P</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-brand-navy-800 transition-colors",
            collapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-brand-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-navy-700 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-brand-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-brand-red-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-brand-navy-800 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="text-sm font-medium flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="bg-brand-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-brand-navy-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
