'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Play, 
  Pause,
  Volume2,
  BookOpen,
  Globe,
  Lightbulb,
  Mic,
  Type
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

export default function LanguageDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [speechActive, setSpeechActive] = useState(true)
  const [vocabularySize, setVocabularySize] = useState(1000)
  const [selectedLanguageStage, setSelectedLanguageStage] = useState('words')
  const [pronunciationScore, setPronunciationScore] = useState(85)

  const languageStages = [
    { id: 'sounds', name: 'Sounds & Babbling', description: 'Making first sounds and babbles', age: '0-6 months', vocab: '0 words', emoji: '👶' },
    { id: 'words', name: 'First Words', description: 'Speaking first meaningful words', age: '6-18 months', vocab: '1-50 words', emoji: '🗣️' },
    { id: 'phrases', name: 'Two-Word Phrases', description: 'Combining words into phrases', age: '18-24 months', vocab: '50-200 words', emoji: '💬' },
    { id: 'sentences', name: 'Simple Sentences', description: 'Creating complete sentences', age: '2-3 years', vocab: '200-1000 words', emoji: '📝' },
    { id: 'complex', name: 'Complex Language', description: 'Advanced grammar and storytelling', age: '3+ years', vocab: '1000+ words', emoji: '📚' }
  ]

  const languageSkills = [
    { skill: 'vocabulary', name: 'Vocabulary', description: 'Number of words understood and used', level: 75, icon: Type, color: '#4CAF50' },
    { skill: 'pronunciation', name: 'Pronunciation', description: 'Clarity of speech sounds', level: 80, icon: Mic, color: '#2196F3' },
    { skill: 'grammar', name: 'Grammar', description: 'Understanding of language rules', level: 70, icon: BookOpen, color: '#FF9800' },
    { skill: 'comprehension', name: 'Comprehension', description: 'Understanding spoken language', level: 85, icon: MessageCircle, color: '#9C27B0' }
  ]

  const multilingualBenefits = [
    { benefit: 'Cognitive Flexibility', description: 'Better problem-solving and creativity', percentage: '25%', emoji: '🧠' },
    { benefit: 'Cultural Awareness', description: 'Understanding different perspectives', percentage: '40%', emoji: '🌍' },
    { benefit: 'Academic Performance', description: 'Better performance in school subjects', percentage: '15%', emoji: '📊' },
    { benefit: 'Career Opportunities', description: 'More job opportunities in global economy', percentage: '60%', emoji: '💼' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Language System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible communication center - their amazing language system! This sophisticated network helps them understand, process, and express thoughts, feelings, and ideas through words, sounds, and gestures. Every day, their language skills grow stronger, opening up new worlds of communication and connection!",
        wonderFact: "Your child learns about 9 new words every day during their peak language development years - that's like adding a new word every 2 hours they're awake!",
        visual: '🗣️',
        ageAdaptation: {
          '0-2': "Your baby's language system is rapidly developing from cries and babbles to first words and simple phrases!",
          '3-5': "Your child's language is exploding with new words, sentences, and the ability to tell stories!",
          '6-12': "Your child's language skills are becoming sophisticated with complex grammar and rich vocabulary!",
          '13+': "Your teenager's language abilities include abstract thinking, humor, and advanced communication skills!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Language System Works',
      type: 'interactive',
      content: {
        explanation: "The language system works like an amazing communication network! Your brain processes sounds, connects them to meanings, stores words in memory, and coordinates with muscles to produce speech - all happening faster than you can think!",
        interactive: true,
        languageStages: languageStages,
        languageSkills: languageSkills,
        multilingualBenefits: multilingualBenefits
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Language Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Children learn 9 new words every day during peak development",
            explanation: "That's like learning a new word every 2 hours they're awake!",
            visual: "📚"
          },
          {
            fact: "Babies can distinguish all language sounds at birth",
            explanation: "They gradually specialize in the sounds of their native language!",
            visual: "👶"
          },
          {
            fact: "Bilingual children have enhanced cognitive abilities",
            explanation: "Learning multiple languages strengthens problem-solving and creativity!",
            visual: "🌍"
          },
          {
            fact: "Reading to children boosts language development by 32%",
            explanation: "Story time is one of the most powerful language learning activities!",
            visual: "📖"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Language Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Vocabulary Building Adventure",
            description: "Expand vocabulary through interactive word games and exploration",
            materials: ["Word cards", "Picture books", "Recording device", "Vocabulary journal"],
            steps: [
              "Choose a theme (animals, colors, foods, etc.)",
              "Explore new words through pictures and real objects",
              "Practice using new words in sentences and stories",
              "Track vocabulary growth in a personal word journal"
            ],
            ageRange: "3+ years",
            learningGoal: "Expanding vocabulary and word usage skills"
          },
          {
            title: "Pronunciation Practice Studio",
            description: "Improve speech clarity through fun pronunciation exercises",
            materials: ["Mirror", "Tongue twisters", "Recording app", "Pronunciation guides"],
            steps: [
              "Practice difficult sounds in front of a mirror",
              "Record yourself saying tongue twisters and challenging words",
              "Listen back and compare to correct pronunciations",
              "Create personalized pronunciation practice sessions"
            ],
            ageRange: "4+ years",
            learningGoal: "Developing clear speech and pronunciation skills"
          },
          {
            title: "Multilingual Exploration Journey",
            description: "Discover the joy of learning multiple languages",
            materials: ["Language learning apps", "Cultural books", "Music from different countries", "Language exchange videos"],
            steps: [
              "Choose a new language to explore together",
              "Learn basic greetings and common words",
              "Explore the culture associated with the language",
              "Practice with native speakers through video calls or apps"
            ],
            ageRange: "5+ years",
            learningGoal: "Developing multilingual awareness and cultural appreciation"
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
                scale: speechActive ? [1, 1.1, 1] : 1,
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: speechActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating speech bubbles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: speechActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: speechActive ? [0.4, 0.9, 0.4] : 0.4,
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: speechActive ? Infinity : 0,
                    delay: i * 0.3
                  }}
                >
                  💬
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📚</span>
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

            {/* Interactive Language System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-8 border border-emerald-200">
                <div className="relative">
                  {/* Language Development Stages */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Language Development Stages</h4>
                    
                    {/* Stage Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                      {languageStages.map((stage) => (
                        <motion.button
                          key={stage.id}
                          onClick={() => setSelectedLanguageStage(stage.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedLanguageStage === stage.id 
                              ? 'border-emerald-500 bg-emerald-50 scale-105' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{stage.emoji}</div>
                            <div className="font-medium text-xs">{stage.name}</div>
                            <div className="text-xs text-gray-600">{stage.age}</div>
                            <div className="text-xs text-gray-500 mt-1">{stage.vocab}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Current Stage Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {languageStages.find(s => s.id === selectedLanguageStage)?.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {languageStages.find(s => s.id === selectedLanguageStage)?.description}
                      </p>
                    </div>

                    {/* Language Skills */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Language Skills Development</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {languageSkills.map((skill, index) => {
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
                                <IconComponent className="w-6 h-6" style={{ color: skill.color }} />
                                <div>
                                  <h6 className="font-medium text-gray-900">{skill.name}</h6>
                                  <p className="text-xs text-gray-600">{skill.description}</p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full"
                                  style={{ backgroundColor: skill.color }}
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

                    {/* Vocabulary Counter */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Size</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setVocabularySize(Math.max(0, vocabularySize - 100))}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          - 100 words
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600">{vocabularySize.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Words Known</div>
                        </div>
                        
                        <button
                          onClick={() => setVocabularySize(Math.min(10000, vocabularySize + 100))}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors"
                        >
                          + 100 words
                        </button>
                      </div>
                      
                      <div className="text-center text-sm text-gray-600 mb-4">
                        {vocabularySize < 50 ? 'Early vocabulary development' :
                         vocabularySize < 500 ? 'Rapid vocabulary growth phase' :
                         vocabularySize < 2000 ? 'Strong vocabulary foundation' :
                         'Advanced vocabulary skills'}
                      </div>
                    </div>

                    {/* Multilingual Benefits */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Benefits of Multilingualism</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {multilingualBenefits.map((benefit, index) => (
                          <motion.div
                            key={benefit.benefit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200 text-center"
                          >
                            <div className="text-2xl mb-2">{benefit.emoji}</div>
                            <h6 className="font-medium text-gray-900 mb-1">{benefit.benefit}</h6>
                            <p className="text-xs text-gray-600 mb-2">{benefit.description}</p>
                            <div className="text-sm font-bold text-emerald-600">
                              +{benefit.percentage} improvement
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Pronunciation Score */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Pronunciation Clarity</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setPronunciationScore(Math.max(0, pronunciationScore - 10))}
                          className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                        >
                          Less Clear
                        </button>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-teal-600">{pronunciationScore}%</div>
                          <div className="text-sm text-gray-600">Clarity Score</div>
                        </div>
                        
                        <button
                          onClick={() => setPronunciationScore(Math.min(100, pronunciationScore + 10))}
                          className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors"
                        >
                          Clearer
                        </button>
                      </div>
                      
                      {/* Pronunciation Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            pronunciationScore < 50 ? 'bg-red-500' :
                            pronunciationScore < 80 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pronunciationScore}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setSpeechActive(!speechActive)}
                        className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors"
                      >
                        {speechActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{speechActive ? 'Pause' : 'Start'} Speech Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
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
              href="/discovery/emotions"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Emotions</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
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
                      ? 'bg-emerald-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
