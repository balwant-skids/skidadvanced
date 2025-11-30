/**
 * Session Delivery Service for Vita Workshop
 * Handles workshop session management, progress tracking, and activity completion
 */

import { prisma } from '../prisma';
import type { WorkshopSession, ContentModule, Activity } from '@prisma/client';

// Types
export interface SessionWithModule extends WorkshopSession {
  module: ContentModule & {
    activities: Activity[];
  };
}

export interface SessionProgress {
  sessionId: string;
  moduleId: string;
  childId: string;
  totalActivities: number;
  completedCount: number;
  completionPercentage: number;
  currentActivityIndex: number;
  isCompleted: boolean;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt: Date | null;
}

export interface ActivityFeedback {
  activityId: string;
  completed: boolean;
  pointsAwarded: number;
  message: string;
}

// ============ SESSION MANAGEMENT ============

/**
 * Start a new session or resume an existing one
 */
export async function startSession(
  childId: string,
  moduleId: string
): Promise<SessionWithModule> {
  // Check if session already exists
  const existing = await prisma.workshopSession.findUnique({
    where: {
      moduleId_childId: {
        moduleId,
        childId,
      },
    },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });

  if (existing) {
    // Resume existing session - update lastAccessedAt
    const updated = await prisma.workshopSession.update({
      where: { id: existing.id },
      data: { lastAccessedAt: new Date() },
      include: {
        module: {
          include: {
            activities: true,
          },
        },
      },
    });
    return updated;
  }

  // Verify module exists and is published
  const module = await prisma.contentModule.findUnique({
    where: { id: moduleId },
    include: { activities: true },
  });

  if (!module) {
    throw new Error(`Content module not found: ${moduleId}`);
  }

  if (module.status !== 'published') {
    throw new Error('Cannot start session for unpublished module');
  }

  // Create new session
  const session = await prisma.workshopSession.create({
    data: {
      moduleId,
      childId,
      currentActivityIndex: 0,
      completedActivities: '[]',
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });

  return session;
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId: string): Promise<SessionWithModule | null> {
  return prisma.workshopSession.findUnique({
    where: { id: sessionId },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });
}

/**
 * Get session by module and child
 */
export async function getSessionByModuleAndChild(
  moduleId: string,
  childId: string
): Promise<SessionWithModule | null> {
  return prisma.workshopSession.findUnique({
    where: {
      moduleId_childId: {
        moduleId,
        childId,
      },
    },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });
}

/**
 * Resume a session (updates lastAccessedAt)
 */
export async function resumeSession(sessionId: string): Promise<SessionWithModule> {
  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  return prisma.workshopSession.update({
    where: { id: sessionId },
    data: { lastAccessedAt: new Date() },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });
}

/**
 * Get all sessions for a child
 */
export async function getChildSessions(childId: string): Promise<SessionWithModule[]> {
  return prisma.workshopSession.findMany({
    where: { childId },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
    orderBy: { lastAccessedAt: 'desc' },
  });
}

// ============ ACTIVITY COMPLETION ============

/**
 * Complete an activity in a session
 */
export async function completeActivity(
  sessionId: string,
  activityId: string
): Promise<{ session: WorkshopSession; feedback: ActivityFeedback }> {
  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  // Parse completed activities
  const completedActivities: string[] = JSON.parse(session.completedActivities);

  // Check if activity is already completed
  if (completedActivities.includes(activityId)) {
    return {
      session,
      feedback: {
        activityId,
        completed: true,
        pointsAwarded: 0,
        message: 'Activity already completed',
      },
    };
  }

  // Find the activity
  const activity = session.module.activities.find((a) => a.id === activityId);
  if (!activity) {
    throw new Error(`Activity not found in module: ${activityId}`);
  }

  // Add to completed activities
  completedActivities.push(activityId);

  // Calculate new activity index
  const activityIds = session.module.activities.map((a) => a.id);
  const currentIndex = activityIds.indexOf(activityId);
  const newIndex = Math.min(currentIndex + 1, session.module.activities.length - 1);

  // Check if all activities are completed
  const isCompleted = completedActivities.length >= session.module.activities.length;

  // Update session
  const updatedSession = await prisma.workshopSession.update({
    where: { id: sessionId },
    data: {
      completedActivities: JSON.stringify(completedActivities),
      currentActivityIndex: newIndex,
      lastAccessedAt: new Date(),
      completedAt: isCompleted ? new Date() : null,
    },
  });

  // Record activity completion and award points
  await prisma.activityCompletion.create({
    data: {
      activityId,
      childId: session.childId,
      points: activity.points,
    },
  });

  // Update child's total points
  await prisma.childProgress.upsert({
    where: { childId: session.childId },
    create: {
      childId: session.childId,
      totalPoints: activity.points,
    },
    update: {
      totalPoints: {
        increment: activity.points,
      },
    },
  });

  return {
    session: updatedSession,
    feedback: {
      activityId,
      completed: true,
      pointsAwarded: activity.points,
      message: isCompleted
        ? 'Congratulations! You completed all activities in this module!'
        : `Great job! You earned ${activity.points} points!`,
    },
  };
}

// ============ PROGRESS CALCULATION ============

/**
 * Get session progress
 */
export async function getSessionProgress(sessionId: string): Promise<SessionProgress> {
  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  const completedActivities: string[] = JSON.parse(session.completedActivities);
  const totalActivities = session.module.activities.length;
  const completedCount = completedActivities.length;
  const completionPercentage = totalActivities > 0
    ? Math.round((completedCount / totalActivities) * 100 * 100) / 100
    : 0;

  return {
    sessionId: session.id,
    moduleId: session.moduleId,
    childId: session.childId,
    totalActivities,
    completedCount,
    completionPercentage,
    currentActivityIndex: session.currentActivityIndex,
    isCompleted: session.completedAt !== null,
    startedAt: session.startedAt,
    lastAccessedAt: session.lastAccessedAt,
    completedAt: session.completedAt,
  };
}

/**
 * Get progress for all sessions of a child
 */
export async function getChildProgress(childId: string): Promise<SessionProgress[]> {
  const sessions = await prisma.workshopSession.findMany({
    where: { childId },
    include: {
      module: {
        include: {
          activities: true,
        },
      },
    },
  });

  return sessions.map((session) => {
    const completedActivities: string[] = JSON.parse(session.completedActivities);
    const totalActivities = session.module.activities.length;
    const completedCount = completedActivities.length;
    const completionPercentage = totalActivities > 0
      ? Math.round((completedCount / totalActivities) * 100 * 100) / 100
      : 0;

    return {
      sessionId: session.id,
      moduleId: session.moduleId,
      childId: session.childId,
      totalActivities,
      completedCount,
      completionPercentage,
      currentActivityIndex: session.currentActivityIndex,
      isCompleted: session.completedAt !== null,
      startedAt: session.startedAt,
      lastAccessedAt: session.lastAccessedAt,
      completedAt: session.completedAt,
    };
  });
}

/**
 * Get the current activity for a session
 */
export async function getCurrentActivity(sessionId: string): Promise<Activity | null> {
  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
    include: {
      module: {
        include: {
          activities: {
            orderBy: { id: 'asc' },
          },
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const activities = session.module.activities;
  if (session.currentActivityIndex >= activities.length) {
    return null; // All activities completed
  }

  return activities[session.currentActivityIndex];
}

/**
 * Check if a specific activity is completed in a session
 */
export function isActivityCompleted(session: WorkshopSession, activityId: string): boolean {
  const completedActivities: string[] = JSON.parse(session.completedActivities);
  return completedActivities.includes(activityId);
}
