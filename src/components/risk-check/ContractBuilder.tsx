"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  PenTool,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  User,
  Users,
  Briefcase,
  DollarSign,
  FileText,
  Send,
} from "lucide-react";
import {
  decodeAnswers,
  scoreAnswers,
} from "@/lib/risk-check";
import {
  ContractDraft,
  DraftClause,
  emptyDraft,
  loadDraft,
  loadLatestDraftId,
  saveDraft,
  validateDraftForSubmit,
} from "@/lib/contract-draft";
import { trackRiskCheckEvent } from "@/lib/risk-check-analytics";

type Step = 0 | 1 | 2 | 3 | 4;

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 0, label: "Your details", icon: User },
  { id: 1, label: "Client", icon: Users },
  { id: 2, label: "Project", icon: Briefcase },
  { id: 3, label: "Fees & terms", icon: DollarSign },
  { id: 4, label: "Clauses & send", icon: ShieldCheck },
];

const PAYMENT_TERMS: ContractDraft["paymentTerms"][] = [
  "Due on receipt",
  "Net 7",
  "Net 15",
  "Net 30",
];

/** Build the initial draft from URL state or localStorage. */
function hydrateDraft(
  answersParam: string | null,
  existingId: string | null
): ContractDraft {
  // First, try to restore an existing draft by id.
  if (existingId) {
    const existing = loadDraft(existingId);
    if (existing) return existing;
  }
  // Otherwise, try the most-recent draft.
  const latestId = loadLatestDraftId();
  if (latestId) {
    const latest = loadDraft(latestId);
    if (latest) return latest;
  }
  // Fresh draft. Pre-fill clauses from risk-check answers if available.
  const draft = emptyDraft();
  if (answersParam) {
    const answers = decodeAnswers(answersParam);
    if (answers) {
      const result = scoreAnswers(answers);
      draft.sourceAnswers = answersParam;
      draft.clauses = result.clauses.map((c) => ({
        title: c.title,
        body: c.body,
        enabled: true,
      }));
    }
  }
  // If no clauses at all, seed with the universal "no contract, no project"
  // baseline so the user still has something protective.
  if (draft.clauses.length === 0) {
    draft.clauses = [
      {
        title: "No work without signed agreement",
        body:
          "No work — including discovery, strategy, or drafts — is considered part of this engagement until this contract is signed and deposit has cleared. Any pre-contract conversations are informational only.",
        enabled: true,
      },
    ];
  }
  return draft;
}

export default function ContractBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const answersParam = searchParams.get("r");
  const existingId = searchParams.get("id");

  const [draft, setDraft] = useState<ContractDraft | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [errors, setErrors] = useState<string[]>([]);

  // Hydrate once on mount. Runs only in the browser.
  useEffect(() => {
    const hydrated = hydrateDraft(answersParam, existingId);
    setDraft(hydrated);
    saveDraft(hydrated);
    trackRiskCheckEvent("start", {
      source: "contract-builder",
      hasRiskCheck: Boolean(answersParam),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const update = <K extends keyof ContractDraft>(
    key: K,
    value: ContractDraft[K]
  ) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateParty = (
    which: "freelancer" | "client",
    field: keyof ContractDraft["freelancer"],
    value: string
  ) => {
    setDraft((prev) =>
      prev ? { ...prev, [which]: { ...prev[which], [field]: value } } : prev
    );
  };

  const toggleClause = (idx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.clauses];
      next[idx] = { ...next[idx], enabled: !next[idx].enabled };
      return { ...prev, clauses: next };
    });
  };

  const updateClause = (idx: number, field: keyof DraftClause, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.clauses];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, clauses: next };
    });
  };

  const addClause = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clauses: [...prev.clauses, { title: "", body: "", enabled: true }],
      };
    });
  };

  const removeClause = (idx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, clauses: prev.clauses.filter((_, i) => i !== idx) };
    });
  };

  const canGoNext = (s: Step): boolean => {
    if (!draft) return false;
    if (s === 0) {
      return Boolean(draft.freelancer.name.trim() && draft.freelancer.email.trim());
    }
    if (s === 1) {
      return Boolean(draft.client.name.trim() && draft.client.email.trim());
    }
    if (s === 2) {
      return Boolean(draft.projectTitle.trim());
    }
    if (s === 3) {
      return Boolean(draft.totalFee.trim());
    }
    return true;
  };

  const goNext = () => {
    if (!canGoNext(step)) return;
    setStep((s) => (Math.min(s + 1, STEPS.length - 1) as Step));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => (Math.max(s - 1, 0) as Step));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSend = () => {
    if (!draft) return;
    const problems = validateDraftForSubmit(draft);
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }
    setErrors([]);
    saveDraft(draft);
    trackRiskCheckEvent("cta_click", {
      source: "contract-builder",
      target: "register",
      clauseCount: draft.clauses.filter((c) => c.enabled).length,
    });
    router.push(`/register?draft=${encodeURIComponent(draft.id)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/risk-check" className="flex items-center gap-2">
              <PenTool className="w-7 h-7 text-indigo-600" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                OneSign
              </span>
              <span className="hidden sm:inline text-sm text-slate-500 ml-2">
                Contract builder
              </span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Draft saved automatically</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 mt-8 shadow-sm">
          {step === 0 && (
            <StepYouDetails
              draft={draft}
              updateParty={updateParty}
            />
          )}
          {step === 1 && (
            <StepClient draft={draft} updateParty={updateParty} />
          )}
          {step === 2 && (
            <StepProject draft={draft} update={update} />
          )}
          {step === 3 && (
            <StepFees draft={draft} update={update} />
          )}
          {step === 4 && (
            <StepClauses
              draft={draft}
              toggleClause={toggleClause}
              updateClause={updateClause}
              addClause={addClause}
              removeClause={removeClause}
              errors={errors}
              onSend={handleSend}
            />
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between items-center mt-6">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <Link
              href={
                draft.sourceAnswers
                  ? `/risk-check/result?r=${draft.sourceAnswers}`
                  : "/risk-check"
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Risk Check
            </Link>
          )}

          {step < STEPS.length - 1 && (
            <button
              onClick={goNext}
              disabled={!canGoNext(step)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Reassurance */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Your draft is saved in this browser only. No account needed until you&apos;re
          ready to send to your client.
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="hidden sm:flex items-center justify-between">
      {STEPS.map((s, idx) => {
        const Icon = s.icon;
        const complete = idx < currentStep;
        const active = idx === currentStep;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  complete
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : active
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                }`}
              >
                {complete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div
                className={`text-xs font-semibold text-center max-w-[7rem] ${
                  active
                    ? "text-indigo-700 dark:text-indigo-300"
                    : complete
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {s.label}
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 -mt-5 ${
                  complete ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step content components
// ---------------------------------------------------------------------------

interface PartyUpdater {
  (
    which: "freelancer" | "client",
    field: keyof ContractDraft["freelancer"],
    value: string
  ): void;
}

function StepYouDetails({
  draft,
  updateParty,
}: {
  draft: ContractDraft;
  updateParty: PartyUpdater;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Step 1 of 5"
        title="Who's sending this?"
        subtitle="This is you — the freelancer or business about to sign with a client."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Your full name"
          value={draft.freelancer.name}
          onChange={(v) => updateParty("freelancer", "name", v)}
          placeholder="Jane Doe"
          required
        />
        <TextField
          label="Your email"
          type="email"
          value={draft.freelancer.email}
          onChange={(v) => updateParty("freelancer", "email", v)}
          placeholder="you@yourbusiness.com"
          required
        />
      </div>
      <TextField
        label="Business name (optional)"
        value={draft.freelancer.business ?? ""}
        onChange={(v) => updateParty("freelancer", "business", v)}
        placeholder="Acme Design Co."
      />
    </div>
  );
}

function StepClient({
  draft,
  updateParty,
}: {
  draft: ContractDraft;
  updateParty: PartyUpdater;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Step 2 of 5"
        title="Who's signing?"
        subtitle="We'll send the contract to this person's email. Make sure this is the person who can authorize payment."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Client full name"
          value={draft.client.name}
          onChange={(v) => updateParty("client", "name", v)}
          placeholder="Alex Chen"
          required
        />
        <TextField
          label="Client email"
          type="email"
          value={draft.client.email}
          onChange={(v) => updateParty("client", "email", v)}
          placeholder="alex@clientcompany.com"
          required
        />
      </div>
      <TextField
        label="Client company (optional)"
        value={draft.client.business ?? ""}
        onChange={(v) => updateParty("client", "business", v)}
        placeholder="Client Co."
      />
      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-900 dark:text-amber-200">
        <strong>Tip:</strong> this must be the person with signing authority. If
        your point of contact isn&apos;t the budget holder, delays are built in.
      </div>
    </div>
  );
}

function StepProject({
  draft,
  update,
}: {
  draft: ContractDraft;
  update: <K extends keyof ContractDraft>(k: K, v: ContractDraft[K]) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Step 3 of 5"
        title="What's the project?"
        subtitle="Name it plainly and describe the scope clearly — vague scope is where freelancers bleed."
      />
      <TextField
        label="Project title"
        value={draft.projectTitle}
        onChange={(v) => update("projectTitle", v)}
        placeholder="Brand identity refresh"
        required
      />
      <TextArea
        label="Scope — what exactly are you delivering?"
        value={draft.projectScope}
        onChange={(v) => update("projectScope", v)}
        placeholder={
          "Examples:\n• Logo in 3 variants + 2 rounds of revisions\n• Brand guidelines PDF (up to 15 pages)\n• 5 social media templates\n\nAnything not listed here is outside scope and requires a change order."
        }
        rows={8}
      />
    </div>
  );
}

function StepFees({
  draft,
  update,
}: {
  draft: ContractDraft;
  update: <K extends keyof ContractDraft>(k: K, v: ContractDraft[K]) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Step 4 of 5"
        title="Fees and timeline"
        subtitle="Specific numbers beat vague promises. Every field you fill in here is a future argument you're preventing."
      />
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <TextField
            label="Total project fee"
            value={draft.totalFee}
            onChange={(v) => update("totalFee", v)}
            placeholder="5,000"
            required
          />
        </div>
        <SelectField
          label="Currency"
          value={draft.currency}
          onChange={(v) => update("currency", v)}
          options={[
            { value: "USD", label: "USD ($)" },
            { value: "EUR", label: "EUR (€)" },
            { value: "GBP", label: "GBP (£)" },
            { value: "CAD", label: "CAD (C$)" },
            { value: "AUD", label: "AUD (A$)" },
            { value: "INR", label: "INR (₹)" },
          ]}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          label="Deposit required"
          value={String(draft.depositPercent)}
          onChange={(v) => update("depositPercent", Number(v))}
          options={[
            { value: "0", label: "No deposit" },
            { value: "25", label: "25% upfront" },
            { value: "33", label: "33% upfront" },
            { value: "50", label: "50% upfront" },
            { value: "75", label: "75% upfront" },
            { value: "100", label: "100% upfront" },
          ]}
          helper="Clients who won't commit a deposit are the #1 predictor of non-payment."
        />
        <SelectField
          label="Payment terms"
          value={draft.paymentTerms}
          onChange={(v) => update("paymentTerms", v as ContractDraft["paymentTerms"])}
          options={PAYMENT_TERMS.map((t) => ({ value: t, label: t }))}
          helper="Net 15 is the sweet spot — long enough to be reasonable, short enough to stay healthy."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Start date"
          type="date"
          value={draft.startDate}
          onChange={(v) => update("startDate", v)}
        />
        <TextField
          label="Target delivery date"
          type="date"
          value={draft.deliveryDate}
          onChange={(v) => update("deliveryDate", v)}
        />
      </div>
    </div>
  );
}

function StepClauses({
  draft,
  toggleClause,
  updateClause,
  addClause,
  removeClause,
  errors,
  onSend,
}: {
  draft: ContractDraft;
  toggleClause: (idx: number) => void;
  updateClause: (idx: number, field: keyof DraftClause, value: string) => void;
  addClause: () => void;
  removeClause: (idx: number) => void;
  errors: string[];
  onSend: () => void;
}) {
  const enabledCount = useMemo(
    () => draft.clauses.filter((c) => c.enabled).length,
    [draft.clauses]
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Step 5 of 5"
        title="Your protective clauses"
        subtitle={
          draft.sourceAnswers
            ? "We pre-loaded these based on your Risk Check. Toggle, edit, or add clauses — then send."
            : "These clauses patch the most common ways freelancers get burned. Edit any wording that doesn't match your voice."
        }
      />

      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900 dark:text-indigo-200">
          <strong>{enabledCount}</strong> clause{enabledCount === 1 ? "" : "s"}{" "}
          enabled. More clauses = more protection. When in doubt, keep them all on.
        </div>
      </div>

      <div className="space-y-4">
        {draft.clauses.map((clause, idx) => (
          <ClauseEditor
            key={idx}
            clause={clause}
            onToggle={() => toggleClause(idx)}
            onChangeTitle={(v) => updateClause(idx, "title", v)}
            onChangeBody={(v) => updateClause(idx, "body", v)}
            onRemove={() => removeClause(idx)}
            number={idx + 1}
          />
        ))}
      </div>

      <button
        onClick={addClause}
        type="button"
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:border-indigo-600 hover:text-indigo-600 font-medium text-sm"
      >
        <Plus className="w-4 h-4" />
        Add a custom clause
      </button>

      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-lg">
          <div className="font-semibold text-rose-900 dark:text-rose-200 text-sm mb-1">
            A few things to fix before sending:
          </div>
          <ul className="list-disc pl-5 text-sm text-rose-800 dark:text-rose-300 space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Review summary + Send */}
      <div className="mt-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Final review
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <SummaryRow label="From" value={draft.freelancer.name} hint={draft.freelancer.email} />
          <SummaryRow label="To" value={draft.client.name} hint={draft.client.email} />
          <SummaryRow label="Project" value={draft.projectTitle || "—"} />
          <SummaryRow
            label="Fee"
            value={
              draft.totalFee
                ? `${formatCurrencySymbol(draft.currency)}${draft.totalFee} ${draft.currency}`
                : "—"
            }
            hint={
              draft.depositPercent > 0
                ? `${draft.depositPercent}% deposit · ${draft.paymentTerms}`
                : draft.paymentTerms
            }
          />
          <SummaryRow
            label="Timeline"
            value={
              draft.startDate && draft.deliveryDate
                ? `${draft.startDate} → ${draft.deliveryDate}`
                : draft.startDate || draft.deliveryDate || "—"
            }
          />
          <SummaryRow label="Protective clauses" value={`${enabledCount} enabled`} />
        </div>

        <button
          onClick={onSend}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-base shadow-md"
        >
          <Send className="w-5 h-5" />
          Send to my client
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
          Free to send — no credit card. We&apos;ll create your account on the next
          screen and email the contract to {draft.client.email || "your client"}.
        </p>
      </div>
    </div>
  );
}

function ClauseEditor({
  clause,
  onToggle,
  onChangeTitle,
  onChangeBody,
  onRemove,
  number,
}: {
  clause: DraftClause;
  onToggle: () => void;
  onChangeTitle: (v: string) => void;
  onChangeBody: (v: string) => void;
  onRemove: () => void;
  number: number;
}) {
  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 ${
        clause.enabled
          ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-indigo-700 dark:text-indigo-300">
          CLAUSE {String(number).padStart(2, "0")}
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-600"
              checked={clause.enabled}
              onChange={onToggle}
            />
            {clause.enabled ? "Enabled" : "Disabled"}
          </label>
          <button
            onClick={onRemove}
            type="button"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
            aria-label="Remove clause"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <input
        type="text"
        value={clause.title}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="Clause title"
        className="w-full mb-2 text-base font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
      />
      <textarea
        value={clause.body}
        onChange={(e) => onChangeBody(e.target.value)}
        placeholder="Clause body"
        rows={3}
        className="w-full text-sm text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none resize-y leading-relaxed"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small UI primitives local to the wizard
// ---------------------------------------------------------------------------

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <div className="text-xs font-bold tracking-widest text-indigo-600 mb-1">
        {eyebrow}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block mb-4">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block mb-4">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  helper?: string;
}) {
  return (
    <label className="block mb-4">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {helper && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helper}</div>
      )}
    </label>
  );
}

function SummaryRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold mb-0.5">
        {label}
      </div>
      <div className="text-slate-900 dark:text-white font-medium truncate">
        {value}
      </div>
      {hint && (
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {hint}
        </div>
      )}
    </div>
  );
}

function formatCurrencySymbol(code: string): string {
  const map: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
    INR: "₹",
  };
  return map[code] ?? "";
}
