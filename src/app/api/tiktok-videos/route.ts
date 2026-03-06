import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // Get cached videos
  const { data: videos } = await supabase
    .from("tiktok_videos")
    .select("*")
    .order("play_count", { ascending: false });

  // Get all members
  const { data: members } = await supabase
    .from("tiktok_members")
    .select("tiktok_username, name, image, follower_count, heart_count");

  return NextResponse.json({
    videos: videos || [],
    members: members || [],
  });
}
