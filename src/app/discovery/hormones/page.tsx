'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Play, 
  Pause,
  TrendingUp,
  Moon,
  Sun,
  Lightbulb,
  Activity
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

export default function HormonesDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [hormoneFlowActive, setHormoneFlowActive] = useState(true)
  const [selectedHormone, setSelectedHormone] = useState('growth')
  const [growthStage, setGrowthStage] = useState(2)
  const [moodLevel, setMoodLevel] = useState(5)

  const keyHormones = [
    { id: 'growth', name: 'Growth Hormone', description: 'Helps you grow taller and stronger', gland: 'Pituitary', emoji: '📏', color: '#4CAF50' },
    { id: 'insulin', name: 'Insulin', description: 'Controls blood sugar levels', gland: 'Pancreas', emoji: '🍯', color: '#FF9800' },
    { id: 'adrenaline', name: 'Adrenaline', description: 'Gives you energy in exciting moments', gland: 'Adrenal', emoji: '⚡', color: '#F44336' },
    { id: 'melatonin', name: 'Melatonin', description: 'Helps you feel sleepy at night', gland: 'Pineal', emoji: '😴', color: '#9C27B0' },
    { id: 'thyroid', name: 'Thyroid Hormone', description: 'Controls how fast your body works', gland: 'Thyroid', emoji: '🔥', color: '#2196F3' }
  ]

  const growthStages = [
    { stage: 0, name: 'Baby', description: 'Rapid growth and development', age: '0-2 years', height: '20-35 inches' },
    { stage: 1, name: 'Toddler', description: 'Learning to walk and talk', age: '2-4 years', height: '32-40 inches' },
    { stage: 2, name: 'Child', description: 'Steady growth and learning', age: '5-10 years', height: '40-55 inches' },
    { stage: 3, name: 'Preteen', description: 'Preparing for growth spurts', age: '10-12 years', height: '50-60 inches' },
    { stage: 4, name: 'Teen', description: 'Major growth and changes', age: '13-18 years', height: '60-70+ inches' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Hormone System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible chemical messenger system - their amazing hormones! These tiny but powerful molecules travel through their bloodstream like special delivery messages, telling different parts of their body what to do and when to do it. From helping them grow taller to making them feel sleepy at bedtime, hormones control many important functions!",
        wonderFact: "Your child's body makes over 50 different hormones, each with its own special job to keep them healthy and growing!",
        visual: '⚡',
        ageAdaptation: {
          '0-2': "Your baby's hormones are working hard to help them grow and develop rapidly!",
          '3-5': "Your child's hormones help them grow steadily and regulate their sleep and energy!",
          '6-12': "Your child's hormones are preparing their body for the big changes of adolescence!",
          '13+': "Your teenager's hormones are creating major changes as they grow into an adult!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Hormone System Works',
      type: 'interactive',
      content: {
        explanation: "Hormones work like a sophisticated communication network! Special glands throughout the body release hormones into the bloodstream, which carry messages to target organs and tissues, telling them exactly what to do.",
        interactive: true,
        hormoneTypes: keyHormones,
        developmentStages: growthStages
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Hormone Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your body makes over 50 different hormones",
            explanation: "Each one has a specific job, like a specialized worker in a huge factory!",
            visual: "🏭"
          },
          {
            fact: "Growth hormone is released mostly while you sleep",
            explanation: "That's why getting enough sleep is so important for growing!",
            visual: "😴"
          },
          {
            fact: "Adrenaline can make you 10 times stronger temporarily",
            explanation: "It's your body's natural superpower for emergencies!",
            visual: "💪"
          },
          {
            fact: "Hormones can affect your mood and emotions",
            explanation: "They help explain why you might feel different at different times!",
            visual: "😊"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Hormone Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Sleep Hygiene Laboratory",
            description: "Learn how sleep affects hormone production and growth",
            materials: ["Sleep diary", "Alarm clock", "Blackout curtains", "Comfortable bedding"],
            steps: [
              "Track sleep patterns and how you feel each day",
              "Create a bedtime routine that promotes good sleep",
              "Learn about melatonin and how darkness helps sleep",
              "Measure growth over time and connect it to sleep quality"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding the connection between sleep and hormone health"
          },
          {
            title: "Stress Management Workshop",
            description: "Learn techniques to manage stress hormones like cortisol",
            materials: ["Stress ball", "Meditation app", "Journal", "Calming music"],
            steps: [
              "Learn to recognize signs of stress in your body",
              "Practice deep breathing and relaxation techniques",
              "Try different stress-relief activities (art, music, exercise)",
              "Create a personal stress management toolkit"
            ],
            ageRange: "7+ years",
            learningGoal: "Developing healthy stress management and emotional regulation"
          },
          {
            title: "Growth Milestone Celebration",
            description: "Track and celebrate growth and development milestones",
            materials: ["Growth chart", "Camera", "Milestone stickers", "Memory book"],
            steps: [
              "Measure height and track growth patterns over time",
              "Document developmental milestones and achievements",
              "Learn about growth spurts and when they typically occur",
              "Create a growth celebration tradition for the family"
            ],
            ageRange: "3+ years",
            learningGoal: "Understanding normal growth patterns and celebrating development"
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
                scale: hormoneFlowActive ? [1, 1.1, 1] : 1,
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: hormoneFlowActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating hormone molecules */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: hormoneFlowActive ? [0.8, 1.4, 0.8] : 0.8,
                    opacity: hormoneFlowActive ? [0.3, 0.9, 0.3] : 0.3,
                    x: [0, 25, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: hormoneFlowActive ? Infinity : 0,
                    delay: i * 0.4
                  }}
                >
                  🧪
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🧪</span>
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

            {/* Interactive Hormone System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border border-purple-200">
                <div className="relative">
                  {/* Hormone Explorer */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Explore Key Hormones</h4>
                    
                    {/* Hormone Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                      {keyHormones.map((hormone) => (
                        <motion.button
                          key={hormone.id}
                          onClick={() => setSelectedHormone(hormone.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedHormone === hormone.id 
                              ? 'border-purple-500 bg-purple-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{hormone.emoji}</div>
                            <div className="font-medium text-xs">{hormone.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{hormone.gland}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Selected Hormone Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {keyHormones.find(h => h.id === selectedHormone)?.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        {keyHormones.find(h => h.id === selectedHormone)?.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Produced by: {keyHormones.find(h => h.id === selectedHormone)?.gland} Gland
                      </p>
                    </div>

                    {/* Growth Stages */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Growth & Development Stages</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {growthStages.map((stage, index) => (
                          <motion.button
                            key={stage.stage}
                            onClick={() => setGrowthStage(index)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              growthStage === index
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-center">
                              <div className="font-medium text-sm">{stage.name}</div>
                              <div className="text-xs text-gray-600">{stage.age}</div>
                              <div className="text-xs text-gray-500 mt-1">{stage.height}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                        <h6 className="font-semibold text-gray-900 mb-2">
                          {growthStages[growthStage].name} Stage
                        </h6>
                        <p className="text-sm text-gray-600">
                          {growthStages[growthStage].description}
                        </p>
                      </div>
                    </div>

                    {/* Mood & Energy Simulator */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Hormone Effects on Mood</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setMoodLevel(Math.max(1, moodLevel - 1))}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          😔 Lower
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {moodLevel <= 2 ? '😢' : 
                             moodLevel <= 4 ? '😐' : 
                             moodLevel <= 6 ? '🙂' : 
                             moodLevel <= 8 ? '😊' : '😄'}
                          </div>
                          <div className="text-sm text-gray-600">Mood Level: {moodLevel}/10</div>
                        </div>
                        
                        <button
                          onClick={() => setMoodLevel(Math.min(10, moodLevel + 1))}
                          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                        >
                          😄 Higher
                        </button>
                      </div>
                      
                      {/* Mood Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            moodLevel <= 3 ? 'bg-red-500' :
                            moodLevel <= 6 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${moodLevel * 10}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setHormoneFlowActive(!hormoneFlowActive)}
                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
                      >
                        {hormoneFlowActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{hormoneFlowActive ? 'Pause' : 'Start'} Hormone Flow</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
              href="/discovery/kidneys"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Kidneys</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
