"use client";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { useLanguage } from "@/lib/LanguageContext";

export default function TrainingPage() {
  const { t } = useLanguage();
  const { courses } = useCourses();

  const stats = [
    { value: "27", label: t.home.lessons, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { value: "3", label: t.home.levels, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { value: "120+", label: t.home.quizzes, icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" },
    { value: "40+", label: t.home.exercises, icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
  ];

  return (
    <>
      
      <main className="pt-4">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.07] rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-72 h-72 bg-orange-500/[0.05] rounded-full blur-3xl" />
          </div>
          <div className="px-4 sm:px-8 lg:px-12 py-20 md:py-28 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-xs text-amber-400 mb-6 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span dangerouslySetInnerHTML={{ __html: t.home.badge }} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-5 leading-[1.1] animate-fade-in-up">
              {t.home.heroTitle1}{" "}
              <span className="gradient-text-gold">{t.home.heroTitle2}</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              {t.home.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <a href="#courses" className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2">
                {t.home.startNow}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
              <a href="#roadmap" className="px-8 py-3.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] hover:border-white/10 transition flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                {t.home.viewRoadmap}
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 sm:px-8 lg:px-12 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--accent-gold)] mb-0.5">{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="px-4 sm:px-8 lg:px-12 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-0.5">{t.home.chooseLevelTitle}</h2>
              <p className="text-xs text-[var(--text-secondary)]">{t.home.chooseLevelDesc}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 stagger-children">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
