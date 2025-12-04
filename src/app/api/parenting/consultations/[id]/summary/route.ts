import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

/**
 * POST /api/parenting/consultations/[id]/summary - Generate consultation summary
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

    // Only experts can generate summaries
    if (consultation.expert.userId !== userId) {
      return NextResponse.json({ error: 'Only the expert can generate summaries' }, { status: 403 });
    }

    // Can only generate summary for completed consultations
    if (consultation.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only generate summary for completed consultations' },
        { status: 400 }
      );
    }

    const summary = await ExpertService.generateConsultationSummary(params.id);

    return NextResponse.json({
      success: true,
      data: {
        consultationId: params.id,
        summary,
      },
    });
  } catch (error) {
    console.error('Error generating consultation summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate consultation summary' },
      { status: 500 }
    );
  }
}