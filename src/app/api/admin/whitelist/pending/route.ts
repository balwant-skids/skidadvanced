import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Verify user is super admin
    await requireAdmin();

    // Fetch all pending parents (isActive = false, role = parent)
    const pendingParents = await prisma.user.findMany({
      where: {
        role: 'parent',
        isActive: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc', // Oldest first
      },
    });

    return NextResponse.json({
      parents: pendingParents,
      count: pendingParents.length,
    });
  } catch (error: any) {
    console.error('Error fetching pending parents:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch pending parents' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
