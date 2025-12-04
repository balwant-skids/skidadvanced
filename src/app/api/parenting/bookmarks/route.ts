import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ResourceService } from '@/lib/parenting/resource-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/bookmarks - Get user's bookmarked resources
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    const bookmarks = await ResourceService.getUserBookmarks(userId, collection, tags);

    return NextResponse.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}