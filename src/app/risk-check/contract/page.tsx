import { Suspense } from "react";
import ContractBuilder from "@/components/risk-check/ContractBuilder";

export const dynamic = "force-dynamic";

/**
 * Anonymous contract builder. No auth required — drafts live in localStorage
 * until the user hits "send to client", at which point they're routed through
 * signup and the draft is claimed server-side.
 */
export default function ContractBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <ContractBuilder />
    </Suspense>
  );
}
