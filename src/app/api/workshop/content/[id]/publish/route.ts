/**
 * Workshop Content Publish API Route
 * POST /api/workshop/content/[id]/publish - Publish a content module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { publishModule } from '@/lib/workshop/content-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Publish a content module (admin only)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && user.role !== 'clinic_manager' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const module = await publishModule(id);

    return NextResponse.json({
      success: true,
      message: 'Content module published',
      module: {
        id: module.id,
        title: module.title,
        status: module.status,
        updatedAt: module.updatedAt,
      },
    });
  } catch (error) {
    console.error('Publish content module error:', error);
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: 'Content module not found' }, { status: 404 });
      }
      if (error.message.includes('archived')) {
        return NextResponse.json({ error: 'Cannot publish an archived module' }, { status: 400 });
      }
    }
    return NextResponse.json(
      { error: 'Failed to publish content module' },
      { status: 500 }
    );
  }
}
