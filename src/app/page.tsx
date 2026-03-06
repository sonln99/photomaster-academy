"use client";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface TikTokVideo {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  cover_url: string;
  share_url: string;
  tiktok_username: string;
  author_name: string;
  author_image: string | null;
  play_count: number;
}

interface TikTokMember {
  tiktok_username: string;
  name: string | null;
  image: string | null;
  follower_count: number;
  heart_count: number;
}

interface CommunityItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "event" | "job";
  status: string;
  price: string | null;
  created_at: string;
}

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function Home() {
  const { t } = useLanguage();
  const [allVideos, setAllVideos] = useState<TikTokVideo[]>([]);
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [members, setMembers] = useState<TikTokMember[]>([]);
  const [community, setCommunity] = useState<CommunityItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 1000;
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tiktok-videos")
      .then((r) => r.json())
      .then((d) => {
        if (d.videos) {
          setAllVideos(d.videos);
          setVideos(d.videos.slice(0, PAGE_SIZE));
          setHasMore(d.videos.length > PAGE_SIZE);
        }
        if (d.members) setMembers(d.members);
      })
      .catch(() => {});
    Promise.all([
      fetch("/api/events").then((r) => r.json()).catch(() => []),
      fetch("/api/jobs").then((r) => r.json()).catch(() => []),
    ]).then(([events, jobs]) => {
      const items: CommunityItem[] = [
        ...(Array.isArray(events) ? events.map((e: Record<string, unknown>) => ({
          id: e.id as string, title: e.concept_name as string, date: e.date as string,
          location: e.location as string, type: "event" as const, status: e.status as string,
          price: (e.type === "paid" ? e.price : null) as string | null, created_at: e.created_at as string,
        })) : []),
        ...(Array.isArray(jobs) ? jobs.map((j: Record<string, unknown>) => ({
          id: j.id as string, title: j.title as string, date: j.date as string,
          location: j.location as string, type: "job" as const, status: j.status as string,
          price: j.price as string | null, created_at: j.created_at as string,
        })) : []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      setCommunity(items);
    });
  }, []);

  const loadMore = useCallback(() => {
    setVideos((prev) => {
      const next = allVideos.slice(0, prev.length + PAGE_SIZE);
      setHasMore(next.length < allVideos.length);
      return next;
    });
  }, [allVideos]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const rankedMembers = [...members].sort((a, b) =>
    (b.follower_count - a.follower_count) || (b.heart_count - a.heart_count)
  );

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Community - Events + Jobs table */}
      {community.length > 0 && (
        <section className="border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2 className="font-bold text-sm">{t.nav.community}</h2>
            </div>
            <Link href="/community" className="text-[10px] text-amber-400 hover:underline">{t.home.viewAllNews}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[var(--text-secondary)]">
                  <th className="text-left px-4 py-2.5 font-medium w-20">Type</th>
                  <th className="text-left px-2 py-2.5 font-medium">{t.jobs.titleLabel}</th>
                  <th className="text-left px-2 py-2.5 font-medium hidden sm:table-cell">{t.events.locationLabel}</th>
                  <th className="text-left px-2 py-2.5 font-medium hidden sm:table-cell">{t.events.dateLabel}</th>
                </tr>
              </thead>
              <tbody>
                {community.map((item) => (
                  <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition cursor-pointer"
                    onClick={() => window.location.href = `/community?tab=${item.type === "event" ? "events" : "jobs"}`}>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold whitespace-nowrap ${
                        item.type === "event" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400"
                      }`}>
                        {item.type === "event" ? t.events.title.split(" ")[0] : t.jobs.title.split(" ")[0]}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="line-clamp-1 font-medium">{item.title}</span>
                      {item.price && <span className="text-[9px] text-amber-400 ml-1">{item.price}</span>}
                    </td>
                    <td className="px-2 py-2.5 text-[var(--text-secondary)] hidden sm:table-cell">
                      <span className="line-clamp-1">{item.location}</span>
                    </td>
                    <td className="px-2 py-2.5 text-[var(--text-secondary)] hidden sm:table-cell whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("vi", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Two-column layout: Leaderboard + Videos */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Leaderboard sidebar */}
        {rankedMembers.length > 0 && (
          <section className="lg:w-80 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ec4899">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.21z"/>
                </svg>
              </div>
              <h2 className="font-bold text-sm">{t.leaderboard.title}</h2>
              <Link href="/leaderboard" className="text-[10px] text-pink-400 hover:underline ml-auto">Xem t&#7845;t c&#7843;</Link>
            </div>
            <div className="border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden sticky" style={{ top: "3.5rem" }}>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 3.5rem)" }}>
                {rankedMembers.map((m, i) => (
                  <a
                    key={m.tiktok_username}
                    href={`https://www.tiktok.com/@${m.tiktok_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition border-b border-white/[0.04] last:border-0"
                  >
                    {/* Rank */}
                    <div className="w-6 text-center shrink-0">
                      {i < 3 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ) : (
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium">{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/[0.06]">
                      {m.image ? (
                        <img src={m.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-500 text-[10px] font-bold text-white">
                          {(m.name || m.tiktok_username).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{m.name || m.tiktok_username}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">@{m.tiktok_username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 shrink-0 text-[10px]">
                      <div className="text-center">
                        <div className="font-semibold text-pink-400">{formatCount(m.follower_count)}</div>
                        <div className="text-[var(--text-secondary)]">followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-400">{formatCount(m.heart_count)}</div>
                        <div className="text-[var(--text-secondary)]">hearts</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TikTok Videos grid */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <h2 className="font-bold text-base">{t.posts.title}</h2>
            <span className="text-xs text-[var(--text-secondary)]">({allVideos.length} videos)</span>
          </div>
          {videos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {videos.map((video) => (
                <a
                  key={video.video_id}
                  href={video.share_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative aspect-[9/16] bg-white/[0.04] overflow-hidden">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="none">
                          <polygon points="6 3 20 12 6 21 6 3"/>
                        </svg>
                      </div>
                    </div>
                    {video.play_count > 0 && (
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        {video.play_count >= 1000000 ? `${(video.play_count / 1000000).toFixed(1)}M` : video.play_count >= 1000 ? `${(video.play_count / 1000).toFixed(1)}K` : video.play_count}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1.5">
                      {video.author_image ? (
                        <img src={video.author_image} alt="" className="w-4 h-4 rounded-full shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[7px] font-bold text-black shrink-0">
                          {video.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-[9px] text-[var(--text-secondary)] truncate">@{video.tiktok_username}</span>
                    </div>
                    {video.title && (
                      <p className="text-[10px] line-clamp-1 leading-relaxed mt-1">{video.title}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : members.length === 0 && allVideos.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)] text-center py-8">{t.posts.empty}</p>
          ) : null}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
