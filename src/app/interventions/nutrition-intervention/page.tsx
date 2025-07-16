'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Utensils,
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
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function NutritionInterventionPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Utensils },
    { id: 'science', label: 'The Science', icon: Brain },
    { id: 'intervention', label: 'Our Approach', icon: Target },
    { id: 'outcomes', label: 'Results', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Utensils className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              AI-Powered Nutrition Optimization
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              Personalized nutrition analysis and meal planning powered by advanced AI algorithms 
              to optimize your child's growth, development, and overall health through evidence-based dietary interventions.
            </motion.p>

            {/* NutreeAI Integration Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-emerald-900 mb-1">
                    Powered by NutreeAI Technology
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Advanced AI platform for personalized nutrition analysis and meal planning
                  </p>
                </div>
                <a
                  href="https://nutreeai.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
                        ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
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
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Brain className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Analysis</h3>
                    <p className="text-gray-600">
                      Advanced machine learning algorithms analyze nutritional needs based on age, 
                      growth patterns, activity levels, and health conditions.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Plans</h3>
                    <p className="text-gray-600">
                      Customized meal plans and nutritional recommendations tailored to your 
                      child's specific dietary needs and preferences.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Tracking</h3>
                    <p className="text-gray-600">
                      Continuous monitoring of growth metrics and nutritional status with 
                      real-time adjustments to optimize development.
                    </p>
                  </div>
                </div>

                {/* Critical Nutrition Periods */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Critical Nutrition Windows for Optimal Development
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-emerald-900 mb-3">0-2 Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Rapid brain development requires optimal nutrition for cognitive foundation.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Brain grows to 80% of adult size</li>
                        <li>• Critical for neural pathway formation</li>
                        <li>• Establishes metabolic programming</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-emerald-900 mb-3">3-8 Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Taste preferences and eating habits are established for life.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Taste preference formation</li>
                        <li>• Eating behavior patterns</li>
                        <li>• Growth velocity optimization</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-bold text-emerald-900 mb-3">9-18 Years</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Adolescent growth spurts require increased nutritional support.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Peak bone mass development</li>
                        <li>• Hormonal changes support</li>
                        <li>• Academic performance optimization</li>
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
                    <Brain className="w-6 h-6 mr-3 text-emerald-600" />
                    Scientific Foundation of Pediatric Nutrition
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Nutritional Neuroscience</h4>
                      <div className="space-y-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h5 className="font-bold text-emerald-900 mb-2">Brain Development Impact:</h5>
                          <p className="text-sm text-emerald-800">
                            Proper nutrition during critical periods affects cognitive development, 
                            with deficiencies potentially causing irreversible changes to brain structure.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Micronutrient Importance:</h5>
                          <p className="text-sm text-green-800">
                            Iron, zinc, and B-vitamins are crucial for neurotransmitter synthesis 
                            and cognitive function, with deficiencies linked to learning difficulties.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Growth Optimization</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Protein Requirements:</h5>
                          <p className="text-sm text-blue-800">
                            Children require 2-3x more protein per kg body weight than adults 
                            for optimal growth and development.
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h5 className="font-bold text-purple-900 mb-2">Metabolic Programming:</h5>
                          <p className="text-sm text-purple-800">
                            Early nutrition patterns establish metabolic pathways that influence 
                            lifelong health outcomes and disease risk.
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
                {/* NutreeAI Platform Integration */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-3 text-emerald-600" />
                    NutreeAI: Advanced Nutrition Intelligence Platform
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">AI-Powered Features</h4>
                      <div className="space-y-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h5 className="font-bold text-emerald-900 mb-2">Smart Meal Planning:</h5>
                          <p className="text-sm text-emerald-800">
                            AI algorithms create personalized meal plans based on nutritional needs, 
                            preferences, allergies, and cultural dietary patterns.
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-bold text-green-900 mb-2">Nutritional Analysis:</h5>
                          <p className="text-sm text-green-800">
                            Real-time analysis of macro and micronutrient intake with 
                            recommendations for optimization and deficiency prevention.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-bold text-blue-900 mb-2">Growth Prediction:</h5>
                          <p className="text-sm text-blue-800">
                            Predictive modeling to forecast growth trajectories and adjust 
                            nutritional interventions for optimal outcomes.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Platform Access</h4>
                      <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <h5 className="font-bold text-emerald-900 mb-3">Try NutreeAI Platform</h5>
                        <p className="text-sm text-emerald-800 mb-4">
                          Experience the power of AI-driven nutrition analysis and personalized meal planning.
                        </p>
                        <a
                          href="https://nutreeai.netlify.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
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
                    SKIDS Nutrition Optimization Outcomes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">89%</div>
                      <div className="text-sm text-gray-600">Growth Improvement</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">5,000+</div>
                      <div className="text-sm text-gray-600">Children Helped</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">4.7/5</div>
                      <div className="text-sm text-gray-600">Parent Satisfaction</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">25%</div>
                      <div className="text-sm text-gray-600">Cognitive Improvement</div>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Optimize Your Child's Nutrition with AI</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Experience the power of personalized nutrition planning with our advanced 
                      AI platform and expert pediatric nutritionist guidance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="https://nutreeai.netlify.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors text-center inline-flex items-center justify-center space-x-2"
                      >
                        <span>Try NutreeAI Platform</span>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <Link
                        href="/care-plans"
                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-colors text-center"
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
