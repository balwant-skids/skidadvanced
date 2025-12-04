'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Brain,
  Calendar,
  BookOpen,
  Shield,
  Users,
  TrendingUp,
  Bell,
  Settings,
  User,
  Baby,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Wifi,
  WifiOff,
  Smartphone,
  Plus,
  Edit,
  Eye,
  PlayCircle
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { useUser } from '@/hooks/useUser'
import { useUserContext } from '@/contexts/UserContext'

// Enhanced child data structure for PWA
interface ChildData {
  id: string
  name: string
  age: number
  dateOfBirth: string
  plan: 'Essential Care' | 'Comprehensive Care' | 'Premium Care'
  planPrice: number
  nextScreening: string
  lastAssessment: string
  educationalAccess: 'free' | 'subsidized' | 'premium'
  healthMetrics: {
    height: number
    weight: number
    bmi: number
    lastUpdated: string
  }
  assessmentProgress: {
    completed: number
    total: number
    lastCompleted: string
  }
  educationalProgress: {
    totalTimeSpent: number
    contentCompleted: number
    currentStreak: number
    favoriteTopics: string[]
  }
  upcomingAppointments: Array<{
    id: string
    type: string
    date: string
    time: string
    provider: string
    status: 'scheduled' | 'confirmed' | 'completed'
  }>
  recentActivities: Array<{
    id: string
    type: 'screening' | 'behavioral' | 'educational' | 'appointment'
    date: string
    title: string
    result?: string
    content?: string
    status: 'completed' | 'in-progress' | 'scheduled'
  }>
}

// Mock enhanced data - in production, this would come from your database
const mockChildData: ChildData = {
  id: 'child_123',
  name: 'Arjun Sharma',
  age: 6,
  dateOfBirth: '2018-03-15',
  plan: 'Comprehensive Care',
  planPrice: 499,
  nextScreening: '2024-02-15',
  lastAssessment: '2024-01-10',
  educationalAccess: 'subsidized',
  healthMetrics: {
    height: 115,
    weight: 22,
    bmi: 16.6,
    lastUpdated: '2024-01-10'
  },
  assessmentProgress: {
    completed: 8,
    total: 12,
    lastCompleted: '2024-01-08'
  },
  educationalProgress: {
    totalTimeSpent: 1250, // minutes
    contentCompleted: 24,
    currentStreak: 5,
    favoriteTopics: ['Heart & Circulation', 'Brain & Nervous System', 'Digestive System']
  },
  upcomingAppointments: [
    {
      id: 'apt_1',
      type: 'Quarterly Screening',
      date: '2024-02-15',
      time: '10:00 AM',
      provider: 'Dr. Sarah Patel',
      status: 'scheduled'
    },
    {
      id: 'apt_2',
      type: 'Behavioral Assessment',
      date: '2024-02-20',
      time: '2:30 PM',
      provider: 'Dr. Rajesh Kumar',
      status: 'confirmed'
    }
  ],
  recentActivities: [
    {
      id: 'act_1',
      type: 'screening',
      date: '2024-01-10',
      title: 'Quarterly Health Screening',
      result: 'All Normal',
      status: 'completed'
    },
    {
      id: 'act_2',
      type: 'behavioral',
      date: '2024-01-08',
      title: 'SKIDS Clinic Chatter Assessment',
      result: 'Healthy Development',
      status: 'completed'
    },
    {
      id: 'act_3',
      type: 'educational',
      date: '2024-01-05',
      title: 'Kurzgesagt: Immune System',
      content: 'Completed interactive lesson',
      status: 'completed'
    },
    {
      id: 'act_4',
      type: 'educational',
      date: '2024-01-03',
      title: 'TED-Ed: How Your Heart Works',
      content: 'Watched and completed quiz',
      status: 'completed'
    }
  ]
}

const mockProviderStats = {
  totalFamilies: 1247,
  activeSubscriptions: 892,
  monthlyRevenue: 445600,
  pendingAppointments: 23
}

export default function Dashboard() {
  const { userDetails, isAuthenticated, isLoading } = useUserContext();
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'education' | 'appointments'>('overview')

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAuthenticated && userDetails) {
      const adminRoles = ['super_admin', 'clinic_manager', 'admin']
      if (adminRoles.includes(userDetails.role)) {
        window.location.href = '/admin/dashboard'
      }
    }
  }, [isAuthenticated, userDetails])

  // PWA Installation and Offline Detection
  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    // PWA Install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstallBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallBanner(false)
      }
      setInstallPrompt(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">Access your child's health dashboard</p>
          <Link
            href="/sign-in"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  const isProvider = userDetails?.role === 'provider' || userDetails?.role === 'admin';
  const isParent = userDetails?.role === 'parent';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 mt-8">
              Welcome, {userDetails?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600">
              {isProvider ? 'Manage your practice and support families' : 'Track your child\'s health and development journey'}
            </p>
          </motion.div>

          {/* PWA Install Banner */}
          <AnimatePresence>
            {showInstallBanner && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl mb-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Install SKIDS Advanced</h3>
                      <p className="text-sm opacity-90">Get the full app experience on your device</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleInstallPWA}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Install
                    </button>
                    <button
                      onClick={() => setShowInstallBanner(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Offline Indicator */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-100 border border-orange-400 text-orange-800 p-4 rounded-xl mb-6"
            >
              <div className="flex items-center space-x-3">
                <WifiOff className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">You're offline</h3>
                  <p className="text-sm">Some features may be limited. Data will sync when you're back online.</p>
                </div>
              </div>
            </motion.div>
          )}

          {isParent && (
            <EnhancedParentDashboard
              childData={mockChildData}
              isOnline={isOnline}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {isProvider && (
            <ProviderDashboard stats={mockProviderStats} />
          )}
        </div>
      </main>
    </div>
  )
}

function EnhancedParentDashboard({
  childData,
  isOnline,
  activeTab,
  setActiveTab
}: {
  childData: ChildData
  isOnline: boolean
  activeTab: string
  setActiveTab: (tab: 'overview' | 'health' | 'education' | 'appointments') => void
}) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const getEducationalAccessBadge = (access: string) => {
    switch (access) {
      case 'free':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Free Access</span>
      case 'subsidized':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Subsidized Premium</span>
      case 'premium':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Full Premium</span>
      default:
        return null
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }
  return (
    <div className="space-y-6">
      {/* Enhanced Child Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{childData.name}</h2>
              <p className="text-gray-600">{childData.age} years old • Born {new Date(childData.dateOfBirth).toLocaleDateString()}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium text-gray-700">{childData.plan}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-green-600 font-medium">₹{childData.planPrice}/month</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {getEducationalAccessBadge(childData.educationalAccess)}
            <div className="mt-2">
              {isOnline ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Wifi className="w-4 h-4 mr-1" />
                  <span>Online</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600 text-sm">
                  <WifiOff className="w-4 h-4 mr-1" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{childData.assessmentProgress.completed}</div>
            <div className="text-sm text-gray-600">Assessments</div>
            <div className="text-xs text-gray-500">of {childData.assessmentProgress.total}</div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatTime(childData.educationalProgress.totalTimeSpent)}</div>
            <div className="text-sm text-gray-600">Learning Time</div>
            <div className="text-xs text-gray-500">{childData.educationalProgress.currentStreak} day streak</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{childData.healthMetrics.bmi}</div>
            <div className="text-sm text-gray-600">BMI</div>
            <div className="text-xs text-gray-500">Normal range</div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{childData.upcomingAppointments.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
            <div className="text-xs text-gray-500">Appointments</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'health', label: 'Health', icon: Heart },
            { id: 'education', label: 'Education', icon: BookOpen },
            { id: 'appointments', label: 'Appointments', icon: Calendar }
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Link href="/discovery" className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Health Discovery</h3>
          <p className="text-gray-600 text-sm">Explore body systems and learn</p>
        </Link>

        <Link href="/behavioral" className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <Brain className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Behavioral Assessment</h3>
          <p className="text-gray-600 text-sm">Check emotional wellness</p>
        </Link>

        <button className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group text-left">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Book Screening</h3>
          <p className="text-gray-600 text-sm">Schedule next appointment</p>
        </button>

        <button className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group text-left">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Educational Content</h3>
          <p className="text-gray-600 text-sm">Access learning resources</p>
        </button>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {childData.recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'screening' ? 'bg-blue-100' :
                activity.type === 'behavioral' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {activity.type === 'screening' && <Activity className="w-5 h-5 text-blue-600" />}
                {activity.type === 'behavioral' && <Brain className="w-5 h-5 text-green-600" />}
                {activity.type === 'educational' && <BookOpen className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 capitalize">{activity.type}</div>
                <div className="text-sm text-gray-600">
                  {activity.result || activity.content} • {activity.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ProviderDashboard({ stats }: { stats: typeof mockProviderStats }) {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</div>
              <div className="text-sm text-gray-600">Pending Appointments</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Link href="/provider" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <Settings className="w-8 h-8 mb-4" />
          <div className="font-bold text-lg mb-2">Manage Care Plans</div>
          <div className="text-sm opacity-90">Create and customize care plans</div>
        </Link>

        <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left">
          <Bell className="w-8 h-8 mb-4" />
          <div className="font-bold text-lg mb-2">Send Campaigns</div>
          <div className="text-sm opacity-90">Create newsletters and alerts</div>
        </button>

        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left">
          <Users className="w-8 h-8 mb-4" />
          <div className="font-bold text-lg mb-2">View Families</div>
          <div className="text-sm opacity-90">Manage family accounts</div>
        </button>
      </motion.div>
    </div>
  )
}
