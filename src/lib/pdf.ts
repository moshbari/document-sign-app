import { PDFDocument, PDFPage, rgb } from "pdf-lib";

interface TemplateField {
  name: string;
  label: string;
  type: "text" | "signature" | "date" | "checkbox";
  required?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface CreatePdfOptions {
  title: string;
  parties: string[];
  clauses: Array<{
    title: string;
    content: string;
  }>;
  fields?: TemplateField[];
}

/**
 * Create a new PDF from template fields, parties, and clauses
 */
export async function createPdfFromTemplate({
  title,
  parties,
  clauses,
  fields = [],
}: CreatePdfOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]); // Letter size: 8.5" x 11"

  const fontSize = 12;
  const margin = 50;
  const pageWidth = 612;
  const pageHeight = 792;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = pageHeight - margin;

  // Helper function to add text and handle page breaks
  const addText = (
    text: string,
    size: number = fontSize,
    isBold: boolean = false,
    lineHeight: number = 1.5
  ) => {
    const maxWidth = contentWidth;
    const wordArray = text.split(" ");
    let currentLine = "";

    for (const word of wordArray) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (testLine.length > 60) {
        // Rough estimate for line length
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size,
            color: rgb(0, 0, 0),
          });
          yPosition -= size * lineHeight;

          if (yPosition < margin) {
            page = pdfDoc.addPage([612, 792]);
            yPosition = pageHeight - margin;
          }
        }
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y: yPosition,
        size,
        color: rgb(0, 0, 0),
      });
      yPosition -= size * lineHeight;

      if (yPosition < margin) {
        page = pdfDoc.addPage([612, 792]);
        yPosition = pageHeight - margin;
      }
    }
  };

  // Add title
  addText(title, 18, true, 2);
  yPosition -= 10;

  // Add parties
  addText("PARTIES:", 12, true);
  for (const party of parties) {
    addText(`• ${party}`, 11);
  }
  yPosition -= 15;

  // Add clauses
  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i];
    addText(`${i + 1}. ${clause.title}`, 12, true);
    addText(clause.content, 11);
    yPosition -= 10;
  }

  // Add signature fields if provided
  if (fields.length > 0) {
    yPosition -= 20;
    addText("SIGNATURES:", 12, true);
    yPosition -= 15;

    for (const field of fields) {
      if (field.type === "signature") {
        addText(`${field.label}: ___________________________`, 11);
        addText(`Date: ________________`, 10);
        yPosition -= 20;
      }
    }
  }

  // Save and return PDF bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Embed a signature image (base64) onto a PDF at specified coordinates
 */
export async function embedSignatureOnPdf(
  pdfBytes: Uint8Array,
  signatureBase64: string,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageIndex?: number;
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const { x, y, width, height, pageIndex = 0 } = options;

  // Remove the data URI scheme if present
  const base64Data = signatureBase64.replace(/^data:image\/[^;]+;base64,/, "");

  // Decode base64 to bytes
  const binaryString = Buffer.from(base64Data, "base64").toString("binary");
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Try to embed as PNG first
  let signatureImage;
  try {
    signatureImage = await pdfDoc.embedPng(bytes);
  } catch {
    // Fall back to JPEG if PNG fails
    signatureImage = await pdfDoc.embedJpg(bytes);
  }

  const page = pdfDoc.getPage(pageIndex);
  page.drawImage(signatureImage, {
    x,
    y,
    width,
    height,
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}

/**
 * Add a completion stamp/watermark to a PDF
 */
export async function addCompletionStamp(
  pdfBytes: Uint8Array,
  options: {
    completionDate: Date;
    allSignerNames: string[];
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const firstPage = pdfDoc.getPage(0);
  const { width, height } = firstPage.getSize();

  // Add a "COMPLETED" watermark in the top-right corner
  firstPage.drawText("COMPLETED", {
    x: width - 150,
    y: height - 50,
    size: 14,
    color: rgb(0, 100, 0),
  });

  // Add completion date
  const dateStr = options.completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  firstPage.drawText(`Completed on: ${dateStr}`, {
    x: width - 200,
    y: height - 70,
    size: 10,
    color: rgb(100, 100, 100),
  });

  // Add signer information
  const signerText = `Signed by: ${options.allSignerNames.join(", ")}`;
  firstPage.drawText(signerText, {
    x: 50,
    y: 50,
    size: 9,
    color: rgb(100, 100, 100),
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePdfs(pdfBytesList: Uint8Array[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const pdfBytes of pdfBytesList) {
    const docToMerge = await PDFDocument.load(pdfBytes);
    const copiedPages = await pdfDoc.copyPages(docToMerge, docToMerge.getPageIndices());
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  }

  const mergedPdfBytes = await pdfDoc.save();
  return mergedPdfBytes;
}
