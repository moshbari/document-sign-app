import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Risk Check email-capture endpoint.
 *
 * Design:
 *   - No database write. We don't want to couple the public free tool to the
 *     authenticated signing tables.
 *   - Forwards the lead to whatever webhook Mosh configures via
 *     RISK_CHECK_WEBHOOK_URL (ConvertKit, Zapier, Resend, Slack, etc.).
 *   - If no webhook is configured, the endpoint accepts the submission and
 *     logs it server-side. Nothing breaks — the user still sees success.
 *
 * Accepted body: { email: string, percent?: number, level?: string, source?: string }
 */

interface LeadBody {
  email?: string;
  percent?: number;
  level?: string;
  source?: string;
}

function isValidEmail(email: string): boolean {
  // Simple, permissive RFC-ish check — avoid rejecting valid addresses
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const payload = {
    email,
    percent: typeof body.percent === "number" ? body.percent : null,
    level: body.level ?? null,
    source: body.source ?? "risk-check",
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? null,
  };

  const webhook = process.env.RISK_CHECK_WEBHOOK_URL;

  if (webhook) {
    try {
      // Fire-and-wait (short timeout via AbortController) — we want to know if it failed.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        console.error("[risk-check lead] webhook non-2xx", res.status);
      }
    } catch (err) {
      console.error("[risk-check lead] webhook failed", err);
      // Don't fail the user — we've accepted their email.
    }
  } else {
    // No webhook configured — surface the capture in logs so Mosh can grep.
    console.log("[risk-check lead]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
