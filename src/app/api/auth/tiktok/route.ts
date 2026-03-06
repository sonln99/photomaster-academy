import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function GET(req: NextRequest) {
  const state = randomBytes(32).toString("hex");
  const redirectUri = `${BASE_URL}/api/auth/tiktok/callback`;

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.set("client_key", TIKTOK_CLIENT_KEY);
  authUrl.searchParams.set("scope", "user.info.basic,user.info.profile,user.info.stats,video.list");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
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
