/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email list (comma or newline separated)
 */
export function parseEmailList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0 && isValidEmail(email));
}

/**
 * Validate document title
 */
export function validateDocumentTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return "Document title is required";
  }

  if (title.length > 255) {
    return "Document title must not exceed 255 characters";
  }

  return null;
}

/**
 * Validate signer emails
 */
export function validateSignerEmails(emails: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  const uniqueEmails = new Set(emails);

  for (const email of uniqueEmails) {
    if (isValidEmail(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  }

  return { valid, invalid };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate template name
 */
export function validateTemplateName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Template name is required";
  }

  if (name.length > 255) {
    return "Template name must not exceed 255 characters";
  }

  return null;
}

/**
 * Validate template content
 */
export function validateTemplateContent(content: any): string | null {
  if (!content || typeof content !== "object") {
    return "Template content must be a valid JSON object";
  }

  if (!Array.isArray(content.fields)) {
    return "Template must contain a 'fields' array";
  }

  return null;
}

/**
 * Check if a string is a valid UUID/CUID
 */
export function isValidId(id: string): boolean {
  // Check for CUID format (24 alphanumeric chars) or UUID format
  const cuidRegex = /^[a-z0-9]{24}$/i;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return cuidRegex.test(id) || uuidRegex.test(id);
}
