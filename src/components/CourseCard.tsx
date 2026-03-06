"use client";
import Link from "next/link";
import { Course } from "@/data/types";
import { useEffect, useState } from "react";
import { getCourseProgress } from "@/lib/progress";
import { useLanguage } from "@/lib/LanguageContext";

const levelIcons: Record<string, string> = {
  beginner: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  professional: "M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  pro: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

export default function CourseCard({ course }: { course: Course }) {
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();

  const levelLabels: Record<string, string> = {
    beginner: t.nav.beginner,
    professional: t.nav.professional,
    pro: t.nav.pro,
  };

  useEffect(() => {
    setProgress(getCourseProgress(course.id, course.lessons.length));
  }, [course.id, course.lessons.length]);

  return (
    <Link href={`/courses/${course.id}`} className="h-full">
      <div
        className="group relative rounded-2xl bg-[var(--bg-card)] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${course.color}10, transparent 70%)` }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
              style={{ backgroundColor: `${course.color}12`, boxShadow: `0 0 20px ${course.color}10` }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={levelIcons[course.level]} />
              </svg>
            </div>
            <span
              className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
              style={{ backgroundColor: `${course.color}12`, color: course.color }}
            >
              {levelLabels[course.level]}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-1.5 line-clamp-1" style={{ color: course.color }}>{course.title}</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-5 leading-relaxed line-clamp-2 min-h-[2.5rem]">{course.description}</p>

          <div className="flex items-center gap-4 mb-5 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              {course.lessons.length} {t.card.lessonCount}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01"/>
              </svg>
              {t.card.quiz}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[var(--text-secondary)]">{t.card.progress}</span>
              <span className="font-semibold" style={{ color: course.color }}>{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300" style={{ color: course.color }}>
            {progress > 0 ? t.card.continue : t.card.start}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
