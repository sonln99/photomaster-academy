"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface TikTokMember {
  tiktok_username: string;
  name: string | null;
  image: string | null;
  follower_count: number;
  heart_count: number;
}

type SortBy = "followers" | "hearts";

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TikTokMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("followers");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...members].sort((a, b) =>
    sortBy === "followers"
      ? (b.follower_count - a.follower_count) || (b.heart_count - a.heart_count)
      : (b.heart_count - a.heart_count) || (b.follower_count - a.follower_count)
  );

  const getRankStyle = (rank: number) => {
    if (rank === 0) return { border: "border-amber-500/30", icon: "#FFD700", size: "w-14 h-14" };
    if (rank === 1) return { border: "border-gray-400/30", icon: "#C0C0C0", size: "w-13 h-13" };
    if (rank === 2) return { border: "border-orange-700/30", icon: "#CD7F32", size: "w-12 h-12" };
    return { border: "border-[var(--border)]", icon: "", size: "w-10 h-10" };
  };

  return (
    <>
      <main className="pt-24 max-w-3xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in">
          <Link href="/" className="hover:text-[var(--text-primary)] transition">{t.coursePage.home}</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="text-[var(--text-primary)]">{t.leaderboard.title}</span>
        </div>

        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.21z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{t.leaderboard.title}</h1>
              <p className="text-sm text-[var(--text-secondary)]">TikTok Ranking</p>
            </div>
          </div>

          {/* Sort tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("followers")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                sortBy === "followers"
                  ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-white/10"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setSortBy("hearts")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                sortBy === "hearts"
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-white/10"
              }`}
            >
              Hearts
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50">
            <p className="text-[var(--text-secondary)]">{t.leaderboard.empty}</p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {sorted.map((member, i) => {
              const rank = getRankStyle(i);
              return (
                <a
                  key={member.tiktok_username}
                  href={`https://www.tiktok.com/@${member.tiktok_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block rounded-xl border ${rank.border} bg-[var(--bg-card)] p-4 sm:p-5 transition-all duration-200 hover:border-pink-500/20 hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`${rank.size} rounded-xl flex items-center justify-center shrink-0 font-bold text-sm`}
                      style={i < 3 ? { backgroundColor: `${rank.icon}15`, color: rank.icon } : { backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}
                    >
                      {i < 3 ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={rank.icon}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ) : (
                        <span>#{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/[0.06]">
                      {member.image ? (
                        <img src={member.image} alt={member.name || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-500 text-sm font-bold text-white">
                          {(member.name || member.tiktok_username).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {member.name || member.tiktok_username}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] truncate">@{member.tiktok_username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className={`text-center ${sortBy === "followers" ? "" : "hidden sm:block"}`}>
                        <div className={`text-lg font-bold ${sortBy === "followers" ? "text-pink-400" : "text-[var(--text-primary)]"}`}>
                          {formatCount(member.follower_count)}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Followers</div>
                      </div>
                      <div className={`text-center ${sortBy === "hearts" ? "" : "hidden sm:block"}`}>
                        <div className={`text-lg font-bold ${sortBy === "hearts" ? "text-red-400" : "text-[var(--text-primary)]"}`}>
                          {formatCount(member.heart_count)}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Hearts</div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
