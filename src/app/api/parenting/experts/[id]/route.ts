import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * GET /api/parenting/experts/[id] - Get expert details
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

    const expert = await ExpertService.getExpert(params.id);
    
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: expert,
    });
  } catch (error) {
    console.error('Error fetching expert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expert' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/parenting/experts/[id] - Update expert profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this expert profile or is admin
    const existingExpert = await ExpertService.getExpert(params.id);
    if (!existingExpert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    if (existingExpert.userId !== userId) {
      // TODO: Add admin role check
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const expert = await ExpertService.updateExpert(params.id, body);

    return NextResponse.json({
      success: true,
      data: expert,
    });
  } catch (error) {
    console.error('Error updating expert:', error);
    return NextResponse.json(
      { error: 'Failed to update expert' },
      { status: 500 }
    );
  }
}