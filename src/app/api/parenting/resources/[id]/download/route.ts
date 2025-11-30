import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ResourceService } from '@/lib/parenting/resource-service';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/parenting/resources/[id]/download - Download resource
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

    // Get resource details
    const resource = await prisma.parentingContent.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        contentUrl: true,
        contentType: true,
        status: true,
      },
    });

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    if (resource.status !== 'published') {
      return NextResponse.json({ error: 'Resource not available' }, { status: 403 });
    }

    // Track the download
    await ResourceService.trackDownload(params.id, userId);

    // Return download information
    return NextResponse.json({
      success: true,
      data: {
        resourceId: resource.id,
        title: resource.title,
        downloadUrl: resource.contentUrl,
        contentType: resource.contentType,
      },
      message: 'Resource ready for download',
    });
  } catch (error) {
    console.error('Error preparing resource download:', error);
    return NextResponse.json(
      { error: 'Failed to prepare resource download' },
      { status: 500 }
    );
  }
}