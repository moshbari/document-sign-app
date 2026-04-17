"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * OneSign first-party cookie consent banner.
 *
 * Writes a single cookie — `onesign_consent` — whose value is a
 * base64url-encoded JSON record of the user's choices. The shape matches
 * the lifetime and categories documented on /legal/cookies so that the
 * banner and the published policy cannot drift apart.
 *
 * Design notes:
 * - First-party only. No third-party CMP, no network call, no analytics
 *   hit until consent is granted.
 * - No non-essential cookies or scripts should be set anywhere in the
 *   app until `readConsent()` returns a record with the relevant
 *   category set to true. The `onesign-consent-updated` CustomEvent is
 *   dispatched when the user saves, so analytics loaders can subscribe.
 * - Strictly necessary is always true — it cannot be refused because
 *   the app literally cannot function without session + CSRF cookies.
 * - 13-month max-age matches the EDPB / CNIL guidance that consent
 *   should be re-asked at least every 13 months. The /legal/cookies
 *   page says "12 months" as a round number; 13 months here gives a
 *   small buffer before we re-prompt.
 */

const COOKIE_NAME = "onesign_consent";
const COOKIE_VERSION = 1;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 395; // ~13 months

export type ConsentCategories = {
  strictly_necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  v: number;
  ts: string; // ISO timestamp
  categories: ConsentCategories;
};

function encode(record: ConsentRecord): string {
  const json = JSON.stringify(record);
  // base64url so the cookie value is opaque and transport-safe
  if (typeof window === "undefined") return "";
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decode(value: string): ConsentRecord | null {
  try {
    const pad = "=".repeat((4 - (value.length % 4)) % 4);
    const b64 = (value + pad).replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json) as ConsentRecord;
    if (parsed && typeof parsed === "object" && parsed.v === COOKIE_VERSION) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return null;
  return decode(decodeURIComponent(match[1]));
}

function writeConsent(categories: ConsentCategories) {
  if (typeof document === "undefined") return;
  const record: ConsentRecord = {
    v: COOKIE_VERSION,
    ts: new Date().toISOString(),
    categories,
  };
  const value = encode(record);
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(value)};` +
    `max-age=${COOKIE_MAX_AGE_SECONDS};` +
    `path=/;` +
    `SameSite=Lax;` +
    (isSecure ? "Secure;" : "");
  window.dispatchEvent(
    new CustomEvent("onesign-consent-updated", { detail: record }),
  );
}

const ALL_OPT_IN: ConsentCategories = {
  strictly_necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const NONE_OPT_IN: ConsentCategories = {
  strictly_necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [choice, setChoice] = useState<ConsentCategories>(NONE_OPT_IN);

  useEffect(() => {
    // Only show the banner once the DOM is available and the user has
    // not already expressed a choice. This also avoids any flash of the
    // banner on every server-rendered page.
    const existing = readConsent();
    if (!existing) setVisible(true);
  }, []);

  if (!visible) return null;

  const saveAndClose = (c: ConsentCategories) => {
    writeConsent(c);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h2
                id="cookie-banner-title"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                We use cookies
              </h2>
              <p
                id="cookie-banner-body"
                className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                Strictly necessary cookies keep you signed in and protect
                OneSign against fraud. With your permission we may also use
                functional, analytics, or marketing cookies. You can change
                your choices at any time on our{" "}
                <Link
                  href="/legal/cookies"
                  className="underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {customize && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 opacity-70 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5"
                  aria-label="Strictly necessary (always on)"
                />
                <span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Strictly necessary
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                    Session, CSRF, load-balancer &mdash; cannot be refused.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={choice.functional}
                  onChange={(e) =>
                    setChoice((c) => ({ ...c, functional: e.target.checked }))
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Functional
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                    Remembers UI preferences like theme.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={choice.analytics}
                  onChange={(e) =>
                    setChoice((c) => ({ ...c, analytics: e.target.checked }))
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Analytics
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                    Privacy-respecting usage metrics, IP anonymised.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={choice.marketing}
                  onChange={(e) =>
                    setChoice((c) => ({ ...c, marketing: e.target.checked }))
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Marketing
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                    Cross-site ad measurement. Off by default.
                  </span>
                </span>
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:flex-wrap gap-2 sm:justify-end">
            {customize ? (
              <button
                type="button"
                onClick={() => saveAndClose(choice)}
                className="inline-flex justify-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                Save preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCustomize(true)}
                className="inline-flex justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Customize
              </button>
            )}
            <button
              type="button"
              onClick={() => saveAndClose(NONE_OPT_IN)}
              className="inline-flex justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() => saveAndClose(ALL_OPT_IN)}
              className="inline-flex justify-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
