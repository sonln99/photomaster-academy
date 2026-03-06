import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Lấy tất cả courses (với lessons, quiz, exercises)
export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  const lessonId = req.nextUrl.searchParams.get("lessonId");

  // Nếu có courseId + lessonId → trả về 1 lesson chi tiết
  if (courseId && lessonId) {
    return getLessonDetail(courseId, lessonId);
  }

  // Nếu có courseId → trả về 1 course với danh sách lessons
  if (courseId) {
    return getCourseDetail(courseId);
  }

  // Mặc định: trả về tất cả courses với lessons
  return getAllCourses();
}

async function getAllCourses() {
  const { data: coursesData, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");

  if (coursesError) {
    return NextResponse.json({ error: coursesError.message }, { status: 500 });
  }

  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, course_id, title, description, sort_order")
    .order("sort_order");

  if (lessonsError) {
    return NextResponse.json({ error: lessonsError.message }, { status: 500 });
  }

  const { data: quizData } = await supabase
    .from("quiz_questions")
    .select("course_id, lesson_id, question, options, correct_index, explanation, sort_order")
    .order("sort_order");

  const { data: exerciseData } = await supabase
    .from("exercises")
    .select("course_id, lesson_id, title, description, tips, sort_order")
    .order("sort_order");

  const courses = coursesData.map((course) => ({
    id: course.id,
    level: course.level,
    title: course.title,
    description: course.description,
    color: course.color,
    lessons: lessonsData
      .filter((l) => l.course_id === course.id)
      .map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        content: "",
        quiz: (quizData || [])
          .filter((q) => q.course_id === course.id && q.lesson_id === l.id)
          .map((q) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correct_index,
            explanation: q.explanation,
          })),
        exercises: (exerciseData || [])
          .filter((e) => e.course_id === course.id && e.lesson_id === l.id)
          .map((e) => ({
            title: e.title,
            description: e.description,
            tips: e.tips,
          })),
      })),
  }));

  return NextResponse.json(courses);
}

async function getCourseDetail(courseId: string) {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error || !course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, course_id, title, description, sort_order")
    .eq("course_id", courseId)
    .order("sort_order");

  const { data: quizData } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order");

  const { data: exerciseData } = await supabase
    .from("exercises")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order");

  return NextResponse.json({
    id: course.id,
    level: course.level,
    title: course.title,
    description: course.description,
    color: course.color,
    lessons: (lessons || []).map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      content: "",
      quiz: (quizData || [])
        .filter((q) => q.lesson_id === l.id)
        .map((q) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correct_index,
          explanation: q.explanation,
        })),
      exercises: (exerciseData || [])
        .filter((e) => e.lesson_id === l.id)
        .map((e) => ({
          title: e.title,
          description: e.description,
          tips: e.tips,
        })),
    })),
  });
}

async function getLessonDetail(courseId: string, lessonId: string) {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const { data: quizData } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .order("sort_order");

  const { data: exerciseData } = await supabase
    .from("exercises")
    .select("*")
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .order("sort_order");

  return NextResponse.json({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    quiz: (quizData || []).map((q) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correct_index,
      explanation: q.explanation,
    })),
    exercises: (exerciseData || []).map((e) => ({
      title: e.title,
      description: e.description,
      tips: e.tips,
    })),
  });
}
