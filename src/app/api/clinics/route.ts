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
    
    const clinics = await prisma.clinic.findMany({
      include: {
        manager: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { parents: true, whitelist: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to include subscriber counts
    const clinicsWithCounts = clinics.map(clinic => ({
      ...clinic,
      subscriberCount: clinic._count.parents,
      whitelistCount: clinic._count.whitelist,
    }))

    return NextResponse.json(clinicsWithCounts)
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
