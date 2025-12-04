import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth-utils'
import { ActivityLogQuerySchema } from '@/lib/validations/admin-user'
import { getUserActivityLogs } from '@/lib/utils/activity-logger'
import { ZodError } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users/[id]/activity
 * Get activity logs for a specific admin user
 * 
 * Query Parameters:
 * - startDate: Filter by start date (ISO 8601 datetime)
 * - endDate: Filter by end date (ISO 8601 datetime)
 * - limit: Number of items to return (default: 50, max: 100)
 * - offset: Number of items to skip (default: 0)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify super admin access
    await requireSuperAdmin()
    
    const userId = params.id

    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams
    const queryParams = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0',
    }

    const validatedQuery = ActivityLogQuerySchema.parse(queryParams)

    // Convert date strings to Date objects
    const options: any = {
      limit: validatedQuery.limit,
      offset: validatedQuery.offset,
    }

    if (validatedQuery.startDate) {
      options.startDate = new Date(validatedQuery.startDate)
    }

    if (validatedQuery.endDate) {
      options.endDate = new Date(validatedQuery.endDate)
    }

    // Fetch activity logs
    const { logs, total } = await getUserActivityLogs(userId, options)

    return NextResponse.json({
      activities: logs,
      pagination: {
        total,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: validatedQuery.offset + logs.length < total,
      }
    })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching activity logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
