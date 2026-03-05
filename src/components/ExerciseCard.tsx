"use client";
import { Exercise } from "@/data/types";

export default function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6 hover:border-white/10 transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <span className="text-sm font-bold text-[var(--accent-gold)]">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <h4 className="font-semibold mb-1.5">{exercise.title}</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{exercise.description}</p>
        </div>
      </div>
      {exercise.tips.length > 0 && (
        <div className="ml-14 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-xs font-semibold text-[var(--accent-gold)] mb-2 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Gợi ý
          </p>
          <ul className="space-y-1.5">
            {exercise.tips.map((tip, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2 leading-relaxed">
                <span className="text-[var(--accent-gold)] shrink-0 mt-0.5">&#x2022;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
