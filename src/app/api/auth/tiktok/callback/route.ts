import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const TIKTOK_REDIRECT_URI = `${BASE_URL}/api/auth/tiktok/callback`;

async function fetchAndSaveVideos(
  accessToken: string,
  username: string,
  authorName: string,
  authorImage: string
) {
  try {
    const allVideos: Array<{
      video_id: string;
      title: string;
      description: string;
      thumbnail_url: string;
      cover_url: string;
      share_url: string;
      play_count: number;
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
      console.log("[TikTok] video list response:", JSON.stringify(data).slice(0, 500));

      const videos = data.data?.videos || [];
      for (const v of videos) {
        allVideos.push({
          video_id: v.id,
          title: v.title || v.description || "",
          description: v.description || "",
          thumbnail_url: v.cover_image_url || "",
          cover_url: v.cover_image_url || "",
          share_url: v.share_url || `https://www.tiktok.com/@${username}/video/${v.id}`,
          play_count: v.view_count || 0,
        });
      }

      hasMore = data.data?.has_more || false;
      cursor = data.data?.cursor;
    }

    if (allVideos.length === 0) {
      console.log("[TikTok] No videos returned from API for", username);
      return;
    }

    await supabase.from("tiktok_videos").delete().eq("tiktok_username", username);

    const rows = allVideos.map((v) => ({
      ...v,
      tiktok_username: username,
      author_name: authorName,
      author_image: authorImage,
    }));

    const { error } = await supabase.from("tiktok_videos").insert(rows);
    if (error) console.error("[TikTok] Error saving videos:", error);
    else console.log(`[TikTok] Saved ${rows.length} videos for @${username}`);
  } catch (err) {
    console.error("[TikTok] Error fetching videos:", err);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const savedState = req.cookies.get("tiktok_oauth_state")?.value;

  // Validate CSRF state
  if (!state || !savedState || state !== savedState) {
    console.error("[TikTok] State mismatch:", { state, savedState });
    return NextResponse.redirect(`${BASE_URL}/?error=tiktok_state_mismatch`);
  }

  if (error || !code) {
    console.error("[TikTok] Auth error:", error, url.searchParams.get("error_description"));
    return NextResponse.redirect(`${BASE_URL}/?error=tiktok_auth_failed`);
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: TIKTOK_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();
    console.log("[TikTok] token response:", JSON.stringify(tokenData));

    if (!tokenData.access_token) {
      console.error("[TikTok] No access token:", tokenData);
      return NextResponse.redirect(`${BASE_URL}/?error=tiktok_token_failed`);
    }

    // Get user info (basic + profile + stats)
    const userRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,bio_description,profile_deep_link,follower_count,following_count,likes_count,video_count",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const userData = await userRes.json();
    console.log("[TikTok] userinfo response:", JSON.stringify(userData));

    const user = userData.data?.user;
    if (!user) {
      return NextResponse.redirect(`${BASE_URL}/?error=tiktok_userinfo_failed`);
    }

    const openId = user.open_id;
    const displayName = user.display_name || openId;
    const avatarUrl = user.avatar_url || "";

    // Extract username from profile deep link (may be a short URL that needs redirect)
    let username = "";
    const profileLink = user.profile_deep_link || "";
    const directMatch = profileLink.match(/@([^/?]+)/);
    if (directMatch) {
      username = directMatch[1];
    } else if (profileLink) {
      // Follow short URL redirect to get real profile URL
      try {
        const redirectRes = await fetch(profileLink, { method: "HEAD", redirect: "follow" });
        const finalUrl = redirectRes.url;
        console.log("[TikTok] Resolved profile URL:", finalUrl);
        const resolvedMatch = finalUrl.match(/@([^/?]+)/);
        if (resolvedMatch) username = resolvedMatch[1];
      } catch (e) {
        console.error("[TikTok] Failed to resolve profile link:", e);
      }
    }
    if (!username) {
      username = displayName.replace(/[^\w.]/g, "").toLowerCase() || openId;
    }
    console.log("[TikTok] Resolved username:", username);

    // Delete old records that match this user (by open_id or display_name) but have a different username
    const { data: oldRecords } = await supabase
      .from("tiktok_members")
      .select("tiktok_username")
      .or(`open_id.eq.${openId},name.eq.${displayName}`)
      .neq("tiktok_username", username);

    if (oldRecords && oldRecords.length > 0) {
      const oldUsernames = oldRecords.map((r) => r.tiktok_username);
      // Delete old videos
      for (const oldName of oldUsernames) {
        await supabase.from("tiktok_videos").delete().eq("tiktok_username", oldName);
      }
      // Delete old member records
      await supabase.from("tiktok_members").delete().in("tiktok_username", oldUsernames);
      console.log(`[TikTok] Cleaned up old records: ${oldUsernames.join(", ")} → ${username}`);
    }

    // Save to tiktok_members with full stats
    await supabase.from("tiktok_members").upsert(
      {
        tiktok_username: username,
        open_id: openId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        name: displayName,
        image: avatarUrl,
        follower_count: user.follower_count || 0,
        heart_count: user.likes_count || 0,
      },
      { onConflict: "tiktok_username" }
    );

    // Fetch user's video list and save to DB
    await fetchAndSaveVideos(tokenData.access_token, username, displayName, avatarUrl);

    const response = NextResponse.redirect(`${BASE_URL}/`);

    // Set TikTok session cookie (readable by client JS for auth context)
    const tiktokSession = JSON.stringify({
      id: `tiktok_${openId}`,
      name: displayName,
      image: avatarUrl,
      provider: "tiktok",
    });
    response.cookies.set("tiktok_session", tiktokSession, {
      httpOnly: false,
      secure: BASE_URL.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    // Clear the state cookie
    response.cookies.delete("tiktok_oauth_state");

    return response;
  } catch (err) {
    console.error("[TikTok] Callback error:", err);
    return NextResponse.redirect(`${BASE_URL}/?error=tiktok_callback_error`);
  }
}
