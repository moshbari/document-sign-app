/**
 * Single source of truth for legal/company information used across
 * all legal pages (/legal/*). Update this file when company details
 * or the effective date of the legal pages change.
 *
 * Designed with white-labeling in mind — a future tenant config can
 * override these values.
 */

export const LEGAL_CONFIG = {
  // Product
  productName: "OneSign",
  domain: "onesign.click",
  appUrl: "https://onesign.click",

  // Company
  legalEntity: "ZPresso LLC",
  jurisdiction: "Sharjah Media City (SHAMS) Free Zone, United Arab Emirates",
  registrationType: "Free Zone Company (FZ-LLC)",
  tradeLicenseNumber: "[Trade License No. — to be inserted]",
  registeredAddress:
    "SHAMS Free Zone, Al Messaned, Al Bataeh, Sharjah, United Arab Emirates",

  // Contact
  contactEmail: "support@onesign.click",
  privacyEmail: "privacy@onesign.click",
  legalEmail: "legal@onesign.click",
  dpoEmail: "privacy@onesign.click",
  securityEmail: "security@onesign.click",
  abuseEmail: "abuse@onesign.click",

  // Representatives
  // If you later offer the service to EU/UK residents at scale, you
  // will likely need to appoint an EU + UK representative under
  // GDPR Art. 27 / UK GDPR — update these when appointed.
  euRepresentative: null as null | { name: string; address: string; email: string },
  ukRepresentative: null as null | { name: string; address: string; email: string },

  // Effective dates — bump whenever a legal page is materially updated
  effectiveDate: "April 17, 2026",
  lastUpdated: "April 17, 2026",

  // Governing law / venue
  governingLaw:
    "Laws of the United Arab Emirates, as applicable to the SHAMS Free Zone, together with the applicable laws of the Emirate of Sharjah",
  arbitrationVenue: "Sharjah, United Arab Emirates",
  arbitrationLanguage: "English",

  // Current known sub-processors (keep in sync with /legal/subprocessors)
  subprocessors: [
    {
      name: "Railway Corp.",
      purpose: "Application hosting and managed PostgreSQL database",
      location: "United States",
      website: "https://railway.com",
    },
    {
      name: "Namecheap, Inc.",
      purpose: "Domain registration and DNS",
      location: "United States",
      website: "https://www.namecheap.com",
    },
    {
      name: "Email delivery provider (SMTP)",
      purpose:
        "Transactional email delivery for signing invitations, notifications, and account emails",
      location: "To be confirmed based on chosen provider",
      website: "",
    },
  ],
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
