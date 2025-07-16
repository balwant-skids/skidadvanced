// Payment Gateway Integration Types

export interface PaymentProvider {
  id: string
  name: string
  type: 'razorpay' | 'stripe' | 'paypal' | 'square' | 'custom'
  isActive: boolean
  supportedCurrencies: string[]
  supportedCountries: string[]
  features: PaymentFeature[]
  configuration: PaymentConfiguration
  webhookEndpoints: WebhookEndpoint[]
}

export interface PaymentFeature {
  id: string
  name: string
  description: string
  isSupported: boolean
  additionalCost?: number
}

export interface PaymentConfiguration {
  apiKey?: string
  secretKey?: string
  webhookSecret?: string
  merchantId?: string
  environment: 'sandbox' | 'production'
  customSettings: Record<string, any>
}

export interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  providerId: string
  status: PaymentStatus
  metadata: PaymentMetadata
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMetadata {
  carePlanId?: string
  subscriptionId?: string
  userId: string
  description: string
  customFields: Record<string, any>
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'

export interface Subscription {
  id: string
  userId: string
  carePlanId: string
  providerId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  billing: SubscriptionBilling
  metadata: SubscriptionMetadata
  createdAt: Date
  updatedAt: Date
}

export type SubscriptionStatus = 
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'
  | 'trialing'
  | 'paused'

export interface SubscriptionBilling {
  amount: number
  currency: string
  interval: 'monthly' | 'quarterly' | 'annually'
  intervalCount: number
  trialPeriodDays?: number
  discountPercentage?: number
}

export interface SubscriptionMetadata {
  carePlanName: string
  features: string[]
  autoRenewal: boolean
  customFields: Record<string, any>
}

export interface PaymentMethod {
  id: string
  userId: string
  providerId: string
  type: 'card' | 'bank_account' | 'wallet' | 'upi'
  details: PaymentMethodDetails
  isDefault: boolean
  isActive: boolean
  createdAt: Date
}

export interface PaymentMethodDetails {
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  bankName?: string
  accountType?: string
}

export interface PaymentTransaction {
  id: string
  paymentIntentId: string
  subscriptionId?: string
  amount: number
  currency: string
  status: PaymentStatus
  providerId: string
  providerTransactionId: string
  fees: TransactionFees
  metadata: Record<string, any>
  createdAt: Date
  processedAt?: Date
}

export interface TransactionFees {
  platformFee: number
  providerFee: number
  totalFee: number
  netAmount: number
}

export interface RefundRequest {
  id: string
  transactionId: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  requestedBy: string
  processedBy?: string
  createdAt: Date
  processedAt?: Date
}

export interface PaymentAnalytics {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  averageTransactionValue: number
  topPaymentMethods: PaymentMethodStats[]
  monthlyTrends: MonthlyPaymentTrend[]
  providerPerformance: ProviderPerformance[]
}

export interface PaymentMethodStats {
  type: string
  count: number
  percentage: number
  totalAmount: number
}

export interface MonthlyPaymentTrend {
  month: string
  revenue: number
  transactions: number
  successRate: number
}

export interface ProviderPerformance {
  providerId: string
  providerName: string
  successRate: number
  averageProcessingTime: number
  totalVolume: number
  fees: number
}

// API Request/Response Types
export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  providerId: string
  metadata: PaymentMetadata
  paymentMethodId?: string
  confirmImmediately?: boolean
}

export interface CreateSubscriptionRequest {
  userId: string
  carePlanId: string
  providerId: string
  paymentMethodId: string
  billing: SubscriptionBilling
  metadata: SubscriptionMetadata
  trialPeriodDays?: number
}

export interface UpdateSubscriptionRequest {
  status?: SubscriptionStatus
  billing?: Partial<SubscriptionBilling>
  metadata?: Partial<SubscriptionMetadata>
  cancelAtPeriodEnd?: boolean
}

export interface PaymentWebhookEvent {
  id: string
  type: string
  providerId: string
  data: any
  signature: string
  timestamp: Date
  processed: boolean
  retryCount: number
}

export interface PaymentProviderConfig {
  razorpay: {
    keyId: string
    keySecret: string
    webhookSecret: string
    environment: 'sandbox' | 'production'
  }
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
    environment: 'sandbox' | 'production'
  }
  paypal: {
    clientId: string
    clientSecret: string
    environment: 'sandbox' | 'production'
  }
}

export interface PaymentErrorData {
  code: string
  message: string
  type: 'validation' | 'authentication' | 'processing' | 'network'
  providerId: string
  details?: Record<string, any>
}

export class PaymentError extends Error {
  public code: string
  public type: 'validation' | 'authentication' | 'processing' | 'network'
  public providerId: string
  public details?: Record<string, any>

  constructor(data: PaymentErrorData) {
    super(data.message)
    this.name = 'PaymentError'
    this.code = data.code
    this.type = data.type
    this.providerId = data.providerId
    this.details = data.details
  }
}
