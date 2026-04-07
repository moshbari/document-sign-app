import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
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

    // Check authorization
    if (document.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get pending signers
    const pendingSigners = document.signers.filter(
      (s: any) => s.status === 'PENDING'
    );

    if (pendingSigners.length === 0) {
      return NextResponse.json(
        { error: 'No pending signers to send invites to' },
        { status: 400 }
      );
    }

    // TODO: Send emails to pending signers
    // const emailPromises = pendingSigners.map((signer) =>
    //   sendSigningInviteEmail(signer, document)
    // );
    // await Promise.all(emailPromises);

    // Create audit log
    await db.auditLog.create({
      data: {
        documentId: document.id,
        action: 'sent_to_signer',
        performedBy: session.user.email || session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({
      success: true,
      sentTo: pendingSigners.length,
    });
  } catch (error) {
    console.error('Error resending invites:', error);
    return NextResponse.json(
      { error: 'Failed to resend invites' },
      { status: 500 }
    );
  }
}
