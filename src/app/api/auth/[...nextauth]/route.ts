import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { encode } from "next-auth/jwt";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
const TIKTOK_REDIRECT_URI = `${NEXTAUTH_URL}/api/auth/callback/tiktok`;

const handler = NextAuth({
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.sub;
        (session.user as Record<string, unknown>).provider = token.provider;
      }
      return session;
    },
  },
});

// Fetch video list from TikTok API and save to DB
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

    if (allVideos.length === 0) return;

    // Delete old videos and insert new ones
    await supabase
      .from("tiktok_videos")
      .delete()
      .eq("tiktok_username", username);

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

// Custom TikTok OAuth flow
async function handleTikTokLogin(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Step 1: Redirect to TikTok authorization
  if (
    pathname.endsWith("/signin/tiktok") ||
    (pathname.endsWith("/signin") && url.searchParams.get("provider") === "tiktok")
  ) {
    const state = randomBytes(32).toString("hex");
    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
    authUrl.searchParams.set("client_key", TIKTOK_CLIENT_KEY);
    authUrl.searchParams.set("scope", "user.info.basic,user.info.profile,user.info.stats,video.list");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", TIKTOK_REDIRECT_URI);
    authUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set("tiktok_oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600,
    });
    return response;
  }

  // Step 2: Handle callback from TikTok
  if (pathname.endsWith("/callback/tiktok")) {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const savedState = req.cookies.get("tiktok_oauth_state")?.value;

    // Validate CSRF state
    if (!state || !savedState || state !== savedState) {
      console.error("[TikTok] State mismatch:", { state, savedState });
      return NextResponse.redirect(`${NEXTAUTH_URL}/?error=tiktok_state_mismatch`);
    }

    if (error || !code) {
      console.error("[TikTok] Auth error:", error, url.searchParams.get("error_description"));
      return NextResponse.redirect(`${NEXTAUTH_URL}/?error=tiktok_auth_failed`);
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
        return NextResponse.redirect(`${NEXTAUTH_URL}/?error=tiktok_token_failed`);
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
        return NextResponse.redirect(`${NEXTAUTH_URL}/?error=tiktok_userinfo_failed`);
      }

      const openId = user.open_id;
      const displayName = user.display_name || openId;
      const avatarUrl = user.avatar_url || "";

      // Extract username from profile deep link (e.g. "https://www.tiktok.com/@username")
      const profileLink = user.profile_deep_link || "";
      const usernameMatch = profileLink.match(/@([^/?]+)/);
      const username = usernameMatch?.[1] || displayName.replace(/\s/g, "").toLowerCase() || openId;

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

      // Create a proper NextAuth JWT session token
      const sessionToken = await encode({
        token: {
          sub: `tiktok_${openId}`,
          name: displayName,
          picture: avatarUrl,
          provider: "tiktok",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        },
        secret: NEXTAUTH_SECRET,
      });

      const response = NextResponse.redirect(`${NEXTAUTH_URL}/`);

      // Set the NextAuth session cookie (same name NextAuth uses)
      const isSecure = NEXTAUTH_URL.startsWith("https");
      const cookieName = isSecure
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";
      response.cookies.set(cookieName, sessionToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      // Clear the state cookie
      response.cookies.delete("tiktok_oauth_state");

      return response;
    } catch (err) {
      console.error("[TikTok] Callback error:", err);
      return NextResponse.redirect(`${NEXTAUTH_URL}/?error=tiktok_callback_error`);
    }
  }

  return null;
}

async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.includes("tiktok")) {
    const tiktokResponse = await handleTikTokLogin(req);
    if (tiktokResponse) return tiktokResponse;
  }
  return handler(req as unknown as Request) as Promise<Response>;
}

async function POST(req: NextRequest) {
  return handler(req as unknown as Request) as Promise<Response>;
}

export { GET, POST };
