import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Claim-a-draft endpoint.
 *
 * Takes an anonymous contract draft (built client-side at /risk-check/contract
 * and persisted in the user's localStorage) and turns it into a real
 * Document + Signer row tied to the now-authenticated user.
 *
 * Must only be called by an authenticated user — the session is what ties
 * the draft to a concrete owner. The draft itself comes from the client
 * because it was never persisted server-side.
 */

interface DraftClauseIn {
  title?: unknown;
  body?: unknown;
  enabled?: unknown;
}

interface DraftPartyIn {
  name?: unknown;
  email?: unknown;
  business?: unknown;
}

interface DraftIn {
  id?: unknown;
  freelancer?: DraftPartyIn;
  client?: DraftPartyIn;
  projectTitle?: unknown;
  projectScope?: unknown;
  totalFee?: unknown;
  currency?: unknown;
  depositPercent?: unknown;
  startDate?: unknown;
  deliveryDate?: unknown;
  paymentTerms?: unknown;
  clauses?: unknown;
  sourceAnswers?: unknown;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: DraftIn;
  try {
    body = (await request.json()) as DraftIn;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ----- Validate minimal shape -----
  const freelancerName = asString(body.freelancer?.name).trim();
  const freelancerEmail = asString(body.freelancer?.email).trim().toLowerCase();
  const clientName = asString(body.client?.name).trim();
  const clientEmail = asString(body.client?.email).trim().toLowerCase();
  const projectTitle = asString(body.projectTitle).trim();

  if (!clientName || !clientEmail || !projectTitle) {
    return NextResponse.json(
      { error: "Draft is missing required fields" },
      { status: 400 }
    );
  }
  if (!isValidEmail(clientEmail)) {
    return NextResponse.json(
      { error: "Client email is invalid" },
      { status: 400 }
    );
  }

  // ----- Normalize clauses -----
  const rawClauses = Array.isArray(body.clauses) ? body.clauses : [];
  const clauses = (rawClauses as DraftClauseIn[])
    .filter(
      (c) =>
        c &&
        typeof c === "object" &&
        typeof c.title === "string" &&
        typeof c.body === "string" &&
        c.enabled !== false
    )
    .map((c) => ({
      title: asString(c.title).trim(),
      body: asString(c.body).trim(),
    }))
    .filter((c) => c.title && c.body);

  if (clauses.length === 0) {
    return NextResponse.json(
      { error: "At least one protective clause is required" },
      { status: 400 }
    );
  }

  // ----- Build the Document content JSON -----
  const content = {
    kind: "risk-check-contract",
    version: 1,
    freelancer: {
      name: freelancerName,
      email: freelancerEmail,
      business: asString(body.freelancer?.business).trim() || null,
    },
    client: {
      name: clientName,
      email: clientEmail,
      business: asString(body.client?.business).trim() || null,
    },
    project: {
      title: projectTitle,
      scope: asString(body.projectScope).trim(),
    },
    fees: {
      totalFee: asString(body.totalFee).trim(),
      currency: asString(body.currency, "USD"),
      depositPercent: asNumber(body.depositPercent),
      paymentTerms: asString(body.paymentTerms, "Net 15"),
    },
    dates: {
      startDate: asString(body.startDate),
      deliveryDate: asString(body.deliveryDate),
    },
    clauses,
    sourceAnswers: asString(body.sourceAnswers) || null,
  };

  try {
    // Create the document as DRAFT so the user can review before sending.
    // (The existing POST /api/documents flow flips straight to PENDING; here
    // we deliberately leave it in DRAFT so the user confirms recipients on
    // the document page before invites go out.)
    const document = await db.document.create({
      data: {
        title: projectTitle,
        content,
        status: "DRAFT",
        createdById: session.user.id,
      },
    });

    // Pre-seed a signer row for the client so the document page has them ready.
    await db.signer.create({
      data: {
        name: clientName,
        email: clientEmail,
        documentId: document.id,
        token: uuidv4(),
        status: "PENDING",
      },
    });

    // Audit trail
    await db.auditLog.create({
      data: {
        documentId: document.id,
        action: "created_from_risk_check",
        performedBy: session.user.email || session.user.id,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({ id: document.id, status: "DRAFT" }, { status: 201 });
  } catch (err) {
    console.error("[from-draft] failed", err);
    return NextResponse.json(
      { error: "Failed to create document from draft" },
      { status: 500 }
    );
  }
}
