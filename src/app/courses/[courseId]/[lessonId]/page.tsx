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
    { id: "content" as const, label: "Nội dung", count: null },
    { id: "quiz" as const, label: "Quiz", count: lesson.quiz.length },
    { id: "exercises" as const, label: "Bài tập", count: lesson.exercises.length },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Trang chủ</Link>
          <span>/</span>
          <Link href={`/courses/${courseId}`} className="hover:text-[var(--text-primary)] transition" style={{ color: course.color }}>
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
              Bài {currentIndex + 1}/{course.lessons.length}
            </span>
            {completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Hoàn thành
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-[var(--text-secondary)]">{lesson.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? course.color : "transparent",
                color: activeTab === tab.id ? "#000" : "var(--text-secondary)",
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "content" && (
          <div>
            <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            {!completed && (
              <button
                onClick={handleMarkComplete}
                className="mt-8 px-6 py-3 rounded-xl font-medium text-sm transition"
                style={{ backgroundColor: course.color, color: "#000" }}
              >
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
          <div className="space-y-4">
            {lesson.exercises.map((ex, i) => (
              <ExerciseCard key={i} exercise={ex} index={i} />
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--border)]">
          {prevLesson ? (
            <Link
              href={`/courses/${courseId}/${prevLesson.id}`}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {prevLesson.title}
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link
              href={`/courses/${courseId}/${nextLesson.id}`}
              className="text-sm hover:opacity-80 transition flex items-center gap-2 font-medium"
              style={{ color: course.color }}
            >
              {nextLesson.title}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${courseId}`}
              className="text-sm hover:opacity-80 transition font-medium"
              style={{ color: course.color }}
            >
              Về danh sách bài học →
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
