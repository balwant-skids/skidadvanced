// Enhanced Authentication & User Management Types

export type UserRole = 'parent' | 'provider' | 'admin' | 'staff' | 'specialist' | 'vendor'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  profile: UserProfile
  permissions: Permission[]
  metadata: UserMetadata
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'banned'

export interface UserProfile {
  avatar?: string
  phone?: string
  address?: Address
  preferences: UserPreferences
  verification: VerificationStatus
  onboardingCompleted: boolean
  roleSpecificData: RoleSpecificData
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface UserPreferences {
  language: string
  timezone: string
  notifications: NotificationPreferences
  privacy: PrivacySettings
  accessibility: AccessibilitySettings
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  types: string[]
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'limited'
  dataSharing: boolean
  analyticsOptOut: boolean
  marketingOptOut: boolean
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  screenReader: boolean
  reducedMotion: boolean
}

export interface VerificationStatus {
  email: boolean
  phone: boolean
  identity: boolean
  professional?: boolean
  background?: boolean
}

export type RoleSpecificData = 
  | ParentData
  | ProviderData
  | VendorData
  | AdminData
  | StaffData
  | SpecialistData

export interface ParentData {
  children: ChildProfile[]
  emergencyContacts: EmergencyContact[]
  insuranceInfo?: InsuranceInfo
  paymentMethods: string[]
  subscriptions: string[]
}

export interface ChildProfile {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: string
  medicalHistory: MedicalRecord[]
  allergies: string[]
  medications: string[]
  careProviders: string[]
}

export interface MedicalRecord {
  id: string
  type: string
  description: string
  date: Date
  provider: string
  attachments: string[]
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface InsuranceInfo {
  provider: string
  policyNumber: string
  groupNumber?: string
  expiryDate: Date
}

export interface ProviderData {
  licenseNumber: string
  specializations: string[]
  qualifications: Qualification[]
  experience: number
  availability: AvailabilitySchedule
  patients: string[]
  performanceMetrics: ProviderMetrics
}

export interface Qualification {
  degree: string
  institution: string
  year: number
  verified: boolean
}

export interface AvailabilitySchedule {
  timezone: string
  workingHours: WorkingHours[]
  holidays: Date[]
  breaks: TimeSlot[]
}

export interface WorkingHours {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface TimeSlot {
  startTime: Date
  endTime: Date
  reason?: string
}

export interface ProviderMetrics {
  totalPatients: number
  averageRating: number
  completedSessions: number
  cancellationRate: number
  responseTime: number
}

export interface VendorData {
  companyName: string
  businessType: string
  registrationNumber: string
  taxId: string
  services: VendorService[]
  contracts: Contract[]
  performanceMetrics: VendorMetrics
  onboardingStatus: VendorOnboardingStatus
}

export interface VendorService {
  id: string
  name: string
  description: string
  category: string
  pricing: ServicePricing
  availability: boolean
  integrationStatus: 'pending' | 'active' | 'suspended'
}

export interface ServicePricing {
  basePrice: number
  currency: string
  billingModel: 'per_session' | 'monthly' | 'annual' | 'per_user'
  discounts: Discount[]
}

export interface Discount {
  type: 'percentage' | 'fixed'
  value: number
  conditions: string[]
  validUntil?: Date
}

export interface Contract {
  id: string
  type: string
  startDate: Date
  endDate?: Date
  terms: string
  status: 'draft' | 'active' | 'expired' | 'terminated'
  documents: string[]
}

export interface VendorMetrics {
  totalRevenue: number
  activeIntegrations: number
  userSatisfaction: number
  uptime: number
  responseTime: number
  supportTickets: number
}

export interface VendorOnboardingStatus {
  step: number
  totalSteps: number
  completedSteps: string[]
  pendingRequirements: string[]
  approvalStatus: 'pending' | 'approved' | 'rejected'
  reviewNotes?: string
}

export interface AdminData {
  accessLevel: number
  departments: string[]
  managedUsers: string[]
  systemPermissions: string[]
  auditLog: AuditLogEntry[]
}

export interface StaffData {
  department: string
  position: string
  supervisor: string
  responsibilities: string[]
  workSchedule: AvailabilitySchedule
  performanceReviews: PerformanceReview[]
}

export interface SpecialistData {
  specialty: string
  certifications: Certification[]
  affiliations: string[]
  researchInterests: string[]
  publications: Publication[]
  consultationRates: ConsultationRate[]
}

export interface Certification {
  name: string
  issuingBody: string
  issueDate: Date
  expiryDate?: Date
  verified: boolean
}

export interface Publication {
  title: string
  journal: string
  year: number
  doi?: string
  coAuthors: string[]
}

export interface ConsultationRate {
  type: string
  duration: number
  price: number
  currency: string
}

export interface PerformanceReview {
  id: string
  reviewerId: string
  period: string
  rating: number
  feedback: string
  goals: string[]
  date: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  resource: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  details: Record<string, any>
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  actions: string[]
  conditions?: PermissionCondition[]
}

export interface PermissionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in'
  value: any
}

export interface UserMetadata {
  source: string
  referrer?: string
  utmParams?: Record<string, string>
  deviceInfo?: DeviceInfo
  customFields: Record<string, any>
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  version: string
}

// Authentication Flow Types
export interface OnboardingFlow {
  role: UserRole
  steps: OnboardingStep[]
  currentStep: number
  completedSteps: string[]
  data: Record<string, any>
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: string
  required: boolean
  validation: ValidationRule[]
}

export interface ValidationRule {
  field: string
  type: 'required' | 'email' | 'phone' | 'min_length' | 'max_length' | 'pattern'
  value?: any
  message: string
}

// API Types
export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  password?: string
  profile?: Partial<UserProfile>
  metadata?: Partial<UserMetadata>
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  profile?: Partial<UserProfile>
  permissions?: Permission[]
  status?: UserStatus
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: Date
}

export interface RoleChangeRequest {
  userId: string
  newRole: UserRole
  reason: string
  approvedBy: string
  effectiveDate: Date
}
