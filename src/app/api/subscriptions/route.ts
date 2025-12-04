import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/subscriptions - Create subscription after payment
export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { carePlanId, razorpayId } = body

    if (!carePlanId) {
      return NextResponse.json({ error: 'Care plan ID is required' }, { status: 400 })
    }

    // Check if plan exists
    const carePlan = await prisma.carePlan.findUnique({
      where: { id: carePlanId }
    })

    if (!carePlan || !carePlan.isActive) {
      return NextResponse.json({ error: 'Invalid care plan' }, { status: 400 })
    }

    // Check for existing subscription (now linked to User)
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    })

    if (existingSubscription) {
      // Update existing subscription
      const subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          carePlanId,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          razorpayId,
        },
        include: { carePlan: true }
      })
      return NextResponse.json(subscription)
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        carePlanId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        razorpayId,
      },
      include: { carePlan: true }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
