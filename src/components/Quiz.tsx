"use client";
import { useState } from "react";
import { QuizQuestion } from "@/data/types";

interface QuizProps {
  questions: QuizQuestion[];
  courseId: string;
  lessonId: string;
  onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete(score);
    }
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
        <div className="text-5xl font-bold mb-2" style={{ color: percentage >= 80 ? "#22c55e" : percentage >= 60 ? "#f59e0b" : "#ef4444" }}>
          {percentage}%
        </div>
        <p className="text-[var(--text-secondary)] mb-1">
          {score}/{questions.length} câu đúng
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          {percentage >= 80 ? "Xuất sắc! Bạn đã nắm vững kiến thức này." : percentage >= 60 ? "Khá tốt! Nên ôn lại một số kiến thức." : "Cần học lại bài này kỹ hơn."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-[var(--text-secondary)]">
          Câu {currentQ + 1}/{questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i < currentQ ? "#22c55e" : i === currentQ ? "#f59e0b" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-4">{question.question}</h4>

      <div className="space-y-2 mb-4">
        {question.options.map((option, i) => {
          let borderColor = "var(--border)";
          let bgColor = "transparent";
          if (showResult) {
            if (i === question.correctIndex) {
              borderColor = "#22c55e";
              bgColor = "rgba(34, 197, 94, 0.1)";
            } else if (i === selected && i !== question.correctIndex) {
              borderColor = "#ef4444";
              bgColor = "rgba(239, 68, 68, 0.1)";
            }
          } else if (i === selected) {
            borderColor = "#f59e0b";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="w-full text-left p-3 rounded-lg border transition-all text-sm"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              <span className="text-[var(--text-secondary)] mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--bg-primary)] text-sm">
          <p className="text-[var(--text-secondary)]">{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-lg bg-[var(--accent-gold)] text-black font-medium text-sm hover:opacity-90 transition"
        >
          {currentQ < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
        </button>
      )}
    </div>
  );
}
