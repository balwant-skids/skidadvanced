'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Play, 
  Pause,
  Zap,
  Target,
  Siren,
  Lightbulb,
  Sword
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

export default function ImmuneDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [battleActive, setBattleActive] = useState(true)
  const [selectedDefender, setSelectedDefender] = useState('white-blood-cells')
  const [immuneStrength, setImmuneStrength] = useState(75)
  const [battleStage, setBattleStage] = useState(0)

  const immuneDefenders = [
    { id: 'white-blood-cells', name: 'White Blood Cells', description: 'First responders that attack germs', power: 'High', emoji: '⚪', color: '#E3F2FD' },
    { id: 'antibodies', name: 'Antibodies', description: 'Specialized weapons that remember enemies', power: 'Very High', emoji: '🎯', color: '#F3E5F5' },
    { id: 'lymph-nodes', name: 'Lymph Nodes', description: 'Filter stations that trap germs', power: 'Medium', emoji: '🔍', color: '#E8F5E8' },
    { id: 'bone-marrow', name: 'Bone Marrow', description: 'Factory that makes immune cells', power: 'Essential', emoji: '🏭', color: '#FFF3E0' }
  ]

  const battleStages = [
    { stage: 0, name: 'Invasion', description: 'Germs enter the body', time: '0 seconds', emoji: '🦠' },
    { stage: 1, name: 'Detection', description: 'Immune system spots the threat', time: '1-5 minutes', emoji: '👁️' },
    { stage: 2, name: 'Alert', description: 'Warning signals sent throughout body', time: '5-15 minutes', emoji: '🚨' },
    { stage: 3, name: 'Attack', description: 'White blood cells rush to fight', time: '15 minutes-hours', emoji: '⚔️' },
    { stage: 4, name: 'Victory', description: 'Germs defeated, body protected', time: 'Hours-days', emoji: '🏆' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Immune System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible defense force - their amazing immune system! This sophisticated army works 24/7 to protect them from germs, viruses, and other invaders. It's like having millions of tiny superheroes patrolling their body, ready to fight off any threat and keep them healthy and strong!",
        wonderFact: "Your child's immune system can remember every germ it has ever fought, creating a library of millions of different enemies!",
        visual: '🛡️',
        ageAdaptation: {
          '0-2': "Your baby's immune system is still learning and building its defenses with help from you!",
          '3-5': "Your child's immune system is getting stronger and learning to fight new germs every day!",
          '6-12': "Your child's immune system is becoming very sophisticated and can handle most threats!",
          '13+': "Your teenager's immune system is nearly as strong as an adult's and very effective!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Immune System Works',
      type: 'interactive',
      content: {
        explanation: "The immune system works like an amazing army with different types of soldiers, each with special jobs! When germs invade, the immune system detects them, sounds the alarm, and sends the right defenders to fight and win the battle.",
        interactive: true,
        defenders: immuneDefenders,
        battleProcess: battleStages
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Immune System Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your immune system has a memory better than a computer",
            explanation: "It can remember millions of different germs and how to fight them!",
            visual: "🧠"
          },
          {
            fact: "You make 25 billion new white blood cells every day",
            explanation: "That's like creating a new army every single day!",
            visual: "⚪"
          },
          {
            fact: "Your immune system can tell the difference between you and invaders",
            explanation: "It knows which cells belong to you and which are enemies!",
            visual: "🔍"
          },
          {
            fact: "Fever is your immune system fighting harder",
            explanation: "Higher temperature helps your immune cells work better and makes germs weaker!",
            visual: "🌡️"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Immune System Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Germ Battle Simulation",
            description: "Act out how your immune system fights germs",
            materials: ["Colored balls or toys", "Timer", "Battle arena (room)", "Score sheet"],
            steps: [
              "Assign roles: germs (red balls) and immune cells (white balls)",
              "Germs try to 'invade' while immune cells defend",
              "Time how long it takes immune cells to catch all germs",
              "Discuss how real immune battles work in the body"
            ],
            ageRange: "4+ years",
            learningGoal: "Understanding immune system defense mechanisms"
          },
          {
            title: "Hygiene Hero Training",
            description: "Learn habits that help your immune system stay strong",
            materials: ["Soap", "Hand sanitizer", "UV light (optional)", "Hygiene chart"],
            steps: [
              "Practice proper handwashing technique for 20 seconds",
              "Learn when and how to use hand sanitizer",
              "Create a daily hygiene routine checklist",
              "Track healthy habits that boost immunity"
            ],
            ageRange: "3+ years",
            learningGoal: "Developing healthy hygiene habits"
          },
          {
            title: "Immune-Boosting Nutrition Lab",
            description: "Cook foods that help strengthen your immune system",
            materials: ["Vitamin C foods", "Zinc-rich foods", "Cooking utensils", "Nutrition guide"],
            steps: [
              "Learn which nutrients boost immune function",
              "Prepare colorful, nutrient-rich snacks and meals",
              "Create a rainbow plate with different colored foods",
              "Plan weekly menus focused on immune health"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding nutrition's role in immune health"
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
                scale: battleActive ? [1, 1.1, 1] : 1,
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: battleActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating immune cells */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${15 + i * 9}%`,
                    top: `${20 + (i % 4) * 15}%`,
                  }}
                  animate={{
                    scale: battleActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: battleActive ? [0.4, 0.9, 0.4] : 0.4,
                    x: [0, 20, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: battleActive ? Infinity : 0,
                    delay: i * 0.25
                  }}
                >
                  ⚪
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🧠</span>
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

            {/* Interactive Immune Battle */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 border border-blue-200">
                <div className="relative">
                  {/* Immune Defenders */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Meet Your Immune Defenders</h4>
                    
                    {/* Defender Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {immuneDefenders.map((defender) => (
                        <motion.button
                          key={defender.id}
                          onClick={() => setSelectedDefender(defender.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedDefender === defender.id 
                              ? 'border-blue-500 bg-blue-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: selectedDefender === defender.id ? defender.color : 'white' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{defender.emoji}</div>
                            <div className="font-medium text-sm">{defender.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{defender.power}</div>
                            <div className="text-xs text-gray-500 mt-1">{defender.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Battle Timeline */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Immune Battle Timeline</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {battleStages.map((stage, index) => (
                          <motion.button
                            key={stage.stage}
                            onClick={() => setBattleStage(index)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              battleStage === index
                                ? 'border-blue-500 bg-blue-50'
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
                          {battleStages[battleStage].name}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {battleStages[battleStage].description}
                        </p>
                      </div>
                    </div>

                    {/* Immune Strength Meter */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Immune System Strength</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setImmuneStrength(Math.max(0, immuneStrength - 15))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Weaken
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{immuneStrength}%</div>
                          <div className="text-sm text-gray-600">Immune Strength</div>
                        </div>
                        
                        <button
                          onClick={() => setImmuneStrength(Math.min(100, immuneStrength + 15))}
                          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                        >
                          Strengthen
                        </button>
                      </div>
                      
                      {/* Strength Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            immuneStrength < 30 ? 'bg-red-500' :
                            immuneStrength < 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${immuneStrength}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        {immuneStrength < 30 ? 'Weak - Need more rest and nutrition!' :
                         immuneStrength < 70 ? 'Good - Keep up healthy habits!' :
                         'Excellent - Your immune system is strong!'}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setBattleActive(!battleActive)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        {battleActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{battleActive ? 'Pause' : 'Start'} Battle Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              href="/discovery/hormones"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Hormones</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
