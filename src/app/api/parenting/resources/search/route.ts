import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ResourceService } from '@/lib/parenting/resource-service';

/**
 * GET /api/parenting/resources/search - Search resources
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const contentType = searchParams.get('contentType') || undefined;
    const ageGroup = searchParams.get('ageGroup') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const difficulty = (searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const resources = await ResourceService.searchResources(query, {
      category,
      contentType,
      ageGroup,
      tags,
      difficulty,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: resources,
      pagination: {
        limit,
        offset,
        total: resources.length,
      },
    });
  } catch (error) {
    console.error('Error searching resources:', error);
    return NextResponse.json(
      { error: 'Failed to search resources' },
      { status: 500 }
    );
  }
}