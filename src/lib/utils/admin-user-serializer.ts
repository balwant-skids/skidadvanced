import { User, Clinic } from '@prisma/client'

/**
 * Admin user serialization utilities
 * Transform database User models to API response format
 */

export interface AdminUserResponse {
  id: string
  clerkId: string
  email: string
  name: string
  phone: string | null
  role: string
  isActive: boolean
  clinicId: string | null
  createdAt: Date
  updatedAt: Date
  
  // Computed/related fields
  managedClinic?: {
    id: string
    name: string
    code: string
  } | null
  lastLogin?: Date | null
  activityCount?: number
}

export interface AdminUserListItem {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  clinicId: string | null
  createdAt: Date
  updatedAt: Date
  
  // Related data
  clinic?: {
    id: string
    name: string
  } | null
  managedClinic?: {
    id: string
    name: string
  } | null
}

/**
 * Serialize a single admin user for detailed view
 * 
 * @param user - User from database with optional relations
 * @param options - Additional computed fields
 * @returns Serialized admin user
 */
export function serializeAdminUser(
  user: User & {
    managedClinic?: Clinic | null
  },
  options: {
    lastLogin?: Date | null
    activityCount?: number
  } = {}
): AdminUserResponse {
  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    clinicId: user.clinicId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    managedClinic: user.managedClinic
      ? {
          id: user.managedClinic.id,
          name: user.managedClinic.name,
          code: user.managedClinic.code,
        }
      : null,
    lastLogin: options.lastLogin,
    activityCount: options.activityCount,
  }
}

/**
 * Serialize admin user for list view (lighter payload)
 * 
 * @param user - User from database with optional relations
 * @returns Serialized admin user list item
 */
export function serializeAdminUserListItem(
  user: User & {
    clinic?: { id: string; name: string } | null
    managedClinic?: { id: string; name: string } | null
  }
): AdminUserListItem {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    clinicId: user.clinicId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    clinic: user.clinic
      ? {
          id: user.clinic.id,
          name: user.clinic.name,
        }
      : null,
    managedClinic: user.managedClinic
      ? {
          id: user.managedClinic.id,
          name: user.managedClinic.name,
        }
      : null,
  }
}

/**
 * Serialize multiple admin users for list view
 * 
 * @param users - Array of users from database
 * @returns Array of serialized admin user list items
 */
export function serializeAdminUserList(
  users: Array<
    User & {
      clinic?: { id: string; name: string } | null
      managedClinic?: { id: string; name: string } | null
    }
  >
): AdminUserListItem[] {
  return users.map(serializeAdminUserListItem)
}

/**
 * Filter sensitive fields from user object
 * Removes fields that should not be exposed in API responses
 * 
 * @param user - User object
 * @returns User object without sensitive fields
 */
export function removeSensitiveFields<T extends Record<string, any>>(user: T): Omit<T, 'clerkId'> {
  const { clerkId, ...safeUser } = user
  return safeUser
}

/**
 * Check if user is an admin role (super_admin, clinic_manager, or admin)
 * 
 * @param role - User role string
 * @returns True if user has admin role
 */
export function isAdminRole(role: string): boolean {
  return ['super_admin', 'clinic_manager', 'admin'].includes(role)
}

/**
 * Check if user is super admin
 * 
 * @param role - User role string
 * @returns True if user is super admin
 */
export function isSuperAdmin(role: string): boolean {
  return role === 'super_admin'
}

/**
 * Check if user is clinic manager
 * 
 * @param role - User role string
 * @returns True if user is clinic manager
 */
export function isClinicManager(role: string): boolean {
  return role === 'clinic_manager'
}
