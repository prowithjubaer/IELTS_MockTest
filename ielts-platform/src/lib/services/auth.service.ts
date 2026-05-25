/**
 * Auth Service - Handles authentication with demo/production mode
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import type { ProfileRow, UserRole } from '@/types/database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  is_active: boolean;
}

// Demo users
const DEMO_USERS: Record<string, AuthUser> = {
  'admin@proenglishbd.com': {
    id: 'demo-admin-001',
    email: 'admin@proenglishbd.com',
    name: 'Admin User',
    role: 'admin',
    is_active: true,
  },
  'teacher@proenglishbd.com': {
    id: 'demo-teacher-001',
    email: 'teacher@proenglishbd.com',
    name: 'Sarah Johnson',
    role: 'teacher',
    is_active: true,
  },
  'student@proenglishbd.com': {
    id: 'demo-student-001',
    email: 'student@proenglishbd.com',
    name: 'Jubayer Ahmed',
    role: 'student',
    is_active: true,
  },
};

class AuthService extends BaseService {
  async login(email: string, password: string): Promise<ServiceResult<AuthUser>> {
    if (this.isDemo) {
      return this.demoLogin(email);
    }
    return this.supabaseLogin(email, password);
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'student'
  ): Promise<ServiceResult<AuthUser>> {
    if (this.isDemo) {
      return this.demoRegister(name, email, role);
    }
    return this.supabaseRegister(name, email, password, role);
  }


  async logout(): Promise<ServiceResult<void>> {
    if (this.isDemo) {
      return success(undefined);
    }
    const client = this.requireSupabase();
    const { error } = await client.auth.signOut();
    if (error) return failure(error.message);
    return success(undefined);
  }

  async getCurrentUser(): Promise<ServiceResult<AuthUser | null>> {
    if (this.isDemo) {
      return success(null);
    }
    const client = this.requireSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return success(null);

    // Fetch profile
    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return success(null);

    return success(this.profileToAuthUser(profile));
  }

  async resetPassword(email: string): Promise<ServiceResult<void>> {
    if (this.isDemo) {
      return success(undefined);
    }
    const client = this.requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });
    if (error) return failure(error.message);
    return success(undefined);
  }

  async updateProfile(userId: string, data: Partial<ProfileRow>): Promise<ServiceResult<AuthUser>> {
    if (this.isDemo) {
      const user = Object.values(DEMO_USERS).find(u => u.id === userId);
      if (!user) return failure('User not found');
      return success({ ...user, ...data } as AuthUser);
    }
    const client = this.requireSupabase();
    const { data: profile, error } = await client
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) return failure(error.message);
    return success(this.profileToAuthUser(profile));
  }


  // ==========================================
  // PRIVATE: Demo mode
  // ==========================================

  private async demoLogin(email: string): Promise<ServiceResult<AuthUser>> {
    await new Promise(r => setTimeout(r, 500));
    const user = DEMO_USERS[email];
    if (user) return success(user);
    // Create a student for unknown emails
    return success({
      id: `demo-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'student' as UserRole,
      is_active: true,
    });
  }

  private async demoRegister(name: string, email: string, role: UserRole): Promise<ServiceResult<AuthUser>> {
    await new Promise(r => setTimeout(r, 500));
    return success({
      id: `demo-${Date.now()}`,
      email,
      name,
      role,
      is_active: true,
    });
  }

  // ==========================================
  // PRIVATE: Supabase mode
  // ==========================================

  private async supabaseLogin(email: string, password: string): Promise<ServiceResult<AuthUser>> {
    const client = this.requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return failure(error.message);
    if (!data.user) return failure('Login failed');

    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) return failure('Profile not found');
    return success(this.profileToAuthUser(profile));
  }

  private async supabaseRegister(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<ServiceResult<AuthUser>> {
    const client = this.requireSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    if (error) return failure(error.message);
    if (!data.user) return failure('Registration failed');

    // Profile is auto-created by trigger, but let's fetch it
    await new Promise(r => setTimeout(r, 500));
    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) return success(this.profileToAuthUser(profile));

    return success({
      id: data.user.id,
      email,
      name,
      role,
      is_active: true,
    });
  }

  private profileToAuthUser(profile: ProfileRow): AuthUser {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
      is_active: profile.is_active,
    };
  }
}

export const authService = new AuthService();
