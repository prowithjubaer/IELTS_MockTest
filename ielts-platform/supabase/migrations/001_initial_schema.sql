-- =============================================
-- PRO ENGLISH BD - IELTS MOCK TEST PLATFORM
-- COMPLETE DATABASE MIGRATION
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. PROFILES & AUTH
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' 
    CHECK (role IN ('guest','student','teacher','admin','super_admin')),
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  target_band DECIMAL(2,1) DEFAULT 7.0,
  exam_date DATE,
  study_hours_per_week INTEGER DEFAULT 0,
  country TEXT DEFAULT 'Bangladesh',
  institution TEXT,
  test_type TEXT DEFAULT 'academic' CHECK (test_type IN ('academic','general')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  specialization TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  is_available BOOLEAN DEFAULT true,
  max_assignments_per_day INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 2. TESTS (Core)
-- =============================================

CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  module TEXT NOT NULL CHECK (module IN ('listening','reading','writing','speaking','full')),
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_questions INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  access TEXT DEFAULT 'free' CHECK (access IN ('free','paid','assigned')),
  attempt_limit INTEGER,
  instructions TEXT,
  instruction_video_url TEXT,
  test_type TEXT DEFAULT 'academic' CHECK (test_type IN ('academic','general')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);


-- =============================================
-- 3. LISTENING MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS listening_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  audio_url TEXT,
  audio_duration_seconds INTEGER DEFAULT 0,
  allow_replay BOOLEAN DEFAULT false,
  review_time_seconds INTEGER DEFAULT 600,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listening_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listening_test_id UUID REFERENCES listening_tests(id) ON DELETE CASCADE NOT NULL,
  part_number INTEGER NOT NULL CHECK (part_number BETWEEN 1 AND 4),
  title TEXT NOT NULL,
  audio_url TEXT,
  audio_start_time INTEGER DEFAULT 0,
  audio_end_time INTEGER DEFAULT 0,
  instructions TEXT,
  context_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listening_test_id, part_number)
);


CREATE TABLE IF NOT EXISTS listening_question_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listening_part_id UUID REFERENCES listening_parts(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  instructions TEXT NOT NULL,
  question_type TEXT NOT NULL,
  group_order INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  context_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listening_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES listening_question_groups(id) ON DELETE CASCADE NOT NULL,
  question_number INTEGER NOT NULL,
  question_text TEXT,
  input_type TEXT DEFAULT 'text' 
    CHECK (input_type IN ('text','number','radio','checkbox','dropdown','inline_blank','image_label')),
  options JSONB DEFAULT '[]',
  word_limit INTEGER,
  question_order INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listening_answer_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES listening_questions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  correct_answer TEXT NOT NULL,
  accepted_alternatives TEXT[] DEFAULT '{}',
  case_sensitive BOOLEAN DEFAULT false,
  ignore_spaces BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 4. READING MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS reading_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  test_type TEXT DEFAULT 'academic' CHECK (test_type IN ('academic','general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reading_test_id UUID REFERENCES reading_tests(id) ON DELETE CASCADE NOT NULL,
  passage_number INTEGER NOT NULL CHECK (passage_number BETWEEN 1 AND 3),
  title TEXT NOT NULL,
  source_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reading_test_id, passage_number)
);

CREATE TABLE IF NOT EXISTS reading_paragraphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id UUID REFERENCES reading_passages(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  paragraph_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS reading_question_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id UUID REFERENCES reading_passages(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  instructions TEXT NOT NULL,
  question_type TEXT NOT NULL,
  group_order INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  context_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES reading_question_groups(id) ON DELETE CASCADE NOT NULL,
  question_number INTEGER NOT NULL,
  question_text TEXT,
  input_type TEXT DEFAULT 'text'
    CHECK (input_type IN ('text','number','radio','checkbox','dropdown','inline_blank','image_label')),
  options JSONB DEFAULT '[]',
  word_limit INTEGER,
  question_order INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_answer_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES reading_questions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  correct_answer TEXT NOT NULL,
  accepted_alternatives TEXT[] DEFAULT '{}',
  case_sensitive BOOLEAN DEFAULT false,
  ignore_spaces BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 5. WRITING MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS writing_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  test_type TEXT DEFAULT 'academic' CHECK (test_type IN ('academic','general')),
  assigned_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS writing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writing_test_id UUID REFERENCES writing_tests(id) ON DELETE CASCADE NOT NULL,
  task_number INTEGER NOT NULL CHECK (task_number BETWEEN 1 AND 2),
  prompt TEXT NOT NULL,
  image_url TEXT,
  minimum_words INTEGER NOT NULL DEFAULT 150,
  recommended_time_minutes INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(writing_test_id, task_number)
);


-- =============================================
-- 6. SPEAKING MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS speaking_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  assigned_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS speaking_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  speaking_test_id UUID REFERENCES speaking_tests(id) ON DELETE CASCADE NOT NULL,
  part_number INTEGER NOT NULL CHECK (part_number BETWEEN 1 AND 3),
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speaking_test_id, part_number)
);

CREATE TABLE IF NOT EXISTS speaking_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES speaking_parts(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  video_url TEXT,
  think_time_seconds INTEGER DEFAULT 5,
  max_answer_duration_seconds INTEGER DEFAULT 60,
  question_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS speaking_cue_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES speaking_parts(id) ON DELETE CASCADE UNIQUE,
  topic TEXT NOT NULL,
  bullet_points TEXT[] NOT NULL DEFAULT '{}',
  preparation_time_seconds INTEGER DEFAULT 60,
  speaking_time_seconds INTEGER DEFAULT 120,
  instruction_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 7. FULL MOCK TESTS
-- =============================================

CREATE TABLE IF NOT EXISTS full_mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  listening_test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  reading_test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  writing_test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  speaking_test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 8. ATTEMPTS & RESPONSES
-- =============================================

CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('listening','reading','writing','speaking','full')),
  status TEXT DEFAULT 'in_progress' 
    CHECK (status IN ('in_progress','completed','abandoned','timed_out','pending_review','reviewed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  current_section TEXT,
  current_question INTEGER DEFAULT 1,
  -- For full mock tracking
  full_mock_attempt_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID NOT NULL,
  question_number INTEGER NOT NULL,
  answer TEXT DEFAULT '',
  is_flagged BOOLEAN DEFAULT false,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);


CREATE TABLE IF NOT EXISTS writing_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
  task_number INTEGER NOT NULL CHECK (task_number BETWEEN 1 AND 2),
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER DEFAULT 0,
  last_saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, task_number)
);

CREATE TABLE IF NOT EXISTS speaking_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID NOT NULL,
  part_number INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  file_size_bytes INTEGER DEFAULT 0,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending','uploading','completed','failed')),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 9. FULL MOCK ATTEMPTS
-- =============================================

CREATE TABLE IF NOT EXISTS full_mock_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_mock_test_id UUID REFERENCES full_mock_tests(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','completed','abandoned')),
  -- Module attempt references
  listening_attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  reading_attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  writing_attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  speaking_attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  -- Module completion
  listening_completed BOOLEAN DEFAULT false,
  reading_completed BOOLEAN DEFAULT false,
  writing_completed BOOLEAN DEFAULT false,
  speaking_completed BOOLEAN DEFAULT false,
  current_module TEXT DEFAULT 'listening',
  -- Band scores
  listening_band DECIMAL(2,1),
  reading_band DECIMAL(2,1),
  writing_band DECIMAL(2,1),
  speaking_band DECIMAL(2,1),
  overall_band DECIMAL(2,1),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from attempts back to full_mock_attempts
ALTER TABLE attempts 
  ADD CONSTRAINT fk_attempts_full_mock 
  FOREIGN KEY (full_mock_attempt_id) 
  REFERENCES full_mock_attempts(id) ON DELETE SET NULL;


-- =============================================
-- 10. SCORING & FEEDBACK
-- =============================================

CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE UNIQUE NOT NULL,
  module TEXT NOT NULL,
  raw_score INTEGER,
  total_possible INTEGER,
  band_score DECIMAL(2,1) NOT NULL,
  scored_by TEXT NOT NULL CHECK (scored_by IN ('auto','teacher')),
  scored_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rubric_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID REFERENCES scores(id) ON DELETE CASCADE NOT NULL,
  criterion TEXT NOT NULL,
  band DECIMAL(2,1) NOT NULL,
  comment TEXT,
  improvement_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID REFERENCES scores(id) ON DELETE CASCADE UNIQUE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  overall_comment TEXT,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  improvement_plan TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 11. AUTOSAVE
-- =============================================

CREATE TABLE IF NOT EXISTS autosaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  current_question INTEGER DEFAULT 1,
  current_section TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id)
);

-- =============================================
-- 12. PLATFORM / MANAGEMENT
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','feedback','result')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'Pro English BD',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#e53e3e',
  secondary_color TEXT DEFAULT '#102a43',
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  social_links JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  footer_content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_id, user_id)
);

CREATE TABLE IF NOT EXISTS uploaded_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  bucket TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- 13. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_tests_module ON tests(module);
CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_slug ON tests(slug);
CREATE INDEX IF NOT EXISTS idx_tests_access ON tests(access);
CREATE INDEX IF NOT EXISTS idx_tests_created_by ON tests(created_by);
CREATE INDEX IF NOT EXISTS idx_listening_parts_test ON listening_parts(listening_test_id);
CREATE INDEX IF NOT EXISTS idx_listening_qgroups_part ON listening_question_groups(listening_part_id);
CREATE INDEX IF NOT EXISTS idx_listening_questions_group ON listening_questions(group_id);
CREATE INDEX IF NOT EXISTS idx_reading_passages_test ON reading_passages(reading_test_id);
CREATE INDEX IF NOT EXISTS idx_reading_qgroups_passage ON reading_question_groups(passage_id);
CREATE INDEX IF NOT EXISTS idx_reading_questions_group ON reading_questions(group_id);
CREATE INDEX IF NOT EXISTS idx_writing_tasks_test ON writing_tasks(writing_test_id);
CREATE INDEX IF NOT EXISTS idx_speaking_parts_test ON speaking_parts(speaking_test_id);
CREATE INDEX IF NOT EXISTS idx_speaking_questions_part ON speaking_questions(part_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_test ON attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_module ON attempts(module);
CREATE INDEX IF NOT EXISTS idx_responses_attempt ON student_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_writing_responses_attempt ON writing_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_speaking_recordings_attempt ON speaking_recordings(attempt_id);
CREATE INDEX IF NOT EXISTS idx_scores_attempt ON scores(attempt_id);
CREATE INDEX IF NOT EXISTS idx_full_mock_attempts_student ON full_mock_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_test_access_user ON test_access(user_id);
CREATE INDEX IF NOT EXISTS idx_test_access_test ON test_access(test_id);


-- =============================================
-- 14. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_question_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_question_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_cue_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE full_mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE full_mock_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE autosaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_assets ENABLE ROW LEVEL SECURITY;


-- =============================================
-- 15. HELPER FUNCTIONS
-- =============================================

-- Function to check if user is admin/super_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('teacher', 'admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN COALESCE(user_role, 'guest');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================
-- 16. RLS POLICIES - PROFILES
-- =============================================

-- Profiles: users can read own, admins can read all
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR is_admin());

-- Student profiles
CREATE POLICY "student_profiles_select" ON student_profiles
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "student_profiles_insert" ON student_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "student_profiles_update" ON student_profiles
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- Teacher profiles
CREATE POLICY "teacher_profiles_select" ON teacher_profiles
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "teacher_profiles_insert" ON teacher_profiles
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "teacher_profiles_update" ON teacher_profiles
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());


-- =============================================
-- 17. RLS POLICIES - TESTS (read: published for all, all for admins)
-- =============================================

CREATE POLICY "tests_select_published" ON tests
  FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "tests_insert_admin" ON tests
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "tests_update_admin" ON tests
  FOR UPDATE USING (is_admin());

CREATE POLICY "tests_delete_admin" ON tests
  FOR DELETE USING (is_admin());

-- Listening tests (same pattern: published visible to all, admin full access)
CREATE POLICY "listening_tests_select" ON listening_tests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = listening_tests.test_id AND (tests.status = 'published' OR is_admin()))
  );
CREATE POLICY "listening_tests_admin" ON listening_tests
  FOR ALL USING (is_admin());

CREATE POLICY "listening_parts_select" ON listening_parts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM listening_tests lt JOIN tests t ON t.id = lt.test_id 
      WHERE lt.id = listening_parts.listening_test_id AND (t.status = 'published' OR is_admin()))
  );
CREATE POLICY "listening_parts_admin" ON listening_parts
  FOR ALL USING (is_admin());

CREATE POLICY "listening_qgroups_select" ON listening_question_groups
  FOR SELECT USING (true);
CREATE POLICY "listening_qgroups_admin" ON listening_question_groups
  FOR ALL USING (is_admin());

CREATE POLICY "listening_questions_select" ON listening_questions
  FOR SELECT USING (true);
CREATE POLICY "listening_questions_admin" ON listening_questions
  FOR ALL USING (is_admin());


-- Answer keys: ONLY admins can see (students never see before submit)
CREATE POLICY "listening_answer_keys_admin_only" ON listening_answer_keys
  FOR SELECT USING (is_admin());
CREATE POLICY "listening_answer_keys_admin_write" ON listening_answer_keys
  FOR ALL USING (is_admin());

-- Reading module policies (same pattern)
CREATE POLICY "reading_tests_select" ON reading_tests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = reading_tests.test_id AND (tests.status = 'published' OR is_admin()))
  );
CREATE POLICY "reading_tests_admin" ON reading_tests FOR ALL USING (is_admin());

CREATE POLICY "reading_passages_select" ON reading_passages FOR SELECT USING (true);
CREATE POLICY "reading_passages_admin" ON reading_passages FOR ALL USING (is_admin());

CREATE POLICY "reading_paragraphs_select" ON reading_paragraphs FOR SELECT USING (true);
CREATE POLICY "reading_paragraphs_admin" ON reading_paragraphs FOR ALL USING (is_admin());

CREATE POLICY "reading_qgroups_select" ON reading_question_groups FOR SELECT USING (true);
CREATE POLICY "reading_qgroups_admin" ON reading_question_groups FOR ALL USING (is_admin());

CREATE POLICY "reading_questions_select" ON reading_questions FOR SELECT USING (true);
CREATE POLICY "reading_questions_admin" ON reading_questions FOR ALL USING (is_admin());

CREATE POLICY "reading_answer_keys_admin_only" ON reading_answer_keys
  FOR SELECT USING (is_admin());
CREATE POLICY "reading_answer_keys_admin_write" ON reading_answer_keys
  FOR ALL USING (is_admin());


-- Writing module policies
CREATE POLICY "writing_tests_select" ON writing_tests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = writing_tests.test_id AND (tests.status = 'published' OR is_admin()))
  );
CREATE POLICY "writing_tests_admin" ON writing_tests FOR ALL USING (is_admin());

CREATE POLICY "writing_tasks_select" ON writing_tasks FOR SELECT USING (true);
CREATE POLICY "writing_tasks_admin" ON writing_tasks FOR ALL USING (is_admin());

-- Speaking module policies
CREATE POLICY "speaking_tests_select" ON speaking_tests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = speaking_tests.test_id AND (tests.status = 'published' OR is_admin()))
  );
CREATE POLICY "speaking_tests_admin" ON speaking_tests FOR ALL USING (is_admin());

CREATE POLICY "speaking_parts_select" ON speaking_parts FOR SELECT USING (true);
CREATE POLICY "speaking_parts_admin" ON speaking_parts FOR ALL USING (is_admin());

CREATE POLICY "speaking_questions_select" ON speaking_questions FOR SELECT USING (true);
CREATE POLICY "speaking_questions_admin" ON speaking_questions FOR ALL USING (is_admin());

CREATE POLICY "speaking_cue_cards_select" ON speaking_cue_cards FOR SELECT USING (true);
CREATE POLICY "speaking_cue_cards_admin" ON speaking_cue_cards FOR ALL USING (is_admin());

-- Full mock tests
CREATE POLICY "full_mock_tests_select" ON full_mock_tests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = full_mock_tests.test_id AND (tests.status = 'published' OR is_admin()))
  );
CREATE POLICY "full_mock_tests_admin" ON full_mock_tests FOR ALL USING (is_admin());


-- =============================================
-- 18. RLS POLICIES - ATTEMPTS & RESPONSES
-- =============================================

-- Attempts: students see own, teachers see assigned, admins see all
CREATE POLICY "attempts_select" ON attempts
  FOR SELECT USING (
    student_id = auth.uid() OR is_teacher() OR is_admin()
  );

CREATE POLICY "attempts_insert" ON attempts
  FOR INSERT WITH CHECK (student_id = auth.uid() OR is_admin());

CREATE POLICY "attempts_update" ON attempts
  FOR UPDATE USING (student_id = auth.uid() OR is_admin());

-- Student responses
CREATE POLICY "responses_select" ON student_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = student_responses.attempt_id 
      AND (attempts.student_id = auth.uid() OR is_teacher() OR is_admin()))
  );

CREATE POLICY "responses_insert" ON student_responses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = student_responses.attempt_id 
      AND attempts.student_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "responses_update" ON student_responses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = student_responses.attempt_id 
      AND attempts.student_id = auth.uid())
    OR is_admin()
  );


-- Writing responses
CREATE POLICY "writing_responses_select" ON writing_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = writing_responses.attempt_id 
      AND (attempts.student_id = auth.uid() OR is_teacher() OR is_admin()))
  );

CREATE POLICY "writing_responses_insert" ON writing_responses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = writing_responses.attempt_id 
      AND attempts.student_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "writing_responses_update" ON writing_responses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = writing_responses.attempt_id 
      AND attempts.student_id = auth.uid())
    OR is_admin()
  );

-- Speaking recordings
CREATE POLICY "speaking_recordings_select" ON speaking_recordings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = speaking_recordings.attempt_id 
      AND (attempts.student_id = auth.uid() OR is_teacher() OR is_admin()))
  );

CREATE POLICY "speaking_recordings_insert" ON speaking_recordings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = speaking_recordings.attempt_id 
      AND attempts.student_id = auth.uid())
    OR is_admin()
  );


-- Full mock attempts
CREATE POLICY "full_mock_attempts_select" ON full_mock_attempts
  FOR SELECT USING (student_id = auth.uid() OR is_teacher() OR is_admin());

CREATE POLICY "full_mock_attempts_insert" ON full_mock_attempts
  FOR INSERT WITH CHECK (student_id = auth.uid() OR is_admin());

CREATE POLICY "full_mock_attempts_update" ON full_mock_attempts
  FOR UPDATE USING (student_id = auth.uid() OR is_admin());

-- =============================================
-- 19. RLS POLICIES - SCORING & FEEDBACK
-- =============================================

-- Scores: students see own, teachers and admins see all
CREATE POLICY "scores_select" ON scores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = scores.attempt_id 
      AND (attempts.student_id = auth.uid() OR is_teacher() OR is_admin()))
  );

CREATE POLICY "scores_insert" ON scores
  FOR INSERT WITH CHECK (is_teacher() OR is_admin());

CREATE POLICY "scores_update" ON scores
  FOR UPDATE USING (is_teacher() OR is_admin());

-- Rubric scores
CREATE POLICY "rubric_scores_select" ON rubric_scores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM scores s JOIN attempts a ON a.id = s.attempt_id 
      WHERE s.id = rubric_scores.score_id 
      AND (a.student_id = auth.uid() OR is_teacher() OR is_admin()))
  );

CREATE POLICY "rubric_scores_write" ON rubric_scores
  FOR ALL USING (is_teacher() OR is_admin());


-- Teacher feedback: students see published only, teachers see own/assigned
CREATE POLICY "teacher_feedback_select" ON teacher_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scores s JOIN attempts a ON a.id = s.attempt_id 
      WHERE s.id = teacher_feedback.score_id 
      AND (
        (a.student_id = auth.uid() AND teacher_feedback.status = 'published')
        OR teacher_feedback.teacher_id = auth.uid()
        OR is_admin()
      )
    )
  );

CREATE POLICY "teacher_feedback_write" ON teacher_feedback
  FOR ALL USING (
    teacher_feedback.teacher_id = auth.uid() OR is_admin()
  );

-- =============================================
-- 20. RLS POLICIES - PLATFORM
-- =============================================

-- Autosave
CREATE POLICY "autosaves_select" ON autosaves
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "autosaves_insert" ON autosaves
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "autosaves_update" ON autosaves
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "autosaves_delete" ON autosaves
  FOR DELETE USING (student_id = auth.uid() OR is_admin());

-- Notifications
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert" ON notifications
  FOR INSERT WITH CHECK (is_admin() OR is_teacher());


-- Activity logs
CREATE POLICY "activity_logs_select" ON activity_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "activity_logs_insert" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Site settings: public read, admin write
CREATE POLICY "site_settings_select" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_write" ON site_settings
  FOR ALL USING (is_admin());

-- Test access
CREATE POLICY "test_access_select" ON test_access
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "test_access_write" ON test_access
  FOR ALL USING (is_admin());

-- Uploaded assets
CREATE POLICY "uploaded_assets_select" ON uploaded_assets
  FOR SELECT USING (uploaded_by = auth.uid() OR is_admin());

CREATE POLICY "uploaded_assets_insert" ON uploaded_assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "uploaded_assets_delete" ON uploaded_assets
  FOR DELETE USING (uploaded_by = auth.uid() OR is_admin());


-- =============================================
-- 21. TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tests_updated_at BEFORE UPDATE ON tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER attempts_updated_at BEFORE UPDATE ON attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER full_mock_attempts_updated_at BEFORE UPDATE ON full_mock_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teacher_feedback_updated_at BEFORE UPDATE ON teacher_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  -- If student, auto-create student_profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO student_profiles (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================
-- 22. STORAGE BUCKETS
-- =============================================
-- Run these separately in Supabase Dashboard > Storage or via API:
--
-- INSERT INTO storage.buckets (id, name, public) VALUES 
--   ('listening-audio', 'listening-audio', true),
--   ('writing-assets', 'writing-assets', true),
--   ('speaking-videos', 'speaking-videos', true),
--   ('speaking-recordings', 'speaking-recordings', false),
--   ('instruction-videos', 'instruction-videos', true),
--   ('general-assets', 'general-assets', true);

-- =============================================
-- 23. SEED DATA (Demo Users)
-- =============================================
-- After running migrations, create these users via Supabase Auth:
-- 
-- 1. admin@proenglishbd.com (then update profiles.role = 'admin')
-- 2. teacher@proenglishbd.com (then update profiles.role = 'teacher')
-- 3. student@proenglishbd.com (role defaults to 'student')
--
-- Or run this after auth users are created:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@proenglishbd.com';
-- UPDATE profiles SET role = 'teacher' WHERE email = 'teacher@proenglishbd.com';
-- INSERT INTO teacher_profiles (user_id) 
--   SELECT id FROM profiles WHERE email = 'teacher@proenglishbd.com';

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
