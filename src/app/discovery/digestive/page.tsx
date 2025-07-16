'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Smile, 
  Play, 
  Pause,
  Apple,
  Clock,
  BookOpen,
  Activity,
  Users,
  Home,
  Lightbulb,
  Route
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

export default function DigestiveDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [digestionActive, setDigestionActive] = useState(true)
  const [foodJourneyStep, setFoodJourneyStep] = useState(0)
  const [nutritionTrackerActive, setNutritionTrackerActive] = useState(false)

  const foodJourneySteps = [
    { step: 1, location: "Mouth", description: "Teeth chew and saliva starts breaking down food", duration: "30 seconds", emoji: "👄" },
    { step: 2, location: "Esophagus", description: "Food travels down the food tube to the stomach", duration: "10 seconds", emoji: "🔽" },
    { step: 3, location: "Stomach", description: "Powerful acids break down food into smaller pieces", duration: "2-4 hours", emoji: "🫃" },
    { step: 4, location: "Small Intestine", description: "Nutrients are absorbed into the bloodstream", duration: "3-5 hours", emoji: "🌀" },
    { step: 5, location: "Large Intestine", description: "Water is absorbed and waste is prepared", duration: "12-48 hours", emoji: "📦" },
    { step: 6, location: "Exit", description: "Waste leaves the body", duration: "Final step", emoji: "🚽" }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Digestive System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible food factory - their amazing digestive system! This sophisticated network of organs works like the world's most efficient processing plant, taking the food your child eats and transforming it into energy and building blocks for their growing body. It's a 30-foot-long journey that happens automatically every time they eat!",
        wonderFact: "Your child's digestive system is about 30 feet long when stretched out - that's longer than a school bus!",
        visual: '🍎',
        ageAdaptation: {
          '0-2': "Your baby's digestive system is still learning and developing - that's why they need special foods that are easy to digest!",
          '3-5': "Your child's digestive system is getting stronger and can handle more types of foods every day!",
          '6-12': "Your child's digestive system works like a powerful factory, turning food into energy for running, playing, and growing!",
          '13+': "Your teenager's digestive system is almost fully mature and can process complex foods efficiently!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Digestive System Works',
      type: 'interactive',
      content: {
        explanation: "The digestive system works like an amazing assembly line! Food enters through your mouth, travels down a long tube, gets processed in different stations, and nutrients get delivered throughout your body while waste gets packaged for removal.",
        interactive: true,
        journeySteps: foodJourneySteps
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Digestive Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your digestive system is 30 feet long",
            explanation: "If you could stretch it out, it would be longer than a school bus!",
            visual: "🚌"
          },
          {
            fact: "Stomach acid is stronger than vinegar",
            explanation: "It's so powerful it could dissolve metal, but your stomach lining protects you!",
            visual: "⚗️"
          },
          {
            fact: "Food takes 24-72 hours to fully digest",
            explanation: "That's 1-3 days for your body to process everything you eat!",
            visual: "⏰"
          },
          {
            fact: "Your small intestine has millions of tiny fingers",
            explanation: "These 'villi' help absorb nutrients - they're like tiny food collectors!",
            visual: "🤏"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Digestive Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Healthy Cooking Laboratory",
            description: "Become a nutrition scientist by preparing digestive-friendly foods",
            materials: ["Fresh fruits and vegetables", "Whole grains", "Cooking utensils", "Recipe cards"],
            steps: [
              "Choose colorful fruits and vegetables for different nutrients",
              "Prepare simple, healthy snacks together",
              "Talk about how each food helps your digestive system",
              "Create a weekly meal plan with digestive-healthy foods"
            ],
            ageRange: "4+ years",
            learningGoal: "Understanding nutrition and digestive health"
          },
          {
            title: "Digestion Timeline Game",
            description: "Track how long different foods take to digest through fun activities",
            materials: ["Timer", "Food cards", "Tracking chart", "Colored markers"],
            steps: [
              "Create cards for different types of foods",
              "Research and record how long each food takes to digest",
              "Make a timeline showing the digestion journey",
              "Play games guessing digestion times for different foods"
            ],
            ageRange: "6+ years",
            learningGoal: "Learning about digestion timing and food processing"
          },
          {
            title: "Digestive System Craft Project",
            description: "Build a model digestive system to understand how it works",
            materials: ["Cardboard tubes", "Balloons", "Plastic bags", "Colored paper", "Glue"],
            steps: [
              "Create each organ of the digestive system using craft materials",
              "Connect them in the correct order",
              "Use the model to show how food travels through the system",
              "Explain each organ's job in the digestion process"
            ],
            ageRange: "7+ years",
            learningGoal: "Understanding digestive system anatomy and function"
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
                rotate: digestionActive ? [0, 10, -10, 0] : 0,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: digestionActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating nutrition particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-70"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: digestionActive ? [0, -25, 0] : 0,
                    opacity: digestionActive ? [0.4, 0.9, 0.4] : 0.4,
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: digestionActive ? Infinity : 0,
                    delay: i * 0.3
                  }}
                >
                  {['🥕', '🥬', '🍊', '🫐', '🥑', '🍌', '🍎', '🥦'][i]}
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏭</span>
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

            {/* Interactive Food Journey */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 border border-green-200">
                <div className="relative">
                  {/* Food Journey Animation */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Follow the Food Journey!</h4>
                    
                    {/* Journey Progress */}
                    <div className="mb-8">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <motion.div
                          animate={{
                            scale: digestionActive ? [1, 1.2, 1] : 1,
                            rotate: [0, 360]
                          }}
                          transition={{
                            scale: { duration: 2, repeat: digestionActive ? Infinity : 0 },
                            rotate: { duration: 4, repeat: digestionActive ? Infinity : 0, ease: "linear" }
                          }}
                          className="text-4xl"
                        >
                          🍎
                        </motion.div>
                        <div className="text-2xl">→</div>
                        <div className="text-2xl font-bold text-green-600">
                          {foodJourneySteps[foodJourneyStep]?.location}
                        </div>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-lg text-gray-700 mb-2">
                          {foodJourneySteps[foodJourneyStep]?.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {foodJourneySteps[foodJourneyStep]?.duration}
                        </div>
                      </div>
                    </div>

                    {/* Journey Steps Visualization */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                      {foodJourneySteps.map((step, index) => (
                        <motion.div
                          key={step.step}
                          onClick={() => setFoodJourneyStep(index)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            foodJourneyStep === index
                              ? 'border-green-500 bg-green-50 scale-105'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{step.emoji}</div>
                            <div className="font-medium text-sm">{step.location}</div>
                            <div className="text-xs text-gray-600 mt-1">{step.duration}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setDigestionActive(!digestionActive)}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                      >
                        {digestionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{digestionActive ? 'Pause' : 'Start'} Digestion</span>
                      </button>
                      
                      <button
                        onClick={() => setFoodJourneyStep(Math.max(0, foodJourneyStep - 1))}
                        disabled={foodJourneyStep === 0}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous Step
                      </button>
                      
                      <button
                        onClick={() => setFoodJourneyStep(Math.min(foodJourneySteps.length - 1, foodJourneyStep + 1))}
                        disabled={foodJourneyStep === foodJourneySteps.length - 1}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next Step
                      </button>
                    </div>

                    {/* Digestion Timeline */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-4">Complete Digestion Timeline</h5>
                      <div className="space-y-3">
                        {foodJourneySteps.map((step, index) => (
                          <div
                            key={step.step}
                            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                              index <= foodJourneyStep ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="text-xl">{step.emoji}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{step.location}</div>
                              <div className="text-sm text-gray-600">{step.description}</div>
                            </div>
                            <div className="text-sm font-medium text-gray-700">{step.duration}</div>
                          </div>
                        ))}
                      </div>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              href="/discovery/heart"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Heart</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
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
                      ? 'bg-green-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
