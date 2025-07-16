'use client'

import { useUser as useClerkUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { User, UserRole, Permission } from '@/types/auth'

// Enhanced mock users for different roles
const mockUsers: Record<string, any> = {
  parent: {
    id: 'parent_user_123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    emailAddresses: [{ emailAddress: 'parent@skids.clinic' }],
    publicMetadata: { role: 'parent' },
  },
  provider: {
    id: 'provider_user_123',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    emailAddresses: [{ emailAddress: 'provider@skids.clinic' }],
    publicMetadata: { role: 'provider' },
  },
  vendor: {
    id: 'vendor_user_123',
    firstName: 'Alex',
    lastName: 'Kumar',
    emailAddresses: [{ emailAddress: 'vendor@skids.clinic' }],
    publicMetadata: { role: 'vendor' },
  },
  admin: {
    id: 'admin_user_123',
    firstName: 'Admin',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'admin@skids.clinic' }],
    publicMetadata: { role: 'admin' },
  },
  staff: {
    id: 'staff_user_123',
    firstName: 'Emma',
    lastName: 'Wilson',
    emailAddresses: [{ emailAddress: 'staff@skids.clinic' }],
    publicMetadata: { role: 'staff' },
  }
}

// Current mock user (can be changed for testing different roles)
const currentMockRole = 'provider' // Change this to test different roles
const mockUser = mockUsers[currentMockRole]

const mockAuth = {
  userId: mockUser.id,
  isSignedIn: true,
  isLoaded: true,
}

// Role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  parent: [
    { id: 'view_child_data', name: 'View Child Data', description: 'View own children data', resource: 'child', actions: ['read'] },
    { id: 'manage_appointments', name: 'Manage Appointments', description: 'Book and manage appointments', resource: 'appointment', actions: ['create', 'read', 'update'] },
    { id: 'view_care_plans', name: 'View Care Plans', description: 'View assigned care plans', resource: 'care_plan', actions: ['read'] }
  ],
  provider: [
    { id: 'manage_patients', name: 'Manage Patients', description: 'Manage assigned patients', resource: 'patient', actions: ['create', 'read', 'update'] },
    { id: 'create_care_plans', name: 'Create Care Plans', description: 'Create and modify care plans', resource: 'care_plan', actions: ['create', 'read', 'update'] },
    { id: 'access_admin_dashboard', name: 'Access Admin Dashboard', description: 'Access provider dashboard', resource: 'dashboard', actions: ['read'] },
    { id: 'manage_services', name: 'Manage Services', description: 'Manage service catalog', resource: 'service', actions: ['create', 'read', 'update', 'delete'] }
  ],
  vendor: [
    { id: 'manage_vendor_profile', name: 'Manage Vendor Profile', description: 'Manage vendor profile and services', resource: 'vendor_profile', actions: ['read', 'update'] },
    { id: 'view_integration_status', name: 'View Integration Status', description: 'View integration and performance metrics', resource: 'integration', actions: ['read'] },
    { id: 'manage_vendor_services', name: 'Manage Vendor Services', description: 'Manage offered services', resource: 'vendor_service', actions: ['create', 'read', 'update'] }
  ],
  admin: [
    { id: 'full_system_access', name: 'Full System Access', description: 'Complete system administration', resource: '*', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'manage_users', name: 'Manage Users', description: 'Manage all user accounts', resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'manage_vendors', name: 'Manage Vendors', description: 'Manage vendor onboarding and relationships', resource: 'vendor', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'view_analytics', name: 'View Analytics', description: 'Access all system analytics', resource: 'analytics', actions: ['read'] }
  ],
  staff: [
    { id: 'manage_care_plans', name: 'Manage Care Plans', description: 'Create and manage care plans', resource: 'care_plan', actions: ['create', 'read', 'update'] },
    { id: 'manage_services', name: 'Manage Services', description: 'Manage service catalog', resource: 'service', actions: ['create', 'read', 'update'] },
    { id: 'view_user_data', name: 'View User Data', description: 'View user information for support', resource: 'user', actions: ['read'] }
  ],
  specialist: [
    { id: 'manage_specialty_services', name: 'Manage Specialty Services', description: 'Manage specialty-specific services', resource: 'specialty_service', actions: ['create', 'read', 'update'] },
    { id: 'view_patient_data', name: 'View Patient Data', description: 'View assigned patient data', resource: 'patient', actions: ['read'] },
    { id: 'create_assessments', name: 'Create Assessments', description: 'Create and manage assessments', resource: 'assessment', actions: ['create', 'read', 'update'] }
  ]
}

export function useAuth() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey && !publishableKey.includes('your_') && !publishableKey.includes('_here')

  if (isClerkConfigured) {
    return useClerkAuth()
  }

  // Return mock auth for development
  return mockAuth
}

export function useUser() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey && !publishableKey.includes('your_') && !publishableKey.includes('_here')

  if (isClerkConfigured) {
    return useClerkUser()
  }

  // Return mock user for development
  return {
    user: mockUser,
    isSignedIn: true,
    isLoaded: true,
  }
}

// Enhanced authentication utilities
export function usePermissions() {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as UserRole

  return {
    permissions: rolePermissions[userRole] || [],
    hasPermission: (resource: string, action: string) => {
      const permissions = rolePermissions[userRole] || []
      return permissions.some(p =>
        (p.resource === '*' || p.resource === resource) &&
        p.actions.includes(action)
      )
    },
    canAccess: (resource: string) => {
      const permissions = rolePermissions[userRole] || []
      return permissions.some(p => p.resource === '*' || p.resource === resource)
    }
  }
}

export function useRole() {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as UserRole

  return {
    role: userRole,
    isParent: userRole === 'parent',
    isProvider: userRole === 'provider',
    isVendor: userRole === 'vendor',
    isAdmin: userRole === 'admin',
    isStaff: userRole === 'staff',
    isSpecialist: userRole === 'specialist'
  }
}

// Mock user switching for development
export function switchMockUser(role: UserRole) {
  if (process.env.NODE_ENV === 'development') {
    // In a real implementation, this would update the mock user
    console.log(`Switching to ${role} user for testing`)
    // This is just for demonstration - in practice you'd update the mock state
  }
}
