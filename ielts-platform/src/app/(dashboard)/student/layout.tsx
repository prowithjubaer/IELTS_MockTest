"use client";

import { AuthGuard } from "@/components/auth";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["student", "teacher", "admin", "super_admin"]}>
      {children}
    </AuthGuard>
  );
}
