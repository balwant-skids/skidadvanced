import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { RecommendationService } from '@/lib/parenting/recommendation-service';

/**
 * GET /api/parenting/feed/[parentId] - Get personalized content feed
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { parentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user can access this feed
    if (userId !== params.parentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const feed = await RecommendationService.getPersonalizedFeed(params.parentId, limit);

    return NextResponse.json({
      success: true,
      data: feed,
    });
  } catch (error) {
    console.error('Error getting personalized feed:', error);
    return NextResponse.json(
      { error: 'Failed to get personalized feed' },
      { status: 500 }
    );
  }
}