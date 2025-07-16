'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  MessageCircle,
  Target,
  Shield,
  Star,
  Lock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Clock,
  Award,
  AlertTriangle,
  Heart,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

interface UserSubscription {
  plan: 'essential' | 'comprehensive' | 'premium' | null
  hasAccess: {
    basicChatter: boolean
    limitedSpecialized: boolean
    unlimitedSpecialized: boolean
  }
}

interface BehavioralAssessment {
  id: string
  name: string
  description: string
  type: 'basic' | 'specialized'
  icon: any
  duration: string
  ageRange: string
  requiredPlan: 'essential' | 'comprehensive' | 'premium'
  url?: string
  isExternal?: boolean
  features: string[]
}

export default function BehavioralAssessmentPage() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription>({
    plan: 'comprehensive', // Mock subscription - in real app, this would come from auth/subscription service
    hasAccess: {
      basicChatter: true,
      limitedSpecialized: true,
      unlimitedSpecialized: false
    }
  })
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const behavioralAssessments: BehavioralAssessment[] = [
    {
      id: 'skids-chatter',
      name: 'SKIDS Clinic Chatter',
      description: 'Gentle, conversation-based assessment that helps understand your child\'s emotional and behavioral development in a comfortable, engaging way',
      type: 'basic',
      icon: MessageCircle,
      duration: '15-20 min',
      ageRange: '3+ years',
      requiredPlan: 'essential',
      url: 'https://skids-clinic-chatter.lovable.app',
      isExternal: true,
      features: [
        'Comfortable conversation-based approach',
        'Child-friendly interactive experience',
        'Gentle insights into development patterns',
        'Supportive preliminary guidance',
        'Seamless quarterly health integration',
        'Ongoing development tracking'
      ]
    },
    {
      id: 'adhd-assessment',
      name: 'ADHD Comprehensive Assessment',
      description: 'Detailed evaluation for Attention Deficit Hyperactivity Disorder using validated clinical tools',
      type: 'specialized',
      icon: Target,
      duration: '45-60 min',
      ageRange: '4+ years',
      requiredPlan: 'comprehensive',
      url: 'https://www.skids.clinic/mental-health-assessments',
      isExternal: true,
      features: [
        'Vanderbilt Assessment Scales',
        'Continuous Performance Tests',
        'Parent and teacher questionnaires',
        'Clinical interview protocols',
        'Detailed diagnostic report',
        'Treatment recommendations'
      ]
    },
    {
      id: 'autism-screening',
      name: 'Autism Spectrum Screening',
      description: 'Comprehensive autism spectrum disorder evaluation using gold-standard assessment tools',
      type: 'specialized',
      icon: Brain,
      duration: '60-90 min',
      ageRange: '18 months+',
      requiredPlan: 'comprehensive',
      url: 'https://www.skids.clinic/mental-health-assessments',
      isExternal: true,
      features: [
        'ADOS-2 assessment protocol',
        'Social communication evaluation',
        'Repetitive behavior analysis',
        'Sensory processing assessment',
        'Developmental history review',
        'Family guidance and resources'
      ]
    },
    {
      id: 'anxiety-depression',
      name: 'Anxiety & Depression Screening',
      description: 'Comprehensive mental health evaluation for anxiety disorders and depression in children',
      type: 'specialized',
      icon: Heart,
      duration: '30-45 min',
      ageRange: '6+ years',
      requiredPlan: 'comprehensive',
      url: 'https://www.skids.clinic/mental-health-assessments',
      isExternal: true,
      features: [
        'GAD-7 and PHQ-9 assessments',
        'Child-specific anxiety scales',
        'Mood disorder evaluation',
        'Risk assessment protocols',
        'Coping strategies assessment',
        'Therapeutic recommendations'
      ]
    },
    {
      id: 'learning-disabilities',
      name: 'Learning Disabilities Assessment',
      description: 'Comprehensive evaluation for learning differences and academic challenges',
      type: 'specialized',
      icon: Award,
      duration: '90-120 min',
      ageRange: '5+ years',
      requiredPlan: 'premium',
      url: 'https://www.skids.clinic/mental-health-assessments',
      isExternal: true,
      features: [
        'Cognitive ability testing',
        'Academic achievement assessment',
        'Processing speed evaluation',
        'Memory and attention testing',
        'Educational recommendations',
        'IEP/504 plan guidance'
      ]
    },
    {
      id: 'behavioral-disorders',
      name: 'Behavioral Disorders Evaluation',
      description: 'Assessment for oppositional defiant disorder, conduct disorder, and other behavioral challenges',
      type: 'specialized',
      icon: Shield,
      duration: '60-75 min',
      ageRange: '4+ years',
      requiredPlan: 'premium',
      url: 'https://www.skids.clinic/mental-health-assessments',
      isExternal: true,
      features: [
        'Behavioral rating scales',
        'Functional behavior analysis',
        'Environmental assessment',
        'Family dynamics evaluation',
        'Intervention planning',
        'Behavior modification strategies'
      ]
    }
  ]

  const getAccessibleAssessments = () => {
    return behavioralAssessments.filter(assessment => {
      if (assessment.type === 'basic') return userSubscription.hasAccess.basicChatter
      if (assessment.requiredPlan === 'comprehensive') return userSubscription.hasAccess.limitedSpecialized
      if (assessment.requiredPlan === 'premium') return userSubscription.hasAccess.unlimitedSpecialized
      return false
    })
  }

  const getLockedAssessments = () => {
    return behavioralAssessments.filter(assessment => {
      if (assessment.type === 'basic') return !userSubscription.hasAccess.basicChatter
      if (assessment.requiredPlan === 'comprehensive') return !userSubscription.hasAccess.limitedSpecialized
      if (assessment.requiredPlan === 'premium') return !userSubscription.hasAccess.unlimitedSpecialized
      return true
    })
  }

  const handleAssessmentAccess = (assessment: BehavioralAssessment) => {
    const hasAccess = getAccessibleAssessments().some(a => a.id === assessment.id)
    
    if (hasAccess) {
      if (assessment.isExternal && assessment.url) {
        window.open(assessment.url, '_blank')
      } else {
        // Handle internal assessment routing
        setSelectedAssessment(assessment.id)
      }
    } else {
      setShowUpgradeModal(true)
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'essential': return 'Essential Care'
      case 'comprehensive': return 'Comprehensive Care'
      case 'premium': return 'Premium Care'
      default: return 'No Plan'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'essential': return 'from-emerald-400 to-green-600'
      case 'comprehensive': return 'from-blue-400 to-indigo-600'
      case 'premium': return 'from-purple-400 to-violet-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Behavioral Assessment Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              Supporting your child's emotional and behavioral well-being through gentle, evidence-based assessments.
              Our child-friendly approach makes understanding your child's development both insightful and comfortable.
            </motion.p>
          </div>

          {/* Current Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(userSubscription.plan || '')} rounded-full flex items-center justify-center`}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Current Plan: {getPlanName(userSubscription.plan || '')}
                  </h3>
                  <p className="text-gray-600">
                    {userSubscription.hasAccess.unlimitedSpecialized 
                      ? 'Unlimited access to all behavioral assessments'
                      : userSubscription.hasAccess.limitedSpecialized
                      ? 'Access to basic chatter + limited specialized assessments'
                      : 'Access to basic chatter assessment only'
                    }
                  </p>
                </div>
              </div>
              <Link
                href="/care-plans"
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Upgrade Plan
              </Link>
            </div>
          </motion.div>

          {/* Available Assessments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Assessments</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {getAccessibleAssessments().map((assessment, index) => {
                const Icon = assessment.icon
                return (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleAssessmentAccess(assessment)}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        assessment.type === 'basic' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          assessment.type === 'basic' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-gray-900">{assessment.name}</h3>
                          {assessment.isExternal && (
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            assessment.type === 'basic'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {assessment.type === 'basic' ? 'Basic' : 'Specialized'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{assessment.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{assessment.ageRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {assessment.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {assessment.features.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{assessment.features.length - 3} more features
                        </div>
                      )}
                    </div>

                    <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      assessment.type === 'basic'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                    }`}>
                      {assessment.type === 'basic' ? 'Start Basic Assessment' : 'Access Specialized Test'}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Locked Assessments */}
          {getLockedAssessments().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Premium Assessments</h2>
              <p className="text-center text-gray-600 mb-8">
                Upgrade your plan to access these specialized behavioral assessments
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {getLockedAssessments().map((assessment, index) => {
                  const Icon = assessment.icon
                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 relative cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-gray-500">{assessment.name}</h3>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                              {getPlanName(assessment.requiredPlan)} Required
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mb-3">{assessment.description}</p>

                          <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{assessment.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{assessment.ageRange}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed">
                        Upgrade to Access
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Assessment Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Assessment Workflow</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">1. Basic Screening</h3>
                <p className="text-gray-600 text-sm">
                  Start with SKIDS Clinic Chatter for conversational assessment and initial screening
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">2. Specialized Testing</h3>
                <p className="text-gray-600 text-sm">
                  Access detailed assessments for ADHD, autism, anxiety, and learning disabilities
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">3. Action Plan</h3>
                <p className="text-gray-600 text-sm">
                  Receive detailed reports with recommendations and next steps for your child's care
                </p>
              </div>
            </div>
          </motion.div>

          {/* Upgrade Modal */}
          <AnimatePresence>
            {showUpgradeModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowUpgradeModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Upgrade Required</h3>
                    <p className="text-gray-600 mb-6">
                      This specialized assessment requires a higher subscription plan.
                      Upgrade to access comprehensive behavioral evaluations.
                    </p>
                    <div className="space-y-3">
                      <Link
                        href="/care-plans"
                        className="block w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        View Care Plans
                      </Link>
                      <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
