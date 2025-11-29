/**
 * FCM Token Registration API
 * POST /api/notifications/register - Register/update FCM token for push notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { subscribeToTopic, TopicNames } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fcmToken, deviceType = 'web' } = body;

    if (!fcmToken) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        clinic: true,
        subscription: {
          include: { carePlan: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's FCM token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fcmToken,
        fcmTokenUpdatedAt: new Date(),
      },
    });

    // Subscribe to relevant topics
    const subscriptions: string[] = [];

    // Subscribe to clinic topic
    if (user.clinicId) {
      const clinicTopic = TopicNames.clinic(user.clinicId);
      const subscribed = await subscribeToTopic(fcmToken, clinicTopic);
      if (subscribed) subscriptions.push(clinicTopic);
    }

    // Subscribe to care plan topic if subscribed
    if (user.subscription?.carePlanId) {
      const planTopic = TopicNames.carePlan(user.subscription.carePlanId);
      const subscribed = await subscribeToTopic(fcmToken, planTopic);
      if (subscribed) subscriptions.push(planTopic);
    }

    // Subscribe to all users topic
    const allUsersTopic = TopicNames.allUsers;
    const subscribedAll = await subscribeToTopic(fcmToken, allUsersTopic);
    if (subscribedAll) subscriptions.push(allUsersTopic);

    return NextResponse.json({
      success: true,
      message: 'FCM token registered successfully',
      subscribedTopics: subscriptions,
    });
  } catch (error) {
    console.error('FCM registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register FCM token' },
      { status: 500 }
    );
  }
}

// DELETE - Unregister FCM token (on logout)
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear user's FCM token
    await prisma.user.updateMany({
      where: { clerkId: userId },
      data: {
        fcmToken: null,
        fcmTokenUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'FCM token unregistered successfully',
    });
  } catch (error) {
    console.error('FCM unregistration error:', error);
    return NextResponse.json(
      { error: 'Failed to unregister FCM token' },
      { status: 500 }
    );
  }
}
