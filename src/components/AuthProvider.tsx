"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { setUserId, loadProgressFromCloud, uploadProgressToCloud } from "@/lib/progress";
import { ChatPanel } from "@/components/ChatWidget";
import { useLanguage } from "@/lib/LanguageContext";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";

function SyncProgress() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const id = (session.user as Record<string, unknown>).id as string || session.user.name || "anonymous";
      setUserId(id);

      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: session.user.name,
          image: session.user.image,
          provider: (session.user as Record<string, unknown>).provider as string || "google",
        }),
      }).catch(() => {});

      loadProgressFromCloud().then(() => uploadProgressToCloud());
    } else {
      setUserId(null);
    }
  }, [session]);

  return null;
}

interface LeaderboardUser {
  id: string;
  name: string;
  image: string | null;
  total_lessons_completed: number;
}

function LeftSidebar() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [userRole, setUserRole] = useState<string | null>(null);

  const currentUserId = session?.user
    ? (session.user as Record<string, unknown>).id as string || session.user.name || ""
    : "";

  useEffect(() => {
    if (!currentUserId) return;
    fetch(`/api/profile?userId=${currentUserId}`)
      .then((r) => r.json())
      .then((d) => { if (d?.role) setUserRole(d.role); })
      .catch(() => {});
  }, [currentUserId]);

  const ROLE_LABELS: Record<string, string> = {
    master: "Master", admin: "Admin", photo: "Photographer", makeup: "Makeup", model: "Model", guest: "Guest",
  };

  const navItems = [
    { href: "/", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", label: t.nav.home },
    { href: "/training", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: t.nav.training, sub: [
      { href: "/courses/beginner", label: t.nav.beginner },
      { href: "/courses/professional", label: t.nav.professional },
      { href: "/courses/pro", label: t.nav.pro },
    ]},
    { href: "/leaderboard", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: t.leaderboard.title },
    { href: "/community", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: t.nav.community },
    { href: "/news", icon: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2", label: t.nav.news },
  ];

  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-r border-white/[0.06] px-3 py-4 scrollbar-thin">
      {/* User card */}
      {session ? (
        <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full ring-2 ring-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                {session.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{session.user?.name}</p>
              {userRole && userRole !== "guest" && (
                <span className="text-[10px] text-amber-400 font-medium">{ROLE_LABELS[userRole] || userRole}</span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            <Link href="/profile" className="flex-1 text-center px-2 py-1.5 rounded-lg text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] border border-[var(--border)] transition">
              {t.nav.profile}
            </Link>
            <Link href="/history" className="flex-1 text-center px-2 py-1.5 rounded-lg text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] border border-[var(--border)] transition">
              {t.nav.history}
            </Link>
          </div>
        </div>
      ) : null}

      {/* Nav menu */}
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => (
          <div key={item.href}>
            <div className="flex items-center">
              <Link href={item.href}
                className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                {item.label}
              </Link>
              {item.sub && (
                <button onClick={() => setExpandedNav(expandedNav === item.href ? null : item.href)}
                  className="p-2 rounded-lg hover:bg-white/[0.04] text-[var(--text-secondary)] transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`transition-transform ${expandedNav === item.href ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              )}
            </div>
            {item.sub && expandedNav === item.href && (
              <div className="ml-9 space-y-0.5 mt-0.5">
                {item.sub.map((sub) => (
                  <Link key={sub.href} href={sub.href}
                    className="block px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition">
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      {session && (
        <div className="pt-3 border-t border-white/[0.06] mt-3 space-y-0.5">
          <Link href="/certificates"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15l-2 5l2-2 2 2-2-5z"/><circle cx="12" cy="9" r="6"/>
            </svg>
            {t.nav.certificates}
          </Link>
          <button onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {t.nav.logout}
          </button>
        </div>
      )}
    </aside>
  );
}

function RightSidebar() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  const currentUserId = session?.user
    ? (session.user as Record<string, unknown>).id as string || session.user.name || ""
    : "";
  const userName = session?.user?.name || "Anonymous";
  const userImage = session?.user?.image || null;

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setLeaders(d.slice(0, 8)); })
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden xl:flex flex-col w-[300px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 border-l border-white/[0.06]">
      {/* Online / Leaderboard */}
      <div className="px-3 py-3 border-b border-white/[0.06] overflow-y-auto" style={{ maxHeight: "40%" }}>
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t.leaderboard.title}</h3>
          <Link href="/leaderboard" className="text-[10px] text-amber-400 hover:underline">{t.home.viewAllNews}</Link>
        </div>
        <div className="space-y-0.5">
          {leaders.map((user, i) => (
            <div key={user.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition">
              <div className="relative shrink-0">
                {user.image ? (
                  <img src={user.image} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--bg-primary)]" />
              </div>
              <span className="text-xs flex-1 truncate">{user.name}</span>
              <span className="text-[9px] text-[var(--text-secondary)]">#{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatPanel embedded isDesktop={false} currentUserId={currentUserId} userName={userName} userImage={userImage} />
      </div>
    </aside>
  );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncProgress />
      <Header />
      <div className="flex pt-14">
        <LeftSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {children}
        </main>
        <RightSidebar />
      </div>
    </SessionProvider>
  );
}
