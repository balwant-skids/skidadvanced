/**
 * Workshop Session Activity Completion API Route
 * POST /api/workshop/sessions/[id]/complete-activity - Complete an activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getSession, completeActivity } from '@/lib/workshop/session-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Complete an activity in a session
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        parentProfile: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get session to verify access
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify access
    const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';
    if (!isAdmin) {
      const childBelongsToUser = user.parentProfile?.children.some(
        (c) => c.id === session.childId
      );
      if (!childBelongsToUser) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { activityId } = body;

    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId is required' },
        { status: 400 }
      );
    }

    const result = await completeActivity(sessionId, activityId);

    return NextResponse.json({
      success: true,
      feedback: result.feedback,
      session: {
        id: result.session.id,
        currentActivityIndex: result.session.currentActivityIndex,
        completedActivities: JSON.parse(result.session.completedActivities),
        isCompleted: result.session.completedAt !== null,
        completedAt: result.session.completedAt,
      },
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json(
      { error: 'Failed to complete activity' },
      { status: 500 }
    );
  }
}
