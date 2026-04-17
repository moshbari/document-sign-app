"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PenTool, Mail, Lock, User, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || "Failed to create account");
        return;
      }

      // Redirect to login. If they came in via the contract builder, keep
      // the draft id in the query so the login page can forward to the
      // claim flow after sign-in.
      const loginUrl = draftId
        ? `/login?registered=true&draft=${encodeURIComponent(draftId)}&email=${encodeURIComponent(formData.email)}`
        : "/login?registered=true";
      router.push(loginUrl);
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
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
            {draftId ? "One last step" : "Create Account"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {draftId
              ? "Create your free account to send the contract you just built."
              : "Join thousands of teams using OneSign"}
          </p>
        </div>

        {draftId && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-900 dark:text-indigo-200">
              Your contract draft is saved. After signup we&apos;ll send it
              straight to your client — no credit card, no learning curve.
            </div>
          </div>
        )}

        {/* Register Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-slide-in-up">
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<User className="w-5 h-5" />}
              disabled={loading}
              required
            />

            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              disabled={loading}
              required
            />

            {/* Company Field */}
            <Input
              label="Company (Optional)"
              type="text"
              placeholder="Your company name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              icon={<Building2 className="w-5 h-5" />}
              disabled={loading}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              disabled={loading}
              required
              helperText="Must be at least 8 characters long"
            />

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              disabled={loading}
              required
            />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-600 mt-1"
                required
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{" "}
                <Link href="/legal/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/legal/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/legal/esign-consent" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  E-Signature Consent
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href={draftId ? `/login?draft=${encodeURIComponent(draftId)}` : "/login"}>
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              disabled={loading}
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
