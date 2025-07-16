'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Play,
  Pause,
  Smile,
  Frown,
  Meh,
  Users,
  Lightbulb,
  Target,
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

export default function EmotionsDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [emotionActive, setEmotionActive] = useState(true)
  const [selectedEmotion, setSelectedEmotion] = useState('happy')
  const [empathyLevel, setEmpathyLevel] = useState(75)
  const [socialSkillStage, setSocialSkillStage] = useState(2)

  const basicEmotions = [
    { id: 'happy', name: 'Happy', description: 'Feeling joy and contentment', emoji: '😊', color: '#FFD700', intensity: 80 },
    { id: 'sad', name: 'Sad', description: 'Feeling down or disappointed', emoji: '😢', color: '#4169E1', intensity: 60 },
    { id: 'angry', name: 'Angry', description: 'Feeling frustrated or mad', emoji: '😠', color: '#FF4500', intensity: 90 },
    { id: 'scared', name: 'Scared', description: 'Feeling afraid or worried', emoji: '😨', color: '#800080', intensity: 70 },
    { id: 'excited', name: 'Excited', description: 'Feeling energetic and enthusiastic', emoji: '🤩', color: '#FF69B4', intensity: 95 },
    { id: 'calm', name: 'Calm', description: 'Feeling peaceful and relaxed', emoji: '😌', color: '#32CD32', intensity: 40 }
  ]

  const socialSkillStages = [
    { stage: 0, name: 'Self-Awareness', description: 'Understanding own emotions', age: '2-3 years', skills: ['Naming feelings', 'Recognizing emotions'] },
    { stage: 1, name: 'Self-Regulation', description: 'Managing emotions appropriately', age: '3-5 years', skills: ['Calming strategies', 'Impulse control'] },
    { stage: 2, name: 'Social Awareness', description: 'Understanding others\' emotions', age: '4-6 years', skills: ['Reading facial expressions', 'Empathy'] },
    { stage: 3, name: 'Relationship Skills', description: 'Building healthy relationships', age: '5-8 years', skills: ['Cooperation', 'Conflict resolution'] },
    { stage: 4, name: 'Social Decision-Making', description: 'Making good social choices', age: '7+ years', skills: ['Problem-solving', 'Ethical thinking'] }
  ]

  const emotionRegulationStrategies = [
    { strategy: 'deep-breathing', name: 'Deep Breathing', description: 'Slow, calm breaths to relax', effectiveness: 85, icon: '🫁' },
    { strategy: 'counting', name: 'Counting to 10', description: 'Pause and count before reacting', effectiveness: 75, icon: '🔢' },
    { strategy: 'positive-self-talk', name: 'Positive Self-Talk', description: 'Encouraging inner dialogue', effectiveness: 80, icon: '💭' },
    { strategy: 'physical-activity', name: 'Physical Activity', description: 'Moving body to release tension', effectiveness: 90, icon: '🏃' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Emotional System',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible emotional world - their amazing social-emotional system! This sophisticated network helps them understand their own feelings, connect with others, and navigate the complex world of relationships. Every day, they're learning to recognize emotions, manage their responses, and build meaningful connections with family and friends!",
        wonderFact: "Your child experiences over 30 different emotions, and learning to name them increases their emotional intelligence by 25%!",
        visual: '❤️',
        ageAdaptation: {
          '0-2': "Your baby's emotional system is developing basic feelings and learning to trust and bond with caregivers!",
          '3-5': "Your child's emotions are becoming more complex as they learn to name feelings and understand others!",
          '6-12': "Your child's emotional skills are growing sophisticated with empathy, friendship, and conflict resolution!",
          '13+': "Your teenager's emotional system is developing advanced skills like emotional regulation and complex relationships!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Emotional System Works',
      type: 'interactive',
      content: {
        explanation: "The emotional system works like an amazing feeling detector and relationship builder! Your brain recognizes emotions in yourself and others, helps you understand what they mean, and guides you in responding appropriately to build strong, healthy relationships.",
        interactive: true,
        emotions: basicEmotions,
        socialStages: socialSkillStages,
        regulationStrategies: emotionRegulationStrategies
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Emotion Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Children experience over 30 different emotions",
            explanation: "Learning to name emotions increases emotional intelligence by 25%!",
            visual: "🎭"
          },
          {
            fact: "Empathy develops as early as 18 months",
            explanation: "Toddlers can recognize when others are upset and try to help!",
            visual: "🤗"
          },
          {
            fact: "Emotional skills predict success better than IQ",
            explanation: "Children with strong emotional skills do better in school and relationships!",
            visual: "🌟"
          },
          {
            fact: "Mirror neurons help us understand others' feelings",
            explanation: "Special brain cells help us 'feel' what others are experiencing!",
            visual: "🪞"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Emotional Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Emotion Recognition Game",
            description: "Learn to identify and understand different emotions",
            materials: ["Emotion cards", "Mirror", "Emotion journal", "Feeling thermometer"],
            steps: [
              "Practice making different facial expressions in the mirror",
              "Use emotion cards to identify feelings in pictures",
              "Keep an emotion journal to track daily feelings",
              "Create a feeling thermometer to measure emotion intensity"
            ],
            ageRange: "3+ years",
            learningGoal: "Developing emotional awareness and vocabulary"
          },
          {
            title: "Empathy Building Workshop",
            description: "Develop understanding and compassion for others",
            materials: ["Story books", "Role-play scenarios", "Perspective cards", "Kindness tracker"],
            steps: [
              "Read stories and discuss how characters might feel",
              "Practice role-playing different perspectives",
              "Use 'What if' scenarios to build empathy",
              "Track acts of kindness and their impact on others"
            ],
            ageRange: "4+ years",
            learningGoal: "Building empathy and perspective-taking skills"
          },
          {
            title: "Conflict Resolution Academy",
            description: "Learn peaceful ways to solve problems with others",
            materials: ["Problem-solving steps poster", "Calm-down tools", "Solution brainstorming sheets", "Peace treaty templates"],
            steps: [
              "Learn the steps of peaceful problem-solving",
              "Practice using calm-down strategies before solving conflicts",
              "Brainstorm multiple solutions to common problems",
              "Create peace treaties for resolved conflicts"
            ],
            ageRange: "5+ years",
            learningGoal: "Developing conflict resolution and social problem-solving skills"
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
                scale: emotionActive ? [1, 1.1, 1] : 1,
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: emotionActive ? Infinity : 0
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating emotion faces */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${25 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    scale: emotionActive ? [0.8, 1.3, 0.8] : 0.8,
                    opacity: emotionActive ? [0.4, 0.9, 0.4] : 0.4,
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: emotionActive ? Infinity : 0,
                    delay: i * 0.5
                  }}
                >
                  {['😊', '😢', '😠', '😨', '🤩', '😌'][i]}
                </motion.div>
              ))}
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎭</span>
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

            {/* Interactive Emotional System */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 border border-pink-200">
                <div className="relative">
                  {/* Emotion Explorer */}
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Emotion Explorer</h4>

                    {/* Emotion Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                      {basicEmotions.map((emotion) => (
                        <motion.button
                          key={emotion.id}
                          onClick={() => setSelectedEmotion(emotion.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedEmotion === emotion.id
                              ? 'border-pink-500 bg-pink-50 scale-105'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{emotion.emoji}</div>
                            <div className="font-medium text-xs">{emotion.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{emotion.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Current Emotion Info */}
                    <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {basicEmotions.find(e => e.id === selectedEmotion)?.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-3">
                        {basicEmotions.find(e => e.id === selectedEmotion)?.description}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className="h-3 rounded-full"
                          style={{ backgroundColor: basicEmotions.find(e => e.id === selectedEmotion)?.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${basicEmotions.find(e => e.id === selectedEmotion)?.intensity}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        Intensity: {basicEmotions.find(e => e.id === selectedEmotion)?.intensity}%
                      </div>
                    </div>

                    {/* Social Skill Development Stages */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Social-Emotional Development Stages</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {socialSkillStages.map((stage, index) => (
                          <motion.button
                            key={stage.stage}
                            onClick={() => setSocialSkillStage(index)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              socialSkillStage === index
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-center">
                              <div className="font-medium text-xs">{stage.name}</div>
                              <div className="text-xs text-gray-600">{stage.age}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                        <h6 className="font-semibold text-gray-900 mb-2">
                          {socialSkillStages[socialSkillStage].name}
                        </h6>
                        <p className="text-sm text-gray-600 mb-3">
                          {socialSkillStages[socialSkillStage].description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {socialSkillStages[socialSkillStage].skills.map((skill, i) => (
                            <span key={i} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Emotion Regulation Strategies */}
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Emotion Regulation Strategies</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {emotionRegulationStrategies.map((strategy, index) => (
                          <motion.div
                            key={strategy.strategy}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-xl border border-gray-200 text-center"
                          >
                            <div className="text-2xl mb-2">{strategy.icon}</div>
                            <h6 className="font-medium text-gray-900 mb-1">{strategy.name}</h6>
                            <p className="text-xs text-gray-600 mb-3">{strategy.description}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <motion.div
                                className="bg-pink-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${strategy.effectiveness}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {strategy.effectiveness}% effective
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Empathy Level */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Empathy Development</h5>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <button
                          onClick={() => setEmpathyLevel(Math.max(0, empathyLevel - 15))}
                          className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                        >
                          Less Empathy
                        </button>

                        <div className="text-center">
                          <div className="text-3xl font-bold text-pink-600">{empathyLevel}%</div>
                          <div className="text-sm text-gray-600">Empathy Level</div>
                        </div>

                        <button
                          onClick={() => setEmpathyLevel(Math.min(100, empathyLevel + 15))}
                          className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                        >
                          More Empathy
                        </button>
                      </div>

                      {/* Empathy Indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <motion.div
                          className={`h-4 rounded-full ${
                            empathyLevel < 30 ? 'bg-red-500' :
                            empathyLevel < 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${empathyLevel}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      <div className="text-center text-sm text-gray-600">
                        {empathyLevel < 30 ? 'Developing empathy skills' :
                         empathyLevel < 70 ? 'Good empathy development' :
                         'Strong empathy and compassion'}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setEmotionActive(!emotionActive)}
                        className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                      >
                        {emotionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{emotionActive ? 'Pause' : 'Start'} Emotion Demo</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-600 rounded-xl flex items-center justify-center">
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
                              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
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
                              <span className="w-5 h-5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
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
              href="/discovery/movement"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Movement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full"
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
                      ? 'bg-pink-500'
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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