import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How OneSign collects, uses, shares, and protects personal data — GDPR, UK GDPR, CCPA/CPRA, and UAE PDPL compliant.",
};

export default function PrivacyPage() {
  return (
    <>
      <span className="meta">Privacy Policy</span>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        This Privacy Policy explains how <strong>{C.legalEntity}</strong>{" "}
        (&ldquo;<strong>{C.productName}</strong>&rdquo;, &ldquo;<strong>we</strong>
        &rdquo;, &ldquo;<strong>us</strong>&rdquo;) collects, uses, and shares
        personal data when you visit {C.domain}, create an account, sign or
        send documents, or otherwise interact with the {C.productName} service
        (the &ldquo;<strong>Service</strong>&rdquo;).
      </p>
      <p>
        We designed this policy to meet the transparency requirements of the
        EU General Data Protection Regulation (&ldquo;<strong>GDPR</strong>
        &rdquo;), the UK GDPR, the California Consumer Privacy Act as amended
        by the CPRA (&ldquo;<strong>CCPA/CPRA</strong>&rdquo;), Canada&rsquo;s
        PIPEDA, Brazil&rsquo;s LGPD, and the UAE Federal Decree-Law No. 45 of
        2021 on the Protection of Personal Data (&ldquo;<strong>UAE PDPL</strong>
        &rdquo;). Where any of those laws gives you stronger rights, those
        rights apply.
      </p>

      <h2>1. Controller and contact</h2>
      <p>
        The controller of your personal data is:
        <br />
        <strong>{C.legalEntity}</strong>
        <br />
        {C.registeredAddress}
        <br />
        Trade licence: {C.tradeLicenseNumber}
        <br />
        Email:{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>
      </p>
      <p>
        For questions about this policy or to exercise your privacy rights,
        contact us at{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>.
      </p>

      <h2>2. Our role</h2>
      <p>
        We act as a <strong>controller</strong> of personal data that concerns
        our account holders (for example, the name and email address you use
        to register) and visitors to our website.
      </p>
      <p>
        When our customers upload documents to the Service and invite people
        to sign them, the information contained in those documents and the
        signers&rsquo; contact details are processed by us as a{" "}
        <strong>processor</strong> on behalf of our customer, who is the
        controller. In that case, the customer&rsquo;s own privacy notice
        governs how that data is used, and we only process the data in
        accordance with the customer&rsquo;s instructions and our{" "}
        <a href="/legal/dpa">Data Processing Agreement</a>.
      </p>

      <h2>3. What we collect</h2>
      <h3>a. Account data</h3>
      <p>
        When you register for the Service we collect your name, email
        address, password (stored as a salted hash), company name (optional),
        and any profile information you choose to provide. For paid plans, we
        also collect billing details; card numbers are handled by our payment
        processor and are not stored on our servers.
      </p>
      <h3>b. Document and signature data</h3>
      <p>
        When you upload a document, create a template, or send a document for
        signature, we store the document, the fields you configure, the
        recipients&rsquo; names and email addresses, the signatures applied
        (drawn, typed, or uploaded images), any data the signer enters into
        form fields, and an audit trail describing the signing event.
      </p>
      <h3>c. Audit and integrity data</h3>
      <p>
        To make e-signed documents defensible, we record events such as the
        time a document was viewed or signed, the IP address from which each
        event occurred, the user-agent string of the signer&rsquo;s browser,
        and the unique token used to access the signing link. This data forms
        the audit trail embedded in or attached to the signed document.
      </p>
      <h3>d. Usage and device data</h3>
      <p>
        We collect standard web-server logs (IP address, date, time, request
        path, response status, referrer) and limited product-usage telemetry
        (pages viewed, features used) to operate, secure, and improve the
        Service. See our <a href="/legal/cookies">Cookie Policy</a> for
        details about cookies and similar technologies.
      </p>
      <h3>e. Communications</h3>
      <p>
        If you contact us by email or through the Service, we keep a record of
        the correspondence to respond to you and maintain support history.
      </p>
      <h3>f. What we do not collect</h3>
      <p>
        We do not knowingly collect personal data from children under 16. We
        do not collect special-category personal data (such as health, racial
        or ethnic origin, religious beliefs, or biometric data for
        identification) unless you or a signer chooses to include it in a
        document.
      </p>

      <h2>4. Why we use your data and our legal bases (EU/UK)</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Categories of data</th>
            <th>Legal basis (GDPR / UK GDPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Providing, operating, and securing the Service</td>
            <td>Account, document, audit, usage</td>
            <td>Performance of a contract (Art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Billing, invoicing, and tax records</td>
            <td>Account, billing</td>
            <td>Contract and legal obligation (Art. 6(1)(b), (c))</td>
          </tr>
          <tr>
            <td>
              Detecting, preventing, and responding to fraud, abuse, and
              security incidents
            </td>
            <td>Account, audit, usage</td>
            <td>
              Legitimate interests in protecting the Service and our users
              (Art. 6(1)(f))
            </td>
          </tr>
          <tr>
            <td>
              Product analytics and improvement of features and reliability
            </td>
            <td>Usage, device</td>
            <td>Legitimate interests (Art. 6(1)(f)) or consent where required</td>
          </tr>
          <tr>
            <td>Sending service and transactional emails</td>
            <td>Account, communications</td>
            <td>Contract (Art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Marketing emails about new features or offers</td>
            <td>Account, communications</td>
            <td>Consent (Art. 6(1)(a)) or soft opt-in where permitted</td>
          </tr>
          <tr>
            <td>Complying with legal obligations and defending claims</td>
            <td>All</td>
            <td>Legal obligation / legitimate interests (Art. 6(1)(c), (f))</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Who we share data with</h2>
      <p>
        We share personal data only with the following categories of
        recipients:
      </p>
      <ul>
        <li>
          <strong>Signers and document recipients</strong> you invite through
          the Service — they receive the document and your identifying
          information.
        </li>
        <li>
          <strong>Sub-processors</strong> that provide hosting, email
          delivery, analytics, customer support, and payment processing on our
          behalf. A current list is maintained at{" "}
          <a href="/legal/subprocessors">/legal/subprocessors</a>. Each
          sub-processor is bound by written contract, confidentiality, and
          appropriate data-protection terms.
        </li>
        <li>
          <strong>Professional advisers</strong> such as lawyers, auditors,
          and accountants, subject to confidentiality.
        </li>
        <li>
          <strong>Authorities and law enforcement</strong> where required by
          law, court order, or valid legal process, or to exercise or defend
          our legal rights.
        </li>
        <li>
          <strong>Acquirers and successors</strong> in the event of a merger,
          acquisition, reorganisation, or sale of assets, subject to this
          policy&rsquo;s commitments continuing to apply.
        </li>
      </ul>
      <p>
        We <strong>do not sell or rent</strong> your personal data, and we do
        not &ldquo;share&rdquo; personal data for cross-context behavioural
        advertising as those terms are defined under CCPA/CPRA.
      </p>

      <h2>6. International transfers</h2>
      <p>
        We are based in the United Arab Emirates and our sub-processors may
        be located in the United States, the European Economic Area, the
        United Kingdom, or other countries. Where personal data of residents
        of the EEA, UK, or Switzerland is transferred to a country that has
        not been deemed adequate by the relevant authority, we rely on the
        European Commission&rsquo;s Standard Contractual Clauses (Decision
        (EU) 2021/914) and, where needed, the UK International Data Transfer
        Addendum, together with supplementary technical and organisational
        measures. A copy is available on request at{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>.
      </p>
      <p>
        Transfers of personal data out of the UAE are made in compliance with
        Articles 22&ndash;23 of the UAE PDPL, which permit transfers to
        jurisdictions with an adequate level of protection or on the basis of
        appropriate safeguards such as contractual clauses.
      </p>

      <h2>7. How long we keep data</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account data</td>
            <td>
              For the life of your account + up to 30 days after deletion, then
              irreversibly deleted or anonymised
            </td>
          </tr>
          <tr>
            <td>Completed signed documents and audit trails</td>
            <td>
              For the life of your account; available for download for 30 days
              after account termination unless you delete them earlier
            </td>
          </tr>
          <tr>
            <td>Billing and tax records</td>
            <td>As required by UAE tax law and other applicable law, typically 5 years</td>
          </tr>
          <tr>
            <td>Server and security logs</td>
            <td>Up to 12 months, unless retained longer for investigation</td>
          </tr>
          <tr>
            <td>Marketing preferences / unsubscribes</td>
            <td>Indefinitely, to honour your opt-out</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Your rights</h2>
      <p>Subject to your jurisdiction, you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data rectified and incomplete data completed;</li>
        <li>
          request erasure of personal data where one of the grounds under
          Art. 17 GDPR / applicable law applies;
        </li>
        <li>
          request restriction of processing or object to processing based on
          our legitimate interests;
        </li>
        <li>
          receive your data in a structured, commonly used, machine-readable
          format and have it transmitted to another controller (data
          portability);
        </li>
        <li>
          withdraw consent at any time where processing is based on consent,
          without affecting the lawfulness of prior processing;
        </li>
        <li>
          not be subject to a decision based solely on automated processing
          that produces legal or similarly significant effects — we do not
          carry out such decision-making;
        </li>
        <li>
          lodge a complaint with your local data-protection supervisory
          authority. EU residents can find theirs at{" "}
          <a
            href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
            target="_blank"
            rel="noopener noreferrer"
          >
            edpb.europa.eu
          </a>
          ; UK residents can contact the ICO at{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            ico.org.uk
          </a>
          ; UAE residents can contact the UAE Data Office.
        </li>
      </ul>

      <h3>California residents (CCPA/CPRA)</h3>
      <p>
        Californians additionally have the rights to know, delete, correct,
        and limit the use of sensitive personal information, and to opt out of
        the sale or sharing of personal information. As stated above, we do
        not sell or share personal information for cross-context behavioural
        advertising. To exercise your rights, email{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>. We will not
        discriminate against you for exercising your rights.
      </p>

      <p>
        To exercise any of these rights, email{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>. We may need
        to verify your identity before acting on your request. We respond
        within 30 days (or the period required by applicable law).
      </p>

      <h2>9. Security</h2>
      <p>
        We protect personal data with encryption in transit (TLS 1.2+) and at
        rest, role-based access controls, audit logging, least-privilege
        operational access, and regular backups. Our full approach is
        summarised on our <a href="/legal/security">Security page</a>. No
        system is perfectly secure; we encourage you to use strong, unique
        passwords and to report any suspected vulnerability to{" "}
        <a href={`mailto:${C.securityEmail}`}>{C.securityEmail}</a>.
      </p>

      <h2>10. Automated decisions and profiling</h2>
      <p>
        We do not make decisions about you that produce legal or similarly
        significant effects based solely on automated processing.
      </p>

      <h2>11. Cookies</h2>
      <p>
        See our <a href="/legal/cookies">Cookie Policy</a>.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will notify you through the Service or by email
        at least 14 days before they take effect. The &ldquo;Last
        updated&rdquo; date at the top of this page always reflects the
        latest version.
      </p>

      <h2>13. Contact</h2>
      <p>
        If you have questions or concerns, or wish to exercise any of the
        rights described above, please contact our privacy team at{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>.
      </p>
    </>
  );
}
