// Unified Payment Gateway Interface

import {
  PaymentProvider,
  PaymentIntent,
  Subscription,
  PaymentMethod,
  PaymentTransaction,
  CreatePaymentIntentRequest,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  PaymentError,
  PaymentErrorData
} from '@/types/payment'

export abstract class PaymentGateway {
  protected provider: PaymentProvider
  protected isInitialized: boolean = false

  constructor(provider: PaymentProvider) {
    this.provider = provider
  }

  abstract initialize(): Promise<void>
  abstract createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent>
  abstract confirmPaymentIntent(intentId: string, paymentMethodId?: string): Promise<PaymentIntent>
  abstract cancelPaymentIntent(intentId: string): Promise<PaymentIntent>
  abstract refundPayment(transactionId: string, amount?: number): Promise<PaymentTransaction>
  
  abstract createSubscription(request: CreateSubscriptionRequest): Promise<Subscription>
  abstract updateSubscription(subscriptionId: string, updates: UpdateSubscriptionRequest): Promise<Subscription>
  abstract cancelSubscription(subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<Subscription>
  abstract pauseSubscription(subscriptionId: string): Promise<Subscription>
  abstract resumeSubscription(subscriptionId: string): Promise<Subscription>
  
  abstract createPaymentMethod(userId: string, paymentData: any): Promise<PaymentMethod>
  abstract deletePaymentMethod(paymentMethodId: string): Promise<boolean>
  abstract setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod>
  
  abstract handleWebhook(payload: string, signature: string): Promise<any>
  abstract verifyWebhookSignature(payload: string, signature: string): boolean

  // Common utility methods
  protected validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new PaymentError({
        code: 'INVALID_AMOUNT',
        message: 'Amount must be greater than 0',
        type: 'validation',
        providerId: this.provider.id
      })
    }
  }

  protected validateCurrency(currency: string): void {
    if (!this.provider.supportedCurrencies.includes(currency)) {
      throw new PaymentError({
        code: 'UNSUPPORTED_CURRENCY',
        message: `Currency ${currency} is not supported by ${this.provider.name}`,
        type: 'validation',
        providerId: this.provider.id
      })
    }
  }

  protected ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new PaymentError({
        code: 'NOT_INITIALIZED',
        message: `Payment gateway ${this.provider.name} is not initialized`,
        type: 'authentication',
        providerId: this.provider.id
      })
    }
  }

  // Provider info
  getProvider(): PaymentProvider {
    return this.provider
  }

  isSupported(feature: string): boolean {
    return this.provider.features.some(f => f.id === feature && f.isSupported)
  }
}

// Mock Payment Gateway for Development
export class MockPaymentGateway extends PaymentGateway {
  private mockData: {
    paymentIntents: Map<string, PaymentIntent>
    subscriptions: Map<string, Subscription>
    paymentMethods: Map<string, PaymentMethod>
    transactions: Map<string, PaymentTransaction>
  }

  constructor(provider: PaymentProvider) {
    super(provider)
    this.mockData = {
      paymentIntents: new Map(),
      subscriptions: new Map(),
      paymentMethods: new Map(),
      transactions: new Map()
    }
  }

  async initialize(): Promise<void> {
    // Mock initialization
    await new Promise(resolve => setTimeout(resolve, 100))
    this.isInitialized = true
  }

  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    this.ensureInitialized()
    this.validateAmount(request.amount)
    this.validateCurrency(request.currency)

    const intent: PaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      amount: request.amount,
      currency: request.currency,
      providerId: request.providerId,
      status: 'pending',
      metadata: request.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockData.paymentIntents.set(intent.id, intent)
    return intent
  }

  async confirmPaymentIntent(intentId: string, paymentMethodId?: string): Promise<PaymentIntent> {
    this.ensureInitialized()
    
    const intent = this.mockData.paymentIntents.get(intentId)
    if (!intent) {
      throw new PaymentError({
        code: 'INTENT_NOT_FOUND',
        message: `Payment intent ${intentId} not found`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 90% success rate for mock
    const isSuccess = Math.random() > 0.1
    
    intent.status = isSuccess ? 'succeeded' : 'failed'
    intent.updatedAt = new Date()

    if (isSuccess) {
      // Create transaction record
      const transaction: PaymentTransaction = {
        id: `txn_mock_${Date.now()}`,
        paymentIntentId: intentId,
        amount: intent.amount,
        currency: intent.currency,
        status: 'succeeded',
        providerId: this.provider.id,
        providerTransactionId: `mock_${Date.now()}`,
        fees: {
          platformFee: intent.amount * 0.02,
          providerFee: intent.amount * 0.029,
          totalFee: intent.amount * 0.049,
          netAmount: intent.amount * 0.951
        },
        metadata: intent.metadata,
        createdAt: new Date(),
        processedAt: new Date()
      }
      
      this.mockData.transactions.set(transaction.id, transaction)
    }

    return intent
  }

  async cancelPaymentIntent(intentId: string): Promise<PaymentIntent> {
    this.ensureInitialized()
    
    const intent = this.mockData.paymentIntents.get(intentId)
    if (!intent) {
      throw new PaymentError({
        code: 'INTENT_NOT_FOUND',
        message: `Payment intent ${intentId} not found`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    intent.status = 'cancelled'
    intent.updatedAt = new Date()
    return intent
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentTransaction> {
    this.ensureInitialized()
    
    const transaction = this.mockData.transactions.get(transactionId)
    if (!transaction) {
      throw new PaymentError({
        code: 'TRANSACTION_NOT_FOUND',
        message: `Transaction ${transactionId} not found`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    const refundAmount = amount || transaction.amount
    
    // Create refund transaction
    const refundTransaction: PaymentTransaction = {
      id: `refund_mock_${Date.now()}`,
      paymentIntentId: transaction.paymentIntentId,
      amount: -refundAmount,
      currency: transaction.currency,
      status: 'succeeded',
      providerId: this.provider.id,
      providerTransactionId: `refund_mock_${Date.now()}`,
      fees: {
        platformFee: 0,
        providerFee: 0,
        totalFee: 0,
        netAmount: -refundAmount
      },
      metadata: { ...transaction.metadata, type: 'refund', originalTransactionId: transactionId },
      createdAt: new Date(),
      processedAt: new Date()
    }

    this.mockData.transactions.set(refundTransaction.id, refundTransaction)
    return refundTransaction
  }

  async createSubscription(request: CreateSubscriptionRequest): Promise<Subscription> {
    this.ensureInitialized()
    this.validateAmount(request.billing.amount)
    this.validateCurrency(request.billing.currency)

    const now = new Date()
    const periodEnd = new Date(now)
    
    switch (request.billing.interval) {
      case 'monthly':
        periodEnd.setMonth(periodEnd.getMonth() + request.billing.intervalCount)
        break
      case 'quarterly':
        periodEnd.setMonth(periodEnd.getMonth() + (3 * request.billing.intervalCount))
        break
      case 'annually':
        periodEnd.setFullYear(periodEnd.getFullYear() + request.billing.intervalCount)
        break
    }

    const subscription: Subscription = {
      id: `sub_mock_${Date.now()}`,
      userId: request.userId,
      carePlanId: request.carePlanId,
      providerId: request.providerId,
      status: request.trialPeriodDays ? 'trialing' : 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      billing: request.billing,
      metadata: request.metadata,
      createdAt: now,
      updatedAt: now
    }

    this.mockData.subscriptions.set(subscription.id, subscription)
    return subscription
  }

  async updateSubscription(subscriptionId: string, updates: UpdateSubscriptionRequest): Promise<Subscription> {
    this.ensureInitialized()
    
    const subscription = this.mockData.subscriptions.get(subscriptionId)
    if (!subscription) {
      throw new PaymentError({
        code: 'SUBSCRIPTION_NOT_FOUND',
        message: `Subscription ${subscriptionId} not found`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    Object.assign(subscription, updates, { updatedAt: new Date() })
    return subscription
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false): Promise<Subscription> {
    const subscription = this.mockData.subscriptions.get(subscriptionId)
    if (!subscription) {
      throw new PaymentError({
        code: 'SUBSCRIPTION_NOT_FOUND',
        message: `Subscription ${subscriptionId} not found`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    const updatedSubscription = await this.updateSubscription(subscriptionId, {
      status: cancelAtPeriodEnd ? subscription.status : 'cancelled',
      cancelAtPeriodEnd
    })
    return updatedSubscription
  }

  async pauseSubscription(subscriptionId: string): Promise<Subscription> {
    return this.updateSubscription(subscriptionId, { status: 'paused' })
  }

  async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    return this.updateSubscription(subscriptionId, { status: 'active' })
  }

  async createPaymentMethod(userId: string, paymentData: any): Promise<PaymentMethod> {
    this.ensureInitialized()

    const paymentMethod: PaymentMethod = {
      id: `pm_mock_${Date.now()}`,
      userId,
      providerId: this.provider.id,
      type: paymentData.type || 'card',
      details: {
        last4: paymentData.last4 || '4242',
        brand: paymentData.brand || 'visa',
        expiryMonth: paymentData.expiryMonth || 12,
        expiryYear: paymentData.expiryYear || 2025,
        holderName: paymentData.holderName || 'Test User'
      },
      isDefault: paymentData.isDefault || false,
      isActive: true,
      createdAt: new Date()
    }

    this.mockData.paymentMethods.set(paymentMethod.id, paymentMethod)
    return paymentMethod
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    this.ensureInitialized()
    return this.mockData.paymentMethods.delete(paymentMethodId)
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod> {
    this.ensureInitialized()
    
    const paymentMethod = this.mockData.paymentMethods.get(paymentMethodId)
    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new PaymentError({
        code: 'PAYMENT_METHOD_NOT_FOUND',
        message: `Payment method ${paymentMethodId} not found for user ${userId}`,
        type: 'validation',
        providerId: this.provider.id
      })
    }

    // Reset all other payment methods for this user
    for (const [id, pm] of Array.from(this.mockData.paymentMethods)) {
      if (pm.userId === userId) {
        pm.isDefault = id === paymentMethodId
      }
    }

    return paymentMethod
  }

  async handleWebhook(payload: string, signature: string): Promise<any> {
    this.ensureInitialized()
    
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new PaymentError({
        code: 'INVALID_SIGNATURE',
        message: 'Webhook signature verification failed',
        type: 'authentication',
        providerId: this.provider.id
      })
    }

    // Mock webhook processing
    const event = JSON.parse(payload)
    return { processed: true, event }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Mock signature verification
    return signature === 'mock_signature'
  }
}

// Payment Gateway Factory
export class PaymentGatewayFactory {
  private static gateways: Map<string, PaymentGateway> = new Map()

  static async createGateway(provider: PaymentProvider): Promise<PaymentGateway> {
    if (this.gateways.has(provider.id)) {
      return this.gateways.get(provider.id)!
    }

    let gateway: PaymentGateway

    switch (provider.type) {
      case 'razorpay':
        // gateway = new RazorpayGateway(provider)
        gateway = new MockPaymentGateway(provider) // Use mock for now
        break
      case 'stripe':
        // gateway = new StripeGateway(provider)
        gateway = new MockPaymentGateway(provider) // Use mock for now
        break
      default:
        gateway = new MockPaymentGateway(provider)
    }

    await gateway.initialize()
    this.gateways.set(provider.id, gateway)
    return gateway
  }

  static getGateway(providerId: string): PaymentGateway | null {
    return this.gateways.get(providerId) || null
  }
}
