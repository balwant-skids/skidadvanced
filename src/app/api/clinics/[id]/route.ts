import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, requireSuperAdmin } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/clinics/[id] - Get single clinic
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const clinic = await prisma.clinic.findUnique({
      where: { id: params.id },
      include: {
        manager: {
          select: { id: true, name: true, email: true }
        },
        carePlans: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { parents: true, whitelist: true }
        }
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...clinic,
      subscriberCount: clinic._count.parents,
      whitelistCount: clinic._count.whitelist,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching clinic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/clinics/[id] - Update clinic
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const body = await req.json()
    const { name, address, phone, email, whatsappNumber, isActive, settings, managerId } = body

    const clinic = await prisma.clinic.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(whatsappNumber !== undefined && { whatsappNumber }),
        ...(isActive !== undefined && { isActive }),
        ...(settings !== undefined && { settings: JSON.stringify(settings) }),
        ...(managerId !== undefined && { managerId }),
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(clinic)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating clinic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/clinics/[id] - Deactivate clinic (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin()
    
    const clinic = await prisma.clinic.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Clinic deactivated', clinic })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deactivating clinic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
