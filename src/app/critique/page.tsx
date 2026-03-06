"use client";
import { useState, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface CritiqueResult {
  overall_score: number;
  composition: { score: number; feedback: string };
  lighting: { score: number; feedback: string };
  color: { score: number; feedback: string };
  focus_sharpness: { score: number; feedback: string };
  creativity: { score: number; feedback: string };
  summary: string;
  tips: string[];
}

const CATEGORIES = ["composition", "lighting", "color", "focus_sharpness", "creativity"] as const;

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, label, feedback }: { score: number; label: string; feedback: string }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold text-[var(--text-secondary)]">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feedback}</p>
    </div>
  );
}

export default function CritiquePage() {
  const { t } = useLanguage();
  const ct = t.critique;
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryLabels: Record<string, string> = {
    composition: ct.composition,
    lighting: ct.lighting,
    color: ct.colorLabel,
    focus_sharpness: ct.focus,
    creativity: ct.creativity,
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/critique", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(139,92,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <span className="text-xs font-medium text-violet-400">AI-Powered</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{ct.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{ct.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Upload */}
        <div className="space-y-4">
          {!image ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                dragOver ? "border-violet-500 bg-violet-500/5" : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(139,92,246)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">{ct.dropzone}</p>
                <p className="text-xs text-[var(--text-secondary)]">{ct.formats}</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
                <img src={image} alt="Upload" className="w-full object-contain max-h-[500px] bg-black/30" />
                <button onClick={reset}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-sm hover:bg-black/80 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {!result && (
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {ct.analyzing}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      {ct.analyze}
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {loading && (
            <div className="rounded-2xl border border-white/[0.06] p-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-sm text-[var(--text-secondary)]">{ct.analyzing}...</p>
            </div>
          )}

          {result && (
            <>
              {/* Overall Score */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="flex items-center gap-6">
                  <ScoreRing score={result.overall_score} size={90} />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">{ct.overallScore}</h3>
                    <p className="text-sm leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{ct.details}</h3>
                {CATEGORIES.map((cat) => (
                  <ScoreBar
                    key={cat}
                    score={result[cat].score}
                    label={categoryLabels[cat]}
                    feedback={result[cat].feedback}
                  />
                ))}
              </div>

              {/* Tips */}
              {result.tips.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">{ct.tipsTitle}</h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Try again */}
              <button onClick={reset}
                className="w-full py-3 rounded-xl font-semibold text-sm border border-white/[0.08] hover:bg-white/[0.04] transition flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1.17 6.84 3.16"/><polyline points="21 3 21 9 15 9"/>
                </svg>
                {ct.tryAnother}
              </button>
            </>
          )}

          {!result && !loading && (
            <div className="rounded-2xl border border-white/[0.06] p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{ct.placeholder}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
