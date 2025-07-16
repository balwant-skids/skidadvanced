'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Play, 
  Pause,
  Zap,
  BookOpen,
  Activity,
  Users,
  Home,
  Lightbulb,
  Sparkles
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

export default function BrainDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isNeuronActive, setIsNeuronActive] = useState(true)
  const [connectionsPerSecond, setConnectionsPerSecond] = useState(1000000)
  const [memoryGameActive, setMemoryGameActive] = useState(false)

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Brain',
      type: 'story',
      content: {
        narrative: "Welcome to the most incredible computer in the universe - your child's amazing brain! This super-powered organ controls everything from breathing to dreaming, learning to laughing. It's like having a supercomputer that never stops working!",
        wonderFact: "Your child's brain contains 86 billion neurons - that's more than the number of stars in our galaxy!",
        visual: '🧠',
        ageAdaptation: {
          '0-2': "Your baby's brain is growing faster than any other time in their life - 1 million new connections every second!",
          '3-5': "Your child's brain is like a super-sponge, soaking up everything they see, hear, and experience!",
          '6-12': "Your child's brain is getting better at focusing, remembering, and solving problems every day!",
          '13+': "Your teenager's brain is developing amazing abilities like abstract thinking and planning for the future!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Brain Works',
      type: 'interactive',
      content: {
        explanation: "The brain is like a super-fast internet made of neurons! Watch how these amazing brain cells send messages to each other at lightning speed.",
        interactive: true,
        features: [
          { name: "Neuron Network", description: "See how brain cells connect and communicate" },
          { name: "Memory Formation", description: "Watch how memories are created and stored" },
          { name: "Brain Waves", description: "Observe different types of brain activity" },
          { name: "Learning Process", description: "See how the brain learns new things" }
        ]
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Brain Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your brain uses 20% of your body's energy",
            explanation: "Even though it's only 2% of your body weight, it's like having a powerful computer running 24/7!",
            visual: "⚡"
          },
          {
            fact: "1 million new connections form every second in early childhood",
            explanation: "That's faster than the world's most powerful supercomputer!",
            visual: "🔗"
          },
          {
            fact: "Your brain contains 86 billion neurons",
            explanation: "That's more neurons than there are stars in the Milky Way galaxy!",
            visual: "🌟"
          },
          {
            fact: "Brain signals travel at 268 miles per hour",
            explanation: "That's faster than a race car speeding down the highway!",
            visual: "🏎️"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Brain Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Memory Palace Builder",
            description: "Create a memory game using household objects to boost memory skills",
            materials: ["10-15 small objects", "A tray or table", "A timer", "Paper and pencil"],
            steps: [
              "Place objects on tray and let child study for 30 seconds",
              "Cover objects and have child write down what they remember",
              "Gradually increase number of objects as they improve",
              "Create stories connecting the objects to boost memory!"
            ],
            ageRange: "4+ years",
            learningGoal: "Developing memory techniques and concentration skills"
          },
          {
            title: "Brain Food Cooking Lab",
            description: "Prepare brain-boosting foods while learning about nutrition",
            materials: ["Blueberries", "Nuts", "Fish", "Dark leafy greens", "Cooking supplies"],
            steps: [
              "Learn about foods that help the brain grow strong",
              "Prepare a colorful 'brain power' snack plate",
              "Talk about how each food helps brain development",
              "Create a weekly brain-healthy meal plan together"
            ],
            ageRange: "3+ years",
            learningGoal: "Understanding nutrition's impact on brain health"
          },
          {
            title: "Neuron Connection Game",
            description: "Act out how brain cells communicate using your whole body",
            materials: ["Colored yarn or string", "Family members", "Space to move"],
            steps: [
              "Each person represents a neuron (brain cell)",
              "Use yarn to show connections between 'neurons'",
              "Pass messages by gently tossing a soft ball",
              "See how fast messages can travel through your 'brain network'!"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding how brain cells communicate"
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
                scale: isNeuronActive ? [1, 1.05, 1] : 1,
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: isNeuronActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating sparkles around brain */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
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
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌟</span>
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

            {/* Interactive Brain Network */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8 border border-purple-200">
                <div className="relative">
                  {/* Animated Brain with Neural Network */}
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ 
                        scale: isNeuronActive ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: isNeuronActive ? Infinity : 0 
                      }}
                      className="text-6xl mb-4"
                    >
                      🧠
                    </motion.div>

                    {/* Connection Counter */}
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-purple-600">
                        {connectionsPerSecond.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">new connections per second</div>
                    </div>

                    {/* Neural Network Visualization */}
                    <div className="relative h-32 mb-6">
                      <svg className="w-full h-full">
                        {/* Animated neural connections */}
                        {[...Array(8)].map((_, i) => (
                          <motion.line
                            key={i}
                            x1={`${10 + i * 12}%`}
                            y1="20%"
                            x2={`${15 + i * 12}%`}
                            y2="80%"
                            stroke="#8B5FBF"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: isNeuronActive ? 1 : 0, 
                              opacity: isNeuronActive ? [0, 1, 0] : 0 
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: isNeuronActive ? Infinity : 0,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                        
                        {/* Neuron nodes */}
                        {[...Array(6)].map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={`${20 + i * 15}%`}
                            cy={`${30 + (i % 2) * 40}%`}
                            r="4"
                            fill="#8B5FBF"
                            animate={{
                              scale: isNeuronActive ? [1, 1.5, 1] : 1,
                              opacity: isNeuronActive ? [0.6, 1, 0.6] : 0.6
                            }}
                            transition={{
                              duration: 1,
                              repeat: isNeuronActive ? Infinity : 0,
                              delay: i * 0.3
                            }}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setIsNeuronActive(!isNeuronActive)}
                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
                      >
                        {isNeuronActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isNeuronActive ? 'Pause' : 'Activate'} Network</span>
                      </button>
                      
                      <button
                        onClick={() => setConnectionsPerSecond(Math.max(100000, connectionsPerSecond - 200000))}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Slower Learning
                      </button>
                      
                      <button
                        onClick={() => setConnectionsPerSecond(Math.min(2000000, connectionsPerSecond + 200000))}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                      >
                        Faster Learning
                      </button>
                    </div>

                    {/* Brain Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSectionData.content.features.map((feature: any, index: number) => (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-white rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{feature.name}</h5>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
              href="/discovery/lungs"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Lungs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
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
                      ? 'bg-purple-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
