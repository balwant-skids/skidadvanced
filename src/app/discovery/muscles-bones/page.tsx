'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Play, 
  Pause,
  Activity,
  Dumbbell,
  Bone,
  Lightbulb,
  RotateCcw
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

export default function MusclesBonesDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [muscleContractionActive, setMuscleContractionActive] = useState(true)
  const [selectedBone, setSelectedBone] = useState('femur')
  const [strengthLevel, setStrengthLevel] = useState(50)
  const [skeletonView, setSkeletonView] = useState('full')

  const majorBones = [
    { id: 'skull', name: 'Skull', description: 'Protects the brain', strength: 'Very Strong', emoji: '🧠' },
    { id: 'ribs', name: 'Ribs', description: 'Protect heart and lungs', strength: 'Flexible', emoji: '🫁' },
    { id: 'spine', name: 'Spine', description: 'Supports the whole body', strength: 'Very Strong', emoji: '🦴' },
    { id: 'femur', name: 'Femur', description: 'Strongest bone in the body', strength: 'Strongest', emoji: '🦵' },
    { id: 'humerus', name: 'Humerus', description: 'Upper arm bone', strength: 'Strong', emoji: '💪' }
  ]

  const muscleTypes = [
    { type: 'skeletal', name: 'Skeletal Muscles', description: 'Muscles you control for movement', count: '600+', color: '#FF6B6B' },
    { type: 'cardiac', name: 'Cardiac Muscle', description: 'Heart muscle that never stops', count: '1', color: '#FF4757' },
    { type: 'smooth', name: 'Smooth Muscles', description: 'Automatic muscles in organs', count: 'Many', color: '#FF3838' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Muscles & Bones',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible framework and power system - their amazing muscles and bones! Together, these create a living, growing structure that's stronger than steel yet flexible enough to dance, run, and play. Your child's skeleton provides the framework while over 600 muscles provide the power to move through the world with grace and strength!",
        wonderFact: "Your child's bones are 5 times stronger than steel of the same weight, yet they're light enough to let them jump and run!",
        visual: '🦴',
        ageAdaptation: {
          '0-2': "Your baby's bones are still soft and growing - that's why they're so flexible and need gentle care!",
          '3-5': "Your child's muscles and bones are getting stronger every day through play and movement!",
          '6-12': "Your child's skeleton is growing rapidly and their muscles are developing coordination and strength!",
          '13+': "Your teenager's bones are reaching adult strength and their muscles can develop serious power!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Muscles & Bones Work',
      type: 'interactive',
      content: {
        explanation: "Muscles and bones work together like a sophisticated machine! Bones provide the framework and leverage, while muscles contract and relax to create movement. It's like having 600+ tiny motors attached to a flexible steel frame!",
        interactive: true,
        boneSystem: majorBones,
        muscleSystem: muscleTypes
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Muscle & Bone Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "You have over 600 muscles in your body",
            explanation: "That's more muscles than there are Pokemon in the original games!",
            visual: "💪"
          },
          {
            fact: "Your bones are 5 times stronger than steel",
            explanation: "Yet they're light enough to let you jump and run with ease!",
            visual: "🏗️"
          },
          {
            fact: "Your largest muscle is in your bottom",
            explanation: "The gluteus maximus helps you walk, run, and climb stairs!",
            visual: "🍑"
          },
          {
            fact: "Babies are born with 270 bones",
            explanation: "Many fuse together as they grow, leaving adults with 206 bones!",
            visual: "👶"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Muscle & Bone Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Strength Building Challenge",
            description: "Build muscle strength through fun, age-appropriate exercises",
            materials: ["Exercise mat", "Light weights or water bottles", "Timer", "Progress chart"],
            steps: [
              "Start with bodyweight exercises like push-ups and squats",
              "Use light weights or water bottles for resistance",
              "Track progress with a strength chart",
              "Celebrate improvements in strength and endurance"
            ],
            ageRange: "5+ years",
            learningGoal: "Building muscle strength and understanding exercise benefits"
          },
          {
            title: "Posture Detective Game",
            description: "Learn about good posture and spinal health",
            materials: ["Mirror", "Posture chart", "Camera", "Measuring tape"],
            steps: [
              "Check posture in the mirror using a posture guide",
              "Practice proper sitting and standing positions",
              "Take photos to track posture improvements",
              "Create ergonomic workspaces for homework"
            ],
            ageRange: "6+ years",
            learningGoal: "Understanding spinal health and proper body mechanics"
          },
          {
            title: "Calcium-Rich Cooking Lab",
            description: "Cook foods that help build strong bones",
            materials: ["Calcium-rich ingredients", "Cooking utensils", "Recipe cards", "Nutrition labels"],
            steps: [
              "Learn which foods are high in calcium and vitamin D",
              "Prepare bone-healthy snacks and meals",
              "Read nutrition labels to find calcium content",
              "Create a weekly bone-healthy meal plan"
            ],
            ageRange: "7+ years",
            learningGoal: "Understanding nutrition for bone health"
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
                scale: muscleContractionActive ? [1, 1.1, 1] : 1,
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: muscleContractionActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating muscle fibers */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${15 + i * 9}%`,
                    top: `${20 + (i % 4) * 15}%`,
                  }}
                  animate={{
                    scale: muscleContractionActive ? [0.8, 1.4, 0.8] : 0.8,
                    opacity: muscleContractionActive ? [0.3, 0.8, 0.3] : 0.3,
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: muscleContractionActive ? Infinity : 0,
                    delay: i * 0.2
                  }}
                >
                  💪
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏗️</span>
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

            {/* Interactive Skeleton & Muscle System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl p-8 border border-red-200">
                <div className="relative">
                  {/* Skeleton Viewer */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Explore Your Skeleton</h4>
                    
                    {/* Bone Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                      {majorBones.map((bone) => (
                        <motion.button
                          key={bone.id}
                          onClick={() => setSelectedBone(bone.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedBone === bone.id 
                              ? 'border-red-500 bg-red-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{bone.emoji}</div>
                            <div className="font-medium text-xs">{bone.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{bone.strength}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Selected Bone Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {majorBones.find(b => b.id === selectedBone)?.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {majorBones.find(b => b.id === selectedBone)?.description}
                      </p>
                    </div>

                    {/* Muscle Types */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Types of Muscles</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {muscleTypes.map((muscle, index) => (
                          <motion.div
                            key={muscle.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200"
                            style={{ borderLeftColor: muscle.color, borderLeftWidth: '4px' }}
                          >
                            <h6 className="font-medium text-gray-900 mb-1">{muscle.name}</h6>
                            <p className="text-xs text-gray-600 mb-2">{muscle.description}</p>
                            <div className="text-sm font-bold" style={{ color: muscle.color }}>
                              Count: {muscle.count}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Strength Meter */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Muscle Strength Level</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setStrengthLevel(Math.max(0, strengthLevel - 10))}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Weaker
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">{strengthLevel}%</div>
                          <div className="text-sm text-gray-600">Strength Level</div>
                        </div>
                        
                        <button
                          onClick={() => setStrengthLevel(Math.min(100, strengthLevel + 10))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Stronger
                        </button>
                      </div>
                      
                      {/* Strength Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${strengthLevel}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setMuscleContractionActive(!muscleContractionActive)}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        {muscleContractionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{muscleContractionActive ? 'Pause' : 'Start'} Muscle Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-600 rounded-xl flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
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
              href="/discovery/immune"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Immune System</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-orange-600 h-2 rounded-full"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
