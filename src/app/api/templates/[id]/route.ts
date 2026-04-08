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

    const template = await db.template.findFirst({
      where: {
        id,
        OR: [
          { createdById: session.user.id },
          { isPublic: true },
        ],
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
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

    // Only allow editing own templates
    const existing = await db.template.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, content, isPublic } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const template = await db.template.update({
      where: { id },
      data: {
        name,
        description: description || null,
        content,
        isPublic: isPublic ?? existing.isPublic,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
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

    // Only allow deleting own templates
    const existing = await db.template.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    await db.template.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
