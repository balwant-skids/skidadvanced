import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/auth-utils'
import { UpdateAdminUserSchema } from '@/lib/validations/admin-user'
import { serializeAdminUser } from '@/lib/utils/admin-user-serializer'
import { logAdminActivity, AdminActions, EntityTypes, getUserActivitySummary } from '@/lib/utils/activity-logger'
import { ZodError } from 'zod'

/**
 * GET /api/admin/users/[id]
 * Get detailed information about a specific admin user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify super admin access
    await requireSuperAdmin()
    
    const userId = params.id

    // Fetch user with relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clinic: {
          select: { id: true, name: true, code: true }
        },
        managedClinic: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is an admin role
    if (!['super_admin', 'clinic_manager', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'User is not an admin' },
        { status: 400 }
      )
    }

    // Get activity summary
    const activitySummary = await getUserActivitySummary(userId)

    // Serialize user with activity data
    const serializedUser = serializeAdminUser(user, {
      lastLogin: activitySummary.lastLogin,
      activityCount: activitySummary.totalActions,
    })

    return NextResponse.json({
      user: serializedUser,
      activitySummary: {
        totalActions: activitySummary.totalActions,
        recentActions: activitySummary.recentActions,
        lastLogin: activitySummary.lastLogin,
      }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update an admin user's details
 * 
 * Body:
 * - name: User name (optional)
 * - role: User role (optional)
 * - clinicId: Clinic ID (optional)
 * - phone: Phone number (optional)
 * - isActive: Active status (optional)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify super admin access
    const currentUser = await requireSuperAdmin()
    
    const userId = params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is an admin role
    if (!['super_admin', 'clinic_manager', 'admin'].includes(existingUser.role)) {
      return NextResponse.json(
        { error: 'User is not an admin' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = UpdateAdminUserSchema.parse(body)

    // Verify clinic exists if being changed
    if (validatedData.clinicId !== undefined && validatedData.clinicId !== null) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: validatedData.clinicId }
      })

      if (!clinic) {
        return NextResponse.json(
          { error: 'Clinic not found' },
          { status: 404 }
        )
      }

      if (!clinic.isActive) {
        return NextResponse.json(
          { error: 'Cannot assign user to inactive clinic' },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    const updatedFields: string[] = []

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name
      updatedFields.push('name')
    }

    if (validatedData.role !== undefined) {
      updateData.role = validatedData.role
      updatedFields.push('role')
    }

    if (validatedData.clinicId !== undefined) {
      updateData.clinicId = validatedData.clinicId
      updatedFields.push('clinicId')
    }

    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone
      updatedFields.push('phone')
    }

    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive
      updatedFields.push('isActive')
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        clinic: {
          select: { id: true, name: true, code: true }
        },
        managedClinic: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    // Log activity
    await logAdminActivity({
      userId: currentUser.id,
      action: AdminActions.USER_UPDATED,
      entityType: EntityTypes.USER,
      entityId: updatedUser.id,
      metadata: {
        updatedFields,
        changes: validatedData,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      user: updatedUser,
      updated: updatedFields,
    })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error updating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Deactivate an admin user (soft delete)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify super admin access
    const currentUser = await requireSuperAdmin()
    
    const userId = params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is an admin role
    if (!['super_admin', 'clinic_manager', 'admin'].includes(existingUser.role)) {
      return NextResponse.json(
        { error: 'User is not an admin' },
        { status: 400 }
      )
    }

    // Prevent deactivating yourself
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    // Check if this is the last super admin
    if (existingUser.role === 'super_admin') {
      const superAdminCount = await prisma.user.count({
        where: {
          role: 'super_admin',
          isActive: true,
        }
      })

      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot deactivate the last super admin' },
          { status: 400 }
        )
      }
    }

    // Deactivate user (soft delete)
    const deactivatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      include: {
        clinic: {
          select: { id: true, name: true, code: true }
        },
        managedClinic: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    // Log activity
    await logAdminActivity({
      userId: currentUser.id,
      action: AdminActions.USER_DEACTIVATED,
      entityType: EntityTypes.USER,
      entityId: deactivatedUser.id,
      metadata: {
        email: deactivatedUser.email,
        role: deactivatedUser.role,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      user: deactivatedUser,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deactivating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
