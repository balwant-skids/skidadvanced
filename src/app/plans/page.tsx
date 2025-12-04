'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Star,
  Shield,
  Heart,
  Brain,
  Eye,
  Ear,
  Apple,
  Users,
  Smartphone,
  TrendingUp,
  Stethoscope,
  Syringe,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'

interface Plan {
  id: string
  name: string
  price: number
  popular?: boolean
  description: string
  features: {
    category: string
    icon: React.ComponentType<any>
    items: {
      name: string
      essential: string
      comprehensive: string
      guardian: string
    }[]
  }[]
  cta: string
  color: string
}

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual')

  const plans: Plan[] = [
    {
      id: 'essential',
      name: 'Essential',
      price: 3999,
      description: 'Perfect for getting started with comprehensive health screening',
      color: 'blue',
      cta: 'Get Started',
      features: []
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive',
      price: 6999,
      popular: true,
      description: 'Most popular choice for complete child health management',
      color: 'purple',
      cta: 'Start Free Trial',
      features: []
    },
    {
      id: 'guardian',
      name: 'Guardian',
      price: 9999,
      description: 'Ultimate protection with maximum screenings and consultations',
      color: 'green',
      cta: 'Get Premium',
      features: []
    }
  ]

  const features = [
    {
      category: 'Health Screening',
      icon: Stethoscope,
      description: '72 parameters checked',
      items: [
        {
          name: 'Comprehensive Health Screening',
          essential: '4x per year',
          comprehensive: '4x per year',
          guardian: '4x per year'
        },
        {
          name: 'Parameters Checked',
          essential: '72 parameters',
          comprehensive: '72 parameters',
          guardian: '72 parameters'
        }
      ]
    },
    {
      category: 'Behavioral Assessment',
      icon: Brain,
      description: 'Professional behavioral evaluation',
      items: [
        {
          name: 'Behavioral Assessment',
          essential: '1x per year',
          comprehensive: '1x per year',
          guardian: '2x per year'
        },
        {
          name: 'Assessment Type',
          essential: '4 conditions',
          comprehensive: 'Complete assessment',
          guardian: 'Complete assessment'
        }
      ]
    },
    {
      category: 'Eye-Tracking Autism Screening',
      icon: Eye,
      description: 'FDA-approved eye-tracking technology',
      items: [
        {
          name: 'FDA Eye-Tracking Screening',
          essential: 'Not included',
          comprehensive: '1x per year',
          guardian: '1x per year'
        },
        {
          name: 'Method',
          essential: '—',
          comprehensive: 'Child plays a game',
          guardian: 'Child plays a game'
        },
        {
          name: 'Report',
          essential: '—',
          comprehensive: 'Comprehensive FDA report',
          guardian: 'Comprehensive FDA report'
        }
      ]
    },
    {
      category: 'Hearing Assessment',
      icon: Ear,
      description: 'FDA CE certified hearing evaluation',
      items: [
        {
          name: 'Hearing Assessment',
          essential: 'Not included',
          comprehensive: 'Not included',
          guardian: '1x per year'
        },
        {
          name: 'Method',
          essential: '—',
          comprehensive: '—',
          guardian: 'Child plays a game'
        },
        {
          name: 'Certification',
          essential: '—',
          comprehensive: '—',
          guardian: 'FDA CE certified'
        }
      ]
    },
    {
      category: 'Nutrition Analysis',
      icon: Apple,
      description: 'Pediatrician-led, AI-assisted personalized program',
      items: [
        {
          name: 'Personalized Nutrition Program',
          essential: '1x per year',
          comprehensive: '2x per year',
          guardian: '4x per year'
        },
        {
          name: 'Led By',
          essential: 'Pediatrician + AI',
          comprehensive: 'Pediatrician + AI',
          guardian: 'Pediatrician + AI'
        },
        {
          name: 'Quality',
          essential: 'Evidence-based (not YouTube)',
          comprehensive: 'Evidence-based (not YouTube)',
          guardian: 'Evidence-based (not YouTube)'
        }
      ]
    },
    {
      category: 'Healthy Habits Workshop',
      icon: Heart,
      description: 'SKIDS unique 6-step process',
      items: [
        {
          name: 'Workshop Access',
          essential: 'SKIDS 6-step process',
          comprehensive: 'SKIDS 6-step process',
          guardian: 'SKIDS 6-step process'
        },
        {
          name: 'Consultation',
          essential: 'Not included',
          comprehensive: 'Included',
          guardian: 'Included'
        }
      ]
    },
    {
      category: 'Digital Parenting Support',
      icon: Smartphone,
      description: 'Expert guidance modules',
      items: [
        {
          name: 'Support Modules',
          essential: '1x access',
          comprehensive: '1x access',
          guardian: '4x access'
        },
        {
          name: 'Consultation',
          essential: 'Not included',
          comprehensive: 'Included',
          guardian: 'Included'
        }
      ]
    },
    {
      category: 'Adolescent Support',
      icon: Users,
      description: 'Specialized teen support',
      items: [
        {
          name: 'Support Sessions',
          essential: '1x access',
          comprehensive: '1x access',
          guardian: '4x access'
        },
        {
          name: 'Consultation',
          essential: 'Not included',
          comprehensive: 'Included',
          guardian: 'Included'
        }
      ]
    },
    {
      category: 'Discounts & Benefits',
      icon: TrendingUp,
      description: 'Save on consultations and vaccines',
      items: [
        {
          name: 'Consultation Discount',
          essential: '10% off',
          comprehensive: '15% off',
          guardian: '20% off'
        },
        {
          name: 'Vaccine Discount',
          essential: '5% off',
          comprehensive: '10% off',
          guardian: '15% off'
        }
      ]
    }
  ]

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'gradient') => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-500',
        gradient: 'from-blue-500 to-cyan-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-500',
        gradient: 'from-purple-500 to-pink-600'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-500',
        gradient: 'from-green-500 to-emerald-600'
      }
    }
    return colors[color as keyof typeof colors][type]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive Child Health Plans</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
            >
              Choose Your Child's
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Health Protection Plan
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Evidence-based, pediatrician-led programs with FDA-approved screenings.
              Not YouTube misinformation.
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-600 ml-2">/year</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ₹{Math.round(plan.price / 12).toLocaleString()}/month
                  </p>
                </div>

                <Link
                  href="/demo/capture-lead"
                  className={`block w-full text-center bg-gradient-to-r ${getColorClasses(
                    plan.color,
                    'gradient'
                  )} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-6`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Key Features:</p>
                  {plan.id === 'essential' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">4x Health Screening (72 parameters)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">1x Behavioral Assessment</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">1x Nutrition Analysis</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">10% Consult & 5% Vaccine Discount</span>
                      </div>
                    </>
                  )}
                  {plan.id === 'comprehensive' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Everything in Essential</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">FDA Eye-Tracking Autism Screening</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">2x Nutrition Analysis</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Consultations Included</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">15% Consult & 10% Vaccine Discount</span>
                      </div>
                    </>
                  )}
                  {plan.id === 'guardian' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Everything in Comprehensive</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">FDA CE Hearing Assessment</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">2x Behavioral Assessment</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">4x Nutrition + Digital Parenting</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">20% Consult & 15% Vaccine Discount</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Feature Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Feature Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-blue-600">Essential</th>
                    <th className="text-center py-4 px-4 font-semibold text-purple-600">
                      Comprehensive
                      <div className="text-xs font-normal text-purple-500">Most Popular</div>
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-green-600">Guardian</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <category.icon className="w-5 h-5 text-gray-700" />
                            <span className="font-semibold text-gray-900">{category.category}</span>
                            <span className="text-sm text-gray-600">— {category.description}</span>
                          </div>
                        </td>
                      </tr>
                      {category.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-700">{item.name}</td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900">
                            {item.essential === 'Not included' || item.essential === '—' ? (
                              <span className="text-gray-400">—</span>
                            ) : (
                              item.essential
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900 bg-purple-50">
                            {item.comprehensive === 'Not included' || item.comprehensive === '—' ? (
                              <span className="text-gray-400">—</span>
                            ) : (
                              item.comprehensive
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-900">
                            {item.guardian === 'Not included' || item.guardian === '—' ? (
                              <span className="text-gray-400">—</span>
                            ) : (
                              item.guardian
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of parents who trust SKIDS Advanced for their child's health
            </p>
            <Link
              href="/demo/capture-lead"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <span>Contact Us Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
