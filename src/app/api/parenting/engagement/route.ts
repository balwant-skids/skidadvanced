import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { RecommendationService } from '@/lib/parenting/recommendation-service';

/**
 * POST /api/parenting/engagement - Track content engagement
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentId, eventType, duration, metadata } = body;

    if (!contentId || !eventType) {
      return NextResponse.json(
        { error: 'Content ID and event type are required' },
        { status: 400 }
      );
    }

    const validEventTypes = ['view', 'click', 'share', 'bookmark', 'complete', 'like', 'comment'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Event type must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    await RecommendationService.updateEngagement({
      userId,
      contentId,
      eventType,
      duration,
      metadata,
    });

    return NextResponse.json({
      success: true,
      message: 'Engagement tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking engagement:', error);
    return NextResponse.json(
      { error: 'Failed to track engagement' },
      { status: 500 }
    );
  }
}