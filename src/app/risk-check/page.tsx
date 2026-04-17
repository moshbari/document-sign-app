import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Lock, PenTool } from "lucide-react";
import { QUESTIONS } from "@/lib/risk-check";

export default function RiskCheckLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <PenTool className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                OneSign
              </span>
            </Link>
            <div className="flex gap-2 sm:gap-4">
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Free tool &middot; No signup &middot; 90 seconds
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Before you sign with that client,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              find out if they&apos;ll actually pay.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
            Answer 12 quick questions. Get a client risk score, the red flags
            ranked, and the exact contract clauses to protect yourself — in under
            two minutes. Free. No signup. Works on your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/risk-check/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Start the check <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg font-semibold transition-colors"
            >
              How it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              90 seconds
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Nothing stored on our servers
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Shareable results
            </div>
          </div>
        </div>
      </section>

      {/* Problem framing */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            85% of freelancers have been stiffed on an invoice.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
            The Freelancers Union pegs the average loss at <strong>$5,968 per
            incident</strong>. IRS Schedule C data shows the typical solo
            freelancer nets ~$25,000/year. One deadbeat client can wipe out a
            quarter of your entire annual income.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            The pattern that predicts these losses is visible{" "}
            <em>before</em> you sign. This tool checks for it.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Answer 12 questions
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Covers deposits, scope, decision-makers, payment terms, and the
                subtle signals of a bad fit. Each question takes about 5
                seconds.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Get your risk score
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Green, yellow, or red — backed by a ranked list of the specific
                red flags that scored against this prospect.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Copy the clauses
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                For every flag, we give you exact contract language to patch
                the hole before you sign. Paste, tweak, send.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            What we check
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {QUESTIONS.map((q) => (
              <div
                key={q.key}
                className="flex gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {q.prompt}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/risk-check/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Start the check <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / About OneSign */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Built by the team behind OneSign
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            OneSign is the freelancer&apos;s legal shield — a simple,
            low-cost way to send bulletproof contracts for signing in under a
            minute. This tool is free because getting paid should be the
            default, not the exception.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-indigo-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            See OneSign <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-300">
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
