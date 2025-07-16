'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-brain-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-cardiovascular-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-respiratory-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-brain-200 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-brain-500" />
            <span className="text-brain-700 font-medium">
              Kurzgesagt-Inspired Health Visualizations
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight"
          >
            Every Child's
            <br />
            <span className="bg-gradient-to-r from-brain-600 via-cardiovascular-500 to-respiratory-500 bg-clip-text text-transparent">
              Health Journey
            </span>
            <br />
            Visualized
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Comprehensive child development platform featuring organ-specific testing, 
            behavioral assessments, and engaging scientific storytelling that makes 
            health monitoring both educational and delightful.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              href="/dashboard"
              className="group bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Health Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group flex items-center space-x-3 text-gray-700 hover:text-brain-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="font-medium">Watch Demo</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brain-600 mb-2">10,000+</div>
              <div className="text-gray-600">Children Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cardiovascular-600 mb-2">95%</div>
              <div className="text-gray-600">Parent Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-respiratory-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Health Assistant</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
