import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

/**
 * GET /api/admin/export/parents
 * Export parents data as JSON (client will convert to CSV)
 * Role-based filtering: clinic managers only see their clinic's parents
 */
export async function GET(req: NextRequest) {
  try {
    // Verify admin access and get user info
    const user = await requireAdmin();

    // Build where clause based on role
    const whereClause: any = {
      role: 'parent',
    };

    // If clinic manager, filter by their clinic
    if (user.role === 'clinic_manager' && user.clinicId) {
      whereClause.clinicId = user.clinicId;
    }

    // Fetch parents with related data
    const parents = await prisma.user.findMany({
      where: whereClause,
      include: {
        clinic: {
          select: {
            name: true,
            code: true,
          },
        },
        subscription: {
          include: {
            carePlan: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
        parentProfile: {
          include: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data for CSV export
    const exportData = parents.map(parent => ({
      id: parent.id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone || '',
      isActive: parent.isActive ? 'Active' : 'Pending',
      clinicName: parent.clinic?.name || '',
      clinicCode: parent.clinic?.code || '',
      subscriptionStatus: parent.subscription?.status || 'None',
      planName: parent.subscription?.carePlan?.name || '',
      planPrice: parent.subscription?.carePlan?.price || 0,
      childrenCount: parent.parentProfile?._count.children || 0,
      createdAt: new Date(parent.createdAt).toISOString().split('T')[0],
    }));

    return NextResponse.json({
      data: exportData,
      count: exportData.length,
      timestamp: new Date().toISOString(),
      filteredBy: user.role === 'clinic_manager' ? 'clinic' : 'all',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Export parents error:', error);
    return NextResponse.json(
      { error: 'Failed to export parents data' },
      { status: 500 }
    );
  }
}
