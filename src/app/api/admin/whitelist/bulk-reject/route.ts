import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

interface BulkRejectRequest {
  parentIds: string[];
}

interface BulkError {
  id: string;
  name: string;
  reason: string;
}

interface BulkOperationResponse {
  success: number;
  failed: number;
  errors: BulkError[];
}

/**
 * POST /api/admin/whitelist/bulk-reject
 * Bulk reject pending parents and delete their accounts
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const body: BulkRejectRequest = await req.json();
    const { parentIds } = body;

    // Validation
    if (!parentIds || !Array.isArray(parentIds) || parentIds.length === 0) {
      return NextResponse.json(
        { error: 'Parent IDs array is required and must not be empty' },
        { status: 400 }
      );
    }

    const errors: BulkError[] = [];
    let successCount = 0;

    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < parentIds.length; i += batchSize) {
      const batch = parentIds.slice(i, i + batchSize);

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (parentId) => {
          try {
            // Get user details before deletion
            const user = await prisma.user.findUnique({
              where: { id: parentId },
              select: { id: true, name: true, email: true, isActive: true },
            });

            if (!user) {
              throw new Error('User not found');
            }

            if (user.isActive) {
              throw new Error('Cannot reject an active user');
            }

            // Delete user (cascade will handle related records)
            await prisma.user.delete({
              where: { id: parentId },
            });

            // TODO: Send rejection notification email
            // await sendRejectionEmail(user.email, user.name);

            return { success: true, user };
          } catch (error) {
            throw error;
          }
        })
      );

      // Collect results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          const parentId = batch[index];
          errors.push({
            id: parentId,
            name: 'Unknown',
            reason: result.reason?.message || 'Unknown error',
          });
        }
      });
    }

    const response: BulkOperationResponse = {
      success: successCount,
      failed: errors.length,
      errors,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Bulk reject error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk rejection' },
      { status: 500 }
    );
  }
}
