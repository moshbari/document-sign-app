import type { Metadata } from "next";
import { LEGAL_CONFIG as C } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "OneSign's commitment to accessibility — WCAG 2.2 AA, the EU Accessibility Act, and ADA.",
};

export default function AccessibilityPage() {
  return (
    <>
      <span className="meta">Accessibility</span>
      <h1>Accessibility Statement</h1>
      <p>
        <strong>Effective date:</strong> {C.effectiveDate}
        <br />
        <strong>Last updated:</strong> {C.lastUpdated}
      </p>

      <p>
        {C.legalEntity} is committed to making {C.productName} usable by
        as many people as possible, regardless of ability or technology.
        We strive to meet the{" "}
        <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>{" "}
        published by the W3C, which is the technical standard referenced by
        the EU Web Accessibility Directive, the EU Accessibility Act
        (Directive (EU) 2019/882), the Americans with Disabilities Act
        (ADA), the UK Public Sector Bodies Accessibility Regulations, and
        similar laws.
      </p>

      <h2>Conformance status</h2>
      <p>
        We self-assess our conformance to WCAG 2.2 Level AA as{" "}
        <strong>partially conformant</strong>. &ldquo;Partially
        conformant&rdquo; means that some parts of the content do not yet
        fully conform to the accessibility standard. We are actively
        working to identify and address gaps.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>
          Build with semantic HTML, accessible form controls, and visible
          keyboard-focus indicators.
        </li>
        <li>
          Meet target colour-contrast ratios for text and essential UI
          elements.
        </li>
        <li>
          Support keyboard-only navigation for core flows (login, uploading
          a document, signing, and downloading a signed document).
        </li>
        <li>
          Provide text alternatives for meaningful images and ensure
          decorative images are hidden from assistive technology.
        </li>
        <li>
          Write form labels and error messages that assistive technology
          can announce clearly.
        </li>
        <li>
          Test with recent versions of common screen readers (NVDA on
          Windows, VoiceOver on macOS and iOS, TalkBack on Android) as
          part of major releases.
        </li>
        <li>
          Offer a drawn, typed, and uploaded-image option for signatures so
          that signers can choose the input method that works best for
          them.
        </li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          The signature canvas relies on pointer input. Signers who cannot
          use a pointer can choose the &ldquo;type your name&rdquo; option
          or upload an image of their signature instead.
        </li>
        <li>
          Some older PDFs uploaded by customers may not themselves be
          accessible. We cannot modify a customer&rsquo;s PDF without
          permission; we encourage customers to use accessible source
          documents.
        </li>
      </ul>

      <h2>Feedback and contact</h2>
      <p>
        We welcome feedback on the accessibility of {C.productName}. If
        you encounter a barrier, or if you need the Service provided in an
        alternative format, please contact us:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href={`mailto:${C.contactEmail}`}>{C.contactEmail}</a>
        </li>
        <li>
          Post: {C.legalEntity}, {C.registeredAddress}
        </li>
      </ul>
      <p>
        We aim to respond to accessibility feedback within five business
        days and will work with you on a reasonable accommodation.
      </p>

      <h2>Enforcement procedure</h2>
      <p>
        If you contact us about an accessibility issue and are not
        satisfied with our response, you may refer the matter to the
        appropriate enforcement body in your country — for example, the
        national authority designated under the EU Accessibility Act in
        your EU Member State, or a court of competent jurisdiction.
      </p>

      <h2>Formal approval</h2>
      <p>
        This accessibility statement was prepared on {C.effectiveDate} and
        is reviewed at least annually or after significant changes to the
        Service.
      </p>
    </>
  );
}
