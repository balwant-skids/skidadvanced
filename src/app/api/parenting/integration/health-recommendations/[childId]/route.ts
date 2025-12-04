import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SKIDSIntegrationService } from '@/lib/parenting/skids-integration-service';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/integration/health-recommendations/[childId] - Get health-based recommendations
 */
export async function GET(
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

    const recommendations = await SKIDSIntegrationService.updateParentingRecommendations(params.childId);

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error getting health-based recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get health-based recommendations' },
      { status: 500 }
    );
  }
}