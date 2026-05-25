/**
 * Tests Service - CRUD operations for all test types
 * Used by admin for management and students for fetching tests
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import type {
  TestRow, TestInsert, TestUpdate, TestModule, TestStatus,
  ListeningTestInsert, ListeningPartInsert,
  ListeningQuestionGroupInsert, ListeningQuestionInsert, AnswerKeyInsert,
  ReadingTestInsert, ReadingPassageInsert, ReadingParagraphInsert,
  ReadingQuestionGroupInsert, ReadingQuestionInsert,
  WritingTestInsert, WritingTaskInsert,
  SpeakingTestInsert, SpeakingPartInsert,
  SpeakingQuestionInsert, SpeakingCueCardInsert,
  FullMockTestInsert, FullMockTestUpdate,
  TestWithModule,
} from '@/types/database';
import { DEMO_TESTS } from './demo-data';

class TestsService extends BaseService {
  // ==========================================
  // LIST TESTS
  // ==========================================

  async listTests(filters?: {
    module?: TestModule;
    status?: TestStatus;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<TestRow[]>> {
    if (this.isDemo) {
      let tests = DEMO_TESTS;
      if (filters?.module) tests = tests.filter(t => t.module === filters.module);
      if (filters?.status) tests = tests.filter(t => t.status === filters.status);
      return success(tests.slice(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50)));
    }

    const client = this.requireSupabase();
    let query = client.from('tests').select('*');

    if (filters?.module) query = query.eq('module', filters.module);
    if (filters?.status) query = query.eq('status', filters.status);
    query = query.order('created_at', { ascending: false });
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);

    const { data, error } = await query;
    if (error) return failure(error.message);
    return success(data || []);
  }


  // ==========================================
  // GET SINGLE TEST (with module data)
  // ==========================================

  async getTestById(id: string): Promise<ServiceResult<TestRow | null>> {
    if (this.isDemo) {
      const test = DEMO_TESTS.find(t => t.id === id);
      return success(test || null);
    }
    const client = this.requireSupabase();
    const { data, error } = await client.from('tests').select('*').eq('id', id).single();
    if (error) return failure(error.message);
    return success(data);
  }

  async getTestBySlug(slug: string): Promise<ServiceResult<TestRow | null>> {
    if (this.isDemo) {
      const test = DEMO_TESTS.find(t => t.slug === slug);
      return success(test || null);
    }
    const client = this.requireSupabase();
    const { data, error } = await client.from('tests').select('*').eq('slug', slug).single();
    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // CREATE TEST
  // ==========================================

  async createTest(input: TestInsert): Promise<ServiceResult<TestRow>> {
    if (this.isDemo) {
      const newTest: TestRow = {
        id: `demo-test-${Date.now()}`,
        title: input.title,
        slug: input.slug || input.title.toLowerCase().replace(/\s+/g, '-'),
        description: input.description || null,
        module: input.module,
        difficulty: input.difficulty || 'medium',
        duration_minutes: input.duration_minutes,
        total_questions: input.total_questions || 0,
        status: 'draft',
        access: input.access || 'free',
        attempt_limit: input.attempt_limit || null,
        instructions: input.instructions || null,
        instruction_video_url: input.instruction_video_url || null,
        test_type: input.test_type || 'academic',
        created_by: input.created_by || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: null,
      };
      DEMO_TESTS.push(newTest);
      return success(newTest);
    }

    const client = this.requireSupabase();
    const slug = input.slug || input.title.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await client
      .from('tests')
      .insert({ ...input, slug })
      .select()
      .single();

    if (error) return failure(error.message);
    return success(data);
  }


  // ==========================================
  // UPDATE TEST
  // ==========================================

  async updateTest(id: string, input: TestUpdate): Promise<ServiceResult<TestRow>> {
    if (this.isDemo) {
      const idx = DEMO_TESTS.findIndex(t => t.id === id);
      if (idx === -1) return failure('Test not found');
      DEMO_TESTS[idx] = { ...DEMO_TESTS[idx], ...input, updated_at: new Date().toISOString() };
      return success(DEMO_TESTS[idx]);
    }

    const client = this.requireSupabase();
    const { data, error } = await client
      .from('tests')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // DELETE TEST
  // ==========================================

  async deleteTest(id: string): Promise<ServiceResult<void>> {
    if (this.isDemo) {
      const idx = DEMO_TESTS.findIndex(t => t.id === id);
      if (idx !== -1) DEMO_TESTS.splice(idx, 1);
      return success(undefined);
    }

    const client = this.requireSupabase();
    const { error } = await client.from('tests').delete().eq('id', id);
    if (error) return failure(error.message);
    return success(undefined);
  }

  // ==========================================
  // PUBLISH / UNPUBLISH
  // ==========================================

  async publishTest(id: string): Promise<ServiceResult<TestRow>> {
    return this.updateTest(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
  }

  async unpublishTest(id: string): Promise<ServiceResult<TestRow>> {
    return this.updateTest(id, {
      status: 'draft',
      published_at: null,
    });
  }

  async archiveTest(id: string): Promise<ServiceResult<TestRow>> {
    return this.updateTest(id, { status: 'archived' });
  }


  // ==========================================
  // DUPLICATE TEST
  // ==========================================

  async duplicateTest(id: string): Promise<ServiceResult<TestRow>> {
    const result = await this.getTestById(id);
    if (!result.data) return failure('Test not found');

    const original = result.data;
    return this.createTest({
      title: `${original.title} (Copy)`,
      description: original.description,
      module: original.module,
      difficulty: original.difficulty,
      duration_minutes: original.duration_minutes,
      total_questions: original.total_questions,
      access: original.access,
      instructions: original.instructions,
      test_type: original.test_type,
      created_by: original.created_by,
    });
  }

  // ==========================================
  // LISTENING MODULE CRUD
  // ==========================================

  async createListeningTest(input: ListeningTestInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-lt-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('listening_tests').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createListeningPart(input: ListeningPartInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-lp-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('listening_parts').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createListeningQuestionGroup(input: ListeningQuestionGroupInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-lqg-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('listening_question_groups').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createListeningQuestion(input: ListeningQuestionInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-lq-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('listening_questions').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createListeningAnswerKey(input: AnswerKeyInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-lak-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('listening_answer_keys').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }


  // ==========================================
  // READING MODULE CRUD
  // ==========================================

  async createReadingTest(input: ReadingTestInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rt-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_tests').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createReadingPassage(input: ReadingPassageInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rp-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_passages').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createReadingParagraph(input: ReadingParagraphInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rpg-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_paragraphs').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createReadingQuestionGroup(input: ReadingQuestionGroupInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rqg-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_question_groups').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createReadingQuestion(input: ReadingQuestionInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rq-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_questions').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createReadingAnswerKey(input: AnswerKeyInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-rak-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('reading_answer_keys').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }


  // ==========================================
  // WRITING MODULE CRUD
  // ==========================================

  async createWritingTest(input: WritingTestInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-wt-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('writing_tests').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createWritingTask(input: WritingTaskInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-wtk-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('writing_tasks').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // SPEAKING MODULE CRUD
  // ==========================================

  async createSpeakingTest(input: SpeakingTestInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-st-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('speaking_tests').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createSpeakingPart(input: SpeakingPartInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-sp-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('speaking_parts').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createSpeakingQuestion(input: SpeakingQuestionInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-sq-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('speaking_questions').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async createSpeakingCueCard(input: SpeakingCueCardInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-scc-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('speaking_cue_cards').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  // ==========================================
  // FULL MOCK CRUD
  // ==========================================

  async createFullMockTest(input: FullMockTestInsert): Promise<ServiceResult<{ id: string }>> {
    if (this.isDemo) return success({ id: `demo-fmt-${Date.now()}` });
    const client = this.requireSupabase();
    const { data, error } = await client.from('full_mock_tests').insert(input).select('id').single();
    if (error) return failure(error.message);
    return success(data);
  }

  async updateFullMockTest(id: string, input: FullMockTestUpdate): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client.from('full_mock_tests').update(input).eq('id', id);
    if (error) return failure(error.message);
    return success(undefined);
  }

  // ==========================================
  // GET FULL TEST DATA (for exam taking)
  // ==========================================

  async getListeningTestFull(testId: string): Promise<ServiceResult<TestWithModule | null>> {
    if (this.isDemo) {
      return success(null); // demo uses local data files
    }
    const client = this.requireSupabase();
    const { data: test, error } = await client
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    if (error || !test) return failure(error?.message || 'Not found');

    const { data: lt } = await client
      .from('listening_tests')
      .select('*')
      .eq('test_id', testId)
      .single();

    if (!lt) return success({ ...test, listening_test: undefined });

    const { data: parts } = await client
      .from('listening_parts')
      .select('*')
      .eq('listening_test_id', lt.id)
      .order('part_number');

    const partsWithQuestions = await Promise.all(
      (parts || []).map(async (part) => {
        const { data: groups } = await client
          .from('listening_question_groups')
          .select('*')
          .eq('listening_part_id', part.id)
          .order('group_order');

        const groupsWithQ = await Promise.all(
          (groups || []).map(async (group) => {
            const { data: questions } = await client
              .from('listening_questions')
              .select('*')
              .eq('group_id', group.id)
              .order('question_order');
            return { ...group, questions: questions || [] };
          })
        );
        return { ...part, question_groups: groupsWithQ };
      })
    );

    return success({
      ...test,
      listening_test: { ...lt, parts: partsWithQuestions },
    } as TestWithModule);
  }
}

export const testsService = new TestsService();
