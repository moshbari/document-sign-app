// Document status types
export type DocumentStatus = "DRAFT" | "PENDING" | "COMPLETED" | "EXPIRED";

// Signer status types
export type SignerStatus = "PENDING" | "SIGNED" | "DECLINED";

// User role types
export type UserRole = "admin" | "user";

// Template field types
export type TemplateFieldType = "text" | "signature" | "date" | "checkbox";

// Audit log action types
export type AuditAction =
  | "created"
  | "signed"
  | "declined"
  | "sent_to_signer"
  | "downloaded"
  | "deleted"
  | "status_changed";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface Document {
  id: string;
  title: string;
  status: DocumentStatus;
  content: Record<string, any>;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  signers?: Signer[];
  auditLogs?: AuditLog[];
}

// Template interface
export interface Template {
  id: string;
  name: string;
  description?: string;
  content: Record<string, any>;
  createdById: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Signer interface
export interface Signer {
  id: string;
  name: string;
  email: string;
  documentId: string;
  status: SignerStatus;
  token: string;
  signedAt?: Date;
  signatureData?: string; // Base64 encoded signature
  createdAt: Date;
  updatedAt: Date;
}

// Audit log interface
export interface AuditLog {
  id: string;
  documentId: string;
  action: AuditAction;
  performedBy: string;
  ipAddress?: string;
  timestamp: Date;
}

// Template field interface
export interface TemplateField {
  name: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  placeholder?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Session user type
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  company?: string;
}

// Auth types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  company?: string;
}

// Document creation request
export interface CreateDocumentRequest {
  title: string;
  templateId?: string;
  content: Record<string, any>;
  signerEmails: string[];
}

// Signing request
export interface SignDocumentRequest {
  signatureData: string; // Base64 encoded signature
  signedName?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
