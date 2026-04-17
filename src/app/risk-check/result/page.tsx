import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  PenTool,
  RotateCcw,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  decodeAnswers,
  LEVEL_COLORS,
  scoreAnswers,
} from "@/lib/risk-check";
import CopyButton from "@/components/risk-check/CopyButton";
import ShareButton from "@/components/risk-check/ShareButton";
import LeadCapture from "@/components/risk-check/LeadCapture";
import AnalyticsBeacon from "@/components/risk-check/AnalyticsBeacon";

export const dynamic = "force-dynamic";

// Next.js 15+/16: searchParams is a Promise
export default async function RiskCheckResult({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const sp = await searchParams;
  const answers = decodeAnswers(sp.r);
  if (!answers) {
    notFound();
  }

  const result = scoreAnswers(answers);
  const theme = LEVEL_COLORS[result.level];

  const allClausesText = result.clauses
    .map((c, i) => `${i + 1}. ${c.title}\n\n${c.body}\n`)
    .join("\n");

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
            <div className="flex gap-2">
              <Link
                href="/risk-check/quiz"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Retake</span>
              </Link>
              <ShareButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Score card */}
          <div
            className={`rounded-2xl ring-1 ${theme.ring} ${theme.bg} p-6 sm:p-8 mb-10`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${theme.dot}`} />
              <div
                className={`text-xs font-bold tracking-widest ${theme.text}`}
              >
                {theme.label}
              </div>
            </div>
            <div className="flex items-end gap-4 mb-4">
              <div
                className={`text-5xl sm:text-6xl font-bold ${theme.text} tabular-nums`}
              >
                {result.percent}
              </div>
              <div className="text-slate-500 mb-2 text-sm">
                / 100 risk score
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {result.headline}
            </h1>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              {result.subhead}
            </p>
          </div>

          {/* Green-only CTA (no flags, nothing to fix) */}
          {result.flags.length === 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-6 sm:p-8 mb-10 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No flags raised. Nice.
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-5">
                Your prospect hit every safe answer. You should still send a
                proper signed agreement — OneSign makes that a 60-second job.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Send your contract with OneSign
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Flags list */}
          {result.flags.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Top red flags, ranked
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                The higher the flag, the more predictive it is of payment
                trouble.
              </p>
              <ol className="space-y-4">
                {result.flags.map((f, idx) => (
                  <li
                    key={f.question.key}
                    className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                          {f.question.prompt}
                        </div>
                        <div className="text-xs font-bold tabular-nums text-rose-600 bg-rose-50 dark:bg-rose-950 rounded px-2 py-0.5 shrink-0">
                          +{f.score}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        <span className="text-slate-400">Your answer: </span>
                        <span className="font-medium">{f.answer.label}</span>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                        {f.question.hint}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Clauses */}
          {result.clauses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    Contract clauses to patch each flag
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Paste these into your contract. Tweak the wording if you
                    need to.
                  </p>
                </div>
                <CopyButton
                  text={allClausesText}
                  label="Copy all clauses"
                  analyticsEvent="copy_all"
                  analyticsPayload={{ count: result.clauses.length }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md"
                />
              </div>
              <div className="space-y-4">
                {result.clauses.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        <ShieldCheck className="w-4 h-4" />
                        Clause {idx + 1} — {c.title}
                      </div>
                      <CopyButton
                        text={c.body}
                        label="Copy"
                        analyticsEvent="copy_clause"
                        analyticsPayload={{ title: c.title }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-indigo-600 font-medium border border-slate-200 dark:border-slate-700 rounded"
                        icon={<Copy className="w-3 h-3" />}
                      />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Warning box for red */}
          {result.level === "red" && (
            <div className="flex gap-3 p-5 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl mb-10">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-900 dark:text-rose-200 mb-1">
                  Seriously: consider walking away.
                </div>
                <div className="text-sm text-rose-800 dark:text-rose-300">
                  Every freelancer has passed on a red prospect and been
                  grateful. Nobody has ever said &quot;I&apos;m glad I
                  ignored the red flags and took that client anyway.&quot;
                </div>
              </div>
            </div>
          )}

          {/* Lead capture — always shown, wording adapts to level */}
          <LeadCapture percent={result.percent} level={result.level} />

          {/* Analytics beacon — fires "complete" exactly once on mount */}
          <AnalyticsBeacon
            event="complete"
            payload={{ percent: result.percent, level: result.level }}
          />

          {/* CTA */}
          <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-10 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Now send the contract in 60 seconds.
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg mb-6 max-w-xl">
              OneSign turns your clauses into a signed, legally binding
              agreement — no DocuSign pricing, no learning curve. Start free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-indigo-700 rounded-lg font-semibold shadow-md"
              >
                Start with OneSign free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/risk-check"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/40 hover:bg-white/10 text-white rounded-lg font-semibold"
              >
                About the Risk Check
              </Link>
            </div>
          </section>

          {/* Share row */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
              <Share2 className="w-4 h-4" />
              Know another freelancer? Send them this tool.
            </div>
            <ShareButton
              variant="inline"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-300 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">OneSign</span>
            <span className="text-slate-500">
              &middot; The freelancer&apos;s legal shield
            </span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-indigo-400">
              Home
            </Link>
            <Link href="/risk-check" className="hover:text-indigo-400">
              Risk Check
            </Link>
            <Link href="/register" className="hover:text-indigo-400">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
