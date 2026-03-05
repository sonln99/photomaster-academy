"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Quiz from "@/components/Quiz";
import ExerciseCard from "@/components/ExerciseCard";
import { getCourse, getLesson } from "@/data/courses";
import { markLessonComplete, isLessonComplete, saveQuizScore } from "@/lib/progress";

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params);
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  const [activeTab, setActiveTab] = useState<"content" | "quiz" | "exercises">("content");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (course && lesson) {
      setCompleted(isLessonComplete(courseId, lessonId));
    }
  }, [courseId, lessonId, course, lesson]);

  if (!course || !lesson) {
    return (
      <>
        <Header />
        <main className="pt-24 text-center">
          <p className="text-[var(--text-secondary)]">Không tìm thấy bài học.</p>
          <Link href="/" className="text-[var(--accent-gold)] text-sm mt-4 inline-block">← Về trang chủ</Link>
        </main>
      </>
    );
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  function handleMarkComplete() {
    markLessonComplete(courseId, lessonId);
    setCompleted(true);
  }

  function handleQuizComplete(score: number) {
    saveQuizScore(courseId, lessonId, score);
    if (score >= Math.ceil(lesson!.quiz.length * 0.6)) {
      handleMarkComplete();
    }
  }

  const tabs = [
    { id: "content" as const, label: "Nội dung", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", count: null },
    { id: "quiz" as const, label: "Quiz", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01", count: lesson.quiz.length },
    { id: "exercises" as const, label: "Bài tập", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", count: lesson.exercises.length },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in flex-wrap">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Trang chủ</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <Link href={`/courses/${courseId}`} className="hover:text-[var(--text-primary)] transition" style={{ color: course.color }}>
            {course.title}
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-[var(--text-primary)]">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: `${course.color}15`, color: course.color }}
            >
              Bài {currentIndex + 1}/{course.lessons.length}
            </span>
            {completed && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 flex items-center gap-1.5 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Hoàn thành
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">{lesson.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] w-fit animate-fade-in">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: activeTab === tab.id ? course.color : "transparent",
                color: activeTab === tab.id ? "#000" : "var(--text-secondary)",
                boxShadow: activeTab === tab.id ? `0 2px 10px ${course.color}30` : "none",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
              {tab.count !== null && (
                <span className="text-xs opacity-70">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "content" && (
            <div>
              <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              {!completed && (
                <button
                  onClick={handleMarkComplete}
                  className="mt-8 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: course.color, color: "#000", boxShadow: `0 4px 15px ${course.color}30` }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Đánh dấu đã học xong
                </button>
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <Quiz
              questions={lesson.quiz}
              courseId={courseId}
              lessonId={lessonId}
              onComplete={handleQuizComplete}
            />
          )}

          {activeTab === "exercises" && (
            <div className="space-y-4 stagger-children">
              {lesson.exercises.map((ex, i) => (
                <ExerciseCard key={i} exercise={ex} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--border)]">
          {prevLesson ? (
            <Link
              href={`/courses/${courseId}/${prevLesson.id}`}
              className="group flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition p-3 -m-3 rounded-xl hover:bg-white/[0.02]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Bài trước</div>
                <div className="font-medium">{prevLesson.title}</div>
              </div>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link
              href={`/courses/${courseId}/${nextLesson.id}`}
              className="group flex items-center gap-3 text-sm hover:opacity-80 transition p-3 -m-3 rounded-xl hover:bg-white/[0.02]"
              style={{ color: course.color }}
            >
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-60">Bài tiếp</div>
                <div className="font-medium">{nextLesson.title}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${courseId}`}
              className="text-sm hover:opacity-80 transition font-medium flex items-center gap-2"
              style={{ color: course.color }}
            >
              Về danh sách bài học
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
