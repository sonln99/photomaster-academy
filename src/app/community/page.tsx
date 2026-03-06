"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

// ---- Types ----
interface Event {
  id: string;
  user_id: string;
  concept_name: string;
  description: string | null;
  date: string;
  location: string;
  type: "free" | "paid";
  price: string | null;
  qr_image: string | null;
  status: string;
  created_at: string;
}

interface Vote {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_image: string | null;
  payment_confirmed: boolean;
  admin_approved: boolean;
}

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

export default function CommunityPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [tab, setTab] = useState<"events" | "jobs">("events");

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [evLoading, setEvLoading] = useState(true);
  const [evSubmitting, setEvSubmitting] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [evForm, setEvForm] = useState({
    conceptName: "", description: "", date: "", location: "", type: "free" as "free" | "paid", price: "", qrImage: "",
  });

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Record<string, Application[]>>({});
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({ title: "", date: "", location: "", price: "", note: "" });

  const currentUserId = session?.user
    ? (session.user as Record<string, unknown>).id as string || session.user.name || ""
    : "";

  // ---- Events logic ----
  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEvents(d); })
      .catch(() => {})
      .finally(() => setEvLoading(false));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("events-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload) => {
        const ev = payload.new as Event;
        setEvents((prev) => prev.some((e) => e.id === ev.id) ? prev : [ev, ...prev]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "event_votes" }, (payload) => {
        const vote = payload.new as Vote;
        setVotes((prev) => ({
          ...prev,
          [vote.event_id]: [...(prev[vote.event_id] || []).filter((v) => v.id !== vote.id), vote],
        }));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadVotes = useCallback(async (eventId: string) => {
    const res = await fetch(`/api/events/vote?eventId=${eventId}`);
    const d = await res.json();
    if (Array.isArray(d)) setVotes((prev) => ({ ...prev, [eventId]: d }));
  }, []);

  useEffect(() => {
    events.forEach((ev) => loadVotes(ev.id));
  }, [events, loadVotes]);

  async function handleEventSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (evSubmitting || !currentUserId) return;
    setEvSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, ...evForm }),
      });
      const saved = await res.json();
      if (saved?.id) {
        setEvents((prev) => [saved, ...prev]);
        setEvForm({ conceptName: "", description: "", date: "", location: "", type: "free", price: "", qrImage: "" });
        setShowEventForm(false);
      }
    } catch {}
    setEvSubmitting(false);
  }

  async function handleVote(event: Event) {
    if (!currentUserId) return;
    if (event.type === "paid") { setShowQr(event.id); return; }
    await submitVote(event.id);
  }

  async function submitVote(eventId: string) {
    try {
      await fetch("/api/events/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId, userId: currentUserId,
          userName: session?.user?.name || "Anonymous",
          userImage: session?.user?.image || null,
        }),
      });
      loadVotes(eventId);
    } catch {}
  }

  async function confirmPayment(voteId: string, eventId: string) {
    try {
      await fetch("/api/events/vote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId, paymentConfirmed: true }),
      });
      loadVotes(eventId);
      setShowQr(null);
    } catch {}
  }

  async function adminApprove(voteId: string, eventId: string) {
    try {
      await fetch("/api/events/vote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId, adminApproved: true }),
      });
      loadVotes(eventId);
    } catch {}
  }

  // ---- Jobs logic ----
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setJobs(d); })
      .catch(() => {})
      .finally(() => setJobLoading(false));
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

  async function handleJobSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (jobSubmitting || !currentUserId) return;
    setJobSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          userName: session?.user?.name || "Anonymous",
          userImage: session?.user?.image || null,
          ...jobForm,
        }),
      });
      const saved = await res.json();
      if (saved?.id) {
        setJobs((prev) => [saved, ...prev]);
        setJobForm({ title: "", date: "", location: "", price: "", note: "" });
        setShowJobForm(false);
      }
    } catch {}
    setJobSubmitting(false);
  }

  async function handleApply(jobId: string) {
    if (!currentUserId) return;
    try {
      await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId, userId: currentUserId,
          userName: session?.user?.name || "Anonymous",
          userImage: session?.user?.image || null,
          message: applyMsg,
        }),
      });
      loadApps(jobId);
      setApplyingJob(null);
      setApplyMsg("");
    } catch {}
  }

  const loading = tab === "events" ? evLoading : jobLoading;

  return (
    <>
      
      <main className="pt-4 pb-16 px-4 sm:px-8 lg:px-12">
        {/* Header + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.nav.community}</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {tab === "events" ? t.events.desc : t.jobs.desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentUserId && tab === "events" && (
              <button onClick={() => setShowEventForm(!showEventForm)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/25 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t.events.create}
              </button>
            )}
            {currentUserId && tab === "jobs" && (
              <button onClick={() => setShowJobForm(!showJobForm)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/25 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t.jobs.post}
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-[var(--border)] w-fit mb-6">
          <button
            onClick={() => setTab("events")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "events"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t.events.title}
            </span>
          </button>
          <button
            onClick={() => setTab("jobs")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "jobs"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {t.jobs.title}
            </span>
          </button>
        </div>

        {/* ==================== EVENTS TAB ==================== */}
        {tab === "events" && (
          <>
            {showEventForm && (
              <form onSubmit={handleEventSubmit} className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] space-y-4 animate-fade-in max-w-3xl">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.conceptLabel}</label>
                  <input type="text" required value={evForm.conceptName} onChange={(e) => setEvForm({ ...evForm, conceptName: e.target.value })} maxLength={200}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.descriptionLabel}</label>
                  <textarea value={evForm.description} onChange={(e) => setEvForm({ ...evForm, description: e.target.value })} maxLength={1000} rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.dateLabel}</label>
                    <input type="datetime-local" required value={evForm.date} onChange={(e) => setEvForm({ ...evForm, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.locationLabel}</label>
                    <input type="text" required value={evForm.location} onChange={(e) => setEvForm({ ...evForm, location: e.target.value })} maxLength={200}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.typeLabel}</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setEvForm({ ...evForm, type: "free" })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${evForm.type === "free" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/[0.04] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
                      {t.events.free}
                    </button>
                    <button type="button" onClick={() => setEvForm({ ...evForm, type: "paid" })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${evForm.type === "paid" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-white/[0.04] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
                      {t.events.paid}
                    </button>
                  </div>
                </div>
                {evForm.type === "paid" && (
                  <>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.priceLabel}</label>
                      <input type="text" required value={evForm.price} onChange={(e) => setEvForm({ ...evForm, price: e.target.value })} maxLength={100}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.qrLabel}</label>
                      <input type="url" value={evForm.qrImage} onChange={(e) => setEvForm({ ...evForm, qrImage: e.target.value })} placeholder="https://..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <button type="submit" disabled={evSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {evSubmitting ? "..." : t.events.submit}
                  </button>
                  <button type="button" onClick={() => setShowEventForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] transition">
                    {t.events.cancel}
                  </button>
                </div>
              </form>
            )}

            {evLoading ? (
              <div className="text-center py-20 text-[var(--text-secondary)]">...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{t.events.empty}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {events.map((ev) => {
                  const evVotes = votes[ev.id] || [];
                  const hasVoted = evVotes.some((v) => v.user_id === currentUserId);
                  const myVote = evVotes.find((v) => v.user_id === currentUserId);
                  const isCreator = ev.user_id === currentUserId;
                  const isExpanded = expandedEvent === ev.id;
                  void myVote;

                  return (
                    <div key={ev.id} className="group rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all duration-300 flex flex-col overflow-hidden">
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            ev.type === "free" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
                          }`}>
                            {ev.type === "free" ? t.events.free : `${t.events.paid} - ${ev.price}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                            ev.status === "upcoming" ? "bg-blue-500/15 text-blue-400"
                            : ev.status === "ongoing" ? "bg-green-500/15 text-green-400"
                            : "bg-gray-500/15 text-gray-400"
                          }`}>
                            {ev.status === "upcoming" ? t.events.upcoming : ev.status === "ongoing" ? t.events.ongoing : t.events.completed}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold mb-2 group-hover:text-blue-400 transition line-clamp-2">{ev.concept_name}</h3>
                        {ev.description && <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-3 leading-relaxed">{ev.description}</p>}
                        <div className="space-y-2 text-[11px] text-[var(--text-secondary)] mb-3">
                          <div className="flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {new Date(ev.date).toLocaleString("vi", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span className="truncate">{ev.location}</span>
                          </div>
                        </div>
                        <button onClick={() => setExpandedEvent(isExpanded ? null : ev.id)}
                          className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mt-auto">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {evVotes.length} {t.events.members}
                          {evVotes.length > 0 && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                          )}
                        </button>
                      </div>
                      {isExpanded && evVotes.length > 0 && (
                        <div className="px-5 pb-3 border-t border-white/[0.06] pt-3 animate-fade-in">
                          <div className="flex flex-wrap gap-1.5">
                            {evVotes.map((v) => (
                              <div key={v.id} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-[var(--border)]">
                                {v.user_image ? (
                                  <img src={v.user_image} alt="" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[7px] font-bold text-amber-400">
                                    {v.user_name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="text-[10px]">{v.user_name}</span>
                                {ev.type === "paid" && (
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    v.admin_approved ? "bg-green-400" : v.payment_confirmed ? "bg-amber-400 animate-pulse" : "bg-gray-500"
                                  }`} title={v.admin_approved ? t.events.approved : v.payment_confirmed ? t.events.pendingApproval : t.events.unpaid} />
                                )}
                                {isCreator && ev.type === "paid" && v.payment_confirmed && !v.admin_approved && (
                                  <button onClick={() => adminApprove(v.id, ev.id)} className="text-[9px] text-green-400 hover:underline">{t.events.approve}</button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {currentUserId && !hasVoted && (
                        <div className="px-5 pb-4 pt-1">
                          <button onClick={() => handleVote(ev)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-semibold hover:opacity-90 transition">
                            {t.events.vote}
                          </button>
                        </div>
                      )}
                      {hasVoted && (
                        <div className="px-5 pb-4 pt-1">
                          <span className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            {t.jobs.applied}
                          </span>
                        </div>
                      )}
                      {showQr === ev.id && ev.type === "paid" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" onClick={() => setShowQr(null)}>
                          <div className="bg-[var(--bg-primary)] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full mx-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-bold mb-2 text-center">{t.events.paymentTitle}</h3>
                            <p className="text-sm text-[var(--text-secondary)] text-center mb-4">{t.events.paymentDesc} {ev.price}</p>
                            {ev.qr_image ? (
                              <img src={ev.qr_image} alt="QR" className="w-48 h-48 mx-auto rounded-xl mb-4 bg-white p-2" />
                            ) : (
                              <div className="w-48 h-48 mx-auto rounded-xl mb-4 bg-white/[0.04] flex items-center justify-center text-[var(--text-secondary)]">
                                <p className="text-xs text-center px-4">{t.events.noQr}</p>
                              </div>
                            )}
                            <div className="flex gap-3">
                              <button onClick={async () => { await submitVote(ev.id); const vs = await fetch(`/api/events/vote?eventId=${ev.id}`).then(r => r.json()); const mine = vs.find((v: Vote) => v.user_id === currentUserId); if (mine) confirmPayment(mine.id, ev.id); }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black text-sm font-semibold hover:opacity-90 transition">
                                {t.events.confirmPayment}
                              </button>
                              <button onClick={() => setShowQr(null)}
                                className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] transition">
                                {t.events.close}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ==================== JOBS TAB ==================== */}
        {tab === "jobs" && (
          <>
            {showJobForm && (
              <form onSubmit={handleJobSubmit} className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] space-y-4 animate-fade-in max-w-3xl">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.titleLabel}</label>
                  <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} maxLength={200}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.dateLabel}</label>
                    <input type="datetime-local" required value={jobForm.date} onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.locationLabel}</label>
                    <input type="text" required value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} maxLength={200}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.priceLabel}</label>
                  <input type="text" required value={jobForm.price} onChange={(e) => setJobForm({ ...jobForm, price: e.target.value })} maxLength={100} placeholder="VD: 500k, 1tr, Thỏa thuận"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.jobs.noteLabel}</label>
                  <textarea value={jobForm.note} onChange={(e) => setJobForm({ ...jobForm, note: e.target.value })} maxLength={500} rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={jobSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {jobSubmitting ? "..." : t.jobs.submit}
                  </button>
                  <button type="button" onClick={() => setShowJobForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] transition">
                    {t.jobs.cancel}
                  </button>
                </div>
              </form>
            )}

            {jobLoading ? (
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
                        {jobApps.length > 0 && (
                          <button onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                            className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mt-auto">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            {t.jobs.applicants} ({jobApps.length})
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                        )}
                      </div>
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
          </>
        )}
      </main>
    </>
  );
}
