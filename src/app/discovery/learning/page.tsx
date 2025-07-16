'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Play, 
  Pause,
  Target,
  Puzzle,
  BookOpen,
  Lightbulb,
  Zap,
  Clock
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

export default function LearningDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [learningActive, setLearningActive] = useState(true)
  const [selectedLearningStyle, setSelectedLearningStyle] = useState('visual')
  const [attentionSpan, setAttentionSpan] = useState(15)
  const [memoryStage, setMemoryStage] = useState(0)

  const learningStyles = [
    { id: 'visual', name: 'Visual Learner', description: 'Learns best through seeing and images', percentage: '65%', emoji: '👁️', color: '#4CAF50' },
    { id: 'auditory', name: 'Auditory Learner', description: 'Learns best through hearing and sounds', percentage: '30%', emoji: '👂', color: '#2196F3' },
    { id: 'kinesthetic', name: 'Kinesthetic Learner', description: 'Learns best through movement and touch', percentage: '5%', emoji: '🤲', color: '#FF9800' }
  ]

  const memoryStages = [
    { stage: 0, name: 'Encoding', description: 'Information enters the brain', time: '0-3 seconds', emoji: '📥' },
    { stage: 1, name: 'Short-term Memory', description: 'Information held temporarily', time: '15-30 seconds', emoji: '⏱️' },
    { stage: 2, name: 'Working Memory', description: 'Information is actively processed', time: '2-10 minutes', emoji: '⚙️' },
    { stage: 3, name: 'Long-term Storage', description: 'Information stored permanently', time: 'Minutes to lifetime', emoji: '🏛️' },
    { stage: 4, name: 'Retrieval', description: 'Information is recalled when needed', time: 'Instant to minutes', emoji: '🔍' }
  ]

  const cognitiveSkills = [
    { skill: 'attention', name: 'Attention & Focus', description: 'Ability to concentrate on tasks', level: 75, icon: Target },
    { skill: 'memory', name: 'Memory', description: 'Storing and recalling information', level: 80, icon: Brain },
    { skill: 'problem-solving', name: 'Problem Solving', description: 'Finding solutions to challenges', level: 70, icon: Puzzle },
    { skill: 'processing', name: 'Processing Speed', description: 'How quickly information is understood', level: 65, icon: Zap }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Learning Brain',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible learning machine - their amazing cognitive system! This sophisticated network of brain processes helps them think, remember, solve problems, and understand the world around them. Every day, their brain creates new connections and pathways that make learning faster and more efficient!",
        wonderFact: "Your child's brain forms 1 million new neural connections every second during early development - that's like building a superhighway of learning!",
        visual: '🧠',
        ageAdaptation: {
          '0-2': "Your baby's brain is rapidly developing basic cognitive skills like recognition and simple problem-solving!",
          '3-5': "Your child's brain is developing executive functions like attention, memory, and self-control!",
          '6-12': "Your child's brain is mastering complex thinking skills like reasoning, planning, and abstract thought!",
          '13+': "Your teenager's brain is developing advanced cognitive abilities and critical thinking skills!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Learning Brain Works',
      type: 'interactive',
      content: {
        explanation: "The learning brain works like an amazing information processing center! It takes in information through the senses, processes it in working memory, stores important parts in long-term memory, and retrieves it when needed.",
        interactive: true,
        learningStyles: learningStyles,
        memoryProcess: memoryStages,
        cognitiveSkills: cognitiveSkills
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Learning Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Your brain forms 1 million new connections every second",
            explanation: "During early development, your brain is constantly building new learning pathways!",
            visual: "⚡"
          },
          {
            fact: "You can only hold 7±2 items in working memory",
            explanation: "That's why phone numbers are usually 7 digits - it's the limit of what we can remember at once!",
            visual: "📱"
          },
          {
            fact: "Sleep helps consolidate memories",
            explanation: "While you sleep, your brain transfers important information from short-term to long-term memory!",
            visual: "😴"
          },
          {
            fact: "Everyone has a unique learning style",
            explanation: "Some learn best by seeing, others by hearing, and some by doing - discover yours!",
            visual: "🎨"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Learning Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Learning Style Discovery Lab",
            description: "Discover your unique learning style and optimize study techniques",
            materials: ["Learning style assessment", "Various study materials", "Timer", "Progress tracker"],
            steps: [
              "Take a learning style assessment to identify preferences",
              "Try different study methods (visual, auditory, kinesthetic)",
              "Track which methods work best for different subjects",
              "Create a personalized learning strategy toolkit"
            ],
            ageRange: "6+ years",
            learningGoal: "Understanding personal learning preferences and optimizing study habits"
          },
          {
            title: "Memory Palace Builder",
            description: "Learn ancient memory techniques to improve recall",
            materials: ["Floor plan or map", "Colorful objects", "Story cards", "Memory challenges"],
            steps: [
              "Choose a familiar location (home, school, etc.)",
              "Create a mental map of the location",
              "Place information at specific locations in your mind",
              "Practice 'walking' through your memory palace to recall information"
            ],
            ageRange: "8+ years",
            learningGoal: "Developing advanced memory techniques and spatial learning"
          },
          {
            title: "Attention Span Training",
            description: "Build focus and concentration through fun exercises",
            materials: ["Timer", "Focus activities", "Distraction challenges", "Progress chart"],
            steps: [
              "Start with short focus sessions (5-10 minutes)",
              "Gradually increase duration as attention improves",
              "Practice filtering out distractions",
              "Track improvements in attention span over time"
            ],
            ageRange: "5+ years",
            learningGoal: "Strengthening attention and concentration abilities"
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
                scale: learningActive ? [1, 1.1, 1] : 1,
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: learningActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating learning symbols */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: learningActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: learningActive ? [0.4, 0.9, 0.4] : 0.4,
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: learningActive ? Infinity : 0,
                    delay: i * 0.4
                  }}
                >
                  {['💡', '📚', '🧩', '🎯', '⚡', '🔍'][i]}
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚡</span>
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

            {/* Interactive Learning System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 border border-indigo-200">
                <div className="relative">
                  {/* Learning Styles */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Discover Your Learning Style</h4>
                    
                    {/* Learning Style Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {learningStyles.map((style) => (
                        <motion.button
                          key={style.id}
                          onClick={() => setSelectedLearningStyle(style.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedLearningStyle === style.id 
                              ? 'border-indigo-500 bg-indigo-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{style.emoji}</div>
                            <div className="font-medium text-sm">{style.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                            <div className="text-sm font-bold mt-2" style={{ color: style.color }}>
                              {style.percentage} of people
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Memory Process */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">How Memory Works</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {memoryStages.map((stage, index) => (
                          <motion.button
                            key={stage.stage}
                            onClick={() => setMemoryStage(index)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              memoryStage === index
                                ? 'border-indigo-500 bg-indigo-50'
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
                          {memoryStages[memoryStage].name}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {memoryStages[memoryStage].description}
                        </p>
                      </div>
                    </div>

                    {/* Cognitive Skills */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Cognitive Skills Development</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cognitiveSkills.map((skill, index) => {
                          const IconComponent = skill.icon
                          return (
                            <motion.div
                              key={skill.skill}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-white rounded-xl border border-gray-200"
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <IconComponent className="w-6 h-6 text-indigo-500" />
                                <div>
                                  <h6 className="font-medium text-gray-900">{skill.name}</h6>
                                  <p className="text-xs text-gray-600">{skill.description}</p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className="bg-indigo-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                />
                              </div>
                              <div className="text-right text-xs text-gray-500 mt-1">
                                {skill.level}% developed
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Attention Span Trainer */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Attention Span Training</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setAttentionSpan(Math.max(5, attentionSpan - 5))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Shorter
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-600">{attentionSpan}</div>
                          <div className="text-sm text-gray-600">Minutes Focus</div>
                        </div>
                        
                        <button
                          onClick={() => setAttentionSpan(Math.min(60, attentionSpan + 5))}
                          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                        >
                          Longer
                        </button>
                      </div>
                      
                      {/* Attention Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            attentionSpan < 15 ? 'bg-red-500' :
                            attentionSpan < 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(attentionSpan / 60) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        Age-appropriate attention span: {Math.floor(attentionSpan / 5) * 5}-{Math.floor(attentionSpan / 5) * 5 + 10} minutes
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setLearningActive(!learningActive)}
                        className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors"
                      >
                        {learningActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{learningActive ? 'Pause' : 'Start'} Learning Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
              href="/discovery/language"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Language</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
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
                      ? 'bg-indigo-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
