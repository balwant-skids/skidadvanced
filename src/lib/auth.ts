/**
 * Authentication is now handled by Clerk
 * This file is kept for backwards compatibility with any imports
 * 
 * For authentication, use:
 * - @clerk/nextjs for client-side
 * - @clerk/nextjs/server for server-side
 * - src/lib/auth-utils.ts for database user operations
 */

// Re-export auth utilities for convenience
export { getOrCreateUser, requireUser, requireAdmin, requireRole } from './auth-utils'

// Legacy export for any remaining NextAuth imports
export const authOptions = {
  // Deprecated - using Clerk now
}
