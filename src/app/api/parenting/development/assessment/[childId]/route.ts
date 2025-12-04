import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DevelopmentService } from '@/lib/parenting/development-service';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/development/assessment/[childId] - Assess development
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: {
        id: params.childId,
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

    const assessment = await DevelopmentService.assessDevelopment(params.childId);

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Error assessing development:', error);
    return NextResponse.json(
      { error: 'Failed to assess development' },
      { status: 500 }
    );
  }
}