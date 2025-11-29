/**
 * Notification Trigger Functions
 * Called when specific events occur to send push notifications
 */

import { prisma } from '@/lib/prisma';
import {
  sendToUser,
  sendToTopic,
  NotificationPayload,
  NotificationTypes,
  TopicNames,
} from '@/lib/notifications';

/**
 * Notify parent when a new report is uploaded for their child
 */
export async function notifyReportUploaded(
  childId: string,
  reportTitle: string,
  uploadedByName: string
): Promise<void> {
  try {
    // Get child with parent info
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        parent: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!child || !child.parent.user.fcmToken) {
      console.log('No FCM token for parent, skipping notification');
      return;
    }

    const payload: NotificationPayload = {
      title: 'New Report Available',
      body: `${uploadedByName} uploaded "${reportTitle}" for ${child.name}`,
      data: {
        type: NotificationTypes.NEW_REPORT,
        childId,
        link: `/dashboard/children/${childId}/reports`,
      },
    };

    await sendToUser(child.parent.user.fcmToken, payload);
  } catch (error) {
    console.error('Failed to send report notification:', error);
  }
}


/**
 * Notify user when they receive a new message
 */
export async function notifyNewMessage(
  recipientUserId: string,
  senderName: string,
  messagePreview: string
): Promise<void> {
  try {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientUserId },
    });

    if (!recipient?.fcmToken) {
      console.log('No FCM token for recipient, skipping notification');
      return;
    }

    const payload: NotificationPayload = {
      title: `Message from ${senderName}`,
      body: messagePreview.length > 100 
        ? messagePreview.substring(0, 97) + '...' 
        : messagePreview,
      data: {
        type: NotificationTypes.NEW_MESSAGE,
        link: '/dashboard/messages',
      },
    };

    await sendToUser(recipient.fcmToken, payload);
  } catch (error) {
    console.error('Failed to send message notification:', error);
  }
}

/**
 * Notify parent about upcoming appointment
 */
export async function notifyAppointmentReminder(
  appointmentId: string
): Promise<void> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        child: {
          include: {
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!appointment || !appointment.child.parent.user.fcmToken) {
      console.log('No FCM token for parent, skipping notification');
      return;
    }

    const scheduledDate = new Date(appointment.scheduledAt);
    const formattedDate = scheduledDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = scheduledDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const payload: NotificationPayload = {
      title: 'Appointment Reminder',
      body: `${appointment.title || appointment.type} for ${appointment.child.name} on ${formattedDate} at ${formattedTime}`,
      data: {
        type: NotificationTypes.APPOINTMENT_REMINDER,
        appointmentId,
        childId: appointment.childId,
        link: '/dashboard/appointments',
      },
    };

    await sendToUser(appointment.child.parent.user.fcmToken, payload);

    // Mark reminder as sent
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { reminderSent: true },
    });
  } catch (error) {
    console.error('Failed to send appointment reminder:', error);
  }
}

/**
 * Notify users about a new campaign
 */
export async function notifyNewCampaign(
  campaignId: string
): Promise<void> {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) return;

    const payload: NotificationPayload = {
      title: campaign.title,
      body: campaign.description || 'Check out our latest update!',
      imageUrl: campaign.mediaUrl || undefined,
      data: {
        type: NotificationTypes.NEW_CAMPAIGN,
        campaignId,
        link: campaign.ctaUrl || '/dashboard',
      },
    };

    // Send based on target audience
    if (campaign.targetAudience === 'all') {
      await sendToTopic(TopicNames.allUsers, payload);
    } else if (campaign.targetAudience === 'clinic' && campaign.clinicId) {
      await sendToTopic(TopicNames.clinic(campaign.clinicId), payload);
    } else if (campaign.targetAudience === 'plan') {
      // Parse target IDs and send to each plan topic
      const targetIds = JSON.parse(campaign.targetIds || '[]') as string[];
      for (const planId of targetIds) {
        await sendToTopic(TopicNames.carePlan(planId), payload);
      }
    }
  } catch (error) {
    console.error('Failed to send campaign notification:', error);
  }
}

/**
 * Notify user about subscription expiring soon
 */
export async function notifySubscriptionExpiring(
  userId: string,
  daysRemaining: number
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { carePlan: true },
        },
      },
    });

    if (!user?.fcmToken || !user.subscription) {
      return;
    }

    const payload: NotificationPayload = {
      title: 'Subscription Expiring Soon',
      body: `Your ${user.subscription.carePlan.name} plan expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}. Renew now to continue enjoying premium features.`,
      data: {
        type: NotificationTypes.SUBSCRIPTION_EXPIRING,
        link: '/dashboard/subscription',
      },
    };

    await sendToUser(user.fcmToken, payload);
  } catch (error) {
    console.error('Failed to send subscription expiring notification:', error);
  }
}
