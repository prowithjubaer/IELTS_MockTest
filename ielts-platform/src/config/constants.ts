// Brand
export const BRAND = {
  name: "Pro English BD",
  tagline: "Bangladesh's #1 IELTS Mock Test Platform",
  email: "info@proenglishbd.com",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "https://wa.me/880",
  address: "Dhaka, Bangladesh",
};

// Colors
export const COLORS = {
  primary: "#e53e3e",
  secondary: "#102a43",
  navy: "#102a43",
  red: "#e53e3e",
};

// IELTS Module Config
export const MODULE_CONFIG = {
  listening: {
    totalQuestions: 40,
    totalParts: 4,
    duration: 30 * 60, // 30 minutes + 10 min transfer
    passScore: 23,
  },
  reading: {
    totalQuestions: 40,
    totalParts: 3,
    duration: 60 * 60, // 60 minutes
    passScore: 23,
  },
  writing: {
    totalTasks: 2,
    duration: 60 * 60, // 60 minutes
    task1MinWords: 150,
    task2MinWords: 250,
    task1RecommendedTime: 20,
    task2RecommendedTime: 40,
  },
  speaking: {
    totalParts: 3,
    duration: 14 * 60, // 11-14 minutes
    part1Questions: 4,
    part2PrepTime: 60, // 1 minute
    part2SpeakTime: 120, // 2 minutes
    part3Questions: 4,
    thinkTime: 5,
  },
};

// Autosave
export const AUTOSAVE_INTERVAL = 5000; // 5 seconds

// File Upload
export const UPLOAD_LIMITS = {
  audio: 50 * 1024 * 1024, // 50MB
  video: 200 * 1024 * 1024, // 200MB
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_FILE_TYPES = {
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

// Exam UI
export const FONT_SIZES = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

// IELTS Band Descriptors
export const WRITING_CRITERIA = {
  task1: ["Task Achievement", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
  task2: ["Task Response", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
};

export const SPEAKING_CRITERIA = [
  "Fluency & Coherence",
  "Lexical Resource",
  "Grammatical Range & Accuracy",
  "Pronunciation",
];

export const BAND_SCORES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

// Routes
export const ROUTES = {
  home: "/",
  tests: "/tests",
  pricing: "/pricing",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  student: "/student",
  admin: "/admin",
  teacher: "/teacher",
};
