'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Droplets, 
  Play, 
  Pause,
  Filter,
  Beaker,
  Gauge,
  Lightbulb,
  Waves
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

export default function KidneysDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [filtrationActive, setFiltrationActive] = useState(true)
  const [hydrationLevel, setHydrationLevel] = useState(70)
  const [filterStage, setFilterStage] = useState(0)
  const [waterIntake, setWaterIntake] = useState(6)

  const filtrationStages = [
    { stage: 0, name: 'Blood Entry', description: 'Blood enters the kidney through arteries', time: 'Continuous', emoji: '🩸' },
    { stage: 1, name: 'Filtration', description: 'Nephrons filter waste from blood', time: '1-2 minutes', emoji: '🔍' },
    { stage: 2, name: 'Reabsorption', description: 'Useful substances are saved', time: '2-3 minutes', emoji: '♻️' },
    { stage: 3, name: 'Concentration', description: 'Urine is concentrated to save water', time: '3-5 minutes', emoji: '💧' },
    { stage: 4, name: 'Collection', description: 'Waste is collected in the bladder', time: '5+ minutes', emoji: '🫧' }
  ]

  const kidneyFunctions = [
    { function: 'filter', name: 'Blood Filtration', description: 'Removes waste and toxins', efficiency: '99%', icon: Filter },
    { function: 'balance', name: 'Water Balance', description: 'Controls body fluid levels', efficiency: '95%', icon: Droplets },
    { function: 'pressure', name: 'Blood Pressure', description: 'Helps regulate blood pressure', efficiency: '90%', icon: Gauge },
    { function: 'minerals', name: 'Mineral Balance', description: 'Maintains electrolyte levels', efficiency: '98%', icon: Beaker }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Kidneys',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible filtration system - their amazing kidneys! These bean-shaped organs work like the world's most sophisticated water treatment plants, cleaning their blood 24/7 and keeping their body's chemistry perfectly balanced. Every drop of blood in their body gets filtered by their kidneys about 40 times each day!",
        wonderFact: "Your child's kidneys filter about 50 gallons of blood every single day - that's enough to fill a bathtub!",
        visual: '🫘',
        ageAdaptation: {
          '0-2': "Your baby's kidneys are still developing and learning to concentrate urine efficiently!",
          '3-5': "Your child's kidneys are working hard to keep them hydrated and healthy during active play!",
          '6-12': "Your child's kidneys are becoming very efficient at filtering waste and maintaining balance!",
          '13+': "Your teenager's kidneys are working at full adult capacity, processing lots of fluids!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Kidneys Work',
      type: 'interactive',
      content: {
        explanation: "The kidneys work like amazing filtration plants with millions of tiny filters called nephrons! Blood flows in, gets cleaned of waste and excess water, and the good stuff gets sent back to the body while waste becomes urine.",
        interactive: true,
        filtrationProcess: filtrationStages,
        kidneyFunctions: kidneyFunctions
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Kidney Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your kidneys filter 50 gallons of blood every day",
            explanation: "That's like cleaning a bathtub full of blood every single day!",
            visual: "🛁"
          },
          {
            fact: "Each kidney has about 1 million tiny filters",
            explanation: "These nephrons are so small you'd need a microscope to see them!",
            visual: "🔬"
          },
          {
            fact: "You can live normally with just one kidney",
            explanation: "One healthy kidney can do the work of two if needed!",
            visual: "💪"
          },
          {
            fact: "Your kidneys help make red blood cells",
            explanation: "They release a hormone that tells your body to make more blood!",
            visual: "🔴"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Kidney Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Hydration Station Challenge",
            description: "Learn about proper hydration and track water intake",
            materials: ["Water bottles", "Hydration chart", "Timer", "Measuring cups"],
            steps: [
              "Calculate daily water needs based on age and activity",
              "Track water intake throughout the day",
              "Notice how urine color changes with hydration",
              "Create reminders to drink water regularly"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding hydration needs and kidney health"
          },
          {
            title: "Kidney-Friendly Cooking Lab",
            description: "Prepare foods that support kidney health",
            materials: ["Low-sodium ingredients", "Fresh fruits and vegetables", "Cooking utensils", "Recipe cards"],
            steps: [
              "Learn which foods are good for kidney health",
              "Practice reading nutrition labels for sodium content",
              "Prepare kidney-friendly snacks and meals",
              "Create a weekly kidney-healthy meal plan"
            ],
            ageRange: "7+ years",
            learningGoal: "Understanding nutrition for kidney health"
          },
          {
            title: "Filtration Science Experiment",
            description: "Build a model kidney filter to understand how filtration works",
            materials: ["Coffee filters", "Sand", "Gravel", "Dirty water", "Clear containers"],
            steps: [
              "Layer different materials to create a filter system",
              "Pour dirty water through the filter layers",
              "Observe how each layer removes different particles",
              "Compare to how nephrons filter blood in real kidneys"
            ],
            ageRange: "6+ years",
            learningGoal: "Understanding filtration processes and kidney function"
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
                scale: filtrationActive ? [1, 1.05, 1] : 1,
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: filtrationActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating water droplets */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${15 + i * 9}%`,
                    top: `${20 + (i % 4) * 15}%`,
                  }}
                  animate={{
                    scale: filtrationActive ? [0.8, 1.2, 0.8] : 0.8,
                    opacity: filtrationActive ? [0.4, 0.8, 0.4] : 0.4,
                    y: [0, -30, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: filtrationActive ? Infinity : 0,
                    delay: i * 0.3
                  }}
                >
                  💧
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🛁</span>
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

            {/* Interactive Kidney Filtration */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 border border-blue-200">
                <div className="relative">
                  {/* Filtration Process */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Kidney Filtration Process</h4>
                    
                    {/* Filtration Stage Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                      {filtrationStages.map((stage, index) => (
                        <motion.button
                          key={stage.stage}
                          onClick={() => setFilterStage(index)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            filterStage === index 
                              ? 'border-blue-500 bg-blue-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-xl mb-1">{stage.emoji}</div>
                            <div className="font-medium text-xs">{stage.name}</div>
                            <div className="text-xs text-gray-600">{stage.time}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Current Stage Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {filtrationStages[filterStage].name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {filtrationStages[filterStage].description}
                      </p>
                    </div>

                    {/* Kidney Functions */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Kidney Functions</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kidneyFunctions.map((func, index) => {
                          const IconComponent = func.icon
                          return (
                            <motion.div
                              key={func.function}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-white rounded-xl border border-gray-200"
                            >
                              <div className="text-center">
                                <IconComponent className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <h6 className="font-medium text-gray-900 mb-1">{func.name}</h6>
                                <p className="text-xs text-gray-600 mb-2">{func.description}</p>
                                <div className="text-sm font-bold text-blue-600">
                                  {func.efficiency} Efficient
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Hydration Tracker */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Hydration Level</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setHydrationLevel(Math.max(0, hydrationLevel - 15))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Dehydrate
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{hydrationLevel}%</div>
                          <div className="text-sm text-gray-600">Hydration Level</div>
                        </div>
                        
                        <button
                          onClick={() => setHydrationLevel(Math.min(100, hydrationLevel + 15))}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Hydrate
                        </button>
                      </div>
                      
                      {/* Hydration Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            hydrationLevel < 30 ? 'bg-red-500' :
                            hydrationLevel < 70 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${hydrationLevel}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        {hydrationLevel < 30 ? 'Dehydrated - Drink more water!' :
                         hydrationLevel < 70 ? 'Moderately hydrated - Keep drinking!' :
                         'Well hydrated - Great job!'}
                      </div>
                    </div>

                    {/* Water Intake Counter */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Daily Water Intake</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                          className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                        >
                          - Glass
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-cyan-600">{waterIntake}</div>
                          <div className="text-sm text-gray-600">Glasses of Water</div>
                        </div>
                        
                        <button
                          onClick={() => setWaterIntake(Math.min(12, waterIntake + 1))}
                          className="bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors"
                        >
                          + Glass
                        </button>
                      </div>
                      
                      <div className="flex justify-center space-x-1 mb-4">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-8 rounded border-2 ${
                              i < waterIntake ? 'bg-cyan-400 border-cyan-500' : 'bg-gray-100 border-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        Recommended: 6-8 glasses per day
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setFiltrationActive(!filtrationActive)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        {filtrationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{filtrationActive ? 'Pause' : 'Start'} Filtration</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
              href="/discovery/learning"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
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
                      ? 'bg-blue-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
