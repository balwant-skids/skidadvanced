'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Settings,
  PlusCircle,
  Edit3,
  Send,
  Shield,
  Heart,
  Brain,
  CheckCircle,
  BookOpen,
  Gift,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Download
} from 'lucide-react'
import { useUser } from '@/hooks/useAuth'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'

interface ProviderStats {
  totalFamilies: number
  activeSubscriptions: number
  monthlyRevenue: number
  satisfactionScore: number
  pendingIssues: number
  campaignReach: number
}

interface CarePlan {
  id: string
  name: string
  price: number
  features: string[]
  enrollments: number
  satisfaction: number
  customizable: boolean
  educationalAccess: 'free' | 'subsidized' | 'premium'
}

interface Campaign {
  id: string
  title: string
  type: 'newsletter' | 'promotion' | 'education' | 'health-alert'
  status: 'draft' | 'scheduled' | 'sent'
  reach: number
  openRate: number
  clickRate: number
  scheduledDate?: string
}

interface ParentIssue {
  id: string
  parentName: string
  childName: string
  issue: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  plan: string
}

export default function ProviderDashboard() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'campaigns' | 'issues' | 'analytics'>('overview')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPlanCustomizer, setShowPlanCustomizer] = useState(false)
  const [showCampaignCreator, setShowCampaignCreator] = useState(false)

  // Mock stats data
  const stats: ProviderStats = {
    totalFamilies: 892,
    activeSubscriptions: 892,
    monthlyRevenue: 445000,
    satisfactionScore: 4.7,
    pendingIssues: 3,
    campaignReach: 1200
  }

  // Check if user has provider role
  const isProvider = user?.publicMetadata?.role === 'provider'

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need provider access to view this page.</p>
        </div>
      </div>
    )
  }

  const [carePlans, setCarePlans] = useState<CarePlan[]>([
    {
      id: 'essential',
      name: 'Essential Care',
      price: 299,
      features: [
        'Quarterly comprehensive screening',
        'SKIDS Clinic Chatter assessment',
        'Digital wellness screening',
        'Free access to Kurzgesagt & TED-Ed content',
        'Basic educational newsletter'
      ],
      enrollments: 324,
      satisfaction: 4.5,
      customizable: true,
      educationalAccess: 'free'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Care',
      price: 499,
      features: [
        'Everything in Essential Care',
        'Specialized behavioral assessments',
        'Vision & hearing screening',
        'Subsidized premium educational content',
        'Weekly health insights newsletter',
        'Priority consultation booking'
      ],
      enrollments: 412,
      satisfaction: 4.6,
      customizable: true,
      educationalAccess: 'subsidized'
    },
    {
      id: 'premium',
      name: 'Premium Care',
      price: 799,
      features: [
        'Everything in Comprehensive Care',
        'Unlimited behavioral assessments',
        'Full premium educational platform access',
        'Personalized learning recommendations',
        'Daily health & development insights',
        '24/7 pediatric helpline',
        'Exclusive educational workshops'
      ],
      enrollments: 156,
      satisfaction: 4.8,
      customizable: true,
      educationalAccess: 'premium'
    }
  ])

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Digital Wellness Awareness Week',
      type: 'education',
      status: 'sent',
      reach: 892,
      openRate: 78,
      clickRate: 34,
      scheduledDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Winter Health Screening Reminder',
      type: 'health-alert',
      status: 'scheduled',
      reach: 650,
      openRate: 0,
      clickRate: 0,
      scheduledDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'New Year Health Goals for Kids',
      type: 'newsletter',
      status: 'draft',
      reach: 0,
      openRate: 0,
      clickRate: 0
    }
  ])

  const [parentIssues, setParentIssues] = useState<ParentIssue[]>([
    {
      id: '1',
      parentName: 'Priya Sharma',
      childName: 'Arjun (6 years)',
      issue: 'Difficulty accessing behavioral assessment results',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2024-01-18',
      plan: 'Comprehensive Care'
    },
    {
      id: '2',
      parentName: 'Rajesh Kumar',
      childName: 'Ananya (4 years)',
      issue: 'Request for additional educational content recommendations',
      priority: 'low',
      status: 'open',
      createdAt: '2024-01-17',
      plan: 'Essential Care'
    },
    {
      id: '3',
      parentName: 'Meera Patel',
      childName: 'Dev (8 years)',
      issue: 'Concerns about screen time assessment accuracy',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-16',
      plan: 'Premium Care'
    }
  ])

  const getEducationalAccessBadge = (access: string) => {
    switch (access) {
      case 'free':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Free Educational Access</span>
      case 'subsidized':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Subsidized Premium Content</span>
      case 'premium':
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">Full Premium Access</span>
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'open': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-gray-900 mb-2"
            >
              Provider Command Center
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Manage care plans, create campaigns, and drive family engagement
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalFamilies.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Families</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</div>
                  <div className="text-sm text-gray-600">Active Plans</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹{(stats.monthlyRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.satisfactionScore}</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.pendingIssues}</div>
                  <div className="text-sm text-gray-600">Pending Issues</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{(stats.campaignReach / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-gray-600">Campaign Reach</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8"
          >
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'plans', label: 'Care Plans', icon: Shield },
                { id: 'campaigns', label: 'Campaigns', icon: Send },
                { id: 'issues', label: 'Parent Issues', icon: MessageSquare },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
          </motion.div>

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
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">New family enrolled in Premium Care</div>
                        <div className="text-sm text-gray-600">The Gupta family just upgraded to Premium Care plan</div>
                      </div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Send className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Campaign sent successfully</div>
                        <div className="text-sm text-gray-600">Digital Wellness newsletter reached 892 families</div>
                      </div>
                      <div className="text-sm text-gray-500">1 day ago</div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Parent issue requires attention</div>
                        <div className="text-sm text-gray-600">Screen time assessment concern from Premium Care family</div>
                      </div>
                      <div className="text-sm text-gray-500">2 days ago</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setShowCampaignCreator(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Send className="w-8 h-8 mb-4" />
                    <div className="font-bold text-lg mb-2">Create Campaign</div>
                    <div className="text-sm opacity-90">Send newsletters & health alerts</div>
                  </button>

                  <button
                    onClick={() => setShowPlanCustomizer(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Settings className="w-8 h-8 mb-4" />
                    <div className="font-bold text-lg mb-2">Customize Plans</div>
                    <div className="text-sm opacity-90">Modify care plan features</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('issues')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <MessageSquare className="w-8 h-8 mb-4" />
                    <div className="font-bold text-lg mb-2">Address Issues</div>
                    <div className="text-sm opacity-90">{stats.pendingIssues} pending issues</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <BarChart3 className="w-8 h-8 mb-4" />
                    <div className="font-bold text-lg mb-2">View Analytics</div>
                    <div className="text-sm opacity-90">Performance insights</div>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Plans Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Care Plans Management</h3>
                  <button
                    onClick={() => setShowPlanCustomizer(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create New Plan</span>
                  </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {carePlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                        <button
                          onClick={() => {
                            setSelectedPlan(plan.id)
                            setShowPlanCustomizer(true)
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="text-3xl font-bold text-gray-900 mb-2">₹{plan.price}/month</div>

                      <div className="mb-4">
                        {getEducationalAccessBadge(plan.educationalAccess)}
                      </div>

                      <div className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <div className="text-sm text-gray-500">+{plan.features.length - 3} more features</div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{plan.enrollments}</div>
                          <div className="text-sm text-gray-600">Enrollments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{plan.satisfaction}</div>
                          <div className="text-sm text-gray-600">Satisfaction</div>
                        </div>
                      </div>

                      <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'campaigns' && (
              <motion.div
                key="campaigns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Campaigns Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Campaign Management</h3>
                  <button
                    onClick={() => setShowCampaignCreator(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Campaign</span>
                  </button>
                </div>

                {/* Campaign Templates */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Campaign Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                      <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">Educational Newsletter</div>
                      <div className="text-sm text-gray-600">Weekly learning content</div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
                      <Heart className="w-8 h-8 text-green-600 mb-2" />
                      <div className="font-medium text-gray-900">Health Reminder</div>
                      <div className="text-sm text-gray-600">Screening & vaccination alerts</div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left">
                      <Gift className="w-8 h-8 text-purple-600 mb-2" />
                      <div className="font-medium text-gray-900">Promotional Campaign</div>
                      <div className="text-sm text-gray-600">Plan upgrades & offers</div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-left">
                      <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
                      <div className="font-medium text-gray-900">Health Alert</div>
                      <div className="text-sm text-gray-600">Urgent health notifications</div>
                    </button>
                  </div>
                </div>

                {/* Active Campaigns */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Campaigns</h4>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            campaign.type === 'newsletter' ? 'bg-blue-100' :
                            campaign.type === 'education' ? 'bg-green-100' :
                            campaign.type === 'promotion' ? 'bg-purple-100' : 'bg-orange-100'
                          }`}>
                            {campaign.type === 'newsletter' && <Mail className="w-5 h-5 text-blue-600" />}
                            {campaign.type === 'education' && <BookOpen className="w-5 h-5 text-green-600" />}
                            {campaign.type === 'promotion' && <Gift className="w-5 h-5 text-purple-600" />}
                            {campaign.type === 'health-alert' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{campaign.title}</div>
                            <div className="text-sm text-gray-600">
                              {campaign.status === 'sent' && `Sent to ${campaign.reach} families`}
                              {campaign.status === 'scheduled' && `Scheduled for ${campaign.scheduledDate}`}
                              {campaign.status === 'draft' && 'Draft - Ready to schedule'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {campaign.status === 'sent' && (
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{campaign.openRate}% opened</div>
                              <div className="text-sm text-gray-600">{campaign.clickRate}% clicked</div>
                            </div>
                          )}

                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'sent' ? 'bg-green-100 text-green-700' :
                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {campaign.status}
                          </span>

                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'issues' && (
              <motion.div
                key="issues"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Issues Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Parent Issues & Support</h3>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                      <option>All Priorities</option>
                      <option>High Priority</option>
                      <option>Medium Priority</option>
                      <option>Low Priority</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                      <option>All Status</option>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Issues List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900">Active Issues</h4>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {parentIssues.map((issue) => (
                      <div key={issue.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium text-gray-900">{issue.parentName}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{issue.childName}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-blue-600 font-medium">{issue.plan}</span>
                            </div>

                            <p className="text-gray-700 mb-3">{issue.issue}</p>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Created: {issue.createdAt}</span>
                              <span>•</span>
                              <span>ID: #{issue.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                              {issue.priority} priority
                            </span>

                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>

                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                              Respond
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Analytics Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Performance Analytics</h3>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Plan Performance */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Plan Performance</h4>
                    <div className="space-y-4">
                      {carePlans.map((plan) => (
                        <div key={plan.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-600">{plan.enrollments} enrollments</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{(plan.price * plan.enrollments / 1000).toFixed(0)}K</div>
                            <div className="text-sm text-green-600">+12% this month</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Performance */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Campaign Performance</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Average Open Rate</span>
                        <span className="font-bold text-gray-900">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Average Click Rate</span>
                        <span className="font-bold text-gray-900">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Reach</span>
                        <span className="font-bold text-gray-900">15.6K families</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-bold text-green-600">8.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Educational Content Usage */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Educational Content Usage</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Kurzgesagt Views</span>
                        <span className="font-bold text-gray-900">2,340</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">TED-Ed Engagement</span>
                        <span className="font-bold text-gray-900">1,890</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">BrainPOP Usage</span>
                        <span className="font-bold text-gray-900">1,560</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Premium Content Access</span>
                        <span className="font-bold text-purple-600">156 families</span>
                      </div>
                    </div>
                  </div>

                  {/* Issue Resolution */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Issue Resolution</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Average Response Time</span>
                        <span className="font-bold text-gray-900">2.4 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Resolution Rate</span>
                        <span className="font-bold text-green-600">94%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Parent Satisfaction</span>
                        <span className="font-bold text-gray-900">4.7/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending Issues</span>
                        <span className="font-bold text-orange-600">{stats.pendingIssues}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan Customizer Modal */}
          <AnimatePresence>
            {showPlanCustomizer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowPlanCustomizer(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Customize Care Plan</h3>
                    <button
                      onClick={() => setShowPlanCustomizer(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Enter plan name"
                        defaultValue="Essential Care"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price (₹)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="299"
                        defaultValue="299"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Educational Content Access</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                        <option value="free">Free Educational Access</option>
                        <option value="subsidized">Subsidized Premium Content</option>
                        <option value="premium">Full Premium Access</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan Features</label>
                      <div className="space-y-3">
                        {[
                          'Quarterly comprehensive screening',
                          'SKIDS Clinic Chatter assessment',
                          'Digital wellness screening',
                          'Specialized behavioral assessments',
                          'Vision & hearing screening',
                          'Premium educational content access',
                          '24/7 pediatric helpline'
                        ].map((feature, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" defaultChecked={index < 3} />
                            <span className="text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowPlanCustomizer(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowPlanCustomizer(false)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        Save Plan
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Campaign Creator Modal */}
          <AnimatePresence>
            {showCampaignCreator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCampaignCreator(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Create Campaign</h3>
                    <button
                      onClick={() => setShowCampaignCreator(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                          placeholder="Enter campaign title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                          <option value="newsletter">Educational Newsletter</option>
                          <option value="health-alert">Health Alert</option>
                          <option value="promotion">Promotional Campaign</option>
                          <option value="education">Educational Content</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Essential Care families</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Comprehensive Care families</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Premium Care families</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Content</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32"
                        placeholder="Enter your campaign message..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                        <input
                          type="datetime-local"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Educational Content Links</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" />
                            <span className="text-gray-700">Include Kurzgesagt links</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" />
                            <span className="text-gray-700">Include TED-Ed recommendations</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" />
                            <span className="text-gray-700">Include BrainPOP activities</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowCampaignCreator(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Save as Draft
                      </button>
                      <button
                        onClick={() => setShowCampaignCreator(false)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        Schedule Campaign
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
