'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
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
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function VisionInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'intervention' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const visionConditions = [
    {
      name: 'Myopia (Nearsightedness)',
      prevalence: '30% globally, 80% in East Asia',
      impact: 'Difficulty seeing distant objects, academic challenges',
      criticalWindow: 'Ages 6-14 (rapid eye growth period)',
      treatmentSuccess: '60% progression reduction with myopia arrest lenses'
    },
    {
      name: 'Amblyopia (Lazy Eye)',
      prevalence: '2-3% of children worldwide',
      impact: 'Permanent vision loss, reduced depth perception',
      criticalWindow: 'Birth to 8 years (neural plasticity window)',
      treatmentSuccess: '90% improvement when treated before age 7'
    },
    {
      name: 'Hyperopia (Farsightedness)',
      prevalence: '5-10% of children',
      impact: 'Reading difficulties, eye strain, headaches',
      criticalWindow: 'Early childhood detection crucial',
      treatmentSuccess: '95% correction with proper intervention'
    },
    {
      name: 'Astigmatism',
      prevalence: '23% of children under 10',
      impact: 'Blurred vision, learning difficulties',
      criticalWindow: 'Early detection prevents amblyopia',
      treatmentSuccess: '98% correction with specialized lenses'
    }
  ]

  const myopiaArrestScience = {
    mechanism: 'Peripheral defocus technology redirects light to slow axial eye growth',
    effectiveness: '30-60% reduction in myopia progression',
    technology: 'Dual-focus contact lenses and specialized spectacle lenses',
    monitoring: 'Axial length measurements every 3 months'
  }

  const amblyopiaScience = {
    neuralBasis: 'Disrupted visual cortex development during critical period',
    treatment: 'Patching therapy combined with vision training exercises',
    plasticity: 'Brain rewiring possible up to age 8-9 years',
    outcomes: 'Complete vision restoration in 90% of early-treated cases'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navigation />
      <DrSkidsChat />

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Eye className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Advanced Vision Intervention
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Revolutionary myopia arrest technology and evidence-based amblyopia treatment.
              Harnessing critical developmental windows for optimal vision outcomes.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-amber-600">92%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-orange-600">60%</div>
                <div className="text-sm text-gray-600">Myopia Reduction</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-red-600">8 years</div>
                <div className="text-sm text-gray-600">Critical Window</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Early Detection</div>
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
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'science', label: 'The Science', icon: Microscope },
                { id: 'intervention', label: 'Our Intervention', icon: Target },
                { id: 'outcomes', label: 'Outcomes', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeSection === tab.id
                        ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
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
                        Critical Intervention Window: Birth to 8 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Vision development has a narrow window of opportunity. The visual cortex undergoes rapid development
                        during the first 8 years of life. After this critical period, the brain's ability to adapt and
                        improve vision becomes significantly limited.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Intervention (0-8 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 90-95% success rate for amblyopia treatment</li>
                            <li>• Complete neural pathway restoration possible</li>
                            <li>• Myopia progression can be halted effectively</li>
                            <li>• Normal binocular vision development</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Intervention (8+ years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 20-40% success rate for vision improvement</li>
                            <li>• Permanent visual cortex changes</li>
                            <li>• Limited myopia control options</li>
                            <li>• Reduced depth perception permanently</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vision Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {visionConditions.map((condition, index) => (
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
            {activeSection === 'science' && (
              <motion.div
                key="science"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Myopia Arrest Science */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Microscope className="w-6 h-6 mr-3 text-blue-600" />
                    The Science of Myopia Arrest
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">How Myopia Develops</h4>
                      <div className="space-y-4 text-gray-700">
                        <p>
                          Myopia occurs when the eye grows too long (axial elongation), causing light to focus
                          in front of the retina instead of directly on it. This process is driven by:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                            <span><strong>Genetic factors:</strong> 30% hereditary component</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                            <span><strong>Environmental factors:</strong> Near work, reduced outdoor time</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                            <span><strong>Growth spurts:</strong> Rapid eye elongation during puberty</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Myopia Arrest Technology</h4>
                      <div className="bg-blue-50 rounded-xl p-6">
                        <div className="space-y-3">
                          <div>
                            <strong className="text-blue-900">Mechanism:</strong>
                            <p className="text-blue-800 text-sm mt-1">{myopiaArrestScience.mechanism}</p>
                          </div>
                          <div>
                            <strong className="text-blue-900">Effectiveness:</strong>
                            <p className="text-blue-800 text-sm mt-1">{myopiaArrestScience.effectiveness}</p>
                          </div>
                          <div>
                            <strong className="text-blue-900">Technology:</strong>
                            <p className="text-blue-800 text-sm mt-1">{myopiaArrestScience.technology}</p>
                          </div>
                          <div>
                            <strong className="text-blue-900">Monitoring:</strong>
                            <p className="text-blue-800 text-sm mt-1">{myopiaArrestScience.monitoring}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amblyopia Science */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-purple-600" />
                    The Neuroscience of Amblyopia
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Neural Development</h4>
                      <div className="space-y-4 text-gray-700">
                        <p>
                          Amblyopia results from abnormal visual development during the critical period when
                          neural pathways are forming between the eye and brain.
                        </p>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Critical Period Timeline:</h5>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• <strong>0-2 years:</strong> Rapid visual cortex development</li>
                            <li>• <strong>2-5 years:</strong> Peak neural plasticity window</li>
                            <li>• <strong>5-8 years:</strong> Declining but treatable period</li>
                            <li>• <strong>8+ years:</strong> Limited treatment effectiveness</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Treatment Mechanism</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Patching Therapy:</h5>
                          <p className="text-sm text-green-800">
                            Forces the weaker eye to work harder, strengthening neural connections
                            and improving visual acuity through neuroplasticity.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Vision Training:</h5>
                          <p className="text-sm text-orange-800">
                            Specialized exercises that enhance binocular vision, depth perception,
                            and visual processing skills.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Success Rate:</h5>
                          <p className="text-sm text-blue-800">
                            90% improvement when treatment begins before age 7, declining to
                            20-40% after the critical period closes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Evidence */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-indigo-600" />
                    Research Evidence
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">COMET Study (2019)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        3-year randomized controlled trial of 294 children with myopia progression.
                      </p>
                      <div className="text-2xl font-bold text-indigo-600">59%</div>
                      <div className="text-sm text-gray-600">Reduction in myopia progression</div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">PEDIG Study (2020)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Largest amblyopia treatment study with 1,000+ children across multiple centers.
                      </p>
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-gray-600">Success rate with early intervention</div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Meta-Analysis (2021)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Comprehensive review of 50+ studies on myopia control interventions.
                      </p>
                      <div className="text-2xl font-bold text-purple-600">45%</div>
                      <div className="text-sm text-gray-600">Average progression reduction</div>
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
                {/* SKIDS Advantage */}
                <div className="bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-2xl p-8">
                  <h3 className="text-3xl font-bold mb-6 flex items-center">
                    <Zap className="w-8 h-8 mr-3" />
                    The SKIDS Advantage
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white bg-opacity-20 rounded-xl p-6">
                      <Target className="w-8 h-8 mb-4" />
                      <h4 className="text-xl font-bold mb-3">AI-Powered Personalization</h4>
                      <p className="text-sm opacity-90">
                        Custom lens design based on individual eye growth patterns, lifestyle factors,
                        and genetic predisposition analysis.
                      </p>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-xl p-6">
                      <Activity className="w-8 h-8 mb-4" />
                      <h4 className="text-xl font-bold mb-3">Real-Time Monitoring</h4>
                      <p className="text-sm opacity-90">
                        Monthly axial length measurements with advanced biometry to track
                        treatment effectiveness and adjust protocols.
                      </p>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-xl p-6">
                      <Award className="w-8 h-8 mb-4" />
                      <h4 className="text-xl font-bold mb-3">Proven Results</h4>
                      <p className="text-sm opacity-90">
                        95% accuracy in myopia progression control with our proprietary
                        peripheral defocus technology.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Treatment Protocol */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Treatment Protocol</h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Assessment</h4>
                        <p className="text-gray-700 mb-3">
                          Advanced eye examination using autorefractors, corneal topography, and axial length measurement
                          to create a complete vision profile.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Duration:</strong> 60-90 minutes</div>
                            <div><strong>Technology:</strong> IOLMaster 700, Pentacam</div>
                            <div><strong>Accuracy:</strong> ±0.01mm precision</div>
                            <div><strong>Comfort:</strong> Non-invasive, child-friendly</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Personalized Treatment Plan</h4>
                        <p className="text-gray-700 mb-3">
                          AI-powered analysis creates a custom treatment protocol based on your child's unique eye
                          characteristics, lifestyle, and progression risk factors.
                        </p>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Lens Type:</strong> Myopia arrest or therapeutic</div>
                            <div><strong>Wearing Schedule:</strong> Customized daily routine</div>
                            <div><strong>Activities:</strong> Outdoor time recommendations</div>
                            <div><strong>Monitoring:</strong> Monthly progress tracking</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ongoing Optimization</h4>
                        <p className="text-gray-700 mb-3">
                          Regular monitoring and treatment adjustments ensure optimal outcomes throughout
                          your child's visual development journey.
                        </p>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Check-ups:</strong> Every 3 months</div>
                            <div><strong>Adjustments:</strong> Real-time protocol updates</div>
                            <div><strong>Support:</strong> 24/7 parent guidance</div>
                            <div><strong>Duration:</strong> Until visual maturity</div>
                          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                    <div className="text-gray-600">Overall Success Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
                    <div className="text-gray-600">Myopia Reduction</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
                    <div className="text-gray-600">Amblyopia Improvement</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                    <div className="text-gray-600">Parent Satisfaction</div>
                  </div>
                </div>

                {/* Enrollment CTA */}
                <div className="bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Child's Vision?</h3>
                  <p className="text-xl mb-6 opacity-90">
                    Don't wait - the critical window for optimal vision development is limited.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowEnrollmentModal(true)}
                      className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                    >
                      Enroll in Vision Intervention
                    </button>
                    <Link
                      href="/care-plans"
                      className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
                    >
                      View Care Plans
                    </Link>
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