'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Play,
  Pause,
  Ear,
  Hand,
  Lightbulb,
  Zap,
  Settings,
  CheckCircle
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

export default function SensesDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [sensoryActive, setSensoryActive] = useState(true)
  const [selectedSense, setSelectedSense] = useState('sight')
  const [sensoryIntegration, setSensoryIntegration] = useState(80)
  const [sensitivities, setSensitivities] = useState({
    visual: 50,
    auditory: 60,
    tactile: 70,
    vestibular: 65,
    proprioceptive: 55
  })

  const fivePlusSenses = [
    {
      id: 'sight',
      name: 'Sight (Vision)',
      description: 'Processing visual information from the environment',
      organ: 'Eyes',
      emoji: '👁️',
      color: '#FFD700',
      facts: ['Processes 36,000 bits of info per hour', 'Can distinguish 10 million colors']
    },
    {
      id: 'hearing',
      name: 'Hearing (Auditory)',
      description: 'Processing sounds and maintaining balance',
      organ: 'Ears',
      emoji: '👂',
      color: '#32CD32',
      facts: ['Detects 20Hz to 20,000Hz', 'Never stops working, even while sleeping']
    },
    {
      id: 'touch',
      name: 'Touch (Tactile)',
      description: 'Feeling textures, temperature, and pressure',
      organ: 'Skin',
      emoji: '✋',
      color: '#FF69B4',
      facts: ['1,000+ nerve endings per square inch', 'Largest sensory organ']
    },
    {
      id: 'smell',
      name: 'Smell (Olfactory)',
      description: 'Detecting and identifying different scents',
      organ: 'Nose',
      emoji: '👃',
      color: '#9370DB',
      facts: ['Can distinguish 1 trillion different scents', 'Directly connected to memory']
    },
    {
      id: 'taste',
      name: 'Taste (Gustatory)',
      description: 'Identifying flavors and food safety',
      organ: 'Tongue',
      emoji: '👅',
      color: '#FF4500',
      facts: ['5 basic tastes: sweet, sour, salty, bitter, umami', 'Works with smell for flavor']
    },
    {
      id: 'vestibular',
      name: 'Balance (Vestibular)',
      description: 'Sensing movement and spatial orientation',
      organ: 'Inner Ear',
      emoji: '🌀',
      color: '#4169E1',
      facts: ['Helps you know which way is up', 'Controls balance and coordination']
    },
    {
      id: 'proprioceptive',
      name: 'Body Position (Proprioceptive)',
      description: 'Knowing where your body parts are in space',
      organ: 'Muscles & Joints',
      emoji: '🤸',
      color: '#20B2AA',
      facts: ['Lets you touch your nose with eyes closed', 'Helps with coordination']
    }
  ]

  const sensoryProcessingTypes = [
    { type: 'typical', name: 'Typical Processing', description: 'Responds appropriately to sensory input', percentage: 80, color: '#4CAF50' },
    { type: 'over-responsive', name: 'Over-Responsive', description: 'Reacts strongly to sensory input', percentage: 10, color: '#FF5722' },
    { type: 'under-responsive', name: 'Under-Responsive', description: 'Needs more input to respond', percentage: 7, color: '#2196F3' },
    { type: 'seeking', name: 'Sensory Seeking', description: 'Actively seeks sensory experiences', percentage: 3, color: '#FF9800' }
  ]

  const sensoryStrategies = [
    { strategy: 'deep-pressure', name: 'Deep Pressure', description: 'Heavy work activities and compression', benefit: 'Calming and organizing', tools: ['Weighted blankets', 'Bear hugs', 'Heavy lifting'] },
    { strategy: 'movement', name: 'Movement Input', description: 'Vestibular and proprioceptive activities', benefit: 'Alerting and organizing', tools: ['Swinging', 'Jumping', 'Spinning'] },
    { strategy: 'environmental', name: 'Environmental Modifications', description: 'Adjusting surroundings for comfort', benefit: 'Reducing overwhelm', tools: ['Noise-canceling headphones', 'Fidget tools', 'Lighting adjustments'] },
    { strategy: 'routine', name: 'Sensory Routines', description: 'Regular sensory breaks and activities', benefit: 'Maintaining regulation', tools: ['Sensory diet', 'Scheduled breaks', 'Calming activities'] }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Sensory System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible sensory world - their amazing sensory processing system! This sophisticated network includes not just the 5 senses you know, but actually 7+ senses that work together to help them understand and navigate their environment. Every moment, their brain is processing millions of sensory messages to create their unique experience of the world!",
        wonderFact: "Your child has more than 5 senses - they actually have 7+ sensory systems working together, including balance and body awareness!",
        visual: '🌈',
        ageAdaptation: {
          '0-2': "Your baby's sensory system is rapidly developing and learning to organize all the new sensations from the world!",
          '3-5': "Your child's sensory processing is becoming more refined as they explore textures, sounds, and movements!",
          '6-12': "Your child's sensory system is learning to filter and prioritize sensory information for better focus!",
          '13+': "Your teenager's sensory processing is becoming sophisticated and can handle complex sensory environments!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Sensory System Works',
      type: 'interactive',
      content: {
        explanation: "The sensory system works like an amazing information processing center! Your 7+ senses collect information from the environment, send it to your brain, where it gets organized and integrated to help you understand and respond to the world around you.",
        interactive: true,
        senses: fivePlusSenses,
        processingTypes: sensoryProcessingTypes,
        strategies: sensoryStrategies
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Sensory Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "You have more than 5 senses - actually 7 or more!",
            explanation: "Beyond the classic 5, you have balance, body position, and even internal senses!",
            visual: "🌟"
          },
          {
            fact: "Your brain processes 11 million bits of sensory info per second",
            explanation: "But you're only consciously aware of about 40 bits - your brain filters the rest!",
            visual: "🧠"
          },
          {
            fact: "Sensory integration happens automatically in most people",
            explanation: "Your brain combines all sensory input to create a complete picture of your environment!",
            visual: "🧩"
          },
          {
            fact: "Everyone has unique sensory preferences",
            explanation: "Some people love loud music while others prefer quiet - it's all about individual sensory processing!",
            visual: "🎨"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Sensory Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Sensory Exploration Station",
            description: "Create bins with different textures and materials to explore",
            materials: ["Various textured materials", "Containers", "Scoops", "Blindfold", "Recording sheet"],
            steps: [
              "Fill bins with different textures (rice, beans, sand, fabric)",
              "Explore each texture with hands and describe the sensations",
              "Try identifying materials with eyes closed",
              "Record favorite and least favorite textures"
            ],
            ageRange: "2+ years",
            learningGoal: "Developing tactile awareness and sensory vocabulary"
          },
          {
            title: "Sensory Diet Planning",
            description: "Create a personalized sensory diet for optimal regulation",
            materials: ["Activity cards", "Schedule template", "Timer", "Sensory tools"],
            steps: [
              "Identify times when sensory breaks are needed",
              "Choose appropriate sensory activities for different needs",
              "Create a daily sensory diet schedule",
              "Track effectiveness and adjust as needed"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding personal sensory needs and self-regulation"
          },
          {
            title: "Sensory-Friendly Environment Design",
            description: "Modify spaces to support sensory processing needs",
            materials: ["Lighting options", "Sound dampening materials", "Fidget tools", "Comfort items"],
            steps: [
              "Assess current environment for sensory challenges",
              "Identify modifications that could help (lighting, sound, seating)",
              "Implement changes and test their effectiveness",
              "Create sensory-friendly zones for different activities"
            ],
            ageRange: "6+ years",
            learningGoal: "Creating supportive sensory environments"
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
                scale: sensoryActive ? [1, 1.1, 1] : 1,
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: sensoryActive ? Infinity : 0
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating sensory icons */}
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 4) * 15}%`,
                  }}
                  animate={{
                    scale: sensoryActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: sensoryActive ? [0.4, 0.9, 0.4] : 0.4,
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: sensoryActive ? Infinity : 0,
                    delay: i * 0.4
                  }}
                >
                  {['👁️', '👂', '✋', '👃', '👅', '🌀', '🤸'][i]}
                </motion.div>
              ))}
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
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

            {/* Interactive Sensory System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-8 border border-cyan-200">
                <div className="relative">
                  {/* 7+ Senses Explorer */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Explore Your 7+ Senses</h4>

                    {/* Sense Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                      {fivePlusSenses.map((sense) => (
                        <motion.button
                          key={sense.id}
                          onClick={() => setSelectedSense(sense.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedSense === sense.id
                              ? 'border-cyan-500 bg-cyan-50 scale-105'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{sense.emoji}</div>
                            <div className="font-medium text-xs">{sense.name.split(' ')[0]}</div>
                            <div className="text-xs text-gray-600">{sense.organ}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Current Sense Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {fivePlusSenses.find(s => s.id === selectedSense)?.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-3">
                        {fivePlusSenses.find(s => s.id === selectedSense)?.description}
                      </p>
                      <div className="space-y-1">
                        {fivePlusSenses.find(s => s.id === selectedSense)?.facts.map((fact, i) => (
                          <div key={i} className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full inline-block mr-2">
                            {fact}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sensory Processing Types */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Sensory Processing Types</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sensoryProcessingTypes.map((type, index) => (
                          <motion.div
                            key={type.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200 text-center"
                          >
                            <h6 className="font-medium text-gray-900 mb-2">{type.name}</h6>
                            <p className="text-xs text-gray-600 mb-3">{type.description}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <motion.div
                                className="h-2 rounded-full"
                                style={{ backgroundColor: type.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${type.percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {type.percentage}% of population
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Sensory Integration Level */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Sensory Integration</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setSensoryIntegration(Math.max(0, sensoryIntegration - 15))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Difficulty
                        </button>

                        <div className="text-center">
                          <div className="text-3xl font-bold text-cyan-600">{sensoryIntegration}%</div>
                          <div className="text-sm text-gray-600">Integration Level</div>
                        </div>

                        <button
                          onClick={() => setSensoryIntegration(Math.min(100, sensoryIntegration + 15))}
                          className="bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors"
                        >
                          Smooth
                        </button>
                      </div>

                      {/* Integration Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            sensoryIntegration < 30 ? 'bg-red-500' :
                            sensoryIntegration < 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${sensoryIntegration}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      <div className="text-center text-sm text-gray-600">
                        {sensoryIntegration < 30 ? 'May need sensory support strategies' :
                         sensoryIntegration < 70 ? 'Good integration with some challenges' :
                         'Excellent sensory integration'}
                      </div>
                    </div>

                    {/* Sensory Strategies */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Sensory Support Strategies</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sensoryStrategies.map((strategy, index) => (
                          <motion.div
                            key={strategy.strategy}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200"
                          >
                            <h6 className="font-medium text-gray-900 mb-2">{strategy.name}</h6>
                            <p className="text-xs text-gray-600 mb-2">{strategy.description}</p>
                            <div className="text-xs text-cyan-600 font-medium mb-2">
                              Benefit: {strategy.benefit}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {strategy.tools.map((tool, i) => (
                                <span key={i} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setSensoryActive(!sensoryActive)}
                        className="flex items-center space-x-2 bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors"
                      >
                        {sensoryActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{sensoryActive ? 'Pause' : 'Start'} Sensory Demo</span>
                      </button>
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

            <div className="flex items-center space-x-2 text-gray-600">
              <span>Complete!</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
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