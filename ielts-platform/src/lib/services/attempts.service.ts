/**
 * Attempts Service - Student test attempts, responses, scoring
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import type {
  AttemptRow, AttemptInsert, AttemptUpdate,
  StudentResponseInsert, StudentResponseUpdate,
  WritingResponseInsert, WritingResponseUpdate,
  SpeakingRecordingInsert,
  ScoreInsert, ScoreRow,
  FullMockAttemptInsert, FullMockAttemptUpdate, FullMockAttemptRow,
  AttemptWithScore, TestModule,
} from '@/types/database';

class AttemptsService extends BaseService {
  // ==========================================
  // CREATE ATTEMPT
  // ==========================================

  async createAttempt(input: AttemptInsert): Promise<ServiceResult<AttemptRow>> {
    if (this.isDemo) {
      const attempt: AttemptRow = {
        id: `demo-attempt-${Date.now()}`,
        test_id: input.test_id,
        student_id: input.student_id,
        module: input.module,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        completed_at: null,
        time_spent_seconds: 0,
        current_section: null,
        current_question: 1,
        full_mock_attempt_id: input.full_mock_attempt_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return success(attempt);
    }
    const client = this.requireSupabase();
    const { data, error } = await client.from('attempts').insert(input).select().single();
    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // UPDATE ATTEMPT
  // ==========================================

  async updateAttempt(id: string, input: AttemptUpdate): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client.from('attempts').update(input).eq('id', id);
    if (error) return failure(error.message);
    return success(undefined);
  }

  async completeAttempt(id: string, timeSpent: number): Promise<ServiceResult<void>> {
    return this.updateAttempt(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpent,
    });
  }


  // ==========================================
  // STUDENT RESPONSES (Listening/Reading)
  // ==========================================

  async saveResponses(responses: StudentResponseInsert[]): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client
      .from('student_responses')
      .upsert(responses, { onConflict: 'attempt_id,question_id' });
    if (error) return failure(error.message);
    return success(undefined);
  }

  async updateResponse(attemptId: string, questionId: string, input: StudentResponseUpdate): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client
      .from('student_responses')
      .update(input)
      .eq('attempt_id', attemptId)
      .eq('question_id', questionId);
    if (error) return failure(error.message);
    return success(undefined);
  }

  // ==========================================
  // WRITING RESPONSES
  // ==========================================

  async saveWritingResponse(input: WritingResponseInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-wr-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client
      .from('writing_responses')
      .upsert(input, { onConflict: 'attempt_id,task_number' })
      .select('id')
      .single();
    if (error) return failure(error.message);
    return success(data);
  }

  async updateWritingResponse(attemptId: string, taskNumber: number, input: WritingResponseUpdate): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client
      .from('writing_responses')
      .update({ ...input, last_saved_at: new Date().toISOString() })
      .eq('attempt_id', attemptId)
      .eq('task_number', taskNumber);
    if (error) return failure(error.message);
    return success(undefined);
  }

  // ==========================================
  // SPEAKING RECORDINGS
  // ==========================================

  async saveSpeakingRecording(input: SpeakingRecordingInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-sr-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('speaking_recordings').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }


  // ==========================================
  // SCORING
  // ==========================================

  async createScore(input: ScoreInsert): Promise<ServiceResult<ScoreRow>> {
    if (this.isDemo) {
      const score: ScoreRow = {
        id: `demo-score-${Date.now()}`,
        attempt_id: input.attempt_id,
        module: input.module,
        raw_score: input.raw_score || null,
        total_possible: input.total_possible || null,
        band_score: input.band_score,
        scored_by: input.scored_by,
        scored_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      return success(score);
    }
    const client = this.requireSupabase();
    const { data, error } = await client.from('scores').insert(input).select().single();
    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // AUTOSAVE
  // ==========================================

  async saveAutosave(attemptId: string, studentId: string, responses: Record<string, string>, currentQuestion: number): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client
      .from('autosaves')
      .upsert({
        attempt_id: attemptId,
        student_id: studentId,
        responses,
        current_question: currentQuestion,
        saved_at: new Date().toISOString(),
      }, { onConflict: 'attempt_id' });
    if (error) return failure(error.message);
    return success(undefined);
  }

  async getAutosave(attemptId: string): Promise<ServiceResult<{ responses: Record<string, string>; current_question: number } | null>> {
    if (this.isDemo) return success(null);
    const client = this.requireSupabase();
    const { data, error } = await client
      .from('autosaves')
      .select('responses, current_question')
      .eq('attempt_id', attemptId)
      .single();
    if (error) return success(null);
    return success(data);
  }


  // ==========================================
  // FULL MOCK ATTEMPTS
  // ==========================================

  async createFullMockAttempt(input: FullMockAttemptInsert): Promise<ServiceResult<FullMockAttemptRow>> {
    if (this.isDemo) {
      const attempt: FullMockAttemptRow = {
        id: `demo-fma-${Date.now()}`,
        full_mock_test_id: input.full_mock_test_id,
        student_id: input.student_id,
        status: 'in_progress',
        listening_attempt_id: null,
        reading_attempt_id: null,
        writing_attempt_id: null,
        speaking_attempt_id: null,
        listening_completed: false,
        reading_completed: false,
        writing_completed: false,
        speaking_completed: false,
        current_module: 'listening',
        listening_band: null,
        reading_band: null,
        writing_band: null,
        speaking_band: null,
        overall_band: null,
        started_at: new Date().toISOString(),
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return success(attempt);
    }
    const client = this.requireSupabase();
    const { data, error } = await client.from('full_mock_attempts').insert(input).select().single();
    if (error) return failure(error.message);
    return success(data);
  }

  async updateFullMockAttempt(id: string, input: FullMockAttemptUpdate): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client.from('full_mock_attempts').update(input).eq('id', id);
    if (error) return failure(error.message);
    return success(undefined);
  }

  // ==========================================
  // GET ATTEMPTS (for dashboard)
  // ==========================================

  async getStudentAttempts(studentId: string, module?: TestModule): Promise<ServiceResult<AttemptWithScore[]>> {
    if (this.isDemo) return success([]);
    const client = this.requireSupabase();
    let query = client
      .from('attempts')
      .select(`
        *,
        test:tests(*),
        score:scores(*)
      `)
      .eq('student_id', studentId)
      .order('started_at', { ascending: false });

    if (module) query = query.eq('module', module);
    const { data, error } = await query;
    if (error) return failure(error.message);
    return success((data || []) as unknown as AttemptWithScore[]);
  }

  async getAttemptWithDetails(attemptId: string): Promise<ServiceResult<AttemptWithScore | null>> {
    if (this.isDemo) return success(null);
    const client = this.requireSupabase();
    const { data, error } = await client
      .from('attempts')
      .select(`
        *,
        test:tests(*),
        score:scores(*, rubric_scores(*), teacher_feedback(*)),
        responses:student_responses(*),
        writing_responses(*),
        speaking_recordings(*)
      `)
      .eq('id', attemptId)
      .single();
    if (error) return failure(error.message);
    return success(data as unknown as AttemptWithScore);
  }
}

export const attemptsService = new AttemptsService();
