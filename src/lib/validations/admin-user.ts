import { z } from 'zod'

/**
 * Validation schemas for Admin User Management
 */

// Role enum
export const UserRoleSchema = z.enum(['super_admin', 'clinic_manager', 'admin'])

// Create admin user schema
export const CreateAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  role: UserRoleSchema,
  clinicId: z.string().optional(),
  phone: z.string().optional(),
}).refine(
  (data) => {
    // If role is clinic_manager, clinicId is required
    if (data.role === 'clinic_manager') {
      return !!data.clinicId
    }
    return true
  },
  {
    message: 'Clinic ID is required for clinic_manager role',
    path: ['clinicId'],
  }
)

// Update admin user schema
export const UpdateAdminUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').optional(),
  role: UserRoleSchema.optional(),
  clinicId: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    // If role is being changed to clinic_manager, clinicId must be provided
    if (data.role === 'clinic_manager' && data.clinicId === null) {
      return false
    }
    return true
  },
  {
    message: 'Clinic ID is required when changing role to clinic_manager',
    path: ['clinicId'],
  }
)

// Query parameters schema for listing admin users
export const AdminUserQuerySchema = z.object({
  role: UserRoleSchema.optional(),
  status: z.enum(['active', 'inactive']).optional(),
  clinicId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Activity log query parameters
export const ActivityLogQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
})

// Types inferred from schemas
export type CreateAdminUserInput = z.infer<typeof CreateAdminUserSchema>
export type UpdateAdminUserInput = z.infer<typeof UpdateAdminUserSchema>
export type AdminUserQuery = z.infer<typeof AdminUserQuerySchema>
export type ActivityLogQuery = z.infer<typeof ActivityLogQuerySchema>
export type UserRole = z.infer<typeof UserRoleSchema>
