import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ResourceService } from '@/lib/parenting/resource-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/resources/[id]/bookmark - Bookmark resource
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
    const { tags, notes, collection } = body;

    const bookmark = await ResourceService.bookmarkResource({
      resourceId: params.id,
      userId,
      tags,
      notes,
      collection,
    });

    return NextResponse.json({
      success: true,
      data: bookmark,
      message: 'Resource bookmarked successfully',
    });
  } catch (error) {
    console.error('Error bookmarking resource:', error);
    return NextResponse.json(
      { error: 'Failed to bookmark resource' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parenting/resources/[id]/bookmark - Remove bookmark
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ResourceService.removeBookmark(userId, params.id);

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully',
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}