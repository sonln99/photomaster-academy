"use client";
import Link from "next/link";
import { Course } from "@/data/types";
import { useEffect, useState } from "react";
import { getCourseProgress } from "@/lib/progress";

const levelIcons: Record<string, string> = {
  beginner: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  professional: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  pro: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

export default function CourseCard({ course }: { course: Course }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getCourseProgress(course.id, course.lessons.length));
  }, [course.id, course.lessons.length]);

  return (
    <Link href={`/courses/${course.id}`}>
      <div
        className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 cursor-pointer"
        style={{ "--card-color": course.color } as React.CSSProperties}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${course.color}20` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={levelIcons[course.level]} />
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold" style={{ color: course.color }}>{course.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: course.color, color: course.color }}>
            {course.lessons.length} bài học
          </span>
        </div>

        <p className="text-[var(--text-secondary)] text-sm mb-4">{course.description}</p>

        {progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Tiến độ</span>
              <span style={{ color: course.color }}>{progress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: course.color }}
              />
            </div>
          </div>
        )}

        <div className="text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: course.color }}>
          {progress > 0 ? "Tiếp tục học →" : "Bắt đầu học →"}
        </div>
      </div>
    </Link>
  );
}
