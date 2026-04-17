"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";

interface Props {
  percent: number;
  level: "green" | "yellow" | "red";
}

export default function LeadCapture({ percent, level }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const headline =
    level === "red"
      ? "Get the full Deadbeat-Client Playbook free."
      : level === "yellow"
      ? "Get the full Deadbeat-Client Playbook free."
      : "Lock in the free contract-clause pack.";

  const subhead =
    level === "red"
      ? "The 12-page PDF with every clause, the full red-flag detection system, and the exact email scripts that get overdue invoices paid. No spam. Unsubscribe any time."
      : level === "yellow"
      ? "The 12-page PDF with every clause, the full red-flag detection system, and the exact email scripts to use if things go sideways. No spam. Unsubscribe any time."
      : "The 12-page PDF with every clause and the exact email scripts to use if things ever go sideways. Free. No spam.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading" || state === "done") return;
    setState("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/risk-check/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          percent,
          level,
          source: "risk-check-result",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(
          data.error === "invalid_email"
            ? "That email didn't look right — mind checking it?"
            : "Something went wrong. Try again in a moment."
        );
        return;
      }
      setState("done");
      // Lightweight analytics ping
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("risk-check:lead-captured", {
            detail: { percent, level },
          })
        );
      }
    } catch {
      setState("error");
      setMessage("Network hiccup — give it another try.");
    }
  };

  if (state === "done") {
    return (
      <section className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Check your inbox.
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              The Deadbeat-Client Playbook is on its way to{" "}
              <span className="font-semibold">{email}</span>. If it doesn&apos;t
              arrive in a minute, check spam and star us so the next one lands
              safely.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-10">
      <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 text-sm font-bold">
        <ShieldCheck className="w-4 h-4" />
        Free — no credit card
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {headline}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-5 text-sm sm:text-base leading-relaxed max-w-2xl">
        {subhead}
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-xl"
      >
        <div className="relative flex-1">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@yourbusiness.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={state === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>Send me the playbook</>
          )}
        </button>
      </form>
      {message && (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
          {message}
        </p>
      )}
    </section>
  );
}
