import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/admin/staff - List all admin users (super_admin and clinic_manager)
export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin()
    
    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const clinicId = searchParams.get('clinicId')

    // Build where clause
    const where: any = {
      role: {
        in: ['super_admin', 'clinic_manager']
      }
    }

    // Filter by specific role
    if (role && (role === 'super_admin' || role === 'clinic_manager')) {
      where.role = role
    }

    // Filter by status
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Filter by clinic
    if (clinicId) {
      where.clinicId = clinicId
    }

    const staff = await prisma.user.findMany({
      where,
      include: {
        clinic: {
          select: { id: true, name: true, code: true }
        },
        managedClinic: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ staff })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/staff - Create new admin user (super_admin only)
export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin()
    
    const body = await req.json()
    const { email, name, role, clinicId, phone } = body

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (role !== 'super_admin' && role !== 'clinic_manager') {
      return NextResponse.json(
        { error: 'Role must be super_admin or clinic_manager' },
        { status: 400 }
      )
    }

    // Validate clinic assignment for clinic managers
    if (role === 'clinic_manager' && !clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required for clinic managers' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Verify clinic exists if provided
    if (clinicId) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId }
      })

      if (!clinic) {
        return NextResponse.json(
          { error: 'Clinic not found' },
          { status: 404 }
        )
      }
    }

    // Create admin user
    // Note: This creates a user in our DB, but they still need to sign up with Clerk
    // The clerkId will be populated when they complete Clerk signup
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role,
        clinicId,
        isActive: true, // Admins are active by default
        clerkId: `pending_${Date.now()}`, // Temporary until Clerk signup
      },
      include: {
        clinic: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    return NextResponse.json({ 
      user: adminUser,
      message: 'Admin user created. They need to sign up with Clerk using this email.'
    }, { status: 201 })
  } catch (error: any) {
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
