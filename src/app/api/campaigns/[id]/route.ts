/**
 * Campaign Detail API Routes
 * GET /api/campaigns/[id] - Get campaign details
 * PATCH /api/campaigns/[id] - Update campaign
 * DELETE /api/campaigns/[id] - Delete/archive campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notifyNewCampaign } from '@/lib/notification-triggers';

// GET - Get campaign details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Increment view count for non-admin users
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (user && user.role === 'parent') {
      await prisma.campaign.update({
        where: { id: params.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      campaign: {
        ...campaign,
        content: JSON.parse(campaign.content || '{}'),
        targetIds: JSON.parse(campaign.targetIds || '[]'),
      },
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to get campaign' },
      { status: 500 }
    );
  }
}

// PATCH - Update campaign (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && user.role !== 'clinic_manager' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Verify user has access to this campaign
    if (campaign.clinicId && campaign.clinicId !== user.clinicId && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      content,
      mediaUrl,
      mediaType,
      targetAudience,
      targetIds,
      ctaText,
      ctaUrl,
      startDate,
      endDate,
      status,
    } = body;

    const wasInactive = campaign.status !== 'active';
    const willBeActive = status === 'active';

    const updatedCampaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content: JSON.stringify(content) }),
        ...(mediaUrl !== undefined && { mediaUrl }),
        ...(mediaType !== undefined && { mediaType }),
        ...(targetAudience && { targetAudience }),
        ...(targetIds && { targetIds: JSON.stringify(targetIds) }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaUrl !== undefined && { ctaUrl }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(status && { status }),
      },
    });

    // Send notifications if campaign just became active
    if (wasInactive && willBeActive) {
      notifyNewCampaign(updatedCampaign.id).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        status: updatedCampaign.status,
        updatedAt: updatedCampaign.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Archive campaign (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && user.role !== 'clinic_manager' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Verify user has access
    if (campaign.clinicId && campaign.clinicId !== user.clinicId && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Archive instead of hard delete
    await prisma.campaign.update({
      where: { id: params.id },
      data: { status: 'archived' },
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign archived successfully',
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
