/**
 * Workshop Sessions API Routes
 * POST /api/workshop/sessions - Start or resume a session
 * GET /api/workshop/sessions - List sessions for current user's children
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { startSession, getChildSessions } from '@/lib/workshop/session-service';

// POST - Start or resume a session
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const body = await request.json();
    const { moduleId, childId } = body;

    if (!moduleId || !childId) {
      return NextResponse.json(
        { error: 'moduleId and childId are required' },
        { status: 400 }
      );
    }

    // Verify child belongs to user (unless admin)
    const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';
    if (!isAdmin) {
      const childBelongsToUser = user.parentProfile?.children.some(
        (c) => c.id === childId
      );
      if (!childBelongsToUser) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const session = await startSession(childId, moduleId);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        moduleId: session.moduleId,
        childId: session.childId,
        currentActivityIndex: session.currentActivityIndex,
        completedActivities: JSON.parse(session.completedActivities),
        isCompleted: session.completedAt !== null,
        startedAt: session.startedAt,
        lastAccessedAt: session.lastAccessedAt,
        completedAt: session.completedAt,
        module: {
          id: session.module.id,
          title: session.module.title,
          category: session.module.category,
          activities: session.module.activities.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            duration: a.duration,
            points: a.points,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Start session error:', error);
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('unpublished')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}

// GET - List sessions for current user's children
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    // Get sessions for specified child or all children
    let sessions;
    if (childId) {
      // Verify child belongs to user
      const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';
      if (!isAdmin) {
        const childBelongsToUser = user.parentProfile?.children.some(
          (c) => c.id === childId
        );
        if (!childBelongsToUser) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
      sessions = await getChildSessions(childId);
    } else {
      // Get sessions for all children
      const childIds = user.parentProfile?.children.map((c) => c.id) || [];
      const allSessions = await Promise.all(
        childIds.map((id) => getChildSessions(id))
      );
      sessions = allSessions.flat();
    }

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        moduleId: s.moduleId,
        childId: s.childId,
        currentActivityIndex: s.currentActivityIndex,
        completedCount: JSON.parse(s.completedActivities).length,
        totalActivities: s.module.activities.length,
        isCompleted: s.completedAt !== null,
        startedAt: s.startedAt,
        lastAccessedAt: s.lastAccessedAt,
        completedAt: s.completedAt,
        module: {
          id: s.module.id,
          title: s.module.title,
          category: s.module.category,
        },
      })),
    });
  } catch (error) {
    console.error('List sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
