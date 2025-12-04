import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentWorkflowService } from '@/lib/parenting/content-workflow-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/admin/content/approve - Approve content
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin/reviewer role check

    const body = await request.json();
    const { contentId, reviewNotes, scheduledPublishAt } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const workflow = await ContentWorkflowService.approveContent(
      contentId,
      userId,
      reviewNotes,
      scheduledPublishAt ? new Date(scheduledPublishAt) : undefined
    );

    return NextResponse.json({
      success: true,
      data: workflow,
      message: 'Content approved successfully',
    });
  } catch (error) {
    console.error('Error approving content:', error);
    return NextResponse.json(
      { error: 'Failed to approve content' },
      { status: 500 }
    );
  }
}