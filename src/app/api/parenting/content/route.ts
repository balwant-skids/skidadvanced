import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentService } from '@/lib/parenting/content-service';
import { ContentValidation } from '@/lib/parenting/content-utils';
import { CreateContentInput } from '@/types/parenting';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/parenting/content - Create new parenting content
 * 
 * Requirements: 11.1, 11.3
 * - Validate admin/expert role
 * - Support rich text and multimedia content
 * - Return created content with approval status
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validation = ContentValidation.validateCreateContent(body);
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

    // TODO: Add role validation (admin/expert only)
    // For now, we'll allow any authenticated user to create content
    
    const contentData: CreateContentInput = {
      title: body.title,
      description: body.description,
      content: body.content,
      contentType: body.contentType,
      category: body.category,
      ageGroupMin: body.ageGroupMin,
      ageGroupMax: body.ageGroupMax,
      expertLevel: body.expertLevel || 'beginner',
      tags: body.tags || [],
      authorId: userId,
    };

    // Create content
    const content = await ContentService.createContent(contentData);

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Content created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating content:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/parenting/content - List and search parenting content
 * 
 * Requirements: 1.1, 7.2
 * - Filter by category, age group, content type
 * - Support pagination and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const contentType = searchParams.get('contentType');
    const ageGroupMin = searchParams.get('ageGroupMin');
    const ageGroupMax = searchParams.get('ageGroupMax');
    const expertLevel = searchParams.get('expertLevel');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const status = searchParams.get('status') || 'published';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate query parameters
    const queryValidation = ContentValidation.validateSearchQuery({
      ageGroupMin: ageGroupMin ? parseInt(ageGroupMin) : undefined,
      ageGroupMax: ageGroupMax ? parseInt(ageGroupMax) : undefined,
      limit,
      offset,
    });

    if (!queryValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          code: 'VALIDATION_ERROR',
          details: queryValidation.errors 
        },
        { status: 400 }
      );
    }

    // Build search query
    const searchQuery = {
      query: query || undefined,
      category: category || undefined,
      contentType: contentType || undefined,
      ageGroupMin: ageGroupMin ? parseInt(ageGroupMin) : undefined,
      ageGroupMax: ageGroupMax ? parseInt(ageGroupMax) : undefined,
      expertLevel: expertLevel || undefined,
      tags: tags || undefined,
      status,
      limit,
      offset,
    };

    // Search content
    const content = await ContentService.searchContent(searchQuery);

    return NextResponse.json({
      success: true,
      data: content,
      pagination: {
        limit,
        offset,
        total: content.length, // TODO: Get actual total count
      },
      filters: {
        query,
        category,
        contentType,
        ageGroupMin,
        ageGroupMax,
        expertLevel,
        tags,
        status,
        sortBy,
        sortOrder,
      },
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}