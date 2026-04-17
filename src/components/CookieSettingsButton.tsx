"use client";

/**
 * Renders a button on the Cookie Policy page that lets the user reopen
 * the consent banner to review or change their previous choice. Makes
 * withdrawing consent "as easy as giving it" (GDPR Art. 7(3)).
 *
 * Implementation: deletes the `onesign_consent` cookie and reloads the
 * page. The root layout will then mount a fresh CookieConsentBanner.
 */
export default function CookieSettingsButton() {
  const reopen = () => {
    if (typeof document === "undefined") return;
    const isSecure = window.location.protocol === "https:";
    document.cookie =
      `onesign_consent=; max-age=0; path=/; SameSite=Lax;` +
      (isSecure ? " Secure;" : "");
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={reopen}
      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
    >
      Manage cookie preferences
    </button>
  );
}
