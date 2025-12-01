'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Shield,
  Heart,
  Eye,
  Ear,
  Brain,
  Activity,
  Stethoscope,
  CheckCircle,
  Star,
  Clock,
  Users,
  Award,
  Zap,
  Target,
  ArrowRight,
  Info,
  Smartphone,
  Monitor,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/useAuth'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { RazorpayCheckout } from '@/components/payment/RazorpayCheckout'
import { useUserContext } from '@/contexts/UserContext'

interface ScreeningTest {
  id: string
  name: string
  description: string
  icon: any
  ageGroups: string[]
  frequency: string
  individualCost: number
  fdaApproved: boolean
  researchValidated: boolean
  aapRecommended?: boolean
  iapRecommended?: boolean
}

interface CarePlan {
  id: string
  name: string
  subtitle: string
  description: string
  icon: any
  color: string
  gradient: string
  monthlyPrice: number
  annualPrice: number
  savings: number
  features: string[]
  screenings: string[]
  benefits: {
    consultationDiscount: number
    vaccinationDiscount: number
    priorityBooking: boolean
    familySupport: boolean
  }
  valueProposition: string
  recommended?: boolean
}

export default function CarePlansPage() {
  const { userDetails, isAuthenticated } = useUserContext()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState('all')
  const [showCalendar, setShowCalendar] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState<any>(null)

  const handlePlanSelection = (plan: any) => {
    if (!isAuthenticated) {
      // Redirect to sign up if not authenticated
      window.location.href = '/sign-up'
      return
    }

    setPaymentPlan(plan)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    // Handle successful payment
    console.log('Payment successful:', { paymentId, orderId })
    setShowPayment(false)
    // Redirect to dashboard or success page
    window.location.href = '/dashboard'
  }

  const handlePaymentError = (error: any) => {
    // Handle payment error
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  const screeningTests: ScreeningTest[] = [
    {
      id: 'head-to-toe',
      name: 'Comprehensive Head-to-Toe Screening',
      description: 'Complete physical assessment covering growth, development, and overall health',
      icon: Stethoscope,
      ageGroups: ['0-2', '3-5', '6-12', '13+'],
      frequency: 'Quarterly',
      individualCost: 800,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true,
      iapRecommended: true
    },
    {
      id: 'behavioral-screening',
      name: 'Behavioral & Mental Health Screening',
      description: 'Assessment of emotional well-being, social skills, and behavioral patterns',
      icon: Brain,
      ageGroups: ['3-5', '6-12', '13+'],
      frequency: 'Quarterly',
      individualCost: 600,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true
    },
    {
      id: 'internet-addiction',
      name: 'Digital Wellness & Internet Addiction Screening',
      description: 'Critical assessment of screen time impact and digital behavior patterns',
      icon: Smartphone,
      ageGroups: ['6-12', '13+'],
      frequency: 'Bi-annual',
      individualCost: 500,
      fdaApproved: false,
      researchValidated: true,
      aapRecommended: true
    },
    {
      id: 'vision-screening',
      name: 'Advanced Vision & Amblyopia Screening',
      description: 'Early detection of vision problems and lazy eye using FDA-approved devices',
      icon: Eye,
      ageGroups: ['0-2', '3-5', '6-12', '13+'],
      frequency: 'Annual',
      individualCost: 700,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true,
      iapRecommended: true
    },
    {
      id: 'hearing-screening',
      name: 'Comprehensive Hearing Assessment',
      description: 'Detailed hearing evaluation using research-validated audiometry',
      icon: Ear,
      ageGroups: ['0-2', '3-5', '6-12', '13+'],
      frequency: 'Annual',
      individualCost: 650,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true,
      iapRecommended: true
    },
    {
      id: 'hemoglobin',
      name: 'Non-Invasive Hemoglobin Testing',
      description: 'Pain-free anemia screening using advanced spectroscopy technology',
      icon: Heart,
      ageGroups: ['0-2', '3-5', '6-12', '13+'],
      frequency: 'Bi-annual',
      individualCost: 400,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true
    },
    {
      id: 'specialized-behavioral',
      name: 'Specialized Behavioral Assessments',
      description: 'In-depth evaluation for ADHD, autism spectrum, and learning differences',
      icon: Target,
      ageGroups: ['3-5', '6-12', '13+'],
      frequency: 'As needed',
      individualCost: 1200,
      fdaApproved: true,
      researchValidated: true,
      aapRecommended: true
    }
  ]

  const carePlans: CarePlan[] = [
    {
      id: 'essential',
      name: 'Essential Care',
      subtitle: 'Foundation for Healthy Growth',
      description: 'Comprehensive quarterly screenings with vaccination support for optimal child development',
      icon: Shield,
      color: '#10B981',
      gradient: 'from-emerald-400 to-green-600',
      monthlyPrice: 333,
      annualPrice: 3999,
      savings: 997,
      features: [
        'Quarterly head-to-toe screening',
        'SKIDS Clinic Chatter (basic behavioral assessment)',
        'Digital wellness & internet addiction screening',
        'FREE access to Kurzgesagt & TED-Ed educational content',
        'Basic educational newsletter with learning activities',
        'Growth & development tracking',
        'Vaccination schedule management',
        'Pediatric consultation access'
      ],
      screenings: ['head-to-toe', 'behavioral-screening', 'internet-addiction'],
      benefits: {
        consultationDiscount: 20,
        vaccinationDiscount: 10,
        priorityBooking: true,
        familySupport: true
      },
      valueProposition: 'Ensures your child\'s foundational health and catches potential issues early when they\'re most treatable'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Care',
      subtitle: 'Complete Health & Development Protection',
      description: 'All essential screenings plus specialized vision, hearing, and hemoglobin testing for complete peace of mind',
      icon: Star,
      color: '#3B82F6',
      gradient: 'from-blue-400 to-indigo-600',
      monthlyPrice: 583,
      annualPrice: 6999,
      savings: 997,
      features: [
        'Everything in Essential Care',
        'Limited specialized behavioral assessments (ADHD, Autism, Anxiety)',
        'SUBSIDIZED premium educational content (BrainPOP, Khan Academy)',
        'Weekly health insights newsletter with curated learning',
        'Annual vision & amblyopia screening',
        'Comprehensive hearing assessment',
        'Non-invasive hemoglobin testing',
        'Priority emergency consultations',
        'Family health education sessions'
      ],
      screenings: ['head-to-toe', 'behavioral-screening', 'internet-addiction', 'vision-screening', 'hearing-screening', 'hemoglobin'],
      benefits: {
        consultationDiscount: 25,
        vaccinationDiscount: 15,
        priorityBooking: true,
        familySupport: true
      },
      valueProposition: 'Provides complete health protection with early detection of vision, hearing, and developmental concerns',
      recommended: true
    },
    {
      id: 'guardian',
      name: 'Guardian Care',
      subtitle: 'Advanced Health Optimization',
      description: 'The ultimate in pediatric care with all screenings, specialized assessments, and personalized health optimization',
      icon: Award,
      color: '#8B5CF6',
      gradient: 'from-purple-400 to-violet-600',
      monthlyPrice: 833,
      annualPrice: 9999,
      savings: 996,
      features: [
        'Everything in Comprehensive Care',
        'Unlimited specialized behavioral assessments (all types)',
        'FULL PREMIUM educational platform access (all content)',
        'Personalized learning recommendations & progress tracking',
        'Daily health & development insights newsletter',
        'Exclusive educational workshops & webinars',
        'Learning disabilities & behavioral disorders evaluation',
        'Personalized development planning',
        'Monthly health optimization consultations',
        'Advanced genetic counseling',
        '24/7 pediatric helpline access',
        'Sibling screening discounts'
      ],
      screenings: ['head-to-toe', 'behavioral-screening', 'internet-addiction', 'vision-screening', 'hearing-screening', 'hemoglobin', 'specialized-behavioral'],
      benefits: {
        consultationDiscount: 30,
        vaccinationDiscount: 20,
        priorityBooking: true,
        familySupport: true
      },
      valueProposition: 'Maximizes your child\'s potential with personalized care and unlimited access to specialized assessments'
    }
  ]

  const calculateIndividualCost = (screeningIds: string[]) => {
    return screeningIds.reduce((total, id) => {
      const screening = screeningTests.find(s => s.id === id)
      return total + (screening?.individualCost || 0)
    }, 0)
  }

  const getAgeAppropriateScreenings = (age: string) => {
    if (age === 'all') return screeningTests
    return screeningTests.filter(test => test.ageGroups.includes(age))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
              Comprehensive Child Care Plans
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              Proactive health screening using FDA/CE approved, research-validated non-invasive devices. 
              Following AAP & IAP recommendations for optimal child development and early intervention.
            </motion.p>
            
            {/* Key Differentiators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                { icon: Shield, text: 'FDA/CE Approved Devices', color: 'text-green-600' },
                { icon: Award, text: 'Research Validated', color: 'text-blue-600' },
                { icon: Heart, text: 'Non-Invasive Testing', color: 'text-red-600' },
                { icon: Target, text: 'AAP/IAP Recommended', color: 'text-purple-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Digital Wellness Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-12"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Supporting Healthy Digital Development
                </h3>
                <p className="text-gray-700 mb-4">
                  As children grow up in an increasingly digital world, understanding their relationship with technology becomes essential.
                  Our gentle digital wellness assessment helps families create balanced, healthy screen time habits that support
                  optimal development and well-being.
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    <span>Balanced screen time guidance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-blue-500" />
                    <span>Family-friendly strategies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Age-appropriate recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Age Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Ages', icon: Users },
                  { id: '0-2', label: '0-2 years', icon: Heart },
                  { id: '3-5', label: '3-5 years', icon: Star },
                  { id: '6-12', label: '6-12 years', icon: Brain },
                  { id: '13+', label: '13+ years', icon: Activity }
                ].map((age) => {
                  const Icon = age.icon
                  return (
                    <button
                      key={age.id}
                      onClick={() => setSelectedAge(age.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                        selectedAge === age.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{age.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Care Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {carePlans.map((plan, index) => {
              const Icon = plan.icon
              const individualCost = calculateIndividualCost(plan.screenings)
              const annualSavings = individualCost * 4 - plan.annualPrice // Assuming quarterly screenings

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`relative bg-white rounded-3xl shadow-xl border-2 overflow-hidden ${
                    plan.recommended ? 'border-blue-500 scale-105' : 'border-gray-200'
                  } ${selectedPlan === plan.id ? 'ring-4 ring-blue-200' : ''}`}
                  onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`bg-gradient-to-r ${plan.gradient} p-6 text-white`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm opacity-90">{plan.subtitle}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">₹{plan.monthlyPrice}</span>
                        <span className="text-sm opacity-75">/month</span>
                      </div>
                      <div className="text-sm opacity-90">
                        ₹{plan.annualPrice}/year (Save ₹{plan.savings})
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    {/* Value Proposition */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Value for Your Child</h4>
                          <p className="text-sm text-gray-700">{plan.valueProposition}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Comparison */}
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Individual test costs:</span>
                        <span className="font-semibold text-gray-900">₹{individualCost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Annual plan cost:</span>
                        <span className="font-semibold text-gray-900">₹{plan.annualPrice.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">Your savings:</span>
                          <span className="font-bold text-green-700">₹{annualSavings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Benefits */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Member Benefits</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{plan.benefits.consultationDiscount}% off consultations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{plan.benefits.vaccinationDiscount}% off vaccinations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Priority booking</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Family support</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className={`w-full bg-gradient-to-r ${plan.gradient} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}>
                        Choose {plan.name}
                      </button>
                      <Link
                        href="/behavioral"
                        className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all"
                      >
                        View Behavioral Assessments
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Individual Screening Tests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Screening Tests</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                All our tests use FDA/CE approved, research-validated non-invasive devices following AAP and IAP recommendations.
                Choose individual tests or save with our comprehensive care plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAgeAppropriateScreenings(selectedAge).map((test, index) => {
                const Icon = test.icon
                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{test.name}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium text-gray-900">{test.frequency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Age Groups:</span>
                        <span className="font-medium text-gray-900">{test.ageGroups.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Individual Cost:</span>
                        <span className="text-xl font-bold text-gray-900">₹{test.individualCost}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {test.fdaApproved && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          FDA Approved
                        </span>
                      )}
                      {test.researchValidated && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          Research Validated
                        </span>
                      )}
                      {test.aapRecommended && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          AAP Recommended
                        </span>
                      )}
                      {test.iapRecommended && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                          IAP Recommended
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                      Book Individual Test
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Screening Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Child's Health Calendar</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                Visualize your child's comprehensive care journey with our intuitive calendar showing recommended
                screenings, vaccinations, and check-ups based on age and development milestones.
              </p>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
              >
                <Calendar className="w-5 h-5" />
                <span>{showCalendar ? 'Hide' : 'View'} Health Calendar</span>
              </button>
            </div>

            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
                      <div key={quarter} className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                          {quarter} - {['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'][index]}
                        </h3>

                        <div className="space-y-3">
                          {/* Quarterly Screenings */}
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Stethoscope className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-gray-900">Comprehensive Screening</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Head-to-toe assessment</li>
                              <li>• Behavioral screening</li>
                              <li>• Growth tracking</li>
                            </ul>
                          </div>

                          {/* Vaccinations */}
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900">Vaccinations</span>
                            </div>
                            <p className="text-sm text-gray-600">Age-appropriate immunizations</p>
                          </div>

                          {/* Special Screenings */}
                          {(index === 0 || index === 2) && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Eye className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-gray-900">Special Screenings</span>
                              </div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {index === 0 && <li>• Vision screening</li>}
                                {index === 0 && <li>• Hearing assessment</li>}
                                {index === 2 && <li>• Hemoglobin testing</li>}
                                {index === 2 && <li>• Digital wellness check</li>}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Legend */}
                  <div className="mt-8 bg-blue-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Calendar Legend</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Quarterly comprehensive screenings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Vaccination schedule</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Specialized assessments</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Child's Health Journey?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of families who trust SKIDS for comprehensive, proactive child healthcare
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Schedule Consultation
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
