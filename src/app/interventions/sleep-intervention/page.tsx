'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon,
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
  Bed
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function SleepInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'intervention' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const sleepConditions = [
    {
      name: 'Sleep Disorders & Insomnia',
      prevalence: '30% of children have sleep problems',
      impact: 'Daytime fatigue, behavioral issues, poor academic performance',
      criticalWindow: 'Birth to 5 years (sleep pattern establishment)',
      treatmentSuccess: '85% improvement with behavioral interventions'
    },
    {
      name: 'Sleep Apnea & Breathing Issues',
      prevalence: '5% of children have sleep apnea',
      impact: 'Disrupted sleep, growth issues, cognitive impairment',
      criticalWindow: 'Early detection crucial for development',
      treatmentSuccess: '90% improvement with proper treatment'
    },
    {
      name: 'Circadian Rhythm Disorders',
      prevalence: '15% of adolescents have delayed sleep phase',
      impact: 'School performance issues, mood disorders, health problems',
      criticalWindow: 'Puberty (ages 10-16 years)',
      treatmentSuccess: '80% improvement with light therapy'
    },
    {
      name: 'Bedtime Resistance & Night Wakings',
      prevalence: '25% of toddlers have bedtime difficulties',
      impact: 'Family stress, parental exhaustion, child behavioral issues',
      criticalWindow: 'Ages 1-4 years (habit formation)',
      treatmentSuccess: '95% improvement with consistent routines'
    }
  ]

  const sleepScience = {
    development: 'Sleep architecture matures throughout childhood, with deep sleep crucial for growth',
    brainDevelopment: '90% of brain development occurs during sleep in first 5 years',
    memory: 'Sleep consolidates learning and memory, essential for academic success',
    growth: 'Growth hormone released primarily during deep sleep stages'
  }

  const skidsAdvantage = {
    technology: 'Advanced Sleep Monitoring with AI-Powered Analysis',
    accuracy: '94% accuracy in sleep disorder identification',
    intervention: 'Personalized sleep optimization plans with family coaching',
    monitoring: 'Continuous sleep tracking with real-time adjustments'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Moon className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Sleep Health Optimization
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Comprehensive sleep assessment and intervention for optimal sleep quality, duration, and 
              developmental outcomes. Building healthy sleep habits for lifelong wellness.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-indigo-600">90%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-gray-600">Detection Accuracy</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-blue-600">40%</div>
                <div className="text-sm text-gray-600">Academic Improvement</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-green-600">5 years</div>
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
                { id: 'overview', label: 'Overview', icon: Moon },
                { id: 'science', label: 'The Science', icon: Brain },
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
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
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
                        Critical Sleep Development Window: Birth to 5 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Sleep patterns and circadian rhythms establish during early childhood. Quality sleep 
                        is essential for 90% of brain development in the first 5 years. Early intervention 
                        improves academic performance by 40% and establishes healthy sleep habits for life.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Sleep Optimization (Birth-5 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Optimal brain development and learning</li>
                            <li>• Better emotional regulation and behavior</li>
                            <li>• Stronger immune system and growth</li>
                            <li>• Healthy sleep habits established for life</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Intervention (After 5 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Impaired cognitive development</li>
                            <li>• Behavioral and emotional difficulties</li>
                            <li>• Weakened immune system</li>
                            <li>• Chronic sleep pattern disruption</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sleep Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {sleepConditions.map((condition, index) => (
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

                {/* Sleep Science Highlights */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-indigo-600" />
                    Why Sleep Matters for Development
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Brain Development</h4>
                      <p className="text-sm text-gray-600">
                        90% of brain development occurs during sleep in the first 5 years of life.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Memory & Learning</h4>
                      <p className="text-sm text-gray-600">
                        Sleep consolidates memories and learning, essential for academic success.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Physical Growth</h4>
                      <p className="text-sm text-gray-600">
                        Growth hormone is released primarily during deep sleep stages.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-orange-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Emotional Health</h4>
                      <p className="text-sm text-gray-600">
                        Quality sleep regulates emotions and reduces behavioral problems.
                      </p>
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
                {/* Sleep Architecture */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Microscope className="w-6 h-6 mr-3 text-indigo-600" />
                    The Science of Sleep Development
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Sleep Architecture in Children</h4>
                      <div className="space-y-4 text-gray-700">
                        <p>
                          Children's sleep patterns evolve dramatically from birth through adolescence. 
                          Understanding these changes is crucial for optimal intervention timing.
                        </p>
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-bold text-indigo-900 mb-2">Sleep Development Timeline:</h5>
                          <ul className="text-sm text-indigo-800 space-y-1">
                            <li>• <strong>Newborn (0-3 months):</strong> 14-17 hours, irregular patterns</li>
                            <li>• <strong>Infant (4-11 months):</strong> 12-15 hours, circadian rhythm develops</li>
                            <li>• <strong>Toddler (1-2 years):</strong> 11-14 hours, naps consolidate</li>
                            <li>• <strong>Preschool (3-5 years):</strong> 10-13 hours, naps phase out</li>
                            <li>• <strong>School age (6-13 years):</strong> 9-11 hours, stable patterns</li>
                            <li>• <strong>Teen (14-17 years):</strong> 8-10 hours, delayed phase</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Sleep's Role in Development</h4>
                      <div className="space-y-4">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Brain Development:</h5>
                          <p className="text-sm text-purple-800">
                            During sleep, the brain forms new neural connections, consolidates memories, 
                            and clears metabolic waste products.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Physical Growth:</h5>
                          <p className="text-sm text-green-800">
                            Growth hormone is released in pulses during deep sleep, making quality 
                            sleep essential for proper physical development.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Immune Function:</h5>
                          <p className="text-sm text-orange-800">
                            Sleep strengthens the immune system and helps the body fight off 
                            infections and diseases.
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
                {/* SKIDS Sleep Optimization */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-indigo-600" />
                    SKIDS Comprehensive Sleep Optimization
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Advanced Sleep Monitoring</h4>
                      <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-bold text-indigo-900 mb-2">AI-Powered Sleep Analysis:</h5>
                          <p className="text-sm text-indigo-800">
                            Advanced algorithms analyze sleep patterns, identifying disorders
                            with 94% accuracy using non-invasive monitoring technology.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Home Sleep Studies:</h5>
                          <p className="text-sm text-purple-800">
                            Comfortable at-home sleep monitoring eliminates the need for
                            overnight clinic stays while providing comprehensive data.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Circadian Rhythm Tracking:</h5>
                          <p className="text-sm text-blue-800">
                            Continuous monitoring of natural sleep-wake cycles to optimize
                            timing and improve sleep quality.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Personalized Sleep Interventions</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Behavioral Sleep Therapy:</h5>
                          <p className="text-sm text-green-800">
                            Evidence-based behavioral interventions to establish healthy
                            sleep habits and routines for lasting improvement.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Sleep Environment Optimization:</h5>
                          <p className="text-sm text-orange-800">
                            Comprehensive assessment and modification of sleep environment
                            including lighting, temperature, and noise control.
                          </p>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                          <h5 className="font-bold text-pink-900 mb-2">Family Sleep Coaching:</h5>
                          <p className="text-sm text-pink-800">
                            Personalized guidance for parents to support healthy sleep
                            habits and manage sleep challenges effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sleep Disorder Management */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-purple-600" />
                    Specialized Sleep Disorder Management
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Sleep Apnea Treatment</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Pediatric CPAP Therapy</h5>
                          <p className="text-sm text-gray-700">
                            Child-friendly CPAP devices with specialized masks and
                            comfort features for effective treatment compliance.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Oral Appliance Therapy</h5>
                          <p className="text-sm text-gray-700">
                            Custom-fitted oral devices to maintain airway patency
                            during sleep for mild to moderate cases.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Surgical Consultation</h5>
                          <p className="text-sm text-gray-700">
                            Coordination with ENT specialists for adenotonsillectomy
                            and other surgical interventions when indicated.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Circadian Rhythm Disorders</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Light Therapy</h5>
                          <p className="text-sm text-gray-700">
                            Targeted light exposure therapy to reset circadian rhythms
                            and improve sleep-wake cycle alignment.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Melatonin Optimization</h5>
                          <p className="text-sm text-gray-700">
                            Carefully timed melatonin supplementation to support
                            natural sleep hormone production and timing.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Schedule Modification</h5>
                          <p className="text-sm text-gray-700">
                            Gradual adjustment of sleep and wake times to establish
                            healthy circadian rhythm patterns.
                          </p>
                        </div>
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
                    SKIDS Sleep Optimization Outcomes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-indigo-600" />
                      </div>
                      <div className="text-3xl font-bold text-indigo-600">90%</div>
                      <div className="text-sm text-gray-600">Sleep Improvement Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">1,800+</div>
                      <div className="text-sm text-gray-600">Children Helped</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">94%</div>
                      <div className="text-sm text-gray-600">Detection Accuracy</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">40%</div>
                      <div className="text-sm text-gray-600">Academic Improvement</div>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Optimize Your Child's Sleep for Better Development</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Advanced sleep assessment and personalized optimization programs
                      to unlock your child's full potential through quality sleep.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                        Schedule Sleep Assessment
                      </button>
                      <Link
                        href="/interventions"
                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
                      >
                        Explore All Interventions
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
