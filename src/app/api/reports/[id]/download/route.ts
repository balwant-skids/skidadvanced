/**
 * Report Download API
 * GET /api/reports/[id]/download - Get signed URL for report download
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportId = params.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get report with child and parent info
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        child: {
          include: {
            parent: {
              include: { user: true }
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Check permissions
    const isAdmin = user.role === 'ADMIN' && user.clinicId === report.child.parent.clinicId;
    const isParent = report.child.parent.userId === user.id;

    if (!isAdmin && !isParent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await getSignedDownloadUrl(report.fileUrl, 3600);

    return NextResponse.json({
      downloadUrl: signedUrl,
      filename: report.title,
      contentType: report.fileType,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Report download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
