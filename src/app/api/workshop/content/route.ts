/**
 * Workshop Content API Routes
 * POST /api/workshop/content - Create a new content module
 * GET /api/workshop/content - List content modules
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {

// Force dynamic rendering
export const dynamic = 'force-dynamic';
  createModule,
  getModules,
  getModulesByAgeGroup,
  isValidCategory,
  isValidAgeRange,
  type HABITSCategory,
  type ContentStatus,
} from '@/lib/workshop/content-service';

// POST - Create a new content module (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and verify admin role
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

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (!category || !isValidCategory(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: H, A, B, I, T, S' },
        { status: 400 }
      );
    }

    if (
      typeof ageGroupMin !== 'number' ||
      typeof ageGroupMax !== 'number' ||
      !isValidAgeRange(ageGroupMin, ageGroupMax)
    ) {
      return NextResponse.json(
        { error: 'Invalid age range. Min must be >= 0, max must be <= 18, and min <= max' },
        { status: 400 }
      );
    }

    // Create content module
    const module = await createModule({
      title,
      description,
      category: category as HABITSCategory,
      ageGroupMin,
      ageGroupMax,
      clinicId: user.clinicId || undefined,
    });

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
        createdAt: module.createdAt,
      },
    });
  } catch (error) {
    console.error('Create content module error:', error);
    return NextResponse.json(
      { error: 'Failed to create content module' },
      { status: 500 }
    );
  }
}

// GET - List content modules
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        parentProfile: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const age = searchParams.get('age');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';

    let modules;

    if (age && !isAdmin) {
      // Filter by age for non-admin users
      const childAge = parseInt(age);
      if (isNaN(childAge) || childAge < 0 || childAge > 18) {
        return NextResponse.json(
          { error: 'Invalid age parameter' },
          { status: 400 }
        );
      }

      modules = await getModulesByAgeGroup(childAge, {
        category: category && isValidCategory(category) ? category as HABITSCategory : undefined,
        clinicId: user.clinicId || undefined,
        status: 'published',
      });
    } else {
      // Get all modules with filters
      modules = await getModules({
        category: category && isValidCategory(category) ? category as HABITSCategory : undefined,
        status: isAdmin && status ? status as ContentStatus : (isAdmin ? undefined : 'published'),
        clinicId: isAdmin ? undefined : user.clinicId || undefined,
        skip: offset,
        take: limit,
      });
    }

    // For non-admin users, only show published modules
    if (!isAdmin) {
      modules = modules.filter((m) => m.status === 'published');
    }

    return NextResponse.json({
      modules: modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        category: m.category,
        ageGroupMin: m.ageGroupMin,
        ageGroupMax: m.ageGroupMax,
        version: m.version,
        status: m.status,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      pagination: {
        limit,
        offset,
        hasMore: modules.length === limit,
      },
    });
  } catch (error) {
    console.error('List content modules error:', error);
    return NextResponse.json(
      { error: 'Failed to list content modules' },
      { status: 500 }
    );
  }
}
