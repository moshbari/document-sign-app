import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Impressum / Legal Notice",
  description:
    "Statutory company disclosure (Impressum) required under German, Austrian, and Swiss law.",
};

export default function ImpressumPage() {
  return (
    <>
      <span className="meta">Impressum</span>
      <h1>Impressum / Legal Notice</h1>
      <p>
        Information provided in accordance with §5 of the German
        Telemediengesetz (TMG), §14 of the Austrian Unternehmensgesetzbuch
        (UGB), §25 of the Austrian Mediengesetz, and equivalent disclosure
        obligations applicable to websites accessible from other EU
        jurisdictions.
      </p>

      <h2>Operator of the website</h2>
      <p>
        <strong>{C.legalEntity}</strong>
        <br />
        {C.registrationType}
        <br />
        {C.registeredAddress}
        <br />
        {C.jurisdiction}
      </p>

      <h2>Registration</h2>
      <p>
        Registered in the Sharjah Media City (SHAMS) Free Zone.
        <br />
        Trade licence number: {C.tradeLicenseNumber}
      </p>

      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>
        <br />
        Legal/contract matters:{" "}
        <a href={`mailto:${C.legalEmail}`}>{C.legalEmail}</a>
        <br />
        Data-protection matters:{" "}
        <a href={`mailto:${C.privacyEmail}`}>{C.privacyEmail}</a>
      </p>

      <h2>Responsible for content under §18(2) MStV</h2>
      <p>
        {C.legalEntity}, at the address above.
      </p>

      <h2>VAT / UID</h2>
      <p>
        {C.legalEntity} is established in the United Arab Emirates. A UAE
        Tax Registration Number (TRN) is provided on invoices where
        applicable.
      </p>

      <h2>Online Dispute Resolution (ODR)</h2>
      <p>
        The European Commission provides a platform for online dispute
        resolution (ODR), available at{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr
        </a>
        . Our email address is{" "}
        <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>. We are
        neither willing nor obliged to participate in a dispute-settlement
        procedure before a consumer arbitration board.
      </p>

      <h2>Liability for content</h2>
      <p>
        As a service provider, we are responsible for our own content on
        these pages in accordance with §7(1) TMG and general laws. Under
        §§8&ndash;10 TMG, we are not obliged to monitor transmitted or
        stored third-party information or to investigate circumstances
        that suggest unlawful activity. Obligations to remove or block the
        use of information under general laws remain unaffected. Liability
        is only possible from the point in time at which a concrete
        infringement becomes known. On notification of such infringements,
        we will remove the relevant content without delay.
      </p>

      <h2>Liability for links</h2>
      <p>
        Our website contains links to external websites operated by third
        parties, over whose content we have no influence. We therefore
        cannot assume any liability for this external content. The
        respective provider or operator of the linked pages is always
        responsible for their content. The linked pages were checked for
        possible legal violations at the time of linking; unlawful content
        was not identified at that time. A permanent content control of
        the linked pages is not reasonable without concrete evidence of a
        violation. On notification of any violations, we will remove such
        links immediately.
      </p>

      <h2>Copyright</h2>
      <p>
        Content and works on these pages created by the website operator
        are subject to copyright. Duplication, editing, distribution, and
        any kind of utilisation outside the limits of copyright law require
        the written consent of the respective author or creator. Downloads
        and copies of this site are permitted only for private,
        non-commercial use.
      </p>
    </>
  );
}
