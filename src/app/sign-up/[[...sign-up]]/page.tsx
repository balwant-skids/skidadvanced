'use client'

import { SignUp } from '@clerk/nextjs'
import { useState } from 'react'

export default function SignUpPage() {
  const [clinicCode, setClinicCode] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyClinicCode = async () => {
    if (!clinicCode.trim()) {
      setCodeError('Please enter a clinic code')
      return
    }

    setIsVerifying(true)
    setCodeError('')

    try {
      const res = await fetch(`/api/clinics/verify?code=${clinicCode}`)
      const data = await res.json()

      if (data.valid) {
        setCodeVerified(true)
        // Store clinic code in sessionStorage for use after sign-up
        sessionStorage.setItem('pendingClinicCode', clinicCode)
      } else {
        setCodeError(data.message || 'Invalid clinic code')
      }
    } catch {
      setCodeError('Failed to verify clinic code')
    } finally {
      setIsVerifying(false)
    }
  }

  // Show clinic code verification first
  if (!codeVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join SKIDS Advanced</h1>
            <p className="text-gray-600">Enter your clinic code to get started</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="clinicCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Code
                </label>
                <input
                  id="clinicCode"
                  type="text"
                  value={clinicCode}
                  onChange={(e) => setClinicCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                {codeError && (
                  <p className="mt-2 text-sm text-red-600">{codeError}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Your clinic should have provided you with a registration code
                </p>
              </div>

              <button
                onClick={verifyClinicCode}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show Clerk sign-up after code verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm mb-4">
            ✓ Clinic code verified
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Complete your registration to get started</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white rounded-2xl shadow-lg border border-gray-200 p-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
              formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/onboarding"
        />
      </div>
    </div>
  )
}
