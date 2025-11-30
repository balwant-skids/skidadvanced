import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { AssessmentService } from '@/lib/parenting/assessment-service';

/**
 * GET /api/parenting/assessments - List available assessments
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const assessments = await AssessmentService.getAssessments(category);

    return NextResponse.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/assessments - Create new assessment (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check
    
    const body = await request.json();
    const { title, description, category, questions, scoringRubric } = body;

    if (!title || !description || !category || !questions || !scoringRubric) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const assessment = await AssessmentService.createAssessment({
      title,
      description,
      category,
      questions,
      scoringRubric,
    });

    return NextResponse.json({
      success: true,
      data: assessment,
      message: 'Assessment created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}