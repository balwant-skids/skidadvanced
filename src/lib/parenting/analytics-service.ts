import { prisma } from '@/lib/prisma';

/**
 * Analytics Service for Digital Parenting Platform
 * Handles user engagement tracking, content performance, and admin insights
 */

export interface EngagementMetrics {
  userId: string;
  contentId: string;
  eventType: string;
  duration?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ContentPerformance {
  contentId: string;
  title: string;
  category: string;
  viewCount: number;
  engagementRate: number;
  averageRating: number;
  bookmarkCount: number;
  shareCount: number;
  completionRate: number;
  lastWeekViews: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserBehaviorInsights {
  userId: string;
  totalEngagements: number;
  averageSessionDuration: number;
  preferredContentTypes: string[];
  mostActiveTimeOfDay: string;
  engagementTrend: 'increasing' | 'decreasing' | 'stable';
  lastActiveDate: Date;
  favoriteCategories: string[];
}

export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  totalEngagements: number;
  topPerformingContent: ContentPerformance[];
  userGrowth: { date: string; count: number }[];
  engagementTrends: { date: string; engagements: number }[];
  contentGaps: string[];
  expertUtilization: { expertId: string; consultations: number; rating: number }[];
}

export class AnalyticsService {
  /**
   * Track user engagement event
   */
  static async trackUserEngagement(data: EngagementMetrics): Promise<void> {
    try {
      // Record engagement
      await prisma.contentEngagement.create({
        data: {
          userId: data.userId,
          contentId: data.contentId,
          eventType: data.eventType,
          duration: data.duration,
          timestamp: data.timestamp,
          metadata: JSON.stringify(data.metadata || {}),
        },
      });

      // Update content view count if it's a view event
      if (data.eventType === 'view') {
        await prisma.parentingContent.update({
          where: { id: data.contentId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      }

      // Update user activity
      await this.updateUserActivity(data.userId);
    } catch (error) {
      console.error('Error tracking user engagement:', error);
      // Don't throw to avoid breaking user flow
    }
  }

  /**
   * Get content performance metrics
   */
  static async getContentPerformance(
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 20
  ): Promise<ContentPerformance[]> {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      const lastWeekSince = new Date();
      lastWeekSince.setDate(lastWeekSince.getDate() - 7);

      // Get content with engagement metrics
      const content = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
        },
        include: {
          engagements: {
            where: {
              timestamp: { gte: since },
            },
          },
          bookmarks: true,
          _count: {
            select: {
              engagements: {
                where: {
                  timestamp: { gte: since },
                },
              },
            },
          },
        },
        take: limit * 2, // Get more to calculate metrics and filter
      });

      const performanceMetrics: ContentPerformance[] = [];

      for (const item of content) {
        const engagements = item.engagements;
        const totalEngagements = engagements.length;

        if (totalEngagements === 0) continue;

        // Calculate metrics
        const viewEngagements = engagements.filter(e => e.eventType === 'view');
        const shareEngagements = engagements.filter(e => e.eventType === 'share');
        const completeEngagements = engagements.filter(e => e.eventType === 'complete');

        const engagementRate = totalEngagements > 0 ? 
          (engagements.filter(e => ['share', 'bookmark', 'complete'].includes(e.eventType)).length / totalEngagements) * 100 : 0;

        const completionRate = viewEngagements.length > 0 ? 
          (completeEngagements.length / viewEngagements.length) * 100 : 0;

        // Get last week views for trend calculation
        const lastWeekViews = await prisma.contentEngagement.count({
          where: {
            contentId: item.id,
            eventType: 'view',
            timestamp: {
              gte: lastWeekSince,
              lt: since,
            },
          },
        });

        const currentViews = viewEngagements.length;
        let trend: 'up' | 'down' | 'stable' = 'stable';
        
        if (currentViews > lastWeekViews * 1.1) trend = 'up';
        else if (currentViews < lastWeekViews * 0.9) trend = 'down';

        performanceMetrics.push({
          contentId: item.id,
          title: item.title,
          category: item.category,
          viewCount: item.viewCount,
          engagementRate,
          averageRating: item.rating,
          bookmarkCount: item.bookmarks.length,
          shareCount: shareEngagements.length,
          completionRate,
          lastWeekViews,
          trend,
        });
      }

      // Sort by engagement rate and return top performers
      return performanceMetrics
        .sort((a, b) => b.engagementRate - a.engagementRate)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting content performance:', error);
      throw new Error('Failed to get content performance');
    }
  }

  /**
   * Get user behavior insights
   */
  static async getUserBehaviorInsights(userId: string): Promise<UserBehaviorInsights> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get user engagements
      const engagements = await prisma.contentEngagement.findMany({
        where: {
          userId,
          timestamp: { gte: thirtyDaysAgo },
        },
        include: {
          content: {
            select: {
              category: true,
              contentType: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      if (engagements.length === 0) {
        return {
          userId,
          totalEngagements: 0,
          averageSessionDuration: 0,
          preferredContentTypes: [],
          mostActiveTimeOfDay: 'morning',
          engagementTrend: 'stable',
          lastActiveDate: new Date(),
          favoriteCategories: [],
        };
      }

      // Calculate metrics
      const totalEngagements = engagements.length;
      const totalDuration = engagements.reduce((sum, e) => sum + (e.duration || 0), 0);
      const averageSessionDuration = totalDuration / totalEngagements;

      // Content type preferences
      const contentTypeCount: Record<string, number> = {};
      const categoryCount: Record<string, number> = {};
      const hourCount: Record<number, number> = {};

      engagements.forEach(engagement => {
        const contentType = engagement.content.contentType;
        const category = engagement.content.category;
        const hour = engagement.timestamp.getHours();

        contentTypeCount[contentType] = (contentTypeCount[contentType] || 0) + 1;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      });

      const preferredContentTypes = Object.entries(contentTypeCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);

      const favoriteCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);

      // Most active time of day
      const mostActiveHour = Object.entries(hourCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      let mostActiveTimeOfDay = 'morning';
      if (mostActiveHour) {
        const hour = parseInt(mostActiveHour);
        if (hour >= 6 && hour < 12) mostActiveTimeOfDay = 'morning';
        else if (hour >= 12 && hour < 18) mostActiveTimeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22) mostActiveTimeOfDay = 'evening';
        else mostActiveTimeOfDay = 'night';
      }

      // Engagement trend (compare last 15 days vs previous 15 days)
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const recentEngagements = engagements.filter(e => e.timestamp >= fifteenDaysAgo).length;
      const previousEngagements = engagements.filter(e => 
        e.timestamp < fifteenDaysAgo && e.timestamp >= thirtyDaysAgo
      ).length;

      let engagementTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentEngagements > previousEngagements * 1.1) engagementTrend = 'increasing';
      else if (recentEngagements < previousEngagements * 0.9) engagementTrend = 'decreasing';

      return {
        userId,
        totalEngagements,
        averageSessionDuration,
        preferredContentTypes,
        mostActiveTimeOfDay,
        engagementTrend,
        lastActiveDate: engagements[0].timestamp,
        favoriteCategories,
      };
    } catch (error) {
      console.error('Error getting user behavior insights:', error);
      throw new Error('Failed to get user behavior insights');
    }
  }

  /**
   * Generate admin dashboard data
   */
  static async generateAdminDashboard(): Promise<AdminDashboardData> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get basic counts
      const [totalUsers, totalContent, totalEngagements] = await Promise.all([
        prisma.user.count(),
        prisma.parentingContent.count({ where: { status: 'published' } }),
        prisma.contentEngagement.count({
          where: { timestamp: { gte: thirtyDaysAgo } },
        }),
      ]);

      // Active users (engaged in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activeUsers = await prisma.contentEngagement.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: sevenDaysAgo },
        },
        _count: true,
      });

      // Top performing content
      const topPerformingContent = await this.getContentPerformance('month', 10);

      // User growth over time
      const userGrowth = await this.getUserGrowthData();

      // Engagement trends
      const engagementTrends = await this.getEngagementTrends();

      // Content gaps
      const contentGaps = await this.identifyContentGaps();

      // Expert utilization
      const expertUtilization = await this.getExpertUtilization();

      return {
        totalUsers,
        activeUsers: activeUsers.length,
        totalContent,
        totalEngagements,
        topPerformingContent,
        userGrowth,
        engagementTrends,
        contentGaps,
        expertUtilization,
      };
    } catch (error) {
      console.error('Error generating admin dashboard:', error);
      throw new Error('Failed to generate admin dashboard');
    }
  }

  /**
   * Identify content gaps based on user behavior
   */
  static async identifyContentGaps(): Promise<string[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get search queries that returned few results
      const searchQueries = await prisma.searchQuery.findMany({
        where: {
          timestamp: { gte: thirtyDaysAgo },
          resultCount: { lt: 3 }, // Queries with less than 3 results
        },
        select: {
          query: true,
          resultCount: true,
        },
      });

      // Get frequently requested but unavailable content
      const gaps = searchQueries
        .reduce((acc, sq) => {
          acc[sq.query] = (acc[sq.query] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)

      return Object.entries(gaps)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([query]) => query);
    } catch (error) {
      console.error('Error identifying content gaps:', error);
      return [];
    }
  }

  /**
   * Anonymize analytics data for privacy compliance
   */
  static async anonymizeAnalyticsData(userId: string): Promise<void> {
    try {
      // Replace user ID with anonymous hash
      const anonymousId = this.generateAnonymousId(userId);

      await prisma.contentEngagement.updateMany({
        where: { userId },
        data: { userId: anonymousId },
      });

      console.log(`Anonymized analytics data for user ${userId}`);
    } catch (error) {
      console.error('Error anonymizing analytics data:', error);
      throw new Error('Failed to anonymize analytics data');
    }
  }

  /**
   * Private helper methods
   */
  private static async updateUserActivity(userId: string): Promise<void> {
    try {
      await prisma.userActivity.upsert({
        where: { userId },
        update: { lastActiveAt: new Date() },
        create: { userId, lastActiveAt: new Date() },
      });
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  }

  private static async getUserGrowthData(): Promise<{ date: string; count: number }[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userGrowth = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
        _count: true,
        orderBy: {
          createdAt: 'asc',
        },
      });

      return userGrowth.map(ug => ({
        date: ug.createdAt.toISOString().split('T')[0],
        count: ug._count,
      }));
    } catch (error) {
      console.error('Error getting user growth data:', error);
      return [];
    }
  }

  private static async getEngagementTrends(): Promise<{ date: string; engagements: number }[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const engagementTrends = await prisma.contentEngagement.groupBy({
        by: ['timestamp'],
        where: {
          timestamp: { gte: thirtyDaysAgo },
        },
        _count: true,
        orderBy: {
          timestamp: 'asc',
        },
      });

      return engagementTrends.map(et => ({
        date: et.timestamp.toISOString().split('T')[0],
        engagements: et._count,
      }));
    } catch (error) {
      console.error('Error getting engagement trends:', error);
      return [];
    }
  }

  private static async getExpertUtilization(): Promise<{ expertId: string; consultations: number; rating: number }[]> {
    try {
      const experts = await prisma.expert.findMany({
        where: { verified: true },
        include: {
          consultations: {
            where: {
              status: 'completed',
            },
          },
        },
      });

      return experts.map(expert => ({
        expertId: expert.id,
        consultations: expert.consultations.length,
        rating: expert.rating,
      }));
    } catch (error) {
      console.error('Error getting expert utilization:', error);
      return [];
    }
  }

  private static generateAnonymousId(userId: string): string {
    // Simple hash function for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `anon_${Math.abs(hash)}`;
  }
}