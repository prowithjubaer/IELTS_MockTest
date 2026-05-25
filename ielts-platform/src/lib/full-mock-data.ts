// ============================================
// FULL IELTS MOCK TEST - DATA, TYPES & UTILITIES
// ============================================

export interface FullMockTestData {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  is_free: boolean;
  is_published: boolean;
  total_duration_minutes: number;
  instruction_text: string;
  listening_test_id: string;
  reading_test_id: string;
  writing_test_id: string;
  speaking_test_id: string;
  created_at: string;
}

export interface FullMockAttemptData {
  id: string;
  student_id: string;
  student_name: string;
  full_mock_test_id: string;
  status: "not_started" | "in_progress" | "submitted" | "partially_checked" | "completed";
  current_module: "listening" | "reading" | "writing" | "speaking" | "result";
  started_at: string;
  submitted_at?: string;
  completed_at?: string;
  listening_band?: number;
  reading_band?: number;
  writing_band?: number;
  speaking_band?: number;
  overall_band?: number;
  listening_raw?: number;
  reading_raw?: number;
  time_spent_total: number;
}

// IELTS overall band calculation (average of 4, round to nearest 0.5)
export function calculateOverallBand(
  listening: number | undefined,
  reading: number | undefined,
  writing: number | undefined,
  speaking: number | undefined
): number | null {
  if (listening == null || reading == null || writing == null || speaking == null) return null;
  const avg = (listening + reading + writing + speaking) / 4;
  // IELTS rounding: .25 → .5, .75 → next whole
  return Math.round(avg * 2) / 2;
}

export function getModuleStatus(attempt: FullMockAttemptData, module: string): "not_started" | "completed" | "pending" | "in_progress" {
  const moduleOrder = ["listening", "reading", "writing", "speaking"];
  const currentIdx = moduleOrder.indexOf(attempt.current_module);
  const moduleIdx = moduleOrder.indexOf(module);

  if (attempt.status === "completed" || attempt.status === "submitted") {
    if (module === "writing" && !attempt.writing_band) return "pending";
    if (module === "speaking" && !attempt.speaking_band) return "pending";
    return "completed";
  }

  if (moduleIdx < currentIdx) return "completed";
  if (moduleIdx === currentIdx) return "in_progress";
  return "not_started";
}

// ============================================
// DEMO FULL MOCK TEST
// ============================================
export const DEMO_FULL_MOCK_TEST: FullMockTestData = {
  id: "full-mock-001",
  title: "Full IELTS Mock Test 01",
  description: "A complete IELTS mock test covering all 4 modules: Listening, Reading, Writing, and Speaking. Experience the full exam in one session.",
  difficulty: "medium",
  is_free: true,
  is_published: true,
  total_duration_minutes: 170,
  instruction_text: "This is a full IELTS mock test containing all 4 modules. You will complete them in order: Listening (30 min) → Reading (60 min) → Writing (60 min) → Speaking (13 min). Listening and Reading are auto-scored immediately. Writing and Speaking will be evaluated by an expert teacher within 24-48 hours.",
  listening_test_id: "listening-test-001",
  reading_test_id: "reading-test-001",
  writing_test_id: "writing-test-001",
  speaking_test_id: "speaking-test-001",
  created_at: "2024-01-10T00:00:00Z",
};

// Demo attempts
export const DEMO_FULL_MOCK_ATTEMPTS: FullMockAttemptData[] = [
  {
    id: "fma-001",
    student_id: "student-001",
    student_name: "Jubayer Ahmed",
    full_mock_test_id: "full-mock-001",
    status: "partially_checked",
    current_module: "result",
    started_at: "2024-01-20T09:00:00Z",
    submitted_at: "2024-01-20T12:00:00Z",
    listening_band: 7.0,
    reading_band: 6.5,
    writing_band: undefined,
    speaking_band: undefined,
    overall_band: undefined,
    listening_raw: 30,
    reading_raw: 28,
    time_spent_total: 9600,
  },
  {
    id: "fma-002",
    student_id: "student-002",
    student_name: "Fatima Akter",
    full_mock_test_id: "full-mock-001",
    status: "completed",
    current_module: "result",
    started_at: "2024-01-18T10:00:00Z",
    submitted_at: "2024-01-18T13:00:00Z",
    completed_at: "2024-01-19T14:00:00Z",
    listening_band: 6.0,
    reading_band: 5.5,
    writing_band: 5.0,
    speaking_band: 5.5,
    overall_band: 5.5,
    listening_raw: 23,
    reading_raw: 20,
    time_spent_total: 9200,
  },
];

export const FULL_MOCK_TESTS_LIST = [
  {
    id: "full-mock-001",
    title: "Full IELTS Mock Test 01",
    difficulty: "medium" as const,
    duration: 170,
    modules: 4,
    access: "free" as const,
    status: "not_started" as const,
    attempts: 0,
    band: null as number | null,
  },
  {
    id: "full-mock-002",
    title: "Full IELTS Mock Test 02",
    difficulty: "hard" as const,
    duration: 170,
    modules: 4,
    access: "paid" as const,
    status: "not_started" as const,
    attempts: 0,
    band: null as number | null,
  },
];
