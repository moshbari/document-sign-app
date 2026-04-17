import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Electronic Signature Disclosure & Consent",
  description:
    "Your informed consent to transact electronically using OneSign — ESIGN, UETA, eIDAS, and UAE Electronic Transactions Law.",
};

export default function EsignConsentPage() {
  return (
    <>
      <span className="meta">Electronic Signatures</span>
      <h1>Electronic Signature Disclosure &amp; Consent</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        Please read this disclosure carefully. It explains your rights when
        using {C.productName} to sign documents electronically, and your
        consent to do so. By clicking &ldquo;<em>I agree</em>&rdquo;,
        &ldquo;<em>Sign</em>&rdquo;, or any similar button provided in the
        Service, you consent to the matters set out below.
      </p>

      <h2>1. Your consent to electronic records and signatures</h2>
      <p>
        You agree that your electronic signature applied through {C.productName}{" "}
        has the same legal effect as a handwritten signature. You also agree
        that {C.legalEntity} (&ldquo;<strong>we</strong>&rdquo;) and the party
        that invited you to sign may use electronic records and electronic
        signatures instead of paper and ink for the document(s) you are
        signing and for any notices, disclosures, authorisations, and
        agreements delivered through the Service.
      </p>
      <p>
        This consent is given in accordance with the following laws, as
        applicable to you:
      </p>
      <ul>
        <li>
          <strong>United States</strong> — the Electronic Signatures in
          Global and National Commerce Act (ESIGN, 15 U.S.C. §§7001 et seq.)
          and the Uniform Electronic Transactions Act (UETA) as enacted in
          each state;
        </li>
        <li>
          <strong>European Union</strong> — Regulation (EU) 910/2014 on
          electronic identification and trust services (<em>eIDAS</em>);
        </li>
        <li>
          <strong>United Kingdom</strong> — the Electronic Communications Act
          2000 and the UK eIDAS Regulations 2016;
        </li>
        <li>
          <strong>United Arab Emirates</strong> — Federal Decree-Law No. 46
          of 2021 on Electronic Transactions and Trust Services;
        </li>
        <li>
          <strong>Canada</strong> — the Personal Information Protection and
          Electronic Documents Act (PIPEDA) and the Uniform Electronic
          Commerce Act as enacted provincially;
        </li>
        <li>
          <strong>Australia</strong> — the Electronic Transactions Act 1999
          (Cth) and equivalent state legislation;
        </li>
        <li>
          <strong>India</strong> — the Information Technology Act, 2000;
        </li>
        <li>
          and comparable electronic-transactions laws in other jurisdictions.
        </li>
      </ul>

      <h2>2. Type of electronic signature we provide</h2>
      <p>
        Unless a specific higher-assurance product is explicitly offered in
        the Service, {C.productName} provides a <em>simple electronic
        signature</em> (also called a &ldquo;standard electronic signature&rdquo;
        or &ldquo;SES&rdquo;) as defined under eIDAS. That is data in
        electronic form attached to or logically associated with other
        electronic data and used by the signatory to sign.
      </p>
      <p>
        Certain documents and transactions may require an{" "}
        <em>advanced electronic signature</em> (AES) or{" "}
        <em>qualified electronic signature</em> (QES), or must be executed in
        paper with wet-ink signatures or before a notary. Examples include
        wills and testamentary instruments, certain family-law matters, and
        certain real-estate documents in some jurisdictions. It is your
        responsibility (and the sender&rsquo;s responsibility) to confirm
        whether a simple electronic signature is legally sufficient for your
        specific document and jurisdiction. If in doubt, consult a qualified
        lawyer in your jurisdiction before signing.
      </p>

      <h2>3. Hardware and software you need</h2>
      <p>To use the Service you need:</p>
      <ul>
        <li>
          a modern web browser released within the last two years (current
          versions of Chrome, Firefox, Safari, or Edge);
        </li>
        <li>a stable internet connection;</li>
        <li>
          an active email address where you can receive signing invitations
          and confirmations;
        </li>
        <li>
          sufficient disk space or cloud storage to download and retain
          signed PDFs;
        </li>
        <li>
          the ability to view and print PDF documents (for example, via your
          browser or a free PDF reader).
        </li>
      </ul>

      <h2>4. Obtaining paper copies</h2>
      <p>
        Every document you sign through the Service is delivered to you as a
        PDF. You can download, save, and print it for your records at any
        time. On request, we will provide a paper copy of a document that
        you signed or received through the Service for a reasonable cost —
        email{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a> from the
        address associated with the signature and identify the document.
      </p>

      <h2>5. Withdrawing consent</h2>
      <p>
        You have the right to withdraw your consent to use electronic records
        and signatures at any time. To do so, email{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a> from the
        address you used to sign, stating that you withdraw consent to
        transact electronically. Withdrawal will apply to future documents
        only and does not affect the legal validity of documents already
        signed. Withdrawing consent may mean you can no longer receive
        documents through the Service and may require you to use slower
        paper-based processes instead.
      </p>

      <h2>6. Updating your contact information</h2>
      <p>
        If you change your email address, please update it in your account
        settings, or — if you signed as a guest — by replying to the signing
        invitation email. If we cannot reach you, we cannot deliver
        electronic records to you.
      </p>

      <h2>7. Identity verification and audit trail</h2>
      <p>
        When you sign through the Service, we record the following
        information to produce an audit trail associated with the document:
        your name and email address, the IP address and user-agent of the
        browser used, the unique signing-link token, and timestamps for when
        you opened, viewed, and signed the document. This audit trail is
        embedded in or attached to the signed PDF and is important evidence
        of the signing event.
      </p>

      <h2>8. Access to the signed document</h2>
      <p>
        After a document is fully signed, all parties receive a copy by
        email. Account holders can also access signed documents from the
        dashboard for the life of their account, subject to our retention
        policy in the <a href="/legal/privacy">Privacy Policy</a>. You are
        encouraged to download and keep your own copy of each signed
        document.
      </p>

      <h2>9. Questions</h2>
      <p>
        If you have questions about this disclosure, or about using
        electronic signatures with the Service, please contact{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>.
      </p>
    </>
  );
}
