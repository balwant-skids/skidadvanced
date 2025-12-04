'use client'

import { useUserContext } from '@/contexts/UserContext';
import { ArrowRight, Play, Sparkles, Microscope, Heart, Brain, MessageCircle, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated } = useUserContext();

  return (
    <main className="min-h-screen">
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                SKIDS Advanced
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/discovery" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Discovery</Link>
              <Link href="/interventions" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Interventions</Link>
              <Link href="/specialists" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Specialists</Link>
              {!isAuthenticated && <Link href="/sign-up" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md">Get Started</button>
              </Link>}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Peek into Wonder */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Educational Partners */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <span className="text-gray-600 font-medium">Inspired by world-class educational content:</span>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a
                  href="https://kurzgesagt.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Kurzgesagt
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://kids.nationalgeographic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  National Geographic Kids
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://www.discoverykids.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Discovery Kids
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://www.brainpop.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  BrainPOP
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href="https://ed.ted.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  TED-Ed
                </a>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover the
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-red-500 to-blue-500 bg-clip-text text-transparent">
                Amazing World
              </span>
              <br />
              Inside Your Child
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Embark on an incredible journey through your child's body. Explore how their heart beats,
              brain learns, and lungs breathe in ways that will amaze and educate your entire family.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/discovery"
                className="group bg-gradient-to-r from-purple-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Begin Discovery Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="font-medium">Preview the Wonder</span>
              </button>
            </div>

            {/* Wonder Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">100,000</div>
                <div className="text-gray-600">Heartbeats per day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">20,000</div>
                <div className="text-gray-600">Breaths daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1 Million</div>
                <div className="text-gray-600">New brain connections</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wonder Preview Section - Coming Soon */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Wonder Preview</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience amazing 3D visualizations of your child's body systems
          </p>
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-12">
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-lg text-gray-700">Interactive preview coming soon!</p>
          </div>
        </div>
      </section>

      {/* Behavioral Assessment Highlight */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Understanding Your Child's Behavior
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supporting healthy development in our digital world through gentle, comprehensive behavioral insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
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
            </div>

            <div className="relative">
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
            </div>
          </div>
        </div>
      </section>

      {/* Discovery CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Explore the Incredible?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families discovering the amazing science behind their child's development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/discovery"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
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
          </div>
        </div>
      </section>
    </main>
  )
}