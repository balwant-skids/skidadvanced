import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/subscriptions/me - Get current subscription
export async function GET() {
  try {
    const user = await getOrCreateUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Subscription is now linked to User, not ParentProfile
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      include: {
        carePlan: true
      }
    })

    if (!subscription) {
      return NextResponse.json({ 
        hasSubscription: false,
        message: 'No active subscription' 
      })
    }

    // Check if expired
    const isExpired = subscription.endDate && new Date(subscription.endDate) < new Date()
    
    return NextResponse.json({
      hasSubscription: true,
      isActive: subscription.status === 'active' && !isExpired,
      subscription: {
        ...subscription,
        carePlan: {
          ...subscription.carePlan,
          features: JSON.parse(subscription.carePlan.features || '[]')
        }
      }
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
