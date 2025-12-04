import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DevelopmentService } from '@/lib/parenting/development-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/development/profiles - Create development profile
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { childId } = body;

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      );
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentProfile: {
          userId,
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    const profile = await DevelopmentService.createChildProfile({ childId });

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Development profile created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating development profile:', error);
    return NextResponse.json(
      { error: 'Failed to create development profile' },
      { status: 500 }
    );
  }
}