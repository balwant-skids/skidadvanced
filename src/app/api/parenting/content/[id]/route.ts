import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentService } from '@/lib/parenting/content-service';
import { ContentValidation } from '@/lib/parenting/content-utils';
import { UpdateContentInput } from '@/types/parenting';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/content/[id] - Get specific content by ID
 * 
 * Requirements: 1.1
 * - Return content with author information and engagement data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id;
    
    // Get content
    const content = await ContentService.getContent(contentId);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if content is published or user has access
    const { userId } = auth();
    const isAuthor = userId && content.authorId === userId;
    const isPublished = content.status === 'published';
    
    if (!isPublished && !isAuthor) {
      // TODO: Add admin role check here
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get content statistics if user is authenticated
    let stats = null;
    if (userId) {
      try {
        stats = await ContentService.getContentStats(contentId);
      } catch (error) {
        // Stats are optional, don't fail the request
        console.warn('Failed to fetch content stats:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...content,
        stats,
      },
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch content', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/parenting/content/[id] - Update content
 * 
 * Requirements: 11.2
 * - Update content fields
 * - Maintain approval workflow
 */
export async function PUT(
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
    const body = await request.json();

    // Get current content to verify ownership
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
        { error: 'Forbidden - You can only edit your own content', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Validate update data
    const validation = ContentValidation.validateUpdateContent(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: UpdateContentInput = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.contentType !== undefined) updateData.contentType = body.contentType;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.ageGroupMin !== undefined) updateData.ageGroupMin = body.ageGroupMin;
    if (body.ageGroupMax !== undefined) updateData.ageGroupMax = body.ageGroupMax;
    if (body.expertLevel !== undefined) updateData.expertLevel = body.expertLevel;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.status !== undefined) updateData.status = body.status;

    // If content is published and being modified, move it back to review
    if (currentContent.status === 'published' && 
        (body.title || body.description || body.content)) {
      updateData.status = 'review';
    }

    // Update content
    const updatedContent = await ContentService.updateContent(contentId, updateData);

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully',
    });

  } catch (error) {
    console.error('Error updating content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update content', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parenting/content/[id] - Delete content
 * 
 * Requirements: 11.2
 * - Soft delete by archiving content
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

    // Get current content to verify ownership
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
        { error: 'Forbidden - You can only delete your own content', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Archive content (soft delete)
    const archivedContent = await ContentService.archiveContent(contentId);

    return NextResponse.json({
      success: true,
      data: archivedContent,
      message: 'Content deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete content', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}