import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ForumService } from '@/lib/parenting/forum-service';

/**
 * GET /api/parenting/community/posts - List forum posts
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const childAgeGroup = searchParams.get('childAgeGroup') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const status = searchParams.get('status') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'popular' | 'replies') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await ForumService.getPosts({
      category,
      childAgeGroup,
      tags,
      status,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        limit,
        offset,
        total: posts.length,
      },
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/community/posts - Create forum post
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, tags, childAgeGroup, isAnonymous } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    const post = await ForumService.createPost({
      authorId: userId,
      title,
      content,
      category,
      tags,
      childAgeGroup,
      isAnonymous,
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Forum post created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}