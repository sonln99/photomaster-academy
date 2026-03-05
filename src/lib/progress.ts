"use client";

const STORAGE_KEY = "photomaster_progress";

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
}

function getProgress(): Progress {
  if (typeof window === "undefined") return { completedLessons: [], quizScores: {} };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { completedLessons: [], quizScores: {} };
  return JSON.parse(data);
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(courseId: string, lessonId: string) {
  const progress = getProgress();
  const key = `${courseId}/${lessonId}`;
  if (!progress.completedLessons.includes(key)) {
    progress.completedLessons.push(key);
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
