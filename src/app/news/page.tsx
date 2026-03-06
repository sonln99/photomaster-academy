"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string;
  image_url: string | null;
  published_at: string;
  created_at: string;
}

export default function NewsPage() {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setNews(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      
      <main className="pt-4 pb-16 px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.news.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{t.news.desc}</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden animate-pulse">
                <div className="h-40 bg-white/[0.04]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                  <div className="h-3 bg-white/[0.04] rounded w-full" />
                  <div className="h-3 bg-white/[0.04] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/>
              </svg>
            </div>
            <p className="text-[var(--text-secondary)]">{t.news.empty}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {item.image_url ? (
                  <div className="h-40 overflow-hidden bg-white/[0.04]">
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                      <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/>
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold">{item.source}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {new Date(item.published_at).toLocaleDateString("vi", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 group-hover:text-amber-400 transition">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-400 font-medium">
                    {t.news.readMore}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
