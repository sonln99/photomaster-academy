export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: QuizQuestion[];
  exercises: Exercise[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Exercise {
  title: string;
  description: string;
  tips: string[];
}

export interface Course {
  id: string;
  level: "beginner" | "professional" | "pro";
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
}
