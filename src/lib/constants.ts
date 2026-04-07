/**
 * Application constants
 */

export const APP_NAME = "OneSign";
export const APP_DESCRIPTION = "Digital Document Signing Platform";
export const APP_VERSION = "0.1.0";

// Document status constants
export const DOCUMENT_STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
} as const;

// Signer status constants
export const SIGNER_STATUS = {
  PENDING: "PENDING",
  SIGNED: "SIGNED",
  DECLINED: "DECLINED",
} as const;

// User role constants
export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

// Template field types
export const TEMPLATE_FIELD_TYPES = {
  TEXT: "text",
  SIGNATURE: "signature",
  DATE: "date",
  CHECKBOX: "checkbox",
  EMAIL: "email",
  INITIALS: "initials",
} as const;

// Audit log actions
export const AUDIT_ACTIONS = {
  CREATED: "created",
  SIGNED: "signed",
  DECLINED: "declined",
  SENT_TO_SIGNER: "sent_to_signer",
  DOWNLOADED: "downloaded",
  DELETED: "deleted",
  STATUS_CHANGED: "status_changed",
  RESENT_INVITE: "resent_invite",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FORMATS: ["application/pdf", "image/png", "image/jpeg"],
  MAX_FILES: 10,
} as const;

// API rate limits
export const RATE_LIMITS = {
  DOCUMENTS_PER_DAY: 100,
  SIGNERS_PER_DOCUMENT: 50,
  API_CALLS_PER_MINUTE: 100,
} as const;

// Token expiration times
export const TOKEN_EXPIRY = {
  SIGNING_LINK: 30 * 24 * 60 * 60 * 1000, // 30 days
  PASSWORD_RESET: 24 * 60 * 60 * 1000, // 24 hours
  EMAIL_VERIFICATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  SESSION: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// Email templates
export const EMAIL_TEMPLATES = {
  SIGNING_INVITE: "signing_invite",
  DOCUMENT_COMPLETED: "document_completed",
  SIGNER_DECLINED: "signer_declined",
  PASSWORD_RESET: "password_reset",
  EMAIL_VERIFICATION: "email_verification",
} as const;

// UI constants
export const UI = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  DOCUMENTS: "/api/documents",
  TEMPLATES: "/api/templates",
  SIGNERS: "/api/signers",
  USERS: "/api/users",
  HEALTH: "/api/health",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DOCUMENTS: "/documents",
  TEMPLATES: "/templates",
  SETTINGS: "/settings",
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  SIGN: "/sign",
} as const;

// Validation rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 255,
  MAX_DOCUMENT_TITLE_LENGTH: 255,
  MAX_TEMPLATE_NAME_LENGTH: 255,
  MIN_SIGNERS: 1,
  MAX_SIGNERS: 50,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized. Please sign in.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  INVALID_REQUEST: "Invalid request.",
  SERVER_ERROR: "Internal server error. Please try again later.",
  DATABASE_ERROR: "Database error. Please try again later.",
  EMAIL_SEND_FAILED: "Failed to send email. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  DOCUMENT_NOT_FOUND: "Document not found.",
  SIGNER_NOT_FOUND: "Signer not found.",
  TEMPLATE_NOT_FOUND: "Template not found.",
  INVALID_TOKEN: "Invalid or expired token.",
  SIGNING_LINK_EXPIRED: "Signing link has expired.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_CREATED: "Document created successfully.",
  DOCUMENT_UPDATED: "Document updated successfully.",
  DOCUMENT_DELETED: "Document deleted successfully.",
  DOCUMENT_SENT: "Document sent to signers.",
  DOCUMENT_SIGNED: "Document signed successfully.",
  TEMPLATE_CREATED: "Template created successfully.",
  TEMPLATE_UPDATED: "Template updated successfully.",
  TEMPLATE_DELETED: "Template deleted successfully.",
  PASSWORD_RESET_SENT: "Password reset email sent. Please check your inbox.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
} as const;
