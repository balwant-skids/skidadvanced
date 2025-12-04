import prisma from '@/lib/prisma'

/**
 * Activity logging utility for tracking admin actions
 */

export interface LogActivityParams {
  userId: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Log an admin activity to the database
 * 
 * @param params - Activity log parameters
 * @returns The created activity log entry
 */
export async function logAdminActivity(params: LogActivityParams) {
  try {
    const activityLog = await prisma.adminActivityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: JSON.stringify(params.metadata || {}),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })

    return activityLog
  } catch (error) {
    // Log error but don't throw - activity logging should not break the main flow
    console.error('Failed to log admin activity:', error)
    return null
  }
}

/**
 * Get activity logs for a specific user
 * 
 * @param userId - User ID to fetch logs for
 * @param options - Query options (limit, offset, date range)
 * @returns Array of activity logs
 */
export async function getUserActivityLogs(
  userId: string,
  options: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  } = {}
) {
  const { limit = 50, offset = 0, startDate, endDate } = options

  const where: any = { userId }

  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  const [logs, total] = await Promise.all([
    prisma.adminActivityLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.adminActivityLog.count({ where }),
  ])

  return {
    logs: logs.map((log) => ({
      ...log,
      metadata: JSON.parse(log.metadata),
    })),
    total,
  }
}

/**
 * Get recent activity logs across all admin users
 * 
 * @param options - Query options (limit, offset)
 * @returns Array of activity logs
 */
export async function getRecentActivityLogs(options: {
  limit?: number
  offset?: number
} = {}) {
  const { limit = 50, offset = 0 } = options

  const logs = await prisma.adminActivityLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
    skip: offset,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return logs.map((log) => ({
    ...log,
    metadata: JSON.parse(log.metadata),
  }))
}

/**
 * Get activity summary for a user
 * 
 * @param userId - User ID to get summary for
 * @returns Activity summary with counts and last login
 */
export async function getUserActivitySummary(userId: string) {
  const [totalActions, recentActions, lastLogin] = await Promise.all([
    prisma.adminActivityLog.count({ where: { userId } }),
    prisma.adminActivityLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        timestamp: true,
      },
    }),
    prisma.adminActivityLog.findFirst({
      where: {
        userId,
        action: 'login',
      },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true },
    }),
  ])

  return {
    totalActions,
    recentActions,
    lastLogin: lastLogin?.timestamp || null,
  }
}

/**
 * Common action types for consistency
 */
export const AdminActions = {
  // User management
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DEACTIVATED: 'user_deactivated',
  USER_REACTIVATED: 'user_reactivated',
  
  // Clinic management
  CLINIC_CREATED: 'clinic_created',
  CLINIC_UPDATED: 'clinic_updated',
  CLINIC_DEACTIVATED: 'clinic_deactivated',
  
  // Whitelist management
  WHITELIST_ADDED: 'whitelist_added',
  WHITELIST_REMOVED: 'whitelist_removed',
  PARENT_APPROVED: 'parent_approved',
  PARENT_REJECTED: 'parent_rejected',
  
  // Campaign management
  CAMPAIGN_CREATED: 'campaign_created',
  CAMPAIGN_UPDATED: 'campaign_updated',
  CAMPAIGN_PUBLISHED: 'campaign_published',
  CAMPAIGN_ARCHIVED: 'campaign_archived',
  
  // Care plan management
  CARE_PLAN_CREATED: 'care_plan_created',
  CARE_PLAN_UPDATED: 'care_plan_updated',
  CARE_PLAN_DEACTIVATED: 'care_plan_deactivated',
  
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const

/**
 * Common entity types for consistency
 */
export const EntityTypes = {
  USER: 'user',
  CLINIC: 'clinic',
  WHITELIST: 'whitelist',
  CAMPAIGN: 'campaign',
  CARE_PLAN: 'care_plan',
  PARENT: 'parent',
  CHILD: 'child',
} as const
