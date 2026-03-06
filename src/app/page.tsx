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
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 1000;
  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tiktok-videos")
      .then((r) => r.json())
      .then((d) => {
        if (d.videos) {
          setAllVideos(d.videos);
        }
        if (d.members) setMembers(d.members);
      })
      .catch(() => {});
  }, []);

  const filteredVideos = selectedMember
    ? allVideos.filter((v) => v.tiktok_username === selectedMember)
    : allVideos;

  const loadMore = useCallback(() => {
    setVideos((prev) => {
      const next = filteredVideos.slice(0, prev.length + PAGE_SIZE);
      setHasMore(next.length < filteredVideos.length);
      return next;
    });
  }, [filteredVideos]);

  // Reset displayed videos when filter changes
  useEffect(() => {
    setVideos(filteredVideos.slice(0, PAGE_SIZE));
    setHasMore(filteredVideos.length > PAGE_SIZE);
  }, [selectedMember, allVideos]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1, root: container }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const rankedMembers = [...members].sort((a, b) =>
    (b.follower_count - a.follower_count) || (b.heart_count - a.heart_count)
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Two-column layout fills remaining space */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Leaderboard sidebar */}
        {rankedMembers.length > 0 && (
          <div className="w-80 shrink-0 flex flex-col border-r border-[var(--border)] hidden lg:flex">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[var(--bg-card)] shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ec4899"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.21z"/></svg>
              <h2 className="font-bold text-sm">{t.leaderboard.title}</h2>
              <Link href="/leaderboard" className="text-[10px] text-pink-400 hover:underline ml-auto">Xem t&#7845;t c&#7843;</Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              {rankedMembers.map((m, i) => (
                <button
                  key={m.tiktok_username}
                  onClick={() => setSelectedMember(selectedMember === m.tiktok_username ? null : m.tiktok_username)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition border-b border-white/[0.04] last:border-0 text-left ${selectedMember === m.tiktok_username ? "bg-pink-500/10 border-l-2 border-l-pink-500" : ""}`}
                >
                  <div className="w-6 text-center shrink-0">
                    {i < 3 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ) : (
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium">{i + 1}</span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/[0.06]">
                    {m.image ? (
                      <img src={m.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-500 text-[10px] font-bold text-white">
                        {(m.name || m.tiktok_username).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{m.name || m.tiktok_username}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] truncate">@{m.tiktok_username}</p>
                  </div>
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
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TikTok Videos */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[var(--bg-primary)] shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ec4899"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.21z"/></svg>
            {selectedMember ? (
              <>
                <h2 className="font-bold text-sm">@{selectedMember}</h2>
                <span className="text-xs text-[var(--text-secondary)]">({filteredVideos.length} videos)</span>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-pink-400 hover:bg-pink-500/10 transition border border-pink-500/20"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Tất cả
                </button>
              </>
            ) : (
              <>
                <h2 className="font-bold text-sm">{t.posts.title}</h2>
                <span className="text-xs text-[var(--text-secondary)]">({allVideos.length} videos)</span>
              </>
            )}
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {videos.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
