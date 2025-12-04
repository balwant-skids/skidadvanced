import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Verify user is super admin
    await requireAdmin();

    const { parentId, planId } = await request.json();

    if (!parentId || !planId) {
      return NextResponse.json(
        { error: 'Parent ID and Plan ID are required' },
        { status: 400 }
      );
    }

    // Update user: set isActive = true and assign plan
    const updatedUser = await prisma.user.update({
      where: { id: parentId },
      data: {
        isActive: true,
        planId: planId,
      },
      include: {
        assignedPlan: true,
      },
    });

    // TODO: Send approval confirmation email
    // await sendApprovalEmail(updatedUser.email, updatedUser.name);

    return NextResponse.json({
      success: true,
      message: 'Parent approved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        plan: updatedUser.assignedPlan?.name,
      },
    });
  } catch (error: any) {
    console.error('Error approving parent:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to approve parent' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
