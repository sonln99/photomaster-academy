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

// Sync lên Supabase (nếu đã đăng nhập)
async function syncToSupabase(courseId: string, lessonId: string, quizScore?: number) {
  try {
    const userId = getUserId();
    if (!userId) return;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, lessonId, quizScore }),
    });
  } catch {
    // Không lỗi nếu offline — dữ liệu vẫn lưu localStorage
  }
}

// Lấy userId từ session (lưu trong localStorage khi login)
function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("photomaster_user_id");
}

// Gọi từ component khi session thay đổi
export function setUserId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem("photomaster_user_id", id);
  } else {
    localStorage.removeItem("photomaster_user_id");
  }
}

// Tải progress từ Supabase về localStorage
export async function loadProgressFromCloud(): Promise<boolean> {
  const userId = getUserId();
  if (!userId) return false;

  try {
    const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return false;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return false;

    const progress = getProgress();

    for (const row of data) {
      const key = `${row.course_id}/${row.lesson_id}`;
      if (!progress.completedLessons.includes(key)) {
        progress.completedLessons.push(key);
        if (row.quiz_score !== null) {
          progress.quizScores[key] = row.quiz_score;
        }
        progress.history.push({
          courseId: row.course_id,
          lessonId: row.lesson_id,
          completedAt: row.completed_at,
          quizScore: row.quiz_score ?? undefined,
        });
      }
    }

    saveProgress(progress);
    return true;
  } catch {
    return false;
  }
}

// Upload tất cả progress local lên cloud
export async function uploadProgressToCloud() {
  const userId = getUserId();
  if (!userId) return;

  const progress = getProgress();
  for (const key of progress.completedLessons) {
    const [courseId, lessonId] = key.split("/");
    const quizScore = progress.quizScores[key];
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, lessonId, quizScore }),
      });
    } catch {
      // skip errors
    }
  }
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
  syncToSupabase(courseId, lessonId, progress.quizScores[key]);
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
