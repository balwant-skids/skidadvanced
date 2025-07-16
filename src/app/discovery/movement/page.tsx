'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Play, 
  Pause,
  Target,
  Hand,
  Footprints,
  Lightbulb,
  Activity,
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

export default function MovementDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [movementActive, setMovementActive] = useState(true)
  const [selectedMotorSkill, setSelectedMotorSkill] = useState('gross')
  const [coordinationLevel, setCoordinationLevel] = useState(75)
  const [balanceScore, setBalanceScore] = useState(80)

  const motorSkillTypes = [
    { 
      id: 'gross', 
      name: 'Gross Motor Skills', 
      description: 'Large muscle movements like running and jumping', 
      examples: ['Walking', 'Running', 'Jumping', 'Climbing'],
      emoji: '🏃',
      color: '#FF6B6B'
    },
    { 
      id: 'fine', 
      name: 'Fine Motor Skills', 
      description: 'Small muscle movements like writing and drawing', 
      examples: ['Writing', 'Drawing', 'Buttoning', 'Cutting'],
      emoji: '✏️',
      color: '#4ECDC4'
    }
  ]

  const developmentMilestones = [
    { age: '0-6 months', gross: 'Lifting head, rolling over', fine: 'Grasping objects, bringing hands to mouth', emoji: '👶' },
    { age: '6-12 months', gross: 'Sitting, crawling, pulling to stand', fine: 'Pincer grasp, transferring objects', emoji: '🍼' },
    { age: '1-2 years', gross: 'Walking, running, climbing stairs', fine: 'Scribbling, stacking blocks', emoji: '🚶' },
    { age: '2-3 years', gross: 'Jumping, pedaling tricycle', fine: 'Drawing circles, using utensils', emoji: '🚲' },
    { age: '3-4 years', gross: 'Hopping, throwing ball', fine: 'Cutting with scissors, copying shapes', emoji: '⚽' },
    { age: '4-5 years', gross: 'Skipping, balancing on one foot', fine: 'Writing letters, tying shoes', emoji: '🎯' },
    { age: '5+ years', gross: 'Complex sports movements', fine: 'Detailed drawing, typing', emoji: '🏆' }
  ]

  const coordinationActivities = [
    { activity: 'balance-beam', name: 'Balance Beam', description: 'Walking on narrow surfaces', difficulty: 'Medium', benefit: 'Balance & Core Strength' },
    { activity: 'hopscotch', name: 'Hopscotch', description: 'Hopping and jumping patterns', difficulty: 'Easy', benefit: 'Coordination & Planning' },
    { activity: 'juggling', name: 'Juggling', description: 'Keeping multiple objects in air', difficulty: 'Hard', benefit: 'Hand-Eye Coordination' },
    { activity: 'dance', name: 'Dancing', description: 'Moving to rhythm and music', difficulty: 'Medium', benefit: 'Rhythm & Body Awareness' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Movement System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible movement center - their amazing motor development system! This sophisticated network coordinates muscles, balance, and coordination to help them move through the world with grace and skill. From their first steps to complex sports movements, their motor skills are constantly growing and improving!",
        wonderFact: "Your child's brain creates new movement patterns every time they practice a skill - that's why 'practice makes perfect' really works!",
        visual: '🏃',
        ageAdaptation: {
          '0-2': "Your baby's movement system is rapidly developing from reflexes to intentional movements like crawling and walking!",
          '3-5': "Your child's motor skills are exploding with running, jumping, drawing, and complex play movements!",
          '6-12': "Your child's movement abilities are becoming refined with sports skills, handwriting, and precise coordination!",
          '13+': "Your teenager's motor system can perform complex athletic movements and fine detailed work!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Movement System Works',
      type: 'interactive',
      content: {
        explanation: "The movement system works like an amazing coordination center! Your brain plans movements, sends signals to muscles, uses feedback from your senses, and constantly adjusts to create smooth, purposeful actions.",
        interactive: true,
        motorTypes: motorSkillTypes,
        milestones: developmentMilestones,
        activities: coordinationActivities
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Movement Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your brain creates new movement patterns with practice",
            explanation: "Every time you practice a skill, your brain builds stronger pathways for that movement!",
            visual: "🧠"
          },
          {
            fact: "Balance uses input from 3 different systems",
            explanation: "Your eyes, inner ears, and body sensors all work together to keep you upright!",
            visual: "⚖️"
          },
          {
            fact: "Fine motor skills develop from center outward",
            explanation: "Children gain control of their shoulders first, then arms, then hands and fingers!",
            visual: "👋"
          },
          {
            fact: "Cross-lateral movements boost brain development",
            explanation: "Activities that cross the body's midline help connect the brain's hemispheres!",
            visual: "🤸"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Movement Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Coordination Challenge Course",
            description: "Build obstacle courses to develop gross motor skills",
            materials: ["Cones or markers", "Balance beam or tape", "Balls", "Hula hoops", "Jump rope"],
            steps: [
              "Set up stations with different movement challenges",
              "Include jumping, balancing, throwing, and crawling",
              "Time completion and track improvements",
              "Modify difficulty based on age and ability"
            ],
            ageRange: "3+ years",
            learningGoal: "Developing gross motor coordination and planning skills"
          },
          {
            title: "Fine Motor Skill Workshop",
            description: "Practice precise hand and finger movements",
            materials: ["Playdough", "Tweezers", "Beads", "Scissors", "Drawing materials"],
            steps: [
              "Start with playdough exercises to strengthen hands",
              "Practice picking up small objects with tweezers",
              "String beads to develop pincer grasp",
              "Progress to cutting and detailed drawing activities"
            ],
            ageRange: "2+ years",
            learningGoal: "Strengthening fine motor control and dexterity"
          },
          {
            title: "Balance and Body Awareness Games",
            description: "Improve balance, coordination, and spatial awareness",
            materials: ["Balance board", "Yoga mat", "Music", "Blindfold", "Various textures"],
            steps: [
              "Practice standing on one foot with eyes open, then closed",
              "Try yoga poses that challenge balance",
              "Walk on different textures to develop proprioception",
              "Play games that require body awareness and control"
            ],
            ageRange: "4+ years",
            learningGoal: "Enhancing balance, proprioception, and body awareness"
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
                scale: movementActive ? [1, 1.1, 1] : 1,
                x: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: movementActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating movement icons */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: movementActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: movementActive ? [0.4, 0.9, 0.4] : 0.4,
                    x: [0, 15, -15, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: movementActive ? Infinity : 0,
                    delay: i * 0.3
                  }}
                >
                  {['🤸', '⚽', '🎯', '✏️', '🏃', '🤹'][i]}
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
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

            {/* Interactive Movement System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl p-8 border border-violet-200">
                <div className="relative">
                  {/* Motor Skill Types */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Types of Motor Skills</h4>
                    
                    {/* Motor Skill Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {motorSkillTypes.map((skill) => (
                        <motion.button
                          key={skill.id}
                          onClick={() => setSelectedMotorSkill(skill.id)}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            selectedMotorSkill === skill.id 
                              ? 'border-violet-500 bg-violet-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-3">{skill.emoji}</div>
                            <h5 className="font-medium text-lg mb-2">{skill.name}</h5>
                            <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {skill.examples.map((example, i) => (
                                <span key={i} className="text-xs bg-white px-2 py-1 rounded-full border">
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Development Milestones */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Development Milestones</h5>
                      <div className="space-y-4">
                        {developmentMilestones.map((milestone, index) => (
                          <motion.div
                            key={milestone.age}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200"
                          >
                            <div className="text-3xl">{milestone.emoji}</div>
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900 mb-1">{milestone.age}</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-red-600">Gross Motor: </span>
                                  <span className="text-gray-600">{milestone.gross}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-teal-600">Fine Motor: </span>
                                  <span className="text-gray-600">{milestone.fine}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Coordination Activities */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Coordination Building Activities</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {coordinationActivities.map((activity, index) => (
                          <motion.div
                            key={activity.activity}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200 text-center"
                          >
                            <h6 className="font-medium text-gray-900 mb-2">{activity.name}</h6>
                            <p className="text-xs text-gray-600 mb-3">{activity.description}</p>
                            <div className="space-y-2">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                activity.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {activity.difficulty}
                              </div>
                              <div className="text-xs text-violet-600 font-medium">
                                {activity.benefit}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Coordination Level */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Coordination Level</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setCoordinationLevel(Math.max(0, coordinationLevel - 15))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Less Coordinated
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-violet-600">{coordinationLevel}%</div>
                          <div className="text-sm text-gray-600">Coordination</div>
                        </div>
                        
                        <button
                          onClick={() => setCoordinationLevel(Math.min(100, coordinationLevel + 15))}
                          className="bg-violet-500 text-white px-4 py-2 rounded-full hover:bg-violet-600 transition-colors"
                        >
                          More Coordinated
                        </button>
                      </div>
                      
                      {/* Coordination Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            coordinationLevel < 30 ? 'bg-red-500' :
                            coordinationLevel < 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${coordinationLevel}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Balance Score */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Balance Skills</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setBalanceScore(Math.max(0, balanceScore - 10))}
                          className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                        >
                          Wobbly
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">{balanceScore}%</div>
                          <div className="text-sm text-gray-600">Balance Score</div>
                        </div>
                        
                        <button
                          onClick={() => setBalanceScore(Math.min(100, balanceScore + 10))}
                          className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
                        >
                          Steady
                        </button>
                      </div>
                      
                      {/* Balance Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-purple-400 to-violet-600 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${balanceScore}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setMovementActive(!movementActive)}
                        className="flex items-center space-x-2 bg-violet-500 text-white px-4 py-2 rounded-full hover:bg-violet-600 transition-colors"
                      >
                        {movementActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{movementActive ? 'Pause' : 'Start'} Movement Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
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
              href="/discovery/senses"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Senses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
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
                      ? 'bg-violet-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
