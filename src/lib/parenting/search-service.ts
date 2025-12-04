import { prisma } from '@/lib/prisma';
import { ParentingContent, Prisma } from '@prisma/client';
import { ContentSearchQuery, ParentingContentWithAuthor } from '@/types/parenting';

/**
 * Advanced Search Service for Digital Parenting Platform
 * Provides sophisticated search and filtering capabilities
 */
export class SearchService {
  /**
   * Advanced content search with relevance scoring
   */
  static async searchContentAdvanced(
    query: ContentSearchQuery & {
      sortBy?: 'relevance' | 'rating' | 'views' | 'date' | 'popularity';
      sortOrder?: 'asc' | 'desc';
      includeArchived?: boolean;
    }
  ): Promise<ParentingContentWithAuthor[]> {
    try {
      const where: Prisma.ParentingContentWhereInput = {};
      const orderBy: Prisma.ParentingContentOrderByWithRelationInput[] = [];

      // Build search conditions
      this.buildSearchConditions(where, query);

      // Build sorting
      this.buildSortOrder(orderBy, query.sortBy, query.sortOrder);

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
          engagements: {
            select: {
              eventType: true,
              timestamp: true,
            },
            take: 5,
          },
        },
        orderBy,
        take: query.limit || 20,
        skip: query.offset || 0,
      });

      // Calculate relevance scores if searching by relevance
      if (query.sortBy === 'relevance' && query.query) {
        return this.calculateRelevanceScores(content, query.query);
      }

      return content;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw new Error('Failed to perform advanced search');
    }
  }

  /**
   * Search content by H.A.B.I.T.S. category with smart filtering
   */
  static async searchByCategory(
    category: 'H' | 'A' | 'B' | 'I' | 'T' | 'S' | 'general',
    filters: {
      childAgeInMonths?: number;
      parentingChallenges?: string[];
      expertLevel?: string;
      contentType?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<ParentingContentWithAuthor[]> {
    try {
      const where: Prisma.ParentingContentWhereInput = {
        category,
        status: 'published',
      };

      // Age-appropriate filtering
      if (filters.childAgeInMonths !== undefined) {
        where.AND = [
          { ageGroupMin: { lte: filters.childAgeInMonths } },
          { ageGroupMax: { gte: filters.childAgeInMonths } },
        ];
      }

      // Expert level filtering
      if (filters.expertLevel) {
        where.expertLevel = filters.expertLevel;
      }

      // Content type filtering
      if (filters.contentType) {
        where.contentType = filters.contentType;
      }

      // Challenge-based filtering (search in tags and content)
      if (filters.parentingChallenges && filters.parentingChallenges.length > 0) {
        const challengeConditions = filters.parentingChallenges.map(challenge => ({
          OR: [
            { tags: { contains: challenge } },
            { title: { contains: challenge, mode: 'insensitive' } },
            { description: { contains: challenge, mode: 'insensitive' } },
          ],
        }));
        
        where.OR = challengeConditions;
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
        take: filters.limit || 20,
        skip: filters.offset || 0,
      });

      return content;
    } catch (error) {
      console.error('Error searching by category:', error);
      throw new Error('Failed to search by category');
    }
  }

  /**
   * Get trending content based on recent engagement
   */
  static async getTrendingContent(
    timeframe: 'day' | 'week' | 'month' = 'week',
    category?: string,
    limit: number = 10
  ): Promise<ParentingContentWithAuthor[]> {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      // Get content with high engagement in the timeframe
      const trendingContent = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          category: category || undefined,
          publishedAt: {
            gte: since,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          engagements: {
            where: {
              timestamp: {
                gte: since,
              },
            },
          },
        },
        orderBy: [
          { viewCount: 'desc' },
          { rating: 'desc' },
        ],
        take: limit,
      });

      // Sort by engagement activity in the timeframe
      return trendingContent.sort((a, b) => {
        const aEngagement = a.engagements.length;
        const bEngagement = b.engagements.length;
        return bEngagement - aEngagement;
      });
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw new Error('Failed to fetch trending content');
    }
  }

  /**
   * Get content recommendations based on user behavior
   */
  static async getRecommendedContent(
    userId: string,
    childAgeInMonths?: number,
    limit: number = 10
  ): Promise<ParentingContentWithAuthor[]> {
    try {
      // Get user's recent engagement history
      const recentEngagements = await prisma.contentEngagement.findMany({
        where: {
          userId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        include: {
          content: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 20,
      });

      // Extract categories and tags from user's engagement
      const engagedCategories = new Set<string>();
      const engagedTags = new Set<string>();

      recentEngagements.forEach(engagement => {
        engagedCategories.add(engagement.content.category);
        const tags = JSON.parse(engagement.content.tags || '[]');
        tags.forEach((tag: string) => engagedTags.add(tag));
      });

      // Build recommendation query
      const where: Prisma.ParentingContentWhereInput = {
        status: 'published',
        NOT: {
          id: {
            in: recentEngagements.map(e => e.contentId),
          },
        },
      };

      // Age-appropriate filtering
      if (childAgeInMonths !== undefined) {
        where.AND = [
          { ageGroupMin: { lte: childAgeInMonths } },
          { ageGroupMax: { gte: childAgeInMonths } },
        ];
      }

      // Category and tag-based recommendations
      if (engagedCategories.size > 0 || engagedTags.size > 0) {
        const conditions: any[] = [];

        if (engagedCategories.size > 0) {
          conditions.push({
            category: {
              in: Array.from(engagedCategories),
            },
          });
        }

        if (engagedTags.size > 0) {
          Array.from(engagedTags).forEach(tag => {
            conditions.push({
              tags: { contains: tag },
            });
          });
        }

        where.OR = conditions;
      }

      const recommendations = await prisma.parentingContent.findMany({
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
        ],
        take: limit,
      });

      return recommendations;
    } catch (error) {
      console.error('Error getting recommended content:', error);
      throw new Error('Failed to get recommended content');
    }
  }

  /**
   * Search content by multiple criteria with faceted results
   */
  static async facetedSearch(query: {
    searchTerm?: string;
    categories?: string[];
    contentTypes?: string[];
    expertLevels?: string[];
    ageRanges?: { min: number; max: number }[];
    tags?: string[];
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: Prisma.ParentingContentWhereInput = {
        status: 'published',
      };

      // Text search
      if (query.searchTerm) {
        where.OR = [
          { title: { contains: query.searchTerm, mode: 'insensitive' } },
          { description: { contains: query.searchTerm, mode: 'insensitive' } },
          { content: { contains: query.searchTerm, mode: 'insensitive' } },
        ];
      }

      // Multi-facet filtering
      const andConditions: any[] = [];

      if (query.categories && query.categories.length > 0) {
        andConditions.push({
          category: { in: query.categories },
        });
      }

      if (query.contentTypes && query.contentTypes.length > 0) {
        andConditions.push({
          contentType: { in: query.contentTypes },
        });
      }

      if (query.expertLevels && query.expertLevels.length > 0) {
        andConditions.push({
          expertLevel: { in: query.expertLevels },
        });
      }

      if (query.ageRanges && query.ageRanges.length > 0) {
        const ageConditions = query.ageRanges.map(range => ({
          AND: [
            { ageGroupMin: { lte: range.max } },
            { ageGroupMax: { gte: range.min } },
          ],
        }));
        andConditions.push({ OR: ageConditions });
      }

      if (query.tags && query.tags.length > 0) {
        const tagConditions = query.tags.map(tag => ({
          tags: { contains: tag },
        }));
        andConditions.push({ OR: tagConditions });
      }

      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      // Get results
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
        ],
        take: query.limit || 20,
        skip: query.offset || 0,
      });

      // Get facet counts
      const facets = await this.getFacetCounts(where);

      return {
        content,
        facets,
        total: await prisma.parentingContent.count({ where }),
      };
    } catch (error) {
      console.error('Error in faceted search:', error);
      throw new Error('Failed to perform faceted search');
    }
  }

  /**
   * Build search conditions for complex queries
   */
  private static buildSearchConditions(
    where: Prisma.ParentingContentWhereInput,
    query: ContentSearchQuery
  ) {
    // Status filtering
    where.status = query.status || 'published';

    // Text search across multiple fields
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

    // Expert level filter
    if (query.expertLevel) {
      where.expertLevel = query.expertLevel;
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

    // Tag filtering
    if (query.tags && query.tags.length > 0) {
      const tagConditions = query.tags.map(tag => ({
        tags: { contains: tag },
      }));
      where.OR = where.OR ? [...where.OR, ...tagConditions] : tagConditions;
    }
  }

  /**
   * Build sort order for search results
   */
  private static buildSortOrder(
    orderBy: Prisma.ParentingContentOrderByWithRelationInput[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    switch (sortBy) {
      case 'rating':
        orderBy.push({ rating: sortOrder });
        break;
      case 'views':
        orderBy.push({ viewCount: sortOrder });
        break;
      case 'date':
        orderBy.push({ publishedAt: sortOrder });
        break;
      case 'popularity':
        orderBy.push({ viewCount: 'desc' }, { rating: 'desc' });
        break;
      case 'relevance':
      default:
        // Default sorting for relevance or when no sort specified
        orderBy.push({ rating: 'desc' }, { viewCount: 'desc' }, { publishedAt: 'desc' });
        break;
    }
  }

  /**
   * Calculate relevance scores for search results
   */
  private static calculateRelevanceScores(
    content: ParentingContentWithAuthor[],
    searchQuery: string
  ): ParentingContentWithAuthor[] {
    const query = searchQuery.toLowerCase();
    
    return content
      .map(item => {
        let score = 0;
        
        // Title match (highest weight)
        if (item.title.toLowerCase().includes(query)) {
          score += 10;
        }
        
        // Description match (medium weight)
        if (item.description.toLowerCase().includes(query)) {
          score += 5;
        }
        
        // Content match (lower weight)
        if (item.content.toLowerCase().includes(query)) {
          score += 2;
        }
        
        // Tag match (medium weight)
        const tags = JSON.parse(item.tags || '[]');
        if (tags.some((tag: string) => tag.toLowerCase().includes(query))) {
          score += 7;
        }
        
        // Boost by existing metrics
        score += item.rating * 2;
        score += Math.log(item.viewCount + 1);
        
        return { ...item, relevanceScore: score };
      })
      .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
  }

  /**
   * Get facet counts for search results
   */
  private static async getFacetCounts(baseWhere: Prisma.ParentingContentWhereInput) {
    try {
      const [categories, contentTypes, expertLevels] = await Promise.all([
        // Category facets
        prisma.parentingContent.groupBy({
          by: ['category'],
          where: baseWhere,
          _count: { category: true },
        }),
        
        // Content type facets
        prisma.parentingContent.groupBy({
          by: ['contentType'],
          where: baseWhere,
          _count: { contentType: true },
        }),
        
        // Expert level facets
        prisma.parentingContent.groupBy({
          by: ['expertLevel'],
          where: baseWhere,
          _count: { expertLevel: true },
        }),
      ]);

      return {
        categories: categories.map(c => ({ value: c.category, count: c._count.category })),
        contentTypes: contentTypes.map(c => ({ value: c.contentType, count: c._count.contentType })),
        expertLevels: expertLevels.map(c => ({ value: c.expertLevel, count: c._count.expertLevel })),
      };
    } catch (error) {
      console.error('Error getting facet counts:', error);
      return { categories: [], contentTypes: [], expertLevels: [] };
    }
  }
}