import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { SKIDSIntegrationService } from '@/lib/parenting/skids-integration-service';

/**
 * POST /api/parenting/integration/sync - Sync SKIDS data
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { syncType } = body;

    let result;

    switch (syncType) {
      case 'child_profiles':
        result = await SKIDSIntegrationService.syncChildProfiles(userId);
        break;
      case 'health_data':
        if (!body.childId) {
          return NextResponse.json({ error: 'Child ID required for health data sync' }, { status: 400 });
        }
        result = await SKIDSIntegrationService.importHealthData(body.childId);
        break;
      case 'appointments':
        if (!body.childId) {
          return NextResponse.json({ error: 'Child ID required for appointment sync' }, { status: 400 });
        }
        result = await SKIDSIntegrationService.syncAppointments(body.childId);
        break;
      case 'progress_data':
        if (!body.childId) {
          return NextResponse.json({ error: 'Child ID required for progress sync' }, { status: 400 });
        }
        await SKIDSIntegrationService.syncProgressDataToSKIDS(body.childId);
        result = { success: true, message: 'Progress data synced to SKIDS' };
        break;
      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${syncType} synchronized successfully`,
    });
  } catch (error) {
    console.error('Error syncing SKIDS data:', error);
    return NextResponse.json(
      { error: 'Failed to sync SKIDS data' },
      { status: 500 }
    );
  }
}