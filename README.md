# OneSign - Digital Document Signing Platform

A modern, white-label-ready SaaS platform for digital document signing. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Template-based agreements** — Create reusable templates with custom fields
- **Multi-party signing** — Send documents to multiple signers via email
- **3 signature methods** — Draw on canvas, type with handwriting fonts, or upload an image
- **Real-time tracking** — Monitor document status and signing progress
- **PDF generation** — Download signed documents with embedded signatures
- **Audit trail** — Complete logging of all document actions
- **Email notifications** — Automatic invites and confirmations
- **White-label ready** — CSS variable-based theming for custom branding

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth v5
- **Database:** PostgreSQL with Prisma ORM
- **PDF:** pdf-lib for generation and signature embedding
- **Signatures:** signature_pad for canvas drawing
- **Email:** Nodemailer with HTML templates
- **Deployment:** Railway

## Quick Start

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

## License

MIT
