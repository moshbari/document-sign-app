import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and similar technologies OneSign uses, why, and how to control them.",
};

export default function CookiesPage() {
  return (
    <>
      <span className="meta">Cookie Policy</span>
      <h1>Cookie Policy</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <div className="not-prose my-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-700 dark:text-slate-300 m-0">
          Review or change the cookie categories you&rsquo;ve agreed to.
        </p>
        <CookieSettingsButton />
      </div>

      <p>
        This Cookie Policy explains how {C.legalEntity} (&ldquo;
        {C.productName}&rdquo;) uses cookies and similar technologies on{" "}
        {C.domain} and in the Service. It should be read together with our{" "}
        <a href="/legal/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        A cookie is a small text file placed on your device by a website you
        visit. Cookies allow a site to recognise your device and remember
        information about your visit. We also use similar technologies such as
        <em> local storage</em>, <em>session storage</em>, and{" "}
        <em>web beacons</em>; in this policy we use the term &ldquo;
        cookies&rdquo; to refer to all of them.
      </p>

      <h2>2. How we categorise cookies</h2>
      <p>
        Under the EU ePrivacy Directive, the UK Privacy and Electronic
        Communications Regulations, and similar laws, we only set
        non-essential cookies after you give consent through our cookie
        banner. You can change your choices at any time by clicking{" "}
        <em>Cookie settings</em> in the footer.
      </p>

      <h3>Strictly necessary (always on)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>authjs.session-token / next-auth.session-token</td>
            <td>
              Keeps you logged in after you authenticate. Required for the
              Service to work.
            </td>
            <td>Session or up to 30 days if &ldquo;remember me&rdquo;</td>
          </tr>
          <tr>
            <td>authjs.csrf-token / next-auth.csrf-token</td>
            <td>Protects against cross-site request forgery.</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>authjs.callback-url / next-auth.callback-url</td>
            <td>Restores the page you intended to reach after login.</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>onesign_consent</td>
            <td>Stores your cookie-banner preferences.</td>
            <td>12 months</td>
          </tr>
        </tbody>
      </table>

      <h3>Functional (opt-in)</h3>
      <p>
        These cookies remember choices you make to improve your experience,
        such as your theme preference. They are not essential but they make
        the site nicer to use.
      </p>

      <h3>Analytics (opt-in)</h3>
      <p>
        Analytics cookies help us understand how the Service is used so we
        can improve it. They do not identify you personally on their own. We
        use privacy-respecting analytics and configure it to anonymise IP
        addresses and to respect the &ldquo;Do Not Track&rdquo; and Global
        Privacy Control signals where technically possible.
      </p>

      <h3>Marketing (opt-in)</h3>
      <p>
        If we run paid advertising campaigns, marketing cookies may be set by
        advertising partners to measure the effectiveness of those campaigns.
        We do not currently use marketing cookies but reserve the right to do
        so; if we enable them, we will update this policy and ask for your
        consent before they are set.
      </p>

      <h2>3. Third-party cookies</h2>
      <p>
        Some cookies may be set by third-party services we embed (for
        example, payment processors on the billing page, or support-widget
        providers). Their use is governed by the relevant third party&rsquo;s
        own cookie and privacy notices. Our current list of sub-processors is
        at <a href="/legal/subprocessors">/legal/subprocessors</a>.
      </p>

      <h2>4. How to control cookies</h2>
      <ul>
        <li>
          Use the <em>Cookie settings</em> link in the footer to change your
          consent choices at any time.
        </li>
        <li>
          Modern browsers let you block or delete cookies in their privacy
          settings. Blocking strictly-necessary cookies will prevent you from
          signing in to the Service.
        </li>
        <li>
          You can opt out of analytics device-wide via your browser&rsquo;s
          Do Not Track or Global Privacy Control setting; we honour these
          signals.
        </li>
      </ul>

      <h2>5. Changes</h2>
      <p>
        If we add new cookies or change how existing cookies are used, we
        will update this policy and the list in Section 2 and, where legally
        required, ask for your consent again.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>.
      </p>
    </>
  );
}
