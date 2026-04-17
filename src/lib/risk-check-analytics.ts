/**
 * Client-side analytics helper for the Risk Check.
 *
 * Uses navigator.sendBeacon when available (survives page navigation) and
 * falls back to fetch with keepalive. Never throws — analytics must not
 * disrupt UX.
 */

export type RiskCheckEvent =
  | "start"
  | "complete"
  | "share"
  | "copy_clause"
  | "copy_all"
  | "lead_captured"
  | "cta_click";

export function trackRiskCheckEvent(
  event: RiskCheckEvent,
  payload?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({ event, payload });
  const url = "/api/risk-check/events";

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    // Fallback — fire-and-forget
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* noop */
    });
  } catch {
    /* noop */
  }
}
