/**
 * Appointments API Routes
 * GET /api/appointments - List all upcoming appointments for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - List all upcoming appointments for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        parentProfile: {
          include: {
            children: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeCompleted = searchParams.get('includeCompleted') === 'true';

    let whereClause: any = {};

    if (user.role === 'parent' && user.parentProfile) {
      // Parents see appointments for their children
      const childIds = user.parentProfile.children.map(c => c.id);
      whereClause = {
        childId: { in: childIds },
        scheduledAt: { gte: new Date() },
      };

      if (!includeCompleted) {
        whereClause.status = { in: ['scheduled', 'confirmed'] };
      }
    } else if (user.role === 'ADMIN' || user.role === 'clinic_manager') {
      // Admins see all appointments for their clinic's children
      whereClause = {
        child: {
          parent: {
            clinicId: user.clinicId,
          },
        },
        scheduledAt: { gte: new Date() },
      };

      if (!includeCompleted) {
        whereClause.status = { in: ['scheduled', 'confirmed'] };
      }
    } else {
      return NextResponse.json({ appointments: [] });
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { scheduledAt: 'asc' },
      take: limit,
      include: {
        child: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('List appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to list appointments' },
      { status: 500 }
    );
  }
}
