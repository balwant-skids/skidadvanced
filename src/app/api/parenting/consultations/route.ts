import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * GET /api/parenting/consultations - List user's consultations
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = (searchParams.get('role') as 'parent' | 'expert') || 'parent';
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const consultations = await ExpertService.getConsultations(
      userId,
      role,
      status,
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: consultations,
      pagination: {
        limit,
        offset,
        total: consultations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/consultations - Schedule new consultation
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { expertId, scheduledAt, duration, topic, notes } = body;

    // Validate required fields
    if (!expertId || !scheduledAt || !duration || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: expertId, scheduledAt, duration, topic' },
        { status: 400 }
      );
    }

    // Validate duration (should be between 15 and 120 minutes)
    if (duration < 15 || duration > 120) {
      return NextResponse.json(
        { error: 'Duration must be between 15 and 120 minutes' },
        { status: 400 }
      );
    }

    // Validate scheduled time (should be in the future)
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      );
    }

    const consultation = await ExpertService.scheduleConsultation({
      parentId: userId,
      expertId,
      scheduledAt: scheduledDate,
      duration,
      topic,
      notes,
    });

    return NextResponse.json({
      success: true,
      data: consultation,
      message: 'Consultation scheduled successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error scheduling consultation:', error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not available')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to schedule consultation' },
      { status: 500 }
    );
  }
}