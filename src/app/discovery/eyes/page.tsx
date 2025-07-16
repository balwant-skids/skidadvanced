'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Play, 
  Pause,
  Palette,
  BookOpen,
  Activity,
  Users,
  Home,
  Lightbulb,
  Target
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

export default function EyesDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isBlinking, setIsBlinking] = useState(true)
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [colorGameActive, setColorGameActive] = useState(false)

  const colors = [
    { name: 'Red', value: '#FF0000', emoji: '🔴' },
    { name: 'Blue', value: '#0000FF', emoji: '🔵' },
    { name: 'Green', value: '#00FF00', emoji: '🟢' },
    { name: 'Yellow', value: '#FFFF00', emoji: '🟡' },
    { name: 'Purple', value: '#800080', emoji: '🟣' },
    { name: 'Orange', value: '#FFA500', emoji: '🟠' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Eyes',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible window cameras - their amazing eyes! These sophisticated organs are like the world's most advanced cameras, capturing millions of colors, shapes, and movements every second. They work together with the brain to create the beautiful, colorful world your child sees every day!",
        wonderFact: "Your child's eyes can distinguish over 10 million different colors - that's more colors than there are people in many countries!",
        visual: '👁️',
        ageAdaptation: {
          '0-2': "Your baby's eyes are still learning to focus and see clearly - they love looking at faces and bright colors!",
          '3-5': "Your child's eyes are getting better at seeing details and tracking moving objects like balls and butterflies!",
          '6-12': "Your child's eyes can now see almost as well as adult eyes and are great at reading and detailed work!",
          '13+': "Your teenager's eyes have reached full adult capability and can handle complex visual tasks!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Eyes Work',
      type: 'interactive',
      content: {
        explanation: "The eyes work like amazing cameras with automatic focus, zoom, and color correction! Light enters through the pupil, gets focused by the lens, and creates a picture on the retina that gets sent to the brain.",
        interactive: true,
        eyeParts: [
          { name: "Cornea", description: "Clear front window that bends light", position: "front" },
          { name: "Pupil", description: "Opening that controls how much light enters", position: "center" },
          { name: "Lens", description: "Focuses light to create clear images", position: "middle" },
          { name: "Retina", description: "Light-sensitive screen that captures images", position: "back" },
          { name: "Optic Nerve", description: "Cable that sends images to the brain", position: "back" }
        ]
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Eye Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Eyes can distinguish 10 million different colors",
            explanation: "That's like having a super-powered color detector that never gets confused!",
            visual: "🌈"
          },
          {
            fact: "Eyes process 36,000 bits of information every hour",
            explanation: "That's faster than the world's most powerful computers!",
            visual: "💻"
          },
          {
            fact: "You blink about 15,000 times per day",
            explanation: "Each blink cleans and protects your eyes like tiny windshield wipers!",
            visual: "💧"
          },
          {
            fact: "Eye muscles are the fastest in your body",
            explanation: "They can move your eyes to look at something in just 1/50th of a second!",
            visual: "⚡"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Eye Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Color Detective Game",
            description: "Become a color expert by finding and sorting colors in your environment",
            materials: ["Colored paper or objects", "Sorting containers", "Timer", "Magnifying glass"],
            steps: [
              "Collect objects of different colors from around the house",
              "Sort them by color families (reds, blues, greens, etc.)",
              "Use magnifying glass to look at color details",
              "Create color gradients from light to dark shades"
            ],
            ageRange: "3+ years",
            learningGoal: "Developing color recognition and visual discrimination skills"
          },
          {
            title: "Eye Tracking Treasure Hunt",
            description: "Practice visual tracking skills with fun movement games",
            materials: ["Colorful ball or toy", "Flashlight", "Various sized objects", "Open space"],
            steps: [
              "Follow a moving ball with your eyes without moving your head",
              "Track a flashlight beam on the wall in different patterns",
              "Find hidden objects of different sizes around the room",
              "Practice looking far away, then close up, then far again"
            ],
            ageRange: "4+ years",
            learningGoal: "Strengthening eye muscles and tracking abilities"
          },
          {
            title: "Vision-Friendly Art Studio",
            description: "Create art while learning about protecting your precious eyes",
            materials: ["Art supplies", "Good lighting", "Proper seating", "Timer for breaks"],
            steps: [
              "Set up art space with good lighting and comfortable seating",
              "Create colorful artwork using many different colors",
              "Take eye breaks every 20 minutes to look at distant objects",
              "Discuss how good lighting helps eyes work better"
            ],
            ageRange: "5+ years",
            learningGoal: "Learning about eye health and visual ergonomics"
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
                scaleY: isBlinking ? [1, 0.1, 1] : 1,
              }}
              transition={{ 
                duration: 0.3,
                repeat: isBlinking ? Infinity : 0,
                repeatDelay: 3
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating sparkles around eye */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${15 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.4, 1, 0.4],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌈</span>
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

            {/* Interactive Eye Anatomy */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 border border-amber-200">
                <div className="relative">
                  {/* Animated Eye */}
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ 
                        scaleY: isBlinking ? [1, 0.1, 1] : 1,
                      }}
                      transition={{ 
                        duration: 0.2,
                        repeat: isBlinking ? Infinity : 0,
                        repeatDelay: 4
                      }}
                      className="text-6xl mb-4"
                    >
                      👁️
                    </motion.div>

                    {/* Color Recognition Game */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Color Recognition Challenge</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                        {colors.map((color) => (
                          <motion.button
                            key={color.name}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-16 h-16 rounded-full border-4 transition-all ${
                              selectedColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.value }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="sr-only">{color.name}</span>
                          </motion.button>
                        ))}
                      </div>
                      <p className="text-center text-gray-600">
                        Selected Color: <span className="font-semibold">
                          {colors.find(c => c.value === selectedColor)?.name}
                        </span>
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setIsBlinking(!isBlinking)}
                        className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
                      >
                        {isBlinking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isBlinking ? 'Stop' : 'Start'} Blinking</span>
                      </button>
                      
                      <button
                        onClick={() => setColorGameActive(!colorGameActive)}
                        className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Color Game</span>
                      </button>
                    </div>

                    {/* Eye Parts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSectionData.content.eyeParts.map((part: any, index: number) => (
                        <motion.div
                          key={part.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-4 border border-gray-200"
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                              <Eye className="w-4 h-4" />
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">{part.name}</h5>
                            <p className="text-sm text-gray-600">{part.description}</p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
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
              href="/discovery/ears"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Ears</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
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
                      ? 'bg-amber-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
