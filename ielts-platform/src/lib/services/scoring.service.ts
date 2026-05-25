/**
 * Scoring Service - Auto-scoring for Listening/Reading
 * Teacher feedback for Writing/Speaking
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import { checkAnswer, rawScoreToBand, listeningBandTable, readingAcademicBandTable } from '@/lib/utils';
import type {
  ScoreInsert, RubricScoreInsert, TeacherFeedbackInsert, TeacherFeedbackUpdate,
  AnswerKeyRow, ScoreRow, TeacherFeedbackRow,
} from '@/types/database';

class ScoringService extends BaseService {
  /**
   * Auto-score a Listening/Reading attempt
   * Uses service role client to access answer keys (bypasses RLS)
   */
  async autoScore(
    attemptId: string,
    module: 'listening' | 'reading',
    responses: Record<string, string>
  ): Promise<ServiceResult<ScoreRow>> {
    if (this.isDemo) {
      // Demo scoring: simulate based on answered count
      const answered = Object.values(responses).filter(a => a.trim()).length;
      const rawScore = Math.min(answered, 40);
      const bandTable = module === 'listening' ? listeningBandTable : readingAcademicBandTable;
      const bandScore = rawScoreToBand(rawScore, bandTable);
      const score: ScoreRow = {
        id: `demo-score-${Date.now()}`,
        attempt_id: attemptId,
        module,
        raw_score: rawScore,
        total_possible: 40,
        band_score: bandScore,
        scored_by: 'auto',
        scored_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      return success(score);
    }

    // In production, we call an API route that uses service role
    // to access answer keys securely
    const response = await fetch('/api/scoring/auto-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, module, responses }),
    });

    if (!response.ok) {
      const err = await response.json();
      return failure(err.error || 'Scoring failed');
    }

    const data = await response.json();
    return success(data.score);
  }


  /**
   * Submit teacher score and feedback for Writing/Speaking
   */
  async submitTeacherScore(input: {
    attemptId: string;
    module: 'writing' | 'speaking';
    bandScore: number;
    rubricScores: { criterion: string; band: number; comment?: string; improvement_suggestion?: string }[];
    feedback: {
      teacherId: string;
      overallComment: string;
      strengths: string[];
      weaknesses: string[];
      improvementPlan?: string;
    };
    publish?: boolean;
  }): Promise<ServiceResult<ScoreRow>> {
    if (this.isDemo) {
      const score: ScoreRow = {
        id: `demo-score-${Date.now()}`,
        attempt_id: input.attemptId,
        module: input.module,
        raw_score: null,
        total_possible: null,
        band_score: input.bandScore,
        scored_by: 'teacher',
        scored_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      return success(score);
    }

    const client = this.requireSupabase();

    // Create score
    const { data: score, error: scoreErr } = await client
      .from('scores')
      .insert({
        attempt_id: input.attemptId,
        module: input.module,
        band_score: input.bandScore,
        scored_by: 'teacher',
      } as ScoreInsert)
      .select()
      .single();

    if (scoreErr) return failure(scoreErr.message);

    // Create rubric scores
    if (input.rubricScores.length > 0) {
      const rubrics: RubricScoreInsert[] = input.rubricScores.map(r => ({
        score_id: score.id,
        criterion: r.criterion,
        band: r.band,
        comment: r.comment || null,
        improvement_suggestion: r.improvement_suggestion || null,
      }));
      await client.from('rubric_scores').insert(rubrics);
    }

    // Create teacher feedback
    const feedbackInsert: TeacherFeedbackInsert = {
      score_id: score.id,
      teacher_id: input.feedback.teacherId,
      overall_comment: input.feedback.overallComment,
      strengths: input.feedback.strengths,
      weaknesses: input.feedback.weaknesses,
      improvement_plan: input.feedback.improvementPlan || null,
      status: input.publish ? 'published' : 'draft',
    };
    await client.from('teacher_feedback').insert(feedbackInsert);

    // Update attempt status
    await client.from('attempts').update({
      status: input.publish ? 'reviewed' : 'pending_review',
    }).eq('id', input.attemptId);

    return success(score);
  }


  /**
   * Publish teacher feedback (updates status and notifies student)
   */
  async publishFeedback(feedbackId: string): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();

    const { error } = await client
      .from('teacher_feedback')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      } as TeacherFeedbackUpdate)
      .eq('id', feedbackId);

    if (error) return failure(error.message);
    return success(undefined);
  }

  /**
   * Get pending submissions for teacher review
   */
  async getPendingSubmissions(module?: 'writing' | 'speaking'): Promise<ServiceResult<{
    id: string;
    student_name: string;
    student_email: string;
    test_title: string;
    module: string;
    submitted_at: string;
  }[]>> {
    if (this.isDemo) {
      return success([
        { id: 'demo-1', student_name: 'Rahim Uddin', student_email: 'rahim@example.com', test_title: 'Academic Writing Task 2', module: 'writing', submitted_at: new Date().toISOString() },
        { id: 'demo-2', student_name: 'Fatima Akter', student_email: 'fatima@example.com', test_title: 'Speaking Test #3', module: 'speaking', submitted_at: new Date().toISOString() },
        { id: 'demo-3', student_name: 'Kabir Hossain', student_email: 'kabir@example.com', test_title: 'GT Writing Task 1', module: 'writing', submitted_at: new Date().toISOString() },
      ]);
    }

    const client = this.requireSupabase();
    let query = client
      .from('attempts')
      .select(`
        id,
        module,
        started_at,
        student:profiles!attempts_student_id_fkey(name, email),
        test:tests(title)
      `)
      .eq('status', 'pending_review')
      .order('started_at', { ascending: true });

    if (module) query = query.eq('module', module);

    const { data, error } = await query;
    if (error) return failure(error.message);

    const results = (data || []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      student_name: (d.student as Record<string, string>)?.name || 'Unknown',
      student_email: (d.student as Record<string, string>)?.email || '',
      test_title: (d.test as Record<string, string>)?.title || 'Unknown Test',
      module: d.module as string,
      submitted_at: d.started_at as string,
    }));

    return success(results);
  }
}

export const scoringService = new ScoringService();
