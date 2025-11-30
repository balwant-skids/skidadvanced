import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * GET /api/parenting/experts/[id]/stats - Get expert statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await ExpertService.getExpertStats(params.id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching expert stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expert statistics' },
      { status: 500 }
    );
  }
}