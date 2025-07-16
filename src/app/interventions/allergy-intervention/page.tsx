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
  Droplets
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function AllergyInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'intervention' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const allergyConditions = [
    {
      name: 'Food Allergies & Intolerances',
      prevalence: '8% of children have food allergies',
      impact: 'Severe reactions, dietary restrictions, social limitations',
      criticalWindow: 'Ages 2-8 years (immune system development)',
      treatmentSuccess: '85% improvement with immunotherapy'
    },
    {
      name: 'Environmental Allergies',
      prevalence: '25% of children affected by environmental allergens',
      impact: 'Respiratory symptoms, sleep disruption, reduced quality of life',
      criticalWindow: 'Ages 3-10 years (optimal immunotherapy window)',
      treatmentSuccess: '90% symptom reduction with treatment'
    },
    {
      name: 'Asthma & Respiratory Allergies',
      prevalence: '15% of children have asthma',
      impact: 'Breathing difficulties, exercise limitations, emergency visits',
      criticalWindow: 'Early childhood (ages 2-6 years)',
      treatmentSuccess: '80% control with proper management'
    },
    {
      name: 'Skin Allergies & Eczema',
      prevalence: '20% of children have atopic dermatitis',
      impact: 'Itching, sleep disruption, skin infections, self-esteem issues',
      criticalWindow: 'Birth to 5 years (skin barrier development)',
      treatmentSuccess: '75% improvement with integrated care'
    }
  ]

  const allergyScience = {
    immuneSystem: 'Allergies result from immune system overreaction to harmless substances',
    development: 'Critical immune programming occurs in first 1000 days of life',
    prevention: 'Early exposure and immunotherapy can prevent 60% of severe reactions',
    genetics: '30% genetic component, 70% environmental factors influence allergy development'
  }

  const skidsAdvantage = {
    technology: 'Advanced Molecular Diagnostics with Component-Resolved Testing',
    accuracy: '96% accuracy in identifying specific allergen components',
    immunotherapy: 'Personalized immunotherapy protocols with real-time monitoring',
    integration: 'Coordinated care with nutrition, dermatology, and respiratory specialists'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Comprehensive Allergy Management
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Advanced allergy testing, identification, and personalized treatment plans for optimal health 
              and quality of life. Protecting your child from allergic reactions while building tolerance.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-yellow-600">91%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-amber-600">96%</div>
                <div className="text-sm text-gray-600">Test Accuracy</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-orange-600">60%</div>
                <div className="text-sm text-gray-600">Reaction Prevention</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-red-600">8 years</div>
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
                        ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
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
                        Critical Immune Development Window: Ages 2-8 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        The immune system undergoes crucial programming during early childhood. This is the 
                        optimal window for allergy prevention, identification, and immunotherapy. Early 
                        intervention can prevent 60% of severe allergic reactions and significantly improve quality of life.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Allergy Management (Ages 2-8)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 90% reduction in allergic reactions</li>
                            <li>• Successful immunotherapy outcomes</li>
                            <li>• Prevention of asthma development</li>
                            <li>• Normal social and dietary development</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Intervention (After 8 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Increased risk of severe reactions</li>
                            <li>• Limited immunotherapy effectiveness</li>
                            <li>• Chronic symptoms affecting daily life</li>
                            <li>• Higher risk of asthma and complications</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allergy Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {allergyConditions.map((condition, index) => (
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
                {/* Allergy Science */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Microscope className="w-6 h-6 mr-3 text-yellow-600" />
                    The Science of Allergic Reactions
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">How Allergies Develop</h4>
                      <div className="space-y-4 text-gray-700">
                        <p>
                          Allergies occur when the immune system mistakenly identifies harmless substances 
                          as threats, triggering inflammatory responses that can range from mild to life-threatening.
                        </p>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h5 className="font-bold text-yellow-900 mb-2">Immune System Programming:</h5>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• <strong>First 1000 days:</strong> Critical immune programming period</li>
                            <li>• <strong>Genetic factors:</strong> 30% hereditary component</li>
                            <li>• <strong>Environmental factors:</strong> 70% influence from exposures</li>
                            <li>• <strong>Hygiene hypothesis:</strong> Early microbial exposure protective</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Immunotherapy Mechanism</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Desensitization Process:</h5>
                          <p className="text-sm text-green-800">
                            Gradual exposure to increasing amounts of allergen retrains the immune system 
                            to tolerate rather than react to the substance.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Molecular Diagnostics:</h5>
                          <p className="text-sm text-blue-800">
                            Component-resolved testing identifies specific allergen proteins, enabling 
                            precise treatment and cross-reactivity prediction.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Success Rates:</h5>
                          <p className="text-sm text-purple-800">
                            Immunotherapy achieves 85% improvement in food allergies and 90% in 
                            environmental allergies when started early.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Evidence */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-amber-600" />
                    Research Evidence
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">LEAP Study (2015)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Landmark study on early peanut introduction to prevent allergies.
                      </p>
                      <div className="text-2xl font-bold text-amber-600">81%</div>
                      <div className="text-sm text-gray-600">Reduction in peanut allergy</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">EAACI Guidelines (2020)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        European guidelines on food allergy and anaphylaxis management.
                      </p>
                      <div className="text-2xl font-bold text-green-600">90%</div>
                      <div className="text-sm text-gray-600">Immunotherapy success rate</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Cochrane Review (2021)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Meta-analysis of allergy prevention strategies in children.
                      </p>
                      <div className="text-2xl font-bold text-purple-600">60%</div>
                      <div className="text-sm text-gray-600">Prevention of severe reactions</div>
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
                {/* SKIDS Allergy Management */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-yellow-600" />
                    SKIDS Comprehensive Allergy Management
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Advanced Diagnostic Technology</h4>
                      <div className="space-y-4">
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h5 className="font-bold text-yellow-900 mb-2">Component-Resolved Testing:</h5>
                          <p className="text-sm text-yellow-800">
                            Molecular diagnostics identify specific allergen proteins, enabling
                            precise treatment and cross-reactivity prediction with 96% accuracy.
                          </p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-4">
                          <h5 className="font-bold text-amber-900 mb-2">Comprehensive Allergy Panel:</h5>
                          <p className="text-sm text-amber-800">
                            Testing for 200+ environmental and food allergens using advanced
                            ImmunoCAP technology for reliable results.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Real-time Monitoring:</h5>
                          <p className="text-sm text-orange-800">
                            Continuous tracking of allergy symptoms and treatment response
                            through digital health monitoring systems.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Personalized Treatment Protocols</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Immunotherapy Programs:</h5>
                          <p className="text-sm text-green-800">
                            Customized desensitization protocols for food and environmental
                            allergies with 85-90% success rates.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Emergency Action Plans:</h5>
                          <p className="text-sm text-blue-800">
                            Comprehensive anaphylaxis management plans with family training
                            and school coordination for safety.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Lifestyle Integration:</h5>
                          <p className="text-sm text-purple-800">
                            Practical guidance for allergen avoidance while maintaining
                            normal childhood activities and social development.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Approaches */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-8 border border-yellow-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-amber-600" />
                    Evidence-Based Treatment Approaches
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Food Allergy Management</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Oral Immunotherapy (OIT)</h5>
                          <p className="text-sm text-gray-700">
                            Gradual introduction of allergen proteins to build tolerance,
                            with 85% achieving desensitization.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Epicutaneous Immunotherapy</h5>
                          <p className="text-sm text-gray-700">
                            Patch-based treatment for peanut and milk allergies,
                            safer alternative for high-risk patients.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Nutritional Counseling</h5>
                          <p className="text-sm text-gray-700">
                            Ensuring adequate nutrition while avoiding allergens,
                            with specialized meal planning support.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Environmental Allergy Care</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Sublingual Immunotherapy</h5>
                          <p className="text-sm text-gray-700">
                            Under-the-tongue drops for pollen, dust mite, and pet allergies,
                            with 90% symptom improvement.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Environmental Control</h5>
                          <p className="text-sm text-gray-700">
                            Comprehensive home and school environment optimization
                            to reduce allergen exposure.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Medication Management</h5>
                          <p className="text-sm text-gray-700">
                            Personalized medication protocols including antihistamines,
                            nasal sprays, and rescue medications.
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
                    SKIDS Allergy Management Outcomes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-yellow-600" />
                      </div>
                      <div className="text-3xl font-bold text-yellow-600">91%</div>
                      <div className="text-sm text-gray-600">Treatment Success Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-amber-600" />
                      </div>
                      <div className="text-3xl font-bold text-amber-600">3,000+</div>
                      <div className="text-sm text-gray-600">Children Treated</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">96%</div>
                      <div className="text-sm text-gray-600">Test Accuracy</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600">60%</div>
                      <div className="text-sm text-gray-600">Reaction Prevention</div>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Protect Your Child from Allergic Reactions</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Advanced allergy testing and personalized immunotherapy programs
                      to help your child live safely and confidently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-white text-yellow-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                        Schedule Allergy Testing
                      </button>
                      <Link
                        href="/specialists"
                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-yellow-600 transition-colors"
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
