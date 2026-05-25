-- =============================================
-- PRO ENGLISH BD - IELTS MOCK TEST PLATFORM
-- DATABASE SCHEMA (Supabase PostgreSQL)
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & AUTH
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('guest', 'student', 'teacher', 'admin', 'super_admin')),
  avatar_url TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  target_band DECIMAL(2,1),
  exam_date DATE,
  study_hours_per_week INTEGER,
  country VARCHAR(100) DEFAULT 'Bangladesh',
  institution VARCHAR(255),
  test_type VARCHAR(20) DEFAULT 'academic' CHECK (test_type IN ('academic', 'general')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specialization TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  is_available BOOLEAN DEFAULT true,
  max_assignments_per_day INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TESTS & MODULES
-- =============================================

CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  module VARCHAR(20) NOT NULL CHECK (module IN ('listening', 'reading', 'writing', 'speaking', 'full')),
  difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_minutes INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  access VARCHAR(10) DEFAULT 'free' CHECK (access IN ('free', 'paid')),
  attempt_limit INTEGER,
  instructions TEXT,
  instruction_video_url TEXT,
  test_type VARCHAR(20) DEFAULT 'academic' CHECK (test_type IN ('academic', 'general')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE test_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  section_order INTEGER NOT NULL,
  instructions TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES test_sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  part_order INTEGER NOT NULL,
  instructions TEXT,
  audio_url TEXT,
  passage_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- QUESTIONS ENGINE
-- =============================================

CREATE TABLE question_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES test_parts(id) ON DELETE CASCADE,
  title VARCHAR(500),
  instructions TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  group_order INTEGER NOT NULL,
  image_url TEXT,
  context_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES question_groups(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT,
  input_type VARCHAR(30) NOT NULL DEFAULT 'text' CHECK (input_type IN ('text', 'number', 'radio', 'checkbox', 'dropdown', 'inline_blank', 'image_label')),
  word_limit INTEGER,
  question_order INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  label VARCHAR(500) NOT NULL,
  value VARCHAR(500) NOT NULL,
  option_order INTEGER NOT NULL
);

CREATE TABLE answer_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  correct_answer TEXT NOT NULL,
  accepted_alternatives TEXT[] DEFAULT '{}',
  case_sensitive BOOLEAN DEFAULT false,
  ignore_spaces BOOLEAN DEFAULT true
);

-- =============================================
-- LISTENING MODULE
-- =============================================

CREATE TABLE listening_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE,
  audio_url TEXT NOT NULL,
  audio_duration_seconds INTEGER NOT NULL,
  allow_replay BOOLEAN DEFAULT false,
  review_time_seconds INTEGER DEFAULT 0
);

CREATE TABLE listening_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listening_test_id UUID REFERENCES listening_tests(id) ON DELETE CASCADE,
  part_number INTEGER NOT NULL CHECK (part_number BETWEEN 1 AND 4),
  title VARCHAR(255) NOT NULL,
  audio_start_time INTEGER NOT NULL DEFAULT 0,
  audio_end_time INTEGER NOT NULL,
  instructions TEXT,
  context_description TEXT
);

-- =============================================
-- READING MODULE
-- =============================================

CREATE TABLE reading_passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  passage_number INTEGER NOT NULL CHECK (passage_number BETWEEN 1 AND 3),
  title VARCHAR(500) NOT NULL,
  source_text TEXT NOT NULL
);

CREATE TABLE reading_paragraphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id UUID REFERENCES reading_passages(id) ON DELETE CASCADE,
  label VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  paragraph_order INTEGER NOT NULL
);

-- =============================================
-- WRITING MODULE
-- =============================================

CREATE TABLE writing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL CHECK (task_number BETWEEN 1 AND 2),
  task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('academic', 'general')),
  prompt TEXT NOT NULL,
  image_url TEXT,
  minimum_words INTEGER NOT NULL DEFAULT 150,
  recommended_time_minutes INTEGER NOT NULL DEFAULT 20,
  assigned_teacher_id UUID REFERENCES users(id)
);

-- =============================================
-- SPEAKING MODULE
-- =============================================

CREATE TABLE speaking_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  part_number INTEGER NOT NULL CHECK (part_number BETWEEN 1 AND 3),
  instructions TEXT
);

CREATE TABLE speaking_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES speaking_parts(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  video_url TEXT,
  think_time_seconds INTEGER DEFAULT 5,
  max_answer_duration_seconds INTEGER DEFAULT 60,
  question_order INTEGER NOT NULL
);

CREATE TABLE speaking_cue_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES speaking_parts(id) ON DELETE CASCADE UNIQUE,
  topic TEXT NOT NULL,
  bullet_points TEXT[] NOT NULL,
  preparation_time_seconds INTEGER DEFAULT 60,
  speaking_time_seconds INTEGER DEFAULT 120,
  instruction_video_url TEXT
);

-- =============================================
-- ATTEMPTS & RESPONSES
-- =============================================

CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'timed_out')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  current_section VARCHAR(255),
  current_question INTEGER DEFAULT 1
);

CREATE TABLE student_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT,
  is_flagged BOOLEAN DEFAULT false,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

CREATE TABLE writing_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  task_id UUID REFERENCES writing_tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER DEFAULT 0,
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attempt_id, task_id)
);

CREATE TABLE speaking_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES speaking_questions(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SCORING & FEEDBACK
-- =============================================

CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  module VARCHAR(20) NOT NULL,
  raw_score INTEGER,
  total_possible INTEGER,
  band_score DECIMAL(2,1) NOT NULL,
  scored_by VARCHAR(10) NOT NULL CHECK (scored_by IN ('auto', 'teacher')),
  scored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rubric_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID REFERENCES scores(id) ON DELETE CASCADE,
  criterion VARCHAR(100) NOT NULL,
  band DECIMAL(2,1) NOT NULL,
  comment TEXT,
  improvement_suggestion TEXT
);

CREATE TABLE teacher_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID REFERENCES scores(id) ON DELETE CASCADE UNIQUE,
  teacher_id UUID REFERENCES users(id),
  overall_comment TEXT,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  improvement_plan TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUTOSAVE
-- =============================================

CREATE TABLE autosaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '{}',
  current_question INTEGER DEFAULT 1,
  current_section VARCHAR(255),
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced BOOLEAN DEFAULT true
);

-- =============================================
-- PLATFORM MANAGEMENT
-- =============================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'Pro English BD',
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#e53e3e',
  secondary_color VARCHAR(7) DEFAULT '#102a43',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  whatsapp_number VARCHAR(20),
  address TEXT,
  social_links JSONB DEFAULT '{}',
  seo_title VARCHAR(500),
  seo_description TEXT,
  footer_content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'feedback', 'result')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BDT',
  method VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_tests_module ON tests(module);
CREATE INDEX idx_tests_status ON tests(status);
CREATE INDEX idx_tests_access ON tests(access);
CREATE INDEX idx_attempts_student ON attempts(student_id);
CREATE INDEX idx_attempts_test ON attempts(test_id);
CREATE INDEX idx_attempts_status ON attempts(status);
CREATE INDEX idx_responses_attempt ON student_responses(attempt_id);
CREATE INDEX idx_scores_attempt ON scores(attempt_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_question_groups_part ON question_groups(part_id);
CREATE INDEX idx_questions_group ON questions(group_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students view own attempts" ON attempts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students view own responses" ON student_responses FOR SELECT USING (
  attempt_id IN (SELECT id FROM attempts WHERE student_id = auth.uid())
);
CREATE POLICY "Students view own scores" ON scores FOR SELECT USING (
  attempt_id IN (SELECT id FROM attempts WHERE student_id = auth.uid())
);
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
