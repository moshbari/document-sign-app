export const dynamic = 'force-dynamic';

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  CheckCircle,
  Clock,
  Download,
  Loader,
  AlertCircle,
  Users,
  Shield,
} from "lucide-react";

interface SignerInfo {
  id: string;
  name: string;
  email: string;
  status: string;
  signedAt: string | null;
}

interface DocumentData {
  id: string;
  title: string;
  status: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  creatorName: string;
  creatorEmail: string;
}

interface SummaryData {
  totalSigners: number;
  signedCount: number;
  pendingCount: number;
  allSigned: boolean;
  someSigned: boolean;
}

export default function SharedDocumentView() {
  const params = useParams();
  const documentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [signers, setSigners] = useState<SignerInfo[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/public`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Document not found.");
          } else if (response.status === 403) {
            setError("This document is not available for viewing.");
          } else {
            setError("Failed to load document.");
          }
          return;
        }
        const data = await response.json();
        setDocument(data.document);
        setSigners(data.signers);
        setSummary(data.summary);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const handleDownloadPdf = async () => {
    if (!document) return;
    setGeneratingPdf(true);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;
      let currentY = pageHeight - margin;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);

      const addNewPageIfNeeded = (spaceNeeded: number) => {
        if (currentY - spaceNeeded < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
      };

      // Title
      page.drawText(document.title, {
        x: margin,
        y: currentY,
        size: 22,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.3),
      });
      currentY -= 30;

      // Status badge
      const statusText =
        summary?.allSigned
          ? "FULLY SIGNED"
          : summary?.someSigned
          ? "PARTIALLY SIGNED"
          : "PENDING SIGNATURES";
      page.drawText(`Status: ${statusText}`, {
        x: margin,
        y: currentY,
        size: 11,
        font: helvetica,
        color: summary?.allSigned ? rgb(0, 0.5, 0) : rgb(0.8, 0.5, 0),
      });
      currentY -= 15;

      // Creator & Date
      page.drawText(
        `Created by: ${document.creatorName} | Date: ${new Date(document.createdAt).toLocaleDateString()}`,
        {
          x: margin,
          y: currentY,
          size: 10,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4),
        }
      );
      currentY -= 30;

      // Divider
      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: pageWidth - margin, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 25;

      // Document Content
      page.drawText("Document Content", {
        x: margin,
        y: currentY,
        size: 14,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.3),
      });
      currentY -= 20;

      if (
        typeof document.content === "object" &&
        document.content !== null &&
        "fields" in document.content &&
        Array.isArray(document.content.fields)
      ) {
        for (const field of document.content.fields) {
          addNewPageIfNeeded(30);
          page.drawText(`${field.label}:`, {
            x: margin + 10,
            y: currentY,
            size: 10,
            font: helveticaBold,
            color: rgb(0.2, 0.2, 0.2),
          });

          const typeText = `[${field.type}]${field.required ? " *Required" : ""}`;
          const labelWidth = helveticaBold.widthOfTextAtSize(field.label + ":", 10);
          page.drawText(typeText, {
            x: margin + 15 + labelWidth,
            y: currentY,
            size: 8,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5),
          });

          if (field.value) {
            currentY -= 14;
            page.drawText(String(field.value), {
              x: margin + 20,
              y: currentY,
              size: 10,
              font: helvetica,
              color: rgb(0.3, 0.3, 0.3),
            });
          }
          currentY -= 18;
        }
      } else {
        const contentStr =
          typeof document.content === "string"
            ? document.content
            : JSON.stringify(document.content, null, 2);
        const lines = contentStr.split("\n");
        for (const line of lines) {
          addNewPageIfNeeded(15);
          page.drawText(line.substring(0, 80), {
            x: margin + 10,
            y: currentY,
            size: 9,
            font: helvetica,
            color: rgb(0.3, 0.3, 0.3),
          });
          currentY -= 14;
        }
      }

      currentY -= 15;
      addNewPageIfNeeded(40);

      // Divider
      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: pageWidth - margin, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 25;

      // Signatures Section
      page.drawText("Signatures", {
        x: margin,
        y: currentY,
        size: 14,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.3),
      });
      currentY -= 25;

      for (const signer of signers) {
        addNewPageIfNeeded(50);

        page.drawText(signer.name, {
          x: margin + 10,
          y: currentY,
          size: 11,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= 14;

        page.drawText(signer.email, {
          x: margin + 10,
          y: currentY,
          size: 9,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5),
        });
        currentY -= 14;

        if (signer.status === "SIGNED" && signer.signedAt) {
          page.drawText(
            `Signed on ${new Date(signer.signedAt).toLocaleString()}`,
            {
              x: margin + 10,
              y: currentY,
              size: 9,
              font: helvetica,
              color: rgb(0, 0.5, 0),
            }
          );
        } else {
          page.drawText("Awaiting signature", {
            x: margin + 10,
            y: currentY,
            size: 9,
            font: helvetica,
            color: rgb(0.8, 0.5, 0),
          });
        }
        currentY -= 25;
      }

      // Footer
      addNewPageIfNeeded(40);
      currentY -= 10;
      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: pageWidth - margin, y: currentY },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 15;
      page.drawText(
        `Generated by OneSign on ${new Date().toLocaleString()} | onesign.click`,
        {
          x: margin,
          y: currentY,
          size: 8,
          font: helvetica,
          color: rgb(0.6, 0.6, 0.6),
        }
      );

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${document.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white shadow-lg">
          <div className="border-b border-red-200 bg-red-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">
                Unable to View Document
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-slate-700">{error}</p>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <a
              href="/"
              className="block text-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = summary?.allSigned
    ? {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        message: "All parties have signed this document.",
      }
    : summary?.someSigned
    ? {
        label: "Partially Signed",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-5 w-5 text-yellow-600" />,
        message: `${summary.signedCount} of ${summary.totalSigners} parties have signed.`,
      }
    : {
        label: "Pending",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <Clock className="h-5 w-5 text-orange-600" />,
        message: "Awaiting signatures from all parties.",
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">OneSign</h1>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {generatingPdf ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Document Title & Status Banner */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    {document?.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600">
                  Created by {document?.creatorName} on{" "}
                  {document?.createdAt
                    ? new Date(document.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.color}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-sm text-slate-600">{statusConfig.message}</p>
          </div>
        </div>

        {/* Signing Status */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-md">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Signing Status</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {signers.map((signer) => (
              <div
                key={signer.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{signer.name}</p>
                  <p className="text-sm text-slate-500">{signer.email}</p>
                </div>
                <div className="text-right">
                  {signer.status === "SIGNED" ? (
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Signed
                      </span>
                      {signer.signedAt && (
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(signer.signedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Content */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-md">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Document Content</h3>
          </div>
          <div className="px-6 py-4">
            {typeof document?.content === "object" &&
            document.content !== null &&
            "fields" in document.content &&
            Array.isArray((document.content as any).fields) ? (
              <div className="space-y-4">
                {(document.content as any).fields.map(
                  (field: any, idx: number) => (
                    <div
                      key={field.id || idx}
                      className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {field.label}
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="text-xs text-red-500">Required</span>
                        )}
                      </div>
                      {field.value && (
                        <p className="text-sm text-gray-600 mt-1">
                          {field.value}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : typeof document?.content === "string" ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700">
                {document.content}
              </div>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(document?.content, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Download Section */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <Download className="mx-auto h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-blue-900 mb-1">
            Download a Copy
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Generate and download a PDF version of this document with current signing status.
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {generatingPdf ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600">
        <p>Powered by OneSign - Secure Digital Document Signing</p>
        <p className="mt-1">&copy; 2026 OneSign. All rights reserved.</p>
      </div>
    </div>
  );
}
