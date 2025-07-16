// Vendor Management System Types

export interface Vendor {
  id: string
  companyName: string
  businessType: VendorBusinessType
  registrationNumber: string
  taxId: string
  contactInfo: VendorContactInfo
  profile: VendorProfile
  services: VendorService[]
  contracts: VendorContract[]
  onboarding: VendorOnboardingStatus
  performance: VendorPerformance
  compliance: VendorCompliance
  integration: VendorIntegration
  status: VendorStatus
  createdAt: Date
  updatedAt: Date
}

export type VendorBusinessType = 
  | 'healthcare_provider'
  | 'technology_platform'
  | 'educational_service'
  | 'wellness_service'
  | 'diagnostic_service'
  | 'therapeutic_service'
  | 'consulting_service'
  | 'other'

export type VendorStatus = 
  | 'pending_application'
  | 'under_review'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'terminated'
  | 'rejected'

export interface VendorContactInfo {
  primaryContact: ContactPerson
  technicalContact: ContactPerson
  billingContact: ContactPerson
  supportContact: ContactPerson
  address: BusinessAddress
  website?: string
  socialMedia?: SocialMediaLinks
}

export interface ContactPerson {
  name: string
  title: string
  email: string
  phone: string
  alternatePhone?: string
  preferredContactMethod: 'email' | 'phone' | 'both'
}

export interface BusinessAddress {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  isHeadquarters: boolean
}

export interface SocialMediaLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
}

export interface VendorProfile {
  description: string
  foundedYear: number
  employeeCount: number
  annualRevenue?: number
  targetMarkets: string[]
  certifications: VendorCertification[]
  awards: VendorAward[]
  clientTestimonials: ClientTestimonial[]
  caseStudies: CaseStudy[]
  logo?: string
  gallery: string[]
}

export interface VendorCertification {
  name: string
  issuingBody: string
  issueDate: Date
  expiryDate?: Date
  certificateNumber: string
  verified: boolean
  documentUrl?: string
}

export interface VendorAward {
  title: string
  issuingOrganization: string
  year: number
  description: string
  category: string
}

export interface ClientTestimonial {
  clientName: string
  clientTitle: string
  clientCompany: string
  testimonial: string
  rating: number
  date: Date
  verified: boolean
}

export interface CaseStudy {
  id: string
  title: string
  description: string
  challenge: string
  solution: string
  results: string
  metrics: CaseStudyMetric[]
  clientIndustry: string
  duration: string
  documentUrl?: string
}

export interface CaseStudyMetric {
  name: string
  value: string
  improvement: string
}

export interface VendorService {
  id: string
  name: string
  description: string
  category: ServiceCategory
  subcategory: string
  pricing: ServicePricing
  features: ServiceFeature[]
  integrationRequirements: IntegrationRequirement[]
  supportLevels: SupportLevel[]
  sla: ServiceLevelAgreement
  availability: ServiceAvailability
  documentation: ServiceDocumentation
  status: ServiceStatus
}

export type ServiceCategory = 
  | 'assessment'
  | 'intervention'
  | 'monitoring'
  | 'analytics'
  | 'communication'
  | 'education'
  | 'wellness'
  | 'diagnostic'
  | 'therapeutic'

export type ServiceStatus = 'draft' | 'pending_review' | 'approved' | 'active' | 'suspended' | 'deprecated'

export interface ServicePricing {
  model: PricingModel
  basePrice: number
  currency: string
  billingFrequency: BillingFrequency
  tiers: PricingTier[]
  discounts: PricingDiscount[]
  setupFee?: number
  cancellationFee?: number
}

export type PricingModel = 'per_user' | 'per_session' | 'flat_rate' | 'usage_based' | 'tiered' | 'custom'
export type BillingFrequency = 'one_time' | 'monthly' | 'quarterly' | 'annually'

export interface PricingTier {
  name: string
  minUsers: number
  maxUsers?: number
  pricePerUser: number
  features: string[]
}

export interface PricingDiscount {
  type: 'percentage' | 'fixed_amount'
  value: number
  conditions: string[]
  validFrom: Date
  validUntil?: Date
}

export interface ServiceFeature {
  name: string
  description: string
  category: string
  isCore: boolean
  additionalCost?: number
}

export interface IntegrationRequirement {
  type: 'api' | 'webhook' | 'sso' | 'data_sync' | 'embed' | 'redirect'
  description: string
  technicalSpecs: TechnicalSpecification[]
  securityRequirements: SecurityRequirement[]
  dataRequirements: DataRequirement[]
}

export interface TechnicalSpecification {
  name: string
  value: string
  required: boolean
  description: string
}

export interface SecurityRequirement {
  type: string
  description: string
  compliance: string[]
  required: boolean
}

export interface DataRequirement {
  dataType: string
  format: string
  frequency: string
  direction: 'inbound' | 'outbound' | 'bidirectional'
  required: boolean
}

export interface SupportLevel {
  name: string
  description: string
  responseTime: string
  availability: string
  channels: string[]
  additionalCost?: number
}

export interface ServiceLevelAgreement {
  uptime: number
  responseTime: number
  resolutionTime: number
  availability: string
  penalties: SLAPenalty[]
  credits: SLACredit[]
}

export interface SLAPenalty {
  condition: string
  penalty: string
  amount?: number
}

export interface SLACredit {
  condition: string
  creditPercentage: number
  maxCredit: number
}

export interface ServiceAvailability {
  regions: string[]
  languages: string[]
  timeZones: string[]
  maintenanceWindows: MaintenanceWindow[]
}

export interface MaintenanceWindow {
  dayOfWeek: number
  startTime: string
  endTime: string
  timezone: string
  frequency: 'weekly' | 'monthly' | 'quarterly'
}

export interface ServiceDocumentation {
  apiDocs?: string
  userGuide?: string
  integrationGuide?: string
  troubleshooting?: string
  faq?: string
  videos?: string[]
}

export interface VendorContract {
  id: string
  type: ContractType
  title: string
  description: string
  startDate: Date
  endDate?: Date
  autoRenewal: boolean
  renewalTerms: string
  terminationClause: string
  paymentTerms: PaymentTerms
  deliverables: Deliverable[]
  milestones: ContractMilestone[]
  penalties: ContractPenalty[]
  status: ContractStatus
  documents: ContractDocument[]
  amendments: ContractAmendment[]
}

export type ContractType = 'service_agreement' | 'master_service_agreement' | 'sow' | 'nda' | 'data_processing_agreement'
export type ContractStatus = 'draft' | 'pending_review' | 'pending_signature' | 'active' | 'expired' | 'terminated'

export interface PaymentTerms {
  frequency: BillingFrequency
  dueDate: number
  lateFee: number
  currency: string
  paymentMethod: string[]
  invoiceDelivery: 'email' | 'portal' | 'mail'
}

export interface Deliverable {
  id: string
  name: string
  description: string
  dueDate: Date
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  acceptanceCriteria: string[]
}

export interface ContractMilestone {
  id: string
  name: string
  description: string
  targetDate: Date
  paymentPercentage: number
  dependencies: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
}

export interface ContractPenalty {
  condition: string
  penaltyType: 'percentage' | 'fixed_amount' | 'service_credit'
  amount: number
  maxPenalty?: number
}

export interface ContractDocument {
  id: string
  name: string
  type: string
  version: string
  uploadDate: Date
  url: string
  signedBy?: string[]
  signedDate?: Date
}

export interface ContractAmendment {
  id: string
  description: string
  changes: string[]
  effectiveDate: Date
  approvedBy: string
  approvedDate: Date
}

export interface VendorOnboardingStatus {
  currentStep: number
  totalSteps: number
  completedSteps: OnboardingStep[]
  pendingSteps: OnboardingStep[]
  overallProgress: number
  estimatedCompletion: Date
  assignedReviewer?: string
  reviewNotes: ReviewNote[]
}

export interface OnboardingStep {
  id: string
  name: string
  description: string
  category: 'documentation' | 'verification' | 'integration' | 'testing' | 'approval'
  required: boolean
  status: 'not_started' | 'in_progress' | 'completed' | 'rejected' | 'on_hold'
  completedDate?: Date
  documents: string[]
  reviewComments?: string
}

export interface ReviewNote {
  id: string
  reviewer: string
  step: string
  note: string
  type: 'comment' | 'question' | 'concern' | 'approval' | 'rejection'
  date: Date
  resolved: boolean
}

export interface VendorPerformance {
  overallRating: number
  metrics: PerformanceMetric[]
  trends: PerformanceTrend[]
  benchmarks: PerformanceBenchmark[]
  reviews: PerformanceReview[]
  incidents: PerformanceIncident[]
  lastUpdated: Date
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  target: number
  status: 'above_target' | 'on_target' | 'below_target' | 'critical'
  trend: 'improving' | 'stable' | 'declining'
  lastMeasured: Date
}

export interface PerformanceTrend {
  metric: string
  period: string
  values: TrendDataPoint[]
  forecast?: TrendDataPoint[]
}

export interface TrendDataPoint {
  date: Date
  value: number
}

export interface PerformanceBenchmark {
  metric: string
  industryAverage: number
  topPerformer: number
  vendorValue: number
  percentile: number
}

export interface PerformanceReview {
  id: string
  period: string
  reviewer: string
  overallRating: number
  strengths: string[]
  improvements: string[]
  actionItems: ActionItem[]
  nextReviewDate: Date
  date: Date
}

export interface ActionItem {
  id: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: Date
  status: 'open' | 'in_progress' | 'completed' | 'overdue'
}

export interface PerformanceIncident {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  reportedDate: Date
  resolvedDate?: Date
  impact: string
  rootCause?: string
  preventiveMeasures: string[]
  status: 'open' | 'investigating' | 'resolved' | 'closed'
}

export interface VendorCompliance {
  certifications: ComplianceCertification[]
  audits: ComplianceAudit[]
  policies: CompliancePolicy[]
  training: ComplianceTraining[]
  violations: ComplianceViolation[]
  status: 'compliant' | 'non_compliant' | 'under_review' | 'remediation_required'
  lastReview: Date
  nextReview: Date
}

export interface ComplianceCertification {
  name: string
  standard: string
  issuingBody: string
  issueDate: Date
  expiryDate: Date
  scope: string
  status: 'valid' | 'expired' | 'suspended' | 'revoked'
  documentUrl?: string
}

export interface ComplianceAudit {
  id: string
  type: 'internal' | 'external' | 'regulatory'
  auditor: string
  scope: string[]
  startDate: Date
  endDate: Date
  findings: AuditFinding[]
  recommendations: string[]
  status: 'planned' | 'in_progress' | 'completed' | 'follow_up_required'
}

export interface AuditFinding {
  id: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: string[]
  recommendation: string
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk'
}

export interface CompliancePolicy {
  id: string
  name: string
  description: string
  category: string
  version: string
  effectiveDate: Date
  reviewDate: Date
  owner: string
  documentUrl: string
  acknowledgments: PolicyAcknowledgment[]
}

export interface PolicyAcknowledgment {
  userId: string
  acknowledgedDate: Date
  version: string
}

export interface ComplianceTraining {
  id: string
  name: string
  description: string
  category: string
  required: boolean
  frequency: string
  duration: number
  completions: TrainingCompletion[]
  materials: string[]
}

export interface TrainingCompletion {
  userId: string
  completedDate: Date
  score?: number
  certificateUrl?: string
  expiryDate?: Date
}

export interface ComplianceViolation {
  id: string
  type: string
  severity: 'minor' | 'major' | 'critical'
  description: string
  discoveredDate: Date
  reportedBy: string
  investigation: ViolationInvestigation
  remediation: ViolationRemediation
  status: 'reported' | 'investigating' | 'resolved' | 'escalated'
}

export interface ViolationInvestigation {
  assignee: string
  startDate: Date
  findings: string[]
  rootCause?: string
  evidence: string[]
  status: 'pending' | 'in_progress' | 'completed'
}

export interface ViolationRemediation {
  plan: string
  actions: RemediationAction[]
  targetDate: Date
  completedDate?: Date
  verification: string[]
  status: 'planned' | 'in_progress' | 'completed' | 'verified'
}

export interface RemediationAction {
  id: string
  description: string
  assignee: string
  dueDate: Date
  status: 'pending' | 'in_progress' | 'completed'
  evidence?: string[]
}

export interface VendorIntegration {
  status: IntegrationStatus
  type: IntegrationType[]
  endpoints: IntegrationEndpoint[]
  authentication: IntegrationAuth
  dataMapping: DataMapping[]
  testing: IntegrationTesting
  monitoring: IntegrationMonitoring
  documentation: IntegrationDocumentation
}

export type IntegrationStatus = 'not_started' | 'in_progress' | 'testing' | 'live' | 'suspended' | 'deprecated'
export type IntegrationType = 'api' | 'webhook' | 'sso' | 'embed' | 'redirect' | 'file_transfer'

export interface IntegrationEndpoint {
  id: string
  name: string
  url: string
  method: string
  purpose: string
  authentication: string[]
  rateLimit?: RateLimit
  status: 'active' | 'inactive' | 'deprecated'
}

export interface RateLimit {
  requests: number
  period: string
  burst?: number
}

export interface IntegrationAuth {
  type: 'api_key' | 'oauth2' | 'jwt' | 'basic' | 'custom'
  configuration: Record<string, any>
  credentials: AuthCredential[]
  refreshToken?: string
  expiryDate?: Date
}

export interface AuthCredential {
  name: string
  value: string
  encrypted: boolean
  lastRotated: Date
  expiryDate?: Date
}

export interface DataMapping {
  sourceField: string
  targetField: string
  transformation?: string
  validation?: string
  required: boolean
}

export interface IntegrationTesting {
  testSuites: TestSuite[]
  lastRun: Date
  nextRun: Date
  status: 'passing' | 'failing' | 'not_run'
  coverage: number
}

export interface TestSuite {
  id: string
  name: string
  tests: IntegrationTest[]
  status: 'passing' | 'failing' | 'not_run'
  lastRun: Date
}

export interface IntegrationTest {
  id: string
  name: string
  description: string
  type: 'unit' | 'integration' | 'end_to_end'
  status: 'passing' | 'failing' | 'skipped'
  lastRun: Date
  duration: number
  errorMessage?: string
}

export interface IntegrationMonitoring {
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
  alerts: MonitoringAlert[]
  metrics: MonitoringMetric[]
}

export interface MonitoringAlert {
  id: string
  type: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  message: string
  timestamp: Date
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

export interface MonitoringMetric {
  name: string
  value: number
  unit: string
  timestamp: Date
  threshold?: number
  status: 'normal' | 'warning' | 'critical'
}

export interface IntegrationDocumentation {
  apiDocs?: string
  integrationGuide?: string
  troubleshooting?: string
  changelog?: string
  examples?: string[]
  sdks?: SDK[]
}

export interface SDK {
  language: string
  version: string
  downloadUrl: string
  documentation: string
  examples: string[]
}
