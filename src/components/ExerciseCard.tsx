"use client";
import { Exercise } from "@/data/types";

export default function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-gold)]/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-sm font-bold text-[var(--accent-gold)]">{index + 1}</span>
        </div>
        <div>
          <h4 className="font-semibold mb-1">{exercise.title}</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{exercise.description}</p>
        </div>
      </div>
      {exercise.tips.length > 0 && (
        <div className="ml-11">
          <p className="text-xs font-medium text-[var(--accent-gold)] mb-1.5">Gợi ý:</p>
          <ul className="space-y-1">
            {exercise.tips.map((tip, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2">
                <span className="text-[var(--accent-gold)] shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
