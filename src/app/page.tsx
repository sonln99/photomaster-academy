"use client";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
          <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--text-secondary)] mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
              18 bài học chuyên sâu
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Học Chụp Ảnh{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Chuyên Nghiệp
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
              Từ người mới bắt đầu đến nhiếp ảnh gia chuyên nghiệp. 3 cấp độ, 18 bài học, quiz kiểm tra kiến thức và bài tập thực hành.
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="#courses"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition"
              >
                Bắt đầu ngay
              </a>
              <a
                href="#roadmap"
                className="px-6 py-3 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--bg-hover)] transition"
              >
                Xem lộ trình
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "18", label: "Bài học" },
              { value: "3", label: "Cấp độ" },
              { value: "80+", label: "Câu quiz" },
              { value: "30+", label: "Bài tập" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <div className="text-2xl font-bold text-[var(--accent-gold)]">{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="max-w-4xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-6">Chọn Cấp Độ</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="max-w-4xl mx-auto px-4 mb-20">
          <h2 className="text-2xl font-bold mb-6">Lộ Trình Học Tập</h2>
          <div className="space-y-4">
            {courses.map((course, ci) => (
              <div key={course.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${course.color}20`, color: course.color }}
                  >
                    {ci + 1}
                  </div>
                  <h3 className="font-semibold" style={{ color: course.color }}>{course.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-11">
                  {course.lessons.map((lesson) => (
                    <div key={lesson.id} className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: course.color }} />
                      {lesson.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-secondary)]">
          PhotoMaster Academy — Học chụp ảnh chuyên nghiệp
        </footer>
      </main>
    </>
  );
}
