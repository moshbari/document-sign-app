import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendSigningInvite } from '@/lib/email';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: { createdById: session.user.id },
      include: {
        signers: true,
        auditLogs: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, templateId, signers, content } = body;

    if (!title || !signers || signers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get template if provided
    let templateContent = null;
    if (templateId) {
      const template = await db.template.findUnique({
        where: { id: templateId },
      });
      if (template) {
        templateContent = template.content;
      }
    }

    // Create document
    const document = await db.document.create({
      data: {
        title,
        content: templateContent || content || {},
        createdById: session.user.id,
        status: 'DRAFT',
      },
    });

    // Create signers with unique tokens
    const createdSigners = await Promise.all(
      signers.map((signer: { name: string; email: string }) =>
        db.signer.create({
          data: {
            name: signer.name,
            email: signer.email,
            documentId: document.id,
            token: uuidv4(),
            status: 'PENDING',
          },
        })
      )
    );

    // Create audit log
    await db.auditLog.create({
      data: {
        documentId: document.id,
        action: 'created',
        performedBy: session.user.email || session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    // Update document status to PENDING
    await db.document.update({
      where: { id: document.id },
      data: { status: 'PENDING' },
    });

    // Create audit log for sending invites
    await db.auditLog.create({
      data: {
        documentId: document.id,
        action: 'sent_to_signer',
        performedBy: session.user.email || session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    // Send invitation emails to signers (non-blocking on individual failures)
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    await Promise.allSettled(
      createdSigners.map((signer) =>
        sendSigningInvite({
          signerEmail: signer.email,
          signerName: signer.name,
          documentTitle: document.title,
          signingLink: `${baseUrl}/sign/${signer.token}`,
          senderName: session.user?.name || 'OneSign',
        })
      )
    );

    return NextResponse.json(
      {
        id: document.id,
        title: document.title,
        status: document.status,
        signers: createdSigners,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
