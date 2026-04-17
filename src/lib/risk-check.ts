/**
 * Deadbeat Client Risk Reviewer — shared logic.
 *
 * Scoring is deterministic and stateless. Answers are encoded into a short URL
 * parameter so results are shareable without any database write.
 *
 * Encoding: a 12-character string of digits '0', '1', '2' — one per question.
 * Example: "001220110020"
 */

export type AnswerIndex = 0 | 1 | 2;

export interface QuestionOption {
  label: string;
  score: number;
}

export interface Question {
  key: string;
  prompt: string;
  hint?: string;
  options: [QuestionOption, QuestionOption, QuestionOption];
  /** Clause to add to the contract when this flag scores > 0. */
  clauseTitle: string;
  clauseBody: string;
}

export const QUESTIONS: Question[] = [
  {
    key: "deposit",
    prompt:
      "Have they agreed to pay a deposit (25–50%) before work begins?",
    hint: "A client who won't commit a deposit is the #1 predictor of a non-paying client.",
    options: [
      { label: "Yes — no pushback", score: 0 },
      { label: "Negotiating or want a smaller deposit", score: 6 },
      { label: "They refuse, or want “pay on delivery”", score: 12 },
    ],
    clauseTitle: "Require a cleared deposit before kickoff",
    clauseBody:
      "Work does not begin until the deposit (25–50% of total fee) has cleared in my account. If the deposit is delayed, the project start date and delivery dates shift by the same number of days.",
  },
  {
    key: "scope",
    prompt: "Is the full scope of work written down and mutually agreed?",
    hint: "Undocumented scope = infinite free revisions. This is where freelancers bleed.",
    options: [
      { label: "Yes — signed SOW or detailed proposal", score: 0 },
      { label: "Agreed in email/chat only", score: 5 },
      { label: "Verbal only — we'll “figure it out”", score: 10 },
    ],
    clauseTitle: "Lock scope + change-order clause",
    clauseBody:
      "Deliverables and scope are defined in §Scope. Any work outside that scope — including “small adds” — requires a written change order and is billed at the current hourly rate (minimum 2 hours per change).",
  },
  {
    key: "decision",
    prompt: "Is your point of contact the person who signs the check?",
    hint: "If your contact isn't the budget holder, expect delays every time payment is due.",
    options: [
      { label: "Yes — same person signs and pays", score: 0 },
      { label: "They need approval from a boss/committee", score: 4 },
      { label: "Unclear who actually approves payment", score: 8 },
    ],
    clauseTitle: "Require the budget holder on the contract",
    clauseBody:
      "The contract must be countersigned by an individual with signing authority for payment. All invoices will be addressed to that individual and that individual's email.",
  },
  {
    key: "rush",
    prompt: "Are they pressuring you to start before paperwork is done?",
    hint: "Urgency is a classic tactic to skip the contract. The rush rarely survives after you sign.",
    options: [
      { label: "No — happy to wait for the contract", score: 0 },
      { label: "Some urgency, but OK with a short pause", score: 6 },
      { label: "“Just start now, we'll do the contract later”", score: 10 },
    ],
    clauseTitle: "No work without signed agreement",
    clauseBody:
      "No work — including discovery, strategy, or drafts — is considered part of this engagement until the contract is signed and deposit has cleared. Any pre-contract conversations are informational only.",
  },
  {
    key: "haggle",
    prompt: "Have they tried to reduce the rate after scope was agreed?",
    hint: "Clients who haggle up front will haggle harder at invoice time.",
    options: [
      { label: "No", score: 0 },
      { label: "Once, and moved on when I held firm", score: 4 },
      { label: "Multiple times, or still ongoing", score: 8 },
    ],
    clauseTitle: "Fixed rate, no retroactive changes",
    clauseBody:
      "The rate stated in this agreement is fixed for the duration of the project. Reductions are only valid if accompanied by a mutually signed change order that also reduces scope.",
  },
  {
    key: "exposure",
    prompt:
      "Have they offered “exposure,” portfolio rights, or future work instead of full pay?",
    hint: "Exposure bait is the adult version of asking you to work for free.",
    options: [
      { label: "Never mentioned", score: 0 },
      { label: "Mentioned as a bonus", score: 4 },
      { label: "Pitched as core value instead of money", score: 10 },
    ],
    clauseTitle: "Separate fee from promotion",
    clauseBody:
      "The fee in this agreement is not reduced in exchange for credit, testimonials, or promotion. Any promotional rights (portfolio use, case studies, social posts) are granted in §Portfolio Rights and are independent of payment.",
  },
  {
    key: "spec",
    prompt: "Are they asking for spec work — unpaid trials or sample deliverables?",
    hint: "Real clients pay for discovery. Prospects who won't are shopping, not buying.",
    options: [
      { label: "No", score: 0 },
      { label: "Small sample (30 min or less)", score: 4 },
      { label: "Full unpaid trial, audit, or design", score: 10 },
    ],
    clauseTitle: "No unpaid work — ever",
    clauseBody:
      "All work product — including drafts, outlines, wireframes, audits, and discovery notes — is billable from the moment I begin. No “trial” work is included in this engagement.",
  },
  {
    key: "reputation",
    prompt: "Can you verify their past work with other freelancers/vendors?",
    hint: "A 5-minute search on LinkedIn, Twitter, and freelancer forums is free insurance.",
    options: [
      { label: "Yes — clear track record", score: 0 },
      { label: "Limited info online", score: 4 },
      { label: "Nothing findable, or complaints exist", score: 8 },
    ],
    clauseTitle: "Due-diligence safeguard",
    clauseBody:
      "Before countersigning, request two references from prior vendors/freelancers. Add a 30-day termination-for-convenience clause so you can exit early if red flags appear mid-project.",
  },
  {
    key: "comms",
    prompt: "How responsive are they during the sales conversation?",
    hint: "How they communicate now is how they'll communicate when you're chasing an invoice.",
    options: [
      { label: "Answers within agreed SLA", score: 0 },
      { label: "Sometimes slow, usually gets back", score: 3 },
      { label: "Often silent, chaotic, or unpredictable", score: 8 },
    ],
    clauseTitle: "Set a communication SLA",
    clauseBody:
      "Client agrees to respond to project communications within 2 business days. Delays beyond 5 business days pause the project timeline and may trigger a reactivation fee to resume.",
  },
  {
    key: "terms",
    prompt: "Do they accept your payment terms (Net 15/30)?",
    hint: "Long payment terms + one bad client = you become their free interest-free lender.",
    options: [
      { label: "Yes — accepted as stated", score: 0 },
      { label: "Want Net 60+ or stretched terms", score: 6 },
      { label: "Only want to pay on full completion", score: 10 },
    ],
    clauseTitle: "Net 15 with late-fee teeth",
    clauseBody:
      "Invoices are due Net 15 from the date issued. Invoices overdue by 10 days accrue a 1.5% monthly late fee and all deliverables are withheld (revocable license) until balance is paid in full.",
  },
  {
    key: "creep",
    prompt: "Have you heard “while you're at it” or “quick add” during scoping?",
    hint: "These phrases predict 20%+ scope creep. Every time.",
    options: [
      { label: "No", score: 0 },
      { label: "Once", score: 3 },
      { label: "Multiple times", score: 8 },
    ],
    clauseTitle: "Scope-creep tripwire",
    clauseBody:
      "Any request outside §Scope — regardless of how small — is logged as a change request. Changes totaling more than 1 hour of work require a written change order before I proceed.",
  },
  {
    key: "contract",
    prompt: "Are they comfortable signing a proper contract?",
    hint: "A client who won't sign a contract is telling you exactly how they plan to treat your invoice.",
    options: [
      { label: "Yes — happy to sign", score: 0 },
      { label: "Prefer a handshake but will sign if asked", score: 6 },
      { label: "Refusing or dodging contracts", score: 12 },
    ],
    clauseTitle: "No contract, no project",
    clauseBody:
      "This is non-negotiable: no work begins without a signed agreement. If the client refuses to sign a written contract, decline the project — the financial risk is not recoverable by any other clause.",
  },
];

export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
  0
);

export type RiskLevel = "green" | "yellow" | "red";

export interface RiskResult {
  answers: AnswerIndex[];
  rawScore: number;
  maxScore: number;
  percent: number;
  level: RiskLevel;
  headline: string;
  subhead: string;
  flags: Array<{
    question: Question;
    answer: QuestionOption;
    score: number;
  }>;
  clauses: Array<{ title: string; body: string }>;
}

export function levelFromPercent(pct: number): RiskLevel {
  if (pct >= 55) return "red";
  if (pct >= 25) return "yellow";
  return "green";
}

const HEADLINES: Record<RiskLevel, { headline: string; subhead: string }> = {
  green: {
    headline: "Low risk — this client looks solid.",
    subhead:
      "No major red flags. Keep your standard contract and deposit terms. Don't skip them just because things look easy.",
  },
  yellow: {
    headline: "Caution — proceed with armor on.",
    subhead:
      "This client has some warning signs freelancers routinely get burned by. Don't walk away — but don't start work until every flag below is addressed in the contract.",
  },
  red: {
    headline: "High risk — do not start work without changes.",
    subhead:
      "This prospect shows the pattern that non-paying clients consistently show. Every flag below must be addressed in writing, or you should consider walking away.",
  },
};

export function scoreAnswers(answers: AnswerIndex[]): RiskResult {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(
      `Expected ${QUESTIONS.length} answers, got ${answers.length}`
    );
  }

  const flags: RiskResult["flags"] = [];
  let rawScore = 0;

  QUESTIONS.forEach((q, i) => {
    const answer = q.options[answers[i]];
    rawScore += answer.score;
    if (answer.score > 0) {
      flags.push({ question: q, answer, score: answer.score });
    }
  });

  flags.sort((a, b) => b.score - a.score);

  const percent = Math.round((rawScore / MAX_SCORE) * 100);
  const level = levelFromPercent(percent);
  const { headline, subhead } = HEADLINES[level];

  const clauses = flags.map((f) => ({
    title: f.question.clauseTitle,
    body: f.question.clauseBody,
  }));

  return {
    answers,
    rawScore,
    maxScore: MAX_SCORE,
    percent,
    level,
    headline,
    subhead,
    flags,
    clauses,
  };
}

/** Encode answers as a short URL-safe string. */
export function encodeAnswers(answers: AnswerIndex[]): string {
  return answers.map((a) => String(a)).join("");
}

/** Decode answers from the URL param. Returns null if malformed. */
export function decodeAnswers(raw: string | null | undefined): AnswerIndex[] | null {
  if (!raw || typeof raw !== "string") return null;
  if (raw.length !== QUESTIONS.length) return null;
  const out: AnswerIndex[] = [];
  for (const ch of raw) {
    if (ch !== "0" && ch !== "1" && ch !== "2") return null;
    out.push(Number(ch) as AnswerIndex);
  }
  return out;
}

export const LEVEL_COLORS: Record<
  RiskLevel,
  { bg: string; text: string; ring: string; dot: string; label: string }
> = {
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    label: "LOW RISK",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    label: "CAUTION",
  },
  red: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    dot: "bg-rose-500",
    label: "HIGH RISK",
  },
};
