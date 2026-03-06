import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Lấy tin nhắn gần nhất (50 tin)
export async function GET() {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []).reverse());
}

// POST: Gửi tin nhắn mới
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, userName, userImage, message } = body;

  if (!userId || !message?.trim()) {
    return NextResponse.json({ error: "Missing userId or message" }, { status: 400 });
  }

  const trimmed = message.trim().slice(0, 500);

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: userId,
      user_name: userName || "Anonymous",
      user_image: userImage || null,
      message: trimmed,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
