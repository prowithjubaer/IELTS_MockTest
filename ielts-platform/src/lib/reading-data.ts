// ============================================
// IELTS READING MODULE - DATA, TYPES & SCORING
// ============================================

export interface ReadingTestData {
  id: string;
  title: string;
  description: string;
  test_type: "academic" | "general";
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  is_free: boolean;
  is_published: boolean;
  instruction_text: string;
  passages: ReadingPassageData[];
}

export interface ReadingPassageData {
  id: string;
  passage_number: number;
  title: string;
  subtitle?: string;
  paragraphs: { label: string; content: string }[];
  question_start: number;
  question_end: number;
  groups: ReadingQuestionGroupData[];
}

export interface ReadingQuestionGroupData {
  id: string;
  title: string;
  instruction: string;
  question_type: string;
  asset_url?: string;
  questions: ReadingQuestionData[];
}

export interface ReadingQuestionData {
  id: string;
  question_number: number;
  prompt: string;
  input_type: "text" | "radio" | "checkbox" | "dropdown";
  options?: { label: string; value: string }[];
  word_limit?: number;
  correct_answer: string;
  accepted_answers: string[];
}


// Band conversion tables
export const READING_ACADEMIC_BAND: { min: number; max: number; band: number }[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 6, max: 9, band: 3.5 },
  { min: 4, max: 5, band: 3.0 },
  { min: 2, max: 3, band: 2.5 },
  { min: 1, max: 1, band: 2.0 },
  { min: 0, max: 0, band: 0 },
];

export const READING_GENERAL_BAND: { min: number; max: number; band: number }[] = [
  { min: 40, max: 40, band: 9.0 },
  { min: 39, max: 39, band: 8.5 },
  { min: 37, max: 38, band: 8.0 },
  { min: 36, max: 36, band: 7.5 },
  { min: 34, max: 35, band: 7.0 },
  { min: 32, max: 33, band: 6.5 },
  { min: 30, max: 31, band: 6.0 },
  { min: 27, max: 29, band: 5.5 },
  { min: 23, max: 26, band: 5.0 },
  { min: 19, max: 22, band: 4.5 },
  { min: 15, max: 18, band: 4.0 },
  { min: 12, max: 14, band: 3.5 },
  { min: 8, max: 11, band: 3.0 },
  { min: 5, max: 7, band: 2.5 },
  { min: 1, max: 4, band: 2.0 },
  { min: 0, max: 0, band: 0 },
];

export function getReadingBand(rawScore: number, type: "academic" | "general"): number {
  const table = type === "academic" ? READING_ACADEMIC_BAND : READING_GENERAL_BAND;
  for (const entry of table) {
    if (rawScore >= entry.min && rawScore <= entry.max) return entry.band;
  }
  return 0;
}

export function checkReadingAnswer(
  studentAnswer: string,
  correctAnswer: string,
  acceptedAnswers: string[],
  wordLimit?: number
): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const student = normalize(studentAnswer);
  if (!student) return false;
  if (wordLimit && student.split(" ").filter(Boolean).length > wordLimit) return false;
  if (student === normalize(correctAnswer)) return true;
  for (const alt of acceptedAnswers) {
    if (student === normalize(alt)) return true;
  }
  return false;
}

export function scoreReadingTest(
  responses: Record<string, string>,
  test: ReadingTestData
): { rawScore: number; band: number; details: { questionNumber: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }[] } {
  const details: { questionNumber: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }[] = [];
  let rawScore = 0;
  for (const passage of test.passages) {
    for (const group of passage.groups) {
      for (const q of group.questions) {
        const studentAnswer = responses[`q${q.question_number}`] || "";
        const isCorrect = checkReadingAnswer(studentAnswer, q.correct_answer, q.accepted_answers, q.word_limit);
        if (isCorrect) rawScore++;
        details.push({ questionNumber: q.question_number, studentAnswer, correctAnswer: q.correct_answer, isCorrect });
      }
    }
  }
  return { rawScore, band: getReadingBand(rawScore, test.test_type), details };
}


// ============================================
// DEMO READING TEST
// ============================================
export const DEMO_READING_TEST: ReadingTestData = {
  id: "reading-test-001",
  title: "IELTS Academic Reading Practice Test 01",
  description: "A complete Academic Reading test with 3 passages and 40 questions covering various question types.",
  test_type: "academic",
  difficulty: "medium",
  duration_minutes: 60,
  is_free: true,
  is_published: true,
  instruction_text: "You should spend about 20 minutes on each passage. Read each passage carefully and answer all questions. Write your answers as you read.",
  passages: [
    // ===== PASSAGE 1: Questions 1-13 =====
    {
      id: "passage-1",
      passage_number: 1,
      title: "The Evolution of Urban Green Spaces",
      subtitle: "How cities are transforming concrete jungles into sustainable ecosystems",
      paragraphs: [
        { label: "A", content: "Urban green spaces have undergone a remarkable transformation over the past century. What were once simple parks designed for leisurely strolls have evolved into complex ecological systems that serve multiple functions within the urban environment. Modern city planners now recognize that green spaces are not merely aesthetic additions to the urban landscape but essential components of sustainable city infrastructure." },
        { label: "B", content: "The concept of urban parks originated in the 19th century when industrialization led to overcrowded, polluted cities. Visionaries like Frederick Law Olmsted designed parks such as Central Park in New York as refuges from urban life. These early parks prioritized recreation and beauty, with manicured lawns, ornamental gardens, and winding paths. However, they rarely considered ecological function or environmental services." },
        { label: "C", content: "By the mid-20th century, urban ecologists began studying how green spaces could address environmental challenges. Research demonstrated that trees and vegetation could reduce air pollution by filtering particulate matter, lower urban temperatures through evapotranspiration, and manage stormwater by absorbing rainfall. This scientific understanding shifted the purpose of urban green spaces from purely recreational to multifunctional." },
        { label: "D", content: "Contemporary urban green space design integrates biodiversity conservation into city planning. Native plant species are increasingly preferred over exotic ornamentals because they support local wildlife, require less maintenance, and are better adapted to regional climate conditions. Many cities now maintain wildlife corridors — connected green spaces that allow animals to move safely through urban areas." },
        { label: "E", content: "Green roofs and vertical gardens represent innovative approaches to increasing vegetation in dense urban areas where horizontal space is limited. These technologies provide insulation, reduce energy costs, extend roof lifespan, and create habitat for birds and insects. Singapore, often called a 'City in a Garden,' has pioneered the integration of nature into high-rise architecture." },
        { label: "F", content: "Community gardens have emerged as another important category of urban green space. Unlike traditional parks managed by municipal authorities, community gardens are maintained by local residents who grow food, flowers, and herbs. These spaces provide fresh produce in food deserts, strengthen neighborhood social bonds, and give residents a sense of ownership over their local environment." },
        { label: "G", content: "The economic benefits of urban green spaces are increasingly well-documented. Properties near parks typically command higher values, green spaces attract tourism and business investment, and the health benefits of access to nature reduce healthcare costs. One study estimated that street trees in a single city provide over $100 million annually in ecosystem services including air purification, carbon sequestration, and stormwater management." },
      ],
      question_start: 1,
      question_end: 13,
      groups: [
        {
          id: "rg-1-1",
          title: "Questions 1-7",
          instruction: "The reading passage has seven paragraphs, A-G. Which paragraph contains the following information? Write the correct letter, A-G, in the answer box.",
          question_type: "matching_information",
          questions: [
            { id: "rq1", question_number: 1, prompt: "Examples of financial advantages of green areas", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "G", accepted_answers: ["G","g"] },
            { id: "rq2", question_number: 2, prompt: "The historical origin of city parks", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq3", question_number: 3, prompt: "How green spaces help manage water", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "C", accepted_answers: ["C","c"] },
            { id: "rq4", question_number: 4, prompt: "Gardens that local people look after themselves", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "F", accepted_answers: ["F","f"] },
            { id: "rq5", question_number: 5, prompt: "Use of plants that naturally belong to the area", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "D", accepted_answers: ["D","d"] },
            { id: "rq6", question_number: 6, prompt: "Technology for growing plants on buildings", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "E", accepted_answers: ["E","e"] },
            { id: "rq7", question_number: 7, prompt: "A modern view of parks as more than decorative", input_type: "dropdown", options: [{ label: "A", value: "A" },{ label: "B", value: "B" },{ label: "C", value: "C" },{ label: "D", value: "D" },{ label: "E", value: "E" },{ label: "F", value: "F" },{ label: "G", value: "G" }], correct_answer: "A", accepted_answers: ["A","a"] },
          ],
        },
        {
          id: "rg-1-2",
          title: "Questions 8-13",
          instruction: "Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
          question_type: "true_false_not_given",
          questions: [
            { id: "rq8", question_number: 8, prompt: "Early urban parks were designed primarily for ecological purposes.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "FALSE", accepted_answers: ["FALSE","false","False"] },
            { id: "rq9", question_number: 9, prompt: "Trees can reduce the temperature in cities.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "TRUE", accepted_answers: ["TRUE","true","True"] },
            { id: "rq10", question_number: 10, prompt: "All cities have now banned exotic plant species in parks.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "NOT GIVEN", accepted_answers: ["NOT GIVEN","not given","Not Given"] },
            { id: "rq11", question_number: 11, prompt: "Green roofs can help reduce building energy consumption.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "TRUE", accepted_answers: ["TRUE","true","True"] },
            { id: "rq12", question_number: 12, prompt: "Community gardens are always more successful than municipal parks.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "NOT GIVEN", accepted_answers: ["NOT GIVEN","not given","Not Given"] },
            { id: "rq13", question_number: 13, prompt: "Properties located near parks tend to have higher market values.", input_type: "radio", options: [{ label: "TRUE", value: "TRUE" },{ label: "FALSE", value: "FALSE" },{ label: "NOT GIVEN", value: "NOT GIVEN" }], correct_answer: "TRUE", accepted_answers: ["TRUE","true","True"] },
          ],
        },
      ],
    },
    // ===== PASSAGE 2: Questions 14-26 =====
    {
      id: "passage-2",
      passage_number: 2,
      title: "The Science of Sleep and Memory",
      subtitle: "Understanding how sleep consolidates learning and memory formation",
      paragraphs: [
        { label: "A", content: "Sleep is far more than a passive state of rest. Neuroscientists have discovered that the sleeping brain is remarkably active, performing essential functions that cannot occur during waking hours. Among the most important of these functions is memory consolidation — the process by which newly acquired information is stabilized and integrated into long-term storage." },
        { label: "B", content: "The relationship between sleep and memory was first demonstrated experimentally in the early 20th century. Researchers found that subjects who slept after learning new material retained significantly more information than those who remained awake for an equivalent period. Since then, hundreds of studies have confirmed and expanded upon this fundamental finding." },
        { label: "C", content: "Sleep consists of several distinct stages that cycle throughout the night. Non-rapid eye movement (NREM) sleep includes three stages of progressively deeper sleep, while rapid eye movement (REM) sleep is characterized by vivid dreaming and heightened brain activity. Each stage appears to contribute differently to memory processing." },
        { label: "D", content: "During deep NREM sleep, the brain replays experiences from the previous day. Neurons that fired together during learning reactivate in the same patterns, effectively rehearsing new memories. This replay process, occurring primarily in the hippocampus, helps transfer information to the neocortex for long-term storage. Studies using brain imaging have directly observed this replay phenomenon." },
        { label: "E", content: "REM sleep appears particularly important for procedural memory — the memory of how to perform skills and tasks. Musicians, athletes, and language learners all show improved performance after REM-rich sleep periods. Additionally, REM sleep facilitates creative problem-solving by allowing the brain to form novel associations between seemingly unrelated pieces of information." },
        { label: "F", content: "Sleep deprivation has devastating effects on memory formation. Even a single night of poor sleep can reduce the brain's ability to encode new memories by up to 40 percent. Chronic sleep loss is associated with accelerated cognitive decline and increased risk of neurodegenerative diseases including Alzheimer's. The hippocampus, critical for memory formation, is especially vulnerable to sleep deprivation." },
        { label: "G", content: "Recent research has explored whether sleep can be optimized to enhance memory. Techniques such as targeted memory reactivation — playing sounds or releasing scents associated with learning during sleep — have shown promising results in laboratory settings. While these methods are still experimental, they suggest that the memory-consolidating power of sleep could potentially be amplified." },
      ],
      question_start: 14,
      question_end: 26,
      groups: [
        {
          id: "rg-2-1",
          title: "Questions 14-19",
          instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
          question_type: "sentence_completion",
          questions: [
            { id: "rq14", question_number: 14, prompt: "Memory consolidation stabilizes new information and places it into ___ storage.", input_type: "text", word_limit: 2, correct_answer: "long-term", accepted_answers: ["long-term","long term"] },
            { id: "rq15", question_number: 15, prompt: "Sleep is made up of several ___ stages that repeat during the night.", input_type: "text", word_limit: 2, correct_answer: "distinct", accepted_answers: ["distinct","different"] },
            { id: "rq16", question_number: 16, prompt: "During deep NREM sleep, neurons that fired together during learning ___ in similar patterns.", input_type: "text", word_limit: 2, correct_answer: "reactivate", accepted_answers: ["reactivate","re-activate"] },
            { id: "rq17", question_number: 17, prompt: "REM sleep is especially important for ___ memory — skills and tasks.", input_type: "text", word_limit: 2, correct_answer: "procedural", accepted_answers: ["procedural"] },
            { id: "rq18", question_number: 18, prompt: "One night of poor sleep can reduce memory encoding ability by up to ___ percent.", input_type: "text", word_limit: 2, correct_answer: "40", accepted_answers: ["40","forty","40%"] },
            { id: "rq19", question_number: 19, prompt: "Targeted memory reactivation uses sounds or ___ during sleep to boost memory.", input_type: "text", word_limit: 2, correct_answer: "scents", accepted_answers: ["scents","smells","releasing scents"] },
          ],
        },
        {
          id: "rg-2-2",
          title: "Questions 20-26",
          instruction: "Choose the correct letter, A, B, C or D.",
          question_type: "multiple_choice",
          questions: [
            { id: "rq20", question_number: 20, prompt: "The main purpose of the passage is to", input_type: "radio", options: [{ label: "A. explain how sleep helps memory", value: "A" },{ label: "B. compare NREM and REM sleep", value: "B" },{ label: "C. warn about sleep deprivation", value: "C" },{ label: "D. promote new sleep technologies", value: "D" }], correct_answer: "A", accepted_answers: ["A","a"] },
            { id: "rq21", question_number: 21, prompt: "According to paragraph B, early experiments showed that sleeping after learning", input_type: "radio", options: [{ label: "A. had no effect on memory", value: "A" },{ label: "B. helped retain more information", value: "B" },{ label: "C. caused memory confusion", value: "C" },{ label: "D. only worked for certain subjects", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq22", question_number: 22, prompt: "During deep NREM sleep, memory replay primarily occurs in the", input_type: "radio", options: [{ label: "A. neocortex", value: "A" },{ label: "B. brain stem", value: "B" },{ label: "C. hippocampus", value: "C" },{ label: "D. cerebellum", value: "D" }], correct_answer: "C", accepted_answers: ["C","c"] },
            { id: "rq23", question_number: 23, prompt: "REM sleep helps creative problem-solving by", input_type: "radio", options: [{ label: "A. increasing brain temperature", value: "A" },{ label: "B. forming new associations between information", value: "B" },{ label: "C. reducing stress hormones", value: "C" },{ label: "D. slowing neural activity", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq24", question_number: 24, prompt: "Chronic sleep loss is linked to", input_type: "radio", options: [{ label: "A. improved memory in the short term", value: "A" },{ label: "B. faster cognitive development", value: "B" },{ label: "C. increased risk of Alzheimer's disease", value: "C" },{ label: "D. better emotional regulation", value: "D" }], correct_answer: "C", accepted_answers: ["C","c"] },
            { id: "rq25", question_number: 25, prompt: "The hippocampus is described as being particularly", input_type: "radio", options: [{ label: "A. resistant to damage", value: "A" },{ label: "B. active during REM sleep", value: "B" },{ label: "C. vulnerable to sleep deprivation", value: "C" },{ label: "D. unrelated to memory", value: "D" }], correct_answer: "C", accepted_answers: ["C","c"] },
            { id: "rq26", question_number: 26, prompt: "Targeted memory reactivation techniques are currently", input_type: "radio", options: [{ label: "A. widely used in hospitals", value: "A" },{ label: "B. still experimental", value: "B" },{ label: "C. proven to be ineffective", value: "C" },{ label: "D. only used for children", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
          ],
        },
      ],
    },
    // ===== PASSAGE 3: Questions 27-40 =====
    {
      id: "passage-3",
      passage_number: 3,
      title: "Artificial Intelligence in Healthcare",
      subtitle: "The promises and challenges of AI-driven medical diagnostics",
      paragraphs: [
        { label: "A", content: "Artificial intelligence is rapidly transforming healthcare delivery, with applications ranging from diagnostic imaging to drug discovery. Machine learning algorithms can now analyze medical images with accuracy that matches or exceeds human specialists in certain narrow tasks. These systems process vast amounts of data to identify patterns invisible to the human eye." },
        { label: "B", content: "In radiology, AI systems have demonstrated remarkable capability in detecting cancers, fractures, and other abnormalities in X-rays, CT scans, and MRI images. A landmark study published in Nature showed that an AI system could detect breast cancer in mammograms more accurately than experienced radiologists, with fewer false positives and false negatives." },
        { label: "C", content: "Dermatology represents another field where AI excels. Smartphone applications powered by deep learning can classify skin lesions with accuracy comparable to board-certified dermatologists. This technology holds particular promise for regions with limited access to specialist care, potentially enabling early detection of skin cancers in underserved communities." },
        { label: "D", content: "Despite impressive technical achievements, significant barriers remain to widespread AI adoption in clinical practice. Regulatory frameworks struggle to keep pace with rapidly evolving technology. Questions about liability when AI systems make errors remain largely unresolved. Additionally, many clinicians express skepticism about trusting decisions to algorithms they cannot fully understand." },
        { label: "E", content: "Data bias represents a critical concern in medical AI. If training datasets disproportionately represent certain demographic groups, the resulting algorithms may perform poorly for underrepresented populations. Several studies have documented racial and gender disparities in AI diagnostic accuracy, highlighting the need for diverse, representative training data." },
        { label: "F", content: "The integration of AI into healthcare workflows also raises important ethical questions about the doctor-patient relationship. Some patients may feel uncomfortable knowing their diagnosis was influenced by a machine rather than a human physician. Conversely, others may prefer the perceived objectivity of algorithmic assessment over potentially biased human judgment." },
        { label: "G", content: "Looking forward, most experts believe AI will augment rather than replace human clinicians. The most promising approach combines AI's pattern recognition capabilities with physicians' contextual understanding, empathy, and clinical judgment. This collaborative model — sometimes called 'augmented intelligence' — could improve diagnostic accuracy while preserving the human elements of medical care." },
      ],
      question_start: 27,
      question_end: 40,
      groups: [
        {
          id: "rg-3-1",
          title: "Questions 27-32",
          instruction: "Complete the summary below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
          question_type: "summary_completion",
          questions: [
            { id: "rq27", question_number: 27, prompt: "AI uses ___ algorithms to find patterns in medical data.", input_type: "text", word_limit: 2, correct_answer: "machine learning", accepted_answers: ["machine learning"] },
            { id: "rq28", question_number: 28, prompt: "In radiology, AI can detect cancers and ___ in medical scans.", input_type: "text", word_limit: 2, correct_answer: "fractures", accepted_answers: ["fractures","abnormalities"] },
            { id: "rq29", question_number: 29, prompt: "Smartphone apps using ___ can classify skin conditions accurately.", input_type: "text", word_limit: 2, correct_answer: "deep learning", accepted_answers: ["deep learning"] },
            { id: "rq30", question_number: 30, prompt: "Regulatory ___ cannot keep up with fast-changing AI technology.", input_type: "text", word_limit: 2, correct_answer: "frameworks", accepted_answers: ["frameworks"] },
            { id: "rq31", question_number: 31, prompt: "If training data lacks diversity, algorithms may show racial and ___ disparities.", input_type: "text", word_limit: 2, correct_answer: "gender", accepted_answers: ["gender"] },
            { id: "rq32", question_number: 32, prompt: "The collaborative approach combining AI and doctors is called '___'.", input_type: "text", word_limit: 2, correct_answer: "augmented intelligence", accepted_answers: ["augmented intelligence"] },
          ],
        },
        {
          id: "rg-3-2",
          title: "Questions 33-37",
          instruction: "Choose the correct letter, A, B, C or D.",
          question_type: "multiple_choice",
          questions: [
            { id: "rq33", question_number: 33, prompt: "According to the passage, AI systems in radiology can", input_type: "radio", options: [{ label: "A. completely replace radiologists", value: "A" },{ label: "B. match or exceed human accuracy in certain tasks", value: "B" },{ label: "C. only work with CT scans", value: "C" },{ label: "D. diagnose all diseases accurately", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq34", question_number: 34, prompt: "AI in dermatology is especially promising for", input_type: "radio", options: [{ label: "A. wealthy urban areas", value: "A" },{ label: "B. hospital emergency rooms", value: "B" },{ label: "C. regions with limited specialist access", value: "C" },{ label: "D. pharmaceutical companies", value: "D" }], correct_answer: "C", accepted_answers: ["C","c"] },
            { id: "rq35", question_number: 35, prompt: "Many clinicians are skeptical about AI because", input_type: "radio", options: [{ label: "A. it is too expensive", value: "A" },{ label: "B. they cannot fully understand the algorithms", value: "B" },{ label: "C. patients refuse AI diagnosis", value: "C" },{ label: "D. it requires too much training", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq36", question_number: 36, prompt: "The term 'data bias' in the context of medical AI refers to", input_type: "radio", options: [{ label: "A. too much data being collected", value: "A" },{ label: "B. training data not representing all groups equally", value: "B" },{ label: "C. doctors preferring certain data formats", value: "C" },{ label: "D. patients hiding medical information", value: "D" }], correct_answer: "B", accepted_answers: ["B","b"] },
            { id: "rq37", question_number: 37, prompt: "Most experts believe AI will", input_type: "radio", options: [{ label: "A. make doctors unnecessary", value: "A" },{ label: "B. only be used in research", value: "B" },{ label: "C. work alongside human clinicians", value: "C" },{ label: "D. be banned from clinical use", value: "D" }], correct_answer: "C", accepted_answers: ["C","c"] },
          ],
        },
        {
          id: "rg-3-3",
          title: "Questions 38-40",
          instruction: "Answer the questions below. Write NO MORE THAN THREE WORDS for each answer.",
          question_type: "short_answer",
          questions: [
            { id: "rq38", question_number: 38, prompt: "What type of study showed AI detecting breast cancer better than radiologists?", input_type: "text", word_limit: 3, correct_answer: "landmark study", accepted_answers: ["landmark study","a landmark study"] },
            { id: "rq39", question_number: 39, prompt: "What do some patients prefer about algorithmic assessment compared to human judgment?", input_type: "text", word_limit: 3, correct_answer: "perceived objectivity", accepted_answers: ["perceived objectivity","the perceived objectivity","objectivity"] },
            { id: "rq40", question_number: 40, prompt: "What human quality do physicians provide that AI cannot offer?", input_type: "text", word_limit: 3, correct_answer: "empathy", accepted_answers: ["empathy","contextual understanding","clinical judgment","empathy and judgment"] },
          ],
        },
      ],
    },
  ],
};


// Tests list for listing page
export const READING_TESTS_LIST = [
  { id: "reading-test-001", title: "IELTS Academic Reading Practice Test 01", test_type: "academic" as const, difficulty: "medium" as const, duration: 60, questions: 40, access: "free" as const, status: "not_started" as const, attempts: 0, band: null as number | null },
  { id: "reading-test-002", title: "IELTS Academic Reading Practice Test 02", test_type: "academic" as const, difficulty: "hard" as const, duration: 60, questions: 40, access: "paid" as const, status: "not_started" as const, attempts: 0, band: null as number | null },
  { id: "reading-test-003", title: "IELTS General Training Reading Test 01", test_type: "general" as const, difficulty: "easy" as const, duration: 60, questions: 40, access: "paid" as const, status: "not_started" as const, attempts: 0, band: null as number | null },
];
