import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentWorkflowService } from '@/lib/parenting/content-workflow-service';

/**
 * GET /api/parenting/admin/content/stale - Get stale content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check

    const staleContent = await ContentWorkflowService.monitorContentFreshness();

    return NextResponse.json({
      success: true,
      data: staleContent,
    });
  } catch (error) {
    console.error('Error fetching stale content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stale content' },
      { status: 500 }
    );
  }
}