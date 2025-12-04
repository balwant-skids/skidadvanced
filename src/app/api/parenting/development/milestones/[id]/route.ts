import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DevelopmentService } from '@/lib/parenting/development-service';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/parenting/development/milestones/[id] - Update milestone progress
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { childId, status, notes, parentObservations, achievedAt } = body;

    if (!childId || !status) {
      return NextResponse.json(
        { error: 'Child ID and status are required' },
        { status: 400 }
      );
    }

    if (!['not_started', 'in_progress', 'achieved', 'delayed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentProfile: {
          userId,
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    await DevelopmentService.updateMilestone(childId, params.id, {
      status,
      notes,
      parentObservations,
      achievedAt: achievedAt ? new Date(achievedAt) : undefined,
    });

    // Generate celebration message if milestone achieved
    let celebrationMessage = null;
    if (status === 'achieved') {
      celebrationMessage = await DevelopmentService.celebrateAchievement(childId, params.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone updated successfully',
      celebration: celebrationMessage,
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json(
      { error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}