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
    const isGreat = percentage >= 80;
    const isOk = percentage >= 60;
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10 text-center animate-fade-in-up">
        {/* Score circle */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={isGreat ? "#22c55e" : isOk ? "#f59e0b" : "#ef4444"}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${percentage * 2.64} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: isGreat ? "#22c55e" : isOk ? "#f59e0b" : "#ef4444" }}>
              {percentage}%
            </span>
          </div>
        </div>
        <p className="text-lg font-semibold mb-1">
          {score}/{questions.length} câu đúng
        </p>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
          {isGreat ? "Xuất sắc! Bạn đã nắm vững kiến thức này." : isOk ? "Khá tốt! Nên ôn lại một số kiến thức." : "Cần học lại bài này kỹ hơn."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 animate-fade-in">
      {/* Progress header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Câu <span className="text-[var(--text-primary)]">{currentQ + 1}</span>/{questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i < currentQ ? "#22c55e" : i === currentQ ? "#f59e0b" : "var(--border)",
                transform: i === currentQ ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[var(--accent-gold)] rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h4 className="text-lg font-semibold mb-5 leading-relaxed">{question.question}</h4>

      <div className="space-y-2.5 mb-5">
        {question.options.map((option, i) => {
          let borderColor = "var(--border)";
          let bgColor = "transparent";
          if (showResult) {
            if (i === question.correctIndex) {
              borderColor = "#22c55e";
              bgColor = "rgba(34, 197, 94, 0.08)";
            } else if (i === selected && i !== question.correctIndex) {
              borderColor = "#ef4444";
              bgColor = "rgba(239, 68, 68, 0.08)";
            }
          } else if (i === selected) {
            borderColor = "#f59e0b";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm hover:border-white/15 hover:bg-white/[0.02] group flex items-center gap-3"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 border transition-all"
                style={{ borderColor, color: showResult && i === question.correctIndex ? "#22c55e" : showResult && i === selected ? "#ef4444" : "var(--text-secondary)" }}
              >
                {showResult && i === question.correctIndex ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : showResult && i === selected && i !== question.correctIndex ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm animate-fade-in">
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p className="text-[var(--text-secondary)] leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
        >
          {currentQ < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}
