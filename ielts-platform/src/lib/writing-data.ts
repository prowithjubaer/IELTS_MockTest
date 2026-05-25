// ============================================
// IELTS WRITING MODULE - DATA, TYPES & UTILITIES
// ============================================

export interface WritingTestData {
  id: string;
  title: string;
  description: string;
  test_type: "academic" | "general";
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  is_free: boolean;
  is_published: boolean;
  instruction_text: string;
  tasks: WritingTaskData[];
}

export interface WritingTaskData {
  id: string;
  task_number: 1 | 2;
  task_type: string;
  prompt: string;
  bullet_points?: string[];
  asset_url?: string;
  minimum_words: number;
  recommended_minutes: number;
  instruction: string;
}

export interface WritingAttemptData {
  id: string;
  test_id: string;
  student_id: string;
  student_name: string;
  status: "draft" | "submitted" | "pending" | "checked";
  started_at: string;
  submitted_at?: string;
  time_spent: number;
  assigned_teacher_id?: string;
  task1_answer: string;
  task1_word_count: number;
  task2_answer: string;
  task2_word_count: number;
  task1_band?: number;
  task2_band?: number;
  final_band?: number;
  feedback?: WritingFeedbackData;
}

export interface WritingRubricScore {
  criterion: string;
  band: number;
  comment: string;
  improvement: string;
}

export interface WritingFeedbackData {
  teacher_id: string;
  teacher_name: string;
  task1_scores: WritingRubricScore[];
  task2_scores: WritingRubricScore[];
  task1_band: number;
  task2_band: number;
  final_band: number;
  overall_feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvement_plan: string;
  grammar_notes: string;
  vocabulary_notes: string;
  coherence_notes: string;
  published_at: string;
}

// Word count utility
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text
    .trim()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((w) => w.length > 0 && /[a-zA-Z0-9]/.test(w))
    .length;
}

// Calculate task band from rubric scores (average, rounded to 0.5)
export function calculateTaskBand(scores: WritingRubricScore[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s.band, 0);
  const avg = sum / scores.length;
  return Math.round(avg * 2) / 2;
}

// Calculate overall writing band (Task 1 = 1/3, Task 2 = 2/3)
export function calculateOverallWritingBand(task1Band: number, task2Band: number): number {
  const weighted = (task1Band * 1 + task2Band * 2) / 3;
  return Math.round(weighted * 2) / 2;
}

// Writing criteria
export const WRITING_TASK1_CRITERIA = [
  "Task Achievement",
  "Coherence & Cohesion",
  "Lexical Resource",
  "Grammatical Range & Accuracy",
];

export const WRITING_TASK2_CRITERIA = [
  "Task Response",
  "Coherence & Cohesion",
  "Lexical Resource",
  "Grammatical Range & Accuracy",
];

export const BAND_OPTIONS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

// ============================================
// DEMO WRITING TEST
// ============================================
export const DEMO_WRITING_TEST: WritingTestData = {
  id: "writing-test-001",
  title: "IELTS Academic Writing Practice Test 01",
  description: "A complete Academic Writing test with Task 1 (graph description) and Task 2 (essay).",
  test_type: "academic",
  difficulty: "medium",
  duration_minutes: 60,
  is_free: true,
  is_published: true,
  instruction_text: "The Writing test has two tasks. You should spend approximately 20 minutes on Task 1 and 40 minutes on Task 2. Task 2 contributes twice as much as Task 1 to the Writing score.",
  tasks: [
    {
      id: "wt-task1",
      task_number: 1,
      task_type: "bar_chart",
      prompt: "The bar chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      asset_url: "/images/writing-task1-chart.png",
      minimum_words: 150,
      recommended_minutes: 20,
      instruction: "You should spend about 20 minutes on this task. Write at least 150 words.",
    },
    {
      id: "wt-task2",
      task_number: 2,
      task_type: "discussion_opinion",
      prompt: "Some people believe that universities should focus on providing academic skills and knowledge, while others think that universities should prepare students for their future careers.\n\nDiscuss both views and give your own opinion.",
      minimum_words: 250,
      recommended_minutes: 40,
      instruction: "You should spend about 40 minutes on this task. Write at least 250 words.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
    },
  ],
};

// Demo submitted attempts for teacher panel
export const DEMO_WRITING_SUBMISSIONS: WritingAttemptData[] = [
  {
    id: "wa-001",
    test_id: "writing-test-001",
    student_id: "student-001",
    student_name: "Jubayer Ahmed",
    status: "pending",
    started_at: "2024-01-15T10:00:00Z",
    submitted_at: "2024-01-15T11:00:00Z",
    time_spent: 3540,
    task1_answer: "The bar chart illustrates the proportion of households living in owned and rented properties in England and Wales over a period from 1918 to 2011. Overall, home ownership increased significantly throughout most of the period, while renting declined steadily before showing a slight recovery in recent years.\n\nIn 1918, the vast majority of households rented their accommodation, with approximately 77% living in rented properties and only 23% owning their homes. This ratio changed gradually over the following decades, with ownership rising to around 30% by 1939 and continuing to increase after the Second World War.\n\nBy 1971, home ownership had surpassed renting for the first time, reaching approximately 51% compared to 49% for rented accommodation. This trend continued strongly, with ownership peaking at around 69% in 2001. However, between 2001 and 2011, there was a slight reversal, with ownership declining to approximately 64% while renting increased to 36%.",
    task1_word_count: 162,
    task2_answer: "The debate over whether universities should prioritize academic knowledge or career preparation is a topic that has gained significant attention in recent years. While both perspectives have valid arguments, I believe that an effective university education should incorporate elements of both approaches.\n\nThose who advocate for a purely academic focus argue that universities are institutions of learning and intellectual development. They maintain that the pursuit of knowledge for its own sake develops critical thinking, analytical skills, and a broad understanding of the world. Furthermore, academic research conducted at universities drives innovation and advances human understanding across all fields. Supporters of this view often point out that many of the world's most successful people attribute their success to the broad education they received rather than specific vocational training.\n\nOn the other hand, proponents of career-focused education contend that the primary purpose of higher education should be to prepare graduates for the workforce. They argue that in today's competitive job market, students need practical skills and relevant experience to secure employment after graduation. Additionally, with the rising cost of university education, students and their families expect a return on their investment in the form of improved career prospects.\n\nIn my opinion, the most effective approach is one that combines both academic rigor and practical application. Universities should maintain their commitment to intellectual development and research while also incorporating internships, industry partnerships, and applied projects that give students real-world experience. This balanced approach ensures that graduates are not only knowledgeable but also equipped with the skills employers value.\n\nIn conclusion, rather than viewing academic learning and career preparation as mutually exclusive, universities should strive to integrate both elements into their curricula. This approach best serves students, employers, and society as a whole.",
    task2_word_count: 287,
  },
  {
    id: "wa-002",
    test_id: "writing-test-001",
    student_id: "student-002",
    student_name: "Fatima Akter",
    status: "checked",
    started_at: "2024-01-14T09:00:00Z",
    submitted_at: "2024-01-14T09:58:00Z",
    time_spent: 3480,
    task1_answer: "The chart shows housing data for England and Wales from 1918 to 2011. In 1918, about 77% of people rented homes while only 23% owned. By 2001, ownership reached 69% but fell slightly to 64% by 2011. Renting decreased from 77% in 1918 to a low of about 31% in 2001 before rising to 36% in 2011.",
    task1_word_count: 65,
    task2_answer: "Universities serve different purposes for different people. Some think they should teach academic subjects while others want career preparation. I think both are important.\n\nAcademic knowledge helps people think better and understand the world. Career skills help people get jobs. The best universities do both.\n\nIn conclusion, universities should balance academic and practical education.",
    task2_word_count: 55,
    task1_band: 4.5,
    task2_band: 4.0,
    final_band: 4.0,
    feedback: {
      teacher_id: "teacher-001",
      teacher_name: "Sarah Johnson",
      task1_scores: [
        { criterion: "Task Achievement", band: 5, comment: "Attempts to address the task but lacks detail", improvement: "Include more specific data and trends" },
        { criterion: "Coherence & Cohesion", band: 4.5, comment: "Basic organization but limited cohesion", improvement: "Use more linking words and paragraph structure" },
        { criterion: "Lexical Resource", band: 4.5, comment: "Limited vocabulary range", improvement: "Learn synonyms for common words" },
        { criterion: "Grammatical Range & Accuracy", band: 4, comment: "Limited sentence variety", improvement: "Practice complex sentences" },
      ],
      task2_scores: [
        { criterion: "Task Response", band: 4, comment: "Underdeveloped response, well below word count", improvement: "Expand each point with examples and explanations" },
        { criterion: "Coherence & Cohesion", band: 4, comment: "Very basic paragraph structure", improvement: "Develop each paragraph with topic sentence and supporting ideas" },
        { criterion: "Lexical Resource", band: 4, comment: "Very limited vocabulary", improvement: "Read academic essays and note useful phrases" },
        { criterion: "Grammatical Range & Accuracy", band: 4, comment: "Only simple sentences used", improvement: "Practice subordinate clauses and complex structures" },
      ],
      task1_band: 4.5,
      task2_band: 4.0,
      final_band: 4.0,
      overall_feedback: "Both tasks are significantly under the minimum word count, which severely limits the band score. Focus on developing your ideas more fully and writing at least the minimum required words.",
      strengths: ["Understands the basic task requirements", "Attempts to address both tasks"],
      weaknesses: ["Far below minimum word count for both tasks", "Very limited idea development", "Insufficient supporting examples", "Limited vocabulary range"],
      improvement_plan: "1. Practice writing at least 150 words for Task 1 and 250 for Task 2\n2. Learn to develop ideas with examples\n3. Study model essays for structure\n4. Build academic vocabulary",
      grammar_notes: "Focus on using a variety of sentence structures. Currently only simple sentences are used.",
      vocabulary_notes: "Expand academic vocabulary. Learn collocations and topic-specific words.",
      coherence_notes: "Use clear paragraph structure: introduction, body paragraphs with topic sentences, conclusion.",
      published_at: "2024-01-15T14:00:00Z",
    },
  },
];

// Tests list
export const WRITING_TESTS_LIST = [
  { id: "writing-test-001", title: "IELTS Academic Writing Practice Test 01", test_type: "academic" as const, difficulty: "medium" as const, duration: 60, access: "free" as const, status: "not_started" as const },
  { id: "writing-test-002", title: "IELTS Academic Writing Practice Test 02", test_type: "academic" as const, difficulty: "hard" as const, duration: 60, access: "paid" as const, status: "not_started" as const },
  { id: "writing-test-003", title: "IELTS General Training Writing Test 01", test_type: "general" as const, difficulty: "easy" as const, duration: 60, access: "paid" as const, status: "not_started" as const },
];
