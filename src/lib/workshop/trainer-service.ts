/**
 * Trainer Dashboard Service for Vita Workshop
 * Handles aggregate statistics and reporting
 */

import { prisma } from '../prisma';
import type { User, Child } from '@prisma/client';

export interface TrainerStats {
  totalParticipants: number;
  averageCompletion: number;
  categoryCompletionRates: Record<string, number>;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  childId: string;
  childName: string;
  action: string;
  timestamp: Date;
}

export interface ParticipantFilters {
  ageGroupMin?: number;
  ageGroupMax?: number;
  clinic?: string;
  completionStatus?: 'started' | 'completed' | 'not_started';
}

export interface ParticipantData {
  childId: string;
  childName: string;
  age: number;
  overallCompletion: number;
  categoryProgress: Record<string, number>;
  totalPoints: number;
  lastEngagementDate: Date | null;
}

// ============ AGGREGATE STATISTICS ============

/**
 * Get aggregate stats for a trainer's participants
 */
export async function getAggregateStats(trainerId: string): Promise<TrainerStats> {
  // Get trainer's clinic
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || !trainer.clinicId) {
    throw new Error('Trainer not found or not associated with a clinic');
  }

  // Get all children in clinic
  const parents = await prisma.parentProfile.findMany({
    where: { clinicId: trainer.clinicId },
    include: { children: true },
  });

  const allChildren = parents.flatMap((p) => p.children);
  const childIds = allChildren.map((c) => c.id);

  if (childIds.length === 0) {
    return {
      totalParticipants: 0,
      averageCompletion: 0,
      categoryCompletionRates: { H: 0, A: 0, B: 0, I: 0, T: 0, S: 0 },
      recentActivity: [],
    };
  }

  // Get progress for all children
  const progressRecords = await prisma.childProgress.findMany({
    where: { childId: { in: childIds } },
  });

  // Calculate averages
  const averageCompletion =
    progressRecords.length > 0
      ? progressRecords.reduce((sum, p) => sum + p.overallCompletion, 0) / progressRecords.length
      : 0;

  const categoryCompletionRates: Record<string, number> = {
    H: 0,
    A: 0,
    B: 0,
    I: 0,
    T: 0,
    S: 0,
  };

  for (const record of progressRecords) {
    const catProgress = JSON.parse(record.categoryProgress);
    for (const cat of Object.keys(categoryCompletionRates)) {
      categoryCompletionRates[cat] += catProgress[cat] || 0;
    }
  }

  for (const cat of Object.keys(categoryCompletionRates)) {
    categoryCompletionRates[cat] =
      Math.round((categoryCompletionRates[cat] / progressRecords.length) * 100) / 100;
  }

  // Get recent activity
  const recentSessions = await prisma.workshopSession.findMany({
    where: { childId: { in: childIds } },
    orderBy: { lastAccessedAt: 'desc' },
    take: 10,
    include: { child: true },
  });

  const recentActivity: ActivityLog[] = recentSessions.map((s) => ({
    childId: s.childId,
    childName: s.child.name,
    action: `Accessed module`,
    timestamp: s.lastAccessedAt,
  }));

  return {
    totalParticipants: childIds.length,
    averageCompletion: Math.round(averageCompletion * 100) / 100,
    categoryCompletionRates,
    recentActivity,
  };
}

/**
 * Get participant progress
 */
export async function getParticipantProgress(
  trainerId: string,
  participantId: string
): Promise<ParticipantData> {
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || !trainer.clinicId) {
    throw new Error('Trainer not found');
  }

  const child = await prisma.child.findUnique({
    where: { id: participantId },
    include: {
      parent: {
        include: { clinic: true },
      },
    },
  });

  if (!child || child.parent.clinicId !== trainer.clinicId) {
    throw new Error('Participant not found or not in trainer\'s clinic');
  }

  const progress = await prisma.childProgress.findUnique({
    where: { childId: participantId },
  });

  const age = Math.floor(
    (new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return {
    childId: child.id,
    childName: child.name,
    age,
    overallCompletion: progress?.overallCompletion || 0,
    categoryProgress: progress ? JSON.parse(progress.categoryProgress) : {},
    totalPoints: progress?.totalPoints || 0,
    lastEngagementDate: progress?.lastEngagementDate || null,
  };
}

/**
 * Filter participants
 */
export async function filterParticipants(
  trainerId: string,
  filters: ParticipantFilters
): Promise<ParticipantData[]> {
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || !trainer.clinicId) {
    throw new Error('Trainer not found');
  }

  // Get all children in clinic
  const parents = await prisma.parentProfile.findMany({
    where: { clinicId: trainer.clinicId },
    include: { children: true },
  });

  let allChildren = parents.flatMap((p) => p.children);

  // Apply age filters
  if (filters.ageGroupMin !== undefined || filters.ageGroupMax !== undefined) {
    const now = new Date();
    allChildren = allChildren.filter((c) => {
      const age = Math.floor(
        (now.getTime() - new Date(c.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (filters.ageGroupMin !== undefined && age < filters.ageGroupMin) return false;
      if (filters.ageGroupMax !== undefined && age > filters.ageGroupMax) return false;
      return true;
    });
  }

  // Get progress for filtered children
  const childIds = allChildren.map((c) => c.id);
  const progressRecords = await prisma.childProgress.findMany({
    where: { childId: { in: childIds } },
  });

  // Apply completion status filter
  let filtered = allChildren.map((c) => {
    const progress = progressRecords.find((p) => p.childId === c.id);
    const age = Math.floor(
      (new Date().getTime() - new Date(c.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      childId: c.id,
      childName: c.name,
      age,
      overallCompletion: progress?.overallCompletion || 0,
      categoryProgress: progress ? JSON.parse(progress.categoryProgress) : {},
      totalPoints: progress?.totalPoints || 0,
      lastEngagementDate: progress?.lastEngagementDate || null,
    };
  });

  if (filters.completionStatus) {
    filtered = filtered.filter((p) => {
      if (filters.completionStatus === 'completed') {
        return p.overallCompletion === 100;
      } else if (filters.completionStatus === 'started') {
        return p.overallCompletion > 0 && p.overallCompletion < 100;
      } else if (filters.completionStatus === 'not_started') {
        return p.overallCompletion === 0;
      }
      return true;
    });
  }

  return filtered;
}

/**
 * Export report data
 */
export async function exportReportData(trainerId: string): Promise<any> {
  const stats = await getAggregateStats(trainerId);
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || !trainer.clinicId) {
    throw new Error('Trainer not found');
  }

  const participants = await filterParticipants(trainerId, {});

  return {
    generatedAt: new Date(),
    trainer: {
      name: trainer.name,
      email: trainer.email,
    },
    stats,
    participants,
  };
}
