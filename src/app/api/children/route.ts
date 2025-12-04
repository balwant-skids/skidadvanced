import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/children - List parent's children
export async function GET() {
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

    const children = await prisma.child.findMany({
      where: { parentId: parentProfile.id },
      include: {
        _count: {
          select: { assessments: true, appointments: true, reports: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(children)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/children - Add a child
export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { name, dateOfBirth, gender, bloodGroup, allergies } = body

    if (!name || !dateOfBirth) {
      return NextResponse.json({ error: 'Name and date of birth are required' }, { status: 400 })
    }

    const child = await prisma.child.create({
      data: {
        parentId: parentProfile.id,
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bloodGroup,
        allergies,
      }
    })

    return NextResponse.json(child, { status: 201 })
  } catch (error) {
    console.error('Error creating child:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
