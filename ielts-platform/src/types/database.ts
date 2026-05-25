/**
 * Database Types - Auto-generated style types matching Supabase schema
 * These types map directly to the database tables defined in migrations
 */

// =============================================
// DATABASE SCHEMA TYPE (Supabase Generated Style)
// =============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      student_profiles: {
        Row: StudentProfileRow;
        Insert: StudentProfileInsert;
        Update: StudentProfileUpdate;
      };
      teacher_profiles: {
        Row: TeacherProfileRow;
        Insert: TeacherProfileInsert;
        Update: TeacherProfileUpdate;
      };
      tests: {
        Row: TestRow;
        Insert: TestInsert;
        Update: TestUpdate;
      };
      listening_tests: {
        Row: ListeningTestRow;
        Insert: ListeningTestInsert;
        Update: ListeningTestUpdate;
      };
      listening_parts: {
        Row: ListeningPartRow;
        Insert: ListeningPartInsert;
        Update: ListeningPartUpdate;
      };

      listening_question_groups: {
        Row: ListeningQuestionGroupRow;
        Insert: ListeningQuestionGroupInsert;
        Update: ListeningQuestionGroupUpdate;
      };
      listening_questions: {
        Row: ListeningQuestionRow;
        Insert: ListeningQuestionInsert;
        Update: ListeningQuestionUpdate;
      };
      listening_answer_keys: {
        Row: AnswerKeyRow;
        Insert: AnswerKeyInsert;
        Update: AnswerKeyUpdate;
      };
      reading_tests: {
        Row: ReadingTestRow;
        Insert: ReadingTestInsert;
        Update: ReadingTestUpdate;
      };
      reading_passages: {
        Row: ReadingPassageRow;
        Insert: ReadingPassageInsert;
        Update: ReadingPassageUpdate;
      };
      reading_paragraphs: {
        Row: ReadingParagraphRow;
        Insert: ReadingParagraphInsert;
        Update: ReadingParagraphUpdate;
      };
      reading_question_groups: {
        Row: ReadingQuestionGroupRow;
        Insert: ReadingQuestionGroupInsert;
        Update: ReadingQuestionGroupUpdate;
      };
      reading_questions: {
        Row: ReadingQuestionRow;
        Insert: ReadingQuestionInsert;
        Update: ReadingQuestionUpdate;
      };
      reading_answer_keys: {
        Row: AnswerKeyRow;
        Insert: AnswerKeyInsert;
        Update: AnswerKeyUpdate;
      };

      writing_tests: {
        Row: WritingTestRow;
        Insert: WritingTestInsert;
        Update: WritingTestUpdate;
      };
      writing_tasks: {
        Row: WritingTaskRow;
        Insert: WritingTaskInsert;
        Update: WritingTaskUpdate;
      };
      speaking_tests: {
        Row: SpeakingTestRow;
        Insert: SpeakingTestInsert;
        Update: SpeakingTestUpdate;
      };
      speaking_parts: {
        Row: SpeakingPartRow;
        Insert: SpeakingPartInsert;
        Update: SpeakingPartUpdate;
      };
      speaking_questions: {
        Row: SpeakingQuestionRow;
        Insert: SpeakingQuestionInsert;
        Update: SpeakingQuestionUpdate;
      };
      speaking_cue_cards: {
        Row: SpeakingCueCardRow;
        Insert: SpeakingCueCardInsert;
        Update: SpeakingCueCardUpdate;
      };
      full_mock_tests: {
        Row: FullMockTestRow;
        Insert: FullMockTestInsert;
        Update: FullMockTestUpdate;
      };
      attempts: {
        Row: AttemptRow;
        Insert: AttemptInsert;
        Update: AttemptUpdate;
      };
      student_responses: {
        Row: StudentResponseRow;
        Insert: StudentResponseInsert;
        Update: StudentResponseUpdate;
      };

      writing_responses: {
        Row: WritingResponseRow;
        Insert: WritingResponseInsert;
        Update: WritingResponseUpdate;
      };
      speaking_recordings: {
        Row: SpeakingRecordingRow;
        Insert: SpeakingRecordingInsert;
        Update: SpeakingRecordingUpdate;
      };
      full_mock_attempts: {
        Row: FullMockAttemptRow;
        Insert: FullMockAttemptInsert;
        Update: FullMockAttemptUpdate;
      };
      scores: {
        Row: ScoreRow;
        Insert: ScoreInsert;
        Update: ScoreUpdate;
      };
      rubric_scores: {
        Row: RubricScoreRow;
        Insert: RubricScoreInsert;
        Update: RubricScoreUpdate;
      };
      teacher_feedback: {
        Row: TeacherFeedbackRow;
        Insert: TeacherFeedbackInsert;
        Update: TeacherFeedbackUpdate;
      };
      autosaves: {
        Row: AutosaveRow;
        Insert: AutosaveInsert;
        Update: AutosaveUpdate;
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      activity_logs: {
        Row: ActivityLogRow;
        Insert: ActivityLogInsert;
        Update: never;
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: SiteSettingsInsert;
        Update: SiteSettingsUpdate;
      };
      test_access: {
        Row: TestAccessRow;
        Insert: TestAccessInsert;
        Update: never;
      };
      uploaded_assets: {
        Row: UploadedAssetRow;
        Insert: UploadedAssetInsert;
        Update: never;
      };
    };
  };
}


// =============================================
// ROW TYPES (what you get from SELECT)
// =============================================

export type UserRole = 'guest' | 'student' | 'teacher' | 'admin' | 'super_admin';
export type TestModule = 'listening' | 'reading' | 'writing' | 'speaking' | 'full';
export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestStatus = 'draft' | 'published' | 'archived';
export type TestAccess = 'free' | 'paid' | 'assigned';
export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned' | 'timed_out' | 'pending_review' | 'reviewed';
export type InputType = 'text' | 'number' | 'radio' | 'checkbox' | 'dropdown' | 'inline_blank' | 'image_label';
export type ScoredBy = 'auto' | 'teacher';
export type FeedbackStatus = 'draft' | 'published';
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed';
export type NotificationType = 'info' | 'success' | 'warning' | 'feedback' | 'result';

export interface ProfileRow {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  is_active?: boolean;
}

export interface ProfileUpdate {
  name?: string;
  role?: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  is_active?: boolean;
}


export interface StudentProfileRow {
  id: string;
  user_id: string;
  target_band: number;
  exam_date: string | null;
  study_hours_per_week: number;
  country: string;
  institution: string | null;
  test_type: 'academic' | 'general';
  created_at: string;
  updated_at: string;
}

export interface StudentProfileInsert {
  user_id: string;
  target_band?: number;
  exam_date?: string | null;
  study_hours_per_week?: number;
  country?: string;
  institution?: string | null;
  test_type?: 'academic' | 'general';
}

export interface StudentProfileUpdate {
  target_band?: number;
  exam_date?: string | null;
  study_hours_per_week?: number;
  country?: string;
  institution?: string | null;
  test_type?: 'academic' | 'general';
}

export interface TeacherProfileRow {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  bio: string | null;
  is_available: boolean;
  max_assignments_per_day: number;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfileInsert {
  user_id: string;
  specialization?: string[];
  experience_years?: number;
  bio?: string | null;
  is_available?: boolean;
  max_assignments_per_day?: number;
}

export interface TeacherProfileUpdate {
  specialization?: string[];
  experience_years?: number;
  bio?: string | null;
  is_available?: boolean;
  max_assignments_per_day?: number;
}


// =============================================
// TESTS
// =============================================

export interface TestRow {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  module: TestModule;
  difficulty: TestDifficulty;
  duration_minutes: number;
  total_questions: number;
  status: TestStatus;
  access: TestAccess;
  attempt_limit: number | null;
  instructions: string | null;
  instruction_video_url: string | null;
  test_type: 'academic' | 'general';
  created_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface TestInsert {
  title: string;
  slug?: string | null;
  description?: string | null;
  module: TestModule;
  difficulty?: TestDifficulty;
  duration_minutes: number;
  total_questions?: number;
  status?: TestStatus;
  access?: TestAccess;
  attempt_limit?: number | null;
  instructions?: string | null;
  instruction_video_url?: string | null;
  test_type?: 'academic' | 'general';
  created_by?: string | null;
}

export interface TestUpdate {
  title?: string;
  slug?: string | null;
  description?: string | null;
  difficulty?: TestDifficulty;
  duration_minutes?: number;
  total_questions?: number;
  status?: TestStatus;
  access?: TestAccess;
  attempt_limit?: number | null;
  instructions?: string | null;
  instruction_video_url?: string | null;
  test_type?: 'academic' | 'general';
  published_at?: string | null;
}


// =============================================
// LISTENING MODULE
// =============================================

export interface ListeningTestRow {
  id: string;
  test_id: string;
  audio_url: string | null;
  audio_duration_seconds: number;
  allow_replay: boolean;
  review_time_seconds: number;
  created_at: string;
}

export interface ListeningTestInsert {
  test_id: string;
  audio_url?: string | null;
  audio_duration_seconds?: number;
  allow_replay?: boolean;
  review_time_seconds?: number;
}

export interface ListeningTestUpdate {
  audio_url?: string | null;
  audio_duration_seconds?: number;
  allow_replay?: boolean;
  review_time_seconds?: number;
}

export interface ListeningPartRow {
  id: string;
  listening_test_id: string;
  part_number: number;
  title: string;
  audio_url: string | null;
  audio_start_time: number;
  audio_end_time: number;
  instructions: string | null;
  context_description: string | null;
  created_at: string;
}

export interface ListeningPartInsert {
  listening_test_id: string;
  part_number: number;
  title: string;
  audio_url?: string | null;
  audio_start_time?: number;
  audio_end_time?: number;
  instructions?: string | null;
  context_description?: string | null;
}

export interface ListeningPartUpdate {
  title?: string;
  audio_url?: string | null;
  audio_start_time?: number;
  audio_end_time?: number;
  instructions?: string | null;
  context_description?: string | null;
}


export interface ListeningQuestionGroupRow {
  id: string;
  listening_part_id: string;
  title: string | null;
  instructions: string;
  question_type: string;
  group_order: number;
  image_url: string | null;
  context_text: string | null;
  created_at: string;
}

export interface ListeningQuestionGroupInsert {
  listening_part_id: string;
  title?: string | null;
  instructions: string;
  question_type: string;
  group_order?: number;
  image_url?: string | null;
  context_text?: string | null;
}

export interface ListeningQuestionGroupUpdate {
  title?: string | null;
  instructions?: string;
  question_type?: string;
  group_order?: number;
  image_url?: string | null;
  context_text?: string | null;
}

export interface ListeningQuestionRow {
  id: string;
  group_id: string;
  question_number: number;
  question_text: string | null;
  input_type: InputType;
  options: QuestionOption[];
  word_limit: number | null;
  question_order: number;
  image_url: string | null;
  created_at: string;
}

export interface ListeningQuestionInsert {
  group_id: string;
  question_number: number;
  question_text?: string | null;
  input_type?: InputType;
  options?: QuestionOption[];
  word_limit?: number | null;
  question_order?: number;
  image_url?: string | null;
}

export interface ListeningQuestionUpdate {
  question_number?: number;
  question_text?: string | null;
  input_type?: InputType;
  options?: QuestionOption[];
  word_limit?: number | null;
  question_order?: number;
  image_url?: string | null;
}

export interface QuestionOption {
  label: string;
  value: string;
}


// =============================================
// ANSWER KEYS (shared between listening & reading)
// =============================================

export interface AnswerKeyRow {
  id: string;
  question_id: string;
  correct_answer: string;
  accepted_alternatives: string[];
  case_sensitive: boolean;
  ignore_spaces: boolean;
  created_at: string;
}

export interface AnswerKeyInsert {
  question_id: string;
  correct_answer: string;
  accepted_alternatives?: string[];
  case_sensitive?: boolean;
  ignore_spaces?: boolean;
}

export interface AnswerKeyUpdate {
  correct_answer?: string;
  accepted_alternatives?: string[];
  case_sensitive?: boolean;
  ignore_spaces?: boolean;
}

// =============================================
// READING MODULE
// =============================================

export interface ReadingTestRow {
  id: string;
  test_id: string;
  test_type: 'academic' | 'general';
  created_at: string;
}

export interface ReadingTestInsert {
  test_id: string;
  test_type?: 'academic' | 'general';
}

export interface ReadingTestUpdate {
  test_type?: 'academic' | 'general';
}

export interface ReadingPassageRow {
  id: string;
  reading_test_id: string;
  passage_number: number;
  title: string;
  source_text: string;
  created_at: string;
}

export interface ReadingPassageInsert {
  reading_test_id: string;
  passage_number: number;
  title: string;
  source_text?: string;
}

export interface ReadingPassageUpdate {
  title?: string;
  source_text?: string;
}


export interface ReadingParagraphRow {
  id: string;
  passage_id: string;
  label: string;
  content: string;
  paragraph_order: number;
  created_at: string;
}

export interface ReadingParagraphInsert {
  passage_id: string;
  label: string;
  content: string;
  paragraph_order?: number;
}

export interface ReadingParagraphUpdate {
  label?: string;
  content?: string;
  paragraph_order?: number;
}

export interface ReadingQuestionGroupRow {
  id: string;
  passage_id: string;
  title: string | null;
  instructions: string;
  question_type: string;
  group_order: number;
  image_url: string | null;
  context_text: string | null;
  created_at: string;
}

export interface ReadingQuestionGroupInsert {
  passage_id: string;
  title?: string | null;
  instructions: string;
  question_type: string;
  group_order?: number;
  image_url?: string | null;
  context_text?: string | null;
}

export interface ReadingQuestionGroupUpdate {
  title?: string | null;
  instructions?: string;
  question_type?: string;
  group_order?: number;
  image_url?: string | null;
  context_text?: string | null;
}

export interface ReadingQuestionRow {
  id: string;
  group_id: string;
  question_number: number;
  question_text: string | null;
  input_type: InputType;
  options: QuestionOption[];
  word_limit: number | null;
  question_order: number;
  image_url: string | null;
  created_at: string;
}

export interface ReadingQuestionInsert {
  group_id: string;
  question_number: number;
  question_text?: string | null;
  input_type?: InputType;
  options?: QuestionOption[];
  word_limit?: number | null;
  question_order?: number;
  image_url?: string | null;
}

export interface ReadingQuestionUpdate {
  question_number?: number;
  question_text?: string | null;
  input_type?: InputType;
  options?: QuestionOption[];
  word_limit?: number | null;
  question_order?: number;
  image_url?: string | null;
}


// =============================================
// WRITING MODULE
// =============================================

export interface WritingTestRow {
  id: string;
  test_id: string;
  test_type: 'academic' | 'general';
  assigned_teacher_id: string | null;
  created_at: string;
}

export interface WritingTestInsert {
  test_id: string;
  test_type?: 'academic' | 'general';
  assigned_teacher_id?: string | null;
}

export interface WritingTestUpdate {
  test_type?: 'academic' | 'general';
  assigned_teacher_id?: string | null;
}

export interface WritingTaskRow {
  id: string;
  writing_test_id: string;
  task_number: number;
  prompt: string;
  image_url: string | null;
  minimum_words: number;
  recommended_time_minutes: number;
  created_at: string;
}

export interface WritingTaskInsert {
  writing_test_id: string;
  task_number: number;
  prompt: string;
  image_url?: string | null;
  minimum_words?: number;
  recommended_time_minutes?: number;
}

export interface WritingTaskUpdate {
  prompt?: string;
  image_url?: string | null;
  minimum_words?: number;
  recommended_time_minutes?: number;
}


// =============================================
// SPEAKING MODULE
// =============================================

export interface SpeakingTestRow {
  id: string;
  test_id: string;
  assigned_teacher_id: string | null;
  created_at: string;
}

export interface SpeakingTestInsert {
  test_id: string;
  assigned_teacher_id?: string | null;
}

export interface SpeakingTestUpdate {
  assigned_teacher_id?: string | null;
}

export interface SpeakingPartRow {
  id: string;
  speaking_test_id: string;
  part_number: number;
  instructions: string | null;
  created_at: string;
}

export interface SpeakingPartInsert {
  speaking_test_id: string;
  part_number: number;
  instructions?: string | null;
}

export interface SpeakingPartUpdate {
  instructions?: string | null;
}

export interface SpeakingQuestionRow {
  id: string;
  part_id: string;
  question_text: string;
  video_url: string | null;
  think_time_seconds: number;
  max_answer_duration_seconds: number;
  question_order: number;
  created_at: string;
}

export interface SpeakingQuestionInsert {
  part_id: string;
  question_text: string;
  video_url?: string | null;
  think_time_seconds?: number;
  max_answer_duration_seconds?: number;
  question_order?: number;
}

export interface SpeakingQuestionUpdate {
  question_text?: string;
  video_url?: string | null;
  think_time_seconds?: number;
  max_answer_duration_seconds?: number;
  question_order?: number;
}

export interface SpeakingCueCardRow {
  id: string;
  part_id: string;
  topic: string;
  bullet_points: string[];
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  instruction_video_url: string | null;
  created_at: string;
}

export interface SpeakingCueCardInsert {
  part_id: string;
  topic: string;
  bullet_points?: string[];
  preparation_time_seconds?: number;
  speaking_time_seconds?: number;
  instruction_video_url?: string | null;
}

export interface SpeakingCueCardUpdate {
  topic?: string;
  bullet_points?: string[];
  preparation_time_seconds?: number;
  speaking_time_seconds?: number;
  instruction_video_url?: string | null;
}


// =============================================
// FULL MOCK
// =============================================

export interface FullMockTestRow {
  id: string;
  test_id: string;
  listening_test_id: string | null;
  reading_test_id: string | null;
  writing_test_id: string | null;
  speaking_test_id: string | null;
  created_at: string;
}

export interface FullMockTestInsert {
  test_id: string;
  listening_test_id?: string | null;
  reading_test_id?: string | null;
  writing_test_id?: string | null;
  speaking_test_id?: string | null;
}

export interface FullMockTestUpdate {
  listening_test_id?: string | null;
  reading_test_id?: string | null;
  writing_test_id?: string | null;
  speaking_test_id?: string | null;
}

// =============================================
// ATTEMPTS & RESPONSES
// =============================================

export interface AttemptRow {
  id: string;
  test_id: string;
  student_id: string;
  module: TestModule;
  status: AttemptStatus;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number;
  current_section: string | null;
  current_question: number;
  full_mock_attempt_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttemptInsert {
  test_id: string;
  student_id: string;
  module: TestModule;
  status?: AttemptStatus;
  time_spent_seconds?: number;
  current_section?: string | null;
  current_question?: number;
  full_mock_attempt_id?: string | null;
}

export interface AttemptUpdate {
  status?: AttemptStatus;
  completed_at?: string | null;
  time_spent_seconds?: number;
  current_section?: string | null;
  current_question?: number;
}


export interface StudentResponseRow {
  id: string;
  attempt_id: string;
  question_id: string;
  question_number: number;
  answer: string;
  is_flagged: boolean;
  answered_at: string;
}

export interface StudentResponseInsert {
  attempt_id: string;
  question_id: string;
  question_number: number;
  answer?: string;
  is_flagged?: boolean;
}

export interface StudentResponseUpdate {
  answer?: string;
  is_flagged?: boolean;
  answered_at?: string;
}

export interface WritingResponseRow {
  id: string;
  attempt_id: string;
  task_number: number;
  content: string;
  word_count: number;
  last_saved_at: string;
  created_at: string;
}

export interface WritingResponseInsert {
  attempt_id: string;
  task_number: number;
  content?: string;
  word_count?: number;
}

export interface WritingResponseUpdate {
  content?: string;
  word_count?: number;
  last_saved_at?: string;
}

export interface SpeakingRecordingRow {
  id: string;
  attempt_id: string;
  question_id: string;
  part_number: number;
  audio_url: string;
  duration_seconds: number;
  file_size_bytes: number;
  upload_status: UploadStatus;
  recorded_at: string;
  created_at: string;
}

export interface SpeakingRecordingInsert {
  attempt_id: string;
  question_id: string;
  part_number: number;
  audio_url: string;
  duration_seconds?: number;
  file_size_bytes?: number;
  upload_status?: UploadStatus;
}

export interface SpeakingRecordingUpdate {
  audio_url?: string;
  duration_seconds?: number;
  file_size_bytes?: number;
  upload_status?: UploadStatus;
}


// =============================================
// FULL MOCK ATTEMPTS
// =============================================

export interface FullMockAttemptRow {
  id: string;
  full_mock_test_id: string;
  student_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  listening_attempt_id: string | null;
  reading_attempt_id: string | null;
  writing_attempt_id: string | null;
  speaking_attempt_id: string | null;
  listening_completed: boolean;
  reading_completed: boolean;
  writing_completed: boolean;
  speaking_completed: boolean;
  current_module: string;
  listening_band: number | null;
  reading_band: number | null;
  writing_band: number | null;
  speaking_band: number | null;
  overall_band: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FullMockAttemptInsert {
  full_mock_test_id: string;
  student_id: string;
  status?: 'in_progress' | 'completed' | 'abandoned';
  current_module?: string;
}

export interface FullMockAttemptUpdate {
  status?: 'in_progress' | 'completed' | 'abandoned';
  listening_attempt_id?: string | null;
  reading_attempt_id?: string | null;
  writing_attempt_id?: string | null;
  speaking_attempt_id?: string | null;
  listening_completed?: boolean;
  reading_completed?: boolean;
  writing_completed?: boolean;
  speaking_completed?: boolean;
  current_module?: string;
  listening_band?: number | null;
  reading_band?: number | null;
  writing_band?: number | null;
  speaking_band?: number | null;
  overall_band?: number | null;
  completed_at?: string | null;
}


// =============================================
// SCORING & FEEDBACK
// =============================================

export interface ScoreRow {
  id: string;
  attempt_id: string;
  module: TestModule;
  raw_score: number | null;
  total_possible: number | null;
  band_score: number;
  scored_by: ScoredBy;
  scored_at: string;
  created_at: string;
}

export interface ScoreInsert {
  attempt_id: string;
  module: TestModule;
  raw_score?: number | null;
  total_possible?: number | null;
  band_score: number;
  scored_by: ScoredBy;
}

export interface ScoreUpdate {
  raw_score?: number | null;
  total_possible?: number | null;
  band_score?: number;
  scored_by?: ScoredBy;
}

export interface RubricScoreRow {
  id: string;
  score_id: string;
  criterion: string;
  band: number;
  comment: string | null;
  improvement_suggestion: string | null;
  created_at: string;
}

export interface RubricScoreInsert {
  score_id: string;
  criterion: string;
  band: number;
  comment?: string | null;
  improvement_suggestion?: string | null;
}

export interface RubricScoreUpdate {
  criterion?: string;
  band?: number;
  comment?: string | null;
  improvement_suggestion?: string | null;
}

export interface TeacherFeedbackRow {
  id: string;
  score_id: string;
  teacher_id: string | null;
  overall_comment: string | null;
  strengths: string[];
  weaknesses: string[];
  improvement_plan: string | null;
  status: FeedbackStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherFeedbackInsert {
  score_id: string;
  teacher_id?: string | null;
  overall_comment?: string | null;
  strengths?: string[];
  weaknesses?: string[];
  improvement_plan?: string | null;
  status?: FeedbackStatus;
}

export interface TeacherFeedbackUpdate {
  overall_comment?: string | null;
  strengths?: string[];
  weaknesses?: string[];
  improvement_plan?: string | null;
  status?: FeedbackStatus;
  published_at?: string | null;
}


// =============================================
// PLATFORM / MANAGEMENT
// =============================================

export interface AutosaveRow {
  id: string;
  attempt_id: string;
  student_id: string;
  responses: Record<string, string>;
  current_question: number;
  current_section: string | null;
  saved_at: string;
}

export interface AutosaveInsert {
  attempt_id: string;
  student_id: string;
  responses?: Record<string, string>;
  current_question?: number;
  current_section?: string | null;
}

export interface AutosaveUpdate {
  responses?: Record<string, string>;
  current_question?: number;
  current_section?: string | null;
  saved_at?: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string | null;
}

export interface NotificationUpdate {
  read?: boolean;
}

export interface ActivityLogRow {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface ActivityLogInsert {
  user_id?: string | null;
  action: string;
  details?: Record<string, unknown>;
  ip_address?: string | null;
}


export interface SiteSettingsRow {
  id: string;
  site_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  social_links: Record<string, string>;
  seo_title: string | null;
  seo_description: string | null;
  footer_content: string | null;
  updated_at: string;
}

export interface SiteSettingsInsert {
  site_name?: string;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  social_links?: Record<string, string>;
  seo_title?: string | null;
  seo_description?: string | null;
  footer_content?: string | null;
}

export interface SiteSettingsUpdate {
  site_name?: string;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  social_links?: Record<string, string>;
  seo_title?: string | null;
  seo_description?: string | null;
  footer_content?: string | null;
}

export interface TestAccessRow {
  id: string;
  test_id: string;
  user_id: string;
  granted_by: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface TestAccessInsert {
  test_id: string;
  user_id: string;
  granted_by?: string | null;
  expires_at?: string | null;
}

export interface UploadedAssetRow {
  id: string;
  uploaded_by: string | null;
  bucket: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
  public_url: string | null;
  created_at: string;
}

export interface UploadedAssetInsert {
  uploaded_by?: string | null;
  bucket: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string | null;
  public_url?: string | null;
}


// =============================================
// COMPOSITE / JOIN TYPES (for queries with relations)
// =============================================

/** Test with its module-specific data */
export interface TestWithModule extends TestRow {
  listening_test?: ListeningTestRow & {
    parts: (ListeningPartRow & {
      question_groups: (ListeningQuestionGroupRow & {
        questions: (ListeningQuestionRow & {
          answer_key?: AnswerKeyRow;
        })[];
      })[];
    })[];
  };
  reading_test?: ReadingTestRow & {
    passages: (ReadingPassageRow & {
      paragraphs: ReadingParagraphRow[];
      question_groups: (ReadingQuestionGroupRow & {
        questions: (ReadingQuestionRow & {
          answer_key?: AnswerKeyRow;
        })[];
      })[];
    })[];
  };
  writing_test?: WritingTestRow & {
    tasks: WritingTaskRow[];
  };
  speaking_test?: SpeakingTestRow & {
    parts: (SpeakingPartRow & {
      questions: SpeakingQuestionRow[];
      cue_card?: SpeakingCueCardRow;
    })[];
  };
  full_mock_test?: FullMockTestRow;
}

/** Attempt with score and feedback */
export interface AttemptWithScore extends AttemptRow {
  test?: TestRow;
  score?: ScoreRow & {
    rubric_scores?: RubricScoreRow[];
    teacher_feedback?: TeacherFeedbackRow;
  };
  responses?: StudentResponseRow[];
  writing_responses?: WritingResponseRow[];
  speaking_recordings?: SpeakingRecordingRow[];
}

/** Full mock attempt with all details */
export interface FullMockAttemptWithDetails extends FullMockAttemptRow {
  full_mock_test?: FullMockTestRow & { test?: TestRow };
  listening_attempt?: AttemptWithScore;
  reading_attempt?: AttemptWithScore;
  writing_attempt?: AttemptWithScore;
  speaking_attempt?: AttemptWithScore;
}

/** Dashboard stats */
export interface AdminDashboardStats {
  totalStudents: number;
  totalTests: number;
  totalAttempts: number;
  pendingWriting: number;
  pendingSpeaking: number;
  completedFullMocks: number;
}

export interface StudentDashboardStats {
  overallBand: number | null;
  testsTaken: number;
  pendingFeedback: number;
  moduleScores: {
    listening: number | null;
    reading: number | null;
    writing: number | null;
    speaking: number | null;
  };
}

export interface TeacherDashboardStats {
  pendingWriting: number;
  pendingSpeaking: number;
  totalReviewed: number;
  assignedStudents: number;
}
