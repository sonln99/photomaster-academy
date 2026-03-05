"use client";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

const stats = [
  { value: "27", label: "Bài học", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { value: "3", label: "Cấp độ", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { value: "120+", label: "Câu quiz", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" },
  { value: "40+", label: "Bài tập", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
];

const features = [
  { title: "Bài học chuyên sâu", desc: "Nội dung được tổng hợp từ các nhiếp ảnh gia quốc tế hàng đầu", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { title: "Quiz tương tác", desc: "Kiểm tra kiến thức ngay sau mỗi bài với hơn 120 câu hỏi", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Chứng chỉ hoàn thành", desc: "Nhận chứng chỉ cho mỗi cấp độ khi hoàn thành tất cả bài học", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.07] rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-72 h-72 bg-orange-500/[0.05] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto px-4 py-24 md:py-32 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-xs text-amber-400 mb-8 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              27 bài học chuyên sâu &bull; Cập nhật 2026
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-[1.1] animate-fade-in-up">
              Học Chụp Ảnh{" "}
              <span className="gradient-text-gold">
                Chuyên Nghiệp
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Lộ trình hoàn chỉnh từ cơ bản đến bậc thầy. 3 cấp độ, 27 bài học chuyên sâu, quiz kiểm tra kiến thức và bài tập thực hành thực tế.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <a
                href="#courses"
                className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2"
              >
                Bắt đầu ngay
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
              <a
                href="#roadmap"
                className="px-8 py-3.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] hover:border-white/10 transition flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                Xem lộ trình
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-white/10 hover:bg-[var(--bg-hover)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--accent-gold)] mb-0.5">{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="max-w-5xl mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Chọn Cấp Độ</h2>
              <p className="text-sm text-[var(--text-secondary)]">Bắt đầu từ cơ bản hoặc chọn cấp độ phù hợp với bạn</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 stagger-children">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Tại Sao Chọn PhotoMaster?</h2>
            <p className="text-sm text-[var(--text-secondary)]">Nền tảng học nhiếp ảnh toàn diện nhất</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 stagger-children">
            {features.map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="max-w-5xl mx-auto px-4 mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Lộ Trình Học Tập</h2>
            <p className="text-sm text-[var(--text-secondary)]">3 cấp độ, từ zero đến pro</p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-beginner)] via-[var(--accent-professional)] to-[var(--accent-pro)]" />

            <div className="space-y-6 stagger-children">
              {courses.map((course, ci) => (
                <div key={course.id} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10" style={{ borderColor: course.color, backgroundColor: `${course.color}30` }} />

                  <div
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-white/10 transition-all duration-300"
                    style={{ borderLeftColor: course.color, borderLeftWidth: "3px" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${course.color}15`, color: course.color }}
                      >
                        {ci + 1}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: course.color }}>{course.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)]">{course.lessons.length} bài học</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-13">
                      {course.lessons.map((lesson) => (
                        <div key={lesson.id} className="text-xs text-[var(--text-secondary)] flex items-center gap-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: course.color, opacity: 0.6 }} />
                          {lesson.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-[var(--border)]">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.03] to-transparent" />
          <div className="relative max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">PhotoMaster Academy</p>
                  <p className="text-xs text-[var(--text-secondary)]">Học chụp ảnh chuyên nghiệp</p>
                </div>
              </div>

              <p className="text-xl sm:text-2xl font-bold gradient-text-gold tracking-tight">
                Chụp lại thanh xuân
              </p>

              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <a href="#courses" className="hover:text-[var(--text-primary)] transition">Khoá học</a>
                <a href="#roadmap" className="hover:text-[var(--text-primary)] transition">Lộ trình</a>
                <span>&copy; 2026 PhotoMaster</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
