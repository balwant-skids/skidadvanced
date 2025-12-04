import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/export/clinics
 * Export all clinics data as JSON (client will convert to CSV)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    // Fetch all clinics with related data
    const clinics = await prisma.clinic.findMany({
      include: {
        manager: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            parents: true,
            whitelist: true,
            users: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data for CSV export
    const exportData = clinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      code: clinic.code,
      address: clinic.address || '',
      phone: clinic.phone || '',
      email: clinic.email || '',
      whatsappNumber: clinic.whatsappNumber || '',
      isActive: clinic.isActive ? 'Active' : 'Inactive',
      managerName: clinic.manager?.name || '',
      managerEmail: clinic.manager?.email || '',
      parentCount: clinic._count.parents,
      whitelistCount: clinic._count.whitelist,
      userCount: clinic._count.users,
      createdAt: new Date(clinic.createdAt).toISOString().split('T')[0],
    }));

    return NextResponse.json({
      data: exportData,
      count: exportData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Export clinics error:', error);
    return NextResponse.json(
      { error: 'Failed to export clinics data' },
      { status: 500 }
    );
  }
}
