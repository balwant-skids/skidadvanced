'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ear,
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
  Volume2,
  Headphones,
  Gamepad2
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function HearingInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'soundscout' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const hearingConditions = [
    {
      name: 'Conductive Hearing Loss',
      prevalence: '15% of children experience temporary hearing loss',
      impact: 'Speech delays, learning difficulties, behavioral issues',
      criticalWindow: 'Birth to 3.5 years (auditory development)',
      treatmentSuccess: '95% improvement with early intervention'
    },
    {
      name: 'Sensorineural Hearing Loss',
      prevalence: '1-3 per 1000 newborns',
      impact: 'Permanent hearing loss, language development delays',
      criticalWindow: 'First 6 months critical for intervention',
      treatmentSuccess: '90% language development with early detection'
    },
    {
      name: 'Auditory Processing Disorder',
      prevalence: '5% of school-age children',
      impact: 'Difficulty understanding speech in noise, academic struggles',
      criticalWindow: 'Ages 7-12 for optimal intervention',
      treatmentSuccess: '80% improvement with targeted therapy'
    },
    {
      name: 'Speech and Language Delays',
      prevalence: '10-15% of children under 3',
      impact: 'Communication difficulties, social isolation',
      criticalWindow: 'Birth to 3 years for language acquisition',
      treatmentSuccess: '85% improvement with early speech therapy'
    }
  ]

  const soundScoutTechnology = {
    accuracy: '98% correlation with traditional audiometry',
    gameBasedTesting: 'Reduces test anxiety and improves cooperation',
    automatedSystem: 'Consistent, objective results without operator bias',
    childFriendly: 'Engaging interface designed specifically for children'
  }

  const hearingScience = {
    criticalPeriod: 'Birth to 3.5 years for optimal auditory neural development',
    brainPlasticity: 'Auditory cortex most adaptable during early childhood',
    languageAcquisition: '90% of language learning occurs before age 5',
    socialImpact: 'Hearing loss affects social-emotional development significantly'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-green-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Ear className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Precision Hearing Enhancement
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Revolutionary SoundScout technology for accurate, child-friendly hearing assessment. 
              Harnessing the critical auditory development window for optimal language outcomes.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">SoundScout Accuracy</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-teal-600">3.5</div>
                <div className="text-sm text-gray-600">Critical Years</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-blue-600">400%</div>
                <div className="text-sm text-gray-600">Language Improvement</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
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
                { id: 'overview', label: 'Overview', icon: Ear },
                { id: 'science', label: 'The Science', icon: Brain },
                { id: 'soundscout', label: 'SoundScout Tech', icon: Headphones },
                { id: 'outcomes', label: 'Outcomes', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeSection === tab.id
                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
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
                        Critical Auditory Development Window: Birth to 3.5 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        The auditory system undergoes rapid development during the first 3.5 years of life. 
                        This is when the brain forms crucial neural pathways for processing sound and language. 
                        Missing this window can result in permanent language and learning difficulties.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Detection & Intervention</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Normal language development achieved</li>
                            <li>• 400% improvement in language outcomes</li>
                            <li>• Age-appropriate academic performance</li>
                            <li>• Optimal social-emotional development</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Detection (After 3.5 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Permanent language delays</li>
                            <li>• 20-30 point reduction in IQ scores</li>
                            <li>• Academic underachievement</li>
                            <li>• Social isolation and behavioral issues</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hearing Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {hearingConditions.map((condition, index) => (
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

            {activeSection === 'soundscout' && (
              <motion.div
                key="soundscout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* SoundScout Hero */}
                <div className="bg-gradient-to-r from-green-400 to-teal-600 text-white rounded-2xl p-8">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Headphones className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">SoundScout Technology</h3>
                      <p className="text-xl opacity-90">Revolutionary automated audiometry for children</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-2">98%</div>
                      <div className="text-sm opacity-90">Accuracy vs Traditional</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-2">5 min</div>
                      <div className="text-sm opacity-90">Test Duration</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-2">6 months+</div>
                      <div className="text-sm opacity-90">Starting Age</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-2">95%</div>
                      <div className="text-sm opacity-90">Child Cooperation</div>
                    </div>
                  </div>
                </div>

                {/* Technology Advantages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Gamepad2 className="w-6 h-6 mr-3 text-green-600" />
                      Game-Based Testing
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-bold text-green-900 mb-2">Child-Friendly Interface</h4>
                        <p className="text-sm text-green-800">
                          Interactive games and animations keep children engaged throughout the test, 
                          reducing anxiety and improving cooperation rates to 95%.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-2">Adaptive Algorithms</h4>
                        <p className="text-sm text-blue-800">
                          AI-powered testing adapts to each child's responses, optimizing test duration 
                          while maintaining clinical accuracy.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-bold text-purple-900 mb-2">Objective Results</h4>
                        <p className="text-sm text-purple-800">
                          Automated system eliminates operator bias and provides consistent, 
                          reproducible results across all testing sessions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Target className="w-6 h-6 mr-3 text-blue-600" />
                      Clinical Accuracy
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-bold text-orange-900 mb-2">Validated Technology</h4>
                        <p className="text-sm text-orange-800">
                          Extensive clinical validation shows 98% correlation with traditional 
                          audiometry across all age groups and hearing levels.
                        </p>
                      </div>
                      
                      <div className="bg-teal-50 rounded-lg p-4">
                        <h4 className="font-bold text-teal-900 mb-2">Comprehensive Testing</h4>
                        <p className="text-sm text-teal-800">
                          Tests pure-tone thresholds, speech recognition, and auditory processing 
                          in a single, streamlined session.
                        </p>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="font-bold text-indigo-900 mb-2">Real-Time Analysis</h4>
                        <p className="text-sm text-indigo-800">
                          Immediate results with detailed audiograms and recommendations 
                          for further intervention if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison with Traditional Testing */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">SoundScout vs Traditional Audiometry</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-bold text-gray-900">Feature</th>
                          <th className="text-center py-3 px-4 font-bold text-green-600">SoundScout</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-600">Traditional</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Test Duration</td>
                          <td className="py-3 px-4 text-center text-green-600">5-10 minutes</td>
                          <td className="py-3 px-4 text-center text-gray-600">20-30 minutes</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Child Cooperation</td>
                          <td className="py-3 px-4 text-center text-green-600">95%</td>
                          <td className="py-3 px-4 text-center text-gray-600">60-70%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Operator Dependency</td>
                          <td className="py-3 px-4 text-center text-green-600">Minimal</td>
                          <td className="py-3 px-4 text-center text-gray-600">High</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Result Consistency</td>
                          <td className="py-3 px-4 text-center text-green-600">98% reproducible</td>
                          <td className="py-3 px-4 text-center text-gray-600">Variable</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Child Anxiety</td>
                          <td className="py-3 px-4 text-center text-green-600">Low (game-based)</td>
                          <td className="py-3 px-4 text-center text-gray-600">High (clinical setting)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">Immediate Results</td>
                          <td className="py-3 px-4 text-center text-green-600">✓ Yes</td>
                          <td className="py-3 px-4 text-center text-gray-600">✗ Manual analysis</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
