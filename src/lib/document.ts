import { db } from "./db";
import { generateSigningToken } from "./token";
import { DocumentStatus, SignerStatus } from "@/types";

/**
 * Create a new document with signers
 */
export async function createDocument(
  title: string,
  content: Record<string, any>,
  createdById: string,
  signerEmails: string[]
) {
  const document = await db.document.create({
    data: {
      title,
      content,
      createdById,
      status: "DRAFT",
      signers: {
        create: signerEmails.map((email) => ({
          email,
          name: email.split("@")[0], // Use email prefix as default name
          token: generateSigningToken(),
          status: "PENDING",
        })),
      },
    },
    include: {
      signers: true,
    },
  });

  return document;
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus
) {
  return db.document.update({
    where: { id: documentId },
    data: { status },
  });
}

/**
 * Get document with all relations
 */
export async function getDocument(documentId: string) {
  return db.document.findUnique({
    where: { id: documentId },
    include: {
      signers: true,
      auditLogs: true,
      createdBy: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Get signer by token
 */
export async function getSignerByToken(token: string) {
  return db.signer.findUnique({
    where: { token },
    include: {
      document: {
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          signers: true,
        },
      },
    },
  });
}

/**
 * Update signer status (sign or decline)
 */
export async function updateSignerStatus(
  signerId: string,
  status: SignerStatus,
  signatureData?: string
) {
  const data: any = {
    status,
  };

  if (status === "SIGNED") {
    data.signedAt = new Date();
    if (signatureData) {
      data.signatureData = signatureData;
    }
  }

  return db.signer.update({
    where: { id: signerId },
    data,
    include: {
      document: {
        include: {
          signers: true,
        },
      },
    },
  });
}

/**
 * Check if all signers have signed
 */
export async function allSignersSigned(documentId: string): Promise<boolean> {
  const document = await db.document.findUnique({
    where: { id: documentId },
    include: {
      signers: true,
    },
  });

  if (!document) return false;

  return document.signers.every((signer: any) => signer.status === "SIGNED");
}

/**
 * Add audit log entry
 */
export async function addAuditLog(
  documentId: string,
  action: string,
  performedBy: string,
  ipAddress?: string
) {
  return db.auditLog.create({
    data: {
      documentId,
      action,
      performedBy,
      ipAddress,
    },
  });
}

/**
 * List user's documents
 */
export async function listUserDocuments(
  userId: string,
  options: { skip?: number; take?: number } = {}
) {
  const { skip = 0, take = 10 } = options;

  const [documents, total] = await Promise.all([
    db.document.findMany({
      where: { createdById: userId },
      include: {
        signers: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    db.document.count({
      where: { createdById: userId },
    }),
  ]);

  return {
    documents,
    total,
    page: Math.floor(skip / take) + 1,
    pages: Math.ceil(total / take),
  };
}
