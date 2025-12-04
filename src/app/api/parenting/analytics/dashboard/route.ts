import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AnalyticsService } from '@/lib/parenting/analytics-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/analytics/dashboard - Admin dashboard analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check
    // For now, allow any authenticated user to access analytics

    const dashboardData = await AnalyticsService.generateAdminDashboard();

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error generating admin dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to generate admin dashboard' },
      { status: 500 }
    );
  }
}