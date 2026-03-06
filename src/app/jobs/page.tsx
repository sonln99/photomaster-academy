"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  user_id: string;
  user_name: string;
  user_image: string | null;
  title: string;
  date: string;
  location: string;
  price: string;
  note: string | null;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  user_name: string;
  user_image: string | null;
  message: string | null;
  created_at: string;
}

export default function JobsPage() {
  const { user: authUser } = useAuth();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Record<string, Application[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date: "", location: "", price: "", note: "" });

  const currentUserId = authUser?.id || "";

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setJobs(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("jobs-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "jobs" }, (payload) => {
        const newJob = payload.new as Job;
        setJobs((prev) => prev.some((j) => j.id === newJob.id) ? prev : [newJob, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("apps-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_applications" }, (payload) => {
        const newApp = payload.new as Application;
        setApps((prev) => ({
          ...prev,
          [newApp.job_id]: [...(prev[newApp.job_id] || []).filter((a) => a.id !== newApp.id), newApp],
        }));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadApps = useCallback(async (jobId: string) => {
    const res = await fetch(`/api/jobs/apply?jobId=${jobId}`);
    const d = await res.json();
    if (Array.isArray(d)) setApps((prev) => ({ ...prev, [jobId]: d }));
  }, []);

  useEffect(() => {
    jobs.forEach((j) => loadApps(j.id));
  }, [jobs, loadApps]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !currentUserId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          userName: authUser?.name || "Anonymous",
          userImage: authUser?.image || null,
          ...form,
        }),
      });
      const saved = await res.json();
      if (saved?.id) {
        setJobs((prev) => [saved, ...prev]);
        setForm({ title: "", date: "", location: "", price: "", note: "" });
        setShowForm(false);
      }
    } catch {}
    setSubmitting(false);
  }

  async function handleApply(jobId: string) {
    if (!currentUserId) return;
    try {
      await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          userId: currentUserId,
          userName: authUser?.name || "Anonymous",
          userImage: authUser?.image || null,
          message: applyMsg,
        }),
      });
      loadApps(jobId);
      setApplyingJob(null);
      setApplyMsg("");
    } catch {}
  }

  return (
    <>
      
      <main className="pt-4 pb-16 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.jobs.title}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t.jobs.desc}</p>
          </div>
          {currentUserId && (
            <button onClick={() => setShowForm(!showForm)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/25 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t.jobs.post}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] space-y-4 animate-fade-in max-w-3xl">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.titleLabel}</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.dateLabel}</label>
                <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.locationLabel}</label>
                <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.priceLabel}</label>
              <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} maxLength={100} placeholder="VD: 500k, 1tr, Thỏa thuận"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.noteLabel}</label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={500} rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "..." : t.jobs.submit}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] transition">
                {t.jobs.cancel}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20 text-[var(--text-secondary)]">...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[var(--text-secondary)]">{t.jobs.empty}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {jobs.map((job) => {
              const jobApps = apps[job.id] || [];
              const hasApplied = jobApps.some((a) => a.user_id === currentUserId);
              const isOwner = job.user_id === currentUserId;
              const isExpanded = expandedJob === job.id;

              return (
                <div key={job.id} className="group rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all duration-300 flex flex-col overflow-hidden">
                  {/* Card header */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      {job.user_image ? (
                        <img src={job.user_image} alt="" className="w-9 h-9 rounded-full ring-2 ring-white/10 shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black shrink-0">
                          {(job.user_name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{job.user_name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{new Date(job.created_at).toLocaleDateString("vi")}</p>
                      </div>
                      <span className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold ${job.status === "open" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                        {job.status === "open" ? t.jobs.statusOpen : t.jobs.statusClosed}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm mb-3 line-clamp-2 group-hover:text-amber-400 transition">{job.title}</h3>

                    <div className="space-y-2 text-[11px] text-[var(--text-secondary)] mb-3">
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {new Date(job.date).toLocaleString("vi", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      {job.price}
                    </div>

                    {job.note && <p className="text-xs text-[var(--text-secondary)] bg-white/[0.02] rounded-xl px-3 py-2 mb-3 line-clamp-2">{job.note}</p>}

                    {/* Applicants count + expand */}
                    {jobApps.length > 0 && (
                      <button onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mt-auto">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        {t.jobs.applicants} ({jobApps.length})
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                    )}
                  </div>

                  {/* Expanded applicants */}
                  {isExpanded && jobApps.length > 0 && (
                    <div className="px-5 pb-3 border-t border-white/[0.06] pt-3 space-y-2 animate-fade-in">
                      {jobApps.map((app) => (
                        <div key={app.id} className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02]">
                          {app.user_image ? (
                            <img src={app.user_image} alt="" className="w-6 h-6 rounded-full shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-[9px] font-bold text-amber-400 shrink-0">
                              {app.user_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium">{app.user_name}</p>
                            {app.message && <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{app.message}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Apply button */}
                  {currentUserId && !isOwner && job.status === "open" && (
                    <div className="px-5 pb-4 pt-1">
                      {hasApplied ? (
                        <span className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {t.jobs.applied}
                        </span>
                      ) : applyingJob === job.id ? (
                        <div className="space-y-2">
                          <input type="text" value={applyMsg} onChange={(e) => setApplyMsg(e.target.value)} placeholder={t.jobs.applyMessage} maxLength={500}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-[var(--border)] text-xs focus:outline-none focus:border-amber-500/50 transition" />
                          <div className="flex gap-2">
                            <button onClick={() => handleApply(job.id)}
                              className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-semibold hover:opacity-90 transition">
                              {t.jobs.apply}
                            </button>
                            <button onClick={() => { setApplyingJob(null); setApplyMsg(""); }}
                              className="px-3 py-2 rounded-xl border border-[var(--border)] text-xs hover:bg-white/[0.04] transition">
                              {t.jobs.cancel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setApplyingJob(job.id)}
                          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-semibold hover:opacity-90 transition">
                          {t.jobs.apply}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
