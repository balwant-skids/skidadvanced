'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Building,
  DollarSign,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Cpu,
  Database,
  Globe,
  Server,
  Eye,
  RotateCcw as Refresh,
  Download,
  Settings,
  Bell,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Award,
  Brain,
  PieChart,
  LineChart
} from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { unifiedAnalyticsAPI } from '@/lib/api/unified-analytics'
import { UnifiedAnalytics, KeyMetric, AnalyticsAlert } from '@/types/analytics'

export default function UnifiedAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'staff' | 'system' | 'roi' | 'predictive'>('overview')
  const [analytics, setAnalytics] = useState<UnifiedAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadAnalytics()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalytics()
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadAnalytics = async () => {
    try {
      const data = await unifiedAnalyticsAPI.getUnifiedAnalytics()
      setAnalytics(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMetricIcon = (name: string) => {
    const icons: Record<string, any> = {
      'Vendor Performance': Building,
      'System Uptime': Server,
      'Customer Satisfaction': Star,
      'Revenue': DollarSign,
      'ROI': TrendingUp
    }
    return icons[name] || BarChart3
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'on_track': 'text-green-600 bg-green-100',
      'at_risk': 'text-yellow-600 bg-yellow-100',
      'critical': 'text-red-600 bg-red-100'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      'info': 'bg-blue-100 text-blue-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'error': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading unified analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Unavailable</h2>
            <p className="text-gray-600">Unable to load analytics data. Please try again.</p>
            <button
              onClick={loadAnalytics}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                  Unified Analytics Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                  Comprehensive insights across vendors, staff, system health, and ROI
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
                </div>
                
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
                </button>
                
                <button
                  onClick={loadAnalytics}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Refresh className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Metrics Bar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Real-time System Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { label: 'Active Users', value: analytics.realTimeMetrics.activeUsers, icon: Users },
                { label: 'Transactions', value: analytics.realTimeMetrics.currentTransactions, icon: Activity },
                { label: 'System Load', value: `${analytics.realTimeMetrics.systemLoad.toFixed(1)}%`, icon: Cpu },
                { label: 'API Calls', value: analytics.realTimeMetrics.apiCalls, icon: Globe },
                { label: 'Errors', value: analytics.realTimeMetrics.errorCount, icon: AlertTriangle },
                { label: 'Response Time', value: `${analytics.realTimeMetrics.responseTime.toFixed(0)}ms`, icon: Zap },
                { label: 'Throughput', value: analytics.realTimeMetrics.throughput, icon: BarChart3 },
                { label: 'Active Alerts', value: analytics.realTimeMetrics.alerts, icon: Bell }
              ].map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                    <div className="text-xs text-gray-600">{metric.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'vendors', label: 'Vendor Analytics', icon: Building },
                { id: 'staff', label: 'Staff Productivity', icon: Users },
                { id: 'system', label: 'System Health', icon: Server },
                { id: 'roi', label: 'ROI Analysis', icon: DollarSign },
                { id: 'predictive', label: 'Predictive Insights', icon: Brain }
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
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analytics.overview.keyMetrics.map((metric, index) => {
                    const Icon = getMetricIcon(metric.name)
                    return (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                            {metric.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{metric.name}</h3>
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                          <span className="text-sm text-gray-600">{metric.unit}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {getChangeIcon(metric.changeType)}
                            <span className={`text-sm font-medium ${
                              metric.changeType === 'increase' ? 'text-green-600' : 
                              metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {Math.abs(metric.change)} {metric.unit}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Target: {metric.target}{metric.unit}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">{analytics.overview.activeIntegrations} active integrations</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Staff</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalStaff}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600">Avg performance: {analytics.staffProductivity.averagePerformance.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">₹{analytics.overview.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">ROI: {(analytics.overview.overallROI * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">System Uptime</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.overview.systemUptime}%</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                      <span className="text-emerald-600">Customer satisfaction: {analytics.overview.customerSatisfaction}</span>
                    </div>
                  </div>
                </div>

                {/* Active Alerts */}
                {analytics.alerts.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Active Alerts</h3>
                    <div className="space-y-4">
                      {analytics.alerts.filter(alert => alert.status === 'active').slice(0, 5).map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              alert.severity === 'critical' ? 'bg-red-500' :
                              alert.severity === 'error' ? 'bg-orange-500' :
                              alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{alert.title}</h4>
                              <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className="text-sm text-gray-500">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trends Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Trends</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analytics.overview.trends.map((trend, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{trend.metric}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {trend.data[trend.data.length - 1]?.value.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">
                            Confidence: {(trend.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {trend.data.length} data points • {trend.forecast.length} forecast points
                        </div>
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
                className="space-y-8"
              >
                {/* Vendor Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.vendorPerformance.totalVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.vendorPerformance.activeVendors}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Onboarding</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.vendorPerformance.pendingOnboarding}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Onboarding Time</p>
                        <p className="text-3xl font-bold text-gray-900">{analytics.vendorPerformance.averageOnboardingTime}</p>
                        <p className="text-sm text-gray-600">days</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Performing Vendors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Vendors</h3>
                  <div className="space-y-4">
                    {analytics.vendorPerformance.topPerformers.map((vendor, index) => (
                      <div key={vendor.vendorId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{vendor.vendorName}</h4>
                            <p className="text-sm text-gray-600">Overall Score: {vendor.overallScore.toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vendor.uptime.toFixed(1)}%</div>
                            <div className="text-xs text-gray-600">Uptime</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vendor.responseTime.toFixed(0)}ms</div>
                            <div className="text-xs text-gray-600">Response</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vendor.customerSatisfaction.toFixed(1)}</div>
                            <div className="text-xs text-gray-600">Satisfaction</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{(vendor.costEfficiency * 100).toFixed(0)}%</div>
                            <div className="text-xs text-gray-600">Efficiency</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Distribution</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {[
                      { label: 'Excellent', value: analytics.vendorPerformance.performanceDistribution.excellent, color: 'bg-green-500' },
                      { label: 'Good', value: analytics.vendorPerformance.performanceDistribution.good, color: 'bg-blue-500' },
                      { label: 'Average', value: analytics.vendorPerformance.performanceDistribution.average, color: 'bg-yellow-500' },
                      { label: 'Poor', value: analytics.vendorPerformance.performanceDistribution.poor, color: 'bg-orange-500' },
                      { label: 'Critical', value: analytics.vendorPerformance.performanceDistribution.critical, color: 'bg-red-500' }
                    ].map((category) => (
                      <div key={category.label} className="text-center">
                        <div className={`w-full h-20 ${category.color} rounded-lg mb-2 flex items-center justify-center`}>
                          <span className="text-white font-bold text-xl">{category.value}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{category.label}</div>
                        <div className="text-xs text-gray-600">
                          {((category.value / analytics.vendorPerformance.totalVendors) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
