import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ForumService } from '@/lib/parenting/forum-service';

/**
 * POST /api/parenting/community/replies/[id]/vote - Vote on reply
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
    const { vote } = body;

    if (!vote || !['up', 'down'].includes(vote)) {
      return NextResponse.json(
        { error: 'Vote must be "up" or "down"' },
        { status: 400 }
      );
    }

    await ForumService.voteOnReply(params.id, userId, vote);

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Error voting on reply:', error);
    return NextResponse.json(
      { error: 'Failed to vote on reply' },
      { status: 500 }
    );
  }
}