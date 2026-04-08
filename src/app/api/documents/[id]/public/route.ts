export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await db.document.findUnique({
      where: { id },
      include: {
        signers: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            signedAt: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Only allow viewing PENDING or COMPLETED documents (not DRAFT)
    if (document.status === "DRAFT") {
      return NextResponse.json(
        { error: "Document not available" },
        { status: 403 }
      );
    }

    const allSigned = document.signers.every((s) => s.status === "SIGNED");
    const someSigned = document.signers.some((s) => s.status === "SIGNED");

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        content: document.content,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        creatorName: document.createdBy?.name || "Unknown",
        creatorEmail: document.createdBy?.email || "",
      },
      signers: document.signers.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        status: s.status,
        signedAt: s.signedAt,
      })),
      summary: {
        totalSigners: document.signers.length,
        signedCount: document.signers.filter((s) => s.status === "SIGNED").length,
        pendingCount: document.signers.filter((s) => s.status === "PENDING").length,
        allSigned,
        someSigned,
      },
    });
  } catch (error) {
    console.error("Error fetching public document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
