import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const document = await db.document.findUnique({
      where: { id },
      include: {
        signers: true,
        auditLogs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization
    if (document.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const document = await db.document.findUnique({
      where: { id },
      include: { signers: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (document.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot edit completed documents' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, content, signers } = body;

    // Update document title and content
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const updatedDocument = await db.document.update({
      where: { id },
      data: updateData,
      include: { signers: true, auditLogs: { orderBy: { timestamp: 'desc' } } },
    });

    // Update signers if provided
    if (signers && Array.isArray(signers)) {
      // Delete existing signers that are not signed
      const existingSignerIds = document.signers.map((s) => s.id);
      const signedSignerIds = document.signers
        .filter((s) => s.status === 'SIGNED')
        .map((s) => s.id);

      // Remove unsigned signers
      await db.signer.deleteMany({
        where: {
          documentId: id,
          status: { not: 'SIGNED' },
        },
      });

      // Add new/updated signers (skip ones that match already-signed signers)
      for (const signer of signers) {
        const alreadySigned = document.signers.find(
          (s) => s.email === signer.email && s.status === 'SIGNED'
        );
        if (!alreadySigned) {
          await db.signer.create({
            data: {
              name: signer.name,
              email: signer.email,
              documentId: id,
              token: crypto.randomUUID(),
              status: 'PENDING',
            },
          });
        }
      }
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        documentId: id,
        action: 'Document Edited',
        performedBy: session.user.email || 'Unknown',
      },
    });

    // Re-fetch with all relations
    const result = await db.document.findUnique({
      where: { id },
      include: {
        signers: true,
        auditLogs: { orderBy: { timestamp: 'desc' } },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const document = await db.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization
    if (document.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only allow deletion of DRAFT documents
    if (document.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Can only delete draft documents' },
        { status: 400 }
      );
    }

    // Delete document (cascade will delete signers and audit logs)
    await db.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
