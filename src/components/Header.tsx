"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">PhotoMaster</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/courses/beginner" className="text-[var(--text-secondary)] hover:text-[var(--accent-beginner)] transition">Beginner</Link>
          <Link href="/courses/professional" className="text-[var(--text-secondary)] hover:text-[var(--accent-professional)] transition">Professional</Link>
          <Link href="/courses/pro" className="text-[var(--text-secondary)] hover:text-[var(--accent-pro)] transition">Pro</Link>
        </nav>
      </div>
    </header>
  );
}
