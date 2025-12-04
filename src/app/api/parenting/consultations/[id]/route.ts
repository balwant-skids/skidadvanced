import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/consultations/[id] - Get consultation details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultation = await ExpertService.getConsultation(params.id);
    
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    // Check if user has access to this consultation
    const hasAccess = consultation.parentId === userId || 
                     consultation.expert.userId === userId;
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/parenting/consultations/[id] - Update consultation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultation = await ExpertService.getConsultation(params.id);
    
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    // Check if user has access to update this consultation
    const hasAccess = consultation.parentId === userId || 
                     consultation.expert.userId === userId;
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate status transitions
    if (body.status) {
      const validTransitions = {
        'scheduled': ['in_progress', 'cancelled'],
        'in_progress': ['completed', 'cancelled'],
        'completed': [], // Cannot change from completed
        'cancelled': [], // Cannot change from cancelled
      };

      const currentStatus = consultation.status;
      if (!validTransitions[currentStatus]?.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    const updatedConsultation = await ExpertService.updateConsultation(params.id, body);

    return NextResponse.json({
      success: true,
      data: updatedConsultation,
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}