import { prisma } from '@/lib/prisma';
import { Expert, Consultation, Prisma } from '@prisma/client';
import { ExpertWithUser, ConsultationWithDetails, AvailabilitySlot } from '@/types/parenting';

/**
 * Expert Service for Digital Parenting Platform
 * Handles expert profiles, availability, and consultation management
 */

export interface CreateExpertInput {
  userId: string;
  specializations: string[];
  credentials: string[];
  bio: string;
  availability: AvailabilitySlot[];
  hourlyRate?: number;
  languages: string[];
}

export interface UpdateExpertInput {
  specializations?: string[];
  credentials?: string[];
  bio?: string;
  availability?: AvailabilitySlot[];
  hourlyRate?: number;
  languages?: string[];
  verified?: boolean;
}

export interface ScheduleConsultationInput {
  parentId: string;
  expertId: string;
  scheduledAt: Date;
  duration: number;
  topic: string;
  notes?: string;
}

export interface UpdateConsultationInput {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  summary?: string;
  actionItems?: string[];
  followUpNeeded?: boolean;
  rating?: number;
  feedback?: string;
}

export class ExpertService {
  /**
   * Create expert profile
   */
  static async createExpert(data: CreateExpertInput): Promise<ExpertWithUser> {
    try {
      const expert = await prisma.expert.create({
        data: {
          userId: data.userId,
          specializations: JSON.stringify(data.specializations),
          credentials: JSON.stringify(data.credentials),
          bio: data.bio,
          availability: JSON.stringify(data.availability),
          hourlyRate: data.hourlyRate,
          languages: JSON.stringify(data.languages),
          verified: false, // Requires admin approval
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return expert;
    } catch (error) {
      console.error('Error creating expert:', error);
      throw new Error('Failed to create expert profile');
    }
  }

  /**
   * Update expert profile
   */
  static async updateExpert(
    expertId: string,
    data: UpdateExpertInput
  ): Promise<ExpertWithUser> {
    try {
      const updateData: Prisma.ExpertUpdateInput = {};

      if (data.specializations !== undefined) {
        updateData.specializations = JSON.stringify(data.specializations);
      }
      if (data.credentials !== undefined) {
        updateData.credentials = JSON.stringify(data.credentials);
      }
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.availability !== undefined) {
        updateData.availability = JSON.stringify(data.availability);
      }
      if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate;
      if (data.languages !== undefined) {
        updateData.languages = JSON.stringify(data.languages);
      }
      if (data.verified !== undefined) updateData.verified = data.verified;

      const expert = await prisma.expert.update({
        where: { id: expertId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return expert;
    } catch (error) {
      console.error('Error updating expert:', error);
      throw new Error('Failed to update expert profile');
    }
  }

  /**
   * Get available experts with filtering
   */
  static async getAvailableExperts(
    specialization?: string,
    language?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ExpertWithUser[]> {
    try {
      const where: Prisma.ExpertWhereInput = {
        verified: true,
      };

      // Filter by specialization
      if (specialization) {
        where.specializations = {
          contains: specialization,
        };
      }

      // Filter by language
      if (language) {
        where.languages = {
          contains: language,
        };
      }

      const experts = await prisma.expert.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { verified: 'desc' },
        ],
        take: limit,
        skip: offset,
      });

      return experts;
    } catch (error) {
      console.error('Error fetching available experts:', error);
      throw new Error('Failed to fetch available experts');
    }
  }

  /**
   * Get expert by ID
   */
  static async getExpert(expertId: string): Promise<ExpertWithUser | null> {
    try {
      const expert = await prisma.expert.findUnique({
        where: { id: expertId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return expert;
    } catch (error) {
      console.error('Error fetching expert:', error);
      throw new Error('Failed to fetch expert');
    }
  }

  /**
   * Get expert by user ID
   */
  static async getExpertByUserId(userId: string): Promise<ExpertWithUser | null> {
    try {
      const expert = await prisma.expert.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return expert;
    } catch (error) {
      console.error('Error fetching expert by user ID:', error);
      throw new Error('Failed to fetch expert by user ID');
    }
  }

  /**
   * Check expert availability for a specific time slot
   */
  static async checkAvailability(
    expertId: string,
    scheduledAt: Date,
    duration: number
  ): Promise<boolean> {
    try {
      const expert = await this.getExpert(expertId);
      if (!expert) return false;

      // Parse availability slots
      const availability: AvailabilitySlot[] = JSON.parse(expert.availability || '[]');
      
      // Check if the requested time falls within available slots
      const dayOfWeek = scheduledAt.getDay();
      const timeString = scheduledAt.toTimeString().slice(0, 5); // HH:MM format
      
      const isAvailable = availability.some(slot => {
        return slot.dayOfWeek === dayOfWeek &&
               timeString >= slot.startTime &&
               timeString <= slot.endTime;
      });

      if (!isAvailable) return false;

      // Check for conflicting consultations
      const endTime = new Date(scheduledAt.getTime() + duration * 60000);
      
      const conflicts = await prisma.consultation.findMany({
        where: {
          expertId,
          status: {
            in: ['scheduled', 'in_progress'],
          },
          OR: [
            {
              AND: [
                { scheduledAt: { lte: scheduledAt } },
                { scheduledAt: { gte: new Date(scheduledAt.getTime() - duration * 60000) } },
              ],
            },
            {
              AND: [
                { scheduledAt: { gte: scheduledAt } },
                { scheduledAt: { lte: endTime } },
              ],
            },
          ],
        },
      });

      return conflicts.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  /**
   * Schedule consultation
   */
  static async scheduleConsultation(
    data: ScheduleConsultationInput
  ): Promise<ConsultationWithDetails> {
    try {
      // Check availability
      const isAvailable = await this.checkAvailability(
        data.expertId,
        data.scheduledAt,
        data.duration
      );

      if (!isAvailable) {
        throw new Error('Expert is not available at the requested time');
      }

      // Create consultation
      const consultation = await prisma.consultation.create({
        data: {
          parentId: data.parentId,
          expertId: data.expertId,
          scheduledAt: data.scheduledAt,
          duration: data.duration,
          topic: data.topic,
          notes: data.notes,
          status: 'scheduled',
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          expert: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // TODO: Send confirmation emails/notifications to both parties

      return consultation;
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      throw new Error('Failed to schedule consultation');
    }
  }

  /**
   * Update consultation
   */
  static async updateConsultation(
    consultationId: string,
    data: UpdateConsultationInput
  ): Promise<ConsultationWithDetails> {
    try {
      const updateData: Prisma.ConsultationUpdateInput = {};

      if (data.status !== undefined) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.summary !== undefined) updateData.summary = data.summary;
      if (data.actionItems !== undefined) {
        updateData.actionItems = JSON.stringify(data.actionItems);
      }
      if (data.followUpNeeded !== undefined) {
        updateData.followUpNeeded = data.followUpNeeded;
      }
      if (data.rating !== undefined) updateData.rating = data.rating;
      if (data.feedback !== undefined) updateData.feedback = data.feedback;

      const consultation = await prisma.consultation.update({
        where: { id: consultationId },
        data: updateData,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          expert: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Update expert rating if consultation is completed with rating
      if (data.status === 'completed' && data.rating) {
        await this.updateExpertRating(consultation.expertId);
      }

      return consultation;
    } catch (error) {
      console.error('Error updating consultation:', error);
      throw new Error('Failed to update consultation');
    }
  }

  /**
   * Get consultations for a user (parent or expert)
   */
  static async getConsultations(
    userId: string,
    role: 'parent' | 'expert' = 'parent',
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ConsultationWithDetails[]> {
    try {
      const where: Prisma.ConsultationWhereInput = {};

      if (role === 'parent') {
        where.parentId = userId;
      } else {
        // Find expert by user ID
        const expert = await this.getExpertByUserId(userId);
        if (!expert) return [];
        where.expertId = expert.id;
      }

      if (status) {
        where.status = status;
      }

      const consultations = await prisma.consultation.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          expert: {
            include: {
              user: {
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
          scheduledAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return consultations;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw new Error('Failed to fetch consultations');
    }
  }

  /**
   * Get consultation by ID
   */
  static async getConsultation(consultationId: string): Promise<ConsultationWithDetails | null> {
    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          expert: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return consultation;
    } catch (error) {
      console.error('Error fetching consultation:', error);
      throw new Error('Failed to fetch consultation');
    }
  }

  /**
   * Generate consultation summary using AI (placeholder)
   */
  static async generateConsultationSummary(consultationId: string): Promise<string> {
    try {
      const consultation = await this.getConsultation(consultationId);
      if (!consultation) {
        throw new Error('Consultation not found');
      }

      // TODO: Implement AI-powered summary generation
      // This would integrate with an AI service to analyze consultation notes
      // and generate a comprehensive summary with key points and action items

      const summary = `
Consultation Summary for ${consultation.topic}

Date: ${consultation.scheduledAt.toLocaleDateString()}
Duration: ${consultation.duration} minutes
Expert: ${consultation.expert.user.name}
Parent: ${consultation.parent.name}

Key Discussion Points:
${consultation.notes || 'No detailed notes available.'}

Recommended Actions:
${consultation.actionItems ? JSON.parse(consultation.actionItems).join('\n') : 'No specific action items recorded.'}

Follow-up Required: ${consultation.followUpNeeded ? 'Yes' : 'No'}
      `.trim();

      // Update consultation with generated summary
      await this.updateConsultation(consultationId, { summary });

      return summary;
    } catch (error) {
      console.error('Error generating consultation summary:', error);
      throw new Error('Failed to generate consultation summary');
    }
  }

  /**
   * Request follow-up consultation
   */
  static async requestFollowUp(consultationId: string): Promise<ConsultationWithDetails> {
    try {
      const originalConsultation = await this.getConsultation(consultationId);
      if (!originalConsultation) {
        throw new Error('Original consultation not found');
      }

      // Mark original consultation as needing follow-up
      const updatedConsultation = await this.updateConsultation(consultationId, {
        followUpNeeded: true,
      });

      // TODO: Create a new consultation request or notification for follow-up scheduling

      return updatedConsultation;
    } catch (error) {
      console.error('Error requesting follow-up:', error);
      throw new Error('Failed to request follow-up');
    }
  }

  /**
   * Update expert rating based on completed consultations
   */
  private static async updateExpertRating(expertId: string): Promise<void> {
    try {
      const consultations = await prisma.consultation.findMany({
        where: {
          expertId,
          status: 'completed',
          rating: { not: null },
        },
        select: {
          rating: true,
        },
      });

      if (consultations.length === 0) return;

      const totalRating = consultations.reduce((sum, c) => sum + (c.rating || 0), 0);
      const averageRating = totalRating / consultations.length;

      await prisma.expert.update({
        where: { id: expertId },
        data: { rating: averageRating },
      });
    } catch (error) {
      console.error('Error updating expert rating:', error);
      // Don't throw here to avoid breaking the main consultation update
    }
  }

  /**
   * Get expert statistics
   */
  static async getExpertStats(expertId: string) {
    try {
      const [totalConsultations, completedConsultations, averageRating, upcomingConsultations] = await Promise.all([
        prisma.consultation.count({
          where: { expertId },
        }),
        prisma.consultation.count({
          where: { expertId, status: 'completed' },
        }),
        prisma.consultation.aggregate({
          where: { expertId, status: 'completed', rating: { not: null } },
          _avg: { rating: true },
        }),
        prisma.consultation.count({
          where: {
            expertId,
            status: 'scheduled',
            scheduledAt: { gte: new Date() },
          },
        }),
      ]);

      return {
        totalConsultations,
        completedConsultations,
        averageRating: averageRating._avg.rating || 0,
        upcomingConsultations,
        completionRate: totalConsultations > 0 ? (completedConsultations / totalConsultations) * 100 : 0,
      };
    } catch (error) {
      console.error('Error fetching expert stats:', error);
      throw new Error('Failed to fetch expert statistics');
    }
  }
}