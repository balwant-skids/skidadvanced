/**
 * Firebase Cloud Messaging (FCM) Notification Service
 * Server-side push notification handling
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (singleton pattern)
function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    // Check if service account key is provided
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      } catch (error) {
        console.error('Failed to parse Firebase service account key:', error);
        // Initialize without credentials for development
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    } else {
      // Development mode - initialize without credentials
      console.warn('Firebase Admin SDK initialized without service account key');
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  }
  return admin;
}

export interface NotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send notification to a specific user by FCM token
 */
export async function sendToUser(
  fcmToken: string,
  payload: NotificationPayload
): Promise<NotificationResult> {
  try {
    const firebaseAdmin = getFirebaseAdmin();
    
    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data,
      webpush: {
        fcmOptions: {
          link: payload.data?.link || '/',
        },
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
        },
      },
    };

    const response = await firebaseAdmin.messaging().send(message);
    
    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


/**
 * Send notification to multiple users
 */
export async function sendToMultipleUsers(
  fcmTokens: string[],
  payload: NotificationPayload
): Promise<{ successCount: number; failureCount: number }> {
  try {
    const firebaseAdmin = getFirebaseAdmin();
    
    const message: admin.messaging.MulticastMessage = {
      tokens: fcmTokens,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data,
      webpush: {
        fcmOptions: {
          link: payload.data?.link || '/',
        },
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
        },
      },
    };

    const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Failed to send multicast notification:', error);
    return {
      successCount: 0,
      failureCount: fcmTokens.length,
    };
  }
}

/**
 * Send notification to a topic (e.g., all users in a clinic)
 */
export async function sendToTopic(
  topic: string,
  payload: NotificationPayload
): Promise<NotificationResult> {
  try {
    const firebaseAdmin = getFirebaseAdmin();
    
    const message: admin.messaging.Message = {
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data,
      webpush: {
        fcmOptions: {
          link: payload.data?.link || '/',
        },
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
        },
      },
    };

    const response = await firebaseAdmin.messaging().send(message);
    
    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    console.error('Failed to send topic notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Subscribe user to a topic
 */
export async function subscribeToTopic(
  fcmToken: string,
  topic: string
): Promise<boolean> {
  try {
    const firebaseAdmin = getFirebaseAdmin();
    await firebaseAdmin.messaging().subscribeToTopic([fcmToken], topic);
    return true;
  } catch (error) {
    console.error('Failed to subscribe to topic:', error);
    return false;
  }
}

/**
 * Unsubscribe user from a topic
 */
export async function unsubscribeFromTopic(
  fcmToken: string,
  topic: string
): Promise<boolean> {
  try {
    const firebaseAdmin = getFirebaseAdmin();
    await firebaseAdmin.messaging().unsubscribeFromTopic([fcmToken], topic);
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from topic:', error);
    return false;
  }
}

// Topic naming conventions
export const TopicNames = {
  clinic: (clinicId: string) => `clinic_${clinicId}`,
  carePlan: (planId: string) => `plan_${planId}`,
  allUsers: 'all_users',
};

// Notification types for data payload
export const NotificationTypes = {
  NEW_REPORT: 'new_report',
  NEW_MESSAGE: 'new_message',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  NEW_CAMPAIGN: 'new_campaign',
  SUBSCRIPTION_EXPIRING: 'subscription_expiring',
};
