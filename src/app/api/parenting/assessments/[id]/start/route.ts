import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AssessmentService } from '@/lib/parenting/assessment-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/assessments/[id]/start - Start assessment session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await AssessmentService.startAssessment(params.id, userId);

    return NextResponse.json({
      success: true,
      data: session,
      message: 'Assessment session started',
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json(
      { error: 'Failed to start assessment' },
      { status: 500 }
    );
  }
}