// Service Integration Framework Types

export interface ServiceIntegration {
  id: string
  name: string
  description: string
  type: ServiceIntegrationType
  provider: ServiceProvider
  configuration: IntegrationConfiguration
  endpoints: ServiceEndpoint[]
  authentication: ServiceAuthentication
  dataMapping: ServiceDataMapping
  monitoring: ServiceMonitoring
  status: IntegrationStatus
  version: string
  createdAt: Date
  updatedAt: Date
}

export type ServiceIntegrationType = 
  | 'internal_skids'      // Home-grown SKIDS services
  | 'partner_api'         // Partner API integration
  | 'vendor_platform'     // External vendor platform
  | 'embedded_widget'     // Embedded widget/iframe
  | 'redirect_service'    // Redirect to external service
  | 'webhook_service'     // Webhook-based integration
  | 'file_transfer'       // File-based data exchange

export type IntegrationStatus = 
  | 'draft'
  | 'development'
  | 'testing'
  | 'staging'
  | 'production'
  | 'deprecated'
  | 'suspended'

export interface ServiceProvider {
  id: string
  name: string
  type: 'internal' | 'partner' | 'vendor'
  contactInfo: ProviderContactInfo
  technicalSpecs: TechnicalSpecification[]
  compliance: ComplianceInfo
  sla: ServiceLevelAgreement
}

export interface ProviderContactInfo {
  technicalContact: ContactPerson
  businessContact: ContactPerson
  supportContact: ContactPerson
  emergencyContact?: ContactPerson
}

export interface ContactPerson {
  name: string
  email: string
  phone: string
  role: string
  timezone: string
  availability: string
}

export interface TechnicalSpecification {
  name: string
  value: string
  description: string
  required: boolean
  category: 'api' | 'security' | 'performance' | 'data' | 'infrastructure'
}

export interface ComplianceInfo {
  standards: string[]
  certifications: string[]
  dataProtection: DataProtectionInfo
  auditRequirements: AuditRequirement[]
}

export interface DataProtectionInfo {
  encryption: EncryptionInfo
  dataRetention: DataRetentionPolicy
  dataLocation: string[]
  gdprCompliant: boolean
  hipaaCompliant: boolean
}

export interface EncryptionInfo {
  inTransit: string
  atRest: string
  keyManagement: string
}

export interface DataRetentionPolicy {
  retentionPeriod: string
  deletionProcess: string
  backupPolicy: string
}

export interface AuditRequirement {
  type: string
  frequency: string
  scope: string[]
  reportingFormat: string
}

export interface ServiceLevelAgreement {
  uptime: number
  responseTime: number
  throughput: number
  availability: string
  supportHours: string
  escalationProcedure: EscalationLevel[]
}

export interface EscalationLevel {
  level: number
  timeframe: string
  contacts: string[]
  actions: string[]
}

export interface IntegrationConfiguration {
  environment: 'sandbox' | 'staging' | 'production'
  baseUrl: string
  apiVersion: string
  timeout: number
  retryPolicy: RetryPolicy
  rateLimiting: RateLimitConfig
  caching: CacheConfig
  logging: LoggingConfig
  monitoring: MonitoringConfig
  security: SecurityConfig
}

export interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  initialDelay: number
  maxDelay: number
  retryableErrors: string[]
}

export interface RateLimitConfig {
  requestsPerSecond: number
  requestsPerMinute: number
  requestsPerHour: number
  burstLimit: number
  quotaResetStrategy: 'sliding_window' | 'fixed_window'
}

export interface CacheConfig {
  enabled: boolean
  ttl: number
  maxSize: number
  strategy: 'lru' | 'lfu' | 'fifo'
  invalidationRules: CacheInvalidationRule[]
}

export interface CacheInvalidationRule {
  trigger: string
  pattern: string
  action: 'invalidate' | 'refresh' | 'delete'
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  destinations: LogDestination[]
  format: 'json' | 'text'
  includeRequestBody: boolean
  includeResponseBody: boolean
  sensitiveFields: string[]
}

export interface LogDestination {
  type: 'file' | 'database' | 'external_service'
  configuration: Record<string, any>
}

export interface MonitoringConfig {
  healthCheck: HealthCheckConfig
  metrics: MetricConfig[]
  alerts: AlertConfig[]
  dashboards: DashboardConfig[]
}

export interface HealthCheckConfig {
  endpoint: string
  interval: number
  timeout: number
  expectedStatus: number
  expectedResponse?: string
}

export interface MetricConfig {
  name: string
  type: 'counter' | 'gauge' | 'histogram' | 'timer'
  description: string
  labels: string[]
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
}

export interface AlertConfig {
  name: string
  condition: string
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  notifications: NotificationChannel[]
  cooldown: number
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'slack' | 'webhook'
  configuration: Record<string, any>
}

export interface DashboardConfig {
  name: string
  description: string
  widgets: DashboardWidget[]
  refreshInterval: number
}

export interface DashboardWidget {
  type: 'chart' | 'table' | 'metric' | 'alert_status'
  title: string
  query: string
  visualization: Record<string, any>
}

export interface SecurityConfig {
  authentication: AuthenticationConfig
  authorization: AuthorizationConfig
  encryption: EncryptionConfig
  inputValidation: ValidationConfig
  outputSanitization: SanitizationConfig
}

export interface AuthenticationConfig {
  type: 'api_key' | 'oauth2' | 'jwt' | 'basic' | 'custom'
  configuration: Record<string, any>
  tokenRefresh: TokenRefreshConfig
}

export interface TokenRefreshConfig {
  enabled: boolean
  refreshThreshold: number
  maxRetries: number
  fallbackStrategy: string
}

export interface AuthorizationConfig {
  type: 'rbac' | 'abac' | 'custom'
  permissions: Permission[]
  roles: Role[]
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  actions: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface EncryptionConfig {
  algorithm: string
  keySize: number
  keyRotation: KeyRotationConfig
}

export interface KeyRotationConfig {
  enabled: boolean
  interval: string
  retentionPeriod: string
}

export interface ValidationConfig {
  schemas: ValidationSchema[]
  sanitization: SanitizationRule[]
  customValidators: CustomValidator[]
}

export interface ValidationSchema {
  endpoint: string
  method: string
  schema: Record<string, any>
}

export interface SanitizationRule {
  field: string
  type: 'html' | 'sql' | 'xss' | 'custom'
  configuration: Record<string, any>
}

export interface CustomValidator {
  name: string
  function: string
  parameters: Record<string, any>
}

export interface SanitizationConfig {
  outputEncoding: string
  contentTypeValidation: boolean
  responseHeaders: Record<string, string>
}

export interface ServiceEndpoint {
  id: string
  name: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  parameters: EndpointParameter[]
  requestSchema: Record<string, any>
  responseSchema: Record<string, any>
  authentication: boolean
  rateLimit: EndpointRateLimit
  caching: EndpointCaching
  monitoring: EndpointMonitoring
  documentation: EndpointDocumentation
}

export interface EndpointParameter {
  name: string
  type: 'path' | 'query' | 'header' | 'body'
  dataType: string
  required: boolean
  description: string
  validation: ParameterValidation
}

export interface ParameterValidation {
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: string[]
}

export interface EndpointRateLimit {
  enabled: boolean
  requestsPerSecond: number
  burstLimit: number
}

export interface EndpointCaching {
  enabled: boolean
  ttl: number
  varyHeaders: string[]
}

export interface EndpointMonitoring {
  enabled: boolean
  successRate: number
  responseTime: number
  errorTracking: boolean
}

export interface EndpointDocumentation {
  summary: string
  description: string
  examples: EndpointExample[]
  errorCodes: ErrorCode[]
}

export interface EndpointExample {
  name: string
  description: string
  request: Record<string, any>
  response: Record<string, any>
}

export interface ErrorCode {
  code: string
  message: string
  description: string
  resolution: string
}

export interface ServiceAuthentication {
  type: 'api_key' | 'oauth2' | 'jwt' | 'basic' | 'custom'
  configuration: AuthConfig
  credentials: AuthCredential[]
  tokenManagement: TokenManagement
}

export interface AuthConfig {
  clientId?: string
  clientSecret?: string
  scope?: string[]
  tokenUrl?: string
  authUrl?: string
  refreshUrl?: string
  customHeaders?: Record<string, string>
}

export interface AuthCredential {
  name: string
  value: string
  encrypted: boolean
  expiryDate?: Date
  rotationSchedule?: string
}

export interface TokenManagement {
  storage: 'memory' | 'database' | 'cache'
  encryption: boolean
  refreshStrategy: 'automatic' | 'manual' | 'on_demand'
  expiryBuffer: number
}

export interface ServiceDataMapping {
  inbound: DataMappingRule[]
  outbound: DataMappingRule[]
  transformations: DataTransformation[]
  validation: DataValidationRule[]
}

export interface DataMappingRule {
  sourceField: string
  targetField: string
  dataType: string
  required: boolean
  defaultValue?: any
  transformation?: string
}

export interface DataTransformation {
  name: string
  type: 'format' | 'calculate' | 'lookup' | 'custom'
  configuration: Record<string, any>
  inputFields: string[]
  outputFields: string[]
}

export interface DataValidationRule {
  field: string
  type: 'required' | 'format' | 'range' | 'custom'
  configuration: Record<string, any>
  errorMessage: string
}

export interface ServiceMonitoring {
  healthCheck: ServiceHealthCheck
  performance: PerformanceMonitoring
  usage: UsageMonitoring
  errors: ErrorMonitoring
  alerts: ServiceAlert[]
}

export interface ServiceHealthCheck {
  enabled: boolean
  interval: number
  timeout: number
  endpoint: string
  expectedResponse: any
  failureThreshold: number
  recoveryThreshold: number
}

export interface PerformanceMonitoring {
  responseTime: PerformanceMetric
  throughput: PerformanceMetric
  errorRate: PerformanceMetric
  availability: PerformanceMetric
}

export interface PerformanceMetric {
  current: number
  target: number
  threshold: number
  trend: 'improving' | 'stable' | 'degrading'
  history: MetricDataPoint[]
}

export interface MetricDataPoint {
  timestamp: Date
  value: number
}

export interface UsageMonitoring {
  requestCount: number
  uniqueUsers: number
  dataTransfer: number
  costTracking: CostTracking
}

export interface CostTracking {
  enabled: boolean
  costPerRequest: number
  costPerGB: number
  monthlyBudget: number
  currentSpend: number
}

export interface ErrorMonitoring {
  errorRate: number
  errorTypes: ErrorTypeStats[]
  recentErrors: ServiceError[]
}

export interface ErrorTypeStats {
  type: string
  count: number
  percentage: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface ServiceError {
  id: string
  timestamp: Date
  type: string
  message: string
  stackTrace?: string
  context: Record<string, any>
  resolved: boolean
}

export interface ServiceAlert {
  id: string
  name: string
  condition: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'suppressed'
  triggeredAt: Date
  resolvedAt?: Date
  notifications: AlertNotification[]
}

export interface AlertNotification {
  channel: string
  sentAt: Date
  status: 'sent' | 'failed' | 'pending'
  recipient: string
}
