import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Billing, renewals, cancellations, refunds, and the EU consumer cooling-off period for OneSign.",
};

export default function RefundPage() {
  return (
    <>
      <span className="meta">Refund &amp; Cancellation</span>
      <h1>Refund &amp; Cancellation Policy</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        This policy supplements our <a href="/legal/terms">Terms of Service</a>{" "}
        and explains how billing, renewals, cancellations, and refunds work
        on the {C.productName} service operated by {C.legalEntity}.
      </p>

      <h2>1. Billing and renewals</h2>
      <ul>
        <li>
          Paid subscriptions are billed in advance at the start of each
          billing period — either monthly or annually, as you chose at
          checkout.
        </li>
        <li>
          Unless you cancel before the end of the current billing period,
          your subscription renews automatically for another period of the
          same length at the then-current rate.
        </li>
        <li>
          We will email a receipt after each successful payment. You can
          view and download past invoices from your billing page.
        </li>
        <li>
          Fees are exclusive of any VAT, GST, sales tax, or similar taxes,
          which may be added at checkout where required by law.
        </li>
      </ul>

      <h2>2. Cancelling your subscription</h2>
      <p>
        You can cancel at any time from <em>Settings → Billing</em> in your
        dashboard, or by emailing{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a> from the
        email address on file. Cancellation takes effect at the end of your
        current billing period: you keep access to paid features until then
        and are not charged again.
      </p>
      <p>
        After cancellation your completed documents remain available for
        download for at least 30 days. Templates and draft documents may be
        removed earlier if you downgrade to a free plan that does not
        include them.
      </p>

      <h2>3. Refunds</h2>
      <p>
        We do not provide pro-rated refunds for partial months or years of
        service, or for unused seats, except as set out below or as
        required by law.
      </p>
      <p>We will issue a refund in the following cases:</p>
      <ul>
        <li>
          <strong>EU / EEA / UK consumer cooling-off period.</strong> If
          you are a consumer (i.e., acting outside your trade, business, or
          profession) resident in the EU, EEA, or UK, you have the right to
          withdraw from a distance-purchase subscription within 14 days of
          purchase without giving any reason, unless the digital service
          has been fully performed with your prior express consent. Because
          the Service is delivered immediately, by purchasing a
          subscription and clicking &ldquo;I consent to immediate supply
          and waive my right of withdrawal once the service has been fully
          performed&rdquo;, you acknowledge you may lose your right of
          withdrawal. If you are still within the 14-day period and have
          not used the Service beyond account setup, we will refund your
          subscription fee in full on request.
        </li>
        <li>
          <strong>Service failure.</strong> If the Service is unavailable
          or materially fails to function for an extended period due to our
          fault and we are unable to restore it within a reasonable time,
          email{" "}
          <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a> and we
          will work with you on a fair resolution, which may include a
          credit or refund.
        </li>
        <li>
          <strong>Duplicate or erroneous charge.</strong> If you are
          charged in error, we will refund the mistaken charge promptly.
        </li>
        <li>
          <strong>Annual plan within 14 days.</strong> If you purchase an
          annual plan and cancel within the first 14 days, we will refund
          the subscription fee less any usage above the equivalent free
          plan.
        </li>
      </ul>
      <p>
        Refunds are issued to the original payment method within 10 business
        days of approval. Depending on your bank or card issuer, it may
        take additional time for the refund to appear on your statement.
      </p>

      <h2>4. How to request a refund</h2>
      <p>
        Email{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a> from the
        address on your account with the subject &ldquo;Refund
        request&rdquo; and include (a) the account email, (b) the approximate
        date of the charge, and (c) a short description of why you are
        requesting a refund. You may also use the standard EU
        model-withdrawal form.
      </p>

      <h2>5. Chargebacks</h2>
      <p>
        If you dispute a charge with your bank or card issuer without first
        contacting us, we may suspend your account while the dispute is
        open. Please write to us first — chargebacks are slow and costly
        for both sides.
      </p>

      <h2>6. Changes to pricing</h2>
      <p>
        We may change subscription pricing from time to time. We will
        notify you at least 30 days before a change affects you. If you do
        not accept the change, you may cancel before it takes effect.
      </p>

      <h2>7. Questions</h2>
      <p>
        Email <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>{" "}
        with any billing question.
      </p>
    </>
  );
}
