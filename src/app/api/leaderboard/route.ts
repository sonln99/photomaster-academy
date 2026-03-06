import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // TikTok members leaderboard
  const { data: tiktokMembers } = await supabase
    .from("tiktok_members")
    .select("tiktok_username, name, image, follower_count, heart_count")
    .order("follower_count", { ascending: false })
    .order("heart_count", { ascending: false })
    .limit(100);

  return NextResponse.json(tiktokMembers || []);
}
