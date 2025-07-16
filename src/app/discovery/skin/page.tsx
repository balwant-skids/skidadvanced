'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Play, 
  Pause,
  Thermometer,
  Droplets,
  Sun,
  BookOpen,
  Activity,
  Users,
  Home,
  Lightbulb,
  Zap
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

export default function SkinDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [touchSensitivityActive, setTouchSensitivityActive] = useState(true)
  const [selectedSkinLayer, setSelectedSkinLayer] = useState('epidermis')
  const [healingStage, setHealingStage] = useState(0)
  const [temperatureReading, setTemperatureReading] = useState(98.6)

  const skinLayers = [
    { id: 'epidermis', name: 'Epidermis', description: 'Outer protective layer', color: '#F3E5AB', depth: '0.1mm' },
    { id: 'dermis', name: 'Dermis', description: 'Middle layer with nerves and blood vessels', color: '#DEB887', depth: '1-2mm' },
    { id: 'hypodermis', name: 'Hypodermis', description: 'Deep fat layer for insulation', color: '#CD853F', depth: '2-3cm' }
  ]

  const healingStages = [
    { stage: 0, name: 'Injury', description: 'Cut or wound occurs', time: '0 minutes', emoji: '🩸' },
    { stage: 1, name: 'Clotting', description: 'Blood clots to stop bleeding', time: '5-10 minutes', emoji: '🔴' },
    { stage: 2, name: 'Inflammation', description: 'Area becomes red and swollen', time: '1-3 days', emoji: '🔥' },
    { stage: 3, name: 'Proliferation', description: 'New tissue grows', time: '3-21 days', emoji: '🌱' },
    { stage: 4, name: 'Remodeling', description: 'Scar tissue forms and strengthens', time: '21 days-2 years', emoji: '✨' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Skin',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible protective shield - their amazing skin! This remarkable organ is like a super-suit that covers their entire body, protecting them from germs, regulating temperature, and letting them feel the world around them. It's the largest organ in their body and works 24/7 to keep them safe and comfortable!",
        wonderFact: "Your child's skin completely replaces itself every 28 days - that means they get a brand new protective layer every month!",
        visual: '🛡️',
        ageAdaptation: {
          '0-2': "Your baby's skin is extra sensitive and soft - it's still learning to protect them from the world!",
          '3-5': "Your child's skin is getting stronger every day and loves to feel different textures and temperatures!",
          '6-12': "Your child's skin is becoming more resilient and can handle more adventures while keeping them safe!",
          '13+': "Your teenager's skin is going through changes as hormones affect oil production and sensitivity!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Skin Works',
      type: 'interactive',
      content: {
        explanation: "The skin works like an amazing multi-layered shield with built-in sensors, temperature control, and self-repair capabilities! It has three main layers that work together to protect, sense, and heal.",
        interactive: true,
        skinLayers: skinLayers,
        healingProcess: healingStages
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Skin Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Skin is the largest organ in your body",
            explanation: "It covers about 22 square feet in adults - that's like a large blanket!",
            visual: "📏"
          },
          {
            fact: "You shed 30,000-40,000 dead skin cells every minute",
            explanation: "That's about 9 pounds of dead skin cells every year!",
            visual: "❄️"
          },
          {
            fact: "Skin has over 1,000 nerve endings per square inch",
            explanation: "That's why you can feel the tiniest touch or change in temperature!",
            visual: "⚡"
          },
          {
            fact: "Skin completely renews itself every 28 days",
            explanation: "You literally get a brand new protective layer every month!",
            visual: "🔄"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Skin Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Touch Sensitivity Explorer",
            description: "Discover how amazing your sense of touch is through texture games",
            materials: ["Various textured materials", "Blindfold", "Small objects", "Temperature items"],
            steps: [
              "Collect items with different textures (smooth, rough, soft, hard)",
              "Close your eyes and feel each texture",
              "Describe what you feel and guess what the object is",
              "Try warm and cool objects to test temperature sensitivity"
            ],
            ageRange: "3+ years",
            learningGoal: "Understanding touch sensitivity and sensory processing"
          },
          {
            title: "Skin Care Science Lab",
            description: "Learn about protecting and caring for your skin",
            materials: ["Sunscreen", "Moisturizer", "UV-sensitive beads", "pH strips"],
            steps: [
              "Test how sunscreen blocks UV rays using UV beads",
              "Learn about proper handwashing technique",
              "Create a daily skin care routine chart",
              "Experiment with natural moisturizers like aloe vera"
            ],
            ageRange: "5+ years",
            learningGoal: "Learning skin health and protection strategies"
          },
          {
            title: "Wound Healing Timeline",
            description: "Track how your body heals cuts and scrapes",
            materials: ["Bandages", "Healing timeline chart", "Camera", "Journal"],
            steps: [
              "Document a small cut or scrape (with adult supervision)",
              "Take photos of the healing process over time",
              "Record observations about each healing stage",
              "Create a healing timeline poster"
            ],
            ageRange: "7+ years",
            learningGoal: "Understanding the body's natural healing processes"
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
                scale: touchSensitivityActive ? [1, 1.05, 1] : 1,
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: touchSensitivityActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating touch sensors */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: touchSensitivityActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: touchSensitivityActive ? [0.4, 0.9, 0.4] : 0.4,
                  }}
                  transition={{
                    duration: 2,
                    repeat: touchSensitivityActive ? Infinity : 0,
                    delay: i * 0.3
                  }}
                >
                  ✋
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔄</span>
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

            {/* Interactive Skin Layers */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 border border-orange-200">
                <div className="relative">
                  {/* Skin Layer Visualization */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Explore Skin Layers</h4>
                    
                    {/* Layer Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {skinLayers.map((layer) => (
                        <motion.button
                          key={layer.id}
                          onClick={() => setSelectedSkinLayer(layer.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedSkinLayer === layer.id 
                              ? 'border-orange-500 bg-orange-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: selectedSkinLayer === layer.id ? layer.color + '40' : 'white' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: layer.color }}></div>
                            <div className="font-medium text-sm">{layer.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{layer.depth}</div>
                            <div className="text-xs text-gray-500 mt-1">{layer.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Temperature Control Demo */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Temperature Regulation</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setTemperatureReading(Math.max(95, temperatureReading - 2))}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Cool Down
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">{temperatureReading}°F</div>
                          <div className="text-sm text-gray-600">Body Temperature</div>
                        </div>
                        
                        <button
                          onClick={() => setTemperatureReading(Math.min(102, temperatureReading + 2))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Heat Up
                        </button>
                      </div>
                      
                      {/* Temperature Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            temperatureReading < 97 ? 'bg-blue-500' :
                            temperatureReading > 100 ? 'bg-red-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${((temperatureReading - 95) / 7) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Wound Healing Animation */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Wound Healing Process</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {healingStages.map((stage, index) => (
                          <motion.button
                            key={stage.stage}
                            onClick={() => setHealingStage(index)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              healingStage === index
                                ? 'border-orange-500 bg-orange-50'
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
                      
                      <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                        <h6 className="font-semibold text-gray-900 mb-2">
                          {healingStages[healingStage].name}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {healingStages[healingStage].description}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setTouchSensitivityActive(!touchSensitivityActive)}
                        className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                      >
                        {touchSensitivityActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{touchSensitivityActive ? 'Pause' : 'Start'} Touch Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
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
              href="/discovery/muscles-bones"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Muscles & Bones</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-yellow-600 h-2 rounded-full"
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
                      ? 'bg-orange-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
