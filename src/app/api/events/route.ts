import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, conceptName, description, date, location, type, price, qrImage } = body;

  if (!userId || !conceptName?.trim() || !date || !location?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      user_id: userId,
      concept_name: conceptName.trim().slice(0, 200),
      description: description?.trim()?.slice(0, 1000) || null,
      date,
      location: location.trim().slice(0, 200),
      type: type === "paid" ? "paid" : "free",
      price: type === "paid" ? price?.trim()?.slice(0, 100) : null,
      qr_image: type === "paid" ? qrImage || null : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
