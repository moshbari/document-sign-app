import type { Metadata } from "next";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const metadata: Metadata = {
  title: "OneSign - Digital Document Signing",
  description: "Sign documents digitally, securely, and instantly with OneSign.",
  keywords: ["document signing", "digital signature", "secure signing", "e-signature"],
  authors: [{ name: "OneSign" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-foreground font-sans">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
