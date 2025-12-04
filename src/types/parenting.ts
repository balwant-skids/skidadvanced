import { ParentingContent, ContentEngagement, Expert, Consultation, ForumPost, ForumReply } from '@prisma/client';

// ============ CONTENT TYPES ============

export interface ParentingContentWithAuthor extends ParentingContent {
  author: {
    id: string;
    name: string;
    email: string;
  };
  engagements?: ContentEngagement[];
}

export interface ContentMetrics {
  contentId: string;
  views: number;
  uniqueViews: number;
  averageTimeSpent: number;
  completionRate: number;
  rating: number;
  shares: number;
  bookmarks: number;
}

// ============ EXPERT TYPES ============

export interface ExpertWithUser extends Expert {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
}

export interface ConsultationWithDetails extends Consultation {
  parent: {
    id: string;
    name: string;
    email: string;
  };
  expert: ExpertWithUser;
}

// ============ COMMUNITY TYPES ============

export interface ForumPostWithDetails extends ForumPost {
  author: {
    id: string;
    name: string;
    email: string;
  };
  replies: ForumReplyWithDetails[];
  votes: {
    id: string;
    vote: string;
    userId: string;
  }[];
}

export interface ForumReplyWithDetails extends ForumReply {
  author: {
    id: string;
    name: string;
    email: string;
  };
  childReplies?: ForumReplyWithDetails[];
  votes: {
    id: string;
    vote: string;
    userId: string;
  }[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  ageGroupMin: number;
  ageGroupMax: number;
  memberCount: number;
  category: string;
}

// ============ DEVELOPMENT TYPES ============

export interface DevelopmentMilestone {
  id: string;
  category: 'physical' | 'cognitive' | 'social' | 'emotional' | 'language';
  ageMonthsMin: number;
  ageMonthsMax: number;
  title: string;
  description: string;
  indicators: string[];
  isRequired: boolean;
}

export interface MilestoneProgress {
  milestoneId: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'delayed';
  achievedAt?: Date;
  notes?: string;
  parentObservations?: string[];
}

export interface DevelopmentConcern {
  id: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'monitoring';
  identifiedAt: Date;
  resolvedAt?: Date;
  notes?: string;
}

export interface DevelopmentReport {
  childId: string;
  overallProgress: number;
  categoryProgress: Record<string, number>;
  achievements: MilestoneProgress[];
  concerns: DevelopmentConcern[];
  recommendations: string[];
  generatedAt: Date;
}

// ============ ASSESSMENT TYPES ============

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'boolean';
  options?: string[];
  domain: string;
  weight: number;
}

export interface QuestionResponse {
  questionId: string;
  response: any;
  timestamp: Date;
}

export interface DomainScore {
  domain: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface PersonalizedFeedback {
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface ScoringRubric {
  domains: {
    name: string;
    weight: number;
    criteria: {
      score: number;
      description: string;
    }[];
  }[];
}

export interface AssessmentSession {
  id: string;
  assessmentId: string;
  parentId: string;
  currentQuestionIndex: number;
  responses: QuestionResponse[];
  startedAt: Date;
  expiresAt: Date;
}

export interface ProgressTrend {
  domain: string;
  previousScore: number;
  currentScore: number;
  improvement: number;
  trend: 'improving' | 'stable' | 'declining';
}

// ============ RECOMMENDATION TYPES ============

export interface RecommendationProfile {
  parentId: string;
  childrenAges: number[];
  interests: string[];
  parentingStyle?: string;
  challenges: string[];
  preferredContentTypes: string[];
  engagementHistory: EngagementData[];
  lastUpdated: Date;
}

export interface ContentRecommendation {
  contentId: string;
  score: number;
  reason: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  generatedAt: Date;
}

export interface EngagementData {
  eventType: 'view' | 'click' | 'share' | 'bookmark' | 'complete' | 'rate';
  contentId?: string;
  duration?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// ============ ANALYTICS TYPES ============

export interface BehaviorInsights {
  commonChallenges: string[];
  contentGaps: string[];
  engagementPatterns: {
    peakHours: number[];
    preferredContentTypes: string[];
    averageSessionDuration: number;
  };
  userSegments: {
    segment: string;
    count: number;
    characteristics: string[];
  }[];
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  contentMetrics: {
    totalContent: number;
    publishedContent: number;
    averageRating: number;
  };
  engagementMetrics: {
    totalViews: number;
    averageTimeSpent: number;
    completionRate: number;
  };
  expertMetrics: {
    totalExperts: number;
    activeConsultations: number;
    averageRating: number;
  };
  communityMetrics: {
    totalPosts: number;
    activeDiscussions: number;
    moderationQueue: number;
  };
}

export interface AccuracyMetrics {
  recommendationAccuracy: number;
  userSatisfaction: number;
  clickThroughRate: number;
  conversionRate: number;
}

export interface ContentGap {
  category: string;
  ageGroup: string;
  missingTopics: string[];
  demandScore: number;
}

// ============ RESOURCE TYPES ============

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'audio' | 'interactive' | 'checklist';
  category: string;
  tags: string[];
  ageGroup: string;
  expertLevel: string;
  downloadUrl?: string;
  streamUrl?: string;
  size?: number;
  duration?: number;
  rating: number;
  downloadCount: number;
  createdAt: Date;
}

export interface ResourceSearchQuery {
  query?: string;
  category?: string;
  type?: string;
  ageGroup?: string;
  expertLevel?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ResourceFilters {
  category?: string;
  type?: string;
  ageGroup?: string;
  expertLevel?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// ============ INTEGRATION TYPES ============

export interface ChildProfile {
  id: string;
  name: string;
  dateOfBirth: Date;
  healthConditions?: string[];
  developmentStage: string;
}

export interface HealthData {
  childId: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  lastCheckup: Date;
  nextAppointment?: Date;
}

export interface Appointment {
  id: string;
  type: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  notes?: string;
}

// ============ H.A.B.I.T.S. FRAMEWORK TYPES ============

export type HABITSCategory = 'H' | 'A' | 'B' | 'I' | 'T' | 'S';

export interface HABITSContent {
  H: ParentingContentWithAuthor[]; // Healthy eating
  A: ParentingContentWithAuthor[]; // Active movement
  B: ParentingContentWithAuthor[]; // Balanced stress
  I: ParentingContentWithAuthor[]; // Inner coaching
  T: ParentingContentWithAuthor[]; // Timekeepers
  S: ParentingContentWithAuthor[]; // Sufficient sleep
}

export const HABITS_CATEGORIES = {
  H: 'Healthy Eating',
  A: 'Active Movement',
  B: 'Balanced Stress',
  I: 'Inner Coaching',
  T: 'Timekeepers',
  S: 'Sufficient Sleep',
} as const;