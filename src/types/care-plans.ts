// Core Care Plans Management System Types

export interface Service {
  id: string
  name: string
  category: 'intervention' | 'assessment' | 'consultation' | 'monitoring'
  type: 'vision' | 'hearing' | 'nutrition' | 'behavioral' | 'dental' | 'dermatology' | 'allergy' | 'sleep' | 'focus' | 'movement'
  description: string
  shortDescription: string
  icon: string
  color: string
  gradient: string
  basePrice: number
  duration: number // in minutes
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'
  ageGroups: AgeGroup[]
  prerequisites: string[]
  contraindications: string[]
  outcomes: string[]
  technology: string[]
  specialists: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  version: number
}

export interface AgeGroup {
  min: number // months
  max: number // months
  label: string
  adaptations: string[]
}

export interface CarePlan {
  id: string
  name: string
  displayName: string
  description: string
  category: 'essential' | 'comprehensive' | 'premium' | 'custom'
  theme: PlanTheme
  targetAgeGroup: AgeGroup
  services: CarePlanService[]
  pricing: PlanPricing
  duration: number // in months
  features: string[]
  benefits: string[]
  isActive: boolean
  isPromotional: boolean
  promotionalEndDate?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  version: number
  analytics: PlanAnalytics
}

export interface CarePlanService {
  serviceId: string
  service: Service
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'
  sessions: number
  priority: 'primary' | 'secondary' | 'optional'
  customizations: ServiceCustomization[]
}

export interface ServiceCustomization {
  type: 'duration' | 'frequency' | 'specialist' | 'technology' | 'location'
  value: string
  additionalCost: number
}

export interface PlanTheme {
  id: string
  name: string
  description: string
  focus: 'academic' | 'growth' | 'behavioral' | 'preventive' | 'therapeutic' | 'holistic'
  keywords: string[]
  recommendedServices: string[]
  aiPrompts: string[]
}

export interface PlanPricing {
  basePrice: number
  discountPercentage: number
  finalPrice: number
  currency: 'INR'
  billingCycle: 'monthly' | 'quarterly' | 'annually'
  setupFee: number
  cancellationFee: number
  upgradeCredit: number
}

export interface PlanAnalytics {
  enrollments: number
  completionRate: number
  satisfactionScore: number
  retentionRate: number
  averageEngagement: number
  revenueGenerated: number
  lastUpdated: Date
}

export interface AIRecommendation {
  id: string
  type: 'plan_creation' | 'service_addition' | 'pricing_optimization' | 'retention_strategy'
  confidence: number
  reasoning: string
  suggestedChanges: any
  expectedImpact: {
    enrollment: number
    retention: number
    satisfaction: number
    revenue: number
  }
  createdAt: Date
}

export interface PlanTemplate {
  id: string
  name: string
  description: string
  category: string
  services: string[]
  defaultPricing: PlanPricing
  targetDemographics: {
    ageGroups: AgeGroup[]
    concerns: string[]
    goals: string[]
  }
  isSystemTemplate: boolean
  createdBy: string
  usageCount: number
}

export interface ServiceBundle {
  id: string
  name: string
  services: string[]
  bundleDiscount: number
  minimumServices: number
  maximumServices: number
  restrictions: string[]
  isActive: boolean
}

export interface PlanModification {
  id: string
  planId: string
  type: 'service_added' | 'service_removed' | 'pricing_changed' | 'feature_updated'
  changes: any
  reason: string
  approvedBy: string
  effectiveDate: Date
  rollbackData: any
  createdAt: Date
}

export interface SubscriptionTier {
  id: string
  name: string
  displayName: string
  description: string
  maxServices: number
  maxSpecialists: number
  features: string[]
  restrictions: string[]
  basePrice: number
  color: string
  isPopular: boolean
  sortOrder: number
}

// API Response Types
export interface CarePlansResponse {
  plans: CarePlan[]
  total: number
  page: number
  limit: number
  filters: PlanFilters
}

export interface PlanFilters {
  category?: string[]
  ageGroup?: string
  priceRange?: [number, number]
  services?: string[]
  theme?: string
  isActive?: boolean
}

export interface PlanCreationRequest {
  name: string
  description: string
  category: string
  services: CarePlanService[]
  pricing: Partial<PlanPricing>
  targetAgeGroup: AgeGroup
  theme: string
  features: string[]
}

export interface ServiceCreationRequest {
  name: string
  category: 'intervention' | 'assessment' | 'consultation' | 'monitoring'
  type: 'vision' | 'hearing' | 'nutrition' | 'behavioral' | 'dental' | 'dermatology' | 'allergy' | 'sleep' | 'focus' | 'movement'
  description: string
  basePrice: number
  duration: number
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'
  ageGroups: AgeGroup[]
  specialists: string[]
  technology: string[]
}

// Admin Dashboard Types
export interface AdminDashboardStats {
  totalPlans: number
  activePlans: number
  totalServices: number
  activeServices: number
  totalEnrollments: number
  monthlyRevenue: number
  averageSatisfaction: number
  retentionRate: number
  planPerformance: PlanPerformanceMetric[]
  serviceUtilization: ServiceUtilizationMetric[]
}

export interface PlanPerformanceMetric {
  planId: string
  planName: string
  enrollments: number
  revenue: number
  satisfaction: number
  retention: number
  trend: 'up' | 'down' | 'stable'
}

export interface ServiceUtilizationMetric {
  serviceId: string
  serviceName: string
  utilization: number
  revenue: number
  satisfaction: number
  demand: 'high' | 'medium' | 'low'
}

// AI Integration Types
export interface AIAnalysisRequest {
  type: 'plan_optimization' | 'service_recommendation' | 'pricing_analysis' | 'retention_strategy'
  data: any
  context: {
    userDemographics?: any
    historicalData?: any
    marketTrends?: any
  }
}

export interface AIAnalysisResponse {
  recommendations: AIRecommendation[]
  insights: string[]
  confidence: number
  reasoning: string
  actionItems: string[]
}
