import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("event_votes")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventId, userId, userName, userImage } = body;

  if (!eventId || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("event_votes")
    .upsert(
      {
        event_id: eventId,
        user_id: userId,
        user_name: userName || "Anonymous",
        user_image: userImage || null,
      },
      { onConflict: "event_id,user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { voteId, paymentConfirmed, adminApproved } = body;

  if (!voteId) {
    return NextResponse.json({ error: "Missing voteId" }, { status: 400 });
  }

  const updates: Record<string, boolean> = {};
  if (paymentConfirmed !== undefined) updates.payment_confirmed = paymentConfirmed;
  if (adminApproved !== undefined) updates.admin_approved = adminApproved;

  const { data, error } = await supabase
    .from("event_votes")
    .update(updates)
    .eq("id", voteId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
