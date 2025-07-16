'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smile,
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
  Shield,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function DentalInterventionPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'science' | 'intervention' | 'outcomes'>('overview')
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const dentalConditions = [
    {
      name: 'Tooth Decay & Cavities',
      prevalence: '60% of children globally have tooth decay',
      impact: 'Pain, infection, difficulty eating and speaking',
      criticalWindow: 'Ages 1-6 years (primary teeth development)',
      treatmentSuccess: '95% prevention with early intervention'
    },
    {
      name: 'Gum Disease & Gingivitis',
      prevalence: '50% of children show early signs',
      impact: 'Bleeding gums, bad breath, tooth loss risk',
      criticalWindow: 'Ages 3-8 years (oral hygiene habit formation)',
      treatmentSuccess: '90% reversal with proper care'
    },
    {
      name: 'Malocclusion & Bite Issues',
      prevalence: '70% of children have some degree of malocclusion',
      impact: 'Difficulty chewing, speech problems, self-esteem issues',
      criticalWindow: 'Ages 6-12 years (mixed dentition period)',
      treatmentSuccess: '85% correction with early orthodontics'
    },
    {
      name: 'Dental Trauma & Injuries',
      prevalence: '25% of children experience dental trauma',
      impact: 'Tooth loss, nerve damage, psychological impact',
      criticalWindow: 'Immediate intervention within 30 minutes',
      treatmentSuccess: '80% tooth preservation with prompt care'
    }
  ]

  const dentalScience = {
    development: 'Primary teeth begin forming at 6 weeks in utero, erupting from 6 months',
    criticalPeriod: 'Ages 1-6 years for primary teeth, 6-12 years for permanent teeth',
    prevention: 'Fluoride reduces cavities by 20-40%, sealants prevent 80% of decay',
    earlyIntervention: 'Preventive care reduces treatment needs by 70% and costs by 60%'
  }

  const skidsAdvantage = {
    technology: 'Digital Dental Imaging with AI-Powered Caries Detection',
    accuracy: '95% early detection of dental issues before visible symptoms',
    childFriendly: 'Pain-free laser dentistry and sedation options for anxious children',
    prevention: 'Comprehensive preventive protocols with family education'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Smile className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Comprehensive Dental Care
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Advanced dental screening, preventive care, and early intervention for optimal oral health 
              and development. Building healthy smiles that last a lifetime.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-blue-600">93%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-indigo-600">70%</div>
                <div className="text-sm text-gray-600">Cost Reduction</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Prevention Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600">6 years</div>
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
                { id: 'overview', label: 'Overview', icon: Smile },
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
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
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
                        Critical Dental Development Window: Ages 1-6 Years
                      </h3>
                      <p className="text-gray-700 mb-4">
                        The first six years are crucial for dental development and oral health habit formation. 
                        Primary teeth guide permanent tooth development, and early intervention prevents 
                        70% of future dental problems while reducing treatment costs by 60%.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-green-700 mb-2">Early Dental Care (Ages 1-6)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 95% prevention of tooth decay and cavities</li>
                            <li>• Proper oral hygiene habits established</li>
                            <li>• Normal dental and facial development</li>
                            <li>• Reduced anxiety and positive dental experiences</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-2">Late Intervention (After 6 years)</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Extensive treatment requirements</li>
                            <li>• Higher risk of tooth loss and complications</li>
                            <li>• Facial development issues</li>
                            <li>• Increased pain, anxiety, and costs</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dental Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {dentalConditions.map((condition, index) => (
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
                {/* Dental Development Science */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Microscope className="w-6 h-6 mr-3 text-blue-600" />
                    The Science of Dental Development
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Tooth Development Timeline</h4>
                      <div className="space-y-4 text-gray-700">
                        <p>
                          Dental development begins early in pregnancy and continues through adolescence. 
                          Understanding this timeline is crucial for optimal intervention.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Critical Development Stages:</h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>6 weeks in utero:</strong> Tooth buds begin forming</li>
                            <li>• <strong>6 months:</strong> First primary teeth erupt</li>
                            <li>• <strong>2-3 years:</strong> All primary teeth present</li>
                            <li>• <strong>6 years:</strong> First permanent molars erupt</li>
                            <li>• <strong>6-12 years:</strong> Mixed dentition period</li>
                            <li>• <strong>12-18 years:</strong> All permanent teeth erupt</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Prevention Science</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Fluoride Protection:</h5>
                          <p className="text-sm text-green-800">
                            Fluoride strengthens tooth enamel and reduces cavities by 20-40%. 
                            Optimal fluoride exposure during tooth development provides lifelong protection.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Dental Sealants:</h5>
                          <p className="text-sm text-purple-800">
                            Sealants prevent 80% of cavities in back teeth for up to 10 years. 
                            Most effective when applied to newly erupted permanent molars.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Early Intervention:</h5>
                          <p className="text-sm text-orange-800">
                            Preventive care starting by age 1 reduces future treatment needs by 70% 
                            and associated costs by 60%.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Evidence */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-indigo-600" />
                    Research Evidence
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">WHO Global Study (2020)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Comprehensive analysis of dental health in 195 countries over 30 years.
                      </p>
                      <div className="text-2xl font-bold text-indigo-600">60%</div>
                      <div className="text-sm text-gray-600">Global childhood tooth decay rate</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Cochrane Review (2019)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Meta-analysis of preventive dental interventions in children.
                      </p>
                      <div className="text-2xl font-bold text-green-600">80%</div>
                      <div className="text-sm text-gray-600">Cavity prevention with sealants</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">ADA Study (2021)</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Long-term outcomes of early dental intervention programs.
                      </p>
                      <div className="text-2xl font-bold text-purple-600">70%</div>
                      <div className="text-sm text-gray-600">Reduction in treatment needs</div>
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
                {/* SKIDS Dental Approach */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-blue-600" />
                    SKIDS Comprehensive Dental Care Approach
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Advanced Technology Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Digital Dental Imaging:</h5>
                          <p className="text-sm text-blue-800">
                            High-resolution intraoral cameras and digital X-rays provide detailed views
                            of tooth development and potential issues before they become visible.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">AI-Powered Caries Detection:</h5>
                          <p className="text-sm text-green-800">
                            Machine learning algorithms analyze dental images to detect early signs
                            of decay with 95% accuracy, enabling preventive intervention.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Laser Dentistry:</h5>
                          <p className="text-sm text-purple-800">
                            Pain-free laser treatments for cavity preparation, gum therapy,
                            and soft tissue procedures, reducing anxiety and healing time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Preventive Care Protocols</h4>
                      <div className="space-y-4">
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Fluoride Optimization:</h5>
                          <p className="text-sm text-orange-800">
                            Personalized fluoride treatments based on individual risk assessment
                            and age-appropriate application methods.
                          </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-bold text-indigo-900 mb-2">Dental Sealants:</h5>
                          <p className="text-sm text-indigo-800">
                            Protective sealants applied to newly erupted permanent molars,
                            preventing 80% of cavities in back teeth.
                          </p>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                          <h5 className="font-bold text-pink-900 mb-2">Family Education:</h5>
                          <p className="text-sm text-pink-800">
                            Comprehensive oral hygiene training for children and parents,
                            establishing lifelong healthy habits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Protocols */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-indigo-600" />
                    Age-Specific Treatment Protocols
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 1-3 Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• First dental visit by age 1</li>
                        <li>• Gentle examination and cleaning</li>
                        <li>• Parent education on oral hygiene</li>
                        <li>• Fluoride varnish application</li>
                        <li>• Teething guidance and support</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 4-8 Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Regular cleanings and exams</li>
                        <li>• Sealant application</li>
                        <li>• Orthodontic evaluation</li>
                        <li>• Cavity prevention focus</li>
                        <li>• Brushing and flossing training</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 9+ Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Comprehensive orthodontic care</li>
                        <li>• Advanced preventive treatments</li>
                        <li>• Sports dentistry and protection</li>
                        <li>• Adolescent oral health education</li>
                        <li>• Cosmetic dentistry options</li>
                      </ul>
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
                    SKIDS Dental Care Outcomes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">93%</div>
                      <div className="text-sm text-gray-600">Prevention Success Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">4,000+</div>
                      <div className="text-sm text-gray-600">Children Treated</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">4.8/5</div>
                      <div className="text-sm text-gray-600">Parent Satisfaction</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600">70%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                  </div>

                  {/* Detailed Outcomes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Clinical Outcomes</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">Cavity Prevention</span>
                          <span className="text-sm font-bold text-green-600">95% success</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">Early Orthodontic Intervention</span>
                          <span className="text-sm font-bold text-blue-600">85% success</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">Gum Disease Prevention</span>
                          <span className="text-sm font-bold text-purple-600">90% success</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">Dental Trauma Management</span>
                          <span className="text-sm font-bold text-orange-600">80% tooth preservation</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Long-term Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Lifelong Oral Health Habits</div>
                            <div className="text-sm text-gray-600">Children maintain excellent oral hygiene into adulthood</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Reduced Treatment Costs</div>
                            <div className="text-sm text-gray-600">70% reduction in future dental treatment needs</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Improved Self-Confidence</div>
                            <div className="text-sm text-gray-600">Healthy smiles boost social confidence and self-esteem</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Better Overall Health</div>
                            <div className="text-sm text-gray-600">Oral health directly impacts systemic health and nutrition</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Start Your Child's Dental Health Journey</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Join thousands of families who have chosen SKIDS for comprehensive,
                    preventive dental care that lasts a lifetime.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                      Schedule Consultation
                    </button>
                    <Link
                      href="/care-plans"
                      className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      View Care Plans
                    </Link>
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
                {/* SKIDS Dental Approach */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-blue-600" />
                    SKIDS Comprehensive Dental Care Approach
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Advanced Technology Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Digital Dental Imaging:</h5>
                          <p className="text-sm text-blue-800">
                            High-resolution intraoral cameras and digital X-rays provide detailed views
                            of tooth development and potential issues before they become visible.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">AI-Powered Caries Detection:</h5>
                          <p className="text-sm text-green-800">
                            Machine learning algorithms analyze dental images to detect early signs
                            of decay with 95% accuracy, enabling preventive intervention.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Laser Dentistry:</h5>
                          <p className="text-sm text-purple-800">
                            Pain-free laser treatments for cavity preparation, gum therapy,
                            and soft tissue procedures, reducing anxiety and healing time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Preventive Care Protocols</h4>
                      <div className="space-y-4">
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-bold text-orange-900 mb-2">Fluoride Optimization:</h5>
                          <p className="text-sm text-orange-800">
                            Personalized fluoride treatments based on individual risk assessment
                            and age-appropriate application methods.
                          </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-bold text-indigo-900 mb-2">Dental Sealants:</h5>
                          <p className="text-sm text-indigo-800">
                            Protective sealants applied to newly erupted permanent molars,
                            preventing 80% of cavities in back teeth.
                          </p>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                          <h5 className="font-bold text-pink-900 mb-2">Family Education:</h5>
                          <p className="text-sm text-pink-800">
                            Comprehensive oral hygiene training for children and parents,
                            establishing lifelong healthy habits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Protocols */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-indigo-600" />
                    Age-Specific Treatment Protocols
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 1-3 Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• First dental visit by age 1</li>
                        <li>• Gentle examination and cleaning</li>
                        <li>• Parent education on oral hygiene</li>
                        <li>• Fluoride varnish application</li>
                        <li>• Teething guidance and support</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 4-8 Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Regular cleanings and exams</li>
                        <li>• Sealant application</li>
                        <li>• Orthodontic evaluation</li>
                        <li>• Cavity prevention focus</li>
                        <li>• Brushing and flossing training</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Ages 9+ Years</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Comprehensive orthodontic care</li>
                        <li>• Advanced preventive treatments</li>
                        <li>• Sports dentistry and protection</li>
                        <li>• Adolescent oral health education</li>
                        <li>• Cosmetic dentistry options</li>
                      </ul>
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
                    SKIDS Dental Care Outcomes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">93%</div>
                      <div className="text-sm text-gray-600">Prevention Success Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">4,000+</div>
                      <div className="text-sm text-gray-600">Children Treated</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">4.8/5</div>
                      <div className="text-sm text-gray-600">Parent Satisfaction</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600">70%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Start Your Child's Dental Health Journey</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Join thousands of families who have chosen SKIDS for comprehensive,
                      preventive dental care that lasts a lifetime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                        Schedule Consultation
                      </button>
                      <Link
                        href="/care-plans"
                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                      >
                        View Care Plans
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
