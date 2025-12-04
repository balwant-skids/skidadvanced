import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForumService } from '@/lib/parenting/forum-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/community/posts/[id]/reply - Reply to post
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
    const { content, parentReplyId } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const reply = await ForumService.replyToPost({
      postId: params.id,
      authorId: userId,
      content,
      parentReplyId,
    });

    return NextResponse.json({
      success: true,
      data: reply,
      message: 'Reply created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}