import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/parenting/search-service';
import { ContentValidation } from '@/lib/parenting/content-utils';

/**
 * GET /api/parenting/content/search - Advanced content search
 * 
 * Requirements: 1.3, 7.1
 * - Advanced search with multiple filters
 * - Return relevance-scored results
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
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
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    const includeArchived = searchParams.get('includeArchived') === 'true';

    // Validate search parameters
    const validation = ContentValidation.validateSearchQuery({
      ageGroupMin: ageGroupMin ? parseInt(ageGroupMin) : undefined,
      ageGroupMax: ageGroupMax ? parseInt(ageGroupMax) : undefined,
      limit,
      offset,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid search parameters', 
          code: 'VALIDATION_ERROR',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Build advanced search query
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
      sortBy,
      sortOrder,
      includeArchived,
    };

    // Perform advanced search
    const results = await SearchService.searchContentAdvanced(searchQuery);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        limit,
        offset,
        total: results.length, // TODO: Get actual total count
      },
      searchQuery: {
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
        includeArchived,
      },
    });

  } catch (error) {
    console.error('Error performing advanced search:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/content/search - Faceted search with complex filters
 * 
 * Requirements: 1.3, 7.1
 * - Support complex search queries in request body
 * - Return faceted results with counts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate search query structure
    const {
      searchTerm,
      categories,
      contentTypes,
      expertLevels,
      ageRanges,
      tags,
      limit = 20,
      offset = 0,
    } = body;

    // Validate parameters
    if (limit > 100) {
      return NextResponse.json(
        { 
          error: 'Limit cannot exceed 100', 
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Perform faceted search
    const results = await SearchService.facetedSearch({
      searchTerm,
      categories,
      contentTypes,
      expertLevels,
      ageRanges,
      tags,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: results.content,
      facets: results.facets,
      pagination: {
        limit,
        offset,
        total: results.total,
      },
      searchQuery: body,
    });

  } catch (error) {
    console.error('Error performing faceted search:', error);
    
    return NextResponse.json(
      { 
        error: 'Faceted search failed', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}