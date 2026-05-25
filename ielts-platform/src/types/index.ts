// ==========================================
// USER & AUTH TYPES
// ==========================================

export type UserRole = "guest" | "student" | "teacher" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  target_band: number;
  exam_date?: string;
  study_hours_per_week?: number;
  country: string;
  institution?: string;
  test_type: "academic" | "general";
}

export interface TeacherProfile {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  bio?: string;
  is_available: boolean;
  max_assignments_per_day: number;
}

// ==========================================
// TEST & MODULE TYPES
// ==========================================

export type TestModule = "listening" | "reading" | "writing" | "speaking" | "full";
export type TestDifficulty = "easy" | "medium" | "hard";
export type TestStatus = "draft" | "published" | "archived";
export type TestAccess = "free" | "paid";

export interface Test {
  id: string;
  title: string;
  description?: string;
  module: TestModule;
  difficulty: TestDifficulty;
  duration_minutes: number;
  total_questions: number;
  status: TestStatus;
  access: TestAccess;
  attempt_limit?: number;
  instructions?: string;
  instruction_video_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface TestSection {
  id: string;
  test_id: string;
  title: string;
  order: number;
  instructions?: string;
  duration_minutes?: number;
}

export interface TestPart {
  id: string;
  section_id: string;
  title: string;
  order: number;
  instructions?: string;
  audio_url?: string;
  passage_text?: string;
}

// ==========================================
// QUESTION TYPES
// ==========================================

export type QuestionType =
  | "multiple_choice"
  | "multiple_answer"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "matching_information"
  | "matching_features"
  | "matching_sentence_endings"
  | "sentence_completion"
  | "summary_completion"
  | "note_completion"
  | "table_completion"
  | "flow_chart_completion"
  | "diagram_labelling"
  | "map_labelling"
  | "plan_labelling"
  | "form_completion"
  | "short_answer";

export type AnswerInputType =
  | "text"
  | "number"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "inline_blank"
  | "image_label";

export interface QuestionGroup {
  id: string;
  part_id: string;
  title?: string;
  instructions: string;
  question_type: QuestionType;
  order: number;
  image_url?: string;
  context_text?: string;
}

export interface Question {
  id: string;
  group_id: string;
  question_number: number;
  question_text: string;
  input_type: AnswerInputType;
  options?: QuestionOption[];
  word_limit?: number;
  order: number;
  image_url?: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  label: string;
  value: string;
  order: number;
}

export interface AnswerKey {
  id: string;
  question_id: string;
  correct_answer: string;
  accepted_alternatives: string[];
  case_sensitive: boolean;
  ignore_spaces: boolean;
}

// ==========================================
// LISTENING MODULE TYPES
// ==========================================

export interface ListeningTest {
  id: string;
  test_id: string;
  audio_url: string;
  audio_duration_seconds: number;
  allow_replay: boolean;
  review_time_seconds?: number;
}

export interface ListeningPart {
  id: string;
  listening_test_id: string;
  part_number: 1 | 2 | 3 | 4;
  title: string;
  audio_start_time: number;
  audio_end_time: number;
  instructions: string;
  context_description?: string;
}

// ==========================================
// READING MODULE TYPES
// ==========================================

export interface ReadingPassage {
  id: string;
  test_id: string;
  passage_number: 1 | 2 | 3;
  title: string;
  text: string;
  paragraphs: ReadingParagraph[];
}

export interface ReadingParagraph {
  id: string;
  passage_id: string;
  label: string;
  content: string;
  order: number;
}

// ==========================================
// WRITING MODULE TYPES
// ==========================================

export type WritingTestType = "academic" | "general";
export type WritingTaskType = "task1" | "task2";

export interface WritingTask {
  id: string;
  test_id: string;
  task_number: 1 | 2;
  task_type: WritingTestType;
  prompt: string;
  image_url?: string;
  minimum_words: number;
  recommended_time_minutes: number;
  assigned_teacher_id?: string;
}

// ==========================================
// SPEAKING MODULE TYPES
// ==========================================

export interface SpeakingPart {
  id: string;
  test_id: string;
  part_number: 1 | 2 | 3;
  instructions: string;
}

export interface SpeakingQuestion {
  id: string;
  part_id: string;
  question_text: string;
  video_url?: string;
  think_time_seconds: number;
  max_answer_duration_seconds: number;
  order: number;
}

export interface SpeakingCueCard {
  id: string;
  part_id: string;
  topic: string;
  bullet_points: string[];
  preparation_time_seconds: number;
  speaking_time_seconds: number;
  instruction_video_url?: string;
}

// ==========================================
// ATTEMPT & RESPONSE TYPES
// ==========================================

export type AttemptStatus = "in_progress" | "completed" | "abandoned" | "timed_out";

export interface Attempt {
  id: string;
  test_id: string;
  student_id: string;
  status: AttemptStatus;
  started_at: string;
  completed_at?: string;
  time_spent_seconds: number;
  current_section?: string;
  current_question?: number;
}

export interface StudentResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  answer: string;
  is_flagged: boolean;
  answered_at: string;
}

export interface WritingResponse {
  id: string;
  attempt_id: string;
  task_id: string;
  content: string;
  word_count: number;
  last_saved_at: string;
}

export interface SpeakingRecording {
  id: string;
  attempt_id: string;
  question_id: string;
  audio_url: string;
  duration_seconds: number;
  recorded_at: string;
}

// ==========================================
// SCORING & FEEDBACK TYPES
// ==========================================

export interface Score {
  id: string;
  attempt_id: string;
  module: TestModule;
  raw_score?: number;
  total_possible?: number;
  band_score: number;
  scored_by: "auto" | "teacher";
  scored_at: string;
}

export interface RubricScore {
  id: string;
  score_id: string;
  criterion: string;
  band: number;
  comment?: string;
  improvement_suggestion?: string;
}

export interface TeacherFeedback {
  id: string;
  score_id: string;
  teacher_id: string;
  overall_comment: string;
  strengths: string[];
  weaknesses: string[];
  improvement_plan?: string;
  published: boolean;
  published_at?: string;
}

// ==========================================
// PLATFORM TYPES
// ==========================================

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address?: string;
  social_links: Record<string, string>;
  seo_title: string;
  seo_description: string;
  footer_content: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "feedback" | "result";
  read: boolean;
  link?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// ==========================================
// BAND CONVERSION
// ==========================================

export interface BandConversion {
  raw_score: number;
  band_score: number;
  module: "listening" | "reading_academic" | "reading_general";
}

// ==========================================
// AUTOSAVE
// ==========================================

export interface AutosaveData {
  attempt_id: string;
  responses: Record<string, string>;
  current_question: number;
  current_section: string;
  saved_at: string;
  synced: boolean;
}
