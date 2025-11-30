import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { RecommendationService } from '@/lib/parenting/recommendation-service';

/**
 * GET /api/parenting/recommendations/[parentId] - Get personalized recommendations
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

    // Verify user can access these recommendations
    if (userId !== params.parentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType')?.split(',') || undefined;
    const category = searchParams.get('category')?.split(',') || undefined;
    const ageGroup = searchParams.get('ageGroup') || undefined;
    const priority = (searchParams.get('priority') as 'high' | 'medium' | 'low') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const recommendations = await RecommendationService.generateRecommendations(
      params.parentId,
      {
        contentType,
        category,
        ageGroup,
        priority,
        limit,
      }
    );

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}