import { prisma } from '@/lib/prisma';
import { RecommendationProfile, ContentRecommendation, EngagementData } from '@/types/parenting';

/**
 * Recommendation Engine Service for Digital Parenting Platform
 * Handles personalized content recommendations and user profiling
 */

export interface BuildProfileInput {
  parentId: string;
  parentingStyle?: string;
  challenges?: string[];
  interests?: string[];
}

export interface RecommendationFilters {
  contentType?: string[];
  category?: string[];
  ageGroup?: string;
  priority?: 'high' | 'medium' | 'low';
  limit?: number;
}

export interface EngagementInput {
  userId: string;
  contentId: string;
  eventType: 'view' | 'click' | 'share' | 'bookmark' | 'complete' | 'like' | 'comment';
  duration?: number;
  metadata?: Record<string, any>;
}

export class RecommendationService {
  /**
   * Build or update recommendation profile for a parent
   */
  static async buildProfile(data: BuildProfileInput): Promise<RecommendationProfile> {
    try {
      // Get parent's children to determine ages
      const parent = await prisma.user.findUnique({
        where: { id: data.parentId },
        include: {
          parentProfile: {
            include: {
              children: true,
            },
          },
        },
      });

      if (!parent?.parentProfile) {
        throw new Error('Parent profile not found');
      }

      // Calculate children ages in months
      const childrenAges = parent.parentProfile.children.map(child => {
        return Math.floor(
          (Date.now() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        );
      });

      // Get engagement history to determine interests
      const engagements = await prisma.contentEngagement.findMany({
        where: {
          userId: data.parentId,
          timestamp: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
          },
        },
        include: {
          content: {
            select: {
              category: true,
              contentType: true,
              tags: true,
            },
          },
        },
      });

      // Extract interests from engagement patterns
      const categoryInterests: Record<string, number> = {};
      const contentTypePreferences: Record<string, number> = {};
      const tagInterests: Record<string, number> = {};

      engagements.forEach(engagement => {
        // Count category engagement
        const category = engagement.content.category;
        categoryInterests[category] = (categoryInterests[category] || 0) + 1;

        // Count content type preferences
        const contentType = engagement.content.contentType;
        contentTypePreferences[contentType] = (contentTypePreferences[contentType] || 0) + 1;

        // Count tag interests
        const tags = JSON.parse(engagement.content.tags || '[]');
        tags.forEach((tag: string) => {
          tagInterests[tag] = (tagInterests[tag] || 0) + 1;
        });
      });

      // Get top interests and preferences
      const topInterests = Object.entries(tagInterests)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);

      const topContentTypes = Object.entries(contentTypePreferences)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type);

      // Merge with provided data
      const finalInterests = [...new Set([...(data.interests || []), ...topInterests])];
      const finalChallenges = data.challenges || [];

      // Create or update recommendation profile
      const profile = await prisma.recommendationProfile.upsert({
        where: { parentId: data.parentId },
        update: {
          childrenAges: JSON.stringify(childrenAges),
          interests: JSON.stringify(finalInterests),
          preferredContentTypes: JSON.stringify(topContentTypes),
          parentingStyle: data.parentingStyle,
          challenges: JSON.stringify(finalChallenges),
          lastUpdated: new Date(),
        },
        create: {
          parentId: data.parentId,
          childrenAges: JSON.stringify(childrenAges),
          interests: JSON.stringify(finalInterests),
          preferredContentTypes: JSON.stringify(topContentTypes),
          parentingStyle: data.parentingStyle,
          challenges: JSON.stringify(finalChallenges),
        },
      });

      return {
        parentId: profile.parentId,
        childrenAges,
        interests: finalInterests,
        parentingStyle: profile.parentingStyle || undefined,
        challenges: finalChallenges,
        preferredContentTypes: topContentTypes,
        engagementHistory: [], // Would be populated from engagement data
        lastUpdated: profile.lastUpdated,
      };
    } catch (error) {
      console.error('Error building recommendation profile:', error);
      throw new Error('Failed to build recommendation profile');
    }
  }

  /**
   * Generate personalized content recommendations
   */
  static async generateRecommendations(
    parentId: string,
    filters?: RecommendationFilters
  ): Promise<ContentRecommendation[]> {
    try {
      // Get or build recommendation profile
      let profile = await prisma.recommendationProfile.findUnique({
        where: { parentId },
      });

      if (!profile) {
        await this.buildProfile({ parentId });
        profile = await prisma.recommendationProfile.findUnique({
          where: { parentId },
        });
      }

      if (!profile) {
        return [];
      }

      const childrenAges = JSON.parse(profile.childrenAges) as number[];
      const interests = JSON.parse(profile.interests) as string[];
      const preferredContentTypes = JSON.parse(profile.preferredContentTypes) as string[];
      const challenges = JSON.parse(profile.challenges) as string[];

      // Build content query conditions
      const whereConditions: any[] = [];

      // Age-appropriate content
      if (childrenAges.length > 0) {
        const minAge = Math.min(...childrenAges);
        const maxAge = Math.max(...childrenAges);
        whereConditions.push({
          AND: [
            { ageGroupMin: { lte: maxAge } },
            { ageGroupMax: { gte: minAge } },
          ],
        });
      }

      // Content matching interests
      if (interests.length > 0) {
        whereConditions.push({
          OR: interests.map(interest => ({
            tags: { contains: interest },
          })),
        });
      }

      // Preferred content types
      if (preferredContentTypes.length > 0 && !filters?.contentType) {
        whereConditions.push({
          contentType: { in: preferredContentTypes },
        });
      }

      // Challenge-based content
      if (challenges.length > 0) {
        whereConditions.push({
          OR: challenges.map(challenge => ({
            OR: [
              { title: { contains: challenge, mode: 'insensitive' } },
              { description: { contains: challenge, mode: 'insensitive' } },
              { tags: { contains: challenge } },
            ],
          })),
        });
      }

      // Apply filters
      if (filters?.contentType) {
        whereConditions.push({
          contentType: { in: filters.contentType },
        });
      }

      if (filters?.category) {
        whereConditions.push({
          category: { in: filters.category },
        });
      }

      // Get recently engaged content to avoid duplicates
      const recentEngagements = await prisma.contentEngagement.findMany({
        where: {
          userId: parentId,
          timestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        select: { contentId: true },
      });

      const recentContentIds = recentEngagements.map(e => e.contentId);

      // Find matching content
      const content = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          id: { notIn: recentContentIds },
          OR: whereConditions.length > 0 ? whereConditions : undefined,
        },
        orderBy: [
          { rating: 'desc' },
          { viewCount: 'desc' },
        ],
        take: filters?.limit || 20,
      });

      // Calculate recommendation scores
      const recommendations: ContentRecommendation[] = content.map(item => {
        let score = 0;
        let reasons: string[] = [];

        // Age relevance (40% weight)
        if (childrenAges.length > 0) {
          const isAgeAppropriate = childrenAges.some(age => 
            age >= item.ageGroupMin && age <= item.ageGroupMax
          );
          if (isAgeAppropriate) {
            score += 40;
            reasons.push('age-appropriate');
          }
        }

        // Interest matching (30% weight)
        const itemTags = JSON.parse(item.tags || '[]');
        const matchingInterests = interests.filter(interest => 
          itemTags.includes(interest)
        );
        if (matchingInterests.length > 0) {
          score += 30 * (matchingInterests.length / Math.max(interests.length, 1));
          reasons.push('matches interests');
        }

        // Content type preference (20% weight)
        if (preferredContentTypes.includes(item.contentType)) {
          score += 20;
          reasons.push('preferred format');
        }

        // Challenge relevance (15% weight)
        const challengeMatch = challenges.some(challenge =>
          item.title.toLowerCase().includes(challenge.toLowerCase()) ||
          item.description.toLowerCase().includes(challenge.toLowerCase()) ||
          itemTags.some((tag: string) => tag.toLowerCase().includes(challenge.toLowerCase()))
        );
        if (challengeMatch) {
          score += 15;
          reasons.push('addresses challenges');
        }

        // Quality boost (10% weight)
        score += item.rating * 2; // Rating is 0-5, so max 10 points

        // Determine priority
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (score >= 70) priority = 'high';
        else if (score >= 40) priority = 'medium';

        return {
          contentId: item.id,
          score,
          reason: reasons.join(', '),
          category: item.category,
          priority,
          generatedAt: new Date(),
        };
      });

      // Sort by score and filter by priority if specified
      let sortedRecommendations = recommendations.sort((a, b) => b.score - a.score);

      if (filters?.priority) {
        sortedRecommendations = sortedRecommendations.filter(r => r.priority === filters.priority);
      }

      const finalRecommendations = sortedRecommendations.slice(0, filters?.limit || 10);

      // Clear old recommendations and save new ones
      await prisma.contentRecommendation.deleteMany({
        where: { profileId: profile.id },
      });

      if (finalRecommendations.length > 0) {
        await prisma.contentRecommendation.createMany({
          data: finalRecommendations.map(rec => ({
            profileId: profile.id,
            contentId: rec.contentId,
            score: rec.score,
            reason: rec.reason,
            category: rec.category,
            priority: rec.priority,
          })),
        });
      }

      return finalRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Update engagement data for recommendation learning
   */
  static async updateEngagement(data: EngagementInput): Promise<void> {
    try {
      // Record engagement
      await prisma.contentEngagement.create({
        data: {
          userId: data.userId,
          contentId: data.contentId,
          eventType: data.eventType,
          duration: data.duration,
          metadata: JSON.stringify(data.metadata || {}),
          timestamp: new Date(),
        },
      });

      // Get content details
      const content = await prisma.parentingContent.findUnique({
        where: { id: data.contentId },
      });

      if (!content) {
        return;
      }

      // Update recommendation profile based on engagement
      const profile = await prisma.recommendationProfile.findUnique({
        where: { parentId: data.userId },
      });

      if (!profile) {
        return;
      }

      // Positive engagement signals
      const positiveEngagements = ['bookmark', 'share', 'complete', 'like'];
      const isPositive = positiveEngagements.includes(data.eventType);

      if (isPositive) {
        // Update interests based on content tags
        const currentInterests = JSON.parse(profile.interests) as string[];
        const contentTags = JSON.parse(content.tags || '[]') as string[];
        
        contentTags.forEach(tag => {
          if (!currentInterests.includes(tag)) {
            currentInterests.push(tag);
          }
        });

        // Update preferred content types
        const currentContentTypes = JSON.parse(profile.preferredContentTypes) as string[];
        if (!currentContentTypes.includes(content.contentType)) {
          currentContentTypes.push(content.contentType);
        }

        // Update profile
        await prisma.recommendationProfile.update({
          where: { parentId: data.userId },
          data: {
            interests: JSON.stringify(currentInterests.slice(-20)), // Keep last 20
            preferredContentTypes: JSON.stringify(currentContentTypes.slice(-10)), // Keep last 10
            lastUpdated: new Date(),
          },
        });
      }

      // Update recommendation click tracking
      if (data.eventType === 'click') {
        await prisma.contentRecommendation.updateMany({
          where: {
            profileId: profile.id,
            contentId: data.contentId,
          },
          data: {
            clickedAt: new Date(),
          },
        });
      }

      if (data.eventType === 'view') {
        await prisma.contentRecommendation.updateMany({
          where: {
            profileId: profile.id,
            contentId: data.contentId,
          },
          data: {
            viewedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error updating engagement:', error);
      // Don't throw error to avoid breaking the main engagement flow
    }
  }

  /**
   * Get personalized content feed
   */
  static async getPersonalizedFeed(
    parentId: string,
    limit: number = 10
  ) {
    try {
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
            take: limit,
          },
        },
      });

      if (!profile?.recommendations || profile.recommendations.length === 0) {
        // Generate recommendations if none exist
        await this.generateRecommendations(parentId);
        return this.getPersonalizedFeed(parentId, limit);
      }

      return profile.recommendations.map(rec => rec.content);
    } catch (error) {
      console.error('Error getting personalized feed:', error);
      throw new Error('Failed to get personalized feed');
    }
  }

  /**
   * Track recommendation accuracy
   */
  static async trackRecommendationAccuracy(
    parentId: string,
    contentId: string,
    feedback: number // 1-5 rating
  ): Promise<void> {
    try {
      // Find the recommendation
      const profile = await prisma.recommendationProfile.findUnique({
        where: { parentId },
      });

      if (!profile) {
        return;
      }

      // Update recommendation with feedback
      await prisma.contentRecommendation.updateMany({
        where: {
          profileId: profile.id,
          contentId,
        },
        data: {
          feedback,
          feedbackAt: new Date(),
        },
      });

      // TODO: Use feedback to improve recommendation algorithm
      console.log(`Recommendation feedback: ${feedback} for content ${contentId}`);
    } catch (error) {
      console.error('Error tracking recommendation accuracy:', error);
      // Don't throw to avoid breaking user flow
    }
  }

  /**
   * Get recommendation statistics
   */
  static async getRecommendationStats(parentId: string) {
    try {
      const profile = await prisma.recommendationProfile.findUnique({
        where: { parentId },
        include: {
          recommendations: true,
        },
      });

      if (!profile) {
        return null;
      }

      const totalRecommendations = profile.recommendations.length;
      const clickedRecommendations = profile.recommendations.filter(r => r.clickedAt).length;
      const viewedRecommendations = profile.recommendations.filter(r => r.viewedAt).length;
      const feedbackCount = profile.recommendations.filter(r => r.feedback).length;
      const averageFeedback = feedbackCount > 0 
        ? profile.recommendations
            .filter(r => r.feedback)
            .reduce((sum, r) => sum + (r.feedback || 0), 0) / feedbackCount
        : 0;

      return {
        totalRecommendations,
        clickedRecommendations,
        viewedRecommendations,
        clickThroughRate: totalRecommendations > 0 ? (clickedRecommendations / totalRecommendations) * 100 : 0,
        viewRate: totalRecommendations > 0 ? (viewedRecommendations / totalRecommendations) * 100 : 0,
        feedbackCount,
        averageFeedback,
        lastUpdated: profile.lastUpdated,
      };
    } catch (error) {
      console.error('Error getting recommendation stats:', error);
      throw new Error('Failed to get recommendation statistics');
    }
  }

  /**
   * Get similar parents for community recommendations
   */
  static async getSimilarParents(parentId: string, limit: number = 5) {
    try {
      const profile = await prisma.recommendationProfile.findUnique({
        where: { parentId },
      });

      if (!profile) {
        return [];
      }

      const childrenAges = JSON.parse(profile.childrenAges) as number[];
      const interests = JSON.parse(profile.interests) as string[];
      const parentingStyle = profile.parentingStyle;

      // Find parents with similar profiles
      const similarProfiles = await prisma.recommendationProfile.findMany({
        where: {
          parentId: { not: parentId },
          OR: [
            { parentingStyle },
            // Add more similarity criteria as needed
          ],
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        take: limit * 2, // Get more to filter by similarity
      });

      // Calculate similarity scores
      const scoredProfiles = similarProfiles.map(otherProfile => {
        const otherAges = JSON.parse(otherProfile.childrenAges) as number[];
        const otherInterests = JSON.parse(otherProfile.interests) as string[];
        
        let score = 0;
        
        // Age similarity (40% weight)
        const ageOverlap = childrenAges.some(age => 
          otherAges.some(otherAge => Math.abs(age - otherAge) <= 12) // Within 12 months
        );
        if (ageOverlap) score += 40;
        
        // Interest similarity (40% weight)
        const commonInterests = interests.filter(interest => 
          otherInterests.includes(interest)
        );
        if (commonInterests.length > 0) {
          score += 40 * (commonInterests.length / Math.max(interests.length, 1));
        }
        
        // Parenting style similarity (20% weight)
        if (otherProfile.parentingStyle === parentingStyle) {
          score += 20;
        }
        
        return {
          profile: otherProfile,
          score,
        };
      });

      // Return top similar parents
      return scoredProfiles
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(sp => sp.profile.parent);
    } catch (error) {
      console.error('Error getting similar parents:', error);
      throw new Error('Failed to get similar parents');
    }
  }
}