// ============================================
// IELTS SPEAKING MODULE - DATA, TYPES & UTILITIES
// ============================================

export interface SpeakingTestData {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  is_free: boolean;
  is_published: boolean;
  instruction_text: string;
  parts: SpeakingPartData[];
}

export interface SpeakingPartData {
  id: string;
  part_number: 1 | 2 | 3;
  title: string;
  instruction: string;
  questions: SpeakingQuestionData[];
  cue_card?: SpeakingCueCardData;
}

export interface SpeakingQuestionData {
  id: string;
  question_text: string;
  examiner_video_url?: string;
  think_time_seconds: number;
  max_answer_seconds: number;
  order: number;
}

export interface SpeakingCueCardData {
  topic: string;
  bullet_points: string[];
  preparation_seconds: number;
  speaking_seconds: number;
  note_enabled: boolean;
  examiner_video_url?: string;
}

export interface SpeakingAttemptData {
  id: string;
  test_id: string;
  student_id: string;
  student_name: string;
  status: "draft" | "submitted" | "pending" | "checked";
  started_at: string;
  submitted_at?: string;
  total_duration_seconds: number;
  recordings: SpeakingRecordingData[];
  cue_card_notes?: string;
  final_band?: number;
  feedback?: SpeakingFeedbackData;
}

export interface SpeakingRecordingData {
  id: string;
  question_id: string;
  part_number: number;
  duration_seconds: number;
  status: "recorded" | "uploaded" | "failed";
  recorded_at: string;
}

export interface SpeakingRubricScore {
  criterion: string;
  band: number;
  comment: string;
  improvement: string;
}

export interface SpeakingFeedbackData {
  teacher_id: string;
  teacher_name: string;
  scores: SpeakingRubricScore[];
  final_band: number;
  overall_feedback: string;
  fluency_notes: string;
  vocabulary_notes: string;
  grammar_notes: string;
  pronunciation_notes: string;
  strengths: string[];
  weaknesses: string[];
  improvement_plan: string;
  published_at: string;
}

// Criteria
export const SPEAKING_CRITERIA = [
  "Fluency & Coherence",
  "Lexical Resource",
  "Grammatical Range & Accuracy",
  "Pronunciation",
];

export const BAND_OPTIONS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export function calculateSpeakingBand(scores: SpeakingRubricScore[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s.band, 0);
  const avg = sum / scores.length;
  return Math.round(avg * 2) / 2;
}

// ============================================
// DEMO SPEAKING TEST
// ============================================
export const DEMO_SPEAKING_TEST: SpeakingTestData = {
  id: "speaking-test-001",
  title: "IELTS Speaking Practice Test 01",
  description: "A complete IELTS Speaking mock test with 3 parts simulating the real examiner-led interview experience.",
  difficulty: "medium",
  duration_minutes: 13,
  is_free: true,
  is_published: true,
  instruction_text: "The Speaking test takes 11-14 minutes. It has three parts. In Part 1, the examiner asks general questions about yourself. In Part 2, you speak for 1-2 minutes about a topic on a card. In Part 3, the examiner asks deeper questions related to Part 2.",
  parts: [
    // PART 1
    {
      id: "sp-part1",
      part_number: 1,
      title: "Part 1 — Introduction & Interview",
      instruction: "The examiner will ask you general questions about yourself and familiar topics such as your home, family, work, studies, and interests.",
      questions: [
        { id: "spq1", question_text: "What is your full name?", think_time_seconds: 3, max_answer_seconds: 30, order: 1 },
        { id: "spq2", question_text: "Where are you from?", think_time_seconds: 3, max_answer_seconds: 45, order: 2 },
        { id: "spq3", question_text: "Do you work or are you a student?", think_time_seconds: 3, max_answer_seconds: 45, order: 3 },
        { id: "spq4", question_text: "What do you enjoy most about your studies or work?", think_time_seconds: 5, max_answer_seconds: 60, order: 4 },
        { id: "spq5", question_text: "How do you usually spend your free time?", think_time_seconds: 5, max_answer_seconds: 60, order: 5 },
        { id: "spq6", question_text: "Do you prefer spending time indoors or outdoors? Why?", think_time_seconds: 5, max_answer_seconds: 60, order: 6 },
      ],
    },
    // PART 2
    {
      id: "sp-part2",
      part_number: 2,
      title: "Part 2 — Long Turn (Cue Card)",
      instruction: "You will be given a topic card. You have 1 minute to prepare, then speak for 1-2 minutes.",
      questions: [
        { id: "spq7", question_text: "Now I'd like you to speak about the following topic for 1 to 2 minutes.", think_time_seconds: 0, max_answer_seconds: 120, order: 1 },
      ],
      cue_card: {
        topic: "Describe a large company that you are interested in.",
        bullet_points: [
          "what the company is",
          "what the company does or produces",
          "how you first learned about this company",
          "and explain why you are interested in this company",
        ],
        preparation_seconds: 60,
        speaking_seconds: 120,
        note_enabled: true,
      },
    },
    // PART 3
    {
      id: "sp-part3",
      part_number: 3,
      title: "Part 3 — Discussion",
      instruction: "The examiner will ask more abstract questions related to the Part 2 topic about companies, business, and work.",
      questions: [
        { id: "spq8", question_text: "What are the advantages and disadvantages of working for a large company?", think_time_seconds: 5, max_answer_seconds: 90, order: 1 },
        { id: "spq9", question_text: "How has technology changed the way companies operate?", think_time_seconds: 5, max_answer_seconds: 90, order: 2 },
        { id: "spq10", question_text: "Do you think small businesses can compete with large corporations?", think_time_seconds: 5, max_answer_seconds: 90, order: 3 },
        { id: "spq11", question_text: "What qualities make a company successful in today's world?", think_time_seconds: 5, max_answer_seconds: 90, order: 4 },
        { id: "spq12", question_text: "How important is it for companies to be socially responsible?", think_time_seconds: 5, max_answer_seconds: 90, order: 5 },
      ],
    },
  ],
};

// Demo submissions
export const DEMO_SPEAKING_SUBMISSIONS: SpeakingAttemptData[] = [
  {
    id: "sa-001",
    test_id: "speaking-test-001",
    student_id: "student-001",
    student_name: "Jubayer Ahmed",
    status: "pending",
    started_at: "2024-01-16T10:00:00Z",
    submitted_at: "2024-01-16T10:14:00Z",
    total_duration_seconds: 780,
    recordings: [
      { id: "r1", question_id: "spq1", part_number: 1, duration_seconds: 18, status: "uploaded", recorded_at: "2024-01-16T10:01:00Z" },
      { id: "r2", question_id: "spq2", part_number: 1, duration_seconds: 32, status: "uploaded", recorded_at: "2024-01-16T10:01:40Z" },
      { id: "r3", question_id: "spq3", part_number: 1, duration_seconds: 28, status: "uploaded", recorded_at: "2024-01-16T10:02:20Z" },
      { id: "r4", question_id: "spq4", part_number: 1, duration_seconds: 45, status: "uploaded", recorded_at: "2024-01-16T10:03:00Z" },
      { id: "r5", question_id: "spq5", part_number: 1, duration_seconds: 40, status: "uploaded", recorded_at: "2024-01-16T10:04:00Z" },
      { id: "r6", question_id: "spq6", part_number: 1, duration_seconds: 42, status: "uploaded", recorded_at: "2024-01-16T10:05:00Z" },
      { id: "r7", question_id: "spq7", part_number: 2, duration_seconds: 105, status: "uploaded", recorded_at: "2024-01-16T10:07:30Z" },
      { id: "r8", question_id: "spq8", part_number: 3, duration_seconds: 65, status: "uploaded", recorded_at: "2024-01-16T10:09:30Z" },
      { id: "r9", question_id: "spq9", part_number: 3, duration_seconds: 70, status: "uploaded", recorded_at: "2024-01-16T10:11:00Z" },
      { id: "r10", question_id: "spq10", part_number: 3, duration_seconds: 55, status: "uploaded", recorded_at: "2024-01-16T10:12:20Z" },
      { id: "r11", question_id: "spq11", part_number: 3, duration_seconds: 60, status: "uploaded", recorded_at: "2024-01-16T10:13:30Z" },
    ],
    cue_card_notes: "Google - tech company\nSearch engine, cloud, AI\nUsed since school\nInnovation, work culture",
  },
  {
    id: "sa-002",
    test_id: "speaking-test-001",
    student_id: "student-002",
    student_name: "Rahim Uddin",
    status: "checked",
    started_at: "2024-01-15T14:00:00Z",
    submitted_at: "2024-01-15T14:13:00Z",
    total_duration_seconds: 720,
    recordings: [
      { id: "r12", question_id: "spq1", part_number: 1, duration_seconds: 15, status: "uploaded", recorded_at: "2024-01-15T14:01:00Z" },
      { id: "r13", question_id: "spq2", part_number: 1, duration_seconds: 25, status: "uploaded", recorded_at: "2024-01-15T14:01:30Z" },
      { id: "r14", question_id: "spq3", part_number: 1, duration_seconds: 20, status: "uploaded", recorded_at: "2024-01-15T14:02:00Z" },
      { id: "r15", question_id: "spq4", part_number: 1, duration_seconds: 35, status: "uploaded", recorded_at: "2024-01-15T14:02:30Z" },
      { id: "r16", question_id: "spq5", part_number: 1, duration_seconds: 30, status: "uploaded", recorded_at: "2024-01-15T14:03:20Z" },
      { id: "r17", question_id: "spq6", part_number: 1, duration_seconds: 35, status: "uploaded", recorded_at: "2024-01-15T14:04:00Z" },
      { id: "r18", question_id: "spq7", part_number: 2, duration_seconds: 95, status: "uploaded", recorded_at: "2024-01-15T14:06:30Z" },
      { id: "r19", question_id: "spq8", part_number: 3, duration_seconds: 50, status: "uploaded", recorded_at: "2024-01-15T14:09:00Z" },
      { id: "r20", question_id: "spq9", part_number: 3, duration_seconds: 55, status: "uploaded", recorded_at: "2024-01-15T14:10:30Z" },
      { id: "r21", question_id: "spq10", part_number: 3, duration_seconds: 45, status: "uploaded", recorded_at: "2024-01-15T14:11:30Z" },
    ],
    cue_card_notes: "Samsung - electronics\nPhones, TVs, chips\nFirst phone was Samsung",
    final_band: 6.0,
    feedback: {
      teacher_id: "teacher-001",
      teacher_name: "Sarah Johnson",
      scores: [
        { criterion: "Fluency & Coherence", band: 6, comment: "Generally fluent with some hesitation on complex topics", improvement: "Practice speaking on abstract topics without pausing" },
        { criterion: "Lexical Resource", band: 6, comment: "Adequate vocabulary for familiar topics, limited for abstract", improvement: "Learn topic-specific vocabulary for business and technology" },
        { criterion: "Grammatical Range & Accuracy", band: 5.5, comment: "Mix of simple and complex structures with some errors", improvement: "Practice conditional sentences and passive voice" },
        { criterion: "Pronunciation", band: 6.5, comment: "Generally clear pronunciation with occasional L1 influence", improvement: "Work on word stress patterns and intonation in questions" },
      ],
      final_band: 6.0,
      overall_feedback: "Good performance overall. Part 1 answers were clear and natural. Part 2 could be extended with more detail. Part 3 responses need more development of abstract ideas.",
      fluency_notes: "Some hesitation in Part 3 when discussing abstract concepts. Part 1 was fluent and natural.",
      vocabulary_notes: "Good everyday vocabulary. Needs more academic/business vocabulary for Part 3 topics.",
      grammar_notes: "Good use of present tenses. Needs more variety with conditionals, passives, and complex clauses.",
      pronunciation_notes: "Clear overall. Watch stress on multi-syllable words: technology, responsible, corporation.",
      strengths: ["Natural delivery in Part 1", "Good eye contact/engagement", "Cue card well-organized", "Clear pronunciation"],
      weaknesses: ["Part 3 answers too short", "Limited abstract vocabulary", "Some grammatical errors in complex sentences", "Part 2 slightly under 2 minutes"],
      improvement_plan: "1. Practice speaking about abstract topics for 90+ seconds\n2. Learn vocabulary for business, technology, society\n3. Study and use conditionals and passive voice\n4. Record yourself and listen for pronunciation issues",
      published_at: "2024-01-16T09:00:00Z",
    },
  },
];

export const SPEAKING_TESTS_LIST = [
  { id: "speaking-test-001", title: "IELTS Speaking Practice Test 01", difficulty: "medium" as const, duration: 13, access: "free" as const, status: "not_started" as const },
  { id: "speaking-test-002", title: "IELTS Speaking Practice Test 02", difficulty: "hard" as const, duration: 14, access: "paid" as const, status: "not_started" as const },
];
