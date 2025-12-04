import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/auth-utils'
import { logAdminActivity, AdminActions, EntityTypes } from '@/lib/utils/activity-logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/users/[id]/reactivate
 * Reactivate a deactivated admin user
 */
export async function POST(
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

    // Check if user is already active
    if (existingUser.isActive) {
      return NextResponse.json(
        { error: 'User is already active' },
        { status: 400 }
      )
    }

    // Reactivate user
    const reactivatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
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
      action: AdminActions.USER_REACTIVATED,
      entityType: EntityTypes.USER,
      entityId: reactivatedUser.id,
      metadata: {
        email: reactivatedUser.email,
        role: reactivatedUser.role,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      user: reactivatedUser,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error reactivating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
