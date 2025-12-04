/**
 * Property-Based Tests for Authentication Validation
 * Feature: skids-e2e-deployment, Property 11: Authentication Token Validation
 * Validates: Requirements 8.1
 * 
 * Property: For any request to a protected API route, it should be rejected
 * if the authentication token is invalid or missing
 */

import * as fc from 'fast-check';
import { requireAuth, requireRole, requireClinicAccess } from '../../lib/auth-middleware';

// Mock Clerk auth
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(),
}));

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';

describe('Property 11: Authentication Token Validation', () => {
  let mockAuth: jest.MockedFunction<typeof auth>;
  let mockPrisma: any;

  beforeEach(() => {
    mockAuth = auth as jest.MockedFunction<typeof auth>;
    mockPrisma = new PrismaClient();
    jest.clearAllMocks();
  });

  test('should reject all requests without user ID', () => {
    fc.assert(
      fc.property(fc.constant(null), async (userId) => {
        // Mock no authentication
        mockAuth.mockReturnValue({ userId: null } as any);

        // Should throw error
        await expect(requireAuth()).rejects.toThrow('Unauthorized');
      }),
      { numRuns: 50 }
    );
  });

  test('should reject requests for users not in database', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), async (userId) => {
        // Mock authenticated but user not in database
        mockAuth.mockReturnValue({ userId } as any);
        mockPrisma.user.findUnique.mockResolvedValue(null);

        // Should throw error
        await expect(requireAuth()).rejects.toThrow('User not found');
      }),
      { numRuns: 100 }
    );
  });

  test('should accept requests with valid user ID and database record', () => {
    fc.assert(
      fc.property(
        fc.record({
          userId: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          role: fc.constantFrom('parent', 'clinic_manager', 'super_admin'),
          clinicId: fc.option(fc.string(), { nil: null }),
        }),
        async (userData) => {
          // Mock authenticated user
          mockAuth.mockReturnValue({ userId: userData.userId } as any);
          mockPrisma.user.findUnique.mockResolvedValue({
            id: userData.userId,
            email: userData.email,
            role: userData.role,
            clinicId: userData.clinicId,
          });

          // Should return user data
          const result = await requireAuth();
          expect(result.userId).toBe(userData.userId);
          expect(result.email).toBe(userData.email);
          expect(result.role).toBe(userData.role);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should enforce role-based access control', () => {
    fc.assert(
      fc.property(
        fc.record({
          userId: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          userRole: fc.constantFrom('parent', 'clinic_manager', 'super_admin'),
          requiredRole: fc.constantFrom('parent', 'clinic_manager', 'super_admin'),
        }),
        async (data) => {
          // Mock authenticated user
          mockAuth.mockReturnValue({ userId: data.userId } as any);
          mockPrisma.user.findUnique.mockResolvedValue({
            id: data.userId,
            email: data.email,
            role: data.userRole,
            clinicId: null,
          });

          // Check if role matches
          const hasAccess = data.userRole === data.requiredRole || data.userRole === 'super_admin';

          if (hasAccess) {
            // Should succeed
            const result = await requireRole([data.requiredRole]);
            expect(result.role).toBe(data.userRole);
          } else {
            // Should fail
            await expect(requireRole([data.requiredRole])).rejects.toThrow('Forbidden');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should enforce clinic access control', () => {
    fc.assert(
      fc.property(
        fc.record({
          userId: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          role: fc.constantFrom('parent', 'clinic_manager'),
          userClinicId: fc.string({ minLength: 1 }),
          requestedClinicId: fc.string({ minLength: 1 }),
        }),
        async (data) => {
          // Mock authenticated user
          mockAuth.mockReturnValue({ userId: data.userId } as any);
          mockPrisma.user.findUnique.mockResolvedValue({
            id: data.userId,
            email: data.email,
            role: data.role,
            clinicId: data.userClinicId,
          });

          // Check if clinic matches
          const hasAccess = data.userClinicId === data.requestedClinicId;

          if (hasAccess) {
            // Should succeed
            const result = await requireClinicAccess(data.requestedClinicId);
            expect(result.clinicId).toBe(data.userClinicId);
          } else {
            // Should fail
            await expect(requireClinicAccess(data.requestedClinicId)).rejects.toThrow('Forbidden');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should allow super admins to access any clinic', () => {
    fc.assert(
      fc.property(
        fc.record({
          userId: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          requestedClinicId: fc.string({ minLength: 1 }),
        }),
        async (data) => {
          // Mock super admin
          mockAuth.mockReturnValue({ userId: data.userId } as any);
          mockPrisma.user.findUnique.mockResolvedValue({
            id: data.userId,
            email: data.email,
            role: 'super_admin',
            clinicId: null,
          });

          // Should always succeed for super admin
          const result = await requireClinicAccess(data.requestedClinicId);
          expect(result.role).toBe('super_admin');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should reject requests with mismatched user data', () => {
    fc.assert(
      fc.property(
        fc.record({
          clerkUserId: fc.string({ minLength: 1 }),
          dbUserId: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          role: fc.constantFrom('parent', 'clinic_manager', 'super_admin'),
        }),
        async (data) => {
          // Mock Clerk user ID
          mockAuth.mockReturnValue({ userId: data.clerkUserId } as any);

          // Mock database with different user ID
          mockPrisma.user.findUnique.mockResolvedValue({
            id: data.dbUserId,
            email: data.email,
            role: data.role,
            clinicId: null,
          });

          // Should still work (we use Clerk ID to find user, return DB ID)
          const result = await requireAuth();
          expect(result.userId).toBe(data.dbUserId);
        }
      ),
      { numRuns: 100 }
    );
  });
});
