export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSigningInvite, sendDocumentCompleted } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find the signer by token
    const signer = await db.signer.findUnique({
      where: { token },
      include: {
        document: {
          include: {
            createdBy: true,
          },
        },
      },
    });

    // Check if signer exists
    if (!signer) {
      return NextResponse.json(
        { message: "Invalid or expired signing link." },
        { status: 404 }
      );
    }

    // Check if already signed
    if (signer.status === "SIGNED") {
      return NextResponse.json(
        {
          message:
            "This document has already been signed. Please contact the sender for updates.",
        },
        { status: 410 }
      );
    }

    // Check if declined
    if (signer.status === "DECLINED") {
      return NextResponse.json(
        {
          message:
            "This document was declined. Please contact the sender for clarification.",
        },
        { status: 410 }
      );
    }

    // Return document and signer info
    return NextResponse.json({
      document: {
        id: signer.document.id,
        title: signer.document.title,
        content: signer.document.content,
        creatorName: signer.document.createdBy.name,
        createdAt: signer.document.createdAt.toISOString(),
      },
      signer: {
        id: signer.id,
        name: signer.name,
        email: signer.email,
        status: signer.status,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/sign/[token]:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { signatureData } = body;

    if (!signatureData) {
      return NextResponse.json(
        { message: "Signature data is required." },
        { status: 400 }
      );
    }

    // Find the signer by token
    const signer = await db.signer.findUnique({
      where: { token },
      include: {
        document: {
          include: {
            createdBy: true,
            signers: true,
          },
        },
      },
    });

    if (!signer) {
      return NextResponse.json(
        { message: "Invalid or expired signing link." },
        { status: 404 }
      );
    }

    // Check if already signed
    if (signer.status !== "PENDING") {
      return NextResponse.json(
        { message: "This signer has already acted on this document." },
        { status: 410 }
      );
    }

    // Update signer with signature and status
    const updatedSigner = await db.signer.update({
      where: { id: signer.id },
      data: {
        status: "SIGNED",
        signatureData,
        signedAt: new Date(),
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        documentId: signer.document.id,
        action: "signed",
        performedBy: signer.email,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      },
    });

    // Check if all signers have signed
    const allSigners = signer.document.signers;
    const allSigned = allSigners.every((s: any) => s.status === "SIGNED");

    // If all signed, update document status
    if (allSigned) {
      await db.document.update({
        where: { id: signer.document.id },
        data: {
          status: "COMPLETED",
          updatedAt: new Date(),
        },
      });

      // Send notification to document creator
      try {
        await sendDocumentCompleted({
          recipientEmail: signer.document.createdBy.email,
          recipientName: signer.document.createdBy.name,
          documentTitle: signer.document.title,
        });
      } catch (emailError) {
        console.error("Failed to send completion email:", emailError);
        // Don't fail the signing if email fails
      }
    }

    // Send confirmation email to signer
    try {
      await sendSigningInvite({
        signerEmail: signer.email,
        signerName: signer.name,
        documentTitle: signer.document.title,
        signingLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sign/${token}`,
        senderName: signer.document.createdBy.name,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the signing if email fails
    }

    return NextResponse.json({
      message: "Document signed successfully!",
      success: true,
      signer: {
        id: updatedSigner.id,
        name: updatedSigner.name,
        email: updatedSigner.email,
        status: updatedSigner.status,
        signedAt: updatedSigner.signedAt,
      },
      documentCompleted: allSigned,
    });
  } catch (error) {
    console.error("Error in POST /api/sign/[token]:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
