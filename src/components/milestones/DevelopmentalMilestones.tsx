'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertTriangle, Baby, Users, Brain, Activity } from 'lucide-react'

interface Milestone {
  id: string
  category: 'motor' | 'cognitive' | 'social' | 'language'
  title: string
  description: string
  ageRange: { min: number; max: number } // in months
  achieved: boolean | null
  wonderFact?: string
}

interface DevelopmentalMilestonesProps {
  childAge: number // in months
  onUpdate: (milestones: Milestone[]) => void
}

export function DevelopmentalMilestones({ childAge, onUpdate }: DevelopmentalMilestonesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Comprehensive milestone database
  const allMilestones: Milestone[] = [
    // 0-3 months
    {
      id: 'social-smile',
      category: 'social',
      title: 'Social Smiling',
      description: 'Smiles in response to people, not just gas!',
      ageRange: { min: 1, max: 3 },
      achieved: null,
      wonderFact: 'Social smiles use different facial muscles than reflexive smiles - it\'s your baby\'s first real communication!'
    },
    {
      id: 'head-control',
      category: 'motor',
      title: 'Head Control',
      description: 'Holds head up when on tummy',
      ageRange: { min: 2, max: 4 },
      achieved: null
    },
    {
      id: 'eye-tracking',
      category: 'cognitive',
      title: 'Visual Tracking',
      description: 'Follows objects with eyes',
      ageRange: { min: 2, max: 3 },
      achieved: null
    },
    
    // 3-6 months
    {
      id: 'laughing',
      category: 'social',
      title: 'Laughing',
      description: 'Laughs out loud and shows excitement',
      ageRange: { min: 3, max: 6 },
      achieved: null,
      wonderFact: 'Laughter develops before speech - it\'s one of the first ways babies express joy!'
    },
    {
      id: 'rolling',
      category: 'motor',
      title: 'Rolling Over',
      description: 'Rolls from tummy to back',
      ageRange: { min: 4, max: 6 },
      achieved: null
    },
    {
      id: 'babbling',
      category: 'language',
      title: 'Babbling',
      description: 'Makes consonant sounds like "ba-ba" or "da-da"',
      ageRange: { min: 4, max: 7 },
      achieved: null
    },
    
    // 6-12 months
    {
      id: 'sitting',
      category: 'motor',
      title: 'Sitting Without Support',
      description: 'Sits without help for several minutes',
      ageRange: { min: 6, max: 9 },
      achieved: null,
      wonderFact: 'Sitting requires coordination of 26 different muscle groups - it\'s like learning to balance on a ball!'
    },
    {
      id: 'stranger-anxiety',
      category: 'social',
      title: 'Stranger Anxiety',
      description: 'Shows wariness around unfamiliar people',
      ageRange: { min: 6, max: 12 },
      achieved: null
    },
    {
      id: 'crawling',
      category: 'motor',
      title: 'Crawling',
      description: 'Moves forward on hands and knees',
      ageRange: { min: 7, max: 10 },
      achieved: null
    },
    {
      id: 'first-words',
      category: 'language',
      title: 'First Words',
      description: 'Says "mama" or "dada" with meaning',
      ageRange: { min: 10, max: 14 },
      achieved: null
    },
    
    // 12-24 months
    {
      id: 'walking',
      category: 'motor',
      title: 'Walking Independently',
      description: 'Takes several steps without support',
      ageRange: { min: 12, max: 18 },
      achieved: null,
      wonderFact: 'Walking requires the brain to coordinate over 200 muscles - it\'s more complex than rocket science!'
    },
    {
      id: 'pointing',
      category: 'cognitive',
      title: 'Pointing to Show Interest',
      description: 'Points to objects to share attention',
      ageRange: { min: 12, max: 15 },
      achieved: null
    },
    {
      id: 'vocabulary-50',
      category: 'language',
      title: '50 Word Vocabulary',
      description: 'Uses about 50 words regularly',
      ageRange: { min: 18, max: 24 },
      achieved: null
    },
    {
      id: 'pretend-play',
      category: 'cognitive',
      title: 'Pretend Play',
      description: 'Pretends to feed doll or talk on phone',
      ageRange: { min: 18, max: 24 },
      achieved: null
    },
    
    // 24-36 months
    {
      id: 'running',
      category: 'motor',
      title: 'Running',
      description: 'Runs without falling frequently',
      ageRange: { min: 24, max: 30 },
      achieved: null
    },
    {
      id: 'two-word-phrases',
      category: 'language',
      title: 'Two-Word Phrases',
      description: 'Combines words like "more milk" or "go car"',
      ageRange: { min: 18, max: 24 },
      achieved: null
    },
    {
      id: 'parallel-play',
      category: 'social',
      title: 'Parallel Play',
      description: 'Plays alongside other children',
      ageRange: { min: 24, max: 36 },
      achieved: null
    },
    
    // 36-48 months
    {
      id: 'jumping',
      category: 'motor',
      title: 'Jumping',
      description: 'Jumps with both feet off the ground',
      ageRange: { min: 30, max: 36 },
      achieved: null
    },
    {
      id: 'three-word-sentences',
      category: 'language',
      title: 'Three-Word Sentences',
      description: 'Uses sentences with 3+ words',
      ageRange: { min: 30, max: 36 },
      achieved: null,
      wonderFact: 'At this age, children learn 9 new words per day - their brain is like a word-absorbing sponge!'
    },
    {
      id: 'cooperative-play',
      category: 'social',
      title: 'Cooperative Play',
      description: 'Plays with others, shares toys',
      ageRange: { min: 36, max: 48 },
      achieved: null
    }
  ]

  // Filter milestones based on child's age and category
  const getRelevantMilestones = () => {
    const ageWindow = 6 // Show milestones within 6 months of current age
    return allMilestones.filter(milestone => {
      const categoryMatch = selectedCategory === 'all' || milestone.category === selectedCategory
      const ageMatch = milestone.ageRange.max >= (childAge - ageWindow) && 
                      milestone.ageRange.min <= (childAge + ageWindow)
      return categoryMatch && ageMatch
    })
  }

  const [milestones, setMilestones] = useState<Milestone[]>(getRelevantMilestones())

  const updateMilestone = (id: string, achieved: boolean | null) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, achieved } : m
    )
    setMilestones(updated)
    onUpdate(updated)
  }

  const categories = [
    { id: 'all', label: 'All Areas', icon: Baby, color: 'gray' },
    { id: 'motor', label: 'Motor Skills', icon: Activity, color: 'blue' },
    { id: 'cognitive', label: 'Cognitive', icon: Brain, color: 'purple' },
    { id: 'social', label: 'Social-Emotional', icon: Users, color: 'green' },
    { id: 'language', label: 'Language', icon: Users, color: 'orange' }
  ]

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.achieved === true) return 'achieved'
    if (milestone.achieved === false) return 'not-achieved'
    if (childAge > milestone.ageRange.max + 3) return 'overdue'
    if (childAge >= milestone.ageRange.min) return 'due'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-50 border-green-200'
      case 'not-achieved': return 'text-red-600 bg-red-50 border-red-200'
      case 'overdue': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'due': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'upcoming': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'not-achieved': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'due': return <Clock className="w-5 h-5 text-blue-600" />
      case 'upcoming': return <Clock className="w-5 h-5 text-gray-400" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const relevantMilestones = getRelevantMilestones()

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Developmental Milestones
        </h2>
        <p className="text-gray-600">
          Track your child's amazing development journey - every child grows at their own pace!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                selectedCategory === category.id
                  ? `border-${category.color}-500 bg-${category.color}-50 text-${category.color}-700`
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          )
        })}
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantMilestones.map((milestone, index) => {
          const status = getMilestoneStatus(milestone)
          const statusColor = getStatusColor(status)
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-xl p-6 ${statusColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(status)}
                    <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                  <p className="text-xs text-gray-500">
                    Typical age: {milestone.ageRange.min}-{milestone.ageRange.max} months
                  </p>
                </div>
              </div>

              {milestone.wonderFact && (
                <div className="bg-white/50 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">✨</span>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Wonder Fact!</h4>
                      <p className="text-xs text-gray-700 mt-1">{milestone.wonderFact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {childAge >= milestone.ageRange.min - 1 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateMilestone(milestone.id, true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      milestone.achieved === true
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✅ Achieved
                  </button>
                  <button
                    onClick={() => updateMilestone(milestone.id, false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      milestone.achieved === false
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    ❌ Not Yet
                  </button>
                  <button
                    onClick={() => updateMilestone(milestone.id, null)}
                    className="py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Development Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['achieved', 'due', 'overdue', 'upcoming'].map((status) => {
            const count = relevantMilestones.filter(m => getMilestoneStatus(m) === status).length
            const label = status.charAt(0).toUpperCase() + status.slice(1)
            const color = getStatusColor(status).split(' ')[0]
            
            return (
              <div key={status} className="text-center">
                <div className={`text-2xl font-bold ${color}`}>{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
