import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get stats
    const [totalClinics, totalAdmins, totalParents, totalChildren] = await Promise.all([
      prisma.clinic.count(),
      prisma.user.count({ where: { role: { in: ['super_admin', 'admin'] } } }),
      prisma.user.count({ where: { role: 'parent' } }),
      prisma.child.count(),
    ]);

    return NextResponse.json({
      totalClinics,
      totalAdmins,
      totalParents,
      totalChildren,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
