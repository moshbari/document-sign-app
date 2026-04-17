import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Risk Check analytics event receiver.
 *
 * Kept intentionally simple: accepts a JSON body with { event, payload? } and
 * logs it to stdout (Railway captures these). If RISK_CHECK_ANALYTICS_WEBHOOK
 * is set, the event is also forwarded there. No database write.
 *
 * Events fired by the UI:
 *   - "start"          — quiz opened (once per session)
 *   - "complete"       — result page rendered
 *   - "share"          — user invoked native share or copied link
 *   - "copy_clause"    — user copied a single clause
 *   - "copy_all"       — user copied every clause
 *   - "lead_captured"  — user submitted email
 *   - "cta_click"      — user clicked the "Start with OneSign" button
 */

interface EventBody {
  event?: string;
  payload?: Record<string, unknown>;
}

const KNOWN_EVENTS = new Set([
  "start",
  "complete",
  "share",
  "copy_clause",
  "copy_all",
  "lead_captured",
  "cta_click",
]);

export async function POST(req: Request) {
  let body: EventBody;
  try {
    body = (await req.json()) as EventBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = (body.event || "").toString();
  if (!KNOWN_EVENTS.has(event)) {
    return NextResponse.json({ ok: false, error: "unknown_event" }, { status: 400 });
  }

  const record = {
    event,
    payload: body.payload ?? null,
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? null,
    referer: req.headers.get("referer") ?? null,
  };

  console.log("[risk-check event]", JSON.stringify(record));

  const webhook = process.env.RISK_CHECK_ANALYTICS_WEBHOOK;
  if (webhook) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
        signal: controller.signal,
      });
      clearTimeout(timer);
    } catch {
      // swallow — analytics shouldn't break user flow
    }
  }

  return NextResponse.json({ ok: true });
}
