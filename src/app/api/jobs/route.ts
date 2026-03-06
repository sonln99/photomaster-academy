import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, userName, userImage, title, date, location, price, note } = body;

  if (!userId || !title?.trim() || !date || !location?.trim() || !price?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: userId,
      user_name: userName || "Anonymous",
      user_image: userImage || null,
      title: title.trim().slice(0, 200),
      date,
      location: location.trim().slice(0, 200),
      price: price.trim().slice(0, 100),
      note: note?.trim()?.slice(0, 500) || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
