"use client";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getCourse } from "@/data/courses";
import { useEffect, useState } from "react";
import { isLessonComplete, getCourseProgress } from "@/lib/progress";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = getCourse(courseId);
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
          <p className="text-[var(--text-secondary)]">Không tìm thấy khoá học.</p>
          <Link href="/" className="text-[var(--accent-gold)] text-sm mt-4 inline-block">← Về trang chủ</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mb-6 inline-block">
          ← Về trang chủ
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold" style={{ color: course.color }}>{course.title}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: course.color, color: course.color }}>
              {course.lessons.length} bài học
            </span>
          </div>
          <p className="text-[var(--text-secondary)]">{course.description}</p>

          {progress > 0 && (
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Tiến độ tổng thể</span>
                <span style={{ color: course.color }}>{progress}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: course.color }} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {course.lessons.map((lesson, i) => (
            <Link key={lesson.id} href={`/courses/${courseId}/${lesson.id}`}>
              <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:border-opacity-50 hover:bg-[var(--bg-hover)] transition-all cursor-pointer flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    backgroundColor: completed[lesson.id] ? `${course.color}30` : "var(--bg-primary)",
                    color: completed[lesson.id] ? course.color : "var(--text-secondary)",
                  }}
                >
                  {completed[lesson.id] ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm group-hover:text-[var(--text-primary)] transition">{lesson.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[var(--text-secondary)]">{lesson.quiz.length} quiz</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
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
