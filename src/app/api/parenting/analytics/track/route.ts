import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { AnalyticsService } from '@/lib/parenting/analytics-service';

/**
 * POST /api/parenting/analytics/track - Track engagement event
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

    await AnalyticsService.trackUserEngagement({
      userId,
      contentId,
      eventType,
      duration,
      timestamp: new Date(),
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