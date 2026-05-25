"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, type AuthUser } from "@/lib/services";
import type { UserRole } from "@/types/database";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        const result = await authService.login(email, password);

        if (result.success && result.data) {
          set({
            user: result.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isLoading: false,
            error: result.error || "Login failed",
          });
          throw new Error(result.error || "Login failed");
        }
      },

      register: async (name: string, email: string, password: string, role?: UserRole) => {
        set({ isLoading: true, error: null });
        const result = await authService.register(name, email, password, role || "student");

        if (result.success && result.data) {
          set({
            user: result.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isLoading: false,
            error: result.error || "Registration failed",
          });
          throw new Error(result.error || "Registration failed");
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      refreshUser: async () => {
        const result = await authService.getCurrentUser();
        if (result.success && result.data) {
          set({ user: result.data, isAuthenticated: true });
        }
      },

      hasRole: (roles: UserRole[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
