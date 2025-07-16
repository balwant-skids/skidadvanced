// Vendor Management API Layer

import {
  Vendor,
  VendorService,
  VendorContract,
  VendorOnboardingStatus,
  VendorPerformance,
  VendorStatus,
  OnboardingStep,
  PerformanceMetric,
  VendorBusinessType
} from '@/types/vendor'

// Mock Vendor Data Store
class VendorManagementStore {
  private vendors: Map<string, Vendor> = new Map()
  private onboardingWorkflows: Map<string, OnboardingStep[]> = new Map()

  constructor() {
    this.initializeDefaultData()
  }

  private initializeDefaultData() {
    // Initialize with sample vendors
    const sampleVendors: Vendor[] = [
      {
        id: 'vendor-nutreeai',
        companyName: 'NutreeAI Technologies',
        businessType: 'technology_platform',
        registrationNumber: 'TECH2023001',
        taxId: 'TAX123456789',
        contactInfo: {
          primaryContact: {
            name: 'Dr. Sarah Chen',
            title: 'CEO & Co-Founder',
            email: 'sarah@nutreeai.com',
            phone: '+1-555-0123',
            preferredContactMethod: 'email'
          },
          technicalContact: {
            name: 'Alex Kumar',
            title: 'CTO',
            email: 'alex@nutreeai.com',
            phone: '+1-555-0124',
            preferredContactMethod: 'email'
          },
          billingContact: {
            name: 'Maria Rodriguez',
            title: 'Finance Director',
            email: 'billing@nutreeai.com',
            phone: '+1-555-0125',
            preferredContactMethod: 'email'
          },
          supportContact: {
            name: 'Support Team',
            title: 'Customer Success',
            email: 'support@nutreeai.com',
            phone: '+1-555-0126',
            preferredContactMethod: 'email'
          },
          address: {
            street: '123 Innovation Drive',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            zipCode: '94105',
            isHeadquarters: true
          },
          website: 'https://nutreeai.netlify.app',
          socialMedia: {
            linkedin: 'https://linkedin.com/company/nutreeai',
            twitter: 'https://twitter.com/nutreeai'
          }
        },
        profile: {
          description: 'AI-powered personalized nutrition analysis and meal planning platform for pediatric healthcare.',
          foundedYear: 2022,
          employeeCount: 25,
          annualRevenue: 2500000,
          targetMarkets: ['Healthcare', 'Pediatrics', 'Nutrition'],
          certifications: [
            {
              name: 'HIPAA Compliance',
              issuingBody: 'HHS',
              issueDate: new Date('2023-01-15'),
              expiryDate: new Date('2025-01-15'),
              certificateNumber: 'HIPAA-2023-001',
              verified: true,
              documentUrl: '/docs/hipaa-cert.pdf'
            }
          ],
          awards: [
            {
              title: 'Best Healthcare AI Innovation',
              issuingOrganization: 'HealthTech Awards',
              year: 2023,
              description: 'Recognition for innovative AI-driven nutrition platform',
              category: 'Healthcare Technology'
            }
          ],
          clientTestimonials: [
            {
              clientName: 'Dr. Michael Johnson',
              clientTitle: 'Pediatrician',
              clientCompany: 'Children\'s Health Center',
              testimonial: 'NutreeAI has transformed how we approach pediatric nutrition. The AI recommendations are incredibly accurate.',
              rating: 5,
              date: new Date('2023-09-15'),
              verified: true
            }
          ],
          caseStudies: [
            {
              id: 'case-001',
              title: 'Improving Childhood Obesity Outcomes',
              description: 'Implementation of AI nutrition planning in pediatric clinic',
              challenge: 'High childhood obesity rates and poor nutrition compliance',
              solution: 'Personalized AI-driven meal plans with family engagement',
              results: '40% improvement in nutrition compliance, 25% reduction in BMI',
              metrics: [
                { name: 'Compliance Rate', value: '85%', improvement: '+40%' },
                { name: 'BMI Reduction', value: '2.3 points', improvement: '-25%' }
              ],
              clientIndustry: 'Healthcare',
              duration: '6 months',
              documentUrl: '/docs/case-study-001.pdf'
            }
          ],
          logo: '/logos/nutreeai-logo.png',
          gallery: ['/gallery/nutreeai-1.jpg', '/gallery/nutreeai-2.jpg']
        },
        services: [
          {
            id: 'nutreeai-nutrition-analysis',
            name: 'AI Nutrition Analysis',
            description: 'Comprehensive nutritional assessment with personalized meal planning',
            category: 'assessment',
            subcategory: 'nutrition',
            pricing: {
              model: 'per_user',
              basePrice: 29.99,
              currency: 'USD',
              billingFrequency: 'monthly',
              tiers: [
                {
                  name: 'Basic',
                  minUsers: 1,
                  maxUsers: 100,
                  pricePerUser: 29.99,
                  features: ['Basic nutrition analysis', 'Meal suggestions']
                },
                {
                  name: 'Professional',
                  minUsers: 101,
                  maxUsers: 500,
                  pricePerUser: 24.99,
                  features: ['Advanced analytics', 'Custom meal plans', 'Progress tracking']
                }
              ],
              discounts: [],
              setupFee: 99,
              cancellationFee: 0
            },
            features: [
              {
                name: 'AI-Powered Analysis',
                description: 'Machine learning algorithms for nutrition assessment',
                category: 'core',
                isCore: true,
                additionalCost: 0
              },
              {
                name: 'Personalized Meal Plans',
                description: 'Custom meal planning based on individual needs',
                category: 'core',
                isCore: true,
                additionalCost: 0
              }
            ],
            integrationRequirements: [
              {
                type: 'api',
                description: 'RESTful API integration for nutrition data exchange',
                technicalSpecs: [
                  {
                    name: 'API Version',
                    value: 'v2.0',
                    required: true,
                    description: 'Current API version'
                  }
                ],
                securityRequirements: [
                  {
                    type: 'OAuth 2.0',
                    description: 'OAuth 2.0 authentication required',
                    compliance: ['HIPAA', 'SOC 2'],
                    required: true
                  }
                ],
                dataRequirements: [
                  {
                    dataType: 'patient_nutrition_data',
                    format: 'JSON',
                    frequency: 'real-time',
                    direction: 'bidirectional',
                    required: true
                  }
                ]
              }
            ],
            supportLevels: [
              {
                name: 'Standard Support',
                description: 'Email support during business hours',
                responseTime: '24 hours',
                availability: 'Mon-Fri 9AM-5PM PST',
                channels: ['email'],
                additionalCost: 0
              }
            ],
            sla: {
              uptime: 99.9,
              responseTime: 200,
              resolutionTime: 24,
              availability: '24/7',
              penalties: [],
              credits: []
            },
            availability: {
              regions: ['North America', 'Europe'],
              languages: ['English', 'Spanish'],
              timeZones: ['PST', 'EST', 'GMT'],
              maintenanceWindows: [
                {
                  dayOfWeek: 0,
                  startTime: '02:00',
                  endTime: '04:00',
                  timezone: 'PST',
                  frequency: 'weekly'
                }
              ]
            },
            documentation: {
              apiDocs: 'https://docs.nutreeai.com/api',
              userGuide: 'https://docs.nutreeai.com/user-guide',
              integrationGuide: 'https://docs.nutreeai.com/integration',
              troubleshooting: 'https://docs.nutreeai.com/troubleshooting',
              faq: 'https://docs.nutreeai.com/faq',
              videos: ['https://youtube.com/nutreeai-demo']
            },
            status: 'active'
          }
        ],
        contracts: [],
        onboarding: {
          currentStep: 8,
          totalSteps: 8,
          completedSteps: [
            {
              id: 'step-1',
              name: 'Company Registration',
              description: 'Submit company registration documents',
              category: 'documentation',
              required: true,
              status: 'completed',
              completedDate: new Date('2023-01-15'),
              documents: ['registration-cert.pdf'],
              reviewComments: 'All documents verified'
            }
          ],
          pendingSteps: [],
          overallProgress: 100,
          estimatedCompletion: new Date('2023-02-01'),
          assignedReviewer: 'admin-001',
          reviewNotes: [
            {
              id: 'note-1',
              reviewer: 'admin-001',
              step: 'step-1',
              note: 'Excellent documentation provided',
              type: 'approval',
              date: new Date('2023-01-16'),
              resolved: true
            }
          ]
        },
        performance: {
          overallRating: 4.8,
          metrics: [
            {
              name: 'Service Uptime',
              value: 99.95,
              unit: '%',
              target: 99.9,
              status: 'above_target',
              trend: 'stable',
              lastMeasured: new Date()
            },
            {
              name: 'Customer Satisfaction',
              value: 4.8,
              unit: '/5',
              target: 4.5,
              status: 'above_target',
              trend: 'improving',
              lastMeasured: new Date()
            }
          ],
          trends: [],
          benchmarks: [],
          reviews: [],
          incidents: [],
          lastUpdated: new Date()
        },
        compliance: {
          certifications: [],
          audits: [],
          policies: [],
          training: [],
          violations: [],
          status: 'compliant',
          lastReview: new Date('2023-06-01'),
          nextReview: new Date('2024-06-01')
        },
        integration: {
          status: 'live',
          type: ['api', 'webhook'],
          endpoints: [
            {
              id: 'endpoint-1',
              name: 'Nutrition Analysis API',
              url: 'https://api.nutreeai.com/v2/analyze',
              method: 'POST',
              purpose: 'Analyze nutrition data',
              authentication: ['OAuth 2.0'],
              rateLimit: {
                requests: 1000,
                period: 'hour'
              },
              status: 'active'
            }
          ],
          authentication: {
            type: 'oauth2',
            configuration: {
              clientId: 'skids-client-id',
              scope: 'nutrition:read nutrition:write'
            },
            credentials: [
              {
                name: 'client_secret',
                value: 'encrypted_secret',
                encrypted: true,
                lastRotated: new Date('2023-01-01'),
                expiryDate: new Date('2024-01-01')
              }
            ]
          },
          dataMapping: [
            {
              sourceField: 'patient_id',
              targetField: 'user_id',
              transformation: 'direct',
              validation: 'required',
              required: true
            }
          ],
          testing: {
            testSuites: [],
            lastRun: new Date(),
            nextRun: new Date(),
            status: 'passing',
            coverage: 95
          },
          monitoring: {
            uptime: 99.95,
            responseTime: 150,
            errorRate: 0.05,
            throughput: 1000,
            alerts: [],
            metrics: []
          },
          documentation: {
            apiDocs: 'https://docs.nutreeai.com/api',
            integrationGuide: 'https://docs.nutreeai.com/skids-integration',
            troubleshooting: 'https://docs.nutreeai.com/troubleshooting'
          }
        },
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date()
      }
    ]

    sampleVendors.forEach(vendor => {
      this.vendors.set(vendor.id, vendor)
    })

    // Initialize onboarding workflows
    this.initializeOnboardingWorkflows()
  }

  private initializeOnboardingWorkflows() {
    const defaultWorkflow: OnboardingStep[] = [
      {
        id: 'step-1',
        name: 'Company Registration',
        description: 'Submit company registration and legal documents',
        category: 'documentation',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-2',
        name: 'Business Verification',
        description: 'Verify business credentials and certifications',
        category: 'verification',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-3',
        name: 'Service Documentation',
        description: 'Provide detailed service documentation and specifications',
        category: 'documentation',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-4',
        name: 'Technical Integration',
        description: 'Complete technical integration and API setup',
        category: 'integration',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-5',
        name: 'Security Review',
        description: 'Security assessment and compliance verification',
        category: 'verification',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-6',
        name: 'Testing & Validation',
        description: 'Comprehensive testing of integration and services',
        category: 'testing',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-7',
        name: 'Contract Execution',
        description: 'Finalize and execute service agreements',
        category: 'approval',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      },
      {
        id: 'step-8',
        name: 'Go-Live Approval',
        description: 'Final approval and activation of vendor services',
        category: 'approval',
        required: true,
        status: 'not_started',
        documents: [],
        reviewComments: ''
      }
    ]

    this.onboardingWorkflows.set('default', defaultWorkflow)
  }

  // Vendor CRUD Operations
  async getVendors(filters?: any): Promise<Vendor[]> {
    let vendors = Array.from(this.vendors.values())
    
    if (filters?.status) {
      vendors = vendors.filter(v => v.status === filters.status)
    }
    
    if (filters?.businessType) {
      vendors = vendors.filter(v => v.businessType === filters.businessType)
    }
    
    return vendors
  }

  async getVendorById(id: string): Promise<Vendor | null> {
    return this.vendors.get(id) || null
  }

  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      companyName: vendorData.companyName || '',
      businessType: vendorData.businessType || 'other',
      registrationNumber: vendorData.registrationNumber || '',
      taxId: vendorData.taxId || '',
      contactInfo: vendorData.contactInfo || {} as any,
      profile: vendorData.profile || {} as any,
      services: [],
      contracts: [],
      onboarding: {
        currentStep: 1,
        totalSteps: 8,
        completedSteps: [],
        pendingSteps: this.onboardingWorkflows.get('default') || [],
        overallProgress: 0,
        estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        reviewNotes: []
      },
      performance: {
        overallRating: 0,
        metrics: [],
        trends: [],
        benchmarks: [],
        reviews: [],
        incidents: [],
        lastUpdated: new Date()
      },
      compliance: {
        certifications: [],
        audits: [],
        policies: [],
        training: [],
        violations: [],
        status: 'under_review',
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      },
      integration: {
        status: 'not_started',
        type: [],
        endpoints: [],
        authentication: {
          type: 'api_key',
          configuration: {},
          credentials: []
        },
        dataMapping: [],
        testing: {
          testSuites: [],
          lastRun: new Date(),
          nextRun: new Date(),
          status: 'not_run',
          coverage: 0
        },
        monitoring: {
          uptime: 0,
          responseTime: 0,
          errorRate: 0,
          throughput: 0,
          alerts: [],
          metrics: []
        },
        documentation: {}
      },
      status: 'pending_application',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.vendors.set(newVendor.id, newVendor)
    return newVendor
  }

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
    const vendor = this.vendors.get(id)
    if (!vendor) return null

    const updatedVendor = {
      ...vendor,
      ...updates,
      updatedAt: new Date()
    }

    this.vendors.set(id, updatedVendor)
    return updatedVendor
  }

  async updateVendorStatus(id: string, status: VendorStatus, reason?: string): Promise<Vendor | null> {
    const vendor = this.vendors.get(id)
    if (!vendor) return null

    vendor.status = status
    vendor.updatedAt = new Date()

    // Add status change to review notes
    if (reason) {
      vendor.onboarding.reviewNotes.push({
        id: `note-${Date.now()}`,
        reviewer: 'system',
        step: 'status_change',
        note: `Status changed to ${status}: ${reason}`,
        type: 'comment',
        date: new Date(),
        resolved: true
      })
    }

    this.vendors.set(id, vendor)
    return vendor
  }

  // Onboarding Management
  async updateOnboardingStep(vendorId: string, stepId: string, status: string, comments?: string): Promise<boolean> {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return false

    const step = vendor.onboarding.pendingSteps.find(s => s.id === stepId) ||
                 vendor.onboarding.completedSteps.find(s => s.id === stepId)
    
    if (!step) return false

    step.status = status as any
    step.reviewComments = comments
    
    if (status === 'completed') {
      step.completedDate = new Date()
      
      // Move from pending to completed
      vendor.onboarding.pendingSteps = vendor.onboarding.pendingSteps.filter(s => s.id !== stepId)
      if (!vendor.onboarding.completedSteps.find(s => s.id === stepId)) {
        vendor.onboarding.completedSteps.push(step)
      }
      
      // Update progress
      vendor.onboarding.overallProgress = 
        (vendor.onboarding.completedSteps.length / vendor.onboarding.totalSteps) * 100
      
      // Update current step
      vendor.onboarding.currentStep = vendor.onboarding.completedSteps.length + 1
    }

    vendor.updatedAt = new Date()
    this.vendors.set(vendorId, vendor)
    return true
  }

  // Performance Management
  async updateVendorPerformance(vendorId: string, metrics: PerformanceMetric[]): Promise<boolean> {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return false

    vendor.performance.metrics = metrics
    vendor.performance.lastUpdated = new Date()
    
    // Calculate overall rating based on metrics
    const avgRating = metrics.reduce((sum, metric) => {
      const normalizedValue = Math.min(metric.value / metric.target, 1) * 5
      return sum + normalizedValue
    }, 0) / metrics.length
    
    vendor.performance.overallRating = Math.round(avgRating * 10) / 10

    vendor.updatedAt = new Date()
    this.vendors.set(vendorId, vendor)
    return true
  }

  // Service Management
  async addVendorService(vendorId: string, service: VendorService): Promise<boolean> {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return false

    service.id = `service-${Date.now()}`
    vendor.services.push(service)
    vendor.updatedAt = new Date()
    
    this.vendors.set(vendorId, vendor)
    return true
  }

  async updateVendorService(vendorId: string, serviceId: string, updates: Partial<VendorService>): Promise<boolean> {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return false

    const serviceIndex = vendor.services.findIndex(s => s.id === serviceId)
    if (serviceIndex === -1) return false

    vendor.services[serviceIndex] = {
      ...vendor.services[serviceIndex],
      ...updates
    }
    
    vendor.updatedAt = new Date()
    this.vendors.set(vendorId, vendor)
    return true
  }

  // Analytics
  async getVendorAnalytics(): Promise<any> {
    const vendors = Array.from(this.vendors.values())
    
    return {
      totalVendors: vendors.length,
      activeVendors: vendors.filter(v => v.status === 'active').length,
      pendingVendors: vendors.filter(v => v.status === 'pending_application').length,
      averageOnboardingTime: 21, // days
      averagePerformanceRating: vendors.reduce((sum, v) => sum + v.performance.overallRating, 0) / vendors.length,
      topPerformingVendors: vendors
        .sort((a, b) => b.performance.overallRating - a.performance.overallRating)
        .slice(0, 5),
      vendorsByBusinessType: vendors.reduce((acc, vendor) => {
        acc[vendor.businessType] = (acc[vendor.businessType] || 0) + 1
        return acc
      }, {} as Record<VendorBusinessType, number>)
    }
  }
}

// Singleton instance
const vendorStore = new VendorManagementStore()

// API exports
export const vendorAPI = {
  // Vendor Management
  getVendors: (filters?: any) => vendorStore.getVendors(filters),
  getVendorById: (id: string) => vendorStore.getVendorById(id),
  createVendor: (data: Partial<Vendor>) => vendorStore.createVendor(data),
  updateVendor: (id: string, updates: Partial<Vendor>) => vendorStore.updateVendor(id, updates),
  updateVendorStatus: (id: string, status: VendorStatus, reason?: string) => 
    vendorStore.updateVendorStatus(id, status, reason),

  // Onboarding Management
  updateOnboardingStep: (vendorId: string, stepId: string, status: string, comments?: string) =>
    vendorStore.updateOnboardingStep(vendorId, stepId, status, comments),

  // Performance Management
  updateVendorPerformance: (vendorId: string, metrics: PerformanceMetric[]) =>
    vendorStore.updateVendorPerformance(vendorId, metrics),

  // Service Management
  addVendorService: (vendorId: string, service: VendorService) =>
    vendorStore.addVendorService(vendorId, service),
  updateVendorService: (vendorId: string, serviceId: string, updates: Partial<VendorService>) =>
    vendorStore.updateVendorService(vendorId, serviceId, updates),

  // Analytics
  getVendorAnalytics: () => vendorStore.getVendorAnalytics()
}
