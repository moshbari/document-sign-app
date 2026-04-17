import type { Metadata } from "next";
import Link from "next/link";
import { PenTool } from "lucide-react";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: {
    default: "Legal — OneSign",
    template: "%s — OneSign Legal",
  },
  description:
    "OneSign legal center: Terms of Service, Privacy Policy, Cookie Policy, E-Signature Disclosure, DPA, Acceptable Use Policy, and more.",
  robots: { index: true, follow: true },
};

const LEGAL_NAV = [
  { href: "/legal", label: "Overview" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/esign-consent", label: "E-Signature Consent" },
  { href: "/legal/aup", label: "Acceptable Use" },
  { href: "/legal/dpa", label: "Data Processing Agreement" },
  { href: "/legal/subprocessors", label: "Subprocessors" },
  { href: "/legal/refund", label: "Refund & Cancellation" },
  { href: "/legal/security", label: "Security" },
  { href: "/legal/impressum", label: "Impressum / Legal Notice" },
  { href: "/legal/accessibility", label: "Accessibility" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <PenTool className="w-7 h-7 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {LEGAL_CONFIG.productName}
              </span>
            </Link>
            <div className="flex gap-2 sm:gap-4 items-center">
              <Link
                href="/login"
                className="hidden sm:inline-flex px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
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

      {/* Main content with sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Legal Center
            </p>
            <nav className="flex flex-col gap-1">
              {LEGAL_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">
                {LEGAL_CONFIG.legalEntity}
              </p>
              <p>{LEGAL_CONFIG.jurisdiction}</p>
              <p className="mt-2">
                Questions?{" "}
                <a
                  href={`mailto:${LEGAL_CONFIG.legalEmail}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {LEGAL_CONFIG.legalEmail}
                </a>
              </p>
            </div>
          </aside>

          {/* Document */}
          <article className="legal-doc max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
            {children}
          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {LEGAL_CONFIG.legalEntity}. All
            rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            <Link href="/legal/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Cookies
            </Link>
            <Link href="/legal/dpa" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              DPA
            </Link>
            <Link href="/legal/security" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
