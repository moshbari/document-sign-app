"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, PenTool, ShieldCheck } from "lucide-react";
import { AnswerIndex, QUESTIONS, encodeAnswers } from "@/lib/risk-check";
import { trackRiskCheckEvent } from "@/lib/risk-check-analytics";

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<AnswerIndex | null>>(
    () => Array(QUESTIONS.length).fill(null)
  );

  useEffect(() => {
    trackRiskCheckEvent("start");
  }, []);

  const q = QUESTIONS[step];
  const isFirst = step === 0;
  const isLast = step === QUESTIONS.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100);

  const canContinue = answers[step] !== null;

  const handleChoose = (idx: AnswerIndex) => {
    const next = answers.slice();
    next[step] = idx;
    setAnswers(next);
    // Auto-advance after a short pause so the user sees their choice register
    if (!isLast) {
      window.setTimeout(() => {
        setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
      }, 220);
    }
  };

  const handleFinish = () => {
    // All must be answered
    if (answers.some((a) => a === null)) return;
    const encoded = encodeAnswers(answers as AnswerIndex[]);
    router.push(`/risk-check/result?r=${encoded}`);
  };

  const dots = useMemo(() => {
    return answers.map((a, i) => ({
      filled: a !== null,
      current: i === step,
    }));
  }, [answers, step]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/risk-check" className="flex items-center gap-2">
              <PenTool className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                OneSign
              </span>
              <span className="hidden sm:inline text-sm text-slate-500 ml-2">
                Risk Check
              </span>
            </Link>
            <div className="text-sm text-slate-500 tabular-nums">
              {step + 1} / {QUESTIONS.length}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question card */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl w-full">
          <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            Question {step + 1} of {QUESTIONS.length}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {q.prompt}
          </h2>
          {q.hint && (
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base leading-relaxed">
              {q.hint}
            </p>
          )}

          <div className="space-y-3 mb-8">
            {q.options.map((opt, idx) => {
              const selected = answers[step] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleChoose(idx as AnswerIndex)}
                  className={[
                    "w-full text-left px-5 py-4 rounded-xl border-2 transition-all",
                    "flex items-start gap-3",
                    selected
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 shadow-md"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  <div
                    className={[
                      "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      selected
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300 dark:border-slate-600",
                    ].join(" ")}
                  >
                    {selected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-slate-800 dark:text-slate-100 font-medium leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={isFirst}
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {isLast ? (
              <button
                onClick={handleFinish}
                disabled={!canContinue || answers.some((a) => a === null)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                See my risk score <ShieldCheck className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() =>
                  setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))
                }
                disabled={!canContinue}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dots */}
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {dots.map((d, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={[
                  "w-2.5 h-2.5 rounded-full transition-all",
                  d.current
                    ? "bg-indigo-600 scale-125"
                    : d.filled
                    ? "bg-indigo-400"
                    : "bg-slate-300 dark:bg-slate-700",
                ].join(" ")}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
