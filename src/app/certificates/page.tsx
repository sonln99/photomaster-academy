"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isCourseComplete } from "@/lib/progress";
import { courses } from "@/data/courses";

const levelLabels: Record<string, string> = {
  beginner: "Nhiếp Ảnh Cơ Bản",
  professional: "Nhiếp Ảnh Chuyên Nghiệp",
  pro: "Nhiếp Ảnh Bậc Thầy",
};

const levelDescriptions: Record<string, string> = {
  beginner: "Đã hoàn thành khoá học Beginner - nắm vững nền tảng nhiếp ảnh từ tam giác phơi sáng, bố cục, ánh sáng đến ống kính",
  professional: "Đã hoàn thành khoá học Professional - thành thạo studio lighting, portrait patterns, hậu kỳ và color theory",
  pro: "Đã hoàn thành khoá học Pro/Master - đạt trình độ bậc thầy về street photography, thương mại, retouching và phong cách cá nhân",
};

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [completedCourses, setCompletedCourses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const cc: Record<string, boolean> = {};
    courses.forEach((c) => {
      cc[c.id] = isCourseComplete(c.id, c.lessons.length);
    });
    setCompletedCourses(cc);
  }, []);

  return (
    <>
      <Header />
      <main className="pt-24 max-w-5xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Trang chủ</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-[var(--text-primary)]">Chứng chỉ</span>
        </div>

        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Chứng Chỉ</h1>
          <p className="text-[var(--text-secondary)]">Hoàn thành tất cả bài học trong mỗi cấp độ để nhận chứng chỉ</p>
        </div>

        <div className="space-y-8 stagger-children">
          {courses.map((course) => {
            const isComplete = completedCourses[course.id];
            return (
              <div key={course.id}>
                {isComplete ? (
                  <Certificate
                    course={course}
                    userName={session?.user?.name || "Học Viên"}
                    level={course.id}
                  />
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-card)]/30 p-8 sm:p-10 text-center hover:border-white/10 transition-all duration-300">
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                      style={{ backgroundColor: `${course.color}10` }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.4}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-1.5" style={{ color: course.color }}>{levelLabels[course.id]}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-5">
                      Hoàn thành tất cả {course.lessons.length} bài học để mở khoá chứng chỉ này
                    </p>
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90"
                      style={{ backgroundColor: `${course.color}15`, color: course.color }}
                    >
                      Tiếp tục học
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

function Certificate({ course, userName, level }: { course: typeof courses[0]; userName: string; level: string }) {
  return (
    <div className="relative animate-fade-in-up">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.color}10, ${course.color}05, transparent)`,
          border: `2px solid ${course.color}30`,
        }}
      >
        <div className="relative p-8 md:p-14 text-center">
          {/* Decorative corners */}
          <div className="absolute top-5 left-5 w-14 h-14 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: `${course.color}50` }} />
          <div className="absolute top-5 right-5 w-14 h-14 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: `${course.color}50` }} />
          <div className="absolute bottom-5 left-5 w-14 h-14 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: `${course.color}50` }} />
          <div className="absolute bottom-5 right-5 w-14 h-14 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: `${course.color}50` }} />

          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${course.color}08` }} />
          </div>

          <div className="relative">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
            </div>

            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-secondary)] mb-1 font-medium">PhotoMaster Academy</p>
            <h2 className="text-xs tracking-[0.25em] uppercase mb-8 font-semibold" style={{ color: course.color }}>Chứng Nhận Hoàn Thành</h2>

            <p className="text-sm text-[var(--text-secondary)] mb-3">Chứng nhận rằng</p>
            <h3 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: course.color }}>{userName}</h3>
            <div className="w-48 h-px mx-auto mb-8" style={{ background: `linear-gradient(90deg, transparent, ${course.color}60, transparent)` }} />

            <p className="text-sm text-[var(--text-secondary)] mb-1.5">Đã hoàn thành xuất sắc khoá học</p>
            <h4 className="text-xl font-bold mb-5" style={{ color: course.color }}>{levelLabels[level]}</h4>

            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mb-8 leading-relaxed">{levelDescriptions[level]}</p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border" style={{ borderColor: `${course.color}30`, backgroundColor: `${course.color}08` }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={course.color}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xs font-semibold" style={{ color: course.color }}>
                {level === "beginner" ? "Level 1" : level === "professional" ? "Level 2" : "Level 3"} — Verified
              </span>
            </div>

            <div className="mt-8 text-xs text-[var(--text-secondary)]">
              Ngày cấp: {new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
