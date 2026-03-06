"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface TrendItem {
  id: string;
  category: string;
  hashtag: string;
  post_count: number;
  view_count: number;
  trend_score: number;
  region: string;
  crawled_at: string;
}

function formatCount(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const CATEGORY_COLORS: Record<string, string> = {
  photography: "#3b82f6",
  videography: "#8b5cf6",
  viral_tips: "#f43f5e",
  trending: "#f59e0b",
};

const CATEGORY_ICONS: Record<string, string> = {
  photography: "M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  videography: "M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z",
  viral_tips: "M13 10V3L4 14h7v7l9-11h-7z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
};

export default function TrendsPage() {
  const { t } = useLanguage();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trends?limit=200")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTrends(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", "trending", "photography", "videography", "viral_tips"];
  const filtered = activeCategory === "all" ? trends : trends.filter((t) => t.category === activeCategory);

  const categoryLabel = (cat: string) => {
    if (cat === "all") return t.trends.all;
    return t.trends[cat as keyof typeof t.trends] || cat;
  };

  return (
    <main className="pt-24 max-w-5xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in">
        <Link href="/" className="hover:text-[var(--text-primary)] transition">{t.nav.home}</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-[var(--text-primary)]">{t.trends.title}</span>
      </div>

      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          {t.trends.title}
        </h1>
        <p className="text-[var(--text-secondary)]">{t.trends.subtitle}</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const color = CATEGORY_COLORS[cat] || "#f59e0b";
          const isActive = activeCategory === cat;
          const count = cat === "all" ? trends.length : trends.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "text-black shadow-lg"
                  : "bg-white/[0.04] text-[var(--text-secondary)] hover:bg-white/[0.08] border border-[var(--border)]"
              }`}
              style={isActive ? { backgroundColor: color } : {}}
            >
              {cat !== "all" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={CATEGORY_ICONS[cat]}/>
                </svg>
              )}
              {categoryLabel(cat)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/20" : "bg-white/[0.06]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trends grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <p className="text-[var(--text-secondary)]">{t.trends.noData}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((trend, i) => {
            const color = CATEGORY_COLORS[trend.category] || "#f59e0b";
            return (
              <a
                key={trend.id}
                href={`https://www.tiktok.com/tag/${encodeURIComponent(trend.hashtag)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: `${color}15`, color }}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate group-hover:text-white transition">#{trend.hashtag}</h3>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" className="shrink-0 opacity-0 group-hover:opacity-100 transition"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                      {trend.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          {formatCount(trend.view_count)} {t.trends.views}
                        </span>
                      )}
                      {trend.post_count > 0 && (
                        <span>{formatCount(trend.post_count)} {t.trends.posts}</span>
                      )}
                    </div>
                  </div>
                  {trend.trend_score > 0 && (
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-bold" style={{ color }}>{trend.trend_score.toFixed(0)}</div>
                      <div className="text-[9px] text-[var(--text-secondary)]">{t.trends.score}</div>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}15`, color }}>
                    {categoryLabel(trend.category)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
