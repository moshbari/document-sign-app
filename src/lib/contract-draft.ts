/**
 * Anonymous contract draft — localStorage helpers.
 *
 * A draft is everything a freelancer builds before they sign up. We store it
 * client-side so nothing touches the database until they actually claim it.
 *
 * Storage shape (localStorage):
 *   onesign:draft:<draftId>   → ContractDraft JSON
 *   onesign:draft:latest      → <draftId>   (pointer to most-recent draft)
 *
 * Draft IDs are random URL-safe strings. We never derive them from PII.
 */

export interface DraftParty {
  name: string;
  email: string;
  business?: string;
}

export interface DraftClause {
  title: string;
  body: string;
  /** User-toggled off clauses are excluded when the contract is generated. */
  enabled: boolean;
}

export interface ContractDraft {
  /** Persistent draft ID, also used as the URL param during claim. */
  id: string;
  /** Schema version for forward-compat. */
  version: 1;
  createdAt: string;
  updatedAt: string;

  // Source of the clauses (risk-check answers string, when applicable).
  sourceAnswers?: string;

  // Parties
  freelancer: DraftParty;
  client: DraftParty;

  // Project
  projectTitle: string;
  projectScope: string;

  // Fees + timeline
  totalFee: string; // keep as string so we don't strip the user's formatting
  currency: string; // "USD", "EUR", etc.
  depositPercent: number; // 0-100
  startDate: string; // ISO yyyy-mm-dd
  deliveryDate: string; // ISO yyyy-mm-dd
  paymentTerms: "Net 7" | "Net 15" | "Net 30" | "Due on receipt";

  // Protective clauses (pre-filled from Risk Check, editable)
  clauses: DraftClause[];
}

const DRAFT_KEY = (id: string) => `onesign:draft:${id}`;
const LATEST_KEY = "onesign:draft:latest";

/** Random URL-safe id (no deps on crypto.subtle). */
export function newDraftId(): string {
  // 12 chars of base36 entropy ≈ 62 bits — plenty for client-only IDs.
  const rnd = () => Math.random().toString(36).slice(2, 8);
  return `${rnd()}${rnd()}`;
}

export function saveDraft(draft: ContractDraft): void {
  if (typeof window === "undefined") return;
  const stamped: ContractDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(DRAFT_KEY(draft.id), JSON.stringify(stamped));
    window.localStorage.setItem(LATEST_KEY, draft.id);
  } catch {
    // localStorage can throw (quota, private mode). Fail silently — the user
    // will see their work disappear on navigation, which is recoverable.
  }
}

export function loadDraft(id: string): ContractDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ContractDraft;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadLatestDraftId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LATEST_KEY);
  } catch {
    return null;
  }
}

export function clearDraft(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY(id));
    const latest = window.localStorage.getItem(LATEST_KEY);
    if (latest === id) {
      window.localStorage.removeItem(LATEST_KEY);
    }
  } catch {
    /* noop */
  }
}

export function emptyDraft(id?: string): ContractDraft {
  const now = new Date().toISOString();
  return {
    id: id ?? newDraftId(),
    version: 1,
    createdAt: now,
    updatedAt: now,
    freelancer: { name: "", email: "" },
    client: { name: "", email: "" },
    projectTitle: "",
    projectScope: "",
    totalFee: "",
    currency: "USD",
    depositPercent: 50,
    startDate: "",
    deliveryDate: "",
    paymentTerms: "Net 15",
    clauses: [],
  };
}

/**
 * Validates a draft payload shape before sending to the server.
 * Returns a list of human-readable error strings; empty array means valid.
 */
export function validateDraftForSubmit(draft: ContractDraft): string[] {
  const errs: string[] = [];
  if (!draft.freelancer.name.trim()) errs.push("Your name is required.");
  if (!draft.freelancer.email.trim()) errs.push("Your email is required.");
  if (!draft.client.name.trim()) errs.push("Client name is required.");
  if (!draft.client.email.trim()) errs.push("Client email is required.");
  if (!draft.projectTitle.trim()) errs.push("Project title is required.");
  if (!draft.totalFee.trim()) errs.push("Project fee is required.");
  const enabled = draft.clauses.filter((c) => c.enabled);
  if (enabled.length === 0) {
    errs.push("At least one protective clause must remain enabled.");
  }
  return errs;
}
