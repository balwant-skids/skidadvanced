/**
 * Content Management Service for Vita Workshop
 * Handles CRUD operations for workshop content modules
 */

import { prisma } from '../prisma';
import type { ContentModule, MediaAsset, Prisma } from '@prisma/client';

// Types
export type HABITSCategory = 'H' | 'A' | 'B' | 'I' | 'T' | 'S';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface CreateModuleInput {
  title: string;
  description: string;
  category: HABITSCategory;
  ageGroupMin: number;
  ageGroupMax: number;
  clinicId?: string;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  category?: HABITSCategory;
  ageGroupMin?: number;
  ageGroupMax?: number;
}

export interface ContentModuleWithAssets extends ContentModule {
  mediaAssets: MediaAsset[];
}

// ============ CRUD OPERATIONS ============

/**
 * Create a new content module
 */
export async function createModule(
  data: CreateModuleInput
): Promise<ContentModule> {
  return prisma.contentModule.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      ageGroupMin: data.ageGroupMin,
      ageGroupMax: data.ageGroupMax,
      clinicId: data.clinicId,
      version: 1,
      status: 'draft',
    },
  });
}

/**
 * Update an existing content module (increments version)
 */
export async function updateModule(
  id: string,
  data: UpdateModuleInput
): Promise<ContentModule> {
  // Get current version
  const current = await prisma.contentModule.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error(`Content module not found: ${id}`);
  }

  return prisma.contentModule.update({
    where: { id },
    data: {
      ...data,
      version: current.version + 1,
      updatedAt: new Date(),
    },
  });
}

/**
 * Get a content module by ID
 */
export async function getModule(
  id: string
): Promise<ContentModuleWithAssets | null> {
  return prisma.contentModule.findUnique({
    where: { id },
    include: {
      mediaAssets: true,
    },
  });
}

/**
 * Get all content modules with optional filters
 */
export async function getModules(options?: {
  category?: HABITSCategory;
  status?: ContentStatus;
  clinicId?: string;
  skip?: number;
  take?: number;
}): Promise<ContentModule[]> {
  const where: Prisma.ContentModuleWhereInput = {};

  if (options?.category) {
    where.category = options.category;
  }
  if (options?.status) {
    where.status = options.status;
  }
  if (options?.clinicId) {
    where.clinicId = options.clinicId;
  }

  return prisma.contentModule.findMany({
    where,
    skip: options?.skip,
    take: options?.take,
    orderBy: { createdAt: 'desc' },
  });
}

// ============ PUBLISHING & ARCHIVING ============

/**
 * Publish a content module (makes it available to users)
 */
export async function publishModule(id: string): Promise<ContentModule> {
  const module = await prisma.contentModule.findUnique({
    where: { id },
  });

  if (!module) {
    throw new Error(`Content module not found: ${id}`);
  }

  if (module.status === 'archived') {
    throw new Error('Cannot publish an archived module');
  }

  return prisma.contentModule.update({
    where: { id },
    data: {
      status: 'published',
      updatedAt: new Date(),
    },
  });
}

/**
 * Archive a content module (hides from users but preserves completion records)
 */
export async function archiveModule(id: string): Promise<ContentModule> {
  const module = await prisma.contentModule.findUnique({
    where: { id },
  });

  if (!module) {
    throw new Error(`Content module not found: ${id}`);
  }

  return prisma.contentModule.update({
    where: { id },
    data: {
      status: 'archived',
      updatedAt: new Date(),
    },
  });
}

// ============ AGE-GROUP FILTERING ============

/**
 * Get content modules appropriate for a specific age
 */
export async function getModulesByAgeGroup(
  age: number,
  options?: {
    category?: HABITSCategory;
    clinicId?: string;
    status?: ContentStatus;
  }
): Promise<ContentModule[]> {
  const where: Prisma.ContentModuleWhereInput = {
    ageGroupMin: { lte: age },
    ageGroupMax: { gte: age },
    status: options?.status || 'published',
  };

  if (options?.category) {
    where.category = options.category;
  }
  if (options?.clinicId) {
    where.OR = [
      { clinicId: options.clinicId },
      { clinicId: null }, // Global modules
    ];
  }

  return prisma.contentModule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get content modules by category
 */
export async function getModulesByCategory(
  category: HABITSCategory,
  options?: {
    status?: ContentStatus;
    clinicId?: string;
  }
): Promise<ContentModule[]> {
  const where: Prisma.ContentModuleWhereInput = {
    category,
    status: options?.status || 'published',
  };

  if (options?.clinicId) {
    where.OR = [
      { clinicId: options.clinicId },
      { clinicId: null },
    ];
  }

  return prisma.contentModule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

// ============ MEDIA ASSET OPERATIONS ============

/**
 * Add a media asset to a content module
 */
export async function addMediaAsset(
  moduleId: string,
  asset: {
    type: 'image' | 'video' | 'audio';
    url: string;
    filename: string;
    size: number;
  }
): Promise<MediaAsset> {
  return prisma.mediaAsset.create({
    data: {
      moduleId,
      type: asset.type,
      url: asset.url,
      filename: asset.filename,
      size: asset.size,
    },
  });
}

/**
 * Remove a media asset
 */
export async function removeMediaAsset(assetId: string): Promise<void> {
  await prisma.mediaAsset.delete({
    where: { id: assetId },
  });
}

/**
 * Get all media assets for a module
 */
export async function getMediaAssets(moduleId: string): Promise<MediaAsset[]> {
  return prisma.mediaAsset.findMany({
    where: { moduleId },
  });
}

// ============ VALIDATION HELPERS ============

/**
 * Validate H.A.B.I.T.S. category
 */
export function isValidCategory(category: string): category is HABITSCategory {
  return ['H', 'A', 'B', 'I', 'T', 'S'].includes(category);
}

/**
 * Validate content status
 */
export function isValidStatus(status: string): status is ContentStatus {
  return ['draft', 'published', 'archived'].includes(status);
}

/**
 * Validate age range
 */
export function isValidAgeRange(min: number, max: number): boolean {
  return min >= 0 && max >= min && max <= 18;
}

// ============ STATISTICS ============

/**
 * Get content module statistics
 */
export async function getContentStats(clinicId?: string): Promise<{
  total: number;
  byStatus: Record<ContentStatus, number>;
  byCategory: Record<HABITSCategory, number>;
}> {
  const where: Prisma.ContentModuleWhereInput = clinicId
    ? { OR: [{ clinicId }, { clinicId: null }] }
    : {};

  const [total, statusCounts, categoryCounts] = await Promise.all([
    prisma.contentModule.count({ where }),
    prisma.contentModule.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.contentModule.groupBy({
      by: ['category'],
      where,
      _count: true,
    }),
  ]);

  const byStatus: Record<ContentStatus, number> = {
    draft: 0,
    published: 0,
    archived: 0,
  };
  statusCounts.forEach((s) => {
    byStatus[s.status as ContentStatus] = s._count;
  });

  const byCategory: Record<HABITSCategory, number> = {
    H: 0,
    A: 0,
    B: 0,
    I: 0,
    T: 0,
    S: 0,
  };
  categoryCounts.forEach((c) => {
    byCategory[c.category as HABITSCategory] = c._count;
  });

  return { total, byStatus, byCategory };
}
