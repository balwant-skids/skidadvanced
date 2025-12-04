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

interface AdminUser {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  isActive: boolean
  clinicId: string | null
  createdAt: string
  updatedAt: string
  clinic?: {
    id: string
    name: string
  } | null
  managedClinic?: {
    id: string
    name: string
  } | null
  lastLogin?: string | null
  activityCount?: number
}

interface Clinic {
  id: string
  name: string
  code: string
}

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'roles' | 'permissions' | 'analytics'>('overview')
  const [staffMembers, setStaffMembers] = useState<AdminUser[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<AdminUser | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const { hasPermission } = usePermissions()
  const { isAdmin, isStaff } = useRole()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin' as 'super_admin' | 'clinic_manager' | 'admin',
    clinicId: '',
    phone: '',
  })

  useEffect(() => {
    loadStaffData()
    loadClinics()
  }, [roleFilter, statusFilter])

  const loadClinics = async () => {
    try {
      const response = await fetch('/api/clinics?limit=100')
      if (response.ok) {
        const data = await response.json()
        setClinics(data.clinics || [])
      }
    } catch (error) {
      console.error('Error loading clinics:', error)
    }
  }

  const loadStaffData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)
      params.append('limit', '100')
      params.append('sortBy', 'createdAt')
      params.append('sortOrder', 'desc')

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin users')
      }

      const data = await response.json()
      setStaffMembers(data.users || [])
    } catch (error) {
      console.error('Error loading staff data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load staff data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      'super_admin': Shield,
      'clinic_manager': Users,
      'admin': Settings,
    }
    return icons[role as keyof typeof icons] || Briefcase
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      'super_admin': 'Super Admin',
      'clinic_manager': 'Clinic Manager',
      'admin': 'Admin',
    }
    return labels[role as keyof typeof labels] || role
  }

  const openAddModal = () => {
    setEditingStaff(null)
    setFormData({
      email: '',
      name: '',
      role: 'admin',
      clinicId: '',
      phone: '',
    })
    setModalError(null)
    setShowStaffModal(true)
  }

  const openEditModal = (staff: AdminUser) => {
    setEditingStaff(staff)
    setFormData({
      email: staff.email,
      name: staff.name,
      role: staff.role as any,
      clinicId: staff.clinicId || '',
      phone: staff.phone || '',
    })
    setModalError(null)
    setShowStaffModal(true)
  }

  const closeModal = () => {
    setShowStaffModal(false)
    setEditingStaff(null)
    setModalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    setModalError(null)

    try {
      const url = editingStaff 
        ? `/api/admin/users/${editingStaff.id}`
        : '/api/admin/users'
      
      const method = editingStaff ? 'PATCH' : 'POST'
      
      const body: any = {
        name: formData.name,
        role: formData.role,
        phone: formData.phone || null,
      }

      if (!editingStaff) {
        body.email = formData.email
      }

      if (formData.role === 'clinic_manager') {
        if (!formData.clinicId) {
          setModalError('Clinic is required for clinic managers')
          setModalLoading(false)
          return
        }
        body.clinicId = formData.clinicId
      } else {
        body.clinicId = null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save user')
      }

      await loadStaffData()
      closeModal()
    } catch (error) {
      console.error('Error saving user:', error)
      setModalError(error instanceof Error ? error.message : 'Failed to save user')
    } finally {
      setModalLoading(false)
    }
  }

  const filteredStaff = staffMembers

  const staffStats = {
    total: staffMembers.length,
    active: staffMembers.filter(s => s.isActive).length,
    inactive: staffMembers.filter(s => !s.isActive).length,
    superAdmins: staffMembers.filter(s => s.role === 'super_admin').length,
    clinicManagers: staffMembers.filter(s => s.role === 'clinic_manager').length,
    admins: staffMembers.filter(s => s.role === 'admin').length,
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
                        <p className="text-sm font-medium text-gray-600">Total Admin Users</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.total}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">{staffStats.active} active</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Super Admins</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.superAdmins}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Shield className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-purple-600">Full access</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Clinic Managers</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.clinicManagers}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Briefcase className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">Clinic-specific</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                        <p className="text-3xl font-bold text-gray-900">{staffStats.inactive}</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserX className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <AlertTriangle className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">Deactivated</span>
                    </div>
                  </div>
                </div>

                {/* Role Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Role Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { role: 'super_admin', label: 'Super Admins', icon: Shield, color: 'purple' },
                      { role: 'clinic_manager', label: 'Clinic Managers', icon: Users, color: 'green' },
                      { role: 'admin', label: 'Admins', icon: Settings, color: 'blue' }
                    ].map(({ role, label, icon: Icon, color }) => {
                      const roleStaff = staffMembers.filter(s => s.role === role)
                      const activeCount = roleStaff.filter(s => s.isActive).length
                      
                      return (
                        <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <Icon className={`w-6 h-6 text-${color}-600`} />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{label}</h4>
                          <p className="text-2xl font-bold text-gray-900">{roleStaff.length}</p>
                          <p className="text-sm text-gray-600">{activeCount} active</p>
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
                        onClick={openAddModal}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Staff</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Staff Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStaff.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No admin users found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    filteredStaff.map((staff) => {
                      const RoleIcon = getRoleIcon(staff.role)
                      const initials = staff.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      
                      return (
                        <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-lg font-bold text-blue-600">
                                    {initials}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {staff.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">{getRoleLabel(staff.role)}</p>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.isActive)}`}>
                                    {staff.isActive ? 'Active' : 'Inactive'}
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
                                  <button 
                                    onClick={() => openEditModal(staff)}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <RoleIcon className="w-4 h-4" />
                                <span>{getRoleLabel(staff.role)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{staff.email}</span>
                              </div>
                              
                              {staff.phone && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{staff.phone}</span>
                                </div>
                              )}
                              
                              {(staff.clinic || staff.managedClinic) && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{staff.managedClinic?.name || staff.clinic?.name}</span>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Created</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {new Date(staff.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex space-x-2">
                                {!staff.isActive && hasPermission('user', 'update') && (
                                  <button 
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`/api/admin/users/${staff.id}/reactivate`, {
                                          method: 'POST',
                                        })
                                        if (response.ok) {
                                          await loadStaffData()
                                        }
                                      } catch (error) {
                                        console.error('Error reactivating user:', error)
                                      }
                                    }}
                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
                                  >
                                    <Unlock className="w-4 h-4 inline mr-1" />
                                    Reactivate
                                  </button>
                                )}
                                {staff.isActive && hasPermission('user', 'update') && (
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`Are you sure you want to deactivate ${staff.name}?`)) {
                                        try {
                                          const response = await fetch(`/api/admin/users/${staff.id}`, {
                                            method: 'DELETE',
                                          })
                                          if (response.ok) {
                                            await loadStaffData()
                                          }
                                        } catch (error) {
                                          console.error('Error deactivating user:', error)
                                        }
                                      }
                                    }}
                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700"
                                  >
                                    <Lock className="w-4 h-4 inline mr-1" />
                                    Deactivate
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add/Edit Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{modalError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingStaff}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="user@example.com"
                  />
                  {editingStaff && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="clinic_manager">Clinic Manager</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                {formData.role === 'clinic_manager' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic *
                    </label>
                    <select
                      required
                      value={formData.clinicId}
                      onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a clinic</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name} ({clinic.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={modalLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? 'Saving...' : editingStaff ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
