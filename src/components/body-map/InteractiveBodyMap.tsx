'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Heart, Eye, Ear, Smile, Activity, Thermometer } from 'lucide-react'
import { OrganCard } from './OrganCard'
import { TestingModal } from './TestingModal'

interface Organ {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  position: { x: number; y: number }
  tests: string[]
  description: string
  character: string
}

const organs: Organ[] = [
  {
    id: 'brain',
    name: 'Brain & Cognitive',
    icon: Brain,
    color: 'brain',
    position: { x: 50, y: 15 },
    tests: ['Cognitive Assessment', 'Memory Tests', 'Attention Span', 'Learning Patterns'],
    description: 'Monitor cognitive development and learning capabilities',
    character: '🧠'
  },
  {
    id: 'eyes',
    name: 'Vision & Sight',
    icon: Eye,
    color: 'sensory',
    position: { x: 45, y: 25 },
    tests: ['Visual Acuity', 'Color Recognition', 'Depth Perception', 'Eye Movement'],
    description: 'Comprehensive vision and eye health assessment',
    character: '👁️'
  },
  {
    id: 'ears',
    name: 'Hearing & Audio',
    icon: Ear,
    color: 'sensory',
    position: { x: 55, y: 25 },
    tests: ['Hearing Test', 'Sound Recognition', 'Balance Assessment', 'Audio Processing'],
    description: 'Complete hearing and auditory development evaluation',
    character: '👂'
  },
  {
    id: 'heart',
    name: 'Cardiovascular',
    icon: Heart,
    color: 'cardiovascular',
    position: { x: 45, y: 40 },
    tests: ['Heart Rate', 'Blood Pressure', 'Circulation', 'Cardiac Rhythm'],
    description: 'Heart health and cardiovascular system monitoring',
    character: '❤️'
  },
  {
    id: 'lungs',
    name: 'Respiratory',
    icon: Activity,
    color: 'respiratory',
    position: { x: 55, y: 40 },
    tests: ['Lung Capacity', 'Breathing Patterns', 'Oxygen Levels', 'Respiratory Rate'],
    description: 'Breathing and lung function assessment',
    character: '🫁'
  },
  {
    id: 'digestive',
    name: 'Digestive System',
    icon: Activity,
    color: 'digestive',
    position: { x: 50, y: 55 },
    tests: ['Nutrition Analysis', 'Digestion Health', 'Growth Tracking', 'Appetite Patterns'],
    description: 'Digestive health and nutrition monitoring',
    character: '🍎'
  },
  {
    id: 'temperature',
    name: 'Body Temperature',
    icon: Thermometer,
    color: 'skin',
    position: { x: 50, y: 70 },
    tests: ['Core Temperature', 'Skin Temperature', 'Fever Detection', 'Thermal Regulation'],
    description: 'Temperature monitoring and thermal health',
    character: '🌡️'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Health',
    icon: Smile,
    color: 'brain',
    position: { x: 50, y: 85 },
    tests: ['Social Skills', 'Emotional Regulation', 'Motor Skills', 'Communication'],
    description: 'Behavioral and emotional development assessment',
    character: '😊'
  }
]

export function InteractiveBodyMap() {
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null)
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null)
  const [showTestingModal, setShowTestingModal] = useState(false)

  const handleOrganClick = (organ: Organ) => {
    setSelectedOrgan(organ)
    setShowTestingModal(true)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Body Silhouette */}
      <div className="relative w-full h-[600px] mx-auto">
        {/* Child silhouette background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-96 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full opacity-20" 
               style={{ clipPath: 'ellipse(40% 50% at 50% 50%)' }}>
          </div>
        </div>

        {/* Organ indicators */}
        {organs.map((organ) => {
          const Icon = organ.icon
          const isHovered = hoveredOrgan === organ.id
          const isSelected = selectedOrgan?.id === organ.id

          return (
            <motion.div
              key={organ.id}
              className="absolute cursor-pointer"
              style={{
                left: `${organ.position.x}%`,
                top: `${organ.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredOrgan(organ.id)}
              onHoverEnd={() => setHoveredOrgan(null)}
              onClick={() => handleOrganClick(organ)}
            >
              {/* Pulsing background */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-${organ.color}-200`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main organ button */}
              <div className={`
                relative w-16 h-16 rounded-full 
                bg-gradient-to-br from-${organ.color}-400 to-${organ.color}-600
                shadow-lg hover:shadow-xl transition-all duration-300
                flex items-center justify-center
                ${isHovered || isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
              `}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Connection lines */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-10"
                  >
                    <OrganCard organ={organ} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating character */}
              <motion.div
                className="absolute -top-8 -right-2 text-2xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {organ.character}
              </motion.div>
            </motion.div>
          )
        })}

        {/* Animated connection lines between organs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5FBF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#E91E63" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00BCD4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Example connection lines */}
          <motion.path
            d="M 200 150 Q 250 200 200 250"
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Testing Modal */}
      <TestingModal
        isOpen={showTestingModal}
        onClose={() => setShowTestingModal(false)}
        organ={selectedOrgan}
      />
    </div>
  )
}
