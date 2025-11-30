import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ResourceService } from '@/lib/parenting/resource-service';

/**
 * GET /api/parenting/collections - Get user's collections
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collections = await ResourceService.getUserCollections(userId);

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/collections - Create or update collection
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, resourceIds } = body;

    if (!name || !resourceIds || !Array.isArray(resourceIds)) {
      return NextResponse.json(
        { error: 'Collection name and resource IDs are required' },
        { status: 400 }
      );
    }

    const collection = await ResourceService.createCollection(userId, name, resourceIds);

    return NextResponse.json({
      success: true,
      data: collection,
      message: 'Collection created successfully',
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}