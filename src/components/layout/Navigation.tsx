'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useUser } from '@/hooks/useUser'

// Mock components for development
function MockUserButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { logoutUser } = useUser();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-gradient-to-r from-brain-500 to-cardiovascular-500 rounded-full flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-all"
      >
        DU
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Dashboard
          </Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Profile
          </Link>
          <hr className="my-1" />
          <button onClick={logoutUser} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

function MockSignInButton({ children }: { children: React.ReactNode }) {
  return (
    <button onClick={() => alert('Mock Sign In - Clerk not configured')}>
      {children}
    </button>
  )
}

export function Navigation() {
  const { data: session } = useSession()
  const isSignedIn = !!session;
  const [isOpen, setIsOpen] = useState(false);


  // Check if Clerk is configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey && !publishableKey.includes('your_') && !publishableKey.includes('_here')

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/discovery', label: 'Discovery' },
    { href: '/interventions', label: 'Interventions' },
    { href: '/specialists', label: 'Our Specialists' },
    { href: '/care-plans', label: 'Care Plans' },
    { href: '/behavioral', label: 'Behavioral Assessment' },
    { href: '/provider', label: 'Provider Center' },
    { href: '/campaigns', label: 'Campaigns' },
    { href: '/admin/analytics', label: 'Analytics' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="w-8 h-8 text-cardiovascular-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-cardiovascular-300" />
              </motion.div>
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-brain-600 to-cardiovascular-600 bg-clip-text text-transparent">
              SKIDS Advanced
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-brain-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            {isSignedIn && <Link href="/dashboard" className="hidden sm:block font-medium text-gray-700 hover:text-brain-600 transition-colors">Dashboard</Link>}
            {isSignedIn && <MockUserButton />}
            {!isSignedIn && <Link href="/sign-up" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-brain-600 transition-colors">Get Started</Link>}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-9 border ml-4">            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block py-2 text-gray-700 hover:text-brain-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
