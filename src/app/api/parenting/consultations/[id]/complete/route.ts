import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * POST /api/parenting/consultations/[id]/complete - Complete consultation session
 * 
 * Requirements: 2.4, 2.5
 * - Generate summary and action items
 * - Enable follow-up scheduling
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const consultationId = params.id;
    const body = await request.json();

    // Get consultation to verify permissions
    const consultation = await ExpertService.getConsultation(consultationId);
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify user is the expert for this consultation
    const expert = await ExpertService.getExpertByUserId(userId);
    if (!expert || expert.id !== consultation.expertId) {
      return NextResponse.json(
        { error: 'Only the assigned expert can complete this consultation', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Verify consultation is in progress or scheduled
    if (!['scheduled', 'in_progress'].includes(consultation.status)) {
      return NextResponse.json(
        { error: 'Consultation cannot be completed in its current state', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    const { notes, actionItems, followUpNeeded, rating, feedback } = body;

    // Update consultation to completed status
    const updatedConsultation = await ExpertService.updateConsultation(consultationId, {
      status: 'completed',
      notes: notes?.trim(),
      actionItems: actionItems || [],
      followUpNeeded: followUpNeeded || false,
      rating: rating || undefined,
      feedback: feedback?.trim(),
    });

    // Generate AI summary
    let summary = null;
    try {
      summary = await ExpertService.generateConsultationSummary(consultationId);
    } catch (error) {
      console.warn('Failed to generate consultation summary:', error);
      // Summary generation is optional, don't fail the request
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedConsultation,
        actionItems: updatedConsultation.actionItems ? JSON.parse(updatedConsultation.actionItems) : [],
        summary,
        expert: {
          ...updatedConsultation.expert,
          specializations: JSON.parse(updatedConsultation.expert.specializations || '[]'),
          credentials: JSON.parse(updatedConsultation.expert.credentials || '[]'),
          languages: JSON.parse(updatedConsultation.expert.languages || '[]'),
        },
      },
      message: 'Consultation completed successfully',
    });

  } catch (error) {
    console.error('Error completing consultation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to complete consultation', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/parenting/consultations/[id]/complete - Update consultation details
 * 
 * Requirements: 2.4, 2.5
 * - Update notes, action items, and follow-up status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const consultationId = params.id;
    const body = await request.json();

    // Get consultation to verify permissions
    const consultation = await ExpertService.getConsultation(consultationId);
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify user is either the expert or the parent
    const expert = await ExpertService.getExpertByUserId(userId);
    const isExpert = expert && expert.id === consultation.expertId;
    const isParent = consultation.parentId === userId;

    if (!isExpert && !isParent) {
      return NextResponse.json(
        { error: 'Access denied', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Parents can only update rating and feedback for completed consultations
    if (isParent && !isExpert) {
      if (consultation.status !== 'completed') {
        return NextResponse.json(
          { error: 'Can only rate completed consultations', code: 'CONFLICT' },
          { status: 409 }
        );
      }

      const { rating, feedback } = body;
      
      if (rating && (rating < 1 || rating > 5)) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5', code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }

      const updatedConsultation = await ExpertService.updateConsultation(consultationId, {
        rating: rating || undefined,
        feedback: feedback?.trim(),
      });

      return NextResponse.json({
        success: true,
        data: {
          ...updatedConsultation,
          actionItems: updatedConsultation.actionItems ? JSON.parse(updatedConsultation.actionItems) : [],
        },
        message: 'Consultation feedback updated successfully',
      });
    }

    // Experts can update all fields
    const { notes, actionItems, followUpNeeded, summary } = body;

    const updatedConsultation = await ExpertService.updateConsultation(consultationId, {
      notes: notes?.trim(),
      actionItems: actionItems || undefined,
      followUpNeeded: followUpNeeded || undefined,
      summary: summary?.trim(),
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedConsultation,
        actionItems: updatedConsultation.actionItems ? JSON.parse(updatedConsultation.actionItems) : [],
        expert: {
          ...updatedConsultation.expert,
          specializations: JSON.parse(updatedConsultation.expert.specializations || '[]'),
          credentials: JSON.parse(updatedConsultation.expert.credentials || '[]'),
          languages: JSON.parse(updatedConsultation.expert.languages || '[]'),
        },
      },
      message: 'Consultation updated successfully',
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update consultation', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}