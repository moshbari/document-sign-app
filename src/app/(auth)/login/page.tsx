"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { PenTool, Mail, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const registered = searchParams.get("registered") === "true";
  const prefillEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If we arrive with ?email= from the register redirect, prefill once.
  useEffect(() => {
    if (prefillEmail && !email) {
      setEmail(prefillEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
      } else if (result?.ok) {
        // If the user came in from the contract builder, hand them off to the
        // claim-draft page so we can turn their saved draft into a real doc.
        if (draftId) {
          router.push(
            `/dashboard/claim-draft?id=${encodeURIComponent(draftId)}`
          );
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              OneSign
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {draftId ? "Sign in to send your contract" : "Welcome Back"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {draftId
              ? "Your contract draft is waiting. Sign in and we’ll set it up."
              : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Just-registered success banner (from the register redirect) */}
        {registered && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900 dark:text-emerald-200">
              Account created. Sign in to pick up where you left off.
            </div>
          </div>
        )}

        {draftId && !registered && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-900 dark:text-indigo-200">
              Your contract draft is saved locally. Sign in and we’ll turn it
              into a real document ready to send.
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-slide-in-up">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-5 h-5" />}
              disabled={loading}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="w-5 h-5" />}
              disabled={loading}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-600"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href={
              draftId
                ? `/register?draft=${encodeURIComponent(draftId)}`
                : "/register"
            }
          >
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              disabled={loading}
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          By signing in, you agree to our{" "}
          <Link href="/legal/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
