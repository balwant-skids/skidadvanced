import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

// Cache for analytics data (5 minutes)
let analyticsCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * GET /api/admin/analytics
 * Returns aggregated analytics data for admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    // Check cache
    const now = Date.now();
    if (analyticsCache && (now - analyticsCache.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        ...analyticsCache.data,
        cached: true,
        cacheAge: Math.floor((now - analyticsCache.timestamp) / 1000),
      });
    }

    // Fetch totals in parallel
    const [
      totalClinics,
      totalParents,
      totalChildren,
      totalActiveSubscriptions,
      registrationsData,
      subscriptionDistribution,
      childrenPerClinic,
    ] = await Promise.all([
      // Total active clinics
      prisma.clinic.count({
        where: { isActive: true },
      }),

      // Total active parents
      prisma.user.count({
        where: {
          role: 'parent',
          isActive: true,
        },
      }),

      // Total children
      prisma.child.count(),

      // Total active subscriptions
      prisma.subscription.count({
        where: { status: 'active' },
      }),

      // Parent registrations over last 30 days
      getRegistrationsOverTime(),

      // Subscription distribution by plan
      getSubscriptionDistribution(),

      // Children count per clinic (top 10)
      getChildrenPerClinic(),
    ]);

    const analyticsData = {
      totals: {
        clinics: totalClinics,
        parents: totalParents,
        children: totalChildren,
        subscriptions: totalActiveSubscriptions,
      },
      registrations: registrationsData,
      subscriptionDistribution,
      childrenPerClinic,
      timestamp: new Date().toISOString(),
    };

    // Update cache
    analyticsCache = {
      data: analyticsData,
      timestamp: now,
    };

    return NextResponse.json({
      ...analyticsData,
      cached: false,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

/**
 * Get parent registrations over the last 30 days
 */
async function getRegistrationsOverTime() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch all registrations in the last 30 days
  const registrations = await prisma.user.findMany({
    where: {
      role: 'parent',
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Group by date (not datetime)
  const dateMap = new Map<string, number>();
  
  registrations.forEach((reg) => {
    const date = new Date(reg.createdAt).toISOString().split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  // Fill in missing dates with 0
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0,
    });
  }

  return result;
}

/**
 * Get subscription distribution by care plan
 */
async function getSubscriptionDistribution() {
  const subscriptions = await prisma.subscription.findMany({
    where: { status: 'active' },
    include: {
      carePlan: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalActive = subscriptions.length;
  
  // Group by plan
  const planMap = new Map<string, { name: string; count: number }>();
  
  subscriptions.forEach((sub) => {
    const planId = sub.carePlan.id;
    const planName = sub.carePlan.name;
    
    if (planMap.has(planId)) {
      planMap.get(planId)!.count++;
    } else {
      planMap.set(planId, { name: planName, count: 1 });
    }
  });

  // Convert to array with percentages
  return Array.from(planMap.values()).map((plan) => ({
    planName: plan.name,
    count: plan.count,
    percentage: totalActive > 0 ? Math.round((plan.count / totalActive) * 100 * 100) / 100 : 0,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Get children count per clinic (top 10)
 */
async function getChildrenPerClinic() {
  const clinics = await prisma.clinic.findMany({
    where: { isActive: true },
    include: {
      parents: {
        include: {
          children: true,
        },
      },
    },
    take: 20, // Get top 20 to ensure we have 10 with children
  });

  const clinicData = clinics
    .map((clinic) => {
      const childCount = clinic.parents.reduce(
        (sum, parent) => sum + parent.children.length,
        0
      );
      return {
        clinicName: clinic.name,
        childCount,
      };
    })
    .filter((clinic) => clinic.childCount > 0)
    .sort((a, b) => b.childCount - a.childCount)
    .slice(0, 10);

  return clinicData;
}
