"use client";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Job {
  id: string;
  user_name: string;
  user_image: string | null;
  title: string;
  date: string;
  location: string;
  price: string;
  status: string;
  created_at: string;
}

function JobsPanel({ isDesktop, onClose }: { isDesktop: boolean; onClose?: () => void }) {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setJobs(d.filter((j: Job) => j.status === "open").slice(0, 20)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("jobs-sidebar-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "jobs" }, (payload) => {
        const job = payload.new as Job;
        if (job.status === "open") {
          setJobs((prev) => prev.some((j) => j.id === job.id) ? prev : [job, ...prev]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className={`flex flex-col bg-[var(--bg-primary)] ${
      isDesktop
        ? "fixed top-0 right-[320px] w-[270px] h-screen border-l border-white/[0.06] z-40"
        : "fixed bottom-24 left-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.08] glass shadow-2xl shadow-black/50 animate-fade-in-up overflow-hidden"
    }`} style={!isDesktop ? { height: "min(500px, calc(100vh - 8rem))" } : {}}>
      {/* Header */}
      <div className={`px-4 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0 ${isDesktop ? "pt-[72px]" : ""}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t.home.latestJobs}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-[var(--text-secondary)]">{t.jobs.statusOpen}</span>
            </div>
          </div>
        </div>
        {!isDesktop && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Jobs list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{t.jobs.empty}</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link href="/jobs" key={job.id}
              className="group flex items-start gap-2 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
            >
              {job.user_image ? (
                <img src={job.user_image} alt="" className="w-7 h-7 rounded-full ring-1 ring-white/10 shrink-0 mt-0.5" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[9px] font-bold text-black shrink-0 mt-0.5">
                  {job.user_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-semibold truncate group-hover:text-amber-400 transition mb-0.5">{job.title}</h4>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {new Date(job.date).toLocaleDateString("vi", { day: "2-digit", month: "2-digit" })}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="truncate max-w-[60px]">{job.location}</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-400">{job.price}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* View all - bottom */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
        <Link href="/jobs" className="flex items-center justify-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition">
          {t.home.viewAllJobs}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>
    </div>
  );
}

export default function JobsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="hidden 2xl:block">
        <JobsPanel isDesktop />
      </div>
      <div className="2xl:hidden">
        <button onClick={handleMobileToggle}
          className="fixed bottom-24 left-6 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          )}
        </button>
        {mobileOpen && (
          <JobsPanel isDesktop={false} onClose={() => setMobileOpen(false)} />
        )}
      </div>
    </>
  );
}
