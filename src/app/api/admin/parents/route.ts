import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET /api/admin/parents - List all parents with search and filters
export async function GET(req: NextRequest) {
  try {
    const user = await requireAdmin()
    
    // Get query parameters for search and filter
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search')
    const subscriptionStatus = searchParams.get('subscriptionStatus')
    const clinicId = searchParams.get('clinicId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      role: 'parent',
    }

    // Role-based filtering: clinic managers only see their clinic's parents
    if (user.role === 'clinic_manager' && user.clinicId) {
      where.clinicId = user.clinicId
    } else if (clinicId) {
      // Super admins can filter by specific clinic
      where.clinicId = clinicId
    }

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch parents with pagination
    const [parents, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          clinic: {
            select: { id: true, name: true, code: true }
          },
          children: {
            select: { id: true, name: true, dateOfBirth: true }
          },
          subscriptions: {
            where: { status: 'active' },
            include: {
              carePlan: {
                select: { id: true, name: true, price: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ])

    // Filter by subscription status if specified
    let filteredParents = parents
    if (subscriptionStatus) {
      filteredParents = parents.filter(parent => {
        const hasActiveSubscription = parent.subscriptions.length > 0
        if (subscriptionStatus === 'active') {
          return hasActiveSubscription
        } else if (subscriptionStatus === 'inactive') {
          return !hasActiveSubscription
        }
        return true
      })
    }

    // Transform to include subscription info
    const parentsWithSubscriptions = filteredParents.map(parent => ({
      id: parent.id,
      name: parent.name,
      email: parent.email,
      isActive: parent.isActive,
      clinic: parent.clinic,
      childrenCount: parent.children.length,
      subscription: parent.subscriptions[0] || null,
      createdAt: parent.createdAt,
    }))

    return NextResponse.json({
      parents: parentsWithSubscriptions,
      pagination: {
        total: subscriptionStatus ? filteredParents.length : total,
        limit,
        offset,
        hasMore: offset + filteredParents.length < (subscriptionStatus ? filteredParents.length : total),
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching parents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
