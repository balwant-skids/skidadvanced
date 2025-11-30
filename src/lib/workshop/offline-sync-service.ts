/**
 * Offline Sync Service for Vita Workshop
 * Handles offline content caching and sync
 */

import { prisma } from '../prisma';

export interface OfflinePackage {
  modules: any[];
  activities: any[];
  assessments: any[];
  metadata: {
    downloadedAt: Date;
    version: number;
  };
}

export interface SyncResult {
  success: boolean;
  mergedData: any;
  conflicts: string[];
}

export interface VersionMap {
  [moduleId: string]: number;
}

export interface UpdateInfo {
  hasUpdates: boolean;
  outdatedModules: string[];
}

// ============ OFFLINE DOWNLOAD ============

/**
 * Download content for offline use
 */
export async function downloadForOffline(
  userId: string,
  moduleIds: string[]
): Promise<OfflinePackage> {
  // Get modules
  const modules = await prisma.contentModule.findMany({
    where: {
      id: { in: moduleIds },
      status: 'published',
    },
    include: {
      mediaAssets: true,
      activities: true,
    },
  });

  // Get activities
  const activities = await prisma.activity.findMany({
    where: {
      moduleId: { in: moduleIds },
    },
  });

  // Get assessments
  const assessments = await prisma.workshopAssessment.findMany({
    where: {
      moduleId: { in: moduleIds },
    },
  });

  return {
    modules: modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      ageGroupMin: m.ageGroupMin,
      ageGroupMax: m.ageGroupMax,
      version: m.version,
      mediaAssets: m.mediaAssets,
      activities: m.activities,
    })),
    activities: activities.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      type: a.type,
      duration: a.duration,
      points: a.points,
      steps: a.steps,
    })),
    assessments: assessments.map((a) => ({
      id: a.id,
      title: a.title,
      questions: a.questions,
      passingScore: a.passingScore,
    })),
    metadata: {
      downloadedAt: new Date(),
      version: 1,
    },
  };
}

// ============ SYNC OPERATIONS ============

/**
 * Sync offline data with server (server-wins conflict resolution)
 */
export async function syncProgress(
  userId: string,
  localData: any
): Promise<SyncResult> {
  // Get server data
  const serverData = await prisma.childProgress.findMany({
    where: {
      child: {
        parent: {
          userId,
        },
      },
    },
  });

  // Server-wins: keep server data, ignore local data
  // Just mark as synced
  const conflicts: string[] = [];

  if (JSON.stringify(localData) !== JSON.stringify(serverData)) {
    conflicts.push('Local progress differs from server - using server version');
  }

  return {
    success: true,
    mergedData: serverData,
    conflicts,
  };
}

/**
 * Check for content updates
 */
export async function checkForUpdates(
  userId: string,
  cachedVersions: VersionMap
): Promise<UpdateInfo> {
  const moduleIds = Object.keys(cachedVersions);

  if (moduleIds.length === 0) {
    return {
      hasUpdates: false,
      outdatedModules: [],
    };
  }

  const modules = await prisma.contentModule.findMany({
    where: {
      id: { in: moduleIds },
    },
    select: {
      id: true,
      version: true,
    },
  });

  const outdatedModules: string[] = [];

  for (const module of modules) {
    if (module.version > (cachedVersions[module.id] || 0)) {
      outdatedModules.push(module.id);
    }
  }

  return {
    hasUpdates: outdatedModules.length > 0,
    outdatedModules,
  };
}

/**
 * Resolve conflicts using server-wins strategy
 */
export function resolveConflicts(serverData: any, localData: any): any {
  // Server-wins: always return server data
  return serverData;
}

/**
 * Validate offline data integrity
 */
export function validateOfflineData(data: OfflinePackage): boolean {
  if (!data.modules || !Array.isArray(data.modules)) {
    return false;
  }

  if (!data.activities || !Array.isArray(data.activities)) {
    return false;
  }

  if (!data.assessments || !Array.isArray(data.assessments)) {
    return false;
  }

  if (!data.metadata || !data.metadata.downloadedAt) {
    return false;
  }

  return true;
}

/**
 * Calculate offline data size
 */
export function calculateDataSize(data: OfflinePackage): number {
  return JSON.stringify(data).length;
}
