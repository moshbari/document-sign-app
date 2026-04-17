import { ArrowRight, Send, BarChart3, PenTool, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Top utility bar: free tool */}
      <div className="bg-slate-900 text-slate-100 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-slate-300">
            New free tool:
          </span>
          <Link
            href="/risk-check"
            className="font-semibold text-white underline underline-offset-2 hover:text-indigo-300"
          >
            Deadbeat Client Risk Check — 90 seconds, no signup
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <PenTool className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">OneSign</span>
            </div>
            <div className="flex gap-2 sm:gap-4 items-center">
              <Link
                href="/risk-check"
                className="hidden sm:inline-flex px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                Risk Check
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
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

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Sign Documents <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Digitally, Securely, Instantly</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            OneSign simplifies the document signing process. Create templates, send documents for signing, and track status—all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg font-semibold transition-colors"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to streamline your document signing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                <PenTool className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Create Templates
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Design reusable document templates with customizable signature fields, text inputs, and document sections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <Send className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Send for Signing
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Instantly send documents to signers via email. They'll receive a secure signing link valid for 30 days.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Track Status
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor document status in real-time. Know exactly when signers view, sign, or decline your documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Three simple steps to get your documents signed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Create
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Upload your document or select a template, then customize signature fields and form inputs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Send
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Add signer emails and send your document. They'll receive a notification with a secure signing link.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Sign
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Signers view the document, draw their signature, and submit. You're notified instantly when complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tool Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg p-8 sm:p-12 flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" />
                Free tool · 90 seconds · No signup
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Before you sign the contract, find out if they&apos;ll pay.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                The <strong>Deadbeat Client Risk Check</strong> is a 12-question assessment that tells you whether your next client is likely to ghost the invoice — and gives you the exact contract clauses to protect yourself if they&apos;re risky.
              </p>
              <Link
                href="/risk-check"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Run the check <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="shrink-0 w-full lg:w-auto">
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-3xl font-bold text-indigo-600">12</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">questions</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-3xl font-bold text-indigo-600">90s</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">to finish</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-3xl font-bold text-indigo-600">$0</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">no signup</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to streamline your signing process?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of teams using OneSign to secure their documents.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-indigo-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PenTool className="w-6 h-6 text-indigo-400" />
                <span className="text-lg font-bold text-white">OneSign</span>
              </div>
              <p className="text-sm text-slate-400">
                Secure digital document signing for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/risk-check" className="hover:text-indigo-400 transition-colors">Risk Check (free)</Link></li>
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal" className="hover:text-indigo-400 transition-colors">Legal Center</Link></li>
                <li><Link href="/legal/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/legal/esign-consent" className="hover:text-indigo-400 transition-colors">E-Signature Consent</Link></li>
                <li><Link href="/legal/dpa" className="hover:text-indigo-400 transition-colors">DPA</Link></li>
                <li><Link href="/legal/security" className="hover:text-indigo-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} ZPresso LLC. All rights reserved.
              <span className="hidden sm:inline">&nbsp;&middot;&nbsp;</span>
              <span className="block sm:inline text-slate-500">
                OneSign is operated by ZPresso LLC, a free-zone company in SHAMS, UAE.
              </span>
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
