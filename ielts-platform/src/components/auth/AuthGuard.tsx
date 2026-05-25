"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types/database";
import { Skeleton } from "@/components/ui";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Client-side route protection component
 * Wraps pages that require authentication
 */
export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for hydration
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.replace(redirectTo);
      return;
    }

    // Check role access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard
      switch (user.role) {
        case "admin":
        case "super_admin":
          router.replace("/admin");
          break;
        case "teacher":
          router.replace("/teacher");
          break;
        case "student":
          router.replace("/student");
          break;
        default:
          router.replace("/");
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, redirectTo, router]);

  // Show loading state during hydration
  if (isLoading) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback || <AuthGuardSkeleton />;
  }

  return <>{children}</>;
}

function AuthGuardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-navy-200 border-t-brand-navy-900 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default AuthGuard;
