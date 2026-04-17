"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { trackRiskCheckEvent } from "@/lib/risk-check-analytics";

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
  icon,
  analyticsEvent,
  analyticsPayload,
}: {
  text: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  analyticsEvent?: "copy_clause" | "copy_all";
  analyticsPayload?: Record<string, unknown>;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (analyticsEvent) {
        trackRiskCheckEvent(analyticsEvent, analyticsPayload);
      }
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: nothing we can do silently; user can select manually
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        icon ?? <Copy className="w-4 h-4" />
      )}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}
