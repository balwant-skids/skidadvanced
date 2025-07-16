'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wind,
  Target,
  Zap,
  CheckCircle,
  Users,
  Star,
  TrendingUp,
  ArrowRight,
  Brain,
  Heart,
  Activity,
  Shield,
  Sparkles,
  BarChart3,
  Clock,
  Award,
  ExternalLink,
  Waves,
  Focus
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function FocusInterventionPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Wind },
    { id: 'science', label: 'The Science', icon: Brain },
    { id: 'intervention', label: 'Our Approach', icon: Target },
    { id: 'outcomes', label: 'Results', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Wind className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              AI-Powered Focus & Pranayama Training
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Personalized breathing exercises and mindfulness training powered by AI to enhance focus, 
              reduce anxiety, and improve emotional regulation in children through evidence-based pranayama techniques.
            </motion.p>

            {/* Shanti Integration Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-cyan-900 mb-1">
                    Powered by Shanti Pranayama Coach
                  </h3>
                  <p className="text-sm text-cyan-700">
                    AI-powered personalized pranayama and mindfulness training platform
                  </p>
                </div>
                <a
                  href="https://pranayama-coach-shanti-969652507861.us-west1.run.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <span className="font-medium">Try Platform</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden"
          >
            <div className="flex overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-3 px-8 py-6 font-medium transition-all whitespace-nowrap ${
                      activeSection === section.id
                        ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Key Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Focus className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Enhanced Focus</h3>
                    <p className="text-gray-600">
                      Scientifically-proven breathing techniques that improve attention span, 
                      concentration, and cognitive performance in academic settings.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Emotional Regulation</h3>
                    <p className="text-gray-600">
                      Pranayama practices that help children manage emotions, reduce anxiety, 
                      and develop resilience in challenging situations.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Personalization</h3>
                    <p className="text-gray-600">
                      Advanced AI algorithms adapt breathing exercises to individual needs, 
                      progress levels, and specific focus challenges.
                    </p>
                  </div>
                </div>

                {/* Critical Development Periods */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Optimal Ages for Focus & Mindfulness Training
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-cyan-900 mb-3">Ages 4-7 Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Foundation building for attention and emotional awareness.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Basic breathing awareness</li>
                        <li>• Simple mindfulness games</li>
                        <li>• Emotional vocabulary building</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-cyan-900 mb-3">Ages 8-12 Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Structured pranayama practice for academic performance.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Formal breathing techniques</li>
                        <li>• Concentration exercises</li>
                        <li>• Stress management skills</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-cyan-900 mb-3">Ages 13+ Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Advanced practices for emotional regulation and peak performance.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Advanced pranayama techniques</li>
                        <li>• Meditation practices</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'science' && (
              <motion.div
                key="science"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Research Foundation */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-cyan-600" />
                    Neuroscience of Pranayama and Focus
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Brain Function Enhancement</h4>
                      <div className="space-y-4">
                        <div className="bg-cyan-50 rounded-lg p-4">
                          <h5 className="font-bold text-cyan-900 mb-2">Prefrontal Cortex Activation:</h5>
                          <p className="text-sm text-cyan-800">
                            Controlled breathing exercises strengthen the prefrontal cortex, 
                            improving executive function, decision-making, and impulse control.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Parasympathetic Activation:</h5>
                          <p className="text-sm text-blue-800">
                            Pranayama activates the parasympathetic nervous system, 
                            reducing stress hormones and promoting calm alertness.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Cognitive Benefits</h4>
                      <div className="space-y-4">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Attention Networks:</h5>
                          <p className="text-sm text-purple-800">
                            Regular practice strengthens attention networks in the brain, 
                            improving sustained attention and reducing mind-wandering.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Neuroplasticity:</h5>
                          <p className="text-sm text-green-800">
                            Mindfulness practices promote neuroplasticity, enhancing 
                            learning capacity and emotional resilience.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'intervention' && (
              <motion.div
                key="intervention"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Shanti Platform Integration */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Waves className="w-6 h-6 mr-3 text-cyan-600" />
                    Shanti: AI-Powered Pranayama Coach
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">AI-Powered Features</h4>
                      <div className="space-y-4">
                        <div className="bg-cyan-50 rounded-lg p-4">
                          <h5 className="font-bold text-cyan-900 mb-2">Personalized Sessions:</h5>
                          <p className="text-sm text-cyan-800">
                            AI algorithms create customized breathing sessions based on age, 
                            stress levels, focus goals, and individual progress patterns.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Real-time Guidance:</h5>
                          <p className="text-sm text-blue-800">
                            Interactive coaching with real-time feedback on breathing patterns, 
                            rhythm, and technique optimization for maximum benefit.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Progress Tracking:</h5>
                          <p className="text-sm text-purple-800">
                            Comprehensive analytics tracking focus improvement, stress reduction, 
                            and emotional regulation progress over time.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Platform Access</h4>
                      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <h5 className="font-bold text-cyan-900 mb-3">Try Shanti Pranayama Coach</h5>
                        <p className="text-sm text-cyan-800 mb-4">
                          Experience AI-powered personalized pranayama training designed specifically for children.
                        </p>
                        <a
                          href="https://pranayama-coach-shanti-969652507861.us-west1.run.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                          <span className="font-medium">Launch Platform</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'outcomes' && (
              <motion.div
                key="outcomes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Success Metrics */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
                    SKIDS Focus & Pranayama Outcomes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600">85%</div>
                      <div className="text-sm text-gray-600">Focus Improvement</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">2,500+</div>
                      <div className="text-sm text-gray-600">Children Trained</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">4.9/5</div>
                      <div className="text-sm text-gray-600">User Satisfaction</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">60%</div>
                      <div className="text-sm text-gray-600">Stress Reduction</div>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Enhance Your Child's Focus with AI-Powered Pranayama</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Experience the transformative power of personalized breathing exercises and mindfulness 
                      training designed specifically for children's developing minds.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="https://pranayama-coach-shanti-969652507861.us-west1.run.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors text-center inline-flex items-center justify-center space-x-2"
                      >
                        <span>Try Shanti Platform</span>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <Link
                        href="/specialists"
                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-cyan-600 transition-colors text-center"
                      >
                        Meet Our Specialists
                      </Link>
                    </div>
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
