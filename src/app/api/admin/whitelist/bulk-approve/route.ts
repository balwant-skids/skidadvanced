import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface BulkApproveRequest {
  parentIds: string[];
  planId: string;
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
 * POST /api/admin/whitelist/bulk-approve
 * Bulk approve pending parents and assign them a care plan
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const body: BulkApproveRequest = await req.json();
    const { parentIds, planId } = body;

    // Validation
    if (!parentIds || !Array.isArray(parentIds) || parentIds.length === 0) {
      return NextResponse.json(
        { error: 'Parent IDs array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required for bulk approval' },
        { status: 400 }
      );
    }

    // Verify plan exists
    const plan = await prisma.carePlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 404 }
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
            // Get user details
            const user = await prisma.user.findUnique({
              where: { id: parentId },
              select: { id: true, name: true, email: true, isActive: true },
            });

            if (!user) {
              throw new Error('User not found');
            }

            if (user.isActive) {
              throw new Error('User is already active');
            }

            // Update user in a transaction
            await prisma.$transaction(async (tx) => {
              // Activate user and assign plan
              await tx.user.update({
                where: { id: parentId },
                data: {
                  isActive: true,
                  planId: planId,
                },
              });

              // Create subscription
              await tx.subscription.create({
                data: {
                  userId: parentId,
                  carePlanId: planId,
                  status: 'active',
                  startDate: new Date(),
                },
              });
            });

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
    console.error('Bulk approve error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk approval' },
      { status: 500 }
    );
  }
}
