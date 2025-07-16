'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Brain,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Microscope,
  Target,
  Zap,
  ArrowRight,
  Play,
  BookOpen,
  Award,
  Users,
  Calendar,
  Activity,
  Heart,
  Sun
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function DermatologyInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'intervention' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const skinConditions = [
    {
      name: 'Eczema & Atopic Dermatitis',
      prevalence: '20% of children worldwide have eczema',
      impact: 'Itching, sleep disruption, skin infections, reduced quality of life',
      criticalWindow: 'Birth to 5 years (skin barrier development)',
      treatmentSuccess: '85% improvement with early intervention'
    },
    {
      name: 'Acne & Hormonal Skin Issues',
      prevalence: '85% of adolescents experience acne',
      impact: 'Self-esteem issues, scarring, social withdrawal',
      criticalWindow: 'Ages 9-16 years (puberty onset)',
      treatmentSuccess: '90% improvement with proper treatment'
    },
    {
      name: 'Birthmarks & Skin Lesions',
      prevalence: '10% of children born with significant birthmarks',
      impact: 'Cosmetic concerns, potential complications, psychological impact',
      criticalWindow: 'First 2 years for optimal treatment',
      treatmentSuccess: '95% improvement with early laser therapy'
    },
    {
      name: 'Allergic Skin Reactions',
      prevalence: '15% of children have contact dermatitis',
      impact: 'Rashes, itching, potential sensitization to allergens',
      criticalWindow: 'Early identification prevents chronic sensitization',
      treatmentSuccess: '80% resolution with allergen avoidance'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Pediatric Dermatology Care
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Specialized dermatological care for common childhood skin conditions and developmental skin health. 
              Building healthy skin habits and confidence that last a lifetime.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-pink-600">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-rose-600">92%</div>
                <div className="text-sm text-gray-600">Diagnosis Accuracy</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600">70%</div>
                <div className="text-sm text-gray-600">Chronic Prevention</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-orange-600">12 years</div>
                <div className="text-sm text-gray-600">Critical Window</div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8"
          >
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Shield },
                { id: 'science', label: 'The Science', icon: Microscope },
                { id: 'intervention', label: 'Our Approach', icon: Target },
                { id: 'outcomes', label: 'Outcomes', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeSection === tab.id
                        ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
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
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Critical Window Alert */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Critical Skin Development Window: Birth to 12 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Skin barrier function and immune responses develop during childhood. Early intervention 
                        prevents 70% of chronic skin conditions and establishes healthy skincare habits that 
                        last a lifetime. The skin's ability to heal and adapt is highest during these formative years.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Skin Care (Birth-12 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 85% improvement in chronic skin conditions</li>
                            <li>• Proper skincare routines established</li>
                            <li>• Prevention of scarring and complications</li>
                            <li>• Better self-esteem and social confidence</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Intervention (After 12 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Chronic conditions harder to treat</li>
                            <li>• Permanent scarring and skin damage</li>
                            <li>• Psychological impact on self-esteem</li>
                            <li>• More intensive treatment required</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skin Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {skinConditions.map((condition, index) => (
                    <motion.div
                      key={condition.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{condition.name}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">Prevalence</div>
                            <div className="text-sm text-gray-600">{condition.prevalence}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <div>
                            <div className="font-medium text-gray-900">Impact</div>
                            <div className="text-sm text-gray-600">{condition.impact}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-medium text-gray-900">Critical Window</div>
                            <div className="text-sm text-gray-600">{condition.criticalWindow}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-gray-900">Treatment Success</div>
                            <div className="text-sm text-gray-600">{condition.treatmentSuccess}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
