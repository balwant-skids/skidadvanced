/**
 * Simple Authentication Helpers
 * For parent whitelisting system
 */

import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  planId?: string;
  clinicId?: string;
}

/**
 * Get authenticated user with database details
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        planId: true,
        clinicId: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      planId: user.planId || undefined,
      clinicId: user.clinicId || undefined,
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Check if user is super admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'super_admin';
}

/**
 * Check if user is an active parent
 */
export function isActiveParent(user: AuthenticatedUser): boolean {
  return user.role === 'parent' && user.isActive === true;
}

/**
 * Require user to be super admin
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  if (!isAdmin(user)) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}

/**
 * Require user to be an active parent
 */
export async function requireActiveParent(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  if (!isActiveParent(user)) {
    throw new Error('Forbidden: Active parent access required');
  }
  
  return user;
}
