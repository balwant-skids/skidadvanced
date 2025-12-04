/**
 * Activity Library Service for Vita Workshop
 * Handles activity browsing, completion, and favorites
 */

import { prisma } from '../prisma';
import type { Activity, ActivityCompletion, ActivityFavorite } from '@prisma/client';

export interface ActivityWithCompletion extends Activity {
  isCompleted?: boolean;
  isFavorited?: boolean;
}

// ============ ACTIVITY BROWSING ============

/**
 * Get activities by category
 */
export async function getActivitiesByCategory(
  category: string,
  childId?: string
): Promise<ActivityWithCompletion[]> {
  const activities = await prisma.activity.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
  });

  if (!childId) {
    return activities;
  }

  // Add completion and favorite status
  const completions = await prisma.activityCompletion.findMany({
    where: { childId },
  });
  const favorites = await prisma.activityFavorite.findMany({
    where: { childId },
  });

  const completionIds = new Set(completions.map((c) => c.activityId));
  const favoriteIds = new Set(favorites.map((f) => f.activityId));

  return activities.map((a) => ({
    ...a,
    isCompleted: completionIds.has(a.id),
    isFavorited: favoriteIds.has(a.id),
  }));
}

/**
 * Get all activities
 */
export async function getAllActivities(childId?: string): Promise<ActivityWithCompletion[]> {
  const activities = await prisma.activity.findMany({
    orderBy: { category: 'asc' },
  });

  if (!childId) {
    return activities;
  }

  // Add completion and favorite status
  const completions = await prisma.activityCompletion.findMany({
    where: { childId },
  });
  const favorites = await prisma.activityFavorite.findMany({
    where: { childId },
  });

  const completionIds = new Set(completions.map((c) => c.activityId));
  const favoriteIds = new Set(favorites.map((f) => f.activityId));

  return activities.map((a) => ({
    ...a,
    isCompleted: completionIds.has(a.id),
    isFavorited: favoriteIds.has(a.id),
  }));
}

// ============ ACTIVITY COMPLETION ============

/**
 * Complete an activity
 */
export async function completeActivity(
  childId: string,
  activityId: string
): Promise<ActivityCompletion> {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error(`Activity not found: ${activityId}`);
  }

  // Check if already completed
  const existing = await prisma.activityCompletion.findFirst({
    where: {
      childId,
      activityId,
    },
  });

  if (existing) {
    return existing;
  }

  // Create completion record
  const completion = await prisma.activityCompletion.create({
    data: {
      childId,
      activityId,
      points: activity.points,
    },
  });

  // Award points
  await prisma.childProgress.upsert({
    where: { childId },
    create: {
      childId,
      totalPoints: activity.points,
    },
    update: {
      totalPoints: {
        increment: activity.points,
      },
    },
  });

  return completion;
}

/**
 * Get activity completion history for a child
 */
export async function getCompletionHistory(childId: string): Promise<ActivityCompletion[]> {
  return prisma.activityCompletion.findMany({
    where: { childId },
    orderBy: { completedAt: 'desc' },
  });
}

// ============ FAVORITES ============

/**
 * Add activity to favorites
 */
export async function favoriteActivity(
  childId: string,
  activityId: string
): Promise<ActivityFavorite> {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error(`Activity not found: ${activityId}`);
  }

  // Check if already favorited
  const existing = await prisma.activityFavorite.findUnique({
    where: {
      activityId_childId: {
        activityId,
        childId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.activityFavorite.create({
    data: {
      childId,
      activityId,
    },
  });
}

/**
 * Remove activity from favorites
 */
export async function unfavoriteActivity(
  childId: string,
  activityId: string
): Promise<void> {
  await prisma.activityFavorite.deleteMany({
    where: {
      childId,
      activityId,
    },
  });
}

/**
 * Get favorite activities for a child
 */
export async function getFavorites(childId: string): Promise<Activity[]> {
  const favorites = await prisma.activityFavorite.findMany({
    where: { childId },
    include: { activity: true },
  });

  return favorites.map((f) => f.activity);
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  childId: string,
  activityId: string
): Promise<boolean> {
  const existing = await prisma.activityFavorite.findUnique({
    where: {
      activityId_childId: {
        activityId,
        childId,
      },
    },
  });

  if (existing) {
    await unfavoriteActivity(childId, activityId);
    return false;
  } else {
    await favoriteActivity(childId, activityId);
    return true;
  }
}
