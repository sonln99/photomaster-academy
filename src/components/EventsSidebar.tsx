"use client";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Event {
  id: string;
  concept_name: string;
  description: string | null;
  date: string;
  location: string;
  type: "free" | "paid";
  price: string | null;
  status: string;
  created_at: string;
}

function EventsPanel({ isDesktop, onClose }: { isDesktop: boolean; onClose?: () => void }) {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEvents(d.filter((e: Event) => e.status === "upcoming").slice(0, 20)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("events-sidebar-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload) => {
        const ev = payload.new as Event;
        if (ev.status === "upcoming") {
          setEvents((prev) => prev.some((e) => e.id === ev.id) ? prev : [ev, ...prev]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className={`flex flex-col bg-[var(--bg-primary)] ${
      isDesktop
        ? "fixed top-0 left-0 w-[270px] h-screen border-r border-white/[0.06] z-40"
        : "fixed bottom-24 left-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.08] glass shadow-2xl shadow-black/50 animate-fade-in-up overflow-hidden"
    }`} style={!isDesktop ? { height: "min(500px, calc(100vh - 8rem))" } : {}}>
      {/* Header */}
      <div className={`px-4 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0 ${isDesktop ? "pt-[72px]" : ""}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t.home.latestEvents}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] text-[var(--text-secondary)]">{t.events.upcoming}</span>
            </div>
          </div>
        </div>
        {!isDesktop && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{t.events.empty}</p>
          </div>
        ) : (
          events.map((ev) => (
            <Link href="/events" key={ev.id}
              className="group block p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`px-1.5 py-px rounded-full text-[8px] font-semibold ${
                  ev.type === "free" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
                }`}>
                  {ev.type === "free" ? t.events.free : `${t.events.paid} ${ev.price}`}
                </span>
                <span className="px-1.5 py-px rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-medium">{t.events.upcoming}</span>
              </div>
              <h4 className="text-xs font-semibold mb-1 truncate group-hover:text-blue-400 transition">{ev.concept_name}</h4>
              {ev.description && (
                <p className="text-[10px] text-[var(--text-secondary)] mb-1.5 line-clamp-1">{ev.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {new Date(ev.date).toLocaleDateString("vi", { day: "2-digit", month: "2-digit" })}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="truncate max-w-[100px]">{ev.location}</span>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* View all - bottom */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
        <Link href="/events" className="flex items-center justify-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
          {t.home.viewAllEvents}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>
    </div>
  );
}

export default function EventsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="hidden 2xl:block">
        <EventsPanel isDesktop />
      </div>
      <div className="2xl:hidden">
        <button onClick={handleMobileToggle}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          )}
        </button>
        {mobileOpen && (
          <EventsSidebar_Mobile onClose={() => setMobileOpen(false)} />
        )}
      </div>
    </>
  );
}

function EventsSidebar_Mobile({ onClose }: { onClose: () => void }) {
  return <EventsPanel isDesktop={false} onClose={onClose} />;
}
