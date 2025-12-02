import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, requireSuperAdmin } from '@/lib/auth-utils'

// Generate unique 6-character clinic code
function generateClinicCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET /api/clinics - List all clinics (admin only)
export async function GET(req: NextRequest) {
  try {
    const user = await requireAdmin()
    
    // Get query parameters for search and filter
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}

    // Search by name, code, or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filter by status
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Fetch clinics with pagination
    const [clinics, total] = await Promise.all([
      prisma.clinic.findMany({
        where,
        include: {
          manager: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { parents: true, whitelist: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.clinic.count({ where }),
    ])

    // Transform to include subscriber counts
    const clinicsWithCounts = clinics.map(clinic => ({
      ...clinic,
      subscriberCount: clinic._count.parents,
      whitelistCount: clinic._count.whitelist,
    }))

    return NextResponse.json({
      clinics: clinicsWithCounts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + clinics.length < total,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching clinics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/clinics - Create new clinic (super admin only)
export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin()
    
    const body = await req.json()
    const { name, address, phone, email, whatsappNumber, managerId } = body

    if (!name) {
      return NextResponse.json({ error: 'Clinic name is required' }, { status: 400 })
    }

    // Generate unique code
    let code = generateClinicCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.clinic.findUnique({ where: { code } })
      if (!existing) break
      code = generateClinicCode()
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        code,
        address,
        phone,
        email,
        whatsappNumber,
        managerId,
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(clinic, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error creating clinic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
