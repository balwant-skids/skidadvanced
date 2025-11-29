/**
 * Report Upload API for Children
 * POST /api/children/[id]/reports - Upload a report
 * GET /api/children/[id]/reports - List reports for a child
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  uploadFile,
  generateReportKey,
  getContentType,
} from '@/lib/storage';
import { notifyReportUploaded } from '@/lib/notification-triggers';

// POST - Upload a report for a child
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.id;

    // Get user and verify permissions
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { clinic: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify child belongs to user's clinic (admin) or user is parent
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { 
        parent: {
          include: { user: true }
        }
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Check permissions: admin of same clinic or parent of child
    const isAdmin = user.role === 'ADMIN' && user.clinicId === child.parent.clinicId;
    const isParent = child.parent.userId === user.id;

    if (!isAdmin && !isParent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const reportType = formData.get('reportType') as string || 'GENERAL';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate storage key and upload
    const clinicId = child.parent.clinicId;
    const key = generateReportKey(clinicId, childId, file.name);
    const contentType = getContentType(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await uploadFile(buffer, key, contentType, {
      childId,
      uploadedBy: user.id,
      title,
    });

    // Create report record in database
    const report = await prisma.report.create({
      data: {
        title,
        description,
        fileUrl: key, // Store the R2 key, not full URL
        fileType: contentType,
        fileSize: file.size,
        reportType,
        childId,
        uploadedById: user.id,
      },
    });

    // Send notification to parent (async, don't wait)
    notifyReportUploaded(childId, title, user.name).catch(console.error);

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        title: report.title,
        description: report.description,
        fileType: report.fileType,
        fileSize: report.fileSize,
        reportType: report.reportType,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error('Report upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload report' },
      { status: 500 }
    );
  }
}


// GET - List reports for a child
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const childId = params.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify child exists and user has access
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { 
        parent: {
          include: { user: true }
        }
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Check permissions
    const isAdmin = user.role === 'ADMIN' && user.clinicId === child.parent.clinicId;
    const isParent = child.parent.userId === user.id;

    if (!isAdmin && !isParent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get reports from database
    const reports = await prisma.report.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        fileType: true,
        fileSize: true,
        reportType: true,
        createdAt: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json(
      { error: 'Failed to list reports' },
      { status: 500 }
    );
  }
}
