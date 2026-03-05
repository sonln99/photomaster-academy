"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLearningHistory, getCourseProgress, type HistoryEntry } from "@/lib/progress";
import { courses, getLesson } from "@/data/courses";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    setHistory(getLearningHistory());
    const pm: Record<string, number> = {};
    courses.forEach((c) => {
      pm[c.id] = getCourseProgress(c.id, c.lessons.length);
    });
    setProgressMap(pm);
  }, []);

  const courseColorMap: Record<string, string> = {};
  courses.forEach((c) => { courseColorMap[c.id] = c.color; });

  return (
    <>
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Trang chủ</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-[var(--text-primary)]">Lịch sử học tập</span>
        </div>

        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Lịch Sử Học Tập</h1>
          <p className="text-[var(--text-secondary)]">Theo dõi tiến trình học tập của bạn</p>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 stagger-children">
          {courses.map((course) => {
            const p = progressMap[course.id] || 0;
            const completedCount = Math.round(p / 100 * course.lessons.length);
            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:border-white/10 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }} />
                      <h3 className="font-semibold text-sm" style={{ color: course.color }}>{course.title}</h3>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: course.color }}>
                    {p}%
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${p}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {completedCount}/{course.lessons.length} bài hoàn thành
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* History Timeline */}
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Hoạt động gần đây
        </h2>
        {history.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] mb-3">Chưa có hoạt động nào.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--accent-gold)] text-sm font-medium hover:opacity-80 transition">
              Bắt đầu học ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {history.map((entry, i) => {
              const lesson = getLesson(entry.courseId, entry.lessonId);
              const color = courseColorMap[entry.courseId] || "#f59e0b";
              const date = new Date(entry.completedAt);
              return (
                <Link key={i} href={`/courses/${entry.courseId}/${entry.lessonId}`}>
                  <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-5 hover:bg-[var(--bg-hover)] hover:border-white/10 transition-all duration-200 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{lesson?.title || entry.lessonId}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        <span style={{ color }}>{entry.courseId.charAt(0).toUpperCase() + entry.courseId.slice(1)}</span>
                        {entry.quizScore !== undefined && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-white/[0.04]">Quiz: {entry.quizScore} điểm</span>
                        )}
                      </p>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] shrink-0">
                      {date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
