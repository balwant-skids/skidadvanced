'use client'

import { motion } from 'framer-motion'
import { Brain, Heart, BarChart3, Users, Sparkles, Shield, Zap, Globe } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Health Assistant',
    description: 'Kurzgesagt-inspired chatbot with animated expressions providing 24/7 health guidance',
    color: 'brain',
    gradient: 'from-brain-400 to-brain-600'
  },
  {
    icon: Heart,
    title: 'Organ-Specific Testing',
    description: 'Interactive testing modules with character personalities and engaging visualizations',
    color: 'cardiovascular',
    gradient: 'from-cardiovascular-400 to-cardiovascular-600'
  },
  {
    icon: BarChart3,
    title: 'Beautiful Analytics',
    description: 'D3.js powered health analytics with scientific accuracy and visual storytelling',
    color: 'respiratory',
    gradient: 'from-respiratory-400 to-respiratory-600'
  },
  {
    icon: Users,
    title: 'Multi-User Dashboards',
    description: 'Synchronized care coordination between parents, doctors, and healthcare managers',
    color: 'digestive',
    gradient: 'from-digestive-400 to-digestive-600'
  },
  {
    icon: Sparkles,
    title: 'Behavioral Assessment',
    description: 'Social interaction scenarios with character demonstrations and motor skill tracking',
    color: 'sensory',
    gradient: 'from-sensory-400 to-sensory-600'
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'End-to-end encryption with pediatric specialist verified scientific accuracy',
    color: 'skin',
    gradient: 'from-skin-400 to-skin-600'
  },
  {
    icon: Zap,
    title: 'Real-time Monitoring',
    description: 'Live health data with predictive analytics and preventive care recommendations',
    color: 'brain',
    gradient: 'from-brain-400 to-cardiovascular-500'
  },
  {
    icon: Globe,
    title: 'Campaign Management',
    description: 'Visual package builder with target audience selection and marketing asset generation',
    color: 'respiratory',
    gradient: 'from-respiratory-400 to-digestive-500'
  }
]

export function FeatureShowcase() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Comprehensive Health Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature designed with Kurzgesagt-inspired visualizations to make 
            health monitoring both educational and delightful for children and parents
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Floating particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-4 origin-left`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Child Healthcare?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join healthcare providers worldwide who are revolutionizing pediatric care 
              with engaging, scientifically-accurate health monitoring
            </p>
            <button className="bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Explore All Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
