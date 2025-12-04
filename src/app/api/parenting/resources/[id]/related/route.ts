import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ResourceService } from '@/lib/parenting/resource-service';

/**
 * GET /api/parenting/resources/[id]/related - Get related resources
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const relatedResources = await ResourceService.getRelatedResources(params.id, limit);

    return NextResponse.json({
      success: true,
      data: relatedResources,
    });
  } catch (error) {
    console.error('Error fetching related resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related resources' },
      { status: 500 }
    );
  }
}