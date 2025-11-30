import { prisma } from '@/lib/prisma';
import { ParentingContent, ContentEngagement, Prisma } from '@prisma/client';

// Types for content operations
export interface CreateContentInput {
  title: string;
  description: string;
  content: string;
  contentType: 'article' | 'video' | 'infographic' | 'checklist' | 'guide';
  category: 'H' | 'A' | 'B' | 'I' | 'T' | 'S' | 'general';
  ageGroupMin: number;
  ageGroupMax: number;
  expertLevel?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  authorId: string;
}

export interface UpdateContentInput {
  title?: string;
  description?: string;
  content?: string;
  contentType?: 'article' | 'video' | 'infographic' | 'checklist' | 'guide';
  category?: 'H' | 'A' | 'B' | 'I' | 'T' | 'S' | 'general';
  ageGroupMin?: number;
  ageGroupMax?: number;
  expertLevel?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  status?: 'draft' | 'review' | 'published' | 'archived';
}

export interface ContentSearchQuery {
  query?: string;
  category?: string;
  contentType?: string;
  ageGroupMin?: number;
  ageGroupMax?: number;
  expertLevel?: string;
  tags?: string[];
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ContentFilters {
  ageGroupMin?: number;
  ageGroupMax?: number;
  expertLevel?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface EngagementData {
  eventType: 'view' | 'click' | 'share' | 'bookmark' | 'complete' | 'rate';
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Content Management Service
 * Handles CRUD operations for parenting content with H.A.B.I.T.S. framework categorization
 */
export class ContentService {
  /**
   * Create new parenting content
   */
  static async createContent(data: CreateContentInput): Promise<ParentingContent> {
    try {
      const content = await prisma.parentingContent.create({
        data: {
          title: data.title,
          description: data.description,
          content: data.content,
          contentType: data.contentType,
          category: data.category,
          ageGroupMin: data.ageGroupMin,
          ageGroupMax: data.ageGroupMax,
          expertLevel: data.expertLevel || 'beginner',
          tags: JSON.stringify(data.tags || []),
          authorId: data.authorId,
          status: 'draft', // Always start as draft for approval workflow
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
      });

      return content;
    } catch (error) {
      console.error('Error creating content:', error);
      throw new Error('Failed to create content');
    }
  }

  /**
   * Update existing content
   */
  static async updateContent(
    id: string,
    data: UpdateContentInput
  ): Promise<ParentingContent> {
    try {
      const updateData: Prisma.ParentingContentUpdateInput = {};

      // Only update provided fields
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.contentType !== undefined) updateData.contentType = data.contentType;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.ageGroupMin !== undefined) updateData.ageGroupMin = data.ageGroupMin;
      if (data.ageGroupMax !== undefined) updateData.ageGroupMax = data.ageGroupMax;
      if (data.expertLevel !== undefined) updateData.expertLevel = data.expertLevel;
      if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
      if (data.status !== undefined) updateData.status = data.status;

      const content = await prisma.parentingContent.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return content;
    } catch (error) {
      console.error('Error updating content:', error);
      throw new Error('Failed to update content');
    }
  }

  /**
   * Get content by ID
   */
  static async getContent(id: string): Promise<ParentingContent | null> {
    try {
      const content = await prisma.parentingContent.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          engagements: {
            select: {
              eventType: true,
              timestamp: true,
            },
            orderBy: {
              timestamp: 'desc',
            },
            take: 10,
          },
        },
      });

      return content;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new Error('Failed to fetch content');
    }
  }

  /**
   * Search content with advanced filtering
   */
  static async searchContent(query: ContentSearchQuery): Promise<ParentingContent[]> {
    try {
      const where: Prisma.ParentingContentWhereInput = {};

      // Text search across title, description, and content
      if (query.query) {
        where.OR = [
          { title: { contains: query.query, mode: 'insensitive' } },
          { description: { contains: query.query, mode: 'insensitive' } },
          { content: { contains: query.query, mode: 'insensitive' } },
        ];
      }

      // Category filter
      if (query.category) {
        where.category = query.category;
      }

      // Content type filter
      if (query.contentType) {
        where.contentType = query.contentType;
      }

      // Age group filtering
      if (query.ageGroupMin !== undefined || query.ageGroupMax !== undefined) {
        where.AND = [];
        if (query.ageGroupMin !== undefined) {
          where.AND.push({ ageGroupMax: { gte: query.ageGroupMin } });
        }
        if (query.ageGroupMax !== undefined) {
          where.AND.push({ ageGroupMin: { lte: query.ageGroupMax } });
        }
      }

      // Expert level filter
      if (query.expertLevel) {
        where.expertLevel = query.expertLevel;
      }

      // Status filter (default to published for public searches)
      where.status = query.status || 'published';

      // Tag filtering
      if (query.tags && query.tags.length > 0) {
        // Search for any of the provided tags in the JSON array
        where.OR = query.tags.map(tag => ({
          tags: { contains: tag }
        }));
      }

      const content = await prisma.parentingContent.findMany({
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
          { publishedAt: 'desc' },
        ],
        take: query.limit || 20,
        skip: query.offset || 0,
      });

      return content;
    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('Failed to search content');
    }
  }

  /**
   * Get content by category with filtering
   */
  static async getContentByCategory(
    category: string,
    filters?: ContentFilters
  ): Promise<ParentingContent[]> {
    try {
      const where: Prisma.ParentingContentWhereInput = {
        category,
        status: 'published',
      };

      // Apply age group filtering
      if (filters?.ageGroupMin !== undefined || filters?.ageGroupMax !== undefined) {
        where.AND = [];
        if (filters.ageGroupMin !== undefined) {
          where.AND.push({ ageGroupMax: { gte: filters.ageGroupMin } });
        }
        if (filters.ageGroupMax !== undefined) {
          where.AND.push({ ageGroupMin: { lte: filters.ageGroupMax } });
        }
      }

      // Expert level filter
      if (filters?.expertLevel) {
        where.expertLevel = filters.expertLevel;
      }

      // Tag filtering
      if (filters?.tags && filters.tags.length > 0) {
        where.OR = filters.tags.map(tag => ({
          tags: { contains: tag }
        }));
      }

      const content = await prisma.parentingContent.findMany({
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
          { publishedAt: 'desc' },
        ],
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      });

      return content;
    } catch (error) {
      console.error('Error fetching content by category:', error);
      throw new Error('Failed to fetch content by category');
    }
  }

  /**
   * Get personalized content for a parent
   */
  static async getPersonalizedContent(parentId: string): Promise<ParentingContent[]> {
    try {
      // Get user's recommendation profile
      const profile = await prisma.recommendationProfile.findUnique({
        where: { parentId },
        include: {
          recommendations: {
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
              score: 'desc',
            },
            take: 10,
          },
        },
      });

      if (profile?.recommendations) {
        return profile.recommendations.map(rec => rec.content);
      }

      // Fallback to general high-rated content if no profile exists
      return await this.searchContent({
        status: 'published',
        limit: 10,
      });
    } catch (error) {
      console.error('Error fetching personalized content:', error);
      throw new Error('Failed to fetch personalized content');
    }
  }

  /**
   * Track content engagement
   */
  static async trackContentEngagement(
    contentId: string,
    parentId: string,
    engagement: EngagementData
  ): Promise<void> {
    try {
      // Create engagement record
      await prisma.contentEngagement.create({
        data: {
          contentId,
          userId: parentId,
          eventType: engagement.eventType,
          duration: engagement.duration,
          metadata: JSON.stringify(engagement.metadata || {}),
        },
      });

      // Update content view count if it's a view event
      if (engagement.eventType === 'view') {
        await prisma.parentingContent.update({
          where: { id: contentId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error tracking engagement:', error);
      throw new Error('Failed to track engagement');
    }
  }

  /**
   * Publish content (change status from draft/review to published)
   */
  static async publishContent(id: string): Promise<ParentingContent> {
    try {
      const content = await prisma.parentingContent.update({
        where: { id },
        data: {
          status: 'published',
          publishedAt: new Date(),
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
      });

      return content;
    } catch (error) {
      console.error('Error publishing content:', error);
      throw new Error('Failed to publish content');
    }
  }

  /**
   * Archive content
   */
  static async archiveContent(id: string): Promise<ParentingContent> {
    try {
      const content = await prisma.parentingContent.update({
        where: { id },
        data: {
          status: 'archived',
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
      });

      return content;
    } catch (error) {
      console.error('Error archiving content:', error);
      throw new Error('Failed to archive content');
    }
  }

  /**
   * Get content statistics
   */
  static async getContentStats(contentId: string) {
    try {
      const stats = await prisma.contentEngagement.groupBy({
        by: ['eventType'],
        where: {
          contentId,
        },
        _count: {
          eventType: true,
        },
      });

      const content = await prisma.parentingContent.findUnique({
        where: { id: contentId },
        select: {
          viewCount: true,
          rating: true,
        },
      });

      return {
        viewCount: content?.viewCount || 0,
        rating: content?.rating || 0,
        engagementStats: stats.reduce((acc, stat) => {
          acc[stat.eventType] = stat._count.eventType;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      console.error('Error fetching content stats:', error);
      throw new Error('Failed to fetch content statistics');
    }
  }
}