import { Suspense } from "react";
import ClaimDraftClient from "@/components/risk-check/ClaimDraftClient";

export const dynamic = "force-dynamic";

/**
 * Post-auth handoff: reads the user's anonymous contract draft from
 * localStorage and converts it into a real Document row.
 *
 * Runs once, immediately after signup or login when the user came in via
 * the risk-check contract flow.
 */
export default function ClaimDraftPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <ClaimDraftClient />
    </Suspense>
  );
}
