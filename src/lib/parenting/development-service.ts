import { prisma } from '@/lib/prisma';
import { DevelopmentMilestone, ChildDevelopmentProfile, MilestoneProgress, DevelopmentConcern } from '@/types/parenting';

/**
 * Child Development Tracking Service for Digital Parenting Platform
 * Handles milestone tracking, progress calculation, and development concerns
 */

export interface CreateChildProfileInput {
  childId: string;
}

export interface UpdateMilestoneInput {
  status: 'not_started' | 'in_progress' | 'achieved' | 'delayed';
  notes?: string;
  parentObservations?: string[];
  achievedAt?: Date;
}

export interface DevelopmentAssessmentResult {
  overallProgress: number;
  categoryProgress: Record<string, number>;
  totalMilestones: number;
  achievedMilestones: number;
  delayedMilestones: number;
  activeConcerns: number;
  recommendations: string[];
}

export class DevelopmentService {
  /**
   * Create a child development profile
   */
  static async createChildProfile(data: CreateChildProfileInput): Promise<ChildDevelopmentProfile> {
    try {
      // Get child's age to determine appropriate milestones
      const child = await prisma.child.findUnique({
        where: { id: data.childId },
      });

      if (!child) {
        throw new Error('Child not found');
      }

      const ageInMonths = Math.floor(
        (Date.now() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );

      // Create development profile
      const profile = await prisma.childDevelopmentProfile.create({
        data: {
          childId: data.childId,
          overallProgress: 0,
        },
      });

      // Get age-appropriate milestones
      const milestones = await this.getMilestonesForAge(ageInMonths);

      // Create milestone progress records
      if (milestones.length > 0) {
        const milestoneProgressData = milestones.map(milestone => ({
          profileId: profile.id,
          milestoneId: milestone.id,
          status: 'not_started' as const,
        }));

        await prisma.milestoneProgress.createMany({
          data: milestoneProgressData,
        });
      }

      return profile;
    } catch (error) {
      console.error('Error creating child development profile:', error);
      throw new Error('Failed to create child development profile');
    }
  }

  /**
   * Update milestone progress
   */
  static async updateMilestone(
    childId: string,
    milestoneId: string,
    progress: UpdateMilestoneInput
  ): Promise<void> {
    try {
      // Get development profile
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
      });

      if (!profile) {
        throw new Error('Development profile not found');
      }

      // Update milestone progress
      await prisma.milestoneProgress.upsert({
        where: {
          profileId_milestoneId: {
            profileId: profile.id,
            milestoneId,
          },
        },
        update: {
          status: progress.status,
          notes: progress.notes,
          parentObservations: JSON.stringify(progress.parentObservations || []),
          achievedAt: progress.status === 'achieved' ? (progress.achievedAt || new Date()) : null,
        },
        create: {
          profileId: profile.id,
          milestoneId,
          status: progress.status,
          notes: progress.notes,
          parentObservations: JSON.stringify(progress.parentObservations || []),
          achievedAt: progress.status === 'achieved' ? (progress.achievedAt || new Date()) : null,
        },
      });

      // Recalculate overall progress
      await this.calculateOverallProgress(profile.id);

      // Check for concerns if milestone is delayed
      if (progress.status === 'delayed') {
        await this.identifyAndCreateConcern(profile.id, milestoneId);
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw new Error('Failed to update milestone');
    }
  }

  /**
   * Get milestones for a specific age
   */
  static async getMilestonesForAge(ageInMonths: number): Promise<DevelopmentMilestone[]> {
    try {
      const milestones = await prisma.developmentMilestone.findMany({
        where: {
          ageMonthsMin: { lte: ageInMonths },
          ageMonthsMax: { gte: ageInMonths },
        },
        orderBy: [
          { category: 'asc' },
          { ageMonthsMin: 'asc' },
        ],
      });

      return milestones.map(milestone => ({
        ...milestone,
        indicators: JSON.parse(milestone.indicators || '[]'),
      }));
    } catch (error) {
      console.error('Error fetching milestones for age:', error);
      throw new Error('Failed to fetch milestones');
    }
  }

  /**
   * Assess child development
   */
  static async assessDevelopment(childId: string): Promise<DevelopmentAssessmentResult> {
    try {
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
        include: {
          milestones: {
            include: {
              milestone: true,
            },
          },
          concerns: {
            where: {
              status: 'active',
            },
          },
        },
      });

      if (!profile) {
        throw new Error('Development profile not found');
      }

      // Calculate progress by category
      const categoryProgress: Record<string, { achieved: number; total: number }> = {};
      
      profile.milestones.forEach(mp => {
        const category = mp.milestone.category;
        if (!categoryProgress[category]) {
          categoryProgress[category] = { achieved: 0, total: 0 };
        }
        categoryProgress[category].total++;
        if (mp.status === 'achieved') {
          categoryProgress[category].achieved++;
        }
      });

      // Generate assessment results
      const results: DevelopmentAssessmentResult = {
        overallProgress: profile.overallProgress,
        categoryProgress: Object.entries(categoryProgress).reduce((acc, [category, data]) => {
          acc[category] = data.total > 0 ? (data.achieved / data.total) * 100 : 0;
          return acc;
        }, {} as Record<string, number>),
        totalMilestones: profile.milestones.length,
        achievedMilestones: profile.milestones.filter(mp => mp.status === 'achieved').length,
        delayedMilestones: profile.milestones.filter(mp => mp.status === 'delayed').length,
        activeConcerns: profile.concerns.length,
        recommendations: await this.generateRecommendations(profile.id),
      };

      // Create assessment record
      await prisma.developmentAssessment.create({
        data: {
          profileId: profile.id,
          assessorId: 'system', // System-generated assessment
          results: JSON.stringify(results),
          score: profile.overallProgress,
          recommendations: JSON.stringify(results.recommendations),
        },
      });

      return results;
    } catch (error) {
      console.error('Error assessing development:', error);
      throw new Error('Failed to assess development');
    }
  }

  /**
   * Identify development concerns
   */
  static async identifyConcerns(childId: string): Promise<DevelopmentConcern[]> {
    try {
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
        include: {
          concerns: {
            where: {
              status: 'active',
            },
            orderBy: {
              severity: 'desc',
            },
          },
        },
      });

      if (!profile) {
        return [];
      }

      return profile.concerns;
    } catch (error) {
      console.error('Error identifying concerns:', error);
      throw new Error('Failed to identify concerns');
    }
  }

  /**
   * Generate progress report
   */
  static async generateProgressReport(childId: string) {
    try {
      const child = await prisma.child.findUnique({
        where: { id: childId },
      });

      if (!child) {
        throw new Error('Child not found');
      }

      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
        include: {
          milestones: {
            include: {
              milestone: true,
            },
            orderBy: {
              updatedAt: 'desc',
            },
          },
          concerns: {
            where: {
              status: 'active',
            },
          },
          assessments: {
            orderBy: {
              completedAt: 'desc',
            },
            take: 5,
          },
        },
      });

      if (!profile) {
        throw new Error('Development profile not found');
      }

      const ageInMonths = Math.floor(
        (Date.now() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );

      // Calculate achievements in the last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const recentAchievements = profile.milestones.filter(
        mp => mp.status === 'achieved' && mp.achievedAt && mp.achievedAt >= lastMonth
      );

      const report = {
        childId,
        childName: child.name,
        ageInMonths,
        overallProgress: profile.overallProgress,
        totalMilestones: profile.milestones.length,
        achievedMilestones: profile.milestones.filter(mp => mp.status === 'achieved').length,
        recentAchievements: recentAchievements.length,
        activeConcerns: profile.concerns.length,
        categoryBreakdown: this.calculateCategoryBreakdown(profile.milestones),
        recommendations: await this.generateRecommendations(profile.id),
        generatedAt: new Date(),
      };

      return report;
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw new Error('Failed to generate progress report');
    }
  }

  /**
   * Get recommended resources for concerns
   */
  static async getRecommendedResources(concerns: DevelopmentConcern[]) {
    try {
      if (concerns.length === 0) {
        return [];
      }

      // Extract categories and keywords from concerns
      const categories = [...new Set(concerns.map(c => c.category))];
      const keywords = concerns.flatMap(c => c.description.toLowerCase().split(' '));

      // Search for relevant parenting content
      const resources = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          OR: [
            { category: { in: categories } },
            { tags: { in: keywords } },
            { title: { in: keywords, mode: 'insensitive' } },
            { description: { in: keywords, mode: 'insensitive' } },
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
        orderBy: {
          rating: 'desc',
        },
        take: 10,
      });

      return resources;
    } catch (error) {
      console.error('Error getting recommended resources:', error);
      throw new Error('Failed to get recommended resources');
    }
  }

  /**
   * Get child development profile
   */
  static async getChildProfile(childId: string): Promise<ChildDevelopmentProfile | null> {
    try {
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
        include: {
          milestones: {
            include: {
              milestone: true,
            },
          },
          concerns: {
            where: {
              status: 'active',
            },
          },
        },
      });

      return profile;
    } catch (error) {
      console.error('Error fetching child development profile:', error);
      throw new Error('Failed to fetch child development profile');
    }
  }

  /**
   * Get milestone progress for a child
   */
  static async getMilestoneProgress(
    childId: string,
    category?: string
  ): Promise<MilestoneProgress[]> {
    try {
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
      });

      if (!profile) {
        throw new Error('Development profile not found');
      }

      const where: any = {
        profileId: profile.id,
      };

      if (category) {
        where.milestone = {
          category,
        };
      }

      const milestones = await prisma.milestoneProgress.findMany({
        where,
        include: {
          milestone: true,
        },
        orderBy: [
          { milestone: { category: 'asc' } },
          { milestone: { ageMonthsMin: 'asc' } },
        ],
      });

      return milestones;
    } catch (error) {
      console.error('Error fetching milestone progress:', error);
      throw new Error('Failed to fetch milestone progress');
    }
  }

  /**
   * Celebrate achievement
   */
  static async celebrateAchievement(childId: string, milestoneId: string): Promise<string> {
    try {
      const milestone = await prisma.developmentMilestone.findUnique({
        where: { id: milestoneId },
      });

      const child = await prisma.child.findUnique({
        where: { id: childId },
      });

      if (!milestone || !child) {
        throw new Error('Milestone or child not found');
      }

      // Generate celebration message
      const celebrationMessages = [
        `🎉 Congratulations! ${child.name} has achieved "${milestone.title}"! This is a wonderful milestone in their ${milestone.category} development.`,
        `🌟 Amazing progress! ${child.name} has successfully reached the "${milestone.title}" milestone. Keep up the great work!`,
        `🎊 Fantastic achievement! ${child.name} has mastered "${milestone.title}". This shows excellent growth in ${milestone.category} skills.`,
        `👏 Well done! ${child.name} has accomplished "${milestone.title}". This is an important step in their development journey.`,
      ];

      const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

      // TODO: Send notification to parent
      // TODO: Create achievement record

      return randomMessage;
    } catch (error) {
      console.error('Error celebrating achievement:', error);
      throw new Error('Failed to celebrate achievement');
    }
  }

  /**
   * Calculate overall progress for a profile
   */
  private static async calculateOverallProgress(profileId: string): Promise<void> {
    try {
      const milestones = await prisma.milestoneProgress.findMany({
        where: { profileId },
      });

      const achievedCount = milestones.filter(mp => mp.status === 'achieved').length;
      const totalCount = milestones.length;
      const progress = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

      await prisma.childDevelopmentProfile.update({
        where: { id: profileId },
        data: { overallProgress: progress },
      });
    } catch (error) {
      console.error('Error calculating overall progress:', error);
    }
  }

  /**
   * Identify and create development concern
   */
  private static async identifyAndCreateConcern(
    profileId: string,
    milestoneId: string
  ): Promise<void> {
    try {
      const milestone = await prisma.developmentMilestone.findUnique({
        where: { id: milestoneId },
      });

      if (!milestone) {
        return;
      }

      // Check if concern already exists
      const existingConcern = await prisma.developmentConcern.findFirst({
        where: {
          profileId,
          category: milestone.category,
          status: 'active',
        },
      });

      if (existingConcern) {
        return; // Concern already exists
      }

      // Create new concern
      await prisma.developmentConcern.create({
        data: {
          profileId,
          category: milestone.category,
          description: `Delayed milestone: ${milestone.title}`,
          severity: milestone.isRequired ? 'high' : 'medium',
          status: 'active',
        },
      });
    } catch (error) {
      console.error('Error creating development concern:', error);
    }
  }

  /**
   * Generate recommendations based on profile
   */
  private static async generateRecommendations(profileId: string): Promise<string[]> {
    try {
      const profile = await prisma.childDevelopmentProfile.findUnique({
        where: { id: profileId },
        include: {
          milestones: {
            include: {
              milestone: true,
            },
          },
          concerns: {
            where: {
              status: 'active',
            },
          },
        },
      });

      if (!profile) {
        return [];
      }

      const recommendations: string[] = [];

      // Recommendations based on delayed milestones
      const delayedMilestones = profile.milestones.filter(mp => mp.status === 'delayed');
      if (delayedMilestones.length > 0) {
        const categories = [...new Set(delayedMilestones.map(mp => mp.milestone.category))];
        categories.forEach(category => {
          recommendations.push(
            `Focus on ${category} development activities to help catch up on delayed milestones`
          );
        });
      }

      // Recommendations based on concerns
      if (profile.concerns.length > 0) {
        recommendations.push('Consider consulting with a pediatric development specialist');
        
        const highSeverityConcerns = profile.concerns.filter(c => c.severity === 'high');
        if (highSeverityConcerns.length > 0) {
          recommendations.push('Schedule an appointment with your pediatrician to discuss development concerns');
        }
      }

      // General recommendations based on progress
      if (profile.overallProgress < 50) {
        recommendations.push('Increase structured play and learning activities');
        recommendations.push('Create a daily routine that includes developmental activities');
      } else if (profile.overallProgress > 80) {
        recommendations.push('Continue current activities and introduce new challenges');
        recommendations.push('Consider advanced activities to further stimulate development');
      }

      // Age-appropriate activity recommendations
      const inProgressMilestones = profile.milestones.filter(mp => mp.status === 'in_progress');
      if (inProgressMilestones.length > 0) {
        recommendations.push('Continue practicing activities related to milestones in progress');
      }

      return recommendations.slice(0, 5); // Limit to 5 recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate category breakdown
   */
  private static calculateCategoryBreakdown(milestones: any[]): Record<string, number> {
    const categories: Record<string, { achieved: number; total: number }> = {};
    
    milestones.forEach(mp => {
      const category = mp.milestone.category;
      if (!categories[category]) {
        categories[category] = { achieved: 0, total: 0 };
      }
      categories[category].total++;
      if (mp.status === 'achieved') {
        categories[category].achieved++;
      }
    });

    return Object.entries(categories).reduce((acc, [category, data]) => {
      acc[category] = data.total > 0 ? (data.achieved / data.total) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);
  }
}