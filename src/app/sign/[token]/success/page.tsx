export const dynamic = 'force-dynamic';

"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, User, Mail, Lock, Share2 } from "lucide-react";

export default function SuccessPage() {
  const [animateConfetti, setAnimateConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation after component mounts
    setAnimateConfetti(true);

    // Create confetti effect
    const createConfetti = () => {
      const colors = [
        "#4f46e5",
        "#10b981",
        "#f59e0b",
        "#3b82f6",
        "#ec4899",
      ];
      const confetti = [];

      for (let i = 0; i < 50; i++) {
        const element = document.createElement("div");
        element.style.position = "fixed";
        element.style.width = "10px";
        element.style.height = "10px";
        element.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        element.style.borderRadius = "50%";
        element.style.left = Math.random() * 100 + "%";
        element.style.top = "-10px";
        element.style.opacity = "1";
        element.style.pointerEvents = "none";
        element.style.zIndex = "9999";

        document.body.appendChild(element);

        const duration = Math.random() * 3 + 2;
        const keyframes = `
          @keyframes fall-${i} {
            to {
              transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
              opacity: 0;
            }
          }
        `;

        const style = document.createElement("style");
        style.textContent = keyframes;
        document.head.appendChild(style);

        element.style.animation = `fall-${i} ${duration}s ease-in forwards`;

        setTimeout(() => element.remove(), duration * 1000);
      }
    };

    if (animateConfetti) {
      createConfetti();
    }
  }, [animateConfetti]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="border-b border-green-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-slate-900">OneSign</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in space-y-8 rounded-lg border border-green-200 bg-white shadow-xl">
          {/* Success Header */}
          <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 text-center sm:px-8">
            <div className="mb-6 flex justify-center">
              <div className="animate-pulse">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-900 sm:text-4xl">
              Document Signed Successfully!
            </h1>
            <p className="mt-4 text-lg text-green-700">
              Your signature has been securely recorded and applied to the
              document.
            </p>
          </div>

          {/* Success Details */}
          <div className="space-y-6 px-6 py-8 sm:px-8">
            {/* Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                What Happens Next
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    title: "Signature Recorded",
                    description:
                      "Your signature has been securely saved to the document.",
                    color: "green",
                  },
                  {
                    icon: Mail,
                    title: "Confirmation Sent",
                    description:
                      "A confirmation email has been sent to your address with a copy of the signed document.",
                    color: "blue",
                  },
                  {
                    icon: Clock,
                    title: "Document Processed",
                    description:
                      "The document sender will be notified that you have signed and will receive a copy.",
                    color: "purple",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-${item.color}-100`}
                    >
                      <item.icon
                        className={`h-5 w-5 text-${item.color}-600`}
                      />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900">Important Notes</h3>
              <ul className="mt-3 list-inside space-y-2 text-sm text-blue-800">
                <li>• Your signature is legally binding and enforceable</li>
                <li>• A copy of the signed document has been sent to your email</li>
                <li>
                  • The document sender will be notified of your signature
                </li>
                <li>
                  • You can download or print the signed document from your
                  account
                </li>
              </ul>
            </div>

            {/* Document Saved Status */}
            <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  Document Securely Saved
                </h3>
              </div>
              <p className="text-sm text-green-700">
                Your signed document is now securely stored and can be accessed
                by the document owner and authorized signers only.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
            <div className="space-y-3 sm:flex sm:gap-3 sm:space-y-0">
              <a
                href="/"
                className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700"
              >
                Back to Home
              </a>
              <button
                onClick={() => {
                  // Share functionality (could open share dialog)
                  if (navigator.share) {
                    navigator.share({
                      title: "Document Signed",
                      text: "I have successfully signed the document on OneSign",
                      url: window.location.href,
                    });
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-100"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Need to sign more documents?
            <a href="/" className="ml-2 font-semibold text-blue-600 hover:underline">
              Learn more about OneSign
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600 mt-12">
        <p>Powered by OneSign - Secure Digital Document Signing</p>
        <p className="mt-1">© 2026 OneSign. All rights reserved.</p>
      </div>
    </div>
  );
}
