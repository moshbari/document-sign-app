# OneSign Core Infrastructure

This document describes the core infrastructure files created for the OneSign SaaS platform.

## Overview

The infrastructure includes:
- Database schema with Prisma ORM
- Authentication with NextAuth v5
- Email service integration
- PDF generation and signing
- Type definitions
- Middleware for protected routes
- Utility libraries for common operations

## Files Created

### 1. Database (`prisma/schema.prisma`)
Complete PostgreSQL schema with 5 models:
- **User**: User accounts with role-based access (admin/user)
- **Document**: Digital documents with JSON content storage
- **Template**: Reusable document templates
- **Signer**: Document signers with unique signing tokens
- **AuditLog**: Activity tracking for compliance

Features:
- Proper relations with cascade deletes
- Indexed fields for performance
- JSON storage for flexible document/template content
- Token-based unique signing links

### 2. Database Client (`src/lib/db.ts`)
Prisma client singleton for Next.js with:
- Development-time query logging
- Proper initialization to avoid duplicate instances
- Safe for both server and edge environments

### 3. Authentication (`src/lib/auth.ts`)
NextAuth v5 configuration with:
- Credentials provider (email/password)
- JWT-based sessions
- bcryptjs password hashing
- Custom JWT callback for role/company in session
- 30-day session expiration
- Redirect to sign-in page for protected routes

### 4. NextAuth Routes (`src/app/api/auth/[...nextauth]/route.ts`)
Exports GET/POST handlers from auth configuration

### 5. Email Service (`src/lib/email.ts`)
Nodemailer-based email utility with:
- **sendSigningInvite()**: HTML email template for signing invitations
- **sendDocumentCompleted()**: Notification when all parties have signed
- Development/production SMTP configuration
- Beautiful branded email templates with OneSign styling
- Environment variable configuration (SMTP_HOST, SMTP_PORT, etc.)

### 6. PDF Utilities (`src/lib/pdf.ts`)
pdf-lib based PDF operations:
- **createPdfFromTemplate()**: Generate PDF from parties, clauses, and fields
- **embedSignatureOnPdf()**: Add signature images at specified coordinates
- **addCompletionStamp()**: Add watermarks and completion info
- **mergePdfs()**: Combine multiple PDFs

### 7. Type Definitions (`src/types/index.ts`)
TypeScript interfaces for:
- DocumentStatus, SignerStatus, UserRole enums
- User, Document, Template, Signer, AuditLog models
- API request/response types
- Session user type
- Pagination types

### 8. Middleware (`src/middleware.ts`)
NextAuth middleware protecting:
- `/dashboard` routes
- `/documents` routes
- `/templates` routes
- `/settings` routes
- `/api/documents` endpoints
- `/api/templates` endpoints

Redirects unauthenticated users to sign-in with callback URL

### 9. Password Utilities (`src/lib/password.ts`)
- **hashPassword()**: bcryptjs hashing with salt rounds
- **verifyPassword()**: Compare password with hash
- **validatePasswordStrength()**: Check minimum requirements (8+ chars, uppercase, lowercase, number, special char)

### 10. Token Utilities (`src/lib/token.ts`)
- **generateSigningToken()**: UUID-based unique signing link tokens
- **generateJwtToken()**: JWT generation with custom expiry
- **verifyJwtToken()**: JWT validation and decoding
- **generateRandomToken()**: Secure random string generation

### 11. Document Operations (`src/lib/document.ts`)
Database operations for documents:
- **createDocument()**: Create document with signers
- **updateDocumentStatus()**: Change document status
- **getDocument()**: Fetch document with relations
- **getSignerByToken()**: Find signer by unique token
- **updateSignerStatus()**: Record signature or decline
- **allSignersSigned()**: Check completion status
- **addAuditLog()**: Log document actions
- **listUserDocuments()**: Paginated user documents

### 12. Validation (`src/lib/validation.ts`)
Input validation utilities:
- **isValidEmail()**: Email format validation
- **parseEmailList()**: Parse comma/newline-separated emails
- **validateDocumentTitle()**: Document title rules
- **validateSignerEmails()**: Validate email list
- **sanitizeInput()**: XSS prevention
- **validateTemplateName()**: Template name rules
- **validateTemplateContent()**: Schema validation
- **isValidId()**: CUID/UUID validation

### 13. Utility Functions (`src/lib/utils.ts`)
- **getClientIp()**: Extract client IP from request
- **formatDate()**: Human-readable dates
- **formatDateTime()**: Date + time formatting
- **timeAgo()**: Relative time display
- **formatBytes()**: File size formatting
- **randomString()**: Generate random strings
- **slugify()**: URL-safe slugs
- **clone/deepClone()**: Object cloning

### 14. Constants (`src/lib/constants.ts`)
Centralized constants:
- Document/Signer/User statuses
- Audit actions
- Field types
- Pagination defaults
- File upload limits
- Token expiration times
- API endpoints and routes
- Validation rules
- Error/Success messages

### 15. Health Check API (`src/app/api/health/route.ts`)
Endpoint for deployment monitoring:
- Tests database connectivity
- Returns uptime and status
- Used by Railway healthcheck

### 16. Environment Configuration (`.env.example`)
Template for all environment variables:
- Database URL
- NextAuth configuration
- SMTP settings
- Application settings
- Optional: AWS S3, Google OAuth, GitHub OAuth, Analytics

### 17. Deployment Config (`railway.toml`)
Railway.app deployment configuration:
- Build and start commands
- Health check configuration
- Environment setup

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in values:
```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `SMTP_*`: Email service credentials

### 2. Database Migration
```bash
npx prisma migrate dev --name init
```

This generates the Prisma client and creates the database schema.

### 3. Create Initial Admin User
```bash
npx ts-node --eval "
import { db } from './src/lib/db';
import { hashPassword } from './src/lib/password';

async function createAdmin() {
  const hashedPassword = await hashPassword('ChangeMe123!');
  const admin = await db.user.create({
    data: {
      email: 'admin@onesign.app',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      company: 'OneSign Inc',
    },
  });
  console.log('Admin created:', admin.email);
}

createAdmin();
"
```

### 4. Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Key Features

### Authentication
- Email/password login with bcryptjs hashing
- JWT sessions with 30-day expiration
- Role-based access (admin/user)
- Protected dashboard routes via middleware

### Documents
- Create, read, update, delete documents
- JSON-based flexible content storage
- Track document status (Draft → Pending → Completed)
- Audit logging for compliance
- Unique signing links per signer

### Email
- Beautiful HTML templates
- Signing invitations with personalized links
- Completion notifications
- Nodemailer SMTP integration
- Development email service support

### PDF
- Generate PDFs from templates
- Embed signature images
- Add completion watermarks
- Merge multiple PDFs

### Security
- Password strength validation
- Input sanitization (XSS prevention)
- CSRF protection via NextAuth
- Secure JWT tokens
- Database cascade deletes

## Database Schema Relationships

```
User
├── documents (Document[])
├── templates (Template[])
└── auditLogs (AuditLog[])

Document
├── createdBy (User)
├── signers (Signer[])
└── auditLogs (AuditLog[])

Signer
└── document (Document)

AuditLog
└── document (Document)

Template
└── createdBy (User)
```

## API Routes

- `GET/POST /api/auth/[...nextauth]` - Authentication
- `GET /api/health` - Health check
- `POST /api/documents` - Create document
- `GET /api/documents/:id` - Get document
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/templates` - Create template
- `GET /api/templates` - List templates

## Environment Variables

```
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/onesign"

# Authentication
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"
SMTP_FROM="noreply@onesign.app"

# Application
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Next Steps

1. **Create pages**: Build sign-in, sign-up, dashboard pages
2. **API endpoints**: Implement document CRUD, signing flow
3. **Frontend components**: Document list, editor, signing interface
4. **Testing**: Unit and integration tests
5. **Deployment**: Configure and deploy to Railway/Vercel

## Dependencies Used

- **@prisma/client**: ORM
- **next-auth**: Authentication
- **bcryptjs**: Password hashing
- **nodemailer**: Email service
- **pdf-lib**: PDF manipulation
- **jsonwebtoken**: JWT tokens
- **uuid**: ID generation
- **typescript**: Type safety

## Troubleshooting

**Prisma client not found**:
```bash
npx prisma generate
npx prisma migrate dev
```

**Email not sending**:
- Check SMTP credentials in `.env.local`
- Ensure firewall allows SMTP port
- Try Ethereal Email for development

**Authentication errors**:
- Verify `NEXTAUTH_SECRET` is set
- Clear cookies and try again
- Check password meets strength requirements

**Database errors**:
- Verify `DATABASE_URL` format
- Ensure PostgreSQL is running
- Run migrations: `npx prisma migrate dev`
