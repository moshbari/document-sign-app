import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Subprocessors",
  description:
    "Public list of third parties that help us deliver OneSign and the categories of data they process.",
};

export default function SubprocessorsPage() {
  return (
    <>
      <span className="meta">Subprocessors</span>
      <h1>Subprocessors</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        {C.legalEntity} uses the following third-party service providers
        (sub-processors) to deliver the {C.productName} service. Each is
        bound by written contract, confidentiality obligations, and
        appropriate data-protection terms. This list is maintained in
        accordance with Article 28(2)&ndash;(4) GDPR and our{" "}
        <a href="/legal/dpa">Data Processing Agreement</a>.
      </p>

      <h2>Current sub-processors</h2>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Data location</th>
          </tr>
        </thead>
        <tbody>
          {C.subprocessors.map((sp) => (
            <tr key={sp.name}>
              <td>
                <strong>{sp.name}</strong>
                {sp.website ? (
                  <>
                    <br />
                    <a href={sp.website} target="_blank" rel="noopener noreferrer">
                      {sp.website.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                ) : null}
              </td>
              <td>{sp.purpose}</td>
              <td>{sp.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Notifications of changes</h2>
      <p>
        We will update this page at least 30 days before adding or
        replacing a sub-processor that processes Customer Personal Data.
        Business customers can subscribe to email notifications of
        sub-processor changes by writing to{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a> with the
        subject &ldquo;Subscribe — Subprocessor updates&rdquo;.
      </p>

      <h2>Objecting to a new sub-processor</h2>
      <p>
        Customers bound by our DPA may object to the appointment of a new
        sub-processor on reasonable data-protection grounds within 30 days
        of notice, as described in Section 6 of the{" "}
        <a href="/legal/dpa">DPA</a>.
      </p>

      <h2>Personal data you may ask about</h2>
      <p>
        If you would like more detail about the specific categories of
        Customer Personal Data that each sub-processor can access, or the
        safeguards applicable to an international transfer, email{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>.
      </p>
    </>
  );
}
