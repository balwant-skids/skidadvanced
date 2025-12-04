'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    // Check if user is a super admin by email
    const superAdminEmails = [
      'satish@skids.health',
      'drpratichi@skids.health',
      'satissh@skids.health'
    ]
    
    const userEmail = user.primaryEmailAddress?.emailAddress || ''
    
    // If super admin email, redirect immediately
    if (superAdminEmails.includes(userEmail.toLowerCase())) {
      router.push('/admin/dashboard')
      return
    }

    // Otherwise, fetch user role from our database
    fetch('/api/users/status', {
      headers: {
        'x-clerk-user-id': user.id,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user status')
        }
        return res.json()
      })
      .then((data) => {
        const { role } = data

        // Redirect based on role
        if (role === 'super_admin' || role === 'clinic_manager' || role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      })
      .catch((error) => {
        console.error('Error fetching user role:', error)
        // Default to dashboard on error
        router.push('/dashboard')
      })
  }, [user, isLoaded, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
