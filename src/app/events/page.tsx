"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

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

export default function EventsPage() {
  const { user: authUser } = useAuth();
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [form, setForm] = useState({
    conceptName: "", description: "", date: "", location: "", type: "free" as "free" | "paid", price: "", qrImage: "",
  });

  const currentUserId = authUser?.id || "";

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEvents(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !currentUserId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, ...form }),
      });
      const saved = await res.json();
      if (saved?.id) {
        setEvents((prev) => [saved, ...prev]);
        setForm({ conceptName: "", description: "", date: "", location: "", type: "free", price: "", qrImage: "" });
        setShowForm(false);
      }
    } catch {}
    setSubmitting(false);
  }

  async function handleVote(event: Event) {
    if (!currentUserId) return;
    if (event.type === "paid") {
      setShowQr(event.id);
      return;
    }
    await submitVote(event.id);
  }

  async function submitVote(eventId: string) {
    try {
      await fetch("/api/events/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId, userId: currentUserId,
          userName: authUser?.name || "Anonymous",
          userImage: authUser?.image || null,
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

  return (
    <>
      
      <main className="pt-4 pb-16 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.events.title}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t.events.desc}</p>
          </div>
          {currentUserId && (
            <button onClick={() => setShowForm(!showForm)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/25 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t.events.create}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] space-y-4 animate-fade-in max-w-3xl">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.conceptLabel}</label>
              <input type="text" required value={form.conceptName} onChange={(e) => setForm({ ...form, conceptName: e.target.value })} maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.descriptionLabel}</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.dateLabel}</label>
                <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.locationLabel}</label>
                <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.typeLabel}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({ ...form, type: "free" })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${form.type === "free" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/[0.04] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
                  {t.events.free}
                </button>
                <button type="button" onClick={() => setForm({ ...form, type: "paid" })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${form.type === "paid" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-white/[0.04] border border-[var(--border)] text-[var(--text-secondary)]"}`}>
                  {t.events.paid}
                </button>
              </div>
            </div>
            {form.type === "paid" && (
              <>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.priceLabel}</label>
                  <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} maxLength={100}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">{t.events.qrLabel}</label>
                  <input type="url" value={form.qrImage} onChange={(e) => setForm({ ...form, qrImage: e.target.value })} placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm focus:outline-none focus:border-amber-500/50 transition" />
                </div>
              </>
            )}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "..." : t.events.submit}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-white/[0.04] transition">
                {t.events.cancel}
              </button>
            </div>
          </form>
        )}

        {loading ? (
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

              return (
                <div key={ev.id} className="group rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Type + Status badges */}
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

                    {/* Members count + expand */}
                    <button onClick={() => setExpandedEvent(isExpanded ? null : ev.id)}
                      className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mt-auto">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      {evVotes.length} {t.events.members}
                      {evVotes.length > 0 && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Expanded voters */}
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
                              <button onClick={() => adminApprove(v.id, ev.id)}
                                className="text-[9px] text-green-400 hover:underline">
                                {t.events.approve}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vote button */}
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

                  {/* QR Code Modal */}
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
      </main>
    </>
  );
}
