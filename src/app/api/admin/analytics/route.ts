/**
 * Admin Analytics API
 * GET /api/admin/analytics - Get clinic analytics overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || !['super_admin', 'clinic_manager', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const clinicFilter = user.role === 'super_admin' ? {} : { clinicId: user.clinicId };

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for performance
    const [
      totalParents,
      totalChildren,
      activeSubscriptions,
      totalAssessments,
      upcomingAppointments,
      recentRegistrations,
      subscriptionsByPlan,
      assessmentsByType,
      registrationTrend,
    ] = await Promise.all([
      // Total parents
      prisma.parentProfile.count({
        where: clinicFilter.clinicId ? { clinicId: clinicFilter.clinicId } : {},
      }),

      // Total children
      prisma.child.count({
        where: clinicFilter.clinicId
          ? { parent: { clinicId: clinicFilter.clinicId } }
          : {},
      }),

      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: 'active',
          ...(clinicFilter.clinicId
            ? { user: { clinicId: clinicFilter.clinicId } }
            : {}),
        },
      }),

      // Total assessments
      prisma.assessment.count({
        where: clinicFilter.clinicId
          ? { child: { parent: { clinicId: clinicFilter.clinicId } } }
          : {},
      }),

      // Upcoming appointments
      prisma.appointment.count({
        where: {
          scheduledAt: { gte: now },
          status: { in: ['scheduled', 'confirmed'] },
          ...(clinicFilter.clinicId
            ? { child: { parent: { clinicId: clinicFilter.clinicId } } }
            : {}),
        },
      }),

      // Recent registrations (last 7 days)
      prisma.parentProfile.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          ...(clinicFilter.clinicId ? { clinicId: clinicFilter.clinicId } : {}),
        },
      }),

      // Subscriptions by plan
      prisma.subscription.groupBy({
        by: ['carePlanId'],
        where: {
          status: 'active',
          ...(clinicFilter.clinicId
            ? { user: { clinicId: clinicFilter.clinicId } }
            : {}),
        },
        _count: true,
      }),

      // Assessments by type
      prisma.assessment.groupBy({
        by: ['type'],
        where: clinicFilter.clinicId
          ? { child: { parent: { clinicId: clinicFilter.clinicId } } }
          : {},
        _count: true,
      }),

      // Registration trend (last 30 days)
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM ParentProfile
        WHERE createdAt >= ${thirtyDaysAgo}
        ${clinicFilter.clinicId ? prisma.$queryRaw`AND clinicId = ${clinicFilter.clinicId}` : prisma.$queryRaw``}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ]);

    // Get plan names for subscription breakdown
    const planIds = subscriptionsByPlan.map((s) => s.carePlanId);
    const plans = await prisma.carePlan.findMany({
      where: { id: { in: planIds } },
      select: { id: true, name: true },
    });

    const planMap = new Map(plans.map((p) => [p.id, p.name]));

    return NextResponse.json({
      overview: {
        totalParents,
        totalChildren,
        activeSubscriptions,
        totalAssessments,
        upcomingAppointments,
        recentRegistrations,
      },
      subscriptionsByPlan: subscriptionsByPlan.map((s) => ({
        plan: planMap.get(s.carePlanId) || 'Unknown',
        count: s._count,
      })),
      assessmentsByType: assessmentsByType.map((a) => ({
        type: a.type,
        count: a._count,
      })),
      registrationTrend,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
