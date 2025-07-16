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
  Building,
  TrendingUp,
  Settings,
  Sparkles,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Star,
  Award,
  Shield,
  Zap,
  Globe,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity
} from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { vendorAPI } from '@/lib/api/vendor-management'
import { Vendor, VendorStatus, OnboardingStep } from '@/types/vendor'

export default function VendorManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vendors' | 'onboarding' | 'performance' | 'analytics'>('dashboard')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [vendorsData, analyticsData] = await Promise.all([
        vendorAPI.getVendors(),
        vendorAPI.getVendorAnalytics()
      ])
      
      setVendors(vendorsData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (vendorId: string, newStatus: VendorStatus, reason?: string) => {
    try {
      await vendorAPI.updateVendorStatus(vendorId, newStatus, reason)
      loadData()
    } catch (error) {
      console.error('Error updating vendor status:', error)
    }
  }

  const handleOnboardingStepUpdate = async (vendorId: string, stepId: string, status: string, comments?: string) => {
    try {
      await vendorAPI.updateOnboardingStep(vendorId, stepId, status, comments)
      loadData()
    } catch (error) {
      console.error('Error updating onboarding step:', error)
    }
  }

  const getStatusColor = (status: VendorStatus) => {
    const colors = {
      'pending_application': 'bg-yellow-100 text-yellow-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'active': 'bg-emerald-100 text-emerald-800',
      'suspended': 'bg-red-100 text-red-800',
      'terminated': 'bg-gray-100 text-gray-800',
      'rejected': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      case 'on_hold': return <Pause className="w-5 h-5 text-yellow-500" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const filteredVendors = vendors.filter(vendor =>
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.businessType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendor management...</p>
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
              Vendor Management System
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive vendor onboarding, performance tracking, and relationship management
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'vendors', label: 'Vendors', icon: Building },
                { id: 'onboarding', label: 'Onboarding', icon: Users },
                { id: 'performance', label: 'Performance', icon: TrendingUp },
                { id: 'analytics', label: 'Analytics', icon: Activity }
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
            {activeTab === 'dashboard' && analytics && (
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
                        <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.totalVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
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
                        <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.activeVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
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
                        <p className="text-sm font-medium text-gray-600">Pending Review</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.pendingVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600">Avg. {analytics.averageOnboardingTime} days</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Performance</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.averagePerformanceRating.toFixed(1)}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Star className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-purple-600">Out of 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Top Performing Vendors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Vendors</h3>
                  <div className="space-y-4">
                    {analytics.topPerformingVendors.map((vendor: Vendor, index: number) => (
                      <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{vendor.companyName}</h4>
                            <p className="text-sm text-gray-600 capitalize">{vendor.businessType.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium text-gray-900">{vendor.performance.overallRating}</span>
                            </div>
                            <p className="text-xs text-gray-600">{vendor.services.length} services</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                            {vendor.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Vendor Distribution by Type</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analytics.vendorsByBusinessType).map(([type, count]) => (
                      <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{count as number}</div>
                        <div className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vendors' && (
              <motion.div
                key="vendors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Vendors Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search vendors..."
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
                      onClick={() => setShowVendorModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Vendor</span>
                    </button>
                  </div>
                </div>

                {/* Vendors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.companyName}</h3>
                            <p className="text-sm text-gray-600 capitalize mb-2">{vendor.businessType.replace('_', ' ')}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                              {vendor.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedVendor(vendor)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{vendor.contactInfo.primaryContact.email}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Globe className="w-4 h-4" />
                            <span>{vendor.contactInfo.website || 'No website'}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Services</span>
                            <span className="text-sm font-medium text-gray-900">{vendor.services.length}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Performance</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-900">{vendor.performance.overallRating}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Onboarding</span>
                            <span className="text-sm font-medium text-gray-900">{vendor.onboarding.overallProgress}%</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex space-x-2">
                            {vendor.status === 'pending_application' && (
                              <button
                                onClick={() => handleStatusChange(vendor.id, 'under_review', 'Starting review process')}
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
                              >
                                Start Review
                              </button>
                            )}
                            {vendor.status === 'under_review' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'approved', 'Review completed successfully')}
                                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'rejected', 'Review failed requirements')}
                                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {vendor.status === 'approved' && (
                              <button
                                onClick={() => handleStatusChange(vendor.id, 'active', 'Vendor activated')}
                                className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-emerald-700"
                              >
                                Activate
                              </button>
                            )}
                            {vendor.status === 'active' && (
                              <button
                                onClick={() => handleStatusChange(vendor.id, 'suspended', 'Vendor suspended')}
                                className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-yellow-700"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
