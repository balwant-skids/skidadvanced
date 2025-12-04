import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DevelopmentService } from '@/lib/parenting/development-service';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/parenting/development/reports/[childId] - Get progress report
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: {
        id: params.childId,
        parentProfile: {
          userId,
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    const report = await DevelopmentService.generateProgressReport(params.childId);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error generating progress report:', error);
    return NextResponse.json(
      { error: 'Failed to generate progress report' },
      { status: 500 }
    );
  }
}