import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How OneSign protects your documents and signatures — encryption, access controls, audit logs, and incident response.",
};

export default function SecurityPage() {
  return (
    <>
      <span className="meta">Security</span>
      <h1>Security at {C.productName}</h1>
      <p>
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        {C.productName} handles documents that matter — contracts,
        consent forms, offer letters. This page summarises the technical
        and organisational measures we take to keep them safe. Security is
        an ongoing programme, and we publish material updates here as the
        product and infrastructure evolve.
      </p>

      <h2>Infrastructure</h2>
      <ul>
        <li>
          The application and its managed PostgreSQL database run on{" "}
          <strong>Railway</strong>, on hardened cloud infrastructure with
          network isolation, automatic patching, and 24/7 operational
          monitoring.
        </li>
        <li>
          Domain and DNS are managed through{" "}
          <strong>Namecheap</strong>; DNSSEC and protective registrar
          settings are enabled.
        </li>
        <li>
          All traffic to the Service is served over HTTPS with TLS 1.2 or
          higher; older protocols and cipher suites are disabled.
        </li>
      </ul>

      <h2>Encryption</h2>
      <ul>
        <li>
          <strong>In transit:</strong> TLS 1.2+ for all connections between
          clients, our edge, and our services.
        </li>
        <li>
          <strong>At rest:</strong> AES-256 encryption at rest for
          databases, backups, and persistent storage.
        </li>
        <li>
          <strong>Secrets:</strong> application secrets and credentials are
          stored in Railway&rsquo;s encrypted environment configuration, not
          in source code.
        </li>
        <li>
          <strong>Passwords:</strong> account passwords are hashed with a
          modern adaptive algorithm (bcrypt) with a unique per-user salt;
          plaintext passwords are never stored or logged.
        </li>
      </ul>

      <h2>Access control</h2>
      <ul>
        <li>
          Least-privilege access for employees and contractors; production
          access is granted only when required and revoked promptly.
        </li>
        <li>
          Multi-factor authentication is required on administrative and
          operational accounts.
        </li>
        <li>
          Application access is controlled by signed session cookies and
          role-based permissions; signing links use unguessable single-use
          tokens.
        </li>
      </ul>

      <h2>Audit trail and signing integrity</h2>
      <p>
        Every signing session is recorded with timestamps, signer IP
        address, browser user-agent, and signing-link token. The completed
        PDF includes an audit trail that is cryptographically consistent
        with the signed document so tampering can be detected.
      </p>

      <h2>Backups and business continuity</h2>
      <ul>
        <li>
          Encrypted database backups are taken automatically on a regular
          schedule; restore procedures are documented and tested.
        </li>
        <li>
          Infrastructure is designed for rapid redeployment from source
          control.
        </li>
      </ul>

      <h2>Secure software development</h2>
      <ul>
        <li>Version control with code review before changes reach production.</li>
        <li>
          Automated dependency scanning and prompt patching of known
          vulnerabilities.
        </li>
        <li>
          Server-side input validation and authorisation checks on all
          write paths; parameterised database queries via Prisma ORM to
          prevent injection.
        </li>
        <li>
          Security headers (HSTS, X-Content-Type-Options, Referrer-Policy,
          a Content-Security-Policy) applied by default.
        </li>
      </ul>

      <h2>Incident response</h2>
      <p>
        We maintain a documented incident-response plan covering
        identification, containment, eradication, recovery, and
        post-incident review. In the event of a personal-data breach
        affecting you, we will notify you without undue delay and in any
        event within 72 hours of becoming aware, as set out in our{" "}
        <a href="/legal/dpa">Data Processing Agreement</a>.
      </p>

      <h2>Staff</h2>
      <ul>
        <li>
          Everyone with access to production data or systems is bound by
          confidentiality obligations.
        </li>
        <li>
          Regular security and data-protection awareness training.
        </li>
        <li>
          Access is reviewed on joiner/mover/leaver events and at least
          quarterly.
        </li>
      </ul>

      <h2>Reporting a vulnerability</h2>
      <p>
        We welcome coordinated disclosure. If you believe you have
        discovered a security issue, please email{" "}
        <a href={`mailto:${C.securityEmail}`}>{C.securityEmail}</a> with a
        clear description, steps to reproduce, and — if applicable —
        proof-of-concept code. Please do not exploit the issue against
        live user data. We will acknowledge your report within two business
        days and keep you informed as we work on a fix. We do not pursue
        legal action against researchers who act in good faith and follow
        this process.
      </p>

      <h2>Trust and compliance</h2>
      <p>
        {C.productName} is a growing product and we are building toward a
        formal external-audit programme. In the meantime, our Data
        Processing Agreement covers GDPR Article 28 obligations and our{" "}
        <a href="/legal/privacy">Privacy Policy</a> explains our approach
        to data protection.
      </p>
    </>
  );
}
