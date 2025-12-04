import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth-helpers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Verify user is super admin
    await requireAdmin();

    const { parentId } = await request.json();

    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID is required' },
        { status: 400 }
      );
    }

    // Get user details before deletion
    const user = await prisma.user.findUnique({
      where: { id: parentId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the user account
    await prisma.user.delete({
      where: { id: parentId },
    });

    // TODO: Send rejection notification email
    // await sendRejectionEmail(user.email, user.name);

    return NextResponse.json({
      success: true,
      message: 'Parent rejected and account deleted',
    });
  } catch (error: any) {
    console.error('Error rejecting parent:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to reject parent' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
