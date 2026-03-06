"use client";
import { useEffect, useState } from "react";
import { setUserId, loadProgressFromCloud, uploadProgressToCloud, getCourseProgress } from "@/lib/progress";
import { useCourses } from "@/hooks/useCourses";
import { ChatPanel } from "@/components/ChatWidget";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth, AuthProvider as SupabaseAuthProvider } from "@/lib/auth";
import Link from "next/link";
import Header from "@/components/Header";

function SyncProgress() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserId(user.id);

      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          image: user.image,
          provider: user.provider,
        }),
      }).catch(() => {});

      loadProgressFromCloud().then(() => uploadProgressToCloud());
    } else {
      setUserId(null);
    }
  }, [user]);

  return null;
}

interface LeaderboardUser {
  id: string;
  name: string;
  image: string | null;
  total_lessons_completed: number;
}

interface UserProfile {
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
const ROLE_LABELS_RIGHT: Record<string, string> = {
  master: "Master", admin: "Admin", photo: "Photographer", makeup: "Makeup", model: "Model",
};

function ProgressRadar() {
  const { courses } = useCourses();
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    if (courses.length === 0) return;
    setProgress(courses.map((c) => getCourseProgress(c.id, c.lessons.length)));
  }, [courses]);

  if (courses.length === 0 || progress.length === 0) return null;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const n = courses.length;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];

  return (
    <Link href="/history" className="block mb-3 px-1">
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2 hover:bg-white/[0.04] transition cursor-pointer">
        <div className="flex items-center justify-center">
          <svg className="w-full" viewBox={`0 0 ${size} ${size}`}>
            {gridLevels.map((level) => (
              <polygon
                key={level}
                points={Array.from({ length: n }, (_, i) => {
                  const p = getPoint(i, level);
                  return `${p.x},${p.y}`;
                }).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: n }, (_, i) => {
              const p = getPoint(i, 100);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
            })}
            <polygon
              points={progress.map((v, i) => {
                const p = getPoint(i, Math.max(v, 2));
                return `${p.x},${p.y}`;
              }).join(" ")}
              fill="rgba(251,191,36,0.15)"
              stroke="rgba(251,191,36,0.8)"
              strokeWidth="1.5"
            />
            {progress.map((v, i) => {
              const p = getPoint(i, Math.max(v, 2));
              return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={courses[i]?.color || "#f59e0b"} />;
            })}
            {courses.map((c, i) => {
              const p = getPoint(i, 120);
              return (
                <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={c.color} fontSize="8" fontWeight="600">
                  {progress[i]}%
                </text>
              );
            })}
          </svg>
        </div>
        <div className="flex justify-center gap-3 mt-1">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[8px] text-[var(--text-secondary)]">{c.title.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function LeftSidebar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.id) { setProfile(null); return; }
    fetch(`/api/profile?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => { if (d?.user_id) setProfile(d); })
      .catch(() => {});
  }, [user?.id]);

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
    { href: "/trends", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: t.trends.title },
  ];

  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-r border-white/[0.06] px-3 py-4 scrollbar-thin">
      {/* User card */}
      {user ? (
        <div className="mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            {user.image ? (
              <img src={user.image} alt="" className="w-10 h-10 rounded-full ring-2 ring-white/10" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              {profile?.role && profile.role !== "guest" && ROLE_BADGE_COLORS[profile.role] && (
                <span className={`inline-block px-1.5 py-px rounded text-[8px] font-bold mt-0.5 ${ROLE_BADGE_COLORS[profile.role]}`}>
                  {ROLE_LABELS_RIGHT[profile.role]}
                </span>
              )}
            </div>
            <Link href="/profile" className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition" title="Edit profile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </Link>
          </div>
          {profile && (
            <div className="space-y-1.5">
              {profile.birth_year && (
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {profile.birth_year}
                </div>
              )}
              {profile.camera_bodies?.filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.camera_bodies.filter(Boolean).map((b, i) => (
                    <span key={`b${i}`} className="text-[9px] px-1.5 py-px rounded bg-blue-500/10 text-blue-400">{b}</span>
                  ))}
                </div>
              )}
              {profile.lenses?.filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.lenses.filter(Boolean).map((l, i) => (
                    <span key={`l${i}`} className="text-[9px] px-1.5 py-px rounded bg-cyan-500/10 text-cyan-400">{l}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Learning Progress Radar */}
      {user && <ProgressRadar />}

      {/* Separator */}
      <div className="flex items-center gap-2 px-2 mb-2 mt-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Menu</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

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
      {user && (
        <div className="pt-3 mt-3 space-y-0.5">
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Account</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </div>
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
  const { user } = useAuth();
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  const currentUserId = user?.id || "";
  const userName = user?.name || "Anonymous";
  const userImage = user?.image || null;

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
          {leaders.map((u, i) => (
            <div key={u.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition">
              <div className="relative shrink-0">
                {u.image ? (
                  <img src={u.image} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400">
                    {(u.name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--bg-primary)]" />
              </div>
              <span className="text-xs flex-1 truncate">{u.name}</span>
              <span className="text-[9px] text-[var(--text-secondary)]">#{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat separator */}
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Chat
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatPanel embedded isDesktop={false} currentUserId={currentUserId} userName={userName} userImage={userImage} />
      </div>
    </aside>
  );
}

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <SyncProgress />
      <Header />
      <div className="flex pt-14">
        <LeftSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {children}
        </main>
        <RightSidebar />
      </div>
    </SupabaseAuthProvider>
  );
}
