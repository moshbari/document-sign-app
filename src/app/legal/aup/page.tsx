import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Rules of the road for OneSign — what you can and cannot do, and how we enforce them.",
};

export default function AupPage() {
  return (
    <>
      <span className="meta">Acceptable Use</span>
      <h1>Acceptable Use Policy</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        This Acceptable Use Policy (&ldquo;<strong>AUP</strong>&rdquo;) applies
        to everyone who uses the {C.productName} service operated by{" "}
        {C.legalEntity}. It is incorporated into our{" "}
        <a href="/legal/terms">Terms of Service</a>.
      </p>

      <h2>1. Core commitments</h2>
      <p>
        You are responsible for everything that happens through your account
        and for all Customer Content you upload or request signatures on. You
        must use the Service in a way that is lawful, honest, and respectful
        of other people&rsquo;s rights.
      </p>

      <h2>2. Prohibited content and activity</h2>
      <p>You must not use the Service to send, host, or sign documents that:</p>
      <ul>
        <li>
          violate any applicable law, regulation, or court order, including
          sanctions, anti-money-laundering, anti-terrorism, export control,
          consumer-protection, or anti-bribery laws;
        </li>
        <li>
          are fraudulent, deceptive, misleading, or designed to impersonate
          another person or entity;
        </li>
        <li>
          infringe intellectual-property rights, publicity rights, privacy
          rights, or contractual obligations of any third party;
        </li>
        <li>
          contain child sexual-abuse material or sexualise minors in any
          way;
        </li>
        <li>
          incite or facilitate violence, terrorism, self-harm, or hatred
          based on race, ethnicity, national origin, religion, gender,
          sexual orientation, disability, or other protected characteristic;
        </li>
        <li>
          contain or distribute malware, ransomware, phishing content, or
          any other malicious code;
        </li>
        <li>
          collect, process, or disclose personal data in violation of
          applicable privacy or data-protection law, including sending
          signing invitations to people who have asked not to be contacted;
        </li>
        <li>
          constitute unsolicited commercial communication (spam), chain
          letters, or pyramid schemes;
        </li>
        <li>
          require a level of legal formality the Service does not support
          (for example, notarial execution or in-person witnessing that the
          Service has not been configured to provide).
        </li>
      </ul>

      <p>You must not:</p>
      <ul>
        <li>
          probe, scan, or test the vulnerability of the Service, or bypass
          its security, without our explicit prior written permission
          (responsible security research is welcome — see below);
        </li>
        <li>
          interfere with or disrupt the Service, its servers, or the
          networks connected to it, including by sending excessive traffic,
          automated requests, or denial-of-service attacks;
        </li>
        <li>
          attempt to access another user&rsquo;s account, documents, or
          personal data;
        </li>
        <li>
          reverse-engineer, decompile, or disassemble the Service, or
          attempt to derive its source code, except to the extent such
          restriction is prohibited by law;
        </li>
        <li>
          use the Service to build, train, or benchmark a competing product;
        </li>
        <li>
          scrape, crawl, or systematically extract data from the Service or
          from signed documents you do not own;
        </li>
        <li>
          use robots, bots, or automated means to generate signatures at
          scale without our prior written permission;
        </li>
        <li>
          resell, sublicence, or rent the Service to third parties without
          an authorised reseller or white-label agreement with us;
        </li>
        <li>
          remove or obscure any proprietary notices on the Service or on
          outputs it produces.
        </li>
      </ul>

      <h2>3. Acceptable research and penetration testing</h2>
      <p>
        We welcome coordinated vulnerability disclosure. If you find a
        security issue, please do not exploit it against live user data.
        Email <a href={`mailto:${C.securityEmail}`}>{C.securityEmail}</a> with
        a description and proof-of-concept, and we will respond and
        co-ordinate a fix. We will not pursue legal action against
        researchers who act in good faith and follow this process.
      </p>

      <h2>4. Reporting abuse</h2>
      <p>
        If you believe someone is using the Service in violation of this
        AUP — for example, to send fraudulent contracts or phishing
        signatures — please report it to{" "}
        <a href={`mailto:${C.abuseEmail}`}>{C.abuseEmail}</a> with as much
        detail as you can share. We investigate every report.
      </p>

      <h2>5. Enforcement</h2>
      <p>
        If we reasonably believe you are violating this AUP, we may take any
        action we think is appropriate, including removing content, warning
        you, suspending or terminating your account, refusing service in
        future, and referring the matter to law enforcement. Where possible
        we will try to work with you to resolve the issue before taking more
        drastic action, but we may act without notice when the violation is
        serious, illegal, or ongoing.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update this AUP from time to time to reflect changes in the
        Service or in applicable law. We will post the updated version here
        and, for material changes, notify you through the Service or by
        email.
      </p>
    </>
  );
}
