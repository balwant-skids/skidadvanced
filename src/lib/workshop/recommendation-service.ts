/**
 * Recommendation Service for Vita Workshop
 * Handles personalized content suggestions
 */

import { prisma } from '../prisma';
import type { Recommendation } from '@prisma/client';

export interface RecommendationWithModule extends Recommendation {
  module?: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
}

// ============ RECOMMENDATION GENERATION ============

/**
 * Generate recommendations for a child
 */
export async function generateRecommendations(childId: string): Promise<Recommendation[]> {
  // Get child's progress
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    // No progress yet, recommend all categories
    return generateInitialRecommendations(childId);
  }

  const categoryProgress: Record<string, number> = JSON.parse(progress.categoryProgress);
  const recommendations: Recommendation[] = [];

  // Find weak categories (< 60%)
  const weakCategories = Object.entries(categoryProgress)
    .filter(([_, score]) => score < 60)
    .sort((a, b) => a[1] - b[1]); // Sort by score ascending

  // Generate recommendations for weak categories
  for (const [category, score] of weakCategories) {
    const modules = await prisma.contentModule.findMany({
      where: {
        category,
        status: 'published',
      },
      take: 2,
    });

    for (const module of modules) {
      const existing = await prisma.recommendation.findFirst({
        where: {
          childId,
          moduleId: module.id,
        },
      });

      if (!existing) {
        const rec = await prisma.recommendation.create({
          data: {
            childId,
            moduleId: module.id,
            priority: Math.round(100 - score),
            rationale: `You scored ${score}% in ${category}. This module will help you improve!`,
            category,
            basedOn: 'assessment',
          },
        });
        recommendations.push(rec);
      }
    }
  }

  // If no weak areas, suggest advanced content
  if (weakCategories.length === 0) {
    const advancedModules = await prisma.contentModule.findMany({
      where: {
        status: 'published',
        ageGroupMin: { gte: 10 }, // Advanced content
      },
      take: 3,
    });

    for (const module of advancedModules) {
      const existing = await prisma.recommendation.findFirst({
        where: {
          childId,
          moduleId: module.id,
        },
      });

      if (!existing) {
        const rec = await prisma.recommendation.create({
          data: {
            childId,
            moduleId: module.id,
            priority: 50,
            rationale: 'You\'ve mastered the basics! Try this advanced content.',
            category: module.category,
            basedOn: 'engagement',
          },
        });
        recommendations.push(rec);
      }
    }
  }

  return recommendations;
}

/**
 * Generate initial recommendations for new children
 */
async function generateInitialRecommendations(childId: string): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  const categories = ['H', 'A', 'B', 'I', 'T', 'S'];

  for (const category of categories) {
    const module = await prisma.contentModule.findFirst({
      where: {
        category,
        status: 'published',
      },
    });

    if (module) {
      const rec = await prisma.recommendation.create({
        data: {
          childId,
          moduleId: module.id,
          priority: 50,
          rationale: `Start with this ${category} module to build healthy habits!`,
          category,
          basedOn: 'engagement',
        },
      });
      recommendations.push(rec);
    }
  }

  return recommendations;
}

/**
 * Get recommendations for a child
 */
export async function getRecommendations(childId: string): Promise<RecommendationWithModule[]> {
  const recommendations = await prisma.recommendation.findMany({
    where: { childId },
    orderBy: { priority: 'desc' },
  });

  // Fetch module details
  const withModules: RecommendationWithModule[] = await Promise.all(
    recommendations.map(async (rec) => {
      const module = await prisma.contentModule.findUnique({
        where: { id: rec.moduleId },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
        },
      });

      return {
        ...rec,
        module: module || undefined,
      };
    })
  );

  return withModules;
}

/**
 * Update recommendations after module completion
 */
export async function updateAfterCompletion(
  childId: string,
  moduleId: string
): Promise<Recommendation[]> {
  // Remove completed module from recommendations
  await prisma.recommendation.deleteMany({
    where: {
      childId,
      moduleId,
    },
  });

  // Regenerate recommendations
  return generateRecommendations(childId);
}

/**
 * Get advanced content recommendations
 */
export async function getAdvancedContent(childId: string): Promise<any[]> {
  const progress = await prisma.childProgress.findUnique({
    where: { childId },
  });

  if (!progress) {
    return [];
  }

  const categoryProgress: Record<string, number> = JSON.parse(progress.categoryProgress);

  // Get categories where child has > 80% completion
  const strongCategories = Object.entries(categoryProgress)
    .filter(([_, score]) => score > 80)
    .map(([cat, _]) => cat);

  if (strongCategories.length === 0) {
    return [];
  }

  // Get advanced modules in strong categories
  const advancedModules = await prisma.contentModule.findMany({
    where: {
      category: { in: strongCategories },
      status: 'published',
      ageGroupMin: { gte: 12 },
    },
    take: 5,
  });

  return advancedModules;
}
