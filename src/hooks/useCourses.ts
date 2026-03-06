"use client";
import { useState, useEffect } from "react";
import type { Course, Lesson } from "@/data/types";

let coursesCache: Course[] | null = null;

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coursesCache) {
      setCourses(coursesCache);
      setLoading(false);
      return;
    }
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data: Course[]) => {
        coursesCache = data;
        setCourses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}

export function useCourse(courseId: string) {
  const { courses, loading } = useCourses();
  const course = courses.find((c) => c.id === courseId);
  return { course, loading };
}

let lessonCache: Record<string, Lesson> = {};

export function useLesson(courseId: string, lessonId: string) {
  const cacheKey = `${courseId}/${lessonId}`;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonCache[cacheKey]) {
      setLesson(lessonCache[cacheKey]);
      setLoading(false);
      return;
    }
    fetch(`/api/courses?courseId=${courseId}&lessonId=${lessonId}`)
      .then((res) => res.json())
      .then((data: Lesson) => {
        lessonCache[cacheKey] = data;
        setLesson(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId, lessonId, cacheKey]);

  return { lesson, loading };
}
