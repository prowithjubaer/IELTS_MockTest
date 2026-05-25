import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

// Demo users for development
const demoUsers: Record<string, User> = {
  "admin@proenglishbd.com": {
    id: "admin-001",
    email: "admin@proenglishbd.com",
    name: "Admin User",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "teacher@proenglishbd.com": {
    id: "teacher-001",
    email: "teacher@proenglishbd.com",
    name: "Sarah Johnson",
    role: "teacher",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "student@proenglishbd.com": {
    id: "student-001",
    email: "student@proenglishbd.com",
    name: "Jubayer Ahmed",
    role: "student",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const user = demoUsers[email];
        if (user) {
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          // Create a student user for any other email
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name: email.split("@")[0],
            role: "student",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        }
      },

      register: async (name: string, email: string, _password: string, role?: UserRole) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: role || "student",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      hasRole: (roles: UserRole[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
