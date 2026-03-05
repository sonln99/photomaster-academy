"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/courses/beginner", label: "Cơ Bản", color: "var(--accent-beginner)" },
  { href: "/courses/professional", label: "Chuyên Nghiệp", color: "var(--accent-professional)" },
  { href: "/courses/pro", label: "Bậc Thầy", color: "var(--accent-pro)" },
];

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none">PhotoMaster</span>
            <span className="text-[10px] text-[var(--text-secondary)] tracking-wider uppercase leading-none mt-0.5">Academy</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}

          <div className="w-px h-6 bg-[var(--border)] mx-2" />

          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full ring-2 ring-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black ring-2 ring-white/10">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-sm font-medium">{session.user?.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[var(--text-secondary)] transition-transform ${showMenu ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-14 w-52 rounded-xl border border-white/[0.08] glass shadow-2xl shadow-black/50 py-1.5 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-white/[0.06]">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/history"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Lịch sử học tập
                      </Link>
                      <Link
                        href="/certificates"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 15l-2 5l2-2 2 2-2-5z"/><circle cx="12" cy="9" r="6"/>
                        </svg>
                        Chứng chỉ
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.06] pt-1">
                      <button
                        onClick={() => { signOut(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("facebook")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-medium hover:bg-[#166FE5] transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Đăng nhập
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.04] transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.06] pt-2 mt-2">
              {session ? (
                <>
                  <Link href="/history" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/[0.04] transition">
                    Lịch sử học tập
                  </Link>
                  <Link href="/certificates" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/[0.04] transition">
                    Chứng chỉ
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("facebook")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1877F2] text-white text-sm font-medium hover:bg-[#166FE5] transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Đăng nhập với Facebook
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
