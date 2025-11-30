import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ForumService } from '@/lib/parenting/forum-service';

/**
 * GET /api/parenting/community/groups - Get recommended community groups
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await ForumService.getRecommendedGroups(userId);

    return NextResponse.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error('Error fetching community groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community groups' },
      { status: 500 }
    );
  }
}