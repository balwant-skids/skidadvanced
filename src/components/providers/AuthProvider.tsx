'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { UserProvider } from '@/contexts/UserContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
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
