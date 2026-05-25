/**
 * Exam Service - Unified exam-taking flow for all modules
 * Handles: fetching test data, creating attempts, saving responses,
 * autosave, scoring, and result retrieval
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import { attemptsService } from './attempts.service';
import { scoringService } from './scoring.service';
import type {
  AttemptRow, TestRow, TestModule, ScoreRow,
} from '@/types/database';

export interface ExamTestData {
  test: TestRow;
  parts: ExamPart[];
  audioUrl?: string;
  totalQuestions: number;
}

export interface ExamPart {
  id: string;
  partNumber: number;
  title: string;
  instructions?: string;
  audioUrl?: string;
  passageText?: string;
  paragraphs?: { label: string; content: string }[];
  questionGroups: ExamQuestionGroup[];
}

export interface ExamQuestionGroup {
  id: string;
  title?: string;
  instructions: string;
  questionType: string;
  imageUrl?: string;
  contextText?: string;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  questionText?: string;
  inputType: string;
  options: { label: string; value: string }[];
  wordLimit?: number;
}

export interface ExamResult {
  attemptId: string;
  module: TestModule;
  rawScore: number | null;
  totalPossible: number | null;
  bandScore: number;
  scoredBy: 'auto' | 'teacher';
  status: 'completed' | 'pending_review';
}

class ExamService extends BaseService {
  /**
   * Start an exam attempt
   */
  async startExam(testId: string, studentId: string, module: TestModule, fullMockAttemptId?: string): Promise<ServiceResult<AttemptRow>> {
    return attemptsService.createAttempt({
      test_id: testId,
      student_id: studentId,
      module,
      full_mock_attempt_id: fullMockAttemptId,
    });
  }


  /**
   * Fetch listening test data for exam-taking
   */
  async getListeningExamData(testId: string): Promise<ServiceResult<ExamTestData>> {
    if (this.isDemo) {
      return success(DEMO_LISTENING_DATA);
    }

    const client = this.requireSupabase();

    // Get main test
    const { data: test, error: testErr } = await client
      .from('tests').select('*').eq('id', testId).single();
    if (testErr || !test) return failure('Test not found');

    // Get listening test
    const { data: lt } = await client
      .from('listening_tests').select('*').eq('test_id', testId).single();
    if (!lt) return failure('Listening data not found');

    // Get parts
    const { data: parts } = await client
      .from('listening_parts').select('*').eq('listening_test_id', lt.id).order('part_number');

    const examParts: ExamPart[] = [];
    for (const part of (parts || [])) {
      const { data: groups } = await client
        .from('listening_question_groups').select('*').eq('listening_part_id', part.id).order('group_order');

      const questionGroups: ExamQuestionGroup[] = [];
      for (const group of (groups || [])) {
        const { data: questions } = await client
          .from('listening_questions').select('*').eq('group_id', group.id).order('question_order');

        questionGroups.push({
          id: group.id,
          title: group.title,
          instructions: group.instructions,
          questionType: group.question_type,
          imageUrl: group.image_url,
          contextText: group.context_text,
          questions: (questions || []).map(q => ({
            id: q.id,
            questionNumber: q.question_number,
            questionText: q.question_text,
            inputType: q.input_type,
            options: (q.options as { label: string; value: string }[]) || [],
            wordLimit: q.word_limit,
          })),
        });
      }

      examParts.push({
        id: part.id,
        partNumber: part.part_number,
        title: part.title,
        instructions: part.instructions,
        audioUrl: part.audio_url,
        questionGroups,
      });
    }

    return success({
      test,
      parts: examParts,
      audioUrl: lt.audio_url || undefined,
      totalQuestions: test.total_questions,
    });
  }


  /**
   * Fetch reading test data for exam-taking
   */
  async getReadingExamData(testId: string): Promise<ServiceResult<ExamTestData>> {
    if (this.isDemo) {
      return success(DEMO_READING_DATA);
    }

    const client = this.requireSupabase();
    const { data: test, error: testErr } = await client
      .from('tests').select('*').eq('id', testId).single();
    if (testErr || !test) return failure('Test not found');

    const { data: rt } = await client
      .from('reading_tests').select('*').eq('test_id', testId).single();
    if (!rt) return failure('Reading data not found');

    const { data: passages } = await client
      .from('reading_passages').select('*').eq('reading_test_id', rt.id).order('passage_number');

    const examParts: ExamPart[] = [];
    for (const passage of (passages || [])) {
      const { data: paragraphs } = await client
        .from('reading_paragraphs').select('*').eq('passage_id', passage.id).order('paragraph_order');

      const { data: groups } = await client
        .from('reading_question_groups').select('*').eq('passage_id', passage.id).order('group_order');

      const questionGroups: ExamQuestionGroup[] = [];
      for (const group of (groups || [])) {
        const { data: questions } = await client
          .from('reading_questions').select('*').eq('group_id', group.id).order('question_order');

        questionGroups.push({
          id: group.id,
          title: group.title,
          instructions: group.instructions,
          questionType: group.question_type,
          imageUrl: group.image_url,
          contextText: group.context_text,
          questions: (questions || []).map(q => ({
            id: q.id,
            questionNumber: q.question_number,
            questionText: q.question_text,
            inputType: q.input_type,
            options: (q.options as { label: string; value: string }[]) || [],
            wordLimit: q.word_limit,
          })),
        });
      }

      examParts.push({
        id: passage.id,
        partNumber: passage.passage_number,
        title: passage.title,
        passageText: passage.source_text,
        paragraphs: (paragraphs || []).map(p => ({ label: p.label, content: p.content })),
        questionGroups,
      });
    }

    return success({
      test,
      parts: examParts,
      totalQuestions: test.total_questions,
    });
  }


  /**
   * Submit Listening/Reading exam and get auto-scored result
   */
  async submitAndScore(
    attemptId: string,
    module: 'listening' | 'reading',
    responses: Record<string, string>,
    timeSpent: number
  ): Promise<ServiceResult<ExamResult>> {
    // Save responses to DB
    const responseEntries = Object.entries(responses).map(([questionId, answer], idx) => ({
      attempt_id: attemptId,
      question_id: questionId,
      question_number: idx + 1,
      answer,
    }));

    await attemptsService.saveResponses(responseEntries);

    // Score
    const scoreResult = await scoringService.autoScore(attemptId, module, responses);
    if (!scoreResult.success || !scoreResult.data) {
      return failure(scoreResult.error || 'Scoring failed');
    }

    // Complete attempt
    await attemptsService.completeAttempt(attemptId, timeSpent);

    return success({
      attemptId,
      module,
      rawScore: scoreResult.data.raw_score,
      totalPossible: scoreResult.data.total_possible,
      bandScore: scoreResult.data.band_score,
      scoredBy: 'auto',
      status: 'completed',
    });
  }

  /**
   * Submit Writing exam (goes to pending review)
   */
  async submitWriting(
    attemptId: string,
    task1Content: string,
    task2Content: string,
    task1Words: number,
    task2Words: number,
    timeSpent: number
  ): Promise<ServiceResult<ExamResult>> {
    // Save writing responses
    await attemptsService.saveWritingResponse({
      attempt_id: attemptId,
      task_number: 1,
      content: task1Content,
      word_count: task1Words,
    });
    await attemptsService.saveWritingResponse({
      attempt_id: attemptId,
      task_number: 2,
      content: task2Content,
      word_count: task2Words,
    });

    // Update attempt to pending_review
    await attemptsService.updateAttempt(attemptId, {
      status: 'pending_review',
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpent,
    });

    return success({
      attemptId,
      module: 'writing',
      rawScore: null,
      totalPossible: null,
      bandScore: 0,
      scoredBy: 'teacher',
      status: 'pending_review',
    });
  }

  /**
   * Submit Speaking exam (goes to pending review)
   */
  async submitSpeaking(
    attemptId: string,
    timeSpent: number
  ): Promise<ServiceResult<ExamResult>> {
    await attemptsService.updateAttempt(attemptId, {
      status: 'pending_review',
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpent,
    });

    return success({
      attemptId,
      module: 'speaking',
      rawScore: null,
      totalPossible: null,
      bandScore: 0,
      scoredBy: 'teacher',
      status: 'pending_review',
    });
  }

  /**
   * Save autosave data
   */
  async autosave(
    attemptId: string,
    studentId: string,
    responses: Record<string, string>,
    currentQuestion: number
  ): Promise<ServiceResult<void>> {
    return attemptsService.saveAutosave(attemptId, studentId, responses, currentQuestion);
  }

  /**
   * Restore autosave data
   */
  async restoreAutosave(attemptId: string): Promise<ServiceResult<{ responses: Record<string, string>; current_question: number } | null>> {
    return attemptsService.getAutosave(attemptId);
  }
}


// ==========================================
// DEMO DATA
// ==========================================

const DEMO_LISTENING_DATA: ExamTestData = {
  test: {
    id: 'demo-listening-1',
    title: 'IELTS Listening Practice Test #1',
    slug: 'ielts-listening-practice-1',
    description: 'Complete 4-part listening test',
    module: 'listening',
    difficulty: 'medium',
    duration_minutes: 30,
    total_questions: 40,
    status: 'published',
    access: 'free',
    attempt_limit: null,
    instructions: 'Listen carefully to the audio. You will hear it only once.',
    instruction_video_url: null,
    test_type: 'academic',
    created_by: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    published_at: '2024-01-01T00:00:00Z',
  },
  totalQuestions: 40,
  parts: [
    {
      id: 'demo-lp-1',
      partNumber: 1,
      title: 'Part 1: Conversation about accommodation',
      instructions: 'Questions 1-10. Complete the form below.',
      questionGroups: [
        {
          id: 'demo-lqg-1',
          title: 'Accommodation Form',
          instructions: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questionType: 'form_completion',
          questions: Array.from({ length: 10 }, (_, i) => ({
            id: `demo-lq-${i + 1}`,
            questionNumber: i + 1,
            questionText: `Question ${i + 1}`,
            inputType: 'text',
            options: [],
            wordLimit: 2,
          })),
        },
      ],
    },
    {
      id: 'demo-lp-2',
      partNumber: 2,
      title: 'Part 2: Tour guide information',
      instructions: 'Questions 11-20.',
      questionGroups: [
        {
          id: 'demo-lqg-2',
          instructions: 'Choose the correct letter, A, B or C.',
          questionType: 'multiple_choice',
          questions: Array.from({ length: 10 }, (_, i) => ({
            id: `demo-lq-${i + 11}`,
            questionNumber: i + 11,
            questionText: `Question ${i + 11}`,
            inputType: 'radio',
            options: [
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'C', value: 'C' },
            ],
          })),
        },
      ],
    },
    {
      id: 'demo-lp-3',
      partNumber: 3,
      title: 'Part 3: Academic discussion',
      instructions: 'Questions 21-30.',
      questionGroups: [
        {
          id: 'demo-lqg-3',
          instructions: 'Complete the notes below. Write NO MORE THAN THREE WORDS for each answer.',
          questionType: 'note_completion',
          questions: Array.from({ length: 10 }, (_, i) => ({
            id: `demo-lq-${i + 21}`,
            questionNumber: i + 21,
            questionText: `Question ${i + 21}`,
            inputType: 'text',
            options: [],
            wordLimit: 3,
          })),
        },
      ],
    },
    {
      id: 'demo-lp-4',
      partNumber: 4,
      title: 'Part 4: Academic lecture',
      instructions: 'Questions 31-40.',
      questionGroups: [
        {
          id: 'demo-lqg-4',
          instructions: 'Complete the summary. Write NO MORE THAN TWO WORDS for each answer.',
          questionType: 'summary_completion',
          questions: Array.from({ length: 10 }, (_, i) => ({
            id: `demo-lq-${i + 31}`,
            questionNumber: i + 31,
            questionText: `Question ${i + 31}`,
            inputType: 'text',
            options: [],
            wordLimit: 2,
          })),
        },
      ],
    },
  ],
};

const DEMO_READING_DATA: ExamTestData = {
  test: {
    id: 'demo-reading-1',
    title: 'IELTS Reading Academic Test #1',
    slug: 'ielts-reading-academic-1',
    description: '3 passages with 40 questions',
    module: 'reading',
    difficulty: 'medium',
    duration_minutes: 60,
    total_questions: 40,
    status: 'published',
    access: 'free',
    attempt_limit: null,
    instructions: 'Read each passage carefully and answer the questions.',
    instruction_video_url: null,
    test_type: 'academic',
    created_by: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    published_at: '2024-01-02T00:00:00Z',
  },
  totalQuestions: 40,
  parts: [
    {
      id: 'demo-rp-1',
      partNumber: 1,
      title: 'The History of Writing Systems',
      passageText: 'The development of writing is one of the most significant achievements in human history...',
      paragraphs: [
        { label: 'A', content: 'The development of writing is one of the most significant achievements in human history. Writing systems evolved independently in various parts of the world, with the earliest known examples dating back approximately 5,000 years.' },
        { label: 'B', content: 'The Sumerian civilization in Mesopotamia developed cuneiform, one of the earliest writing systems. Initially used for record-keeping, it gradually evolved to express more complex ideas and narratives.' },
        { label: 'C', content: 'Egyptian hieroglyphs emerged around the same period, combining logographic and alphabetic elements. This system was primarily used by priests and scribes for religious and administrative purposes.' },
      ],
      questionGroups: [
        {
          id: 'demo-rqg-1',
          instructions: 'Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.',
          questionType: 'true_false_not_given',
          questions: Array.from({ length: 13 }, (_, i) => ({
            id: `demo-rq-${i + 1}`,
            questionNumber: i + 1,
            questionText: `Statement ${i + 1}`,
            inputType: 'radio',
            options: [
              { label: 'TRUE', value: 'TRUE' },
              { label: 'FALSE', value: 'FALSE' },
              { label: 'NOT GIVEN', value: 'NOT GIVEN' },
            ],
          })),
        },
      ],
    },
    {
      id: 'demo-rp-2',
      partNumber: 2,
      title: 'Climate Change and Urban Planning',
      passageText: 'Cities around the world are facing unprecedented challenges due to climate change...',
      paragraphs: [
        { label: 'A', content: 'Cities around the world are facing unprecedented challenges due to climate change. Rising temperatures, increased flooding, and extreme weather events are forcing urban planners to rethink traditional approaches.' },
        { label: 'B', content: 'Green infrastructure has emerged as a key strategy in climate-adaptive urban planning. This includes rooftop gardens, urban forests, and permeable surfaces that help manage stormwater runoff.' },
      ],
      questionGroups: [
        {
          id: 'demo-rqg-2',
          instructions: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage.',
          questionType: 'sentence_completion',
          questions: Array.from({ length: 13 }, (_, i) => ({
            id: `demo-rq-${i + 14}`,
            questionNumber: i + 14,
            questionText: `Question ${i + 14}`,
            inputType: 'text',
            options: [],
            wordLimit: 2,
          })),
        },
      ],
    },
    {
      id: 'demo-rp-3',
      partNumber: 3,
      title: 'Artificial Intelligence in Healthcare',
      passageText: 'The integration of artificial intelligence into healthcare represents a paradigm shift...',
      paragraphs: [
        { label: 'A', content: 'The integration of artificial intelligence into healthcare represents a paradigm shift in how medical professionals diagnose, treat, and manage patient care.' },
        { label: 'B', content: 'Machine learning algorithms can now analyze medical imaging with accuracy comparable to experienced radiologists, potentially reducing diagnostic errors.' },
      ],
      questionGroups: [
        {
          id: 'demo-rqg-3',
          instructions: 'Choose the correct letter, A, B, C or D.',
          questionType: 'multiple_choice',
          questions: Array.from({ length: 14 }, (_, i) => ({
            id: `demo-rq-${i + 27}`,
            questionNumber: i + 27,
            questionText: `Question ${i + 27}`,
            inputType: 'radio',
            options: [
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'C', value: 'C' },
              { label: 'D', value: 'D' },
            ],
          })),
        },
      ],
    },
  ],
};

export const examService = new ExamService();
