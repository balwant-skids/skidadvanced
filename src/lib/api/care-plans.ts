// Care Plans Management API Layer

import { 
  CarePlan, 
  Service, 
  CarePlansResponse, 
  PlanCreationRequest, 
  ServiceCreationRequest,
  AIRecommendation,
  AdminDashboardStats,
  PlanFilters,
  PlanModification,
  ServiceBundle
} from '@/types/care-plans'

// Mock data store (in production, this would connect to your database)
class CarePlansStore {
  private plans: CarePlan[] = []
  private services: Service[] = []
  private modifications: PlanModification[] = []
  private bundles: ServiceBundle[] = []

  constructor() {
    this.initializeDefaultData()
  }

  private initializeDefaultData() {
    // Initialize with default services
    this.services = [
      {
        id: 'vision-screening',
        name: 'Comprehensive Vision Screening',
        category: 'assessment',
        type: 'vision',
        description: 'Advanced AI-powered vision assessment with myopia risk analysis',
        shortDescription: 'Complete eye health evaluation',
        icon: 'Eye',
        color: 'amber',
        gradient: 'from-amber-400 to-orange-600',
        basePrice: 2500,
        duration: 45,
        frequency: 'quarterly',
        ageGroups: [
          { min: 6, max: 216, label: '6 months - 18 years', adaptations: ['Age-appropriate testing methods'] }
        ],
        prerequisites: [],
        contraindications: ['Active eye infection'],
        outcomes: ['Early myopia detection', 'Vision development tracking'],
        technology: ['AI-powered analysis', 'Digital retinal imaging'],
        specialists: ['Pediatric Ophthalmologist', 'Vision Therapist'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      },
      {
        id: 'hearing-assessment',
        name: 'SoundScout Hearing Assessment',
        category: 'assessment',
        type: 'hearing',
        description: 'Game-based automated audiometry with speech development analysis',
        shortDescription: 'Fun, accurate hearing evaluation',
        icon: 'Ear',
        color: 'green',
        gradient: 'from-green-400 to-teal-600',
        basePrice: 2000,
        duration: 30,
        frequency: 'bi-weekly',
        ageGroups: [
          { min: 12, max: 216, label: '1 year - 18 years', adaptations: ['Game-based testing'] }
        ],
        prerequisites: [],
        contraindications: ['Ear infection', 'Recent ear surgery'],
        outcomes: ['Hearing threshold mapping', 'Speech clarity assessment'],
        technology: ['SoundScout platform', 'Automated audiometry'],
        specialists: ['Pediatric Audiologist', 'Speech Therapist'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      },
      {
        id: 'nutrition-analysis',
        name: 'AI Nutrition Analysis',
        category: 'assessment',
        type: 'nutrition',
        description: 'Comprehensive nutritional assessment with personalized meal planning',
        shortDescription: 'Smart nutrition evaluation',
        icon: 'Utensils',
        color: 'emerald',
        gradient: 'from-emerald-400 to-green-600',
        basePrice: 1800,
        duration: 60,
        frequency: 'monthly',
        ageGroups: [
          { min: 6, max: 216, label: '6 months - 18 years', adaptations: ['Age-specific nutritional needs'] }
        ],
        prerequisites: [],
        contraindications: ['Severe food allergies without medical clearance'],
        outcomes: ['Growth optimization', 'Nutritional deficiency identification'],
        technology: ['NutreeAI platform', 'Growth tracking algorithms'],
        specialists: ['Pediatric Nutritionist', 'Gastroenterologist'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    ]

    // Initialize with default care plans
    this.plans = [
      {
        id: 'essential-plan',
        name: 'Essential Care Plan',
        displayName: 'SKIDS Essential',
        description: 'Foundational pediatric care with core health screenings',
        category: 'essential',
        theme: {
          id: 'preventive-care',
          name: 'Preventive Care',
          description: 'Focus on early detection and prevention',
          focus: 'preventive',
          keywords: ['screening', 'prevention', 'early detection'],
          recommendedServices: ['vision-screening', 'hearing-assessment'],
          aiPrompts: ['Emphasize preventive benefits', 'Highlight early intervention']
        },
        targetAgeGroup: { min: 6, max: 216, label: '6 months - 18 years', adaptations: [] },
        services: [
          {
            serviceId: 'vision-screening',
            service: this.services[0],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          },
          {
            serviceId: 'hearing-assessment',
            service: this.services[1],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          }
        ],
        pricing: {
          basePrice: 3999,
          discountPercentage: 0,
          finalPrice: 3999,
          currency: 'INR',
          billingCycle: 'annually',
          setupFee: 0,
          cancellationFee: 0,
          upgradeCredit: 100
        },
        duration: 12,
        features: [
          '4x Health Screening (72 parameters)',
          '1x Behavioral Assessment',
          '1x Nutrition Analysis',
          'Growth & development tracking',
          'Vaccination schedule management',
          'Basic educational newsletter',
          '10% consultation discount',
          '5% vaccination discount'
        ],
        benefits: [
          'Early detection of health issues',
          'Foundational health monitoring',
          'Peace of mind for parents',
          'Professional guidance'
        ],
        isActive: true,
        isPromotional: false,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        analytics: {
          enrollments: 150,
          completionRate: 85,
          satisfactionScore: 4.2,
          retentionRate: 78,
          averageEngagement: 82,
          revenueGenerated: 599850,
          lastUpdated: new Date()
        }
      },
      {
        id: 'comprehensive-plan',
        name: 'Comprehensive Care Plan',
        displayName: 'SKIDS Comprehensive',
        description: 'Complete health and development protection with specialized assessments',
        category: 'comprehensive',
        theme: {
          id: 'holistic-care',
          name: 'Holistic Care',
          description: 'Comprehensive approach to child health',
          focus: 'holistic',
          keywords: ['comprehensive', 'specialized', 'complete care'],
          recommendedServices: ['vision-screening', 'hearing-assessment', 'nutrition-analysis'],
          aiPrompts: ['Emphasize comprehensive coverage', 'Highlight specialized assessments']
        },
        targetAgeGroup: { min: 6, max: 216, label: '6 months - 18 years', adaptations: [] },
        services: [
          {
            serviceId: 'vision-screening',
            service: this.services[0],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          },
          {
            serviceId: 'hearing-assessment',
            service: this.services[1],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          },
          {
            serviceId: 'nutrition-analysis',
            service: this.services[2],
            frequency: 'quarterly',
            sessions: 2,
            priority: 'primary',
            customizations: []
          }
        ],
        pricing: {
          basePrice: 6999,
          discountPercentage: 0,
          finalPrice: 6999,
          currency: 'INR',
          billingCycle: 'annually',
          setupFee: 0,
          cancellationFee: 0,
          upgradeCredit: 200
        },
        duration: 12,
        features: [
          'Everything in Essential Care',
          'FDA Eye-Tracking Autism Screening',
          '2x Nutrition Analysis',
          'Limited specialized behavioral assessments',
          'SUBSIDIZED premium educational content',
          'Weekly health insights newsletter',
          'Annual vision & hearing screening',
          'Priority emergency consultations',
          '15% consultation discount',
          '10% vaccination discount'
        ],
        benefits: [
          'Complete health protection',
          'Early detection of vision and hearing issues',
          'Specialized developmental assessments',
          'Enhanced educational resources'
        ],
        isActive: true,
        isPromotional: false,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        analytics: {
          enrollments: 250,
          completionRate: 88,
          satisfactionScore: 4.5,
          retentionRate: 85,
          averageEngagement: 88,
          revenueGenerated: 1749750,
          lastUpdated: new Date()
        }
      },
      {
        id: 'guardian-plan',
        name: 'Guardian Care Plan',
        displayName: 'SKIDS Guardian',
        description: 'Ultimate pediatric care with maximum coverage and personalized health optimization',
        category: 'premium',
        theme: {
          id: 'premium-care',
          name: 'Premium Care',
          description: 'Maximum protection and personalized optimization',
          focus: 'therapeutic',
          keywords: ['premium', 'unlimited', 'personalized', 'optimization'],
          recommendedServices: ['vision-screening', 'hearing-assessment', 'nutrition-analysis'],
          aiPrompts: ['Emphasize premium benefits', 'Highlight unlimited access']
        },
        targetAgeGroup: { min: 6, max: 216, label: '6 months - 18 years', adaptations: [] },
        services: [
          {
            serviceId: 'vision-screening',
            service: this.services[0],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          },
          {
            serviceId: 'hearing-assessment',
            service: this.services[1],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          },
          {
            serviceId: 'nutrition-analysis',
            service: this.services[2],
            frequency: 'quarterly',
            sessions: 4,
            priority: 'primary',
            customizations: []
          }
        ],
        pricing: {
          basePrice: 9999,
          discountPercentage: 0,
          finalPrice: 9999,
          currency: 'INR',
          billingCycle: 'annually',
          setupFee: 0,
          cancellationFee: 0,
          upgradeCredit: 300
        },
        duration: 12,
        features: [
          'Everything in Comprehensive Care',
          'FDA CE Hearing Assessment',
          '2x Behavioral Assessment',
          '4x Nutrition + Digital Parenting',
          'Unlimited specialized behavioral assessments',
          'FULL PREMIUM educational platform access',
          'Personalized learning recommendations',
          'Daily health & development insights',
          'Exclusive educational workshops',
          'Monthly health optimization consultations',
          'Advanced genetic counseling',
          '24/7 pediatric helpline access',
          'Sibling screening discounts',
          '20% consultation discount',
          '15% vaccination discount'
        ],
        benefits: [
          'Maximum health protection',
          'Personalized care and optimization',
          'Unlimited specialized assessments',
          'Premium educational resources',
          'Priority access to all services'
        ],
        isActive: true,
        isPromotional: false,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        analytics: {
          enrollments: 100,
          completionRate: 92,
          satisfactionScore: 4.8,
          retentionRate: 90,
          averageEngagement: 95,
          revenueGenerated: 999900,
          lastUpdated: new Date()
        }
      }
    ]
  }

  // Service Management
  async getServices(filters?: any): Promise<Service[]> {
    let filteredServices = this.services.filter(s => s.isActive)
    
    if (filters?.type) {
      filteredServices = filteredServices.filter(s => s.type === filters.type)
    }
    
    if (filters?.category) {
      filteredServices = filteredServices.filter(s => s.category === filters.category)
    }
    
    return filteredServices
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.find(s => s.id === id) || null
  }

  async createService(data: ServiceCreationRequest): Promise<Service> {
    const newService: Service = {
      id: `service-${Date.now()}`,
      ...data,
      icon: this.getIconForType(data.type),
      color: this.getColorForType(data.type),
      gradient: this.getGradientForType(data.type),
      shortDescription: data.description.substring(0, 50) + '...',
      prerequisites: [],
      contraindications: [],
      outcomes: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }
    
    this.services.push(newService)
    return newService
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const index = this.services.findIndex(s => s.id === id)
    if (index === -1) return null
    
    this.services[index] = {
      ...this.services[index],
      ...updates,
      updatedAt: new Date(),
      version: this.services[index].version + 1
    }
    
    return this.services[index]
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex(s => s.id === id)
    if (index === -1) return false
    
    this.services[index].isActive = false
    this.services[index].updatedAt = new Date()
    return true
  }

  // Care Plan Management
  async getCarePlans(filters?: PlanFilters): Promise<CarePlansResponse> {
    let filteredPlans = this.plans.filter(p => p.isActive)
    
    if (filters?.category) {
      filteredPlans = filteredPlans.filter(p => 
        filters.category!.includes(p.category)
      )
    }
    
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange
      filteredPlans = filteredPlans.filter(p => 
        p.pricing.finalPrice >= min && p.pricing.finalPrice <= max
      )
    }
    
    return {
      plans: filteredPlans,
      total: filteredPlans.length,
      page: 1,
      limit: 50,
      filters: filters || {}
    }
  }

  async getCarePlanById(id: string): Promise<CarePlan | null> {
    return this.plans.find(p => p.id === id) || null
  }

  async createCarePlan(data: PlanCreationRequest): Promise<CarePlan> {
    const services = await Promise.all(
      data.services.map(async (s) => ({
        ...s,
        service: await this.getServiceById(s.serviceId) as Service
      }))
    )

    const basePrice = services.reduce((total, s) => 
      total + (s.service.basePrice * s.sessions), 0
    )

    const newPlan: CarePlan = {
      id: `plan-${Date.now()}`,
      name: data.name,
      displayName: data.name,
      description: data.description,
      category: data.category as any,
      theme: {
        id: data.theme,
        name: data.theme,
        description: '',
        focus: 'holistic',
        keywords: [],
        recommendedServices: [],
        aiPrompts: []
      },
      targetAgeGroup: data.targetAgeGroup,
      services,
      pricing: {
        basePrice,
        discountPercentage: 0,
        finalPrice: data.pricing.finalPrice || basePrice,
        currency: 'INR',
        billingCycle: data.pricing.billingCycle || 'monthly',
        setupFee: data.pricing.setupFee || 0,
        cancellationFee: data.pricing.cancellationFee || 0,
        upgradeCredit: data.pricing.upgradeCredit || 0
      },
      duration: 12,
      features: data.features,
      benefits: [],
      isActive: true,
      isPromotional: false,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      analytics: {
        enrollments: 0,
        completionRate: 0,
        satisfactionScore: 0,
        retentionRate: 0,
        averageEngagement: 0,
        revenueGenerated: 0,
        lastUpdated: new Date()
      }
    }
    
    this.plans.push(newPlan)
    return newPlan
  }

  async updateCarePlan(id: string, updates: Partial<CarePlan>): Promise<CarePlan | null> {
    const index = this.plans.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.plans[index] = {
      ...this.plans[index],
      ...updates,
      updatedAt: new Date(),
      version: this.plans[index].version + 1
    }
    
    return this.plans[index]
  }

  async deleteCarePlan(id: string): Promise<boolean> {
    const index = this.plans.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.plans[index].isActive = false
    this.plans[index].updatedAt = new Date()
    return true
  }

  // AI Recommendations
  async getAIRecommendations(type: string, context: any): Promise<AIRecommendation[]> {
    // Mock AI recommendations
    return [
      {
        id: 'ai-rec-1',
        type: 'plan_creation',
        confidence: 0.85,
        reasoning: 'Based on user demographics and engagement patterns, a focus-enhancement plan would be highly successful',
        suggestedChanges: {
          planName: 'Academic Excellence Bundle',
          services: ['vision-screening', 'hearing-assessment', 'nutrition-analysis'],
          pricing: 599
        },
        expectedImpact: {
          enrollment: 25,
          retention: 15,
          satisfaction: 10,
          revenue: 35
        },
        createdAt: new Date()
      }
    ]
  }

  // Dashboard Analytics
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return {
      totalPlans: this.plans.length,
      activePlans: this.plans.filter(p => p.isActive).length,
      totalServices: this.services.length,
      activeServices: this.services.filter(s => s.isActive).length,
      totalEnrollments: this.plans.reduce((sum, p) => sum + p.analytics.enrollments, 0),
      monthlyRevenue: this.plans.reduce((sum, p) => sum + p.analytics.revenueGenerated, 0),
      averageSatisfaction: 4.3,
      retentionRate: 82,
      planPerformance: this.plans.map(p => ({
        planId: p.id,
        planName: p.displayName,
        enrollments: p.analytics.enrollments,
        revenue: p.analytics.revenueGenerated,
        satisfaction: p.analytics.satisfactionScore,
        retention: p.analytics.retentionRate,
        trend: 'up' as const
      })),
      serviceUtilization: this.services.map(s => ({
        serviceId: s.id,
        serviceName: s.name,
        utilization: Math.random() * 100,
        revenue: s.basePrice * Math.random() * 100,
        satisfaction: 4 + Math.random(),
        demand: 'high' as const
      }))
    }
  }

  // Helper methods
  private getIconForType(type: string): string {
    const iconMap: Record<string, string> = {
      vision: 'Eye',
      hearing: 'Ear',
      nutrition: 'Utensils',
      behavioral: 'Brain',
      dental: 'Smile',
      dermatology: 'Shield',
      allergy: 'Shield',
      sleep: 'Moon',
      focus: 'Wind',
      movement: 'Activity'
    }
    return iconMap[type] || 'Circle'
  }

  private getColorForType(type: string): string {
    const colorMap: Record<string, string> = {
      vision: 'amber',
      hearing: 'green',
      nutrition: 'emerald',
      behavioral: 'purple',
      dental: 'blue',
      dermatology: 'pink',
      allergy: 'yellow',
      sleep: 'indigo',
      focus: 'cyan',
      movement: 'orange'
    }
    return colorMap[type] || 'gray'
  }

  private getGradientForType(type: string): string {
    const gradientMap: Record<string, string> = {
      vision: 'from-amber-400 to-orange-600',
      hearing: 'from-green-400 to-teal-600',
      nutrition: 'from-emerald-400 to-green-600',
      behavioral: 'from-purple-400 to-indigo-600',
      dental: 'from-blue-400 to-indigo-600',
      dermatology: 'from-pink-400 to-rose-600',
      allergy: 'from-yellow-400 to-amber-600',
      sleep: 'from-indigo-400 to-purple-600',
      focus: 'from-cyan-400 to-blue-600',
      movement: 'from-orange-400 to-red-600'
    }
    return gradientMap[type] || 'from-gray-400 to-gray-600'
  }
}

// Singleton instance
const carePlansStore = new CarePlansStore()

// API functions
export const carePlansAPI = {
  // Services
  getServices: (filters?: any) => carePlansStore.getServices(filters),
  getServiceById: (id: string) => carePlansStore.getServiceById(id),
  createService: (data: ServiceCreationRequest) => carePlansStore.createService(data),
  updateService: (id: string, updates: Partial<Service>) => carePlansStore.updateService(id, updates),
  deleteService: (id: string) => carePlansStore.deleteService(id),

  // Care Plans
  getCarePlans: (filters?: PlanFilters) => carePlansStore.getCarePlans(filters),
  getCarePlanById: (id: string) => carePlansStore.getCarePlanById(id),
  createCarePlan: (data: PlanCreationRequest) => carePlansStore.createCarePlan(data),
  updateCarePlan: (id: string, updates: Partial<CarePlan>) => carePlansStore.updateCarePlan(id, updates),
  deleteCarePlan: (id: string) => carePlansStore.deleteCarePlan(id),

  // AI & Analytics
  getAIRecommendations: (type: string, context: any) => carePlansStore.getAIRecommendations(type, context),
  getDashboardStats: () => carePlansStore.getDashboardStats()
}
