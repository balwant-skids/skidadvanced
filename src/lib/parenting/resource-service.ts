import { prisma } from '@/lib/prisma';

/**
 * Resource Library Service for Digital Parenting Platform
 * Handles resource search, bookmarking, and organization
 */

export interface ResourceFilters {
  category?: string;
  contentType?: string;
  ageGroup?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  limit?: number;
  offset?: number;
}

export interface BookmarkInput {
  resourceId: string;
  userId: string;
  tags?: string[];
  notes?: string;
  collection?: string;
}

export class ResourceService {
  /**
   * Search resources with advanced filtering
   */
  static async searchResources(query: string, filters?: ResourceFilters) {
    try {
      const where: any = {
        status: 'published',
      };

      // Text search
      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ];
      }

      // Apply filters
      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.contentType) {
        where.contentType = filters.contentType;
      }

      if (filters?.ageGroup) {
        // Parse age group (e.g., "0-12" months)
        const [minAge, maxAge] = filters.ageGroup.split('-').map(Number);
        where.AND = [
          { ageGroupMin: { lte: maxAge } },
          { ageGroupMax: { gte: minAge } },
        ];
      }

      if (filters?.tags && filters.tags.length > 0) {
        where.tags = {
          in: filters.tags,
        };
      }

      if (filters?.difficulty) {
        where.difficulty = filters.difficulty;
      }

      const resources = await prisma.parentingContent.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      });

      return resources;
    } catch (error) {
      console.error('Error searching resources:', error);
      throw new Error('Failed to search resources');
    }
  }

  /**
   * Get resources by category with hierarchical organization
   */
  static async getResourcesByCategory(category: string, subcategory?: string) {
    try {
      const where: any = {
        status: 'published',
        category,
      };

      if (subcategory) {
        where.subcategory = subcategory;
      }

      const resources = await prisma.parentingContent.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { subcategory: 'asc' },
          { rating: 'desc' },
        ],
      });

      // Group by subcategory for hierarchical display
      const grouped = resources.reduce((acc, resource) => {
        const subcat = resource.subcategory || 'General';
        if (!acc[subcat]) {
          acc[subcat] = [];
        }
        acc[subcat].push(resource);
        return acc;
      }, {} as Record<string, typeof resources>);

      return grouped;
    } catch (error) {
      console.error('Error fetching resources by category:', error);
      throw new Error('Failed to fetch resources by category');
    }
  }

  /**
   * Bookmark a resource
   */
  static async bookmarkResource(data: BookmarkInput) {
    try {
      const bookmark = await prisma.contentBookmark.upsert({
        where: {
          userId_contentId: {
            userId: data.userId,
            contentId: data.resourceId,
          },
        },
        update: {
          tags: JSON.stringify(data.tags || []),
          notes: data.notes,
          collection: data.collection,
        },
        create: {
          userId: data.userId,
          contentId: data.resourceId,
          tags: JSON.stringify(data.tags || []),
          notes: data.notes,
          collection: data.collection,
        },
      });

      return bookmark;
    } catch (error) {
      console.error('Error bookmarking resource:', error);
      throw new Error('Failed to bookmark resource');
    }
  }

  /**
   * Remove bookmark
   */
  static async removeBookmark(userId: string, resourceId: string) {
    try {
      await prisma.contentBookmark.delete({
        where: {
          userId_contentId: {
            userId,
            contentId: resourceId,
          },
        },
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw new Error('Failed to remove bookmark');
    }
  }

  /**
   * Get user's bookmarked resources
   */
  static async getUserBookmarks(
    userId: string,
    collection?: string,
    tags?: string[]
  ) {
    try {
      const where: any = {
        userId,
      };

      if (collection) {
        where.collection = collection;
      }

      if (tags && tags.length > 0) {
        where.OR = tags.map(tag => ({
          tags: { contains: tag },
        }));
      }

      const bookmarks = await prisma.contentBookmark.findMany({
        where,
        include: {
          content: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return bookmarks;
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      throw new Error('Failed to fetch user bookmarks');
    }
  }

  /**
   * Get related resources based on shared attributes
   */
  static async getRelatedResources(resourceId: string, limit: number = 5) {
    try {
      const resource = await prisma.parentingContent.findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        return [];
      }

      const resourceTags = JSON.parse(resource.tags || '[]');

      // Find resources with similar attributes
      const related = await prisma.parentingContent.findMany({
        where: {
          id: { not: resourceId },
          status: 'published',
          OR: [
            { category: resource.category },
            { contentType: resource.contentType },
            {
              AND: [
                { ageGroupMin: { lte: resource.ageGroupMax } },
                { ageGroupMax: { gte: resource.ageGroupMin } },
              ],
            },
            ...(resourceTags.length > 0 ? [{
              tags: { in: resourceTags },
            }] : []),
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        take: limit * 2, // Get more to score and filter
      });

      // Calculate relevance scores
      const scoredResources = related.map(item => {
        let score = 0;
        const itemTags = JSON.parse(item.tags || '[]');

        // Category match (30% weight)
        if (item.category === resource.category) score += 30;

        // Content type match (20% weight)
        if (item.contentType === resource.contentType) score += 20;

        // Age group overlap (25% weight)
        const ageOverlap = !(
          item.ageGroupMax < resource.ageGroupMin ||
          item.ageGroupMin > resource.ageGroupMax
        );
        if (ageOverlap) score += 25;

        // Tag similarity (25% weight)
        const commonTags = resourceTags.filter((tag: string) => itemTags.includes(tag));
        if (commonTags.length > 0) {
          score += 25 * (commonTags.length / Math.max(resourceTags.length, 1));
        }

        return { ...item, relevanceScore: score };
      });

      // Return top related resources
      return scoredResources
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching related resources:', error);
      throw new Error('Failed to fetch related resources');
    }
  }

  /**
   * Get user's collections
   */
  static async getUserCollections(userId: string) {
    try {
      const collections = await prisma.contentBookmark.groupBy({
        by: ['collection'],
        where: {
          userId,
          collection: { not: null },
        },
        _count: {
          collection: true,
        },
        orderBy: {
          collection: 'asc',
        },
      });

      return collections.map(c => ({
        name: c.collection,
        count: c._count.collection,
      }));
    } catch (error) {
      console.error('Error fetching user collections:', error);
      throw new Error('Failed to fetch user collections');
    }
  }

  /**
   * Create or update collection
   */
  static async createCollection(userId: string, name: string, resourceIds: string[]) {
    try {
      // Update bookmarks to be in this collection
      await prisma.contentBookmark.updateMany({
        where: {
          userId,
          contentId: { in: resourceIds },
        },
        data: {
          collection: name,
        },
      });

      return { name, count: resourceIds.length };
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  }

  /**
   * Get popular resources
   */
  static async getPopularResources(
    timeframe: 'day' | 'week' | 'month' = 'week',
    category?: string,
    limit: number = 10
  ) {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      const where: any = {
        status: 'published',
        createdAt: { gte: since },
      };

      if (category) {
        where.category = category;
      }

      const resources = await prisma.parentingContent.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { viewCount: 'desc' },
          { rating: 'desc' },
        ],
        take: limit,
      });

      return resources;
    } catch (error) {
      console.error('Error fetching popular resources:', error);
      throw new Error('Failed to fetch popular resources');
    }
  }

  /**
   * Track resource download
   */
  static async trackDownload(resourceId: string, userId: string) {
    try {
      // Update view count
      await prisma.parentingContent.update({
        where: { id: resourceId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      // Track engagement
      await prisma.contentEngagement.create({
        data: {
          userId,
          contentId: resourceId,
          eventType: 'download',
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Error tracking download:', error);
      // Don't throw to avoid breaking download flow
    }
  }
}