import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth-utils'

// GET /api/children/[id] - Get child with health data
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: user.id }
    })

    if (!parentProfile) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 })
    }

    const child = await prisma.child.findFirst({
      where: { 
        id: params.id,
        parentId: parentProfile.id // Ensure parent owns this child
      },
      include: {
        assessments: {
          orderBy: { completedAt: 'desc' },
          take: 10
        },
        appointments: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: 'asc' },
          take: 5
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json(child)
  } catch (error) {
    console.error('Error fetching child:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/children/[id] - Update child
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: user.id }
    })

    if (!parentProfile) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 })
    }

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: { id: params.id, parentId: parentProfile.id }
    })

    if (!existingChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    const body = await req.json()
    const { name, dateOfBirth, gender, bloodGroup, allergies, healthMetrics } = body

    const child = await prisma.child.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender !== undefined && { gender }),
        ...(bloodGroup !== undefined && { bloodGroup }),
        ...(allergies !== undefined && { allergies }),
        ...(healthMetrics !== undefined && { healthMetrics: JSON.stringify(healthMetrics) }),
      }
    })

    return NextResponse.json(child)
  } catch (error) {
    console.error('Error updating child:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/children/[id] - Delete child
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: user.id }
    })

    if (!parentProfile) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 })
    }

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: { id: params.id, parentId: parentProfile.id }
    })

    if (!existingChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    await prisma.child.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Child deleted' })
  } catch (error) {
    console.error('Error deleting child:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
