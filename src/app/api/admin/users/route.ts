import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/auth-utils'
import { AdminUserQuerySchema, CreateAdminUserSchema } from '@/lib/validations/admin-user'
import { serializeAdminUserList } from '@/lib/utils/admin-user-serializer'
import { logAdminActivity, AdminActions, EntityTypes } from '@/lib/utils/activity-logger'
import { ZodError } from 'zod'

/**
 * GET /api/admin/users
 * List all admin users with filtering, pagination, and sorting
 * 
 * Query Parameters:
 * - role: Filter by role (super_admin, clinic_manager, admin)
 * - status: Filter by status (active, inactive)
 * - clinicId: Filter by clinic
 * - search: Search by name or email
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - sortBy: Sort field (name, email, createdAt, updatedAt)
 * - sortOrder: Sort order (asc, desc)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify super admin access
    const currentUser = await requireSuperAdmin()
    
    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams
    const queryParams = {
      role: searchParams.get('role') || undefined,
      status: searchParams.get('status') || undefined,
      clinicId: searchParams.get('clinicId') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    }

    const validatedQuery = AdminUserQuerySchema.parse(queryParams)

    // Build where clause
    const where: any = {
      role: {
        in: ['super_admin', 'clinic_manager', 'admin']
      }
    }

    // Filter by specific role
    if (validatedQuery.role) {
      where.role = validatedQuery.role
    }

    // Filter by status
    if (validatedQuery.status === 'active') {
      where.isActive = true
    } else if (validatedQuery.status === 'inactive') {
      where.isActive = false
    }

    // Filter by clinic
    if (validatedQuery.clinicId) {
      where.OR = [
        { clinicId: validatedQuery.clinicId },
        { managedClinic: { id: validatedQuery.clinicId } }
      ]
    }

    // Search by name or email
    if (validatedQuery.search) {
      where.OR = [
        { name: { contains: validatedQuery.search, mode: 'insensitive' } },
        { email: { contains: validatedQuery.search, mode: 'insensitive' } },
      ]
    }

    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    const take = validatedQuery.limit

    // Build orderBy
    const orderBy: any = {}
    orderBy[validatedQuery.sortBy] = validatedQuery.sortOrder

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          clinic: {
            select: { id: true, name: true }
          },
          managedClinic: {
            select: { id: true, name: true }
          }
        },
        orderBy,
        take,
        skip,
      }),
      prisma.user.count({ where }),
    ])

    // Serialize users
    const serializedUsers = serializeAdminUserList(users)

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / validatedQuery.limit)

    return NextResponse.json({
      users: serializedUsers,
      pagination: {
        total,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        totalPages,
        hasMore: validatedQuery.page < totalPages,
      },
    })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching admin users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user
 * 
 * Body:
 * - email: User email (required)
 * - name: User name (required)
 * - role: User role - super_admin, clinic_manager, or admin (required)
 * - clinicId: Clinic ID (required for clinic_manager)
 * - phone: Phone number (optional)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify super admin access
    const currentUser = await requireSuperAdmin()
    
    // Parse and validate request body
    const body = await req.json()
    const validatedData = CreateAdminUserSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Verify clinic exists if provided
    if (validatedData.clinicId) {
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

    // Create admin user
    // Note: This creates a user in our DB, but they still need to sign up with Clerk
    // The clerkId will be populated when they complete Clerk signup via webhook
    const adminUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        role: validatedData.role,
        clinicId: validatedData.clinicId,
        isActive: true, // Admins are active by default
        clerkId: `pending_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Temporary until Clerk signup
      },
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
      action: AdminActions.USER_CREATED,
      entityType: EntityTypes.USER,
      entityId: adminUser.id,
      metadata: {
        email: adminUser.email,
        role: adminUser.role,
        clinicId: adminUser.clinicId,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    // TODO: Send invitation email via Clerk
    // This would typically use Clerk's invitation API to send an email
    // For now, we'll return a message indicating manual setup is needed

    return NextResponse.json({ 
      user: adminUser,
      invitationSent: false,
      message: 'Admin user created. They need to sign up with Clerk using this email address.',
    }, { status: 201 })
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
    console.error('Error creating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
