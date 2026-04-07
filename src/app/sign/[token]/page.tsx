export const dynamic = 'force-dynamic';

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SignaturePad from "@/components/SignaturePad";
import {
  CheckCircle,
  AlertCircle,
  Loader,
  FileText,
  Lock,
  User,
  Calendar,
} from "lucide-react";

interface DocumentInfo {
  id: string;
  title: string;
  content: string;
  creatorName: string;
  createdAt: string;
}

interface SignerInfo {
  id: string;
  name: string;
  email: string;
  status: string;
}

export default function SignPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [signer, setSignerInfo] = useState<SignerInfo | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDocumentInfo = async () => {
      try {
        const response = await fetch(`/api/sign/${token}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Invalid or expired signing link.");
          } else if (response.status === 410) {
            setError(
              "This document has already been signed or the link is no longer valid."
            );
          } else {
            setError("Failed to load document information.");
          }
          return;
        }

        const data = await response.json();
        setDocument(data.document);
        setSignerInfo(data.signer);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDocumentInfo();
    }
  }, [token]);

  const handleSignatureChange = (base64Signature: string) => {
    setSignature(base64Signature);
  };

  const handleAcceptSignature = (base64Signature: string) => {
    setSignature(base64Signature);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signature || !agreedToTerms) {
      setError("Please provide a signature and agree to the terms.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signatureData: signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit signature.");
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      setSuccess(true);
      setSuccessMessage(data.message || "Document signed successfully!");

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/sign/${token}/success`);
      }, 2000);
    } catch (err) {
      console.error("Error submitting signature:", err);
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white shadow-lg">
          <div className="border-b border-red-200 bg-red-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">
                Unable to Sign Document
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-slate-700">{error}</p>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <a
              href="/"
              className="block text-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="animate-fade-in text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-900">
            Document Signed Successfully!
          </h1>
          <p className="mt-2 text-green-700">{successMessage}</p>
          <p className="mt-6 text-sm text-slate-600">
            Redirecting to success page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">OneSign</h1>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Secure Document Signing Platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Document Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Details Card */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-md">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Document Details
                  </h2>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Document Title
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {document?.title}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Sent by
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <User className="h-4 w-4 text-slate-400" />
                      {document?.creatorName}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Date Created
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {document?.createdAt
                        ? new Date(document.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signer Details Card */}
            {signer && (
              <div className="rounded-lg border border-slate-200 bg-white shadow-md">
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <h3 className="font-semibold text-slate-900">
                    Your Information
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Name
                      </p>
                      <p className="mt-1 text-slate-900">{signer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Email
                      </p>
                      <p className="mt-1 text-slate-900">{signer.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Content */}
            {document?.content && (
              <div className="rounded-lg border border-slate-200 bg-white shadow-md">
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <h3 className="font-semibold text-slate-900">
                    Document Content
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded bg-slate-50 p-4 text-slate-700">
                    {typeof document.content === "string"
                      ? document.content
                      : JSON.stringify(document.content, null, 2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Signature */}
          <div className="space-y-6">
            {/* Signature Component */}
            <div>
              <SignaturePad
                onChange={handleSignatureChange}
                onAccept={handleAcceptSignature}
              />
            </div>

            {/* Agreement & Submission */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Agreement Checkbox */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-md">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">
                    I agree that my signature is legally binding and
                    authenticate the contents of this document.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Sign Button */}
              <button
                type="submit"
                disabled={!signature || !agreedToTerms || submitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing..." : "Sign Document"}
              </button>
            </form>

            {/* Security Footer */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-xs text-green-700">
              <Lock className="mx-auto mb-2 h-4 w-4" />
              <p className="font-medium">Secure & Encrypted</p>
              <p>Your signature is protected by bank-level encryption</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600">
        <p>Powered by OneSign - Secure Digital Document Signing</p>
        <p className="mt-1">© 2026 OneSign. All rights reserved.</p>
      </div>
    </div>
  );
}
