import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForumService } from '@/lib/parenting/forum-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/community/flag - Flag inappropriate content
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentId, reason, contentType } = body;

    if (!contentId || !reason) {
      return NextResponse.json(
        { error: 'Content ID and reason are required' },
        { status: 400 }
      );
    }

    if (!['post', 'reply'].includes(contentType)) {
      return NextResponse.json(
        { error: 'Content type must be "post" or "reply"' },
        { status: 400 }
      );
    }

    await ForumService.flagContent(contentId, reason, contentType);

    return NextResponse.json({
      success: true,
      message: 'Content flagged for moderation',
    });
  } catch (error) {
    console.error('Error flagging content:', error);
    return NextResponse.json(
      { error: 'Failed to flag content' },
      { status: 500 }
    );
  }
}