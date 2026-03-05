import { Course } from "./types";
import { beginnerLessons } from "./beginner";
import { professionalLessons } from "./professional";
import { proLessons } from "./pro";

export const courses: Course[] = [
  {
    id: "beginner",
    level: "beginner",
    title: "Beginner",
    description: "Nền tảng nhiếp ảnh - từ zero đến hiểu biết",
    color: "#22c55e",
    lessons: beginnerLessons,
  },
  {
    id: "professional",
    level: "professional",
    title: "Professional",
    description: "Nâng cao kỹ năng - từ hiểu biết đến thành thạo",
    color: "#3b82f6",
    lessons: professionalLessons,
  },
  {
    id: "pro",
    level: "pro",
    title: "Pro / Master",
    description: "Đỉnh cao nghệ thuật - từ thành thạo đến bậc thầy",
    color: "#a855f7",
    lessons: proLessons,
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId);
  if (!course) return undefined;
  return course.lessons.find((l) => l.id === lessonId);
}
