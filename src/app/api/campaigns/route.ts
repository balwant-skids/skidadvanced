/**
 * Campaign API Routes
 * POST /api/campaigns - Create a new campaign
 * GET /api/campaigns - List campaigns (filtered by role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notifyNewCampaign } from '@/lib/notification-triggers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Create a new campaign (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and verify admin role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && user.role !== 'clinic_manager' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      content,
      mediaUrl,
      mediaType,
      targetAudience = 'all',
      targetIds = [],
      ctaText,
      ctaUrl,
      startDate,
      endDate,
      status = 'draft',
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        content: JSON.stringify(content || {}),
        mediaUrl,
        mediaType,
        targetAudience,
        targetIds: JSON.stringify(targetIds),
        ctaText,
        ctaUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        clinicId: user.clinicId, // Associate with user's clinic
      },
    });

    // If campaign is active, send notifications
    if (status === 'active') {
      notifyNewCampaign(campaign.id).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        title: campaign.title,
        status: campaign.status,
        createdAt: campaign.createdAt,
      },
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}


// GET - List campaigns (filtered by role and targeting)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause based on user role
    const isAdmin = user.role === 'ADMIN' || user.role === 'clinic_manager' || user.role === 'super_admin';

    let whereClause: any = {};

    if (isAdmin) {
      // Admins see all campaigns for their clinic
      whereClause = {
        OR: [
          { clinicId: user.clinicId },
          { clinicId: null }, // Global campaigns
        ],
      };
    } else {
      // Parents see only active campaigns targeted to them
      whereClause = {
        status: 'active',
        OR: [
          { targetAudience: 'all' },
          { 
            targetAudience: 'clinic',
            clinicId: user.clinicId,
          },
          // Plan-based targeting
          ...(user.subscription?.carePlanId ? [{
            targetAudience: 'plan',
            targetIds: {
              contains: user.subscription.carePlanId,
            },
          }] : []),
        ],
        // Only show campaigns within date range
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: new Date() } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } },
            ],
          },
        ],
      };
    }

    // Add status filter if provided
    if (status && isAdmin) {
      whereClause.status = status;
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          mediaUrl: true,
          mediaType: true,
          ctaText: true,
          ctaUrl: true,
          status: true,
          targetAudience: true,
          startDate: true,
          endDate: true,
          viewCount: true,
          clickCount: true,
          createdAt: true,
        },
      }),
      prisma.campaign.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      campaigns,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + campaigns.length < total,
      },
    });
  } catch (error) {
    console.error('List campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to list campaigns' },
      { status: 500 }
    );
  }
}
