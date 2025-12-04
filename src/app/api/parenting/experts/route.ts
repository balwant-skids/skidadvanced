import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExpertService } from '@/lib/parenting/expert-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/parenting/experts - List available experts
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization') || undefined;
    const language = searchParams.get('language') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const experts = await ExpertService.getAvailableExperts(
      specialization,
      language,
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: experts,
      pagination: {
        limit,
        offset,
        total: experts.length,
      },
    });
  } catch (error) {
    console.error('Error fetching experts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parenting/experts - Create expert profile (admin/expert only)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      specializations,
      credentials,
      bio,
      availability,
      hourlyRate,
      languages,
    } = body;

    // Validate required fields
    if (!specializations || !credentials || !bio || !availability || !languages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const expert = await ExpertService.createExpert({
      userId,
      specializations,
      credentials,
      bio,
      availability,
      hourlyRate,
      languages,
    });

    return NextResponse.json({
      success: true,
      data: expert,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating expert profile:', error);
    return NextResponse.json(
      { error: 'Failed to create expert profile' },
      { status: 500 }
    );
  }
}