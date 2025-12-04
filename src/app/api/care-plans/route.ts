import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrCreateUser, requireSuperAdmin } from '@/lib/auth-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/care-plans - List available plans
export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateUser()
    const clinicId = req.nextUrl.searchParams.get('clinicId')

    // Get global plans + clinic-specific plans
    const plans = await prisma.carePlan.findMany({
      where: {
        isActive: true,
        OR: [
          { clinicId: null }, // Global plans
          ...(clinicId ? [{ clinicId }] : [])
        ]
      },
      orderBy: { displayOrder: 'asc' }
    })

    // Parse features JSON
    const plansWithFeatures = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features || '[]')
    }))

    return NextResponse.json(plansWithFeatures)
  } catch (error) {
    console.error('Error fetching care plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/care-plans - Create plan (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin()
    
    const body = await req.json()
    const { name, description, price, billingCycle, features, clinicId, displayOrder } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const plan = await prisma.carePlan.create({
      data: {
        name,
        description,
        price,
        billingCycle: billingCycle || 'monthly',
        features: JSON.stringify(features || []),
        clinicId,
        displayOrder: displayOrder || 0,
      }
    })

    return NextResponse.json({
      ...plan,
      features: JSON.parse(plan.features || '[]')
    }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Error creating care plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
