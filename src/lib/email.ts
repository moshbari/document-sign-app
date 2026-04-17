import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM || "OneSign <noreply@onesign.click>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "support@onesign.click";

interface SendSigningInviteOptions {
  signerEmail: string;
  signerName: string;
  documentTitle: string;
  signingLink: string;
  senderName?: string;
}

export async function sendSigningInvite({
  signerEmail,
  signerName,
  documentTitle,
  signingLink,
  senderName = "OneSign",
}: SendSigningInviteOptions) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .message {
            font-size: 15px;
            line-height: 1.8;
            margin-bottom: 20px;
            color: #555;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .cta-button:hover {
            opacity: 0.9;
          }
          .link-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 13px;
            color: #666;
          }
          .document-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 4px;
          }
          .document-info strong {
            display: block;
            margin-bottom: 5px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .security-note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 10px 15px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 13px;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>OneSign</h1>
            <p>Digital Document Signing Platform</p>
          </div>
          <div class="content">
            <div class="greeting">
              Hi <strong>${signerName}</strong>,
            </div>
            <div class="message">
              ${senderName} has sent you a document to review and sign via OneSign.
            </div>
            <div class="document-info">
              <strong>Document Title:</strong>
              ${documentTitle}
            </div>
            <div class="message">
              Please click the button below to review and sign the document. Your unique signing link is secure and can only be used by you.
            </div>
            <center>
              <a href="${signingLink}" class="cta-button">Sign Document</a>
            </center>
            <div class="message">
              Alternatively, you can copy and paste this link in your browser:
            </div>
            <div class="link-section">
              <code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: block; word-break: break-all; font-size: 12px;">
                ${signingLink}
              </code>
            </div>
            <div class="security-note">
              <strong>Security Note:</strong> This link is unique to you and will expire after 30 days. Do not share this link with others.
            </div>
            <div class="message" style="margin-top: 30px;">
              If you have any questions or did not expect this request, please contact the sender directly.
            </div>
            <div class="footer">
              <p>OneSign - Secure Digital Document Signing</p>
              <p>&copy; 2026 OneSign. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hi ${signerName},

${senderName} has sent you a document to review and sign via OneSign.

Document Title: ${documentTitle}

Please visit the following link to sign the document:
${signingLink}

This link is unique to you and will expire after 30 days. Do not share this link with others.

If you have any questions or did not expect this request, please contact the sender directly.

---
OneSign - Secure Digital Document Signing
  `.trim();

  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping send. Link:", signingLink);
    return { id: "dev-skip" };
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: signerEmail,
    replyTo: REPLY_TO,
    subject: `${senderName} has sent you a document to sign: ${documentTitle}`,
    html: htmlContent,
    text: textContent,
  });

  if (error) {
    console.error(`[email] Failed to send signing invite to ${signerEmail}:`, error);
    throw new Error(error.message || "Failed to send email");
  }

  console.log(`[email] Signing invite sent to ${signerEmail}:`, data?.id);
  return data;
}

export async function sendDocumentCompleted({
  recipientEmail,
  recipientName,
  documentTitle,
}: {
  recipientEmail: string;
  recipientName: string;
  documentTitle: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .success-message {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #065f46;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Document Signed</h1>
          </div>
          <div class="content">
            <div style="font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${recipientName}</strong>,
            </div>
            <div class="success-message">
              <strong>&#10003; Success!</strong> All parties have signed the document: <strong>${documentTitle}</strong>
            </div>
            <div style="font-size: 15px; line-height: 1.8; color: #555; margin: 20px 0;">
              The document is now complete and all signatures have been recorded. You can download a copy of the signed document from your OneSign dashboard.
            </div>
            <div class="footer">
              <p>OneSign - Secure Digital Document Signing</p>
              <p>&copy; 2026 OneSign. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hi ${recipientName},

All parties have signed the document: ${documentTitle}

The document is now complete and all signatures have been recorded. You can download a copy of the signed document from your OneSign dashboard.

---
OneSign - Secure Digital Document Signing
  `.trim();

  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping completion send to", recipientEmail);
    return { id: "dev-skip" };
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: recipientEmail,
    replyTo: REPLY_TO,
    subject: `Document Signed: ${documentTitle}`,
    html: htmlContent,
    text: textContent,
  });

  if (error) {
    console.error(`[email] Failed to send completion email to ${recipientEmail}:`, error);
    throw new Error(error.message || "Failed to send email");
  }

  console.log(`[email] Completion email sent to ${recipientEmail}:`, data?.id);
  return data;
}
