import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * POST /api/parenting/consultations/[id]/follow-up - Request follow-up consultation
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

    const consultation = await ExpertService.getConsultation(params.id);
    
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    // Check if user has access to request follow-up
    const hasAccess = consultation.parentId === userId || 
                     consultation.expert.userId === userId;
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Can only request follow-up for completed consultations
    if (consultation.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only request follow-up for completed consultations' },
        { status: 400 }
      );
    }

    const updatedConsultation = await ExpertService.requestFollowUp(params.id);

    return NextResponse.json({
      success: true,
      data: updatedConsultation,
      message: 'Follow-up consultation requested successfully',
    });
  } catch (error) {
    console.error('Error requesting follow-up:', error);
    return NextResponse.json(
      { error: 'Failed to request follow-up consultation' },
      { status: 500 }
    );
  }
}