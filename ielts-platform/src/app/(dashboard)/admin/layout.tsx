"use client";

import { AuthGuard } from "@/components/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["admin", "super_admin"]}>
      {children}
    </AuthGuard>
  );
}
