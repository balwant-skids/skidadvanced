import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { EngagementService } from '@/lib/parenting/engagement-service';
import { EngagementData } from '@/types/parenting';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/content/[id]/engage - Track content engagement
 * 
 * Requirements: 1.5, 5.2
 * - Record user interactions and analytics
 * - Update recommendation profiles
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    const body = await request.json();

    // Validate engagement data
    const { eventType, duration, metadata } = body;
    
    if (!eventType) {
      return NextResponse.json(
        { 
          error: 'Event type is required', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    const validEventTypes = ['view', 'click', 'share', 'bookmark', 'complete', 'rate'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { 
          error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`, 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Create engagement data
    const engagementData: EngagementData = {
      eventType,
      duration: duration || undefined,
      metadata: metadata || {},
      timestamp: new Date(),
    };

    // Track engagement
    const engagement = await EngagementService.trackEngagement(
      contentId,
      userId,
      engagementData
    );

    return NextResponse.json({
      success: true,
      data: engagement,
      message: 'Engagement tracked successfully',
    });

  } catch (error) {
    console.error('Error tracking engagement:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to track engagement', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/parenting/content/[id]/engage - Get content engagement analytics
 * 
 * Requirements: 1.5, 10.1
 * - Return engagement metrics and analytics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    const { searchParams } = new URL(request.url);
    
    // Parse timeframe parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let timeframe: { start: Date; end: Date } | undefined;
    if (startDate && endDate) {
      timeframe = {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }

    // Get engagement analytics
    const analytics = await EngagementService.getContentEngagementAnalytics(
      contentId,
      timeframe
    );

    return NextResponse.json({
      success: true,
      data: analytics,
      timeframe,
    });

  } catch (error) {
    console.error('Error fetching engagement analytics:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch engagement analytics', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}