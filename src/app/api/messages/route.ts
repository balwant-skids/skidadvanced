/**
 * Messages API Routes
 * POST /api/messages - Send a message
 * GET /api/messages - Get conversation messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notifyNewMessage } from '@/lib/notification-triggers';

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.clinicId) {
      return NextResponse.json(
        { error: 'User not associated with a clinic' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, childId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const isFromParent = user.role === 'parent';

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        isFromParent,
        senderId: user.id,
        clinicId: user.clinicId,
        childId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Send notification to recipient(s)
    if (isFromParent) {
      // Notify clinic manager
      const clinicManager = await prisma.user.findFirst({
        where: {
          clinicId: user.clinicId,
          role: { in: ['ADMIN', 'clinic_manager'] },
        },
      });
      if (clinicManager) {
        notifyNewMessage(clinicManager.id, user.name, content).catch(console.error);
      }
    } else {
      // Notify parent (find parent associated with the child or clinic)
      if (childId) {
        const child = await prisma.child.findUnique({
          where: { id: childId },
          include: {
            parent: {
              include: { user: true },
            },
          },
        });
        if (child?.parent.user) {
          notifyNewMessage(child.parent.user.id, user.name, content).catch(console.error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        isFromParent: message.isFromParent,
        createdAt: message.createdAt,
        sender: message.sender,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}


// GET - Get conversation messages
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.clinicId) {
      return NextResponse.json({ messages: [] });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination

    const whereClause: any = {
      clinicId: user.clinicId,
    };

    // Filter by child if specified
    if (childId) {
      whereClause.childId = childId;
    }

    // For parents, only show their own messages
    if (user.role === 'parent') {
      whereClause.OR = [
        { senderId: user.id },
        { isFromParent: false }, // Messages from clinic to them
      ];
    }

    // Pagination
    if (before) {
      whereClause.createdAt = { lt: new Date(before) };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Mark messages as read
    const unreadMessageIds = messages
      .filter(m => !m.isRead && m.senderId !== user.id)
      .map(m => m.id);

    if (unreadMessageIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadMessageIds } },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}
