'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Ear, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Music,
  BookOpen,
  Activity,
  Users,
  Home,
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

export default function EarsDiscoveryPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [soundWavesActive, setSoundWavesActive] = useState(true)
  const [selectedFrequency, setSelectedFrequency] = useState(1000)
  const [balanceGameActive, setBalanceGameActive] = useState(false)

  const soundFrequencies = [
    { name: 'Low Bass', frequency: 60, description: 'Deep drum sounds', emoji: '🥁' },
    { name: 'Voice', frequency: 300, description: 'Human speech', emoji: '🗣️' },
    { name: 'Piano', frequency: 1000, description: 'Musical notes', emoji: '🎹' },
    { name: 'Bird Song', frequency: 3000, description: 'High chirping', emoji: '🐦' },
    { name: 'Whistle', frequency: 8000, description: 'Sharp whistle', emoji: '🎵' }
  ]

  const discoverySections: DiscoverySection[] = [
    {
      id: 'introduction',
      title: 'Meet Your Amazing Ears',
      type: 'story',
      content: {
        narrative: "Welcome to your child's incredible sound detectives - their amazing ears! These sophisticated organs are like the world's most advanced sound systems, capable of detecting everything from the softest whisper to the loudest thunder. But ears don't just hear - they also help your child balance and know which way is up!",
        wonderFact: "Your child's ears can detect sounds from 20Hz to 20,000Hz - that's like having super-hearing that can pick up sounds lower than a whale's song and higher than a bat's squeak!",
        visual: '👂',
        ageAdaptation: {
          '0-2': "Your baby's ears are already amazing at birth - they can recognize your voice from when they were in the womb!",
          '3-5': "Your child's ears are great at hearing all the sounds around them and learning new words every day!",
          '6-12': "Your child's ears can now distinguish between very similar sounds, helping them with reading and music!",
          '13+': "Your teenager's ears are fully developed and can appreciate complex music and subtle sound differences!"
        }
      }
    },
    {
      id: 'how-it-works',
      title: 'How Your Ears Work',
      type: 'interactive',
      content: {
        explanation: "The ears work like amazing sound collectors and processors! Sound waves travel through the air, get caught by your outer ear, travel through your ear canal, vibrate your eardrum, and get converted into signals your brain can understand.",
        interactive: true,
        earParts: [
          { name: "Outer Ear", description: "Catches sound waves like a satellite dish", function: "collection" },
          { name: "Ear Canal", description: "Tunnel that carries sound to the eardrum", function: "transmission" },
          { name: "Eardrum", description: "Thin membrane that vibrates with sound", function: "vibration" },
          { name: "Tiny Bones", description: "Three smallest bones that amplify sound", function: "amplification" },
          { name: "Cochlea", description: "Spiral tube that converts vibrations to signals", function: "conversion" },
          { name: "Auditory Nerve", description: "Highway that sends signals to the brain", function: "transmission" }
        ]
      }
    },
    {
      id: 'amazing-facts',
      title: 'Mind-Blowing Ear Facts',
      type: 'facts',
      content: {
        facts: [
          {
            fact: "Ears can detect sounds from 20Hz to 20,000Hz",
            explanation: "That's like having super-hearing that covers everything from elephant rumbles to bat squeaks!",
            visual: "🦇"
          },
          {
            fact: "The three smallest bones in your body are in your ears",
            explanation: "The hammer, anvil, and stirrup are smaller than rice grains but super important for hearing!",
            visual: "🍚"
          },
          {
            fact: "Your ears help you balance and know which way is up",
            explanation: "Special fluid-filled tubes in your ears act like a built-in level!",
            visual: "⚖️"
          },
          {
            fact: "Ears never stop working, even when you sleep",
            explanation: "They're always listening for important sounds to keep you safe!",
            visual: "😴"
          }
        ]
      }
    },
    {
      id: 'activities',
      title: 'Fun Ear Activities',
      type: 'activities',
      content: {
        activities: [
          {
            title: "Sound Detective Challenge",
            description: "Become a sound expert by identifying and categorizing different sounds",
            materials: ["Blindfold or eye mask", "Various sound-making objects", "Recording device", "Notebook"],
            steps: [
              "Close your eyes and listen to different sounds around you",
              "Try to identify what's making each sound",
              "Categorize sounds as loud/soft, high/low, near/far",
              "Create a sound map of your home or neighborhood"
            ],
            ageRange: "4+ years",
            learningGoal: "Developing auditory discrimination and listening skills"
          },
          {
            title: "Musical Ear Training",
            description: "Develop musical hearing through rhythm and melody games",
            materials: ["Musical instruments", "Music player", "Recording device", "Simple songs"],
            steps: [
              "Listen to different musical instruments and identify their sounds",
              "Clap along to rhythms and try to repeat them",
              "Sing simple melodies and match pitches",
              "Create your own musical compositions"
            ],
            ageRange: "3+ years",
            learningGoal: "Building musical awareness and auditory processing skills"
          },
          {
            title: "Balance and Coordination Games",
            description: "Explore how ears help with balance through fun activities",
            materials: ["Balance beam or tape line", "Soft surface", "Timer", "Various props"],
            steps: [
              "Walk along a straight line with eyes open, then closed",
              "Stand on one foot and notice how ears help you balance",
              "Spin gently and feel how your ears detect the movement",
              "Try balance challenges while listening to different sounds"
            ],
            ageRange: "5+ years",
            learningGoal: "Understanding the connection between hearing and balance"
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
                rotate: soundWavesActive ? [0, 5, -5, 0] : 0,
              }}
              transition={{ 
                duration: 2,
                repeat: soundWavesActive ? Infinity : 0 
              }}
              className="text-8xl mb-8 relative"
            >
              {currentSectionData.content.visual}
              {/* Floating sound waves around ear */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg opacity-60"
                  style={{
                    left: `${25 + i * 8}%`,
                    top: `${30 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    x: soundWavesActive ? [0, 20, 0] : 0,
                    opacity: soundWavesActive ? [0.3, 0.8, 0.3] : 0.3,
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: soundWavesActive ? Infinity : 0,
                    delay: i * 0.2
                  }}
                >
                  〰️
                </motion.div>
              ))}
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {currentSectionData.content.narrative}
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔊</span>
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

            {/* Interactive Sound Frequency Demo */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-8 border border-green-200">
                <div className="relative">
                  {/* Animated Ear */}
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ 
                        rotate: soundWavesActive ? [0, 3, -3, 0] : 0,
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: soundWavesActive ? Infinity : 0 
                      }}
                      className="text-6xl mb-4"
                    >
                      👂
                    </motion.div>

                    {/* Sound Frequency Selector */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Sound Frequency Explorer</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        {soundFrequencies.map((sound) => (
                          <motion.button
                            key={sound.frequency}
                            onClick={() => setSelectedFrequency(sound.frequency)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedFrequency === sound.frequency 
                                ? 'border-green-500 bg-green-50 scale-105' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-2">{sound.emoji}</div>
                            <div className="font-medium text-sm">{sound.name}</div>
                            <div className="text-xs text-gray-600">{sound.frequency}Hz</div>
                            <div className="text-xs text-gray-500 mt-1">{sound.description}</div>
                          </motion.button>
                        ))}
                      </div>
                      
                      {/* Frequency Display */}
                      <div className="text-center mb-6">
                        <div className="text-2xl font-bold text-green-600">{selectedFrequency} Hz</div>
                        <div className="text-sm text-gray-600">
                          {soundFrequencies.find(s => s.frequency === selectedFrequency)?.description}
                        </div>
                      </div>

                      {/* Sound Wave Visualization */}
                      <div className="relative h-20 mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <svg className="w-full h-full">
                          {soundWavesActive && (
                            <motion.path
                              d={`M 0 40 Q 50 ${40 - (selectedFrequency / 200)} 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40`}
                              stroke="#10B981"
                              strokeWidth="3"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1, x: [-100, 100] }}
                              transition={{
                                pathLength: { duration: 1 },
                                x: { duration: 2, repeat: Infinity, ease: "linear" }
                              }}
                            />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <button
                        onClick={() => setSoundWavesActive(!soundWavesActive)}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                      >
                        {soundWavesActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{soundWavesActive ? 'Mute' : 'Play'} Sound</span>
                      </button>
                      
                      <button
                        onClick={() => setBalanceGameActive(!balanceGameActive)}
                        className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors"
                      >
                        <Waves className="w-4 h-4" />
                        <span>Balance Demo</span>
                      </button>
                    </div>

                    {/* Ear Parts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSectionData.content.earParts.map((part: any, index: number) => (
                        <motion.div
                          key={part.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-4 border border-gray-200"
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                              <Ear className="w-4 h-4" />
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">{part.name}</h5>
                            <p className="text-sm text-gray-600">{part.description}</p>
                          </div>
                        </motion.div>
                      ))}
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-600 rounded-xl flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
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
              href="/discovery/digestive"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next: Digestive</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
