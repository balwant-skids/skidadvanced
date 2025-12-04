/**
 * Health Check Endpoint
 * Feature: skids-e2e-deployment
 * Validates: Requirements 6.4, 7.1
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'up' | 'down';
  responseTime: number;
  message?: string;
}

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: HealthStatus;
    storage: HealthStatus;
    auth: HealthStatus;
    notifications: HealthStatus;
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }
}

/**
 * Check Cloudflare R2 storage
 */
async function checkStorage(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if R2 credentials are configured
    const hasR2Config = !!(
      process.env.CLOUDFLARE_R2_ENDPOINT &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    );
    
    if (!hasR2Config) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        message: 'R2 credentials not configured',
      };
    }
    
    // For now, just check configuration
    // In production, we could do a lightweight S3 operation
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Storage check failed',
    };
  }
}

/**
 * Check Clerk authentication service
 */
async function checkAuth(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if Clerk credentials are configured
    const hasClerkConfig = !!(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
    );
    
    if (!hasClerkConfig) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        message: 'Clerk credentials not configured',
      };
    }
    
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Auth check failed',
    };
  }
}

/**
 * Check Firebase FCM service
 */
async function checkNotifications(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if Firebase credentials are configured
    const hasFirebaseConfig = !!(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    );
    
    if (!hasFirebaseConfig) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        message: 'Firebase credentials not configured',
      };
    }
    
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Notifications check failed',
    };
  }
}

/**
 * GET /api/health
 * Returns health status of all system components
 */
export async function GET() {
  try {
    // Run all health checks in parallel
    const [database, storage, auth, notifications] = await Promise.all([
      checkDatabase(),
      checkStorage(),
      checkAuth(),
      checkNotifications(),
    ]);
    
    // Determine overall status
    const allUp = [database, storage, auth, notifications].every(
      (check) => check.status === 'up'
    );
    const anyDown = [database, storage, auth, notifications].some(
      (check) => check.status === 'down'
    );
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (allUp) {
      overallStatus = 'healthy';
    } else if (anyDown) {
      overallStatus = 'unhealthy';
    } else {
      overallStatus = 'degraded';
    }
    
    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: {
        database,
        storage,
        auth,
        notifications,
      },
    };
    
    // Return appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
    
    return NextResponse.json(response, { status: httpStatus });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
