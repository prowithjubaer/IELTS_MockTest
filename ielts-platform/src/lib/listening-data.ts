// ============================================
// DEMO LISTENING TEST - COMPLETE SEED DATA
// 40 questions across 4 parts
// ============================================

export interface ListeningTestData {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  is_free: boolean;
  is_published: boolean;
  instruction_text: string;
  main_audio_url: string;
  ielts_mode: boolean;
  practice_mode: boolean;
  parts: ListeningPartData[];
}

export interface ListeningPartData {
  id: string;
  part_number: number;
  title: string;
  instruction: string;
  question_start: number;
  question_end: number;
  groups: ListeningQuestionGroupData[];
}

export interface ListeningQuestionGroupData {
  id: string;
  title: string;
  instruction: string;
  question_type: string;
  asset_url?: string;
  questions: ListeningQuestionData[];
}

export interface ListeningQuestionData {
  id: string;
  question_number: number;
  prompt: string;
  input_type: "text" | "radio" | "checkbox" | "dropdown";
  options?: { label: string; value: string }[];
  word_limit?: number;
  correct_answer: string;
  accepted_answers: string[];
}

// Demo test data
export const DEMO_LISTENING_TEST: ListeningTestData = {
  id: "listening-test-001",
  title: "IELTS Listening Practice Test 01",
  description: "A complete IELTS Listening mock test with 4 sections and 40 questions. Test your ability to understand spoken English in various contexts.",
  difficulty: "medium",
  duration_minutes: 30,
  is_free: true,
  is_published: true,
  instruction_text: "You will listen to four recordings of native English speakers and then answer questions based on what you hear. The recordings will be played ONCE only. The test has four parts, each with 10 questions. You will have time to read the questions before each part begins. Write your answers as you listen.",
  main_audio_url: "/audio/listening-test-01.mp3",
  ielts_mode: true,
  practice_mode: false,
  parts: [
    // ============ PART 1: Form Completion ============
    {
      id: "part-1",
      part_number: 1,
      title: "Part 1",
      instruction: "You will hear a conversation between a new tenant and an estate agent about renting a flat.",
      question_start: 1,
      question_end: 10,
      groups: [
        {
          id: "group-1-1",
          title: "Questions 1-6",
          instruction: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          question_type: "form_completion",
          questions: [
            { id: "q1", question_number: 1, prompt: "Name: Sarah ___", input_type: "text", word_limit: 2, correct_answer: "Mitchell", accepted_answers: ["mitchell"] },
            { id: "q2", question_number: 2, prompt: "Current address: 42 ___ Road", input_type: "text", word_limit: 2, correct_answer: "Fountain", accepted_answers: ["fountain"] },
            { id: "q3", question_number: 3, prompt: "Phone number: ___", input_type: "text", word_limit: 1, correct_answer: "07785264190", accepted_answers: ["07785 264 190", "07785264190"] },
            { id: "q4", question_number: 4, prompt: "Occupation: ___", input_type: "text", word_limit: 2, correct_answer: "bank clerk", accepted_answers: ["bank clerk", "a bank clerk"] },
            { id: "q5", question_number: 5, prompt: "Preferred area: near the ___", input_type: "text", word_limit: 2, correct_answer: "city centre", accepted_answers: ["city centre", "city center", "town centre", "town center"] },
            { id: "q6", question_number: 6, prompt: "Maximum rent per month: £___", input_type: "text", word_limit: 1, correct_answer: "850", accepted_answers: ["850", "£850"] },
          ],
        },
        {
          id: "group-1-2",
          title: "Questions 7-10",
          instruction: "Complete the notes below. Write NO MORE THAN ONE WORD for each answer.",
          question_type: "note_completion",
          questions: [
            { id: "q7", question_number: 7, prompt: "Must have: ___ parking", input_type: "text", word_limit: 1, correct_answer: "secure", accepted_answers: ["secure"] },
            { id: "q8", question_number: 8, prompt: "Preferred: a ___ garden", input_type: "text", word_limit: 1, correct_answer: "private", accepted_answers: ["private"] },
            { id: "q9", question_number: 9, prompt: "Pets: has a ___", input_type: "text", word_limit: 1, correct_answer: "cat", accepted_answers: ["cat"] },
            { id: "q10", question_number: 10, prompt: "Moving date: 1st of ___", input_type: "text", word_limit: 1, correct_answer: "September", accepted_answers: ["september", "Sept"] },
          ],
        },
      ],
    },
    // ============ PART 2: Multiple Choice + Matching ============
    {
      id: "part-2",
      part_number: 2,
      title: "Part 2",
      instruction: "You will hear a talk about a local community centre and its facilities.",
      question_start: 11,
      question_end: 20,
      groups: [
        {
          id: "group-2-1",
          title: "Questions 11-15",
          instruction: "Choose the correct letter, A, B, or C.",
          question_type: "multiple_choice",
          questions: [
            {
              id: "q11", question_number: 11,
              prompt: "The community centre was originally built as a",
              input_type: "radio",
              options: [
                { label: "A. school", value: "A" },
                { label: "B. hospital", value: "B" },
                { label: "C. church hall", value: "C" },
              ],
              correct_answer: "A", accepted_answers: ["A", "a"],
            },
            {
              id: "q12", question_number: 12,
              prompt: "The centre is open",
              input_type: "radio",
              options: [
                { label: "A. five days a week", value: "A" },
                { label: "B. six days a week", value: "B" },
                { label: "C. seven days a week", value: "C" },
              ],
              correct_answer: "C", accepted_answers: ["C", "c"],
            },
            {
              id: "q13", question_number: 13,
              prompt: "The swimming pool is currently being",
              input_type: "radio",
              options: [
                { label: "A. cleaned", value: "A" },
                { label: "B. repaired", value: "B" },
                { label: "C. extended", value: "C" },
              ],
              correct_answer: "C", accepted_answers: ["C", "c"],
            },
            {
              id: "q14", question_number: 14,
              prompt: "Free parking is available for",
              input_type: "radio",
              options: [
                { label: "A. one hour", value: "A" },
                { label: "B. two hours", value: "B" },
                { label: "C. three hours", value: "C" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
            {
              id: "q15", question_number: 15,
              prompt: "The café serves meals until",
              input_type: "radio",
              options: [
                { label: "A. 3 pm", value: "A" },
                { label: "B. 5 pm", value: "B" },
                { label: "C. 7 pm", value: "C" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
          ],
        },
        {
          id: "group-2-2",
          title: "Questions 16-20",
          instruction: "What does the speaker say about each of the following activities? Choose FIVE answers from the box and write the correct letter, A-G, next to Questions 16-20.",
          question_type: "matching",
          questions: [
            {
              id: "q16", question_number: 16,
              prompt: "Yoga classes",
              input_type: "dropdown",
              options: [
                { label: "A. available every day", value: "A" },
                { label: "B. only for members", value: "B" },
                { label: "C. booking required", value: "C" },
                { label: "D. free of charge", value: "D" },
                { label: "E. starts next month", value: "E" },
                { label: "F. very popular", value: "F" },
                { label: "G. has a waiting list", value: "G" },
              ],
              correct_answer: "F", accepted_answers: ["F", "f"],
            },
            {
              id: "q17", question_number: 17,
              prompt: "Art workshops",
              input_type: "dropdown",
              options: [
                { label: "A. available every day", value: "A" },
                { label: "B. only for members", value: "B" },
                { label: "C. booking required", value: "C" },
                { label: "D. free of charge", value: "D" },
                { label: "E. starts next month", value: "E" },
                { label: "F. very popular", value: "F" },
                { label: "G. has a waiting list", value: "G" },
              ],
              correct_answer: "C", accepted_answers: ["C", "c"],
            },
            {
              id: "q18", question_number: 18,
              prompt: "Photography club",
              input_type: "dropdown",
              options: [
                { label: "A. available every day", value: "A" },
                { label: "B. only for members", value: "B" },
                { label: "C. booking required", value: "C" },
                { label: "D. free of charge", value: "D" },
                { label: "E. starts next month", value: "E" },
                { label: "F. very popular", value: "F" },
                { label: "G. has a waiting list", value: "G" },
              ],
              correct_answer: "E", accepted_answers: ["E", "e"],
            },
            {
              id: "q19", question_number: 19,
              prompt: "Tennis coaching",
              input_type: "dropdown",
              options: [
                { label: "A. available every day", value: "A" },
                { label: "B. only for members", value: "B" },
                { label: "C. booking required", value: "C" },
                { label: "D. free of charge", value: "D" },
                { label: "E. starts next month", value: "E" },
                { label: "F. very popular", value: "F" },
                { label: "G. has a waiting list", value: "G" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
            {
              id: "q20", question_number: 20,
              prompt: "Dance classes",
              input_type: "dropdown",
              options: [
                { label: "A. available every day", value: "A" },
                { label: "B. only for members", value: "B" },
                { label: "C. booking required", value: "C" },
                { label: "D. free of charge", value: "D" },
                { label: "E. starts next month", value: "E" },
                { label: "F. very popular", value: "F" },
                { label: "G. has a waiting list", value: "G" },
              ],
              correct_answer: "G", accepted_answers: ["G", "g"],
            },
          ],
        },
      ],
    },
    // ============ PART 3: MCQ + Sentence Completion ============
    {
      id: "part-3",
      part_number: 3,
      title: "Part 3",
      instruction: "You will hear a discussion between two students, Mark and Jenny, about a research project on renewable energy.",
      question_start: 21,
      question_end: 30,
      groups: [
        {
          id: "group-3-1",
          title: "Questions 21-25",
          instruction: "Choose the correct letter, A, B, or C.",
          question_type: "multiple_choice",
          questions: [
            {
              id: "q21", question_number: 21,
              prompt: "Mark and Jenny agree that the most important renewable energy source is",
              input_type: "radio",
              options: [
                { label: "A. wind power", value: "A" },
                { label: "B. solar energy", value: "B" },
                { label: "C. hydroelectric power", value: "C" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
            {
              id: "q22", question_number: 22,
              prompt: "The deadline for their project is",
              input_type: "radio",
              options: [
                { label: "A. next Friday", value: "A" },
                { label: "B. in two weeks", value: "B" },
                { label: "C. at the end of the month", value: "C" },
              ],
              correct_answer: "C", accepted_answers: ["C", "c"],
            },
            {
              id: "q23", question_number: 23,
              prompt: "Jenny is responsible for",
              input_type: "radio",
              options: [
                { label: "A. writing the introduction", value: "A" },
                { label: "B. collecting data", value: "B" },
                { label: "C. creating graphs", value: "C" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
            {
              id: "q24", question_number: 24,
              prompt: "They plan to interview",
              input_type: "radio",
              options: [
                { label: "A. local residents", value: "A" },
                { label: "B. energy company employees", value: "B" },
                { label: "C. university professors", value: "C" },
              ],
              correct_answer: "C", accepted_answers: ["C", "c"],
            },
            {
              id: "q25", question_number: 25,
              prompt: "The presentation will last",
              input_type: "radio",
              options: [
                { label: "A. 10 minutes", value: "A" },
                { label: "B. 15 minutes", value: "B" },
                { label: "C. 20 minutes", value: "C" },
              ],
              correct_answer: "B", accepted_answers: ["B", "b"],
            },
          ],
        },
        {
          id: "group-3-2",
          title: "Questions 26-30",
          instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
          question_type: "sentence_completion",
          questions: [
            { id: "q26", question_number: 26, prompt: "The main focus of their research is on ___ panels.", input_type: "text", word_limit: 2, correct_answer: "solar", accepted_answers: ["solar"] },
            { id: "q27", question_number: 27, prompt: "They will visit the local ___ farm next week.", input_type: "text", word_limit: 2, correct_answer: "wind", accepted_answers: ["wind"] },
            { id: "q28", question_number: 28, prompt: "Jenny suggests using ___ sources for the literature review.", input_type: "text", word_limit: 2, correct_answer: "online", accepted_answers: ["online", "internet"] },
            { id: "q29", question_number: 29, prompt: "Mark will prepare the ___ slides for the presentation.", input_type: "text", word_limit: 2, correct_answer: "PowerPoint", accepted_answers: ["powerpoint", "power point", "presentation"] },
            { id: "q30", question_number: 30, prompt: "They agree to meet in the ___ every Tuesday.", input_type: "text", word_limit: 2, correct_answer: "library", accepted_answers: ["library", "main library"] },
          ],
        },
      ],
    },
    // ============ PART 4: Note Completion + Summary ============
    {
      id: "part-4",
      part_number: 4,
      title: "Part 4",
      instruction: "You will hear a university lecture about the history of chocolate production.",
      question_start: 31,
      question_end: 40,
      groups: [
        {
          id: "group-4-1",
          title: "Questions 31-35",
          instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
          question_type: "note_completion",
          questions: [
            { id: "q31", question_number: 31, prompt: "Chocolate originated in ___ America.", input_type: "text", word_limit: 2, correct_answer: "Central", accepted_answers: ["central", "Central"] },
            { id: "q32", question_number: 32, prompt: "The Aztecs used cocoa beans as a form of ___.", input_type: "text", word_limit: 2, correct_answer: "currency", accepted_answers: ["currency", "money"] },
            { id: "q33", question_number: 33, prompt: "Europeans first tasted chocolate in the ___ century.", input_type: "text", word_limit: 2, correct_answer: "16th", accepted_answers: ["16th", "sixteenth", "16"] },
            { id: "q34", question_number: 34, prompt: "The Dutch invented the ___ press in 1828.", input_type: "text", word_limit: 2, correct_answer: "cocoa", accepted_answers: ["cocoa", "chocolate"] },
            { id: "q35", question_number: 35, prompt: "Milk chocolate was first produced in ___.", input_type: "text", word_limit: 2, correct_answer: "Switzerland", accepted_answers: ["switzerland", "Swiss"] },
          ],
        },
        {
          id: "group-4-2",
          title: "Questions 36-40",
          instruction: "Complete the summary below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          question_type: "summary_completion",
          questions: [
            { id: "q36", question_number: 36, prompt: "Today, over ___ million tonnes of cocoa are produced annually.", input_type: "text", word_limit: 2, correct_answer: "4.5", accepted_answers: ["4.5", "four and a half", "4.5 million"] },
            { id: "q37", question_number: 37, prompt: "The largest producer of cocoa beans is ___.", input_type: "text", word_limit: 2, correct_answer: "Ivory Coast", accepted_answers: ["ivory coast", "Cote d'Ivoire", "Côte d'Ivoire"] },
            { id: "q38", question_number: 38, prompt: "Dark chocolate contains at least ___% cocoa solids.", input_type: "text", word_limit: 2, correct_answer: "70", accepted_answers: ["70", "seventy", "70%"] },
            { id: "q39", question_number: 39, prompt: "The global chocolate industry is worth approximately $___ billion.", input_type: "text", word_limit: 2, correct_answer: "130", accepted_answers: ["130", "130 billion"] },
            { id: "q40", question_number: 40, prompt: "Experts predict demand will exceed supply by ___.", input_type: "text", word_limit: 2, correct_answer: "2030", accepted_answers: ["2030", "the year 2030"] },
          ],
        },
      ],
    },
  ],
};

// Band conversion table for Listening
export const LISTENING_BAND_TABLE: { min: number; max: number; band: number }[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 32, max: 34, band: 7.5 },
  { min: 30, max: 31, band: 7.0 },
  { min: 26, max: 29, band: 6.5 },
  { min: 23, max: 25, band: 6.0 },
  { min: 18, max: 22, band: 5.5 },
  { min: 16, max: 17, band: 5.0 },
  { min: 13, max: 15, band: 4.5 },
  { min: 11, max: 12, band: 4.0 },
  { min: 8, max: 10, band: 3.5 },
  { min: 5, max: 7, band: 3.0 },
  { min: 3, max: 4, band: 2.5 },
  { min: 1, max: 2, band: 2.0 },
  { min: 0, max: 0, band: 0 },
];

export function getListeningBand(rawScore: number): number {
  for (const entry of LISTENING_BAND_TABLE) {
    if (rawScore >= entry.min && rawScore <= entry.max) {
      return entry.band;
    }
  }
  return 0;
}

// Answer checking for Listening
export function checkListeningAnswer(
  studentAnswer: string,
  correctAnswer: string,
  acceptedAnswers: string[],
  wordLimit?: number
): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const student = normalize(studentAnswer);
  
  if (!student) return false;

  // Check word limit
  if (wordLimit) {
    const words = student.split(" ").filter(Boolean).length;
    if (words > wordLimit) return false;
  }

  // Check against correct answer
  if (student === normalize(correctAnswer)) return true;

  // Check against accepted alternatives
  for (const alt of acceptedAnswers) {
    if (student === normalize(alt)) return true;
  }

  return false;
}

// Score all answers for a test
export function scoreListeningTest(
  responses: Record<string, string>,
  test: ListeningTestData
): { rawScore: number; band: number; details: { questionNumber: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }[] } {
  const details: { questionNumber: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }[] = [];
  let rawScore = 0;

  for (const part of test.parts) {
    for (const group of part.groups) {
      for (const question of group.questions) {
        const studentAnswer = responses[`q${question.question_number}`] || "";
        const isCorrect = checkListeningAnswer(
          studentAnswer,
          question.correct_answer,
          question.accepted_answers,
          question.word_limit
        );
        if (isCorrect) rawScore++;
        details.push({
          questionNumber: question.question_number,
          studentAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
        });
      }
    }
  }

  return { rawScore, band: getListeningBand(rawScore), details };
}

// All available listening tests (for listing)
export const LISTENING_TESTS_LIST = [
  {
    id: "listening-test-001",
    title: "IELTS Listening Practice Test 01",
    difficulty: "medium" as const,
    duration: 30,
    questions: 40,
    access: "free" as const,
    status: "not_started" as const,
    attempts: 0,
    band: null as number | null,
  },
  {
    id: "listening-test-002",
    title: "IELTS Listening Practice Test 02",
    difficulty: "hard" as const,
    duration: 30,
    questions: 40,
    access: "paid" as const,
    status: "not_started" as const,
    attempts: 0,
    band: null as number | null,
  },
  {
    id: "listening-test-003",
    title: "IELTS Listening Practice Test 03",
    difficulty: "easy" as const,
    duration: 30,
    questions: 40,
    access: "paid" as const,
    status: "not_started" as const,
    attempts: 0,
    band: null as number | null,
  },
];
