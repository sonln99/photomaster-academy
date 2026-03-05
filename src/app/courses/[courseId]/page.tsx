"use client";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getCourse } from "@/data/courses";
import { useEffect, useState } from "react";
import { isLessonComplete, getCourseProgress } from "@/lib/progress";
import { useLanguage } from "@/lib/LanguageContext";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = getCourse(courseId);
  const { t } = useLanguage();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!course) return;
    const c: Record<string, boolean> = {};
    course.lessons.forEach((l) => {
      c[l.id] = isLessonComplete(courseId, l.id);
    });
    setCompleted(c);
    setProgress(getCourseProgress(courseId, course.lessons.length));
  }, [courseId, course]);

  if (!course) {
    return (
      <>
        <Header />
        <main className="pt-24 text-center">
          <p className="text-[var(--text-secondary)]">{t.coursePage.notFound}</p>
          <Link href="/" className="text-[var(--accent-gold)] text-sm mt-4 inline-block">{t.coursePage.backHome}</Link>
        </main>
      </>
    );
  }

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <>
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">{t.coursePage.home}</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-[var(--text-primary)]">{course.title}</span>
        </div>

        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${course.color}15` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: course.color }}>{course.title}</h1>
              <p className="text-sm text-[var(--text-secondary)]">{course.lessons.length} {t.card.lessonCount}</p>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{course.description}</p>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">{t.coursePage.overallProgress}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)]">{completedCount}/{course.lessons.length} {t.coursePage.completed}</span>
                <span className="text-sm font-bold" style={{ color: course.color }}>{progress}%</span>
              </div>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 stagger-children">
          {course.lessons.map((lesson, i) => (
            <Link key={lesson.id} href={`/courses/${courseId}/${lesson.id}`}>
              <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-5 hover:border-white/10 hover:bg-[var(--bg-hover)] transition-all duration-200 cursor-pointer flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: completed[lesson.id] ? `${course.color}20` : "var(--bg-primary)",
                    color: completed[lesson.id] ? course.color : "var(--text-secondary)",
                    boxShadow: completed[lesson.id] ? `0 0 15px ${course.color}15` : "none",
                  }}
                >
                  {completed[lesson.id] ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span className="text-sm">{String(i + 1).padStart(2, "0")}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm group-hover:text-[var(--text-primary)] transition">{lesson.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[var(--text-secondary)] hidden sm:inline px-2 py-1 rounded-md bg-white/[0.04]">{lesson.quiz.length} quiz</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:stroke-[var(--text-primary)] transition-all">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
