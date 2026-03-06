"use client";
import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Quiz from "@/components/Quiz";
import ExerciseCard from "@/components/ExerciseCard";
import { markLessonComplete, isLessonComplete, saveQuizScore } from "@/lib/progress";
import { useLanguage } from "@/lib/LanguageContext";
import { useCourse, useLesson } from "@/hooks/useCourses";

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params);
  const { course } = useCourse(courseId);
  const { lesson, loading: lessonLoading } = useLesson(courseId, lessonId);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"content" | "quiz" | "exercises">("content");
  const [completed, setCompleted] = useState(false);
  const [contentViewed, setContentViewed] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [quizKey, setQuizKey] = useState(0);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (course && lesson) {
      const done = isLessonComplete(courseId, lessonId);
      setCompleted(done);
      if (done) {
        setContentViewed(true);
        setQuizPassed(true);
      }
    }
  }, [courseId, lessonId, course, lesson]);

  useEffect(() => {
    if (contentViewed && quizPassed && !completed) {
      markLessonComplete(courseId, lessonId);
      setCompleted(true);
    }
  }, [contentViewed, quizPassed, completed, courseId, lessonId]);

  if (lessonLoading || !course || !lesson) {
    return (
      <>
        
        <main className="pt-24 text-center">
          {lessonLoading ? (
            <div className="animate-pulse text-[var(--text-secondary)]">Loading...</div>
          ) : (
            <>
              <p className="text-[var(--text-secondary)]">{t.lessonPage.notFound}</p>
              <Link href="/" className="text-[var(--accent-gold)] text-sm mt-4 inline-block">{t.coursePage.backHome}</Link>
            </>
          )}
        </main>
      </>
    );
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  function handleGoToQuiz() {
    setContentViewed(true);
    setActiveTab("quiz");
    setTimeout(() => {
      quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleQuizComplete(score: number) {
    saveQuizScore(courseId, lessonId, score);
    const total = lesson!.quiz.length;
    setQuizScore({ score, total });
    const passThreshold = Math.ceil(total * 0.6);
    if (score >= passThreshold) {
      setQuizPassed(true);
      if (contentViewed) {
        markLessonComplete(courseId, lessonId);
        setCompleted(true);
      }
    }
  }

  function handleRetryQuiz() {
    setQuizScore(null);
    setQuizKey((k) => k + 1);
  }

  // Step indicators
  const steps = [
    { label: t.lessonPage.content, done: contentViewed, active: activeTab === "content" },
    { label: t.lessonPage.quiz, done: quizPassed, active: activeTab === "quiz" },
    { label: t.lessonPage.exercises, done: false, active: activeTab === "exercises" },
  ];

  return (
    <>
      
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in flex-wrap">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">{t.coursePage.home}</Link>
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
              {t.lessonPage.lesson} {currentIndex + 1}/{course.lessons.length}
            </span>
            {completed && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 flex items-center gap-1.5 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t.lessonPage.done}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">{lesson.description}</p>

          {/* Step progress */}
          <div className="mt-5 flex items-center gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => setActiveTab(i === 0 ? "content" : i === 1 ? "quiz" : "exercises")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    step.active
                      ? "bg-white/[0.08] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    step.done
                      ? "bg-green-500 border-green-500 text-black"
                      : step.active
                        ? `border-current`
                        : "border-[var(--border)]"
                  }`}
                    style={step.active && !step.done ? { borderColor: course.color, color: course.color } : {}}
                  >
                    {step.done ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px mx-1 ${step.done ? "bg-green-500/50" : "bg-[var(--border)]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" ref={quizSectionRef}>
          {activeTab === "content" && (
            <div>
              <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />

              {/* CTA: Go to Quiz */}
              <div className="mt-10 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${course.color}15` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {t.lessonPage.readyQuiz}
                </p>
                <button
                  onClick={handleGoToQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: course.color, color: "#000", boxShadow: `0 4px 20px ${course.color}30` }}
                >
                  {t.lessonPage.goToQuiz}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
                <p className="text-[10px] text-[var(--text-secondary)] mt-3 opacity-60">
                  {lesson.quiz.length} {t.lessonPage.quiz} &middot; {t.lessonPage.quizNotPassed}
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              {/* Quiz completed - show result & next actions */}
              {quizScore ? (
                <div className="animate-fade-in-up">
                  {/* Result card */}
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10 text-center mb-6">
                    <div className="relative w-28 h-28 mx-auto mb-5">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={quizPassed ? "#22c55e" : Math.round((quizScore.score / quizScore.total) * 100) >= 60 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${Math.round((quizScore.score / quizScore.total) * 100) * 2.64} 264`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: quizPassed ? "#22c55e" : "#ef4444" }}>
                          {Math.round((quizScore.score / quizScore.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-1">
                      {quizScore.score}/{quizScore.total} {t.quiz.correct}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
                      {quizPassed ? t.quiz.great : Math.round((quizScore.score / quizScore.total) * 100) >= 60 ? t.quiz.ok : t.quiz.fail}
                    </p>
                  </div>

                  {/* Completion celebration or retry */}
                  {completed ? (
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-6 text-center animate-fade-in-up">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-green-400 mb-1">{t.lessonPage.lessonComplete}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">{t.lessonPage.lessonCompleteDesc}</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {lesson.exercises.length > 0 && (
                          <button
                            onClick={() => setActiveTab("exercises")}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/15 transition-all"
                          >
                            {t.lessonPage.goToExercises}
                          </button>
                        )}
                        {nextLesson ? (
                          <Link
                            href={`/courses/${courseId}/${nextLesson.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: course.color, color: "#000", boxShadow: `0 4px 15px ${course.color}30` }}
                          >
                            {t.lessonPage.nextLesson}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                          </Link>
                        ) : (
                          <Link
                            href={`/courses/${courseId}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: course.color, color: "#000" }}
                          >
                            {t.lessonPage.backToList}
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-6 text-center">
                      <p className="text-sm text-amber-400 mb-4">{t.lessonPage.quizNotPassed}</p>
                      <button
                        onClick={handleRetryQuiz}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:opacity-90 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        {t.lessonPage.tryAgain}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Quiz
                  key={quizKey}
                  questions={lesson.quiz}
                  courseId={courseId}
                  lessonId={lessonId}
                  onComplete={handleQuizComplete}
                />
              )}
            </div>
          )}

          {activeTab === "exercises" && (
            <div className="space-y-4 stagger-children">
              {lesson.exercises.length > 0 ? (
                lesson.exercises.map((ex, i) => (
                  <ExerciseCard key={i} exercise={ex} index={i} />
                ))
              ) : (
                <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50">
                  <p className="text-[var(--text-secondary)] text-sm">Chưa có bài tập cho bài học này</p>
                </div>
              )}
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
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">{t.lessonPage.prev}</div>
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
                <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-60">{t.lessonPage.next}</div>
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
              {t.lessonPage.backToList}
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
