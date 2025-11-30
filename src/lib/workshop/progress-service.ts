/**
 * Progress Tracking Service for Vita Workshop
 * Handles progress calculation, streak tracking, and sync
 */

import { prisma } from '../prisma';
import type { ChildProgress } from '@prisma/client';

export interface ProgressData {
  childId: string;
  overallCompletion: number;
  categoryProgress: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastEngagementDate: Date | null;
  totalPoints: number;
}

export interface LocalSyncData {
  overallCompletion?: number;
  categoryProgress?: Record<string, number>;
  currentStreak?: number;
  totalPoints?: number;
}

// ============ PROGRESS OPERATIONS ============

/**
 * Update progress after module completion
 */
export async function updateProgress(
  childId: string,
  moduleId: string
): Promise<ProgressData> {
  // Get module category
  const module = await prisma.contentModule.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    throw new Error(`Module not found: ${moduleId}`);
  }

  // Get or create progress record
  let progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    progress = await prisma.childProgress.create({
      data: { childId },
    });
  }

  // Parse category progress
  const categoryProgress: Record<string, number> = JSON.parse(progress.categoryProgress);

  // Get total modules in category
  const totalInCategory = await prisma.contentModule.count({
    where: {
      category: module.category,
      status: 'published',
    },
  });

  // Get completed modules in category for this child
  const completedInCategory = await prisma.workshopSession.count({
    where: {
      childId,
      completedAt: { not: null },
      module: { category: module.category },
    },
  });

  // Update category progress
  categoryProgress[module.category] = totalInCategory > 0
    ? Math.round((completedInCategory / totalInCategory) * 100 * 100) / 100
    : 0;

  // Calculate overall completion
  const categories = ['H', 'A', 'B', 'I', 'T', 'S'];
  const overallCompletion = categories.length > 0
    ? Math.round(
        (Object.values(categoryProgress).reduce((a, b) => a + b, 0) / categories.length) * 100
      ) / 100
    : 0;

  // Update progress
  const updated = await prisma.childProgress.update({
    where: { childId },
    data: {
      overallCompletion,
      categoryProgress: JSON.stringify(categoryProgress),
      lastEngagementDate: new Date(),
    },
  });

  return {
    childId: updated.childId,
    overallCompletion: updated.overallCompletion,
    categoryProgress: JSON.parse(updated.categoryProgress),
    currentStreak: updated.currentStreak,
    longestStreak: updated.longestStreak,
    lastEngagementDate: updated.lastEngagementDate,
    totalPoints: updated.totalPoints,
  };
}

/**
 * Get progress for a child
 */
export async function getProgress(childId: string): Promise<ProgressData> {
  let progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    progress = await prisma.childProgress.create({
      data: { childId },
    });
  }

  return {
    childId: progress.childId,
    overallCompletion: progress.overallCompletion,
    categoryProgress: JSON.parse(progress.categoryProgress),
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    lastEngagementDate: progress.lastEngagementDate,
    totalPoints: progress.totalPoints,
  };
}

/**
 * Get category-specific progress
 */
export async function getCategoryProgress(
  childId: string,
  category: string
): Promise<number> {
  const progress = await getProgress(childId);
  return progress.categoryProgress[category] || 0;
}

// ============ STREAK TRACKING ============

/**
 * Update streak for a child
 */
export async function updateStreak(childId: string): Promise<number> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    throw new Error(`Progress not found for child: ${childId}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEngagement = progress.lastEngagementDate
    ? new Date(progress.lastEngagementDate)
    : null;

  if (!lastEngagement) {
    // First engagement
    return await prisma.childProgress
      .update({
        where: { childId },
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastEngagementDate: new Date(),
        },
      })
      .then((p) => p.currentStreak);
  }

  lastEngagement.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor(
    (today.getTime() - lastEngagement.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreak = progress.currentStreak;
  let newLongestStreak = progress.longestStreak;

  if (daysDiff === 0) {
    // Same day, no change
    return newStreak;
  } else if (daysDiff === 1) {
    // Consecutive day
    newStreak = progress.currentStreak + 1;
    newLongestStreak = Math.max(newStreak, progress.longestStreak);
  } else {
    // Streak broken
    newStreak = 1;
  }

  const updated = await prisma.childProgress.update({
    where: { childId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastEngagementDate: new Date(),
    },
  });

  return updated.currentStreak;
}

// ============ SYNC OPERATIONS ============

/**
 * Sync progress from local data (server-wins conflict resolution)
 */
export async function syncProgress(
  childId: string,
  localData: LocalSyncData
): Promise<ProgressData> {
  // Get server data
  const serverProgress = await getProgress(childId);

  // Server-wins: keep server data, ignore local data
  // Just update lastEngagementDate to mark sync
  const updated = await prisma.childProgress.update({
    where: { childId },
    data: {
      lastEngagementDate: new Date(),
    },
  });

  return {
    childId: updated.childId,
    overallCompletion: updated.overallCompletion,
    categoryProgress: JSON.parse(updated.categoryProgress),
    currentStreak: updated.currentStreak,
    longestStreak: updated.longestStreak,
    lastEngagementDate: updated.lastEngagementDate,
    totalPoints: updated.totalPoints,
  };
}

// ============ STATISTICS ============

/**
 * Get progress statistics for a group of children
 */
export async function getGroupProgress(childIds: string[]): Promise<{
  averageCompletion: number;
  categoryAverages: Record<string, number>;
  totalPoints: number;
}> {
  const progressRecords = await prisma.childProgress.findMany({
    where: { childId: { in: childIds } },
  });

  if (progressRecords.length === 0) {
    return {
      averageCompletion: 0,
      categoryAverages: { H: 0, A: 0, B: 0, I: 0, T: 0, S: 0 },
      totalPoints: 0,
    };
  }

  const averageCompletion =
    progressRecords.reduce((sum, p) => sum + p.overallCompletion, 0) /
    progressRecords.length;

  const categoryAverages: Record<string, number> = {
    H: 0,
    A: 0,
    B: 0,
    I: 0,
    T: 0,
    S: 0,
  };

  for (const record of progressRecords) {
    const catProgress = JSON.parse(record.categoryProgress);
    for (const cat of Object.keys(categoryAverages)) {
      categoryAverages[cat] += catProgress[cat] || 0;
    }
  }

  for (const cat of Object.keys(categoryAverages)) {
    categoryAverages[cat] =
      Math.round((categoryAverages[cat] / progressRecords.length) * 100) / 100;
  }

  const totalPoints = progressRecords.reduce((sum, p) => sum + p.totalPoints, 0);

  return { averageCompletion, categoryAverages, totalPoints };
}
