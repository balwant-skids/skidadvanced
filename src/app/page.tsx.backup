'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Microscope, Heart, Brain, MessageCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { WonderPreview } from '@/components/discovery/WonderPreview'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DrSkidsChat />

      {/* Hero Section - Peek into Wonder */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brain-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cardiovascular-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-respiratory-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Educational Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-6 mb-8"
            >
              <span className="text-gray-600 font-medium">Inspired by world-class educational content:</span>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a
                  href="https://kurzgesagt.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brain-600 hover:text-brain-700 font-medium transition-colors"
                >
                  Kurzgesagt
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://kids.nationalgeographic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brain-600 hover:text-brain-700 font-medium transition-colors"
                >
                  National Geographic Kids
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://www.discoverykids.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brain-600 hover:text-brain-700 font-medium transition-colors"
                >
                  Discovery Kids
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://www.brainpop.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brain-600 hover:text-brain-700 font-medium transition-colors"
                >
                  BrainPOP
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://ed.ted.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brain-600 hover:text-brain-700 font-medium transition-colors"
                >
                  TED-Ed
                </a>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight"
            >
              Discover the
              <br />
              <span className="bg-gradient-to-r from-brain-600 via-cardiovascular-500 to-respiratory-500 bg-clip-text text-transparent">
                Amazing World
              </span>
              <br />
              Inside Your Child
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Embark on an incredible journey through your child's body. Explore how their heart beats,
              brain learns, and lungs breathe in ways that will amaze and educate your entire family.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link
                href="/discovery"
                className="group bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Begin Discovery Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group flex items-center space-x-3 text-gray-700 hover:text-brain-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="font-medium">Preview the Wonder</span>
              </button>
            </motion.div>

            {/* Wonder Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brain-600 mb-2">100,000</div>
                <div className="text-gray-600">Heartbeats per day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cardiovascular-600 mb-2">20,000</div>
                <div className="text-gray-600">Breaths daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-respiratory-600 mb-2">1 Million</div>
                <div className="text-gray-600">New brain connections</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wonder Preview Section */}
      <WonderPreview />

      {/* Behavioral Assessment Highlight */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
            >
              Understanding Your Child's Behavior
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Supporting healthy development in our digital world through gentle, comprehensive behavioral insights
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">SKIDS Clinic Chatter</h3>
                    <p className="text-gray-600">AI-powered conversational assessment</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Specialized Evaluations</h3>
                    <p className="text-gray-600">ADHD, Autism, Anxiety & Learning assessments</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Digital Balance</h3>
                    <p className="text-gray-600">Healthy screen time & digital wellness guidance</p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/behavioral"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Explore Behavioral Assessments</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Revolutionary AI Assessment
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Our SKIDS Clinic Chatter creates a comfortable, conversation-based approach to understanding your child's
                    emotional and behavioral development, making the process both engaging and insightful.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15-20</div>
                      <div className="text-gray-600">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">3+</div>
                      <div className="text-gray-600">Years Age</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-brain-500 to-cardiovascular-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Explore the Incredible?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families discovering the amazing science behind their child's development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/discovery"
                className="bg-white text-brain-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Microscope className="w-5 h-5" />
                <span>Start Exploring Now</span>
              </Link>
              <Link
                href="/consultation"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Talk to Health Manager
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
