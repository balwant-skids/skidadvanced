/**
 * Workshop Session API Routes
 * GET /api/workshop/sessions/[id] - Get a session with module content
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getSession, getSessionProgress } from '@/lib/workshop/session-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a session by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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

    const session = await getSession(id);

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

    const progress = await getSessionProgress(id);
    const completedActivities = JSON.parse(session.completedActivities);

    return NextResponse.json({
      session: {
        id: session.id,
        moduleId: session.moduleId,
        childId: session.childId,
        currentActivityIndex: session.currentActivityIndex,
        completedActivities,
        startedAt: session.startedAt,
        lastAccessedAt: session.lastAccessedAt,
        completedAt: session.completedAt,
      },
      progress: {
        totalActivities: progress.totalActivities,
        completedCount: progress.completedCount,
        completionPercentage: progress.completionPercentage,
        isCompleted: progress.isCompleted,
      },
      module: {
        id: session.module.id,
        title: session.module.title,
        description: session.module.description,
        category: session.module.category,
        activities: session.module.activities.map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          type: a.type,
          duration: a.duration,
          points: a.points,
          steps: JSON.parse(a.steps),
          isCompleted: completedActivities.includes(a.id),
        })),
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}
