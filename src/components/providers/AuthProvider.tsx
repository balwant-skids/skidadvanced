'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { UserProvider } from '@/contexts/UserContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // During build time, Clerk keys might not be available
  // This is okay because pages will be dynamically rendered at runtime
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
  
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          card: 'shadow-lg',
        },
      }}
    >
      <UserProvider>
        {children}
      </UserProvider>
    </ClerkProvider>
  )
}
