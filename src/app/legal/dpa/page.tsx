import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description:
    "OneSign Data Processing Agreement — Article 28 GDPR processor terms for business customers.",
};

export default function DpaPage() {
  return (
    <>
      <span className="meta">Data Processing Agreement</span>
      <h1>Data Processing Agreement</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        This Data Processing Agreement (&ldquo;<strong>DPA</strong>&rdquo;)
        forms part of the agreement between {C.legalEntity} (&ldquo;
        <strong>Processor</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;)
        and the customer that has entered into our{" "}
        <a href="/legal/terms">Terms of Service</a> (&ldquo;
        <strong>Controller</strong>&rdquo;, &ldquo;<strong>you</strong>&rdquo;)
        and applies whenever we process personal data on your behalf in our
        role as a processor under Article 28 of Regulation (EU) 2016/679
        (&ldquo;<strong>GDPR</strong>&rdquo;) or equivalent data-protection
        laws.
      </p>
      <p>
        This DPA is entered into by you by accepting the Terms of Service or
        by continuing to use the Service on or after the effective date
        above. You represent that you are authorised to enter into this DPA
        on behalf of the Controller. If you require a counter-signed copy
        for your records, email{" "}
        <a href={`mailto:${C.legalEmail}`}>{C.legalEmail}</a>.
      </p>

      <h2>1. Definitions</h2>
      <p>
        Terms used but not defined here have the meanings given to them in
        the GDPR. &ldquo;<strong>Customer Personal Data</strong>&rdquo; means
        personal data that we process on your behalf in performing the
        Service. &ldquo;<strong>Data Protection Law</strong>&rdquo; means
        the GDPR, the UK GDPR, the Swiss Federal Act on Data Protection, the
        UAE PDPL, and any other data-protection laws applicable to the
        processing.
      </p>

      <h2>2. Roles and scope</h2>
      <p>
        You are the controller of Customer Personal Data and we are the
        processor. The subject matter, duration, nature, and purpose of the
        processing; the types of personal data; and the categories of data
        subjects are set out in <a href="#annex-a">Annex A</a>. Our
        processing of personal data about you (your account) is governed by
        our <a href="/legal/privacy">Privacy Policy</a>, not this DPA.
      </p>

      <h2>3. Processing instructions</h2>
      <p>
        We will process Customer Personal Data only on your documented
        instructions, including as set out in the Terms of Service, your
        configuration of the Service, and this DPA, unless required to do so
        otherwise by Union or Member-State law to which we are subject. If
        we are required by law to process Customer Personal Data otherwise,
        we will inform you of that legal requirement before processing,
        unless that law prohibits it on important grounds of public
        interest. We will tell you without undue delay if, in our opinion,
        an instruction infringes Data Protection Law.
      </p>

      <h2>4. Confidentiality</h2>
      <p>
        We ensure that personnel authorised to process Customer Personal
        Data are bound by confidentiality obligations (contractual or
        statutory) and are trained on their data-protection responsibilities.
      </p>

      <h2>5. Security measures (Article 32)</h2>
      <p>
        We implement appropriate technical and organisational measures to
        ensure a level of security appropriate to the risk, including the
        measures described in <a href="#annex-b">Annex B</a>. Those measures
        include encryption in transit and at rest, access controls,
        authentication, logging, backup and restore procedures, secure
        software development, and a documented incident-response plan. We
        regularly review and update these measures.
      </p>

      <h2>6. Sub-processors</h2>
      <p>
        You grant us general written authorisation to engage sub-processors
        to process Customer Personal Data in order to deliver the Service.
        A current list of sub-processors, including their location and the
        purpose of processing, is available at{" "}
        <a href="/legal/subprocessors">/legal/subprocessors</a>.
      </p>
      <p>
        We will notify you of any changes concerning the addition or
        replacement of sub-processors by updating that page and, if you have
        subscribed to change notifications (available via the form on that
        page), by email, in either case at least 30 days before the change
        takes effect. You may object in writing to a proposed sub-processor
        on reasonable data-protection grounds. If the objection cannot be
        resolved, you may terminate the parts of the Service that cannot be
        provided without the sub-processor, with a refund of any prepaid
        fees covering the remainder of the term for those parts.
      </p>
      <p>
        We impose on each sub-processor data-protection obligations that
        are no less protective than those in this DPA and we remain fully
        liable to you for each sub-processor&rsquo;s performance of its
        obligations.
      </p>

      <h2>7. Data-subject rights</h2>
      <p>
        Taking into account the nature of the processing, we will assist
        you by appropriate technical and organisational measures, insofar as
        this is possible, to fulfil your obligation to respond to requests
        from data subjects to exercise their rights. The Service provides
        self-service tools to help you access, correct, export, and delete
        Customer Personal Data.
      </p>
      <p>
        If we receive a request directly from a data subject concerning
        Customer Personal Data, we will, without undue delay, inform the
        data subject to contact you and will not respond to the request
        ourselves (except to confirm receipt and advise the data subject to
        contact you) unless required by law or authorised by you.
      </p>

      <h2>8. Assistance with compliance obligations</h2>
      <p>
        We will assist you, taking into account the nature of processing
        and the information available to us, in ensuring compliance with
        your obligations under Articles 32&ndash;36 GDPR, including
        security, personal-data-breach notification, data-protection
        impact assessments, and prior consultation with supervisory
        authorities.
      </p>

      <h2>9. Personal data breaches</h2>
      <p>
        We will notify you without undue delay, and in any event within 72
        hours after becoming aware, of any personal-data breach affecting
        Customer Personal Data. The notification will describe the nature
        of the breach (where possible the categories and approximate number
        of data subjects and records concerned), the likely consequences,
        and the measures taken or proposed to address the breach and
        mitigate its effects. We will keep you reasonably informed as the
        investigation progresses.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Where Customer Personal Data originating in the EEA, the United
        Kingdom, Switzerland, or the UAE is transferred to a country that
        has not received an adequacy decision from the relevant authority,
        the transfer is made subject to the European Commission&rsquo;s
        Standard Contractual Clauses (Decision (EU) 2021/914), which are
        incorporated into this DPA by reference and deemed entered into
        with us as data importer. For UK-origin data, the UK International
        Data Transfer Addendum issued by the ICO applies. For Swiss-origin
        data, the Swiss FDPIC amendments apply. We also implement
        supplementary technical measures (encryption in transit and at
        rest, access controls, logging) to protect transferred data.
      </p>
      <p>
        For UAE-origin data, we comply with the transfer requirements of
        Articles 22&ndash;23 of Federal Decree-Law No. 45 of 2021.
      </p>

      <h2>11. Return or deletion at end of processing</h2>
      <p>
        On termination of the Service, we will, at your choice, delete or
        return all Customer Personal Data to you and delete existing copies,
        unless Union or Member-State law requires storage of the personal
        data. Signed documents remain available for download for at least
        30 days after termination, after which we will delete them unless
        otherwise instructed.
      </p>

      <h2>12. Audits</h2>
      <p>
        We will make available to you all information necessary to
        demonstrate compliance with Article 28 GDPR and allow for and
        contribute to audits, including inspections, conducted by you or
        another auditor mandated by you, subject to reasonable
        confidentiality and operational-security conditions. To satisfy
        audit rights, we may provide summaries of independent third-party
        certifications or assessments we hold (where applicable). Customer
        on-site audits are limited to once every twelve (12) months (except
        where required by a supervisory authority or following a
        personal-data breach), on at least 30 days&rsquo; prior written
        notice, during business hours, and at your cost.
      </p>

      <h2>13. Liability</h2>
      <p>
        Each party&rsquo;s liability arising under or in connection with
        this DPA is subject to the limitations and exclusions of liability
        set out in the Terms of Service.
      </p>

      <h2>14. Order of precedence</h2>
      <p>
        If there is any conflict between this DPA and the Terms of Service
        in relation to processing of Customer Personal Data, this DPA
        prevails. If the Standard Contractual Clauses apply and conflict
        with this DPA, the Standard Contractual Clauses prevail.
      </p>

      <h2 id="annex-a">Annex A — Description of processing</h2>
      <table>
        <tbody>
          <tr>
            <th>Subject matter</th>
            <td>
              Provision of the {C.productName} electronic-signature platform
              and related services, as described in the Terms of Service.
            </td>
          </tr>
          <tr>
            <th>Duration</th>
            <td>
              For the term of the Terms of Service, plus the retention and
              return/deletion periods set out in this DPA and the Privacy
              Policy.
            </td>
          </tr>
          <tr>
            <th>Nature and purpose</th>
            <td>
              Hosting, storing, transmitting, and displaying documents and
              signatures; capturing audit-trail metadata; sending
              transactional emails; producing signed PDFs; providing
              customer support.
            </td>
          </tr>
          <tr>
            <th>Types of personal data</th>
            <td>
              Names, email addresses, IP addresses, device/browser metadata,
              signature images (drawn, typed, or uploaded), form-field entries
              made by signers, any personal data contained in documents the
              controller uploads, and audit timestamps.
            </td>
          </tr>
          <tr>
            <th>Categories of data subjects</th>
            <td>
              The controller&rsquo;s employees, contractors, clients,
              counterparties, and any other individuals invited to sign or
              receive documents.
            </td>
          </tr>
          <tr>
            <th>Special categories</th>
            <td>
              Only to the extent voluntarily included by the controller in a
              document or by a signer in a form field. Not required by the
              Service.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="annex-b">Annex B — Technical and organisational measures</h2>
      <ul>
        <li>
          <strong>Encryption in transit:</strong> all connections to the
          Service use TLS 1.2 or higher with modern cipher suites.
        </li>
        <li>
          <strong>Encryption at rest:</strong> databases and persistent
          storage use AES-256 encryption at rest at the infrastructure
          layer.
        </li>
        <li>
          <strong>Access control:</strong> least-privilege access for
          staff; MFA required on administrative accounts; role-based access
          for application users.
        </li>
        <li>
          <strong>Authentication:</strong> salted password hashing using a
          modern adaptive algorithm; session tokens with secure cookies.
        </li>
        <li>
          <strong>Network security:</strong> firewalling, rate limiting,
          and automated abuse detection provided by our hosting platform.
        </li>
        <li>
          <strong>Logging and monitoring:</strong> server logs, application
          audit logs, and alerting on anomalous activity.
        </li>
        <li>
          <strong>Backup and recovery:</strong> regular encrypted database
          backups; documented restore procedures.
        </li>
        <li>
          <strong>Secure development:</strong> code review, dependency
          scanning, and regular patching of known vulnerabilities.
        </li>
        <li>
          <strong>Incident response:</strong> documented process for
          identifying, containing, investigating, and notifying personal-data
          breaches within 72 hours.
        </li>
        <li>
          <strong>Staff:</strong> confidentiality commitments and
          data-protection training.
        </li>
        <li>
          <strong>Sub-processor diligence:</strong> written contracts
          imposing equivalent protection on each sub-processor.
        </li>
      </ul>
    </>
  );
}
