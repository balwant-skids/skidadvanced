import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// Role type (stored as string in SQLite)
type UserRole = 'super_admin' | 'clinic_manager' | 'parent'

/**
 * Get or create user in database from Clerk session
 * This ensures user exists in our DB even without webhook
 */
export async function getOrCreateUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  // Check if user exists in our database
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      parentProfile: {
        include: {
          clinic: true,
          children: true,
        }
      },
      subscription: {
        include: { carePlan: true }
      },
      managedClinic: true,
    }
  })

  // If not, create from Clerk data
  if (!user) {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || ''
    
    // Check if this is a super admin email
    const superAdminEmails = [
      'satissh@skids.health',
      'satish@skids.health',
      'drpratichi@skids.health',
      'balwant@skids.health',
      'fsdev@skids.health',
      'pranit@skids.health',
      'admin@skids.health',
      // Add more super admin emails here
    ]
    
    const role = superAdminEmails.includes(email.toLowerCase()) ? 'super_admin' : 'parent'
    const isActive = role === 'super_admin' ? true : false // Super admins are active by default

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'User',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        role,
        isActive,
      },
      include: {
        parentProfile: {
          include: {
            clinic: true,
            children: true,
          }
        },
        subscription: {
          include: { carePlan: true }
        },
        managedClinic: true,
      }
    })
  }

  return user
}

/**
 * Get current user - throws if not authenticated
 */
export async function requireUser() {
  const user = await getOrCreateUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser()
  
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error('Forbidden')
  }
  
  return user
}

/**
 * Check if user is admin (super_admin or clinic_manager)
 */
export async function requireAdmin() {
  return requireRole(['super_admin', 'clinic_manager'])
}

/**
 * Check if user is super admin
 */
export async function requireSuperAdmin() {
  return requireRole(['super_admin'])
}

/**
 * Link parent to clinic after sign-up
 */
export async function linkParentToClinic(userId: string, clinicCode: string) {
  // Find the clinic
  const clinic = await prisma.clinic.findUnique({
    where: { code: clinicCode },
  })

  if (!clinic || !clinic.isActive) {
    throw new Error('Invalid or inactive clinic code')
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Check whitelist
  const whitelisted = await prisma.parentWhitelist.findUnique({
    where: {
      clinicId_email: {
        clinicId: clinic.id,
        email: user.email,
      },
    },
  })

  if (!whitelisted) {
    throw new Error('Email not whitelisted for this clinic')
  }

  // Create parent profile
  const parentProfile = await prisma.parentProfile.create({
    data: {
      userId: user.id,
      clinicId: clinic.id,
    },
  })

  // Mark as registered in whitelist
  await prisma.parentWhitelist.update({
    where: { id: whitelisted.id },
    data: { isRegistered: true },
  })

  return parentProfile
}
