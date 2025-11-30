import { prisma } from '@/lib/prisma';

/**
 * SKIDS Integration Service for Digital Parenting Platform
 * Handles data synchronization between SKIDS and Digital Parenting platforms
 */

export interface ChildProfileSync {
  skidsChildId: string;
  parentingChildId: string;
  name: string;
  dateOfBirth: Date;
  healthConditions?: string[];
  medications?: string[];
  allergies?: string[];
  lastSyncAt: Date;
}

export interface HealthDataSync {
  childId: string;
  healthMetrics: {
    height?: number;
    weight?: number;
    bmi?: number;
    bloodPressure?: string;
    heartRate?: number;
  };
  conditions: string[];
  medications: string[];
  appointments: AppointmentSync[];
  lastUpdated: Date;
}

export interface AppointmentSync {
  skidsAppointmentId: string;
  childId: string;
  providerId: string;
  scheduledAt: Date;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  preparationMaterials?: string[];
}

export interface RecommendationUpdate {
  childId: string;
  healthConditions: string[];
  recommendedContent: string[];
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export class SKIDSIntegrationService {
  /**
   * Sync child profiles between SKIDS and Digital Parenting
   */
  static async syncChildProfiles(parentId: string): Promise<ChildProfileSync[]> {
    try {
      // Get existing children from Digital Parenting platform
      const parentingChildren = await prisma.child.findMany({
        where: {
          parentProfile: {
            userId: parentId,
          },
        },
      });

      // TODO: Fetch children from SKIDS API
      // This would be replaced with actual SKIDS API call
      const skidsChildren = await this.fetchSKIDSChildren(parentId);

      const syncResults: ChildProfileSync[] = [];

      for (const skidsChild of skidsChildren) {
        // Find matching child in parenting platform
        let parentingChild = parentingChildren.find(
          child => child.name === skidsChild.name && 
          Math.abs(child.dateOfBirth.getTime() - skidsChild.dateOfBirth.getTime()) < 86400000 // 1 day tolerance
        );

        if (!parentingChild) {
          // Create new child in parenting platform
          const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId: parentId },
          });

          if (parentProfile) {
            parentingChild = await prisma.child.create({
              data: {
                parentProfileId: parentProfile.id,
                name: skidsChild.name,
                dateOfBirth: skidsChild.dateOfBirth,
                healthConditions: JSON.stringify(skidsChild.healthConditions || []),
                medications: JSON.stringify(skidsChild.medications || []),
                allergies: JSON.stringify(skidsChild.allergies || []),
              },
            });
          }
        } else {
          // Update existing child with SKIDS data
          await prisma.child.update({
            where: { id: parentingChild.id },
            data: {
              healthConditions: JSON.stringify(skidsChild.healthConditions || []),
              medications: JSON.stringify(skidsChild.medications || []),
              allergies: JSON.stringify(skidsChild.allergies || []),
            },
          });
        }

        if (parentingChild) {
          syncResults.push({
            skidsChildId: skidsChild.id,
            parentingChildId: parentingChild.id,
            name: skidsChild.name,
            dateOfBirth: skidsChild.dateOfBirth,
            healthConditions: skidsChild.healthConditions,
            medications: skidsChild.medications,
            allergies: skidsChild.allergies,
            lastSyncAt: new Date(),
          });
        }
      }

      return syncResults;
    } catch (error) {
      console.error('Error syncing child profiles:', error);
      throw new Error('Failed to sync child profiles');
    }
  }

  /**
   * Import health data from SKIDS
   */
  static async importHealthData(childId: string): Promise<HealthDataSync> {
    try {
      // TODO: Fetch health data from SKIDS API
      const skidsHealthData = await this.fetchSKIDSHealthData(childId);

      // Update child record with health data
      await prisma.child.update({
        where: { id: childId },
        data: {
          healthConditions: JSON.stringify(skidsHealthData.conditions),
          medications: JSON.stringify(skidsHealthData.medications),
          healthMetrics: JSON.stringify(skidsHealthData.healthMetrics),
        },
      });

      // Create health data record
      await prisma.healthData.upsert({
        where: { childId },
        update: {
          metrics: JSON.stringify(skidsHealthData.healthMetrics),
          conditions: JSON.stringify(skidsHealthData.conditions),
          medications: JSON.stringify(skidsHealthData.medications),
          lastUpdated: new Date(),
        },
        create: {
          childId,
          metrics: JSON.stringify(skidsHealthData.healthMetrics),
          conditions: JSON.stringify(skidsHealthData.conditions),
          medications: JSON.stringify(skidsHealthData.medications),
          lastUpdated: new Date(),
        },
      });

      return skidsHealthData;
    } catch (error) {
      console.error('Error importing health data:', error);
      throw new Error('Failed to import health data');
    }
  }

  /**
   * Sync appointments between platforms
   */
  static async syncAppointments(childId: string): Promise<AppointmentSync[]> {
    try {
      // TODO: Fetch appointments from SKIDS API
      const skidsAppointments = await this.fetchSKIDSAppointments(childId);

      const syncResults: AppointmentSync[] = [];

      for (const skidsAppointment of skidsAppointments) {
        // Create or update appointment in parenting platform
        await prisma.appointment.upsert({
          where: {
            skidsAppointmentId: skidsAppointment.skidsAppointmentId,
          },
          update: {
            scheduledAt: skidsAppointment.scheduledAt,
            type: skidsAppointment.type,
            status: skidsAppointment.status,
            notes: skidsAppointment.notes,
          },
          create: {
            childId,
            skidsAppointmentId: skidsAppointment.skidsAppointmentId,
            providerId: skidsAppointment.providerId,
            scheduledAt: skidsAppointment.scheduledAt,
            type: skidsAppointment.type,
            status: skidsAppointment.status,
            notes: skidsAppointment.notes,
          },
        });

        syncResults.push(skidsAppointment);
      }

      return syncResults;
    } catch (error) {
      console.error('Error syncing appointments:', error);
      throw new Error('Failed to sync appointments');
    }
  }

  /**
   * Update parenting recommendations based on health data
   */
  static async updateParentingRecommendations(childId: string): Promise<RecommendationUpdate> {
    try {
      // Get child's health data
      const child = await prisma.child.findUnique({
        where: { id: childId },
      });

      if (!child) {
        throw new Error('Child not found');
      }

      const healthConditions = JSON.parse(child.healthConditions || '[]');
      const medications = JSON.parse(child.medications || '[]');

      // Find relevant parenting content based on health conditions
      const relevantContent = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          OR: [
            ...healthConditions.map((condition: string) => ({
              tags: { contains: condition.toLowerCase() },
            })),
            ...healthConditions.map((condition: string) => ({
              title: { contains: condition, mode: 'insensitive' as const },
            })),
            ...healthConditions.map((condition: string) => ({
              description: { contains: condition, mode: 'insensitive' as const },
            })),
          ],
        },
        orderBy: {
          rating: 'desc',
        },
        take: 10,
      });

      // Determine priority based on health conditions
      const highPriorityConditions = ['diabetes', 'asthma', 'adhd', 'autism', 'allergies'];
      const hasHighPriorityCondition = healthConditions.some((condition: string) =>
        highPriorityConditions.some(hpc => condition.toLowerCase().includes(hpc))
      );

      const priority = hasHighPriorityCondition ? 'high' : 'medium';

      // Update recommendation profile
      const parentProfile = await prisma.parentProfile.findFirst({
        where: {
          children: {
            some: { id: childId },
          },
        },
      });

      if (parentProfile) {
        const profile = await prisma.recommendationProfile.findUnique({
          where: { parentId: parentProfile.userId },
        });

        if (profile) {
          const currentChallenges = JSON.parse(profile.challenges || '[]');
          const updatedChallenges = [...new Set([...currentChallenges, ...healthConditions])];

          await prisma.recommendationProfile.update({
            where: { parentId: parentProfile.userId },
            data: {
              challenges: JSON.stringify(updatedChallenges),
              lastUpdated: new Date(),
            },
          });
        }
      }

      const recommendationUpdate: RecommendationUpdate = {
        childId,
        healthConditions,
        recommendedContent: relevantContent.map(c => c.id),
        priority,
        reason: `Health-based recommendations for conditions: ${healthConditions.join(', ')}`,
      };

      return recommendationUpdate;
    } catch (error) {
      console.error('Error updating parenting recommendations:', error);
      throw new Error('Failed to update parenting recommendations');
    }
  }

  /**
   * Deliver appointment preparation materials
   */
  static async deliverAppointmentPreparationMaterials(appointmentId: string): Promise<string[]> {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          child: true,
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Find relevant preparation materials based on appointment type
      const preparationContent = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          OR: [
            { tags: { contains: appointment.type.toLowerCase() } },
            { tags: { contains: 'appointment preparation' } },
            { title: { contains: 'appointment', mode: 'insensitive' } },
            { title: { contains: appointment.type, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          rating: 'desc',
        },
        take: 5,
      });

      // Create preparation material records
      const materialIds: string[] = [];
      for (const content of preparationContent) {
        const material = await prisma.appointmentPreparationMaterial.create({
          data: {
            appointmentId,
            contentId: content.id,
            deliveredAt: new Date(),
          },
        });
        materialIds.push(material.id);
      }

      // TODO: Send notification to parent about preparation materials
      console.log(`Delivered ${materialIds.length} preparation materials for appointment ${appointmentId}`);

      return materialIds;
    } catch (error) {
      console.error('Error delivering appointment preparation materials:', error);
      throw new Error('Failed to deliver appointment preparation materials');
    }
  }

  /**
   * Sync progress data back to SKIDS
   */
  static async syncProgressDataToSKIDS(childId: string): Promise<void> {
    try {
      // Get development progress from parenting platform
      const developmentProfile = await prisma.childDevelopmentProfile.findUnique({
        where: { childId },
        include: {
          milestones: {
            include: {
              milestone: true,
            },
          },
          assessments: {
            orderBy: {
              completedAt: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!developmentProfile) {
        return;
      }

      // Prepare progress data for SKIDS
      const progressData = {
        childId,
        overallProgress: developmentProfile.overallProgress,
        achievedMilestones: developmentProfile.milestones.filter(m => m.status === 'achieved').length,
        totalMilestones: developmentProfile.milestones.length,
        latestAssessment: developmentProfile.assessments[0] || null,
        lastUpdated: new Date(),
      };

      // TODO: Send progress data to SKIDS API
      await this.sendProgressToSKIDS(progressData);

      console.log(`Synced progress data for child ${childId} to SKIDS`);
    } catch (error) {
      console.error('Error syncing progress data to SKIDS:', error);
      throw new Error('Failed to sync progress data to SKIDS');
    }
  }

  /**
   * Mock SKIDS API calls (to be replaced with actual API integration)
   */
  private static async fetchSKIDSChildren(parentId: string): Promise<any[]> {
    // TODO: Replace with actual SKIDS API call
    return [
      {
        id: 'skids-child-1',
        name: 'Sample Child',
        dateOfBirth: new Date('2020-01-01'),
        healthConditions: ['asthma'],
        medications: ['inhaler'],
        allergies: ['peanuts'],
      },
    ];
  }

  private static async fetchSKIDSHealthData(childId: string): Promise<HealthDataSync> {
    // TODO: Replace with actual SKIDS API call
    return {
      childId,
      healthMetrics: {
        height: 120,
        weight: 25,
        bmi: 17.4,
      },
      conditions: ['asthma'],
      medications: ['inhaler'],
      appointments: [],
      lastUpdated: new Date(),
    };
  }

  private static async fetchSKIDSAppointments(childId: string): Promise<AppointmentSync[]> {
    // TODO: Replace with actual SKIDS API call
    return [
      {
        skidsAppointmentId: 'skids-appt-1',
        childId,
        providerId: 'provider-1',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        type: 'checkup',
        status: 'scheduled',
        notes: 'Regular checkup',
        preparationMaterials: [],
      },
    ];
  }

  private static async sendProgressToSKIDS(progressData: any): Promise<void> {
    // TODO: Replace with actual SKIDS API call
    console.log('Sending progress data to SKIDS:', progressData);
  }
}