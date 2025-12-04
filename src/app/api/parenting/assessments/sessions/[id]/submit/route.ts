import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AssessmentService } from '@/lib/parenting/assessment-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/assessments/sessions/[id]/submit - Submit assessment response
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

    const body = await request.json();
    const { questionId, answer } = body;

    if (!questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'Question ID and answer are required' },
        { status: 400 }
      );
    }

    const result = await AssessmentService.submitResponse(params.id, questionId, answer);

    if (result.isComplete) {
      // Complete the assessment and generate results
      const assessmentResult = await AssessmentService.completeAssessment(params.id);
      
      return NextResponse.json({
        success: true,
        data: {
          ...result,
          assessmentResult,
        },
        message: 'Assessment completed successfully',
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting assessment response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}