"use client";

import { useEffect } from "react";
import {
  trackRiskCheckEvent,
  type RiskCheckEvent,
} from "@/lib/risk-check-analytics";

interface Props {
  event: RiskCheckEvent;
  payload?: Record<string, unknown>;
}

/**
 * Fires a single analytics event on mount. Use once per page.
 */
export default function AnalyticsBeacon({ event, payload }: Props) {
  useEffect(() => {
    trackRiskCheckEvent(event, payload);
    // We intentionally only fire on mount. Stringify for stable deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
