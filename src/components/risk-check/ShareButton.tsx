"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { trackRiskCheckEvent } from "@/lib/risk-check-analytics";

export default function ShareButton({
  variant = "icon",
  className = "",
}: {
  variant?: "icon" | "inline";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    const title = "Deadbeat Client Risk Check — OneSign";
    const text =
      "I just ran this client-risk check before signing with a prospect. 90 seconds, no signup. Might save you an unpaid invoice.";

    // Prefer native share on mobile
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        trackRiskCheckEvent("share", { method: "native" });
        return;
      } catch {
        // user cancelled; fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackRiskCheckEvent("share", { method: "clipboard" });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  if (variant === "inline") {
    return (
      <button type="button" onClick={handleShare} className={className}>
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {copied ? "Link copied!" : "Share this tool"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ||
        "inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
      }
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">
        {copied ? "Copied!" : "Share"}
      </span>
    </button>
  );
}
