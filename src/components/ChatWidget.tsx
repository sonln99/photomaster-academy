"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  user_image: string | null;
  message: string;
  created_at: string;
}

interface UserProfile {
  user_id: string;
  role: string;
  camera_bodies: string[];
  lenses: string[];
  birth_year: number | null;
}

const ROLE_BADGE_COLORS: Record<string, string> = {
  master: "bg-yellow-400 text-yellow-900",
  admin: "bg-red-400 text-red-900",
  photo: "bg-blue-400 text-blue-900",
  makeup: "bg-pink-400 text-pink-900",
  model: "bg-purple-400 text-purple-900",
};

const ROLE_LABELS: Record<string, string> = {
  master: "Master",
  admin: "Admin",
  photo: "Photo",
  makeup: "Makeup",
  model: "Model",
};

function timeAgo(date: string, t: { just: string; minAgo: string; hourAgo: string }) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.just;
  if (mins < 60) return `${mins} ${t.minAgo}`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} ${t.hourAgo}`;
}

function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setMessages(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("chat-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
  }, []);

  return { messages, addMessage };
}

function useProfiles(messages: ChatMessage[]) {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const fetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const userIds = [...new Set(messages.map((m) => m.user_id))];
    const toFetch = userIds.filter((id) => !fetchedRef.current.has(id));
    if (toFetch.length === 0) return;

    toFetch.forEach((userId) => {
      fetchedRef.current.add(userId);
      fetch(`/api/profile?userId=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.user_id) {
            setProfiles((prev) => ({ ...prev, [d.user_id]: d }));
          }
        })
        .catch(() => {});
    });
  }, [messages]);

  return profiles;
}

export function ChatPanel({ isDesktop, onClose, currentUserId, userName, userImage, embedded }: {
  isDesktop: boolean;
  onClose?: () => void;
  currentUserId: string;
  userName: string;
  userImage: string | null;
  embedded?: boolean;
}) {
  const { t } = useLanguage();
  const { messages, addMessage } = useChatMessages();
  const profiles = useProfiles(messages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !currentUserId || sending) return;
    setSending(true);
    const msg = input.trim();
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, userName, userImage, message: msg }),
      });
      const saved = await res.json();
      if (saved?.id) addMessage(saved);
    } catch {} finally { setSending(false); }
  }

  return (
    <div className={`flex flex-col bg-[var(--bg-primary)] ${
      embedded
        ? "h-full overflow-hidden"
        : isDesktop
          ? "fixed top-0 right-0 w-[320px] h-screen border-l border-white/[0.06] z-40"
          : "fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.08] glass shadow-2xl shadow-black/50 animate-fade-in-up overflow-hidden"
    }`} style={!isDesktop && !embedded ? { height: "min(500px, calc(100vh - 8rem))" } : {}}>
      {/* Header */}
      <div className={`px-4 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0 ${isDesktop && !embedded ? "pt-[72px]" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t.chat.title}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-[var(--text-secondary)]">{t.chat.online}</span>
            </div>
          </div>
        </div>
        {!isDesktop && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{t.chat.empty}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUserId;
            const profile = profiles[msg.user_id];
            const role = profile?.role;
            const hasBodies = profile?.camera_bodies?.length && profile.camera_bodies.some(Boolean);
            const hasLenses = profile?.lenses?.length && profile.lenses.some(Boolean);

            return (
              <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/[0.06] mt-0.5">
                  {msg.user_image ? (
                    <img src={msg.user_image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
                      {(msg.user_name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-0.5 px-1 flex-wrap">
                      <span className="text-[10px] text-[var(--text-secondary)]">{msg.user_name}</span>
                      {role && role !== "guest" && ROLE_BADGE_COLORS[role] && (
                        <span className={`px-1.5 py-px rounded text-[8px] font-bold ${ROLE_BADGE_COLORS[role]}`}>
                          {ROLE_LABELS[role]}
                        </span>
                      )}
                      {profile?.birth_year && (
                        <span className="text-[8px] text-[var(--text-secondary)] opacity-50">{profile.birth_year}</span>
                      )}
                    </div>
                  )}
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                    isMe
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-br-md"
                      : "bg-white/[0.06] text-[var(--text-primary)] rounded-bl-md"
                  }`}>
                    {msg.message}
                  </div>
                  {!isMe && role === "photo" && (hasBodies || hasLenses) && (
                    <div className="px-1 mt-0.5 flex flex-wrap gap-1">
                      {hasBodies && profile.camera_bodies.filter(Boolean).map((b, i) => (
                        <span key={`b${i}`} className="text-[8px] px-1.5 py-px rounded bg-blue-500/10 text-blue-400">{b}</span>
                      ))}
                      {hasLenses && profile.lenses.filter(Boolean).map((l, i) => (
                        <span key={`l${i}`} className="text-[8px] px-1.5 py-px rounded bg-cyan-500/10 text-cyan-400">{l}</span>
                      ))}
                    </div>
                  )}
                  <p className={`text-[9px] text-[var(--text-secondary)] mt-0.5 px-1 opacity-60 ${isMe ? "text-right" : ""}`}>
                    {timeAgo(msg.created_at, t.chat)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.06] shrink-0">
        {currentUserId ? (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chat.placeholder} maxLength={500}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-amber-500/50 transition" />
            <button type="submit" disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black flex items-center justify-center hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-[var(--text-secondary)]">{t.chat.loginRequired}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUserId = session?.user
    ? (session.user as Record<string, unknown>).id as string || session.user.name || ""
    : "";
  const userName = session?.user?.name || "Anonymous";
  const userImage = session?.user?.image || null;

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="hidden 2xl:block">
        <ChatPanel isDesktop currentUserId={currentUserId} userName={userName} userImage={userImage} />
      </div>
      <div className="2xl:hidden">
        <button onClick={handleMobileToggle}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
        {mobileOpen && (
          <ChatPanel isDesktop={false} onClose={() => setMobileOpen(false)} currentUserId={currentUserId} userName={userName} userImage={userImage} />
        )}
      </div>
    </>
  );
}
