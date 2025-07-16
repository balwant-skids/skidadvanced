'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Play, 
  Pause,
  Wind,
  BookOpen,
  Users,
  Home,
  Lightbulb,
  Gauge
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

interface DiscoverySection {
  id: string
  title: string
  type: 'story' | 'interactive' | 'facts' | 'activities'
  content: any
}

export default function LungsDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isBreathing, setIsBreathing] = useState(true)
  const [breathsPerMinute, setBreathsPerMinute] = useState(20)
  const [lungCapacity, setLungCapacity] = useState(75)

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Lungs',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible breathing balloons - their amazing lungs! These magical organs work like the world's most efficient air purifiers, bringing fresh oxygen to every cell in their body and removing waste gases. They never take a break, working 24/7 to keep your child healthy and energized!",
        wonderFact: "Your child takes about 20,000 breaths every single day - that's like inflating 20,000 balloons!",
        visual: '🫁',
        ageAdaptation: {
          '0-2': "Your baby's lungs are still developing and learning to work perfectly - each breath helps them grow stronger!",
          '3-5': "Your child's lungs are like magical balloons that fill up with air to give them energy to run and play!",
          '6-12': "Your child's lungs are getting stronger every day, helping them run faster and play longer!",
          '13+': "Your teenager's lungs are almost fully developed and can process oxygen as efficiently as an adult's!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Lungs Work',
      type: 'interactive',
      content: {
        explanation: "The lungs work like amazing balloons connected to a super-smart pump - your diaphragm! Watch how air flows in and out, bringing life-giving oxygen to every part of your body.",
        interactive: true,
        breathingSteps: [
          { step: 1, description: "Diaphragm moves down, creating space", phase: "inhale" },
          { step: 2, description: "Air rushes into the lungs through nose/mouth", phase: "inhale" },
          { step: 3, description: "Oxygen moves into the bloodstream", phase: "exchange" },
          { step: 4, description: "Carbon dioxide is removed from blood", phase: "exchange" },
          { step: 5, description: "Diaphragm moves up, pushing air out", phase: "exhale" },
          { step: 6, description: "Waste gases are breathed out", phase: "exhale" }
        ]
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Lung Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your lungs would cover half a tennis court if spread flat",
            explanation: "All those tiny air sacs (alveoli) create an enormous surface area for oxygen exchange!",
            visual: "🎾"
          },
          {
            fact: "Children take 20,000 breaths every day",
            explanation: "That's about 14 breaths every minute, even while sleeping!",
            visual: "💨"
          },
          {
            fact: "Your lungs filter 2,000 gallons of air daily",
            explanation: "That's enough air to fill a small swimming pool every single day!",
            visual: "🏊‍♀️"
          },
          {
            fact: "The left lung is smaller than the right lung",
            explanation: "It makes room for your heart - what a thoughtful design!",
            visual: "❤️"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Lung Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Bubble Breathing Champion",
            description: "Practice deep breathing while creating beautiful bubbles",
            materials: ["Bubble solution", "Bubble wands", "Timer", "Outdoor space"],
            steps: [
              "Take a deep breath in through your nose for 4 counts",
              "Hold your breath gently for 2 counts",
              "Blow out slowly through the bubble wand for 6 counts",
              "Watch your beautiful bubbles float away with your breath!"
            ],
            ageRange: "2+ years",
            learningGoal: "Developing breath control and lung capacity"
          },
          {
            title: "Singing Lung Power",
            description: "Strengthen lungs through fun singing and vocal exercises",
            materials: ["Favorite songs", "Musical instruments (optional)", "Recording device (optional)"],
            steps: [
              "Choose songs with long, sustained notes",
              "Practice breathing deeply before singing",
              "Hold notes as long as possible to build lung strength",
              "Record your progress and celebrate improvements!"
            ],
            ageRange: "3+ years",
            learningGoal: "Building respiratory strength and breath control"
          },
          {
            title: "Air Quality Detective",
            description: "Learn about clean air and how to protect your lungs",
            materials: ["White cloth or coffee filter", "Magnifying glass", "Notebook", "Camera"],
            steps: [
              "Place white cloth outside for a day to collect particles",
              "Examine what the cloth collected with magnifying glass",
              "Discuss what helps keep air clean (plants, filters, etc.)",
              "Create a family plan for protecting lung health"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding air quality and lung health protection"
          }
        ]
      }
    }
  ]

  const currentSectionData = discoverySections[currentSection]

  const nextSection = () => {
    if (currentSection < discoverySections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const renderSection = () => {
    switch (currentSectionData.type) {
      case 'story':
        return (
          <div className="text-center space-y-8">
            <motion.div
              animate={{ 
                scale: isBreathing ? [1, 1.1, 1] : 1,
              }}
              transition={{ 
                duration: 60 / breathsPerMinute * 4, // 4 seconds per breath cycle
                repeat: isBreathing ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating air particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: isBreathing ? [0, -30, 0] : 0,
                    opacity: isBreathing ? [0.3, 0.8, 0.3] : 0.3,
                    x: [0, 10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: isBreathing ? Infinity : 0,
                    delay: i * 0.2
                  }}
                >
                  💨
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Wonder Fact!</h4>
                    <p className="text-gray-700">{currentSectionData.content.wonderFact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'interactive':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {currentSectionData.content.explanation}
              </p>
            </div>

            {/* Interactive Breathing Animation */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-8 border border-cyan-200">
                <div className="relative">
                  {/* Animated Lungs */}
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ 
                        scale: isBreathing ? [1, 1.3, 1] : 1,
                      }}
                      transition={{ 
                        duration: 60 / breathsPerMinute * 4,
                        repeat: isBreathing ? Infinity : 0 
                      }}
                      className="text-6xl mb-4"
                    >
                      🫁
                    </motion.div>

                    {/* Breathing Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">{breathsPerMinute}</div>
                        <div className="text-sm text-gray-600">breaths per minute</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{lungCapacity}%</div>
                        <div className="text-sm text-gray-600">lung capacity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-600">
                          {Math.round(breathsPerMinute * 60 * 24).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">breaths per day</div>
                      </div>
                    </div>

                    {/* Lung Capacity Meter */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-4">
                        <Gauge className="w-5 h-5 text-gray-600" />
                        <div className="flex-1 max-w-md">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <motion.div
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${lungCapacity}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{lungCapacity}%</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setIsBreathing(!isBreathing)}
                        className="flex items-center space-x-2 bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors"
                      >
                        {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isBreathing ? 'Hold Breath' : 'Start Breathing'}</span>
                      </button>
                      
                      <button
                        onClick={() => setBreathsPerMinute(Math.max(12, breathsPerMinute - 4))}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Slower
                      </button>
                      
                      <button
                        onClick={() => setBreathsPerMinute(Math.min(30, breathsPerMinute + 4))}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                      >
                        Faster
                      </button>
                    </div>

                    {/* Breathing Process Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSectionData.content.breathingSteps.map((step: any, index: number) => (
                        <motion.div
                          key={step.step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-white rounded-xl p-4 border-2 ${
                            step.phase === 'inhale' ? 'border-green-200' :
                            step.phase === 'exhale' ? 'border-red-200' :
                            'border-blue-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              step.phase === 'inhale' ? 'bg-green-500' :
                              step.phase === 'exhale' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}>
                              {step.step}
                            </div>
                            <p className="text-sm text-gray-700">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'facts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSectionData.content.facts.map((factItem: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{factItem.visual}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{factItem.fact}</h4>
                  <p className="text-gray-600 text-sm">{factItem.explanation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 'activities':
        return (
          <div className="space-y-6">
            {currentSectionData.content.activities.map((activity: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">{activity.title}</h4>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Materials Needed:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {activity.materials.map((material: string, i: number) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Steps:</h5>
                        <ol className="text-sm text-gray-600 space-y-1">
                          {activity.steps.map((step: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Age Range: {activity.ageRange}</span>
                      <span>Learning Goal: {activity.learningGoal}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/discovery"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Discovery</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                {currentSectionData.title}
              </h1>
              <p className="text-gray-600">
                Section {currentSection + 1} of {discoverySections.length}
              </p>
            </div>
            
            <Link
              href="/discovery/eyes"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Eyes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSection + 1) / discoverySections.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {discoverySections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSection
                      ? 'bg-cyan-500'
                      : index < currentSection
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSection}
              disabled={currentSection === discoverySections.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>
                {currentSection === discoverySections.length - 1 ? 'Complete' : 'Next'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
