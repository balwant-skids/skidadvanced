import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { RecommendationService } from '@/lib/parenting/recommendation-service';

/**
 * POST /api/parenting/recommendations/profile - Build/update recommendation profile
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { parentingStyle, challenges, interests } = body;

    const profile = await RecommendationService.buildProfile({
      parentId: userId,
      parentingStyle,
      challenges,
      interests,
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Recommendation profile updated successfully',
    });
  } catch (error) {
    console.error('Error building recommendation profile:', error);
    return NextResponse.json(
      { error: 'Failed to build recommendation profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/parenting/recommendations/profile - Get recommendation profile stats
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await RecommendationService.getRecommendationStats(userId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting recommendation stats:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendation statistics' },
      { status: 500 }
    );
  }
}