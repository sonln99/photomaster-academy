import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    {
      id: "tiktok",
      name: "TikTok",
      type: "oauth",
      authorization: {
        url: "https://www.tiktok.com/v2/auth/authorize",
        params: {
          client_key: process.env.TIKTOK_CLIENT_KEY,
          scope: "user.info.basic,user.info.profile,user.info.stats,video.list",
          response_type: "code",
        },
      },
      token: {
        url: "https://open.tiktokapis.com/v2/oauth/token/",
        async request({ params }) {
          const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_key: process.env.TIKTOK_CLIENT_KEY || "",
              client_secret: process.env.TIKTOK_CLIENT_SECRET || "",
              code: params.code as string,
              grant_type: "authorization_code",
              redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
            }),
          });
          const data = await res.json();
          return {
            tokens: {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              id_token: data.open_id,
            },
          };
        },
      },
      userinfo: {
        url: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count",
        async request({ tokens }) {
          const res = await fetch(
            "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count",
            { headers: { Authorization: `Bearer ${tokens.access_token}` } }
          );
          const data = await res.json();
          return { ...data.data?.user, access_token: tokens.access_token, refresh_token: tokens.refresh_token };
        },
      },
      profile(profile) {
        return {
          id: profile.open_id,
          name: profile.display_name,
          image: profile.avatar_url,
        };
      },
      clientId: process.env.TIKTOK_CLIENT_KEY,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "tiktok" && profile) {
        const p = profile as Record<string, unknown>;
        token.tiktok_access_token = p.access_token;
        token.tiktok_refresh_token = p.refresh_token;
        token.provider = "tiktok";
        // Save to tiktok_members table - use actual username from API
        const username = (p.username as string) || (p.display_name as string || "").replace(/\s/g, "").toLowerCase() || token.sub || "";
        await supabase.from("tiktok_members").upsert({
          tiktok_username: username,
          access_token: p.access_token as string,
          refresh_token: p.refresh_token as string,
          name: p.display_name as string,
          image: p.avatar_url as string,
          follower_count: (p.follower_count as number) || 0,
          heart_count: (p.likes_count as number) || 0,
        }, { onConflict: "tiktok_username" });
      }
      if (account?.provider === "google") {
        token.provider = "google";
      }
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

export { handler as GET, handler as POST };
