'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Sparkles,
  Save,
  X,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { CarePlanBuilder } from '@/components/admin/CarePlanBuilder'
import { carePlansAPI } from '@/lib/api/care-plans'
import { CarePlan, Service, AdminDashboardStats, AIRecommendation } from '@/types/care-plans'

export default function AdminCarePlansPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'services' | 'ai'>('dashboard')
  const [plans, setPlans] = useState<CarePlan[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [createType, setCreateType] = useState<'plan' | 'service'>('plan')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [plansResponse, servicesResponse, statsResponse, aiResponse] = await Promise.all([
        carePlansAPI.getCarePlans(),
        carePlansAPI.getServices(),
        carePlansAPI.getDashboardStats(),
        carePlansAPI.getAIRecommendations('plan_optimization', {})
      ])
      
      setPlans(plansResponse.plans)
      setServices(servicesResponse)
      setStats(statsResponse)
      setAIRecommendations(aiResponse)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = () => {
    setCreateType('plan')
    setShowCreateModal(true)
  }

  const handleCreateService = () => {
    setCreateType('service')
    setShowCreateModal(true)
  }

  const handleEditPlan = (plan: CarePlan) => {
    setSelectedPlan(plan)
    setShowEditModal(true)
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setShowEditModal(true)
  }

  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this care plan?')) {
      await carePlansAPI.deleteCarePlan(planId)
      loadData()
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await carePlansAPI.deleteService(serviceId)
      loadData()
    }
  }

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              Care Plans Management
            </h1>
            <p className="text-xl text-gray-600">
              Manage services, create dynamic care plans, and optimize with AI insights
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'plans', label: 'Care Plans', icon: Users },
                { id: 'services', label: 'Services', icon: Settings },
                { id: 'ai', label: 'AI Insights', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && stats && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Plans</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalPlans}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">+12% from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Services</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeServices}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Settings className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">+8% from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">+25% from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">+18% from last month</span>
                    </div>
                  </div>
                </div>

                {/* Plan Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Plan Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Plan Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Enrollments</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Satisfaction</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Retention</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.planPerformance.map((plan) => (
                          <tr key={plan.planId} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-900">{plan.planName}</td>
                            <td className="py-3 px-4 text-gray-600">{plan.enrollments}</td>
                            <td className="py-3 px-4 text-gray-600">₹{plan.revenue.toLocaleString()}</td>
                            <td className="py-3 px-4 text-gray-600">{plan.satisfaction.toFixed(1)}/5</td>
                            <td className="py-3 px-4 text-gray-600">{plan.retention}%</td>
                            <td className="py-3 px-4">
                              <span className="flex items-center text-green-600">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {plan.trend}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Plans Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search care plans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={handleCreatePlan}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Plan</span>
                    </button>
                  </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.displayName}</h3>
                            <p className="text-sm text-gray-600 capitalize">{plan.category} Plan</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPlan(plan)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Price</span>
                            <span className="font-bold text-gray-900">₹{plan.pricing.finalPrice}/month</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Services</span>
                            <span className="text-sm text-gray-900">{plan.services.length} included</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Enrollments</span>
                            <span className="text-sm text-gray-900">{plan.analytics.enrollments}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Satisfaction</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-900">{plan.analytics.satisfactionScore.toFixed(1)}</span>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= plan.analytics.satisfactionScore
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ⭐
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plan.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Services Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={handleCreateService}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Service</span>
                    </button>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{service.category} • {service.type}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Base Price</span>
                            <span className="font-bold text-gray-900">₹{service.basePrice}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Duration</span>
                            <span className="text-sm text-gray-900">{service.duration} minutes</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Frequency</span>
                            <span className="text-sm text-gray-900 capitalize">{service.frequency}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Specialists</span>
                            <span className="text-sm text-gray-900">{service.specialists.length}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* AI Insights Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights & Recommendations</h3>
                  <p className="text-gray-600">Intelligent suggestions to optimize your care plans and improve outcomes</p>
                </div>

                {/* AI Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {aiRecommendations.map((recommendation) => (
                    <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 capitalize">
                              {recommendation.type.replace('_', ' ')}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {Math.round(recommendation.confidence * 100)}% confidence
                            </p>
                          </div>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          AI Suggestion
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{recommendation.reasoning}</p>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Expected Impact:</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Enrollment:</span>
                            <span className="text-green-600 font-medium">+{recommendation.expectedImpact.enrollment}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Retention:</span>
                            <span className="text-green-600 font-medium">+{recommendation.expectedImpact.retention}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Satisfaction:</span>
                            <span className="text-green-600 font-medium">+{recommendation.expectedImpact.satisfaction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="text-green-600 font-medium">+{recommendation.expectedImpact.revenue}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                          Apply Suggestion
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Analytics */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    AI Performance Analytics
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-gray-600">Prediction Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">127</div>
                      <div className="text-sm text-gray-600">Recommendations Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Implementation Success Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Care Plan Builder Modal */}
      <CarePlanBuilder
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(plan) => {
          setPlans(prev => [...prev, plan])
          setShowCreateModal(false)
        }}
        editingPlan={null}
      />
    </div>
  )
}
