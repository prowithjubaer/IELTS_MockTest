import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getBandColor(band: number): string {
  if (band >= 8) return "text-green-600";
  if (band >= 7) return "text-blue-600";
  if (band >= 6) return "text-yellow-600";
  if (band >= 5) return "text-orange-600";
  return "text-red-600";
}

export function getBandLabel(band: number): string {
  if (band >= 9) return "Expert";
  if (band >= 8) return "Very Good";
  if (band >= 7) return "Good";
  if (band >= 6) return "Competent";
  if (band >= 5) return "Modest";
  if (band >= 4) return "Limited";
  return "Below Average";
}

export function calculateOverallBand(scores: number[]): number {
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = sum / scores.length;
  return Math.round(avg * 2) / 2;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
}

// IELTS Band conversion tables
export const listeningBandTable: Record<number, number> = {
  40: 9, 39: 8.5, 37: 8, 35: 7.5, 32: 7, 30: 6.5, 26: 6, 23: 5.5,
  18: 5, 16: 4.5, 13: 4, 10: 3.5, 6: 3, 4: 2.5, 3: 2, 2: 1,
};

export const readingAcademicBandTable: Record<number, number> = {
  40: 9, 39: 8.5, 37: 8, 35: 7.5, 33: 7, 30: 6.5, 27: 6, 23: 5.5,
  19: 5, 15: 4.5, 13: 4, 10: 3.5, 8: 3, 6: 2.5, 4: 2, 3: 1,
};

export const readingGeneralBandTable: Record<number, number> = {
  40: 9, 39: 8.5, 37: 8, 36: 7.5, 34: 7, 32: 6.5, 30: 6, 27: 5.5,
  23: 5, 19: 4.5, 15: 4, 12: 3.5, 9: 3, 6: 2.5, 4: 2, 3: 1,
};

export function rawScoreToBand(
  rawScore: number,
  table: Record<number, number>
): number {
  const sortedScores = Object.keys(table)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of sortedScores) {
    if (rawScore >= threshold) {
      return table[threshold];
    }
  }
  return 0;
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function checkAnswer(
  studentAnswer: string,
  correctAnswer: string,
  alternatives: string[] = [],
  caseSensitive: boolean = false,
  ignoreSpaces: boolean = true
): boolean {
  let normalizedStudent = ignoreSpaces
    ? studentAnswer.trim().replace(/\s+/g, " ")
    : studentAnswer.trim();
  let normalizedCorrect = ignoreSpaces
    ? correctAnswer.trim().replace(/\s+/g, " ")
    : correctAnswer.trim();

  if (!caseSensitive) {
    normalizedStudent = normalizedStudent.toLowerCase();
    normalizedCorrect = normalizedCorrect.toLowerCase();
  }

  if (normalizedStudent === normalizedCorrect) return true;

  for (const alt of alternatives) {
    let normalizedAlt = ignoreSpaces
      ? alt.trim().replace(/\s+/g, " ")
      : alt.trim();
    if (!caseSensitive) normalizedAlt = normalizedAlt.toLowerCase();
    if (normalizedStudent === normalizedAlt) return true;
  }

  return false;
}
