import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AssessmentService } from '@/lib/parenting/assessment-service';

/**
 * GET /api/parenting/assessments/results/[parentId] - Get assessment results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { parentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user can access these results
    if (userId !== params.parentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId') || undefined;

    const results = await AssessmentService.getResults(params.parentId, assessmentId);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment results' },
      { status: 500 }
    );
  }
}