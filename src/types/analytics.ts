// Unified Analytics Dashboard Types

export interface UnifiedAnalytics {
  overview: AnalyticsOverview
  vendorPerformance: VendorAnalytics
  staffProductivity: StaffAnalytics
  systemHealth: SystemHealthAnalytics
  roiAnalysis: ROIAnalytics
  realTimeMetrics: RealTimeMetrics
  predictiveInsights: PredictiveAnalytics
  alerts: AnalyticsAlert[]
  lastUpdated: Date
}

export interface AnalyticsOverview {
  totalVendors: number
  activeIntegrations: number
  totalStaff: number
  monthlyRevenue: number
  systemUptime: number
  overallROI: number
  customerSatisfaction: number
  keyMetrics: KeyMetric[]
  trends: OverviewTrend[]
}

export interface KeyMetric {
  name: string
  value: number
  unit: string
  change: number
  changeType: 'increase' | 'decrease' | 'stable'
  target: number
  status: 'on_track' | 'at_risk' | 'critical'
}

export interface OverviewTrend {
  metric: string
  data: TrendDataPoint[]
  forecast: TrendDataPoint[]
  confidence: number
}

export interface TrendDataPoint {
  timestamp: Date
  value: number
  confidence?: number
}

export interface VendorAnalytics {
  totalVendors: number
  activeVendors: number
  pendingOnboarding: number
  averageOnboardingTime: number
  topPerformers: VendorPerformanceMetric[]
  performanceDistribution: PerformanceDistribution
  integrationHealth: IntegrationHealthMetric[]
  complianceStatus: ComplianceMetric[]
  costAnalysis: VendorCostAnalysis
}

export interface VendorPerformanceMetric {
  vendorId: string
  vendorName: string
  overallScore: number
  uptime: number
  responseTime: number
  customerSatisfaction: number
  costEfficiency: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface PerformanceDistribution {
  excellent: number // 4.5-5.0
  good: number      // 3.5-4.4
  average: number   // 2.5-3.4
  poor: number      // 1.5-2.4
  critical: number  // 0-1.4
}

export interface IntegrationHealthMetric {
  vendorId: string
  vendorName: string
  integrationType: string
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  errorRate: number
  responseTime: number
  lastHealthCheck: Date
}

export interface ComplianceMetric {
  vendorId: string
  vendorName: string
  complianceScore: number
  certifications: string[]
  lastAudit: Date
  nextAudit: Date
  violations: number
  status: 'compliant' | 'non_compliant' | 'under_review' | 'remediation_required'
}

export interface VendorCostAnalysis {
  totalCost: number
  costPerVendor: number
  costTrends: CostTrend[]
  budgetUtilization: number
  costSavings: number
  projectedCosts: ProjectedCost[]
}

export interface CostTrend {
  period: string
  cost: number
  budget: number
  variance: number
}

export interface ProjectedCost {
  period: string
  projectedCost: number
  confidence: number
  factors: string[]
}

export interface StaffAnalytics {
  totalStaff: number
  activeStaff: number
  averagePerformance: number
  productivityMetrics: StaffProductivityMetric[]
  departmentPerformance: DepartmentMetric[]
  workloadDistribution: WorkloadMetric[]
  skillsAnalysis: SkillsMetric[]
  trainingNeeds: TrainingNeed[]
}

export interface StaffProductivityMetric {
  staffId: string
  staffName: string
  department: string
  tasksCompleted: number
  averageResponseTime: number
  vendorsManaged: number
  performanceRating: number
  efficiency: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface DepartmentMetric {
  department: string
  staffCount: number
  averagePerformance: number
  totalTasks: number
  completionRate: number
  averageResponseTime: number
  workloadBalance: number
}

export interface WorkloadMetric {
  staffId: string
  staffName: string
  currentTasks: number
  capacity: number
  utilization: number
  burnoutRisk: 'low' | 'medium' | 'high'
}

export interface SkillsMetric {
  skill: string
  averageLevel: number
  staffWithSkill: number
  demandLevel: 'low' | 'medium' | 'high'
  gapAnalysis: number
}

export interface TrainingNeed {
  staffId: string
  staffName: string
  skill: string
  currentLevel: number
  requiredLevel: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedTrainingTime: number
}

export interface SystemHealthAnalytics {
  overallHealth: number
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
  resourceUtilization: ResourceUtilization
  securityMetrics: SecurityMetric[]
  performanceMetrics: SystemPerformanceMetric[]
  alerts: SystemAlert[]
}

export interface ResourceUtilization {
  cpu: number
  memory: number
  storage: number
  network: number
  database: number
}

export interface SecurityMetric {
  metric: string
  value: number
  threshold: number
  status: 'secure' | 'warning' | 'critical'
  lastCheck: Date
}

export interface SystemPerformanceMetric {
  component: string
  responseTime: number
  throughput: number
  errorRate: number
  availability: number
  trend: 'improving' | 'stable' | 'degrading'
}

export interface SystemAlert {
  id: string
  type: 'performance' | 'security' | 'integration' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical' | 'error' | 'info' | 'warning'
  message: string
  component: string
  timestamp: Date
  status: 'active' | 'acknowledged' | 'resolved'
  assignee?: string
}

export interface ROIAnalytics {
  overallROI: number
  vendorROI: VendorROIMetric[]
  roiTrends: ROITrend[]
  costBenefitAnalysis: CostBenefitMetric[]
  investmentReturns: InvestmentReturn[]
  projectedROI: ProjectedROI[]
}

export interface VendorROIMetric {
  vendorId: string
  vendorName: string
  investment: number
  returns: number
  roi: number
  paybackPeriod: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface ROITrend {
  period: string
  roi: number
  investment: number
  returns: number
  factors: string[]
}

export interface CostBenefitMetric {
  category: string
  costs: number
  benefits: number
  netBenefit: number
  ratio: number
}

export interface InvestmentReturn {
  investment: string
  amount: number
  returns: number
  timeframe: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProjectedROI {
  timeframe: string
  projectedROI: number
  confidence: number
  assumptions: string[]
}

export interface RealTimeMetrics {
  activeUsers: number
  currentTransactions: number
  systemLoad: number
  apiCalls: number
  errorCount: number
  responseTime: number
  throughput: number
  alerts: number
  lastUpdated: Date
}

export interface PredictiveAnalytics {
  vendorSuccessRates: VendorSuccessPrediction[]
  staffPerformanceTrends: StaffPerformancePrediction[]
  systemCapacityForecasts: CapacityForecast[]
  riskPredictions: RiskPrediction[]
  opportunityIdentification: OpportunityPrediction[]
}

export interface VendorSuccessPrediction {
  vendorId: string
  vendorName: string
  currentScore: number
  predictedScore: number
  successProbability: number
  riskFactors: string[]
  recommendations: string[]
  confidence: number
}

export interface StaffPerformancePrediction {
  staffId: string
  staffName: string
  currentPerformance: number
  predictedPerformance: number
  trend: 'improving' | 'stable' | 'declining'
  factors: string[]
  interventions: string[]
  confidence: number
}

export interface CapacityForecast {
  component: string
  currentCapacity: number
  projectedDemand: number
  capacityGap: number
  timeToCapacity: number
  recommendations: string[]
}

export interface RiskPrediction {
  type: 'vendor' | 'staff' | 'system' | 'financial'
  description: string
  probability: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  timeframe: string
  mitigation: string[]
  confidence: number
}

export interface OpportunityPrediction {
  type: 'cost_savings' | 'revenue_growth' | 'efficiency_gain' | 'quality_improvement'
  description: string
  potential: number
  probability: number
  timeframe: string
  requirements: string[]
  confidence: number
}

export interface AnalyticsAlert {
  id: string
  type: 'performance' | 'security' | 'compliance' | 'financial' | 'operational'
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  component: string
  timestamp: Date
  status: 'active' | 'acknowledged' | 'resolved'
  assignee?: string
  actions: AlertAction[]
}

export interface AlertAction {
  action: string
  description: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  assignee?: string
}

// Analytics Configuration
export interface AnalyticsConfig {
  refreshInterval: number
  dataRetention: number
  alertThresholds: AlertThreshold[]
  dashboardSettings: DashboardSettings
  reportingSchedule: ReportingSchedule[]
}

export interface AlertThreshold {
  metric: string
  warning: number
  critical: number
  enabled: boolean
}

export interface DashboardSettings {
  defaultView: string
  autoRefresh: boolean
  refreshInterval: number
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  id: string
  type: string
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: Record<string, any>
}

export interface ReportingSchedule {
  reportType: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  format: 'pdf' | 'excel' | 'json'
  enabled: boolean
}

// API Request/Response Types
export interface AnalyticsRequest {
  timeRange: TimeRange
  metrics: string[]
  filters: AnalyticsFilter[]
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
}

export interface TimeRange {
  start: Date
  end: Date
  granularity: 'hour' | 'day' | 'week' | 'month'
}

export interface AnalyticsFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: any
}

export interface AnalyticsResponse {
  data: UnifiedAnalytics
  metadata: AnalyticsMetadata
  status: 'success' | 'error' | 'partial'
  errors?: string[]
}

export interface AnalyticsMetadata {
  generatedAt: Date
  dataFreshness: Date
  coverage: number
  confidence: number
  sources: string[]
}
