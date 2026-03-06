import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function crawlEmbed(username: string) {
  try {
    const res = await fetch(`https://www.tiktok.com/embed/@${username}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await res.text();

    // Extract user info
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

    // Extract videos
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

export async function GET(req: NextRequest) {
  const secret =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: members } = await supabase
    .from("tiktok_members")
    .select("tiktok_username, name, image");

  if (!members || members.length === 0) {
    return NextResponse.json({ message: "No TikTok members found" });
  }

  let totalVideos = 0;
  let successCount = 0;

  for (const member of members) {
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

    if (videos.length === 0) continue;

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

    await supabase
      .from("tiktok_videos")
      .delete()
      .eq("tiktok_username", member.tiktok_username);

    const { error } = await supabase.from("tiktok_videos").insert(rows);
    if (!error) {
      totalVideos += videos.length;
      successCount++;
    }
  }

  return NextResponse.json({
    message: `Crawled ${totalVideos} videos from ${successCount}/${members.length} members`,
  });
}
