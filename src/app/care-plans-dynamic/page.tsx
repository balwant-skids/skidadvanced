'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Star,
  ArrowRight,
  Users,
  Clock,
  Shield,
  Zap,
  Heart,
  Brain,
  Eye,
  Ear,
  Utensils,
  Activity,
  Moon,
  Smile,
  Wind,
  Target,
  Award,
  TrendingUp,
  Calendar,
  CreditCard,
  Gift,
  Sparkles,
  Filter,
  Search,
  Sliders,
  RefreshCw,
  ChevronDown,
  Info,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { carePlansAPI } from '@/lib/api/care-plans'
import { CarePlan, PlanFilters, Service } from '@/types/care-plans'

export default function DynamicCarePlansPage() {
  const [plans, setPlans] = useState<CarePlan[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [filters, setFilters] = useState<PlanFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'popularity' | 'name'>('popularity')

  useEffect(() => {
    loadPlansAndServices()
  }, [filters])

  const loadPlansAndServices = async () => {
    setLoading(true)
    try {
      const [plansResponse, servicesResponse] = await Promise.all([
        carePlansAPI.getCarePlans(filters),
        carePlansAPI.getServices()
      ])
      
      setPlans(plansResponse.plans)
      setServices(servicesResponse)
    } catch (error) {
      console.error('Error loading plans and services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof PlanFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(selectedPlan === planId ? null : planId)
  }

  const getServiceIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      vision: Eye,
      hearing: Ear,
      nutrition: Utensils,
      behavioral: Brain,
      dental: Smile,
      dermatology: Shield,
      allergy: Shield,
      sleep: Moon,
      focus: Wind,
      movement: Activity
    }
    return iconMap[type] || Target
  }

  const filteredAndSortedPlans = plans
    .filter(plan => 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricing.finalPrice - b.pricing.finalPrice
        case 'name':
          return a.name.localeCompare(b.name)
        case 'popularity':
        default:
          return b.analytics.enrollments - a.analytics.enrollments
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading care plans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Dynamic Care Plans
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              Personalized care plans built from our comprehensive suite of interventions and services. 
              Each plan is dynamically created to meet your child's unique needs and developmental goals.
            </motion.p>
            
            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                { icon: Sparkles, text: 'AI-Powered Recommendations', color: 'text-purple-600' },
                { icon: Target, text: 'Personalized Combinations', color: 'text-blue-600' },
                { icon: TrendingUp, text: 'Real-time Updates', color: 'text-green-600' },
                { icon: Shield, text: 'Holistic Care Approach', color: 'text-orange-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search care plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sort and Filter Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="price">Price</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={loadPlansAndServices}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={filters.category?.[0] || ''}
                          onChange={(e) => handleFilterChange('category', e.target.value ? [e.target.value] : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Categories</option>
                          <option value="essential">Essential</option>
                          <option value="comprehensive">Comprehensive</option>
                          <option value="premium">Premium</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange?.[0] || ''}
                            onChange={(e) => {
                              const min = parseInt(e.target.value) || 0
                              const max = filters.priceRange?.[1] || 10000
                              handleFilterChange('priceRange', [min, max])
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange?.[1] || ''}
                            onChange={(e) => {
                              const min = filters.priceRange?.[0] || 0
                              const max = parseInt(e.target.value) || 10000
                              handleFilterChange('priceRange', [min, max])
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                        <select
                          value={filters.ageGroup || ''}
                          onChange={(e) => handleFilterChange('ageGroup', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Ages</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-12">6-12 years</option>
                          <option value="13+">13+ years</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {filteredAndSortedPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative bg-white rounded-3xl shadow-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 scale-105 shadow-2xl' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-2xl'
                }`}
                onClick={() => handlePlanSelection(plan.id)}
              >
                {/* Popular Badge */}
                {plan.analytics.enrollments > 100 && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${plan.theme.focus === 'academic' ? 'from-blue-400 to-indigo-600' : 
                  plan.theme.focus === 'growth' ? 'from-green-400 to-emerald-600' :
                  plan.theme.focus === 'behavioral' ? 'from-purple-400 to-indigo-600' :
                  plan.theme.focus === 'preventive' ? 'from-emerald-400 to-green-600' :
                  plan.theme.focus === 'therapeutic' ? 'from-orange-400 to-red-600' :
                  'from-blue-400 to-purple-600'} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{plan.displayName}</h3>
                      <p className="text-sm opacity-90 capitalize">{plan.category} Plan</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{plan.pricing.finalPrice}</div>
                      <div className="text-sm opacity-90">/{plan.pricing.billingCycle}</div>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between text-sm opacity-90">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{plan.analytics.enrollments} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{plan.analytics.satisfactionScore.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{plan.analytics.retentionRate}% retention</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-2">{plan.description}</p>

                  {/* Services Included */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Services Included ({plan.services.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {plan.services.slice(0, 4).map((planService) => {
                        const service = services.find(s => s.id === planService.serviceId)
                        if (!service) return null
                        
                        const ServiceIcon = getServiceIcon(service.type)
                        return (
                          <div key={planService.serviceId} className="flex items-center space-x-2 text-sm">
                            <ServiceIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{service.name}</span>
                          </div>
                        )
                      })}
                      {plan.services.length > 4 && (
                        <div className="text-sm text-gray-500 col-span-2">
                          +{plan.services.length - 4} more services
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Key Features</h4>
                    <div className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{plan.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Details */}
                  {plan.pricing.discountPercentage > 0 && (
                    <div className="mb-6 bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {plan.pricing.discountPercentage}% discount applied
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Save ₹{plan.pricing.basePrice - plan.pricing.finalPrice} per {plan.pricing.billingCycle}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Enroll Now</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-2 rounded-lg font-medium transition-all border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center space-x-1">
                        <Info className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                      <button className="py-2 rounded-lg font-medium transition-all border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedPlans.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No plans found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find the perfect care plan.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({})
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Need a Custom Plan?</h2>
            <p className="text-xl mb-6 opacity-90">
              Our specialists can create a personalized care plan tailored specifically to your child's unique needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/specialists"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Consult Our Specialists
              </Link>
              <Link
                href="/admin/care-plans"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
