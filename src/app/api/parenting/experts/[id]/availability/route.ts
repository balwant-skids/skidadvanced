import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * POST /api/parenting/experts/[id]/availability - Check expert availability
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduledAt, duration } = body;

    if (!scheduledAt || !duration) {
      return NextResponse.json(
        { error: 'Missing scheduledAt or duration' },
        { status: 400 }
      );
    }

    const isAvailable = await ExpertService.checkAvailability(
      params.id,
      new Date(scheduledAt),
      duration
    );

    return NextResponse.json({
      success: true,
      data: {
        available: isAvailable,
        expertId: params.id,
        scheduledAt,
        duration,
      },
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}