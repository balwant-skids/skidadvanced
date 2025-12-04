import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { RecommendationService } from '@/lib/parenting/recommendation-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/recommendations/feedback - Track recommendation accuracy
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentId, feedback } = body;

    if (!contentId || typeof feedback !== 'number') {
      return NextResponse.json(
        { error: 'Content ID and numeric feedback are required' },
        { status: 400 }
      );
    }

    if (feedback < 1 || feedback > 5) {
      return NextResponse.json(
        { error: 'Feedback must be between 1 and 5' },
        { status: 400 }
      );
    }

    await RecommendationService.trackRecommendationAccuracy(userId, contentId, feedback);

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully',
    });
  } catch (error) {
    console.error('Error recording recommendation feedback:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}