export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PDFDocument, PDFPage, rgb } from "pdf-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Get document
    const document = await db.document.findUnique({
      where: { id },
      include: {
        createdBy: true,
        signers: true,
        auditLogs: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Authorization check: creator or signer can download
    const userEmail = session?.user?.email;
    const isCreator = document.createdBy.email === userEmail;
    const isSigner = document.signers.some((s: any) => s.email === userEmail);

    if (!isCreator && !isSigner) {
      return NextResponse.json(
        { message: "Unauthorized to download this document" },
        { status: 403 }
      );
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();

    // Add main content page
    let page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();

    // Add document title and info
    page.drawText(document.title, {
      x: 40,
      y: height - 60,
      size: 24,
      color: rgb(0.31, 0.28, 0.9), // Primary color
    });

    // Add document details
    page.drawText("Document Information", {
      x: 40,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Created by: ${document.createdBy.name} (${document.createdBy.email})`,
      {
        x: 40,
        y: height - 120,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      }
    );

    page.drawText(
      `Date Created: ${new Date(document.createdAt).toLocaleDateString()}`,
      {
        x: 40,
        y: height - 135,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      }
    );

    page.drawText(
      `Status: ${document.status === "COMPLETED" ? "Signed" : document.status}`,
      {
        x: 40,
        y: height - 150,
        size: 10,
        color: rgb(
          document.status === "COMPLETED" ? 0.16 : 0.7,
          document.status === "COMPLETED" ? 0.73 : 0.4,
          document.status === "COMPLETED" ? 0.5 : 0.4
        ),
      }
    );

    // Add document content
    page.drawText("Document Content", {
      x: 40,
      y: height - 190,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const contentText =
      typeof document.content === "string"
        ? document.content
        : JSON.stringify(document.content, null, 2);

    // Simple text wrapping for content
    const maxWidth = width - 80;
    const fontSize = 10;
    const lineHeight = 14;
    let yPosition = height - 210;

    const words = contentText.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      // Estimate width (rough calculation)
      if (testLine.length > 80) {
        if (currentLine) {
          page.drawText(currentLine, {
            x: 40,
            y: yPosition,
            size: fontSize,
            color: rgb(0.3, 0.3, 0.3),
          });
          yPosition -= lineHeight;

          // Check if we need a new page
          if (yPosition < 60) {
            page = pdfDoc.addPage([612, 792]);
            yPosition = height - 60;
          }
        }
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    // Draw last line
    if (currentLine) {
      page.drawText(currentLine, {
        x: 40,
        y: yPosition,
        size: fontSize,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    // Add signatures page if document is completed
    if (document.status === "COMPLETED") {
      page = pdfDoc.addPage([612, 792]);
      const { height: pageHeight } = page.getSize();

      page.drawText("Signature Page", {
        x: 40,
        y: pageHeight - 60,
        size: 18,
        color: rgb(0.31, 0.28, 0.9),
      });

      page.drawText("This document has been digitally signed by:", {
        x: 40,
        y: pageHeight - 100,
        size: 11,
        color: rgb(0, 0, 0),
      });

      let sigYPosition = pageHeight - 130;
      const signedSigners = document.signers.filter(
        (s: any) => s.status === "SIGNED"
      );

      for (const signer of signedSigners) {
        page.drawText(`✓ ${signer.name} (${signer.email})`, {
          x: 60,
          y: sigYPosition,
          size: 10,
          color: rgb(0.1, 0.7, 0.5),
        });

        if (signer.signedAt) {
          page.drawText(`  Signed on: ${signer.signedAt.toLocaleDateString()}`, {
            x: 80,
            y: sigYPosition - 15,
            size: 9,
            color: rgb(0.4, 0.4, 0.4),
          });
          sigYPosition -= 40;
        } else {
          sigYPosition -= 25;
        }
      }

      // Add embedded signature images if available
      let imageYPosition = sigYPosition - 20;
      for (const signer of signedSigners) {
        if (signer.signatureData) {
          try {
            // Check if it's a data URL
            if (signer.signatureData.startsWith("data:image")) {
              const base64Data = signer.signatureData.split(",")[1];
              const imageBytes = Buffer.from(base64Data, "base64");

              // Determine image type from data URL
              const mimeType = signer.signatureData.split(";")[0].split(":")[1];
              const embeddedImage =
                mimeType === "image/png"
                  ? await pdfDoc.embedPng(imageBytes)
                  : await pdfDoc.embedJpg(imageBytes);

              page.drawText(`${signer.name}'s Signature:`, {
                x: 60,
                y: imageYPosition,
                size: 9,
                color: rgb(0.4, 0.4, 0.4),
              });

              page.drawImage(embeddedImage, {
                x: 60,
                y: imageYPosition - 50,
                width: 100,
                height: 40,
              });

              imageYPosition -= 80;

              // Check if we need a new page
              if (imageYPosition < 100) {
                page = pdfDoc.addPage([612, 792]);
                imageYPosition = pageHeight - 60;
              }
            }
          } catch (err) {
            console.error(`Failed to embed signature for ${signer.name}:`, err);
          }
        }
      }

      // Add audit trail
      page.drawText("Audit Trail", {
        x: 40,
        y: imageYPosition - 20,
        size: 12,
        color: rgb(0.31, 0.28, 0.9),
      });

      let auditYPosition = imageYPosition - 50;
      const auditLogs = document.auditLogs.slice(-10); // Last 10 entries

      for (const log of auditLogs) {
        const actionText = `${log.action.toUpperCase()} - ${log.performedBy} on ${log.timestamp.toLocaleDateString()}`;
        page.drawText(actionText, {
          x: 60,
          y: auditYPosition,
          size: 9,
          color: rgb(0.3, 0.3, 0.3),
        });
        auditYPosition -= 18;

        if (auditYPosition < 60) {
          page = pdfDoc.addPage([612, 792]);
          auditYPosition = pageHeight - 60;
        }
      }
    }

    // Add footer on all pages
    const pages = pdfDoc.getPages();
    pages.forEach((p, index) => {
      const { width: w, height: h } = p.getSize();
      p.drawText(
        `Page ${index + 1} of ${pages.length} - OneSign Digital Document`,
        {
          x: 40,
          y: 20,
          size: 8,
          color: rgb(0.6, 0.6, 0.6),
        }
      );
    });

    // Save PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return PDF as downloadable file
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
