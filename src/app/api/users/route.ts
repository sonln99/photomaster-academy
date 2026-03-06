import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST: Lưu/cập nhật user khi đăng nhập
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name, image, provider, locale } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Kiểm tra user đã tồn tại chưa
  const { data: existing } = await supabase
    .from("users")
    .select("id, login_count")
    .eq("id", id)
    .single();

  if (existing) {
    // Update: tăng login_count, cập nhật last_login
    const { error } = await supabase
      .from("users")
      .update({
        name: name || existing.id,
        image: image || null,
        locale: locale || "vi",
        last_login: new Date().toISOString(),
        login_count: (existing.login_count || 0) + 1,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // Insert user mới
    const { error } = await supabase.from("users").insert({
      id,
      name: name || id,
      image: image || null,
      provider: provider || "facebook",
      locale: locale || "vi",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

// PATCH: Cập nhật stats user (gọi khi hoàn thành bài học)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId, lastCourseId, lastLessonId, addScore } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("total_lessons_completed, total_quiz_score")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {
    last_course_id: lastCourseId,
    last_lesson_id: lastLessonId,
  };

  if (lastLessonId) {
    updates.total_lessons_completed = (user.total_lessons_completed || 0) + 1;
  }
  if (addScore) {
    updates.total_quiz_score = (user.total_quiz_score || 0) + addScore;
  }

  const { error } = await supabase.from("users").update(updates).eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
