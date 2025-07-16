'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Settings,
  Bell,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  BarChart3,
  FileText,
  MessageSquare,
  Zap,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Plus,
  Minus
} from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { usePermissions, useRole } from '@/hooks/useAuth'

interface StaffMember {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  position: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  permissions: string[]
  joinDate: Date
  lastLogin: Date
  avatar?: string
  performance: {
    rating: number
    tasksCompleted: number
    vendorsManaged: number
    responseTime: number
  }
  responsibilities: string[]
  certifications: string[]
}

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'roles' | 'permissions' | 'analytics'>('overview')
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const { hasPermission } = usePermissions()
  const { isAdmin, isStaff } = useRole()

  useEffect(() => {
    loadStaffData()
  }, [])

  const loadStaffData = async () => {
    setLoading(true)
    try {
      // Mock staff data - in production, this would come from an API
      const mockStaff: StaffMember[] = [
        {
          id: 'staff-001',
          firstName: 'Emma',
          lastName: 'Wilson',
          email: 'emma.wilson@skids.clinic',
          phone: '+1-555-0101',
          role: 'staff',
          department: 'Vendor Management',
          position: 'Senior Vendor Relations Manager',
          status: 'active',
          permissions: ['manage_vendors', 'approve_contracts', 'view_analytics'],
          joinDate: new Date('2023-01-15'),
          lastLogin: new Date(),
          avatar: '/avatars/emma-wilson.jpg',
          performance: {
            rating: 4.8,
            tasksCompleted: 127,
            vendorsManaged: 15,
            responseTime: 2.3
          },
          responsibilities: [
            'Vendor onboarding and relationship management',
            'Contract negotiation and approval',
            'Performance monitoring and reporting',
            'Compliance verification'
          ],
          certifications: ['Vendor Management Professional', 'HIPAA Compliance']
        },
        {
          id: 'staff-002',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@skids.clinic',
          phone: '+1-555-0102',
          role: 'staff',
          department: 'Technical Integration',
          position: 'Integration Specialist',
          status: 'active',
          permissions: ['manage_integrations', 'technical_review', 'system_monitoring'],
          joinDate: new Date('2023-03-20'),
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          avatar: '/avatars/michael-chen.jpg',
          performance: {
            rating: 4.6,
            tasksCompleted: 89,
            vendorsManaged: 8,
            responseTime: 1.8
          },
          responsibilities: [
            'Technical integration setup and testing',
            'API documentation and support',
            'System monitoring and troubleshooting',
            'Security compliance verification'
          ],
          certifications: ['AWS Certified', 'Security+ Certified']
        },
        {
          id: 'staff-003',
          firstName: 'Sarah',
          lastName: 'Rodriguez',
          email: 'sarah.rodriguez@skids.clinic',
          phone: '+1-555-0103',
          role: 'staff',
          department: 'Quality Assurance',
          position: 'QA Manager',
          status: 'active',
          permissions: ['quality_review', 'vendor_assessment', 'compliance_audit'],
          joinDate: new Date('2022-11-10'),
          lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          avatar: '/avatars/sarah-rodriguez.jpg',
          performance: {
            rating: 4.9,
            tasksCompleted: 156,
            vendorsManaged: 12,
            responseTime: 1.5
          },
          responsibilities: [
            'Quality assurance and testing protocols',
            'Vendor performance evaluation',
            'Compliance auditing and reporting',
            'Process improvement initiatives'
          ],
          certifications: ['Six Sigma Black Belt', 'ISO 27001 Lead Auditor']
        },
        {
          id: 'staff-004',
          firstName: 'David',
          lastName: 'Kim',
          email: 'david.kim@skids.clinic',
          phone: '+1-555-0104',
          role: 'staff',
          department: 'Analytics',
          position: 'Data Analyst',
          status: 'pending',
          permissions: ['view_analytics', 'generate_reports'],
          joinDate: new Date('2024-01-08'),
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          avatar: '/avatars/david-kim.jpg',
          performance: {
            rating: 4.2,
            tasksCompleted: 23,
            vendorsManaged: 3,
            responseTime: 3.1
          },
          responsibilities: [
            'Data analysis and reporting',
            'ROI analysis and forecasting',
            'Performance metrics tracking',
            'Dashboard development'
          ],
          certifications: ['Google Analytics Certified']
        }
      ]
      
      setStaffMembers(mockStaff)
    } catch (error) {
      console.error('Error loading staff data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'suspended': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDepartmentIcon = (department: string) => {
    const icons = {
      'Vendor Management': Users,
      'Technical Integration': Settings,
      'Quality Assurance': Shield,
      'Analytics': BarChart3
    }
    return icons[department as keyof typeof icons] || Briefcase
  }

  const filteredStaff = staffMembers.filter(staff =>
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const staffStats = {
    total: staffMembers.length,
    active: staffMembers.filter(s => s.status === 'active').length,
    pending: staffMembers.filter(s => s.status === 'pending').length,
    avgRating: staffMembers.reduce((sum, s) => sum + s.performance.rating, 0) / staffMembers.length,
    totalVendorsManaged: staffMembers.reduce((sum, s) => sum + s.performance.vendorsManaged, 0),
    avgResponseTime: staffMembers.reduce((sum, s) => sum + s.performance.responseTime, 0) / staffMembers.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading staff management...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin && !isStaff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600">You don't have permission to access staff management.</p>
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
              Staff Management System
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive staff administration, role management, and performance tracking
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'staff', label: 'Staff Members', icon: Users },
                { id: 'roles', label: 'Roles & Departments', icon: Briefcase },
                { id: 'permissions', label: 'Permissions', icon: Shield },
                { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp }
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Staff</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.total}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">{staffStats.active} active members</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.avgRating.toFixed(1)}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Star className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">Out of 5.0</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vendors Managed</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.totalVendorsManaged}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-purple-600">Across all staff</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.avgResponseTime.toFixed(1)}h</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600">Average across team</span>
                    </div>
                  </div>
                </div>

                {/* Department Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Department Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Vendor Management', 'Technical Integration', 'Quality Assurance', 'Analytics'].map((dept) => {
                      const deptStaff = staffMembers.filter(s => s.department === dept)
                      const Icon = getDepartmentIcon(dept)
                      
                      return (
                        <div key={dept} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{dept}</h4>
                          <p className="text-2xl font-bold text-gray-900">{deptStaff.length}</p>
                          <p className="text-sm text-gray-600">staff members</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Staff Activity</h3>
                  <div className="space-y-4">
                    {[
                      {
                        user: 'Emma Wilson',
                        action: 'Approved vendor contract for NutreeAI',
                        time: '2 hours ago',
                        type: 'approval'
                      },
                      {
                        user: 'Michael Chen',
                        action: 'Completed integration testing for Shanti platform',
                        time: '4 hours ago',
                        type: 'completion'
                      },
                      {
                        user: 'Sarah Rodriguez',
                        action: 'Conducted quality review for 3 vendors',
                        time: '6 hours ago',
                        type: 'review'
                      },
                      {
                        user: 'David Kim',
                        action: 'Generated monthly ROI analysis report',
                        time: '1 day ago',
                        type: 'report'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {activity.type === 'approval' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {activity.type === 'completion' && <Settings className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'review' && <Shield className="w-5 h-5 text-purple-600" />}
                          {activity.type === 'report' && <FileText className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Staff Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search staff members..."
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
                    {hasPermission('user', 'create') && (
                      <button
                        onClick={() => setShowStaffModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Staff</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Staff Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStaff.map((staff) => {
                    const DeptIcon = getDepartmentIcon(staff.department)
                    
                    return (
                      <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-600">
                                  {staff.firstName[0]}{staff.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {staff.firstName} {staff.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">{staff.position}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                                  {staff.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedStaff(staff)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {hasPermission('user', 'update') && (
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <DeptIcon className="w-4 h-4" />
                              <span>{staff.department}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{staff.email}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{staff.phone}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Performance</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-900">{staff.performance.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Vendors Managed</span>
                              <span className="text-sm font-medium text-gray-900">{staff.performance.vendorsManaged}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Response Time</span>
                              <span className="text-sm font-medium text-gray-900">{staff.performance.responseTime}h</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                              {staff.status === 'pending' && hasPermission('user', 'update') && (
                                <>
                                  <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700">
                                    <UserCheck className="w-4 h-4 inline mr-1" />
                                    Approve
                                  </button>
                                  <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700">
                                    <UserX className="w-4 h-4 inline mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {staff.status === 'active' && hasPermission('user', 'update') && (
                                <button className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-yellow-700">
                                  <Lock className="w-4 h-4 inline mr-1" />
                                  Suspend
                                </button>
                              )}
                              {staff.status === 'suspended' && hasPermission('user', 'update') && (
                                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700">
                                  <Unlock className="w-4 h-4 inline mr-1" />
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
