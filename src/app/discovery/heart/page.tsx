'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Play, 
  Pause,
  Volume2,
  BookOpen,
  Activity,
  Users,
  Home,
  Lightbulb
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

export default function HeartDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isHeartBeating, setIsHeartBeating] = useState(true)
  const [heartRate, setHeartRate] = useState(80) // BPM

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Heart',
      type: 'story',
      content: {
        narrative: "Welcome to one of the most incredible journeys you'll ever take - inside your child's amazing heart! This powerful muscle works 24/7, never taking a break, pumping life through every part of their growing body.",
        wonderFact: "Your child's heart is about the size of their fist, but it's strong enough to pump blood to every single cell in their body!",
        visual: '❤️',
        ageAdaptation: {
          '0-2': "Even before your baby was born, their tiny heart was already beating and working hard!",
          '3-5': "Your child's heart beats faster than yours because they're growing so quickly!",
          '6-12': "Your child's heart is getting stronger every day as they run, play, and grow!",
          '13+': "Your teenager's heart is almost as strong as an adult's heart now!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Heart Works',
      type: 'interactive',
      content: {
        explanation: "The heart is like a super-powered pump with four special rooms called chambers. Watch how blood flows through this amazing system!",
        interactive: true,
        steps: [
          { step: 1, description: "Blood returns to the right side of the heart", color: "blue" },
          { step: 2, description: "Heart pumps blood to the lungs for oxygen", color: "purple" },
          { step: 3, description: "Oxygen-rich blood returns to the left side", color: "red" },
          { step: 4, description: "Heart pumps fresh blood to the whole body", color: "bright-red" }
        ]
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Heart Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your child's heart beats about 100,000 times every single day!",
            explanation: "That's like doing 100,000 jumping jacks without stopping!",
            visual: "🏃‍♀️"
          },
          {
            fact: "The heart pumps about 2,000 gallons of blood daily",
            explanation: "That's enough to fill up a small swimming pool!",
            visual: "🏊‍♀️"
          },
          {
            fact: "Heart muscle never gets tired",
            explanation: "Unlike other muscles, the heart never needs to rest - it's the ultimate athlete!",
            visual: "💪"
          },
          {
            fact: "A child's heart beats faster than an adult's",
            explanation: "Because they're growing so fast, their heart needs to work extra hard!",
            visual: "⚡"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Heart Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Heart Rate Detective",
            description: "Find your pulse and count heartbeats together",
            materials: ["Your fingers", "A timer", "A stethoscope (if available)"],
            steps: [
              "Place two fingers on your wrist or neck",
              "Count the beats for 15 seconds",
              "Multiply by 4 to get beats per minute",
              "Try before and after jumping jacks!"
            ],
            ageRange: "3+ years",
            learningGoal: "Understanding heart rate and how exercise affects it"
          },
          {
            title: "Heart-Healthy Snack Lab",
            description: "Create colorful, heart-healthy snacks together",
            materials: ["Fruits", "Vegetables", "Heart-shaped cookie cutters"],
            steps: [
              "Cut fruits and veggies into heart shapes",
              "Talk about how each color helps the heart",
              "Create a rainbow heart plate",
              "Enjoy your heart-healthy creation!"
            ],
            ageRange: "2+ years",
            learningGoal: "Learning about nutrition and heart health"
          },
          {
            title: "Heartbeat Music",
            description: "Create music that matches your heartbeat",
            materials: ["Musical instruments", "Your heartbeat"],
            steps: [
              "Feel your heartbeat rhythm",
              "Tap it out on a drum or table",
              "Create a song with the heartbeat rhythm",
              "Dance to your heart's music!"
            ],
            ageRange: "All ages",
            learningGoal: "Connecting rhythm, music, and body awareness"
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
                scale: isHeartBeating ? [1, 1.1, 1] : 1,
              }}
              transition={{ 
                duration: 60 / heartRate,
                repeat: isHeartBeating ? Infinity : 0 
              }}
              className="text-8xl mb-8"
            >
              {currentSectionData.content.visual}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✨</span>
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

            {/* Interactive Heart Animation */}
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl p-8 border border-red-200">
                <div className="relative">
                  {/* Animated Heart */}
                  <motion.div
                    animate={{ 
                      scale: isHeartBeating ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ 
                      duration: 60 / heartRate,
                      repeat: isHeartBeating ? Infinity : 0 
                    }}
                    className="text-6xl text-center mb-6"
                  >
                    ❤️
                  </motion.div>

                  {/* Heart Rate Display */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-red-600">{heartRate}</div>
                    <div className="text-sm text-gray-600">beats per minute</div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <button
                      onClick={() => setIsHeartBeating(!isHeartBeating)}
                      className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      {isHeartBeating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isHeartBeating ? 'Pause' : 'Play'}</span>
                    </button>
                    
                    <button
                      onClick={() => setHeartRate(Math.max(60, heartRate - 10))}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      Slower
                    </button>
                    
                    <button
                      onClick={() => setHeartRate(Math.min(120, heartRate + 10))}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                    >
                      Faster
                    </button>
                  </div>

                  {/* Blood Flow Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSectionData.content.steps.map((step: any, index: number) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
              href="/discovery/brain"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Brain</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-600 h-2 rounded-full"
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
                      ? 'bg-red-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
