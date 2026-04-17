import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  Cookie,
  PenTool,
  AlertTriangle,
  Database,
  Users,
  Wallet,
  Lock,
  Building2,
  Accessibility,
} from "lucide-react";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Legal Center",
  description:
    "All OneSign legal documents in one place — Terms, Privacy, Cookies, E-Signature consent, DPA, Acceptable Use, and more.",
};

const DOCS = [
  {
    href: "/legal/terms",
    title: "Terms of Service",
    icon: FileText,
    blurb:
      "The master agreement between you and ZPresso LLC governing your use of OneSign.",
  },
  {
    href: "/legal/privacy",
    title: "Privacy Policy",
    icon: Shield,
    blurb:
      "What personal data we collect, why, how long we keep it, and how you can exercise your rights under GDPR, UK GDPR, CCPA/CPRA, and UAE PDPL.",
  },
  {
    href: "/legal/cookies",
    title: "Cookie Policy",
    icon: Cookie,
    blurb:
      "Which cookies and similar technologies we use, why, and how to control them.",
  },
  {
    href: "/legal/esign-consent",
    title: "E-Signature Disclosure & Consent",
    icon: PenTool,
    blurb:
      "Your informed consent to transact electronically — required under ESIGN, UETA, eIDAS and the UAE Electronic Transactions and Trust Services Law.",
  },
  {
    href: "/legal/aup",
    title: "Acceptable Use Policy",
    icon: AlertTriangle,
    blurb:
      "Rules of the road: what you can and cannot do on OneSign, and what we do when those rules are broken.",
  },
  {
    href: "/legal/dpa",
    title: "Data Processing Agreement",
    icon: Database,
    blurb:
      "Article 28 GDPR processor terms for business customers uploading their end-users' personal data to OneSign.",
  },
  {
    href: "/legal/subprocessors",
    title: "Subprocessors",
    icon: Users,
    blurb:
      "The third-party vendors that help us deliver OneSign and the categories of data each one handles.",
  },
  {
    href: "/legal/refund",
    title: "Refund & Cancellation",
    icon: Wallet,
    blurb:
      "Billing, renewals, cancellations, refunds, and the EU consumer cooling-off period.",
  },
  {
    href: "/legal/security",
    title: "Security",
    icon: Lock,
    blurb:
      "How we protect your documents and signatures — encryption, access controls, audit logs, incident response.",
  },
  {
    href: "/legal/impressum",
    title: "Impressum / Legal Notice",
    icon: Building2,
    blurb:
      "Statutory company disclosure required in Germany, Austria, and Switzerland (TMG §5).",
  },
  {
    href: "/legal/accessibility",
    title: "Accessibility Statement",
    icon: Accessibility,
    blurb:
      "Our commitment to WCAG 2.2 AA, the EU Accessibility Act, and ADA compliance.",
  },
];

export default function LegalIndexPage() {
  return (
    <>
      <span className="meta">Legal Center</span>
      <h1>Legal &amp; Trust Center</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
        Everything {LEGAL_CONFIG.productName} users, customers, and their
        end-signers need to understand how the service works, how we handle
        data, and the rights and obligations on each side of the agreement.
      </p>
      <p>
        These documents are operated by{" "}
        <strong>{LEGAL_CONFIG.legalEntity}</strong>, a{" "}
        {LEGAL_CONFIG.registrationType} established in{" "}
        {LEGAL_CONFIG.jurisdiction}. Effective date:{" "}
        <strong>{LEGAL_CONFIG.effectiveDate}</strong>.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 not-prose">
        {DOCS.map(({ href, title, icon: Icon, blurb }) => (
          <Link
            key={href}
            href={href}
            className="group block p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {blurb}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2>Questions?</h2>
      <p>
        Write to{" "}
        <a href={`mailto:${LEGAL_CONFIG.legalEmail}`}>
          {LEGAL_CONFIG.legalEmail}
        </a>{" "}
        for legal and contractual matters, or{" "}
        <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>
          {LEGAL_CONFIG.privacyEmail}
        </a>{" "}
        for data-protection questions or to exercise your rights under
        applicable privacy laws.
      </p>
    </>
  );
}
