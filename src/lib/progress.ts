"use client";

const STORAGE_KEY = "photomaster_progress";

export interface HistoryEntry {
  courseId: string;
  lessonId: string;
  completedAt: string;
  quizScore?: number;
}

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  history: HistoryEntry[];
}

function getProgress(): Progress {
  if (typeof window === "undefined") return { completedLessons: [], quizScores: {}, history: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { completedLessons: [], quizScores: {}, history: [] };
  const parsed = JSON.parse(data);
  if (!parsed.history) parsed.history = [];
  return parsed;
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(courseId: string, lessonId: string) {
  const progress = getProgress();
  const key = `${courseId}/${lessonId}`;
  if (!progress.completedLessons.includes(key)) {
    progress.completedLessons.push(key);
    progress.history.push({
      courseId,
      lessonId,
      completedAt: new Date().toISOString(),
      quizScore: progress.quizScores[key],
    });
  }
  saveProgress(progress);
}

export function isLessonComplete(courseId: string, lessonId: string): boolean {
  const progress = getProgress();
  return progress.completedLessons.includes(`${courseId}/${lessonId}`);
}

export function saveQuizScore(courseId: string, lessonId: string, score: number) {
  const progress = getProgress();
  progress.quizScores[`${courseId}/${lessonId}`] = score;
  saveProgress(progress);
}

export function getQuizScore(courseId: string, lessonId: string): number | undefined {
  const progress = getProgress();
  return progress.quizScores[`${courseId}/${lessonId}`];
}

export function getCourseProgress(courseId: string, totalLessons: number): number {
  const progress = getProgress();
  const completed = progress.completedLessons.filter((k) => k.startsWith(`${courseId}/`)).length;
  return Math.round((completed / totalLessons) * 100);
}

export function getLearningHistory(): HistoryEntry[] {
  const progress = getProgress();
  return [...progress.history].reverse();
}

export function isCourseComplete(courseId: string, totalLessons: number): boolean {
  return getCourseProgress(courseId, totalLessons) === 100;
}
