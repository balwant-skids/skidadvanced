import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ContentService } from '@/lib/parenting/content-service';

/**
 * POST /api/parenting/content/[id]/publish - Publish content
 * 
 * Requirements: 1.4, 11.3
 * - Change status to published
 * - Trigger notifications to subscribers
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const contentId = params.id;

    // TODO: Add role validation (admin/expert only)
    // For now, we'll allow any authenticated user to publish content
    
    // Get current content to verify ownership or permissions
    const currentContent = await ContentService.getContent(contentId);
    
    if (!currentContent) {
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user is the author or has admin permissions
    if (currentContent.authorId !== userId) {
      // TODO: Add admin role check here
      return NextResponse.json(
        { error: 'Forbidden - You can only publish your own content', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Check if content is in a publishable state
    if (currentContent.status === 'published') {
      return NextResponse.json(
        { error: 'Content is already published', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    if (currentContent.status === 'archived') {
      return NextResponse.json(
        { error: 'Cannot publish archived content', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    // Publish content
    const publishedContent = await ContentService.publishContent(contentId);

    // TODO: Trigger notifications to subscribers
    // This would involve:
    // 1. Finding users who are subscribed to this content category
    // 2. Sending notifications through their preferred channels
    // 3. Updating recommendation profiles

    return NextResponse.json({
      success: true,
      data: publishedContent,
      message: 'Content published successfully',
    });

  } catch (error) {
    console.error('Error publishing content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to publish content', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parenting/content/[id]/publish - Unpublish content (archive)
 * 
 * Requirements: 11.3
 * - Change status from published to archived
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const contentId = params.id;

    // Get current content to verify ownership or permissions
    const currentContent = await ContentService.getContent(contentId);
    
    if (!currentContent) {
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user is the author or has admin permissions
    if (currentContent.authorId !== userId) {
      // TODO: Add admin role check here
      return NextResponse.json(
        { error: 'Forbidden - You can only unpublish your own content', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Check if content is published
    if (currentContent.status !== 'published') {
      return NextResponse.json(
        { error: 'Content is not published', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    // Archive content
    const archivedContent = await ContentService.archiveContent(contentId);

    return NextResponse.json({
      success: true,
      data: archivedContent,
      message: 'Content unpublished successfully',
    });

  } catch (error) {
    console.error('Error unpublishing content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to unpublish content', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}