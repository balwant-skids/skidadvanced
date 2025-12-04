import { prisma } from '@/lib/prisma';

/**
 * Content Workflow Service for Digital Parenting Platform
 * Handles content approval processes, freshness monitoring, and distribution
 */

export interface ContentApprovalWorkflow {
  contentId: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';
  reviewerId?: string;
  reviewNotes?: string;
  approvedAt?: Date;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
}

export interface ContentFreshnessCheck {
  contentId: string;
  title: string;
  lastUpdated: Date;
  daysSinceUpdate: number;
  category: string;
  isStale: boolean;
  recommendedAction: 'review' | 'update' | 'archive';
}

export interface ContentDistribution {
  contentId: string;
  targetAudience: string[];
  distributionChannels: string[];
  scheduledAt?: Date;
  status: 'scheduled' | 'distributed' | 'failed';
}

export interface BulkOperation {
  operationType: 'approve' | 'reject' | 'publish' | 'archive' | 'update_category';
  contentIds: string[];
  parameters?: Record<string, any>;
  executedBy: string;
  executedAt: Date;
  results: { contentId: string; success: boolean; error?: string }[];
}

export class ContentWorkflowService {
  /**
   * Submit content for approval
   */
  static async submitForApproval(contentId: string, submitterId: string): Promise<ContentApprovalWorkflow> {
    try {
      // Update content status
      await prisma.parentingContent.update({
        where: { id: contentId },
        data: { status: 'pending_review' },
      });

      // Create workflow record
      const workflow = await prisma.contentWorkflow.create({
        data: {
          contentId,
          status: 'pending_review',
          submitterId,
          submittedAt: new Date(),
        },
      });

      // TODO: Notify reviewers
      await this.notifyReviewers(contentId);

      return {
        contentId: workflow.contentId,
        status: workflow.status as any,
        reviewerId: workflow.reviewerId || undefined,
        reviewNotes: workflow.reviewNotes || undefined,
        approvedAt: workflow.approvedAt || undefined,
        publishedAt: workflow.publishedAt || undefined,
        scheduledPublishAt: workflow.scheduledPublishAt || undefined,
      };
    } catch (error) {
      console.error('Error submitting content for approval:', error);
      throw new Error('Failed to submit content for approval');
    }
  }

  /**
   * Approve content
   */
  static async approveContent(
    contentId: string,
    reviewerId: string,
    reviewNotes?: string,
    scheduledPublishAt?: Date
  ): Promise<ContentApprovalWorkflow> {
    try {
      const approvedAt = new Date();
      const publishedAt = scheduledPublishAt ? undefined : approvedAt;
      const status = scheduledPublishAt ? 'approved' : 'published';

      // Update content status
      await prisma.parentingContent.update({
        where: { id: contentId },
        data: { 
          status: status as any,
          publishedAt,
        },
      });

      // Update workflow
      const workflow = await prisma.contentWorkflow.update({
        where: { contentId },
        data: {
          status: status as any,
          reviewerId,
          reviewNotes,
          approvedAt,
          publishedAt,
          scheduledPublishAt,
        },
      });

      // Schedule publication if needed
      if (scheduledPublishAt) {
        await this.schedulePublication(contentId, scheduledPublishAt);
      }

      // Notify content author
      await this.notifyContentAuthor(contentId, 'approved');

      return {
        contentId: workflow.contentId,
        status: workflow.status as any,
        reviewerId: workflow.reviewerId || undefined,
        reviewNotes: workflow.reviewNotes || undefined,
        approvedAt: workflow.approvedAt || undefined,
        publishedAt: workflow.publishedAt || undefined,
        scheduledPublishAt: workflow.scheduledPublishAt || undefined,
      };
    } catch (error) {
      console.error('Error approving content:', error);
      throw new Error('Failed to approve content');
    }
  }

  /**
   * Reject content
   */
  static async rejectContent(
    contentId: string,
    reviewerId: string,
    reviewNotes: string
  ): Promise<ContentApprovalWorkflow> {
    try {
      // Update content status
      await prisma.parentingContent.update({
        where: { id: contentId },
        data: { status: 'draft' },
      });

      // Update workflow
      const workflow = await prisma.contentWorkflow.update({
        where: { contentId },
        data: {
          status: 'rejected',
          reviewerId,
          reviewNotes,
          rejectedAt: new Date(),
        },
      });

      // Notify content author
      await this.notifyContentAuthor(contentId, 'rejected', reviewNotes);

      return {
        contentId: workflow.contentId,
        status: workflow.status as any,
        reviewerId: workflow.reviewerId || undefined,
        reviewNotes: workflow.reviewNotes || undefined,
        approvedAt: workflow.approvedAt || undefined,
        publishedAt: workflow.publishedAt || undefined,
        scheduledPublishAt: workflow.scheduledPublishAt || undefined,
      };
    } catch (error) {
      console.error('Error rejecting content:', error);
      throw new Error('Failed to reject content');
    }
  }

  /**
   * Monitor content freshness
   */
  static async monitorContentFreshness(): Promise<ContentFreshnessCheck[]> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const content = await prisma.parentingContent.findMany({
        where: {
          status: 'published',
          updatedAt: { lt: sixMonthsAgo },
        },
        select: {
          id: true,
          title: true,
          category: true,
          updatedAt: true,
        },
      });

      const freshnessChecks: ContentFreshnessCheck[] = content.map(item => {
        const daysSinceUpdate = Math.floor(
          (Date.now() - item.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        let recommendedAction: 'review' | 'update' | 'archive' = 'review';
        let isStale = false;

        if (daysSinceUpdate > 365) {
          recommendedAction = 'archive';
          isStale = true;
        } else if (daysSinceUpdate > 180) {
          recommendedAction = 'update';
          isStale = true;
        }

        return {
          contentId: item.id,
          title: item.title,
          lastUpdated: item.updatedAt,
          daysSinceUpdate,
          category: item.category,
          isStale,
          recommendedAction,
        };
      });

      // Create freshness alerts for stale content
      const staleContent = freshnessChecks.filter(fc => fc.isStale);
      if (staleContent.length > 0) {
        await this.createFreshnessAlerts(staleContent);
      }

      return freshnessChecks;
    } catch (error) {
      console.error('Error monitoring content freshness:', error);
      throw new Error('Failed to monitor content freshness');
    }
  }

  /**
   * Schedule content publication
   */
  static async schedulePublication(contentId: string, publishAt: Date): Promise<void> {
    try {
      await prisma.scheduledPublication.create({
        data: {
          contentId,
          publishAt,
          status: 'scheduled',
        },
      });

      console.log(`Scheduled publication for content ${contentId} at ${publishAt}`);
    } catch (error) {
      console.error('Error scheduling publication:', error);
      throw new Error('Failed to schedule publication');
    }
  }

  /**
   * Process scheduled publications
   */
  static async processScheduledPublications(): Promise<void> {
    try {
      const now = new Date();
      
      const scheduledPublications = await prisma.scheduledPublication.findMany({
        where: {
          publishAt: { lte: now },
          status: 'scheduled',
        },
        include: {
          content: true,
        },
      });

      for (const publication of scheduledPublications) {
        try {
          // Publish content
          await prisma.parentingContent.update({
            where: { id: publication.contentId },
            data: {
              status: 'published',
              publishedAt: now,
            },
          });

          // Update workflow
          await prisma.contentWorkflow.update({
            where: { contentId: publication.contentId },
            data: {
              status: 'published',
              publishedAt: now,
            },
          });

          // Mark publication as completed
          await prisma.scheduledPublication.update({
            where: { id: publication.id },
            data: { status: 'completed' },
          });

          // Distribute content
          await this.distributeContent(publication.contentId);

          console.log(`Published scheduled content: ${publication.contentId}`);
        } catch (error) {
          console.error(`Error publishing scheduled content ${publication.contentId}:`, error);
          
          // Mark as failed
          await prisma.scheduledPublication.update({
            where: { id: publication.id },
            data: { status: 'failed' },
          });
        }
      }
    } catch (error) {
      console.error('Error processing scheduled publications:', error);
      throw new Error('Failed to process scheduled publications');
    }
  }

  /**
   * Distribute content to target audiences
   */
  static async distributeContent(contentId: string): Promise<ContentDistribution> {
    try {
      const content = await prisma.parentingContent.findUnique({
        where: { id: contentId },
      });

      if (!content) {
        throw new Error('Content not found');
      }

      // Determine target audience based on content attributes
      const targetAudience = await this.determineTargetAudience(content);

      // Determine distribution channels
      const distributionChannels = ['email', 'push_notification', 'in_app'];

      // Create distribution record
      const distribution = await prisma.contentDistribution.create({
        data: {
          contentId,
          targetAudience: JSON.stringify(targetAudience),
          distributionChannels: JSON.stringify(distributionChannels),
          status: 'distributed',
          distributedAt: new Date(),
        },
      });

      // Send notifications to target audience
      await this.sendDistributionNotifications(contentId, targetAudience, distributionChannels);

      return {
        contentId: distribution.contentId,
        targetAudience,
        distributionChannels,
        status: distribution.status as any,
      };
    } catch (error) {
      console.error('Error distributing content:', error);
      throw new Error('Failed to distribute content');
    }
  }

  /**
   * Perform bulk operations on content
   */
  static async performBulkOperation(
    operationType: 'approve' | 'reject' | 'publish' | 'archive' | 'update_category',
    contentIds: string[],
    executedBy: string,
    parameters?: Record<string, any>
  ): Promise<BulkOperation> {
    try {
      const results: { contentId: string; success: boolean; error?: string }[] = [];

      for (const contentId of contentIds) {
        try {
          switch (operationType) {
            case 'approve':
              await this.approveContent(contentId, executedBy);
              break;
            case 'reject':
              await this.rejectContent(contentId, executedBy, parameters?.reason || 'Bulk rejection');
              break;
            case 'publish':
              await prisma.parentingContent.update({
                where: { id: contentId },
                data: { status: 'published', publishedAt: new Date() },
              });
              break;
            case 'archive':
              await prisma.parentingContent.update({
                where: { id: contentId },
                data: { status: 'archived' },
              });
              break;
            case 'update_category':
              if (parameters?.category) {
                await prisma.parentingContent.update({
                  where: { id: contentId },
                  data: { category: parameters.category },
                });
              }
              break;
          }

          results.push({ contentId, success: true });
        } catch (error) {
          results.push({ 
            contentId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      // Record bulk operation
      const bulkOperation = await prisma.bulkOperation.create({
        data: {
          operationType,
          contentIds: JSON.stringify(contentIds),
          parameters: JSON.stringify(parameters || {}),
          executedBy,
          executedAt: new Date(),
          results: JSON.stringify(results),
        },
      });

      return {
        operationType,
        contentIds,
        parameters,
        executedBy,
        executedAt: bulkOperation.executedAt,
        results,
      };
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw new Error('Failed to perform bulk operation');
    }
  }

  /**
   * Get content workflow status
   */
  static async getWorkflowStatus(contentId: string): Promise<ContentApprovalWorkflow | null> {
    try {
      const workflow = await prisma.contentWorkflow.findUnique({
        where: { contentId },
      });

      if (!workflow) {
        return null;
      }

      return {
        contentId: workflow.contentId,
        status: workflow.status as any,
        reviewerId: workflow.reviewerId || undefined,
        reviewNotes: workflow.reviewNotes || undefined,
        approvedAt: workflow.approvedAt || undefined,
        publishedAt: workflow.publishedAt || undefined,
        scheduledPublishAt: workflow.scheduledPublishAt || undefined,
      };
    } catch (error) {
      console.error('Error getting workflow status:', error);
      throw new Error('Failed to get workflow status');
    }
  }

  /**
   * Private helper methods
   */
  private static async notifyReviewers(contentId: string): Promise<void> {
    // TODO: Implement reviewer notification logic
    console.log(`Notifying reviewers about content ${contentId}`);
  }

  private static async notifyContentAuthor(
    contentId: string, 
    action: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    // TODO: Implement author notification logic
    console.log(`Notifying author about ${action} content ${contentId}`, notes);
  }

  private static async createFreshnessAlerts(staleContent: ContentFreshnessCheck[]): Promise<void> {
    try {
      const alerts = staleContent.map(content => ({
        contentId: content.contentId,
        alertType: 'content_freshness',
        message: `Content "${content.title}" is ${content.daysSinceUpdate} days old and may need ${content.recommendedAction}`,
        severity: content.recommendedAction === 'archive' ? 'high' : 'medium',
        createdAt: new Date(),
      }));

      await prisma.contentAlert.createMany({
        data: alerts,
      });
    } catch (error) {
      console.error('Error creating freshness alerts:', error);
    }
  }

  private static async determineTargetAudience(content: any): Promise<string[]> {
    // Simple audience targeting based on content attributes
    const audience: string[] = [];

    // Age-based targeting
    if (content.ageGroupMin <= 12) audience.push('new_parents');
    if (content.ageGroupMin >= 12 && content.ageGroupMax <= 60) audience.push('toddler_parents');
    if (content.ageGroupMin >= 60) audience.push('school_age_parents');

    // Category-based targeting
    if (content.category === 'health') audience.push('health_focused_parents');
    if (content.category === 'education') audience.push('education_focused_parents');

    return audience.length > 0 ? audience : ['all_parents'];
  }

  private static async sendDistributionNotifications(
    contentId: string,
    targetAudience: string[],
    distributionChannels: string[]
  ): Promise<void> {
    // TODO: Implement actual notification sending
    console.log(`Sending notifications for content ${contentId} to ${targetAudience.join(', ')} via ${distributionChannels.join(', ')}`);
  }
}