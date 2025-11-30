import { prisma } from '@/lib/prisma';
import { ContentEngagement, Prisma } from '@prisma/client';
import { EngagementData, ContentMetrics } from '@/types/parenting';

/**
 * Engagement Tracking Service for Digital Parenting Platform
 * Handles user interaction tracking and analytics
 */
export class EngagementService {
  /**
   * Track user engagement with content
   */
  static async trackEngagement(
    contentId: string,
    userId: string,
    engagement: EngagementData
  ): Promise<ContentEngagement> {
    try {
      // Create engagement record
      const engagementRecord = await prisma.contentEngagement.create({
        data: {
          contentId,
          userId,
          eventType: engagement.eventType,
          duration: engagement.duration,
          metadata: JSON.stringify(engagement.metadata || {}),
        },
      });

      // Update content metrics based on engagement type
      await this.updateContentMetrics(contentId, engagement.eventType);

      // Update user recommendation profile
      await this.updateRecommendationProfile(userId, contentId, engagement);

      return engagementRecord;
    } catch (error) {
      console.error('Error tracking engagement:', error);
      throw new Error('Failed to track engagement');
    }
  }

  /**
   * Batch track multiple engagement events
   */
  static async trackBatchEngagement(
    engagements: Array<{
      contentId: string;
      userId: string;
      engagement: EngagementData;
    }>
  ): Promise<void> {
    try {
      const engagementData = engagements.map(e => ({
        contentId: e.contentId,
        userId: e.userId,
        eventType: e.engagement.eventType,
        duration: e.engagement.duration,
        metadata: JSON.stringify(e.engagement.metadata || {}),
        timestamp: new Date(),
      }));

      await prisma.contentEngagement.createMany({
        data: engagementData,
      });

      // Update metrics for each unique content
      const uniqueContentIds = [...new Set(engagements.map(e => e.contentId))];
      for (const contentId of uniqueContentIds) {
        const contentEngagements = engagements.filter(e => e.contentId === contentId);
        for (const engagement of contentEngagements) {
          await this.updateContentMetrics(contentId, engagement.engagement.eventType);
        }
      }
    } catch (error) {
      console.error('Error tracking batch engagement:', error);
      throw new Error('Failed to track batch engagement');
    }
  }

  /**
   * Get engagement analytics for content
   */
  static async getContentEngagementAnalytics(
    contentId: string,
    timeframe?: { start: Date; end: Date }
  ): Promise<ContentMetrics> {
    try {
      const where: Prisma.ContentEngagementWhereInput = { contentId };
      
      if (timeframe) {
        where.timestamp = {
          gte: timeframe.start,
          lte: timeframe.end,
        };
      }

      // Get engagement statistics
      const [
        totalEngagements,
        uniqueUsers,
        engagementsByType,
        averageDuration,
        content,
      ] = await Promise.all([
        // Total engagements
        prisma.contentEngagement.count({ where }),
        
        // Unique users
        prisma.contentEngagement.findMany({
          where,
          select: { userId: true },
          distinct: ['userId'],
        }),
        
        // Engagements by type
        prisma.contentEngagement.groupBy({
          by: ['eventType'],
          where,
          _count: { eventType: true },
        }),
        
        // Average duration
        prisma.contentEngagement.aggregate({
          where: {
            ...where,
            duration: { not: null },
          },
          _avg: { duration: true },
        }),
        
        // Content info
        prisma.parentingContent.findUnique({
          where: { id: contentId },
          select: {
            viewCount: true,
            rating: true,
          },
        }),
      ]);

      const engagementStats = engagementsByType.reduce((acc, stat) => {
        acc[stat.eventType] = stat._count.eventType;
        return acc;
      }, {} as Record<string, number>);

      const views = engagementStats.view || 0;
      const shares = engagementStats.share || 0;
      const bookmarks = engagementStats.bookmark || 0;
      const completions = engagementStats.complete || 0;

      return {
        contentId,
        views,
        uniqueViews: uniqueUsers.length,
        averageTimeSpent: averageDuration._avg.duration || 0,
        completionRate: views > 0 ? (completions / views) * 100 : 0,
        rating: content?.rating || 0,
        shares,
        bookmarks,
      };
    } catch (error) {
      console.error('Error getting content engagement analytics:', error);
      throw new Error('Failed to get engagement analytics');
    }
  }

  /**
   * Get user engagement history
   */
  static async getUserEngagementHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const engagements = await prisma.contentEngagement.findMany({
        where: { userId },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              category: true,
              contentType: true,
              ageGroupMin: true,
              ageGroupMax: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      });

      return engagements;
    } catch (error) {
      console.error('Error getting user engagement history:', error);
      throw new Error('Failed to get user engagement history');
    }
  }

  /**
   * Get engagement trends over time
   */
  static async getEngagementTrends(
    contentId?: string,
    timeframe: 'day' | 'week' | 'month' = 'week',
    groupBy: 'hour' | 'day' | 'week' = 'day'
  ) {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      const where: Prisma.ContentEngagementWhereInput = {
        timestamp: { gte: since },
      };

      if (contentId) {
        where.contentId = contentId;
      }

      const engagements = await prisma.contentEngagement.findMany({
        where,
        select: {
          eventType: true,
          timestamp: true,
          contentId: true,
        },
        orderBy: { timestamp: 'asc' },
      });

      // Group engagements by time period
      const trends = this.groupEngagementsByTime(engagements, groupBy);

      return trends;
    } catch (error) {
      console.error('Error getting engagement trends:', error);
      throw new Error('Failed to get engagement trends');
    }
  }

  /**
   * Get top performing content by engagement
   */
  static async getTopPerformingContent(
    timeframe: 'day' | 'week' | 'month' = 'week',
    metric: 'views' | 'shares' | 'bookmarks' | 'completions' = 'views',
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

      const eventTypeMap = {
        views: 'view',
        shares: 'share',
        bookmarks: 'bookmark',
        completions: 'complete',
      };

      const topContent = await prisma.contentEngagement.groupBy({
        by: ['contentId'],
        where: {
          eventType: eventTypeMap[metric],
          timestamp: { gte: since },
        },
        _count: { contentId: true },
        orderBy: { _count: { contentId: 'desc' } },
        take: limit,
      });

      // Get content details
      const contentIds = topContent.map(c => c.contentId);
      const contentDetails = await prisma.parentingContent.findMany({
        where: { id: { in: contentIds } },
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

      // Combine with engagement counts
      return topContent.map(tc => {
        const content = contentDetails.find(c => c.id === tc.contentId);
        return {
          content,
          engagementCount: tc._count.contentId,
          metric,
        };
      });
    } catch (error) {
      console.error('Error getting top performing content:', error);
      throw new Error('Failed to get top performing content');
    }
  }

  /**
   * Get user engagement patterns
   */
  static async getUserEngagementPatterns(userId: string) {
    try {
      const [
        totalEngagements,
        engagementsByType,
        engagementsByCategory,
        engagementsByTime,
        averageSessionDuration,
      ] = await Promise.all([
        // Total engagements
        prisma.contentEngagement.count({
          where: { userId },
        }),
        
        // Engagements by type
        prisma.contentEngagement.groupBy({
          by: ['eventType'],
          where: { userId },
          _count: { eventType: true },
        }),
        
        // Engagements by content category
        prisma.contentEngagement.findMany({
          where: { userId },
          include: {
            content: {
              select: { category: true },
            },
          },
        }),
        
        // Engagements by hour of day
        prisma.contentEngagement.findMany({
          where: { userId },
          select: { timestamp: true },
        }),
        
        // Average session duration
        prisma.contentEngagement.aggregate({
          where: {
            userId,
            duration: { not: null },
          },
          _avg: { duration: true },
        }),
      ]);

      // Process category preferences
      const categoryEngagements = engagementsByCategory.reduce((acc, eng) => {
        const category = eng.content.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Process time patterns (hour of day)
      const hourlyEngagements = engagementsByTime.reduce((acc, eng) => {
        const hour = eng.timestamp.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        totalEngagements,
        engagementsByType: engagementsByType.reduce((acc, stat) => {
          acc[stat.eventType] = stat._count.eventType;
          return acc;
        }, {} as Record<string, number>),
        categoryPreferences: categoryEngagements,
        peakHours: Object.entries(hourlyEngagements)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([hour]) => parseInt(hour)),
        averageSessionDuration: averageSessionDuration._avg.duration || 0,
      };
    } catch (error) {
      console.error('Error getting user engagement patterns:', error);
      throw new Error('Failed to get user engagement patterns');
    }
  }

  /**
   * Update content metrics based on engagement
   */
  private static async updateContentMetrics(
    contentId: string,
    eventType: string
  ): Promise<void> {
    try {
      const updates: Prisma.ParentingContentUpdateInput = {};

      switch (eventType) {
        case 'view':
          updates.viewCount = { increment: 1 };
          break;
        case 'rate':
          // Rating updates are handled separately
          break;
        default:
          // Other engagement types don't directly update content metrics
          break;
      }

      if (Object.keys(updates).length > 0) {
        await prisma.parentingContent.update({
          where: { id: contentId },
          data: updates,
        });
      }
    } catch (error) {
      console.error('Error updating content metrics:', error);
      // Don't throw here to avoid breaking the main engagement tracking
    }
  }

  /**
   * Update user recommendation profile based on engagement
   */
  private static async updateRecommendationProfile(
    userId: string,
    contentId: string,
    engagement: EngagementData
  ): Promise<void> {
    try {
      // Get or create recommendation profile
      let profile = await prisma.recommendationProfile.findUnique({
        where: { parentId: userId },
      });

      if (!profile) {
        profile = await prisma.recommendationProfile.create({
          data: {
            parentId: userId,
            childrenAges: '[]',
            interests: '[]',
            challenges: '[]',
            preferredContentTypes: '[]',
          },
        });
      }

      // Get content details to update preferences
      const content = await prisma.parentingContent.findUnique({
        where: { id: contentId },
        select: {
          category: true,
          contentType: true,
          tags: true,
        },
      });

      if (content) {
        // Update preferred content types
        const preferredTypes = JSON.parse(profile.preferredContentTypes);
        if (!preferredTypes.includes(content.contentType)) {
          preferredTypes.push(content.contentType);
        }

        // Update interests based on tags
        const interests = JSON.parse(profile.interests);
        const contentTags = JSON.parse(content.tags || '[]');
        contentTags.forEach((tag: string) => {
          if (!interests.includes(tag)) {
            interests.push(tag);
          }
        });

        // Update profile
        await prisma.recommendationProfile.update({
          where: { parentId: userId },
          data: {
            preferredContentTypes: JSON.stringify(preferredTypes.slice(-10)), // Keep last 10
            interests: JSON.stringify(interests.slice(-20)), // Keep last 20
            lastUpdated: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error updating recommendation profile:', error);
      // Don't throw here to avoid breaking the main engagement tracking
    }
  }

  /**
   * Group engagements by time period
   */
  private static groupEngagementsByTime(
    engagements: Array<{
      eventType: string;
      timestamp: Date;
      contentId: string;
    }>,
    groupBy: 'hour' | 'day' | 'week'
  ) {
    const groups: Record<string, Record<string, number>> = {};

    engagements.forEach(engagement => {
      let timeKey: string;
      
      switch (groupBy) {
        case 'hour':
          timeKey = engagement.timestamp.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          break;
        case 'day':
          timeKey = engagement.timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
          break;
        case 'week':
          const weekStart = new Date(engagement.timestamp);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          timeKey = weekStart.toISOString().slice(0, 10);
          break;
        default:
          timeKey = engagement.timestamp.toISOString().slice(0, 10);
      }

      if (!groups[timeKey]) {
        groups[timeKey] = {};
      }

      groups[timeKey][engagement.eventType] = (groups[timeKey][engagement.eventType] || 0) + 1;
    });

    return Object.entries(groups)
      .map(([time, events]) => ({
        time,
        events,
        total: Object.values(events).reduce((sum, count) => sum + count, 0),
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }
}