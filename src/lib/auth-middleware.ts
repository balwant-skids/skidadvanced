/**
 * Authentication Middleware
 * Feature: skids-e2e-deployment
 * Validates: Requirements 8.1
 * Property 11: Authentication Token Validation
 */

import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { createLogger } from './logger';

const logger = createLogger();

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  clinicId?: string;
}

/**
 * Verify user is authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const { userId } = auth();
  
  if (!userId) {
    logger.warn('Unauthorized access attempt - no user ID');
    throw new Error('Unauthorized');
  }
  
  // Get user details from database
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        role: true,
        clinicId: true,
      },
    });
    
    if (!user) {
      logger.warn('User not found in database', { userId });
      throw new Error('User not found');
    }
    
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId || undefined,
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Verify user has required role
 */
export async function requireRole(allowedRoles: string[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    logger.warn('Insufficient permissions', {
      userId: user.userId,
      userRole: user.role,
      requiredRoles: allowedRoles,
    });
    throw new Error('Forbidden');
  }
  
  return user;
}

/**
 * Verify user is a super admin
 */
export async function requireSuperAdmin(): Promise<AuthenticatedUser> {
  return requireRole(['super_admin']);
}

/**
 * Verify user is a clinic manager
 */
export async function requireClinicManager(): Promise<AuthenticatedUser> {
  return requireRole(['clinic_manager', 'super_admin']);
}

/**
 * Verify user is a parent
 */
export async function requireParent(): Promise<AuthenticatedUser> {
  return requireRole(['parent']);
}

/**
 * Verify user belongs to specific clinic
 */
export async function requireClinicAccess(clinicId: string): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  // Super admins can access all clinics
  if (user.role === 'super_admin') {
    return user;
  }
  
  // Check if user belongs to the clinic
  if (user.clinicId !== clinicId) {
    logger.warn('Unauthorized clinic access attempt', {
      userId: user.userId,
      userClinicId: user.clinicId,
      requestedClinicId: clinicId,
    });
    throw new Error('Forbidden');
  }
  
  return user;
}

/**
 * Verify user owns a resource
 */
export async function requireOwnership(
  resourceType: string,
  resourceId: string,
  ownerIdField: string = 'userId'
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  // Super admins can access all resources
  if (user.role === 'super_admin') {
    return user;
  }
  
  // Check resource ownership
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const resource = await (prisma as any)[resourceType].findUnique({
      where: { id: resourceId },
      select: { [ownerIdField]: true },
    });
    
    if (!resource) {
      logger.warn('Resource not found', { resourceType, resourceId });
      throw new Error('Not found');
    }
    
    if (resource[ownerIdField] !== user.userId) {
      logger.warn('Unauthorized resource access attempt', {
        userId: user.userId,
        resourceType,
        resourceId,
        ownerId: resource[ownerIdField],
      });
      throw new Error('Forbidden');
    }
    
    return user;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }
    
    if (error.message === 'Not found') {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Resource not found' } },
        { status: 404 }
      );
    }
  }
  
  logger.error('Authentication error', error instanceof Error ? error : new Error(String(error)));
  
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 }
  );
}

/**
 * Wrap API route with authentication
 */
export function withAuth(
  handler: (user: AuthenticatedUser, request: Request) => Promise<Response>,
  options?: { roles?: string[] }
) {
  return async (request: Request) => {
    try {
      const user = options?.roles
        ? await requireRole(options.roles)
        : await requireAuth();
      
      return await handler(user, request);
    } catch (error) {
      return handleAuthError(error);
    }
  };
}
