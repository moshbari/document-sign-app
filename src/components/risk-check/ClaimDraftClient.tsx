"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, PenTool } from "lucide-react";
import {
  clearDraft,
  loadDraft,
  loadLatestDraftId,
  type ContractDraft,
} from "@/lib/contract-draft";
import { trackRiskCheckEvent } from "@/lib/risk-check-analytics";

type Phase = "loading" | "submitting" | "done" | "not-found" | "error";

export default function ClaimDraftClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const paramId = searchParams.get("id");
    const draftId = paramId || loadLatestDraftId();
    if (!draftId) {
      setPhase("not-found");
      return;
    }
    const draft = loadDraft(draftId);
    if (!draft) {
      setPhase("not-found");
      return;
    }
    void submitDraft(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitDraft = async (draft: ContractDraft) => {
    setPhase("submitting");
    try {
      const res = await fetch("/api/documents/from-draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };
      if (!res.ok || !data.id) {
        setErrorMsg(data.error || "Failed to create your document.");
        setPhase("error");
        return;
      }
      // Success — wipe the local draft and forward to the real document.
      clearDraft(draft.id);
      trackRiskCheckEvent("lead_captured", {
        source: "contract-builder",
        outcome: "claim-success",
      });
      setPhase("done");
      router.replace(`/dashboard/documents/${data.id}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network issue — please try again in a moment.");
      setPhase("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="flex items-center gap-2 mb-8">
        <PenTool className="w-7 h-7 text-indigo-600" />
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          OneSign
        </span>
      </div>

      {phase === "loading" && (
        <StatusCard
          icon={<Loader2 className="w-6 h-6 animate-spin text-indigo-600" />}
          title="Finding your draft..."
          body="One second while we pull it back up."
        />
      )}

      {phase === "submitting" && (
        <StatusCard
          icon={<Loader2 className="w-6 h-6 animate-spin text-indigo-600" />}
          title="Setting up your contract..."
          body="We're saving everything you built and getting it ready to send. This takes a couple of seconds."
        />
      )}

      {phase === "done" && (
        <StatusCard
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          title="Done. Redirecting..."
          body="Your contract is saved. Taking you to the document page now."
          tone="success"
        />
      )}

      {phase === "not-found" && (
        <StatusCard
          icon={<AlertCircle className="w-6 h-6 text-amber-600" />}
          title="We couldn't find your draft."
          body="Drafts are saved in your browser only. If you switched browsers or cleared your storage, the draft won't be here. No problem — you can start a new one."
          tone="warn"
        >
          <Link
            href="/risk-check/contract"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm"
          >
            Start a new contract
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm"
          >
            Go to dashboard
          </Link>
        </StatusCard>
      )}

      {phase === "error" && (
        <StatusCard
          icon={<AlertCircle className="w-6 h-6 text-rose-600" />}
          title="Something went wrong."
          body={errorMsg || "Please try again."}
          tone="error"
        >
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm"
          >
            Go to dashboard
          </Link>
        </StatusCard>
      )}
    </div>
  );
}

function StatusCard({
  icon,
  title,
  body,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone?: "success" | "warn" | "error";
  children?: React.ReactNode;
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
      : tone === "warn"
      ? "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
      : tone === "error"
      ? "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800"
      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";
  return (
    <div className={`rounded-2xl border p-6 sm:p-8 ${toneClasses}`}>
      <div className="flex items-start gap-4">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
            {title}
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {body}
          </p>
          {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
        </div>
      </div>
    </div>
  );
}
