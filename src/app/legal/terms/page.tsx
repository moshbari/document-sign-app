import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The master agreement governing your use of OneSign, operated by ZPresso LLC (SHAMS Free Zone, UAE).",
};

export default function TermsPage() {
  return (
    <>
      <span className="meta">Terms of Service</span>
      <h1>Terms of Service</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;) form a
        binding agreement between <strong>{C.legalEntity}</strong>, a{" "}
        {C.registrationType} registered in {C.jurisdiction} (&ldquo;
        <strong>{C.productName}</strong>&rdquo;, &ldquo;<strong>we</strong>
        &rdquo;, &ldquo;<strong>us</strong>&rdquo;, or &ldquo;
        <strong>our</strong>&rdquo;), and the person or entity that accesses or
        uses the {C.productName} service at {C.domain} and any related
        applications, APIs, and content (collectively, the &ldquo;
        <strong>Service</strong>&rdquo;) (&ldquo;<strong>you</strong>&rdquo; or
        &ldquo;<strong>Customer</strong>&rdquo;).
      </p>
      <p>
        By creating an account, clicking &ldquo;I agree&rdquo;, signing a
        document through the Service, or otherwise accessing the Service, you
        agree to be bound by these Terms and our{" "}
        <a href="/legal/privacy">Privacy Policy</a>,{" "}
        <a href="/legal/aup">Acceptable Use Policy</a>, and{" "}
        <a href="/legal/esign-consent">E-Signature Disclosure &amp; Consent</a>.
        If you do not agree, you must not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        {C.productName} is a software-as-a-service platform that lets Customers
        upload documents, invite other people (&ldquo;
        <strong>Signers</strong>&rdquo;) to apply electronic signatures, create
        reusable templates, track signing status, and download completed
        documents with an accompanying audit trail. The specific features
        available to you depend on the plan you subscribe to and are described
        in the Service itself.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <p>
        You must be at least 18 years old and legally capable of entering into a
        binding contract to use the Service. If you use the Service on behalf
        of an organisation, you represent that you are authorised to bind that
        organisation, and &ldquo;you&rdquo; refers to both you and that
        organisation.
      </p>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account. Notify
        us immediately at{" "}
        <a href={`mailto:${C.securityEmail}`}>{C.securityEmail}</a> if you
        suspect unauthorised access.
      </p>

      <h2>3. Your content</h2>
      <p>
        Documents, templates, signatures, and any other materials you upload or
        generate through the Service (&ldquo;<strong>Customer Content</strong>
        &rdquo;) belong to you. You grant us a worldwide, non-exclusive,
        royalty-free licence to host, store, transmit, display, and process
        Customer Content solely for the purposes of operating, securing, and
        improving the Service, complying with law, and providing the Service to
        you and your Signers. We do not sell Customer Content and we do not use
        it to train machine-learning models.
      </p>
      <p>
        You represent and warrant that you have all rights necessary to upload
        Customer Content and to request signatures on it, that Customer Content
        does not infringe any third party&rsquo;s rights, and that its
        processing through the Service does not violate any law or agreement.
      </p>

      <h2>4. Acceptable use</h2>
      <p>
        Your use of the Service is subject to our{" "}
        <a href="/legal/aup">Acceptable Use Policy</a>. In particular, you must
        not use the Service to sign or circulate documents that are unlawful,
        fraudulent, deceptive, or that a reasonable person would find abusive,
        and you must not attempt to compromise the security, integrity, or
        availability of the Service.
      </p>

      <h2>5. Electronic signatures &amp; document validity</h2>
      <p>
        You and each Signer acknowledge and consent that contracts, notices,
        disclosures, and other documents may be executed and delivered
        electronically through the Service, in accordance with the laws of the
        parties&rsquo; respective jurisdictions, including the U.S.{" "}
        <em>Electronic Signatures in Global and National Commerce Act</em>{" "}
        (ESIGN), the U.S. <em>Uniform Electronic Transactions Act</em> (UETA),
        the EU <em>eIDAS Regulation</em> (910/2014), the UK{" "}
        <em>Electronic Communications Act 2000</em>, and UAE{" "}
        <em>Federal Decree-Law No. 46 of 2021 on Electronic Transactions and
        Trust Services</em>. See our full{" "}
        <a href="/legal/esign-consent">E-Signature Disclosure &amp; Consent</a>{" "}
        for details, including how to withdraw consent and request paper
        versions.
      </p>
      <p>
        The Service provides a <em>simple electronic signature</em> product by
        default. It is your responsibility to determine whether a simple
        electronic signature satisfies the legal requirements applicable to a
        specific document in a specific jurisdiction (for example, certain
        real-estate, family-law, or notarial documents may require a higher
        level of assurance, such as an advanced or qualified electronic
        signature, or wet-ink signing).
      </p>

      <h2>6. Fees, taxes, and renewals</h2>
      <p>
        Paid plans are billed in advance on a monthly or annual basis as
        described on our pricing page. Fees are non-refundable except as
        expressly set out in our{" "}
        <a href="/legal/refund">Refund &amp; Cancellation Policy</a> or as
        required by applicable law. Subscriptions auto-renew for successive
        terms of the same length unless cancelled before the end of the
        then-current term. Fees are exclusive of taxes, duties, and levies,
        which you are responsible for (other than taxes on our net income).
      </p>
      <p>
        We may change our fees for future billing periods on at least 30
        days&rsquo; notice. If you do not accept the change, you may cancel
        before the new price takes effect.
      </p>

      <h2>7. Free plans, trials, and beta features</h2>
      <p>
        Free plans and trials are provided &ldquo;as is&rdquo; and may be
        modified, limited, or discontinued at any time. Beta or early-access
        features are optional and may be less reliable; we make no warranties
        about them and may change them without notice.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        We and our licensors own all right, title, and interest in and to the
        Service, including all software, designs, logos, and documentation.
        Except for the rights expressly granted in these Terms, no licence or
        other right is granted to you. Feedback you submit may be used by us
        without restriction or compensation to you.
      </p>

      <h2>9. Third-party services</h2>
      <p>
        The Service may integrate with or link to third-party services. Your
        use of those services is governed by their own terms and privacy
        policies, and we are not responsible for them. Our current list of
        sub-processors is available at{" "}
        <a href="/legal/subprocessors">/legal/subprocessors</a>.
      </p>

      <h2>10. Data protection</h2>
      <p>
        We process personal data as described in our{" "}
        <a href="/legal/privacy">Privacy Policy</a>. Where you use the Service
        to process personal data of your own end-users in a way that makes us a
        processor (and you a controller) under applicable data-protection law,
        our <a href="/legal/dpa">Data Processing Agreement</a> is incorporated
        into these Terms by reference and forms part of our agreement with
        you.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        You may terminate your account at any time from the dashboard or by
        writing to <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>.
        We may suspend or terminate your access to the Service immediately if
        you materially breach these Terms, fail to pay fees when due, use the
        Service in a way that creates legal or security risk, or if we are
        required to do so by law.
      </p>
      <p>
        Upon termination: (a) your right to use the Service ends; (b) we will
        make a copy of your completed documents available for download for at
        least 30 days, after which we may delete them; and (c) provisions that
        by their nature should survive termination (including sections on fees
        already due, IP, disclaimers, liability limits, indemnification, and
        governing law) will survive.
      </p>

      <h2>12. Warranties and disclaimers</h2>
      <p>
        We will provide the Service with reasonable skill and care. Except as
        expressly stated in these Terms, <strong>the Service is provided
        &ldquo;as is&rdquo; and &ldquo;as available&rdquo;</strong>. To the
        maximum extent permitted by applicable law, we disclaim all other
        warranties, whether express, implied, or statutory, including any
        warranty of merchantability, fitness for a particular purpose,
        non-infringement, accuracy, and uninterrupted or error-free operation.
      </p>
      <p>
        Nothing in these Terms limits or excludes any liability that cannot
        lawfully be limited or excluded, including liability for fraud, death,
        or personal injury caused by negligence.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, in no event will either party
        be liable to the other for any indirect, incidental, special,
        consequential, exemplary, or punitive damages, or for any loss of
        profits, revenues, goodwill, or data, even if advised of the
        possibility of such damages. Each party&rsquo;s total aggregate
        liability arising out of or related to these Terms and the Service
        will not exceed the greater of (a) the fees you paid us for the
        Service in the twelve (12) months preceding the event giving rise to
        liability, and (b) USD 100.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless {C.legalEntity} and its
        officers, directors, employees, and agents from any third-party claim
        arising out of or related to (a) your Customer Content, (b) your use
        of the Service in violation of these Terms or applicable law, or (c)
        your infringement of any third party&rsquo;s rights.
      </p>

      <h2>15. Governing law and dispute resolution</h2>
      <p>
        These Terms are governed by, and construed in accordance with, the{" "}
        {C.governingLaw}, without regard to its conflict-of-laws rules.
      </p>
      <p>
        Any dispute, controversy, or claim arising out of or in connection
        with these Terms, including any question regarding its existence,
        validity, or termination, will be finally resolved by arbitration
        seated in {C.arbitrationVenue}, administered by the Sharjah
        International Commercial Arbitration Centre (&ldquo;
        <strong>Tahkeem</strong>&rdquo;) in accordance with its rules in force
        at the time of the arbitration. The language of the arbitration will
        be {C.arbitrationLanguage} and the tribunal will consist of a sole
        arbitrator. Nothing in this section prevents either party from seeking
        urgent injunctive relief from a court of competent jurisdiction to
        protect its intellectual property or confidential information.
      </p>
      <p>
        <strong>Consumers.</strong> If you are a consumer resident in the
        European Union, the United Kingdom, or another jurisdiction whose law
        provides that consumers cannot be deprived of the protection of the
        mandatory rules of their local law, nothing in this section deprives
        you of that protection, and you retain the right to bring proceedings
        in the courts of your country of residence. EU consumers may also use
        the European Commission&rsquo;s Online Dispute Resolution platform at{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>16. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. If a change is material,
        we will notify you by email or through the Service at least 14 days
        before it takes effect. Your continued use of the Service after the
        effective date of the change constitutes acceptance. If you do not
        agree, you may stop using the Service and cancel your subscription.
      </p>

      <h2>17. Miscellaneous</h2>
      <p>
        <strong>Entire agreement.</strong> These Terms, together with any
        documents expressly incorporated by reference, are the entire agreement
        between us and supersede any prior agreements on the subject matter.
      </p>
      <p>
        <strong>Assignment.</strong> You may not assign these Terms without our
        prior written consent. We may assign these Terms to an affiliate or in
        connection with a merger, acquisition, or sale of assets.
      </p>
      <p>
        <strong>No waiver.</strong> A failure to enforce any provision is not a
        waiver of that provision.
      </p>
      <p>
        <strong>Severability.</strong> If any provision is found unenforceable,
        the remaining provisions remain in effect.
      </p>
      <p>
        <strong>Force majeure.</strong> Neither party is liable for delay or
        failure to perform caused by events outside its reasonable control.
      </p>
      <p>
        <strong>Notices.</strong> Legal notices to us must be sent to{" "}
        <a href={`mailto:${C.legalEmail}`}>{C.legalEmail}</a> and by post to{" "}
        {C.legalEntity}, {C.registeredAddress}. Notices to you may be sent to
        the email address on your account.
      </p>

      <h2>18. Contact</h2>
      <p>
        {C.legalEntity}
        <br />
        {C.registeredAddress}
        <br />
        Trade licence: {C.tradeLicenseNumber}
        <br />
        Email: <a href={`mailto:${C.legalEmail}`}>{C.legalEmail}</a>
      </p>
    </>
  );
}
