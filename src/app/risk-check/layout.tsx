import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deadbeat Client Risk Check — Free Tool | OneSign",
  description:
    "Before you sign with that prospect, run a 90-second risk check. 12 questions predict whether they'll pay on time — and give you the exact contract clauses to protect yourself.",
  openGraph: {
    title: "Deadbeat Client Risk Check — Free, 90 Seconds",
    description:
      "Before you sign with that prospect, run this 90-second check. 12 questions predict whether they'll pay — and give you the exact contract clauses to protect yourself.",
    type: "website",
    siteName: "OneSign",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deadbeat Client Risk Check — Free, 90 Seconds",
    description:
      "12 questions that predict whether your next client will actually pay. Free, no signup.",
  },
};

export default function RiskCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
