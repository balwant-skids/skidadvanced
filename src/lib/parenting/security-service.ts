import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Security and Privacy Service for Digital Parenting Platform
 * Handles authentication, data consent, and security monitoring
 */

export interface PasswordComplexityRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface DataSharingConsent {
  userId: string;
  consentType: 'analytics' | 'marketing' | 'research' | 'third_party';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityIncident {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  detectedAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

export interface PrivacySettings {
  userId: string;
  dataSharing: {
    analytics: boolean;
    marketing: boolean;
    research: boolean;
    thirdParty: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  profileVisibility: 'public' | 'private' | 'friends_only';
  dataRetention: 'standard' | 'minimal' | 'extended';
}

export class SecurityService {
  private static readonly PASSWORD_REQUIREMENTS: PasswordComplexityRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  };

  /**
   * Validate password complexity
   */
  static validatePasswordComplexity(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requirements = this.PASSWORD_REQUIREMENTS;

    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Hash password securely
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Record data sharing consent
   */
  static async recordDataSharingConsent(
    userId: string,
    consentType: 'analytics' | 'marketing' | 'research' | 'third_party',
    granted: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<DataSharingConsent> {
    try {
      const consent = await prisma.dataSharingConsent.upsert({
        where: {
          userId_consentType: {
            userId,
            consentType,
          },
        },
        update: {
          granted,
          grantedAt: granted ? new Date() : undefined,
          revokedAt: !granted ? new Date() : undefined,
          ipAddress,
          userAgent,
        },
        create: {
          userId,
          consentType,
          granted,
          grantedAt: granted ? new Date() : undefined,
          revokedAt: !granted ? new Date() : undefined,
          ipAddress,
          userAgent,
        },
      });

      return {
        userId: consent.userId,
        consentType: consent.consentType as any,
        granted: consent.granted,
        grantedAt: consent.grantedAt || undefined,
        revokedAt: consent.revokedAt || undefined,
        ipAddress: consent.ipAddress || undefined,
        userAgent: consent.userAgent || undefined,
      };
    } catch (error) {
      console.error('Error recording data sharing consent:', error);
      throw new Error('Failed to record data sharing consent');
    }
  }

  /**
   * Verify data sharing consent
   */
  static async verifyDataSharingConsent(
    userId: string,
    consentType: 'analytics' | 'marketing' | 'research' | 'third_party'
  ): Promise<boolean> {
    try {
      const consent = await prisma.dataSharingConsent.findUnique({
        where: {
          userId_consentType: {
            userId,
            consentType,
          },
        },
      });

      return consent?.granted || false;
    } catch (error) {
      console.error('Error verifying data sharing consent:', error);
      return false;
    }
  }

  /**
   * Get user privacy settings
   */
  static async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const settings = await prisma.privacySettings.findUnique({
        where: { userId },
      });

      if (!settings) {
        // Return default privacy settings
        return {
          userId,
          dataSharing: {
            analytics: false,
            marketing: false,
            research: false,
            thirdParty: false,
          },
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          profileVisibility: 'private',
          dataRetention: 'standard',
        };
      }

      return {
        userId: settings.userId,
        dataSharing: JSON.parse(settings.dataSharing),
        notifications: JSON.parse(settings.notifications),
        profileVisibility: settings.profileVisibility as any,
        dataRetention: settings.dataRetention as any,
      };
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      throw new Error('Failed to get privacy settings');
    }
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(
    userId: string,
    settings: Partial<PrivacySettings>
  ): Promise<PrivacySettings> {
    try {
      const updatedSettings = await prisma.privacySettings.upsert({
        where: { userId },
        update: {
          dataSharing: settings.dataSharing ? JSON.stringify(settings.dataSharing) : undefined,
          notifications: settings.notifications ? JSON.stringify(settings.notifications) : undefined,
          profileVisibility: settings.profileVisibility,
          dataRetention: settings.dataRetention,
        },
        create: {
          userId,
          dataSharing: JSON.stringify(settings.dataSharing || {
            analytics: false,
            marketing: false,
            research: false,
            thirdParty: false,
          }),
          notifications: JSON.stringify(settings.notifications || {
            email: true,
            push: true,
            sms: false,
          }),
          profileVisibility: settings.profileVisibility || 'private',
          dataRetention: settings.dataRetention || 'standard',
        },
      });

      return {
        userId: updatedSettings.userId,
        dataSharing: JSON.parse(updatedSettings.dataSharing),
        notifications: JSON.parse(updatedSettings.notifications),
        profileVisibility: updatedSettings.profileVisibility as any,
        dataRetention: updatedSettings.dataRetention as any,
      };
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error('Failed to update privacy settings');
    }
  }

  /**
   * Detect and record security incident
   */
  static async recordSecurityIncident(
    type: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access',
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SecurityIncident> {
    try {
      const incident = await prisma.securityIncident.create({
        data: {
          type,
          severity,
          description,
          userId,
          ipAddress,
          userAgent,
          detectedAt: new Date(),
          status: 'open',
        },
      });

      // Auto-escalate critical incidents
      if (severity === 'critical') {
        await this.escalateSecurityIncident(incident.id);
      }

      return {
        id: incident.id,
        type: incident.type as any,
        severity: incident.severity as any,
        userId: incident.userId || undefined,
        ipAddress: incident.ipAddress || undefined,
        userAgent: incident.userAgent || undefined,
        description: incident.description,
        detectedAt: incident.detectedAt,
        status: incident.status as any,
      };
    } catch (error) {
      console.error('Error recording security incident:', error);
      throw new Error('Failed to record security incident');
    }
  }

  /**
   * Monitor failed login attempts
   */
  static async monitorFailedLogins(userId: string, ipAddress?: string): Promise<void> {
    try {
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

      const recentFailedAttempts = await prisma.securityIncident.count({
        where: {
          type: 'failed_login',
          userId,
          detectedAt: { gte: fiveMinutesAgo },
        },
      });

      // Lock account after 5 failed attempts in 5 minutes
      if (recentFailedAttempts >= 5) {
        await this.lockUserAccount(userId, 'Multiple failed login attempts');
        
        await this.recordSecurityIncident(
          'suspicious_activity',
          'high',
          `Account locked due to ${recentFailedAttempts} failed login attempts`,
          userId,
          ipAddress
        );
      }
    } catch (error) {
      console.error('Error monitoring failed logins:', error);
    }
  }

  /**
   * Lock user account
   */
  static async lockUserAccount(userId: string, reason: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          accountLocked: true,
          accountLockedAt: new Date(),
          accountLockReason: reason,
        },
      });

      // TODO: Send notification to user about account lock
      console.log(`Account locked for user ${userId}: ${reason}`);
    } catch (error) {
      console.error('Error locking user account:', error);
      throw new Error('Failed to lock user account');
    }
  }

  /**
   * Unlock user account
   */
  static async unlockUserAccount(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          accountLocked: false,
          accountLockedAt: null,
          accountLockReason: null,
        },
      });

      console.log(`Account unlocked for user ${userId}`);
    } catch (error) {
      console.error('Error unlocking user account:', error);
      throw new Error('Failed to unlock user account');
    }
  }

  /**
   * Anonymize user data for privacy compliance
   */
  static async anonymizeUserData(userId: string): Promise<void> {
    try {
      const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Anonymize user record
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: 'Anonymous User',
          email: `${anonymousId}@anonymized.local`,
          anonymized: true,
          anonymizedAt: new Date(),
        },
      });

      // Anonymize related data
      await Promise.all([
        prisma.contentEngagement.updateMany({
          where: { userId },
          data: { userId: anonymousId },
        }),
        prisma.forumPost.updateMany({
          where: { authorId: userId },
          data: { authorId: anonymousId, isAnonymous: true },
        }),
        prisma.forumReply.updateMany({
          where: { authorId: userId },
          data: { authorId: anonymousId },
        }),
      ]);

      console.log(`User data anonymized for ${userId}`);
    } catch (error) {
      console.error('Error anonymizing user data:', error);
      throw new Error('Failed to anonymize user data');
    }
  }

  /**
   * Generate security report
   */
  static async generateSecurityReport(timeframe: 'day' | 'week' | 'month' = 'week') {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      const [incidents, failedLogins, lockedAccounts] = await Promise.all([
        prisma.securityIncident.findMany({
          where: {
            detectedAt: { gte: since },
          },
          orderBy: {
            severity: 'desc',
          },
        }),
        prisma.securityIncident.count({
          where: {
            type: 'failed_login',
            detectedAt: { gte: since },
          },
        }),
        prisma.user.count({
          where: {
            accountLocked: true,
            accountLockedAt: { gte: since },
          },
        }),
      ]);

      const incidentsBySeverity = incidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        timeframe,
        totalIncidents: incidents.length,
        incidentsBySeverity,
        failedLogins,
        lockedAccounts,
        criticalIncidents: incidents.filter(i => i.severity === 'critical'),
        openIncidents: incidents.filter(i => i.status === 'open').length,
      };
    } catch (error) {
      console.error('Error generating security report:', error);
      throw new Error('Failed to generate security report');
    }
  }

  /**
   * Private helper methods
   */
  private static async escalateSecurityIncident(incidentId: string): Promise<void> {
    try {
      // TODO: Implement incident escalation logic
      // This could include sending alerts to security team, creating tickets, etc.
      console.log(`Escalating critical security incident: ${incidentId}`);
      
      await prisma.securityIncident.update({
        where: { id: incidentId },
        data: { status: 'investigating' },
      });
    } catch (error) {
      console.error('Error escalating security incident:', error);
    }
  }
}