/**
 * Workshop Content Module API Routes
 * GET /api/workshop/content/[id] - Get a content module
 * PATCH /api/workshop/content/[id] - Update a content module
 * DELETE /api/workshop/content/[id] - Archive a content module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  getModule,
  updateModule,
  archiveModule,
  isValidCategory,
  isValidAgeRange,
  type HABITSCategory,
} from '@/lib/workshop/content-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a content module by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const module = await getModule(id);

    if (!module) {
      return NextResponse.json({ error: 'Content module not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';

    // Non-admin users can only see published modules
    if (!isAdmin && module.status !== 'published') {
      return NextResponse.json({ error: 'Content module not found' }, { status: 404 });
    }

    return NextResponse.json({
      module: {
        id: module.id,
        title: module.title,
        description: module.description,
        category: module.category,
        ageGroupMin: module.ageGroupMin,
        ageGroupMax: module.ageGroupMax,
        version: module.version,
        status: module.status,
        mediaAssets: module.mediaAssets.map((a) => ({
          id: a.id,
          type: a.type,
          url: a.url,
          filename: a.filename,
          size: a.size,
        })),
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get content module error:', error);
    return NextResponse.json(
      { error: 'Failed to get content module' },
      { status: 500 }
    );
  }
}

// PATCH - Update a content module (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json();
    const { title, description, category, ageGroupMin, ageGroupMax } = body;

    // Validate category if provided
    if (category && !isValidCategory(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: H, A, B, I, T, S' },
        { status: 400 }
      );
    }

    // Validate age range if provided
    if (
      (ageGroupMin !== undefined || ageGroupMax !== undefined) &&
      !isValidAgeRange(ageGroupMin ?? 0, ageGroupMax ?? 18)
    ) {
      return NextResponse.json(
        { error: 'Invalid age range' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category as HABITSCategory;
    if (ageGroupMin !== undefined) updateData.ageGroupMin = ageGroupMin;
    if (ageGroupMax !== undefined) updateData.ageGroupMax = ageGroupMax;

    const module = await updateModule(id, updateData);

    return NextResponse.json({
      success: true,
      module: {
        id: module.id,
        title: module.title,
        description: module.description,
        category: module.category,
        ageGroupMin: module.ageGroupMin,
        ageGroupMax: module.ageGroupMax,
        version: module.version,
        status: module.status,
        updatedAt: module.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update content module error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Content module not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to update content module' },
      { status: 500 }
    );
  }
}

// DELETE - Archive a content module (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const module = await archiveModule(id);

    return NextResponse.json({
      success: true,
      message: 'Content module archived',
      module: {
        id: module.id,
        status: module.status,
      },
    });
  } catch (error) {
    console.error('Archive content module error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Content module not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to archive content module' },
      { status: 500 }
    );
  }
}
