/**
 * Gamification Service for Vita Workshop
 * Handles badges, streaks, and rewards
 */

import { prisma } from '../prisma';
import type { Badge, EarnedBadge } from '@prisma/client';

export interface BadgeCriteria {
  type: 'module' | 'streak' | 'milestone' | 'activity';
  value?: number;
  category?: string;
}

export interface GamificationEvent {
  type: 'module_completed' | 'streak_reached' | 'milestone_reached' | 'activity_completed';
  childId: string;
  value?: number;
  category?: string;
}

export interface BadgeCollection {
  earned: EarnedBadge[];
  available: Badge[];
}

export interface StreakStatus {
  currentStreak: number;
  longestStreak: number;
  lastEngagementDate: Date | null;
}

// ============ BADGE OPERATIONS ============

/**
 * Check and award badges based on events
 */
export async function checkAndAwardBadges(
  childId: string,
  event: GamificationEvent
): Promise<Badge[]> {
  const awardedBadges: Badge[] = [];

  // Get all badges
  const allBadges = await prisma.badge.findMany();

  for (const badge of allBadges) {
    const criteria: BadgeCriteria = JSON.parse(badge.criteria);

    // Check if badge should be awarded
    let shouldAward = false;

    if (criteria.type === 'module' && event.type === 'module_completed') {
      shouldAward = true;
    } else if (criteria.type === 'streak' && event.type === 'streak_reached') {
      if (criteria.value && event.value && event.value >= criteria.value) {
        shouldAward = true;
      }
    } else if (criteria.type === 'milestone' && event.type === 'milestone_reached') {
      shouldAward = true;
    } else if (criteria.type === 'activity' && event.type === 'activity_completed') {
      shouldAward = true;
    }

    if (shouldAward) {
      // Check if already earned (idempotent)
      const existing = await prisma.earnedBadge.findUnique({
        where: {
          badgeId_childId: {
            badgeId: badge.id,
            childId,
          },
        },
      });

      if (!existing) {
        await prisma.earnedBadge.create({
          data: {
            badgeId: badge.id,
            childId,
          },
        });
        awardedBadges.push(badge);
      }
    }
  }

  return awardedBadges;
}

/**
 * Get badge collection for a child
 */
export async function getBadgeCollection(childId: string): Promise<BadgeCollection> {
  const earned = await prisma.earnedBadge.findMany({
    where: { childId },
    include: { badge: true },
  });

  const earnedBadgeIds = earned.map((e) => e.badgeId);

  const available = await prisma.badge.findMany({
    where: {
      id: { notIn: earnedBadgeIds },
    },
  });

  return {
    earned: earned.map((e) => ({
      ...e,
      badge: undefined,
    })) as EarnedBadge[],
    available,
  };
}

/**
 * Get streak status for a child
 */
export async function getStreakStatus(childId: string): Promise<StreakStatus> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastEngagementDate: null,
    };
  }

  return {
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    lastEngagementDate: progress.lastEngagementDate,
  };
}

// ============ POINTS OPERATIONS ============

/**
 * Award points to a child
 */
export async function awardPoints(
  childId: string,
  points: number,
  reason: string
): Promise<number> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    throw new Error(`Progress not found for child: ${childId}`);
  }

  const updated = await prisma.childProgress.update({
    where: { childId },
    data: {
      totalPoints: {
        increment: points,
      },
    },
  });

  return updated.totalPoints;
}

// ============ MILESTONE DETECTION ============

/**
 * Check if child has completed all H.A.B.I.T.S. categories
 */
export async function checkAllCategoriesCompleted(childId: string): Promise<boolean> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    return false;
  }

  const categoryProgress: Record<string, number> = JSON.parse(progress.categoryProgress);
  const categories = ['H', 'A', 'B', 'I', 'T', 'S'];

  return categories.every((cat) => (categoryProgress[cat] || 0) > 0);
}

/**
 * Get milestone progress
 */
export async function getMilestoneProgress(childId: string): Promise<{
  categoriesCompleted: number;
  totalCategories: number;
  allCategoriesCompleted: boolean;
}> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    return {
      categoriesCompleted: 0,
      totalCategories: 6,
      allCategoriesCompleted: false,
    };
  }

  const categoryProgress: Record<string, number> = JSON.parse(progress.categoryProgress);
  const categories = ['H', 'A', 'B', 'I', 'T', 'S'];

  const completed = categories.filter((cat) => (categoryProgress[cat] || 0) > 0).length;

  return {
    categoriesCompleted: completed,
    totalCategories: 6,
    allCategoriesCompleted: completed === 6,
  };
}
