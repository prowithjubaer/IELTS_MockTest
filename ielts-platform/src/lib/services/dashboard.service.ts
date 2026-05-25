/**
 * Dashboard Service - Stats and data for student/admin/teacher dashboards
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import type {
  AdminDashboardStats, StudentDashboardStats, TeacherDashboardStats,
  AttemptWithScore, ProfileRow,
} from '@/types/database';

class DashboardService extends BaseService {
  // ==========================================
  // STUDENT DASHBOARD
  // ==========================================

  async getStudentStats(studentId: string): Promise<ServiceResult<StudentDashboardStats>> {
    if (this.isDemo) {
      return success({
        overallBand: 6.5,
        testsTaken: 12,
        pendingFeedback: 2,
        moduleScores: {
          listening: 7.0,
          reading: 6.5,
          writing: 6.0,
          speaking: 6.5,
        },
      });
    }

    const client = this.requireSupabase();

    // Count attempts
    const { count: testsTaken } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'completed');

    // Get pending feedback count
    const { count: pendingFeedback } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'pending_review');

    // Get latest scores per module
    const { data: scores } = await client
      .from('scores')
      .select('module, band_score, attempt:attempts!inner(student_id)')
      .eq('attempts.student_id', studentId)
      .order('scored_at', { ascending: false });

    const moduleScores = { listening: null as number | null, reading: null as number | null, writing: null as number | null, speaking: null as number | null };
    if (scores) {
      for (const s of scores) {
        const mod = s.module as keyof typeof moduleScores;
        if (mod in moduleScores && moduleScores[mod] === null) {
          moduleScores[mod] = s.band_score;
        }
      }
    }

    const validScores = Object.values(moduleScores).filter((s): s is number => s !== null);
    const overallBand = validScores.length > 0
      ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 2) / 2
      : null;

    return success({
      overallBand,
      testsTaken: testsTaken || 0,
      pendingFeedback: pendingFeedback || 0,
      moduleScores,
    });
  }


  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  async getAdminStats(): Promise<ServiceResult<AdminDashboardStats>> {
    if (this.isDemo) {
      return success({
        totalStudents: 5234,
        totalTests: 156,
        totalAttempts: 12847,
        pendingWriting: 8,
        pendingSpeaking: 5,
        completedFullMocks: 2340,
      });
    }

    const client = this.requireSupabase();

    const { count: totalStudents } = await client
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    const { count: totalTests } = await client
      .from('tests')
      .select('*', { count: 'exact', head: true });

    const { count: totalAttempts } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true });

    const { count: pendingWriting } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('module', 'writing')
      .eq('status', 'pending_review');

    const { count: pendingSpeaking } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('module', 'speaking')
      .eq('status', 'pending_review');

    const { count: completedFullMocks } = await client
      .from('full_mock_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    return success({
      totalStudents: totalStudents || 0,
      totalTests: totalTests || 0,
      totalAttempts: totalAttempts || 0,
      pendingWriting: pendingWriting || 0,
      pendingSpeaking: pendingSpeaking || 0,
      completedFullMocks: completedFullMocks || 0,
    });
  }


  // ==========================================
  // TEACHER DASHBOARD
  // ==========================================

  async getTeacherStats(teacherId: string): Promise<ServiceResult<TeacherDashboardStats>> {
    if (this.isDemo) {
      return success({
        pendingWriting: 4,
        pendingSpeaking: 3,
        totalReviewed: 156,
        assignedStudents: 24,
      });
    }

    const client = this.requireSupabase();

    const { count: pendingWriting } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('module', 'writing')
      .eq('status', 'pending_review');

    const { count: pendingSpeaking } = await client
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('module', 'speaking')
      .eq('status', 'pending_review');

    const { count: totalReviewed } = await client
      .from('teacher_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId)
      .eq('status', 'published');

    return success({
      pendingWriting: pendingWriting || 0,
      pendingSpeaking: pendingSpeaking || 0,
      totalReviewed: totalReviewed || 0,
      assignedStudents: 0,
    });
  }

  // ==========================================
  // ADMIN: LIST USERS
  // ==========================================

  async listUsers(filters?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<ProfileRow[]>> {
    if (this.isDemo) {
      return success([
        { id: 'demo-admin-001', email: 'admin@proenglishbd.com', name: 'Admin User', role: 'admin', avatar_url: null, phone: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'demo-teacher-001', email: 'teacher@proenglishbd.com', name: 'Sarah Johnson', role: 'teacher', avatar_url: null, phone: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'demo-student-001', email: 'student@proenglishbd.com', name: 'Jubayer Ahmed', role: 'student', avatar_url: null, phone: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ] as ProfileRow[]);
    }

    const client = this.requireSupabase();
    let query = client.from('profiles').select('*').order('created_at', { ascending: false });

    if (filters?.role) query = query.eq('role', filters.role);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);

    const { data, error } = await query;
    if (error) return failure(error.message);
    return success(data || []);
  }
}

export const dashboardService = new DashboardService();
