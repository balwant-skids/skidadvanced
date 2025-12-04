import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth-utils'

// GET /api/parents/me - Get current parent profile
export async function GET() {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with subscription
    const userWithSub = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        subscription: {
          include: { carePlan: true }
        }
      }
    })

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: user.id },
      include: {
        clinic: {
          select: { id: true, name: true, code: true, whatsappNumber: true }
        },
        children: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!parentProfile) {
      return NextResponse.json({ 
        error: 'Parent profile not found',
        needsOnboarding: true 
      }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      profile: {
        ...parentProfile,
        subscription: userWithSub?.subscription || null
      }
    })
  } catch (error) {
    console.error('Error fetching parent profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/parents/me - Update parent profile
export async function PATCH(req: NextRequest) {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone } = body

    // Update user info
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
      }
    })

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
    })
  } catch (error) {
    console.error('Error updating parent profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
