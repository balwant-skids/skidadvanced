/**
 * Appointment API Routes for Children
 * POST /api/children/[id]/appointments - Schedule an appointment
 * GET /api/children/[id]/appointments - List appointments for a child
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Schedule an appointment for a child
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.id;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify child exists and user has access
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        parent: {
          include: { user: true },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Check permissions
    const isAdmin = user.role === 'ADMIN' && user.clinicId === child.parent.clinicId;
    const isParent = child.parent.userId === user.id;

    if (!isAdmin && !isParent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      type,
      title,
      description,
      scheduledAt,
      duration = 30,
      notes,
    } = body;

    if (!type || !scheduledAt) {
      return NextResponse.json(
        { error: 'Type and scheduledAt are required' },
        { status: 400 }
      );
    }

    // Validate scheduled date is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Appointment must be scheduled in the future' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        type,
        title,
        description,
        scheduledAt: scheduledDate,
        duration,
        notes,
        childId,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        type: appointment.type,
        title: appointment.title,
        scheduledAt: appointment.scheduledAt,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// GET - List appointments for a child
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.id;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        parent: {
          include: { user: true },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Check permissions
    const isAdmin = user.role === 'ADMIN' && user.clinicId === child.parent.clinicId;
    const isParent = child.parent.userId === user.id;

    if (!isAdmin && !isParent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    const whereClause: any = { childId };

    if (status) {
      whereClause.status = status;
    }

    if (upcoming) {
      whereClause.scheduledAt = { gte: new Date() };
      whereClause.status = { in: ['scheduled', 'confirmed'] };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { scheduledAt: 'asc' },
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
