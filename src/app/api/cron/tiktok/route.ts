import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";

// ---- TikTok API (for members who have logged in) ----

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      return { access_token: data.access_token, refresh_token: data.refresh_token || refreshToken };
    }
    console.error("[TikTok Cron] Refresh failed:", data);
    return null;
  } catch (err) {
    console.error("[TikTok Cron] Refresh error:", err);
    return null;
  }
}

async function fetchUserInfo(accessToken: string) {
  const res = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data.data?.user || null;
}

async function fetchVideos(accessToken: string) {
  const allVideos: Array<{
    id: string;
    title: string;
    description: string;
    cover_image_url: string;
    share_url: string;
    view_count: number;
  }> = [];

  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const body: Record<string, unknown> = { max_count: 20 };
    if (cursor) body.cursor = cursor;

    const res = await fetch(
      "https://open.tiktokapis.com/v2/video/list/?fields=id,title,description,cover_image_url,share_url,view_count",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    const videos = data.data?.videos || [];
    allVideos.push(...videos);

    hasMore = data.data?.has_more || false;
    cursor = data.data?.cursor;
  }

  return allVideos;
}

// ---- Crawl embed (fallback for members who haven't logged in) ----

async function crawlEmbed(username: string) {
  try {
    const res = await fetch(`https://www.tiktok.com/embed/@${username}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await res.text();

    let userInfo: {
      nickname?: string;
      avatarThumbUrl?: string;
      followerCount?: number;
      heartCount?: number;
    } | null = null;
    const userMatch = html.match(
      /\{[^}]*"uniqueId"\s*:\s*"[^"]*"[^}]*"nickname"\s*:\s*"[^"]*"[^}]*"code"\s*:\s*\d+[^}]*\}/
    );
    if (userMatch) {
      try {
        userInfo = JSON.parse(userMatch[0]);
      } catch {}
    }

    const videos: Array<{
      id: string;
      desc: string;
      coverUrl: string;
      originCoverUrl: string;
      playCount: number;
      authorUniqueId: string;
    }> = [];
    const videoPattern =
      /\{"id":"(\d{19,})","desc":"((?:[^"\\]|\\.)*)","height":\d+,"width":\d+,"ratio":"[^"]*","coverUrl":"((?:[^"\\]|\\.)*)","originCoverUrl":"((?:[^"\\]|\\.)*)","dynamicCoverUrl":"[^"]*","playAddr":"[^"]*","playCount":(\d+),"privateItem":(true|false),"authorUniqueId":"([^"]*)"/g;
    let match;
    while ((match = videoPattern.exec(html)) !== null) {
      if (match[6] === "false") {
        videos.push({
          id: match[1],
          desc: match[2]
            .replace(/\\u[\dA-Fa-f]{4}/g, (m) =>
              String.fromCharCode(parseInt(m.slice(2), 16))
            )
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"'),
          coverUrl: match[3].replace(/\\u0026/g, "&"),
          originCoverUrl: match[4].replace(/\\u0026/g, "&"),
          playCount: parseInt(match[5]),
          authorUniqueId: match[7],
        });
      }
    }

    return { userInfo, videos };
  } catch {
    return { userInfo: null, videos: [] };
  }
}

// ---- Main handler ----

export async function GET(req: NextRequest) {
  const secret =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: members } = await supabase
    .from("tiktok_members")
    .select("tiktok_username, name, image, access_token, refresh_token");

  if (!members || members.length === 0) {
    return NextResponse.json({ message: "No TikTok members found" });
  }

  let totalVideos = 0;
  let successCount = 0;

  for (const member of members) {
    // Members with access_token → use TikTok API
    if (member.access_token) {
      let accessToken = member.access_token;

      let userInfo = await fetchUserInfo(accessToken);
      if (!userInfo && member.refresh_token) {
        const refreshed = await refreshAccessToken(member.refresh_token);
        if (refreshed) {
          accessToken = refreshed.access_token;
          await supabase
            .from("tiktok_members")
            .update({
              access_token: refreshed.access_token,
              refresh_token: refreshed.refresh_token,
            })
            .eq("tiktok_username", member.tiktok_username);
          userInfo = await fetchUserInfo(accessToken);
        }
      }

      if (userInfo) {
        await supabase
          .from("tiktok_members")
          .update({
            name: userInfo.display_name || member.name,
            image: userInfo.avatar_url || member.image,
            follower_count: userInfo.follower_count || 0,
            heart_count: userInfo.likes_count || 0,
          })
          .eq("tiktok_username", member.tiktok_username);
      }

      const videos = await fetchVideos(accessToken);
      if (videos.length > 0) {
        const rows = videos.map((v) => ({
          video_id: v.id,
          tiktok_username: member.tiktok_username,
          title: v.title || v.description || "",
          description: v.description || "",
          thumbnail_url: v.cover_image_url || "",
          cover_url: v.cover_image_url || "",
          share_url: v.share_url || `https://www.tiktok.com/@${member.tiktok_username}/video/${v.id}`,
          author_name: userInfo?.display_name || member.name || member.tiktok_username,
          author_image: userInfo?.avatar_url || member.image || null,
          play_count: v.view_count || 0,
        }));

        await supabase.from("tiktok_videos").delete().eq("tiktok_username", member.tiktok_username);
        const { error } = await supabase.from("tiktok_videos").insert(rows);
        if (!error) {
          totalVideos += videos.length;
          successCount++;
        }
      }
    } else {
      // Members without access_token → fallback to crawl
      const { userInfo, videos } = await crawlEmbed(member.tiktok_username);

      if (userInfo) {
        await supabase
          .from("tiktok_members")
          .update({
            name: userInfo.nickname || member.name,
            image: userInfo.avatarThumbUrl || member.image,
            follower_count: userInfo.followerCount || 0,
            heart_count: userInfo.heartCount || 0,
          })
          .eq("tiktok_username", member.tiktok_username);
      }

      if (videos.length > 0) {
        const rows = videos.map((v) => ({
          video_id: v.id,
          tiktok_username: member.tiktok_username,
          title: v.desc || "",
          description: v.desc || "",
          thumbnail_url: v.originCoverUrl || v.coverUrl || "",
          cover_url: v.coverUrl || "",
          share_url: `https://www.tiktok.com/@${member.tiktok_username}/video/${v.id}`,
          author_name: userInfo?.nickname || member.name || member.tiktok_username,
          author_image: userInfo?.avatarThumbUrl || member.image || null,
          play_count: v.playCount || 0,
        }));

        await supabase.from("tiktok_videos").delete().eq("tiktok_username", member.tiktok_username);
        const { error } = await supabase.from("tiktok_videos").insert(rows);
        if (!error) {
          totalVideos += videos.length;
          successCount++;
        }
      }
    }
  }

  return NextResponse.json({
    message: `Updated ${totalVideos} videos from ${successCount}/${members.length} members`,
  });
}
