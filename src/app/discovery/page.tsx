'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  Brain,
  Activity,
  Eye,
  Ear,
  Thermometer,
  Smile,
  CheckCircle,
  Shield,
  Dumbbell,
  Zap,
  Droplets,
  MessageCircle,
  Search,
  Filter,
  X,
  ChevronDown,
  Microscope,
  Sparkles,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

interface DiscoveryJourney {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<any>
  color: string
  gradient: string
  character: string
  duration: string
  ageRange: string
  difficulty: 'Beginner' | 'Explorer' | 'Expert'
  wonderFacts: string[]
  activities: string[]
  completed?: boolean
  featured?: boolean
  progress?: number
  previewContent?: {
    stats?: { label: string; value: string }[]
    quickFacts?: string[]
    interactiveElements?: string[]
  }
}

export default function DiscoveryPage() {
  const [selectedAge, setSelectedAge] = useState('all')
  const [completedJourneys, setCompletedJourneys] = useState<string[]>(['heart', 'digestive', 'learning']) // Mock completed journeys
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'body-systems' | 'developmental-domains'>('all')
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all')
  const [durationFilter, setDurationFilter] = useState<'all' | 'quick' | 'longer'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear search
      if (e.key === 'Escape') {
        setSearchQuery('')
        setShowSuggestions(false)
      }
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        searchInput?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const discoveryJourneys: DiscoveryJourney[] = [
    {
      id: 'heart',
      title: 'The Amazing Heart',
      subtitle: 'Your Child\'s Powerful Engine',
      description: 'Embark on an incredible journey through the cardiovascular system. Discover how your child\'s heart beats 100,000 times a day, pumping life through their growing body.',
      icon: Heart,
      color: 'cardiovascular',
      gradient: 'from-red-400 to-pink-600',
      character: '❤️',
      duration: '15-20 min',
      ageRange: 'All ages',
      difficulty: 'Beginner',
      wonderFacts: [
        'A child\'s heart is only the size of their fist',
        'It beats 100,000 times every single day',
        'The heart pumps 2,000 gallons of blood daily'
      ],
      activities: [
        'Listen to heartbeats with a stethoscope',
        'Exercise and feel heart rate changes',
        'Create heart-healthy snacks together'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Beats per day', value: '100,000' },
          { label: 'Blood pumped', value: '2,000 gallons' }
        ],
        quickFacts: [
          'Never stops working - even while sleeping!',
          'Strongest muscle in the body'
        ]
      }
    },
    {
      id: 'brain',
      title: 'The Incredible Brain',
      subtitle: 'The Universe in Their Head',
      description: 'Explore the most complex organ in the universe. See how your child\'s brain creates 1 million new connections every second during early development.',
      icon: Brain,
      color: 'brain',
      gradient: 'from-purple-400 to-indigo-600',
      character: '🧠',
      duration: '20-25 min',
      ageRange: '0-18 years',
      difficulty: 'Explorer',
      wonderFacts: [
        'The brain uses 20% of the body\'s energy',
        '1 million new connections form every second',
        'It contains 86 billion neurons'
      ],
      activities: [
        'Memory games and puzzles',
        'Reading and storytelling',
        'Music and creative activities'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Neurons', value: '86 billion' },
          { label: 'New connections/sec', value: '1 million' },
          { label: 'Energy usage', value: '20%' }
        ],
        quickFacts: [
          'More neurons than stars in the Milky Way',
          'Creates new pathways every time you learn'
        ],
        interactiveElements: [
          'Neural network animation',
          'Memory palace builder',
          'Brain wave visualizer'
        ]
      }
    },
    {
      id: 'lungs',
      title: 'The Breathing Balloons',
      subtitle: 'Life-Giving Air Machines',
      description: 'Discover how your child\'s lungs work like magical balloons, bringing oxygen to every part of their body with each breath.',
      icon: Activity,
      color: 'respiratory',
      gradient: 'from-cyan-400 to-blue-600',
      character: '🫁',
      duration: '15-20 min',
      ageRange: 'All ages',
      difficulty: 'Beginner',
      wonderFacts: [
        'Children take 20,000 breaths every day',
        'Lungs would cover half a tennis court if unfolded',
        'They filter 2,000 gallons of air daily'
      ],
      activities: [
        'Breathing exercises and yoga',
        'Blow bubbles to practice breathing',
        'Sing songs to strengthen lungs'
      ],
      previewContent: {
        stats: [
          { label: 'Breaths per day', value: '20,000' },
          { label: 'Air filtered', value: '2,000 gallons' }
        ],
        quickFacts: [
          'Surface area of half a tennis court when unfolded'
        ]
      }
    },
    {
      id: 'eyes',
      title: 'The Window Cameras',
      subtitle: 'High-Tech Vision System',
      description: 'Marvel at how your child\'s eyes process 36,000 bits of information every hour, creating the colorful world they see.',
      icon: Eye,
      color: 'sensory',
      gradient: 'from-amber-400 to-orange-600',
      character: '👁️',
      duration: '15-18 min',
      ageRange: '6 months+',
      difficulty: 'Beginner',
      wonderFacts: [
        'Eyes can distinguish 10 million colors',
        'They process 36,000 bits of info per hour',
        'Blink 15,000 times per day'
      ],
      activities: [
        'Color recognition games',
        'Eye tracking exercises',
        'Visual art creation'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Colors detected', value: '10 million' },
          { label: 'Info processed/hour', value: '36,000 bits' },
          { label: 'Blinks per day', value: '15,000' }
        ],
        quickFacts: [
          'Fastest muscles in the body',
          'Can see a candle flame 14 miles away'
        ],
        interactiveElements: [
          'Color recognition game',
          'Eye tracking demo',
          'Vision acuity test'
        ]
      }
    },
    {
      id: 'ears',
      title: 'The Sound Detectives',
      subtitle: 'Amazing Audio System',
      description: 'Explore how your child\'s ears capture sound waves and transform them into the music, voices, and sounds they love.',
      icon: Ear,
      color: 'sensory',
      gradient: 'from-green-400 to-teal-600',
      character: '👂',
      duration: '15-18 min',
      ageRange: 'All ages',
      difficulty: 'Beginner',
      wonderFacts: [
        'Ears can detect sounds from 20Hz to 20,000Hz',
        'The smallest bones in the body are in the ear',
        'Ears help with balance too'
      ],
      activities: [
        'Sound identification games',
        'Music and rhythm activities',
        'Balance and coordination exercises'
      ],
      previewContent: {
        stats: [
          { label: 'Frequency range', value: '20Hz-20kHz' },
          { label: 'Smallest bones', value: '3 in ear' }
        ],
        quickFacts: [
          'Never stop working, even while sleeping',
          'Help you balance and know which way is up'
        ]
      }
    },
    {
      id: 'digestive',
      title: 'The Food Factory',
      subtitle: 'Amazing Digestion Journey',
      description: 'Follow food on its incredible journey through your child\'s digestive system, from mouth to... well, you know!',
      icon: Smile,
      color: 'digestive',
      gradient: 'from-green-400 to-emerald-600',
      character: '🍎',
      duration: '18-22 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'The digestive system is 30 feet long',
        'Stomach acid is stronger than vinegar',
        'Food takes 24-72 hours to fully digest'
      ],
      activities: [
        'Healthy cooking together',
        'Learn about nutrition',
        'Digestive system crafts'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Total length', value: '30 feet' },
          { label: 'Digestion time', value: '24-72 hours' }
        ],
        quickFacts: [
          'Stomach acid stronger than vinegar',
          'Longer than a school bus when stretched out'
        ],
        interactiveElements: [
          'Food journey animation',
          'Nutrition tracker',
          'Digestion timeline'
        ]
      }
    },
    {
      id: 'skin',
      title: 'The Protective Shield',
      subtitle: 'Your Amazing Skin System',
      description: 'Discover how your child\'s skin works as the body\'s largest organ, protecting them while letting them feel the world.',
      icon: Shield,
      color: 'integumentary',
      gradient: 'from-orange-400 to-yellow-600',
      character: '🛡️',
      duration: '15-18 min',
      ageRange: 'All ages',
      difficulty: 'Beginner',
      wonderFacts: [
        'Skin completely replaces itself every 28 days',
        'You shed 40,000 dead skin cells every minute',
        'Skin has over 1,000 nerve endings per square inch'
      ],
      activities: [
        'Touch sensitivity games',
        'Skin care science lab',
        'Wound healing timeline'
      ],
      previewContent: {
        stats: [
          { label: 'Renewal cycle', value: '28 days' },
          { label: 'Nerve endings/inch²', value: '1,000+' }
        ],
        quickFacts: [
          'Largest organ in the body',
          'Natural temperature regulator'
        ]
      }
    },
    {
      id: 'muscles-bones',
      title: 'The Framework & Power',
      subtitle: 'Muscles & Bones Working Together',
      description: 'Explore how your child\'s 600+ muscles and 206 bones create a living framework stronger than steel.',
      icon: Dumbbell,
      color: 'musculoskeletal',
      gradient: 'from-red-400 to-orange-600',
      character: '🦴',
      duration: '20-25 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'You have over 600 muscles in your body',
        'Bones are 5 times stronger than steel',
        'Your largest muscle is in your bottom'
      ],
      activities: [
        'Strength building challenges',
        'Posture detective game',
        'Calcium-rich cooking lab'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Total muscles', value: '600+' },
          { label: 'Bone strength', value: '5x steel' },
          { label: 'Total bones', value: '206' }
        ],
        quickFacts: [
          'Babies born with 270 bones that fuse together',
          'Muscles work in pairs to create movement'
        ],
        interactiveElements: [
          '3D skeleton viewer',
          'Muscle contraction demo',
          'Strength level tracker'
        ]
      }
    },
    {
      id: 'immune',
      title: 'The Defense Force',
      subtitle: 'Your Body\'s Amazing Army',
      description: 'Meet your child\'s incredible immune system - millions of tiny soldiers protecting them 24/7 from germs and invaders.',
      icon: Shield,
      color: 'immune',
      gradient: 'from-blue-400 to-purple-600',
      character: '🛡️',
      duration: '18-22 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Your immune system remembers every germ it fights',
        'You make 25 billion new white blood cells daily',
        'Fever helps your immune system work better'
      ],
      activities: [
        'Germ battle simulation',
        'Hygiene hero training',
        'Immune-boosting nutrition lab'
      ],
      previewContent: {
        stats: [
          { label: 'New white cells/day', value: '25 billion' },
          { label: 'Germ memory', value: 'Millions' }
        ],
        quickFacts: [
          'Can distinguish between you and invaders',
          'Works harder when you have a fever'
        ]
      }
    },
    {
      id: 'hormones',
      title: 'The Chemical Messengers',
      subtitle: 'Your Body\'s Communication Network',
      description: 'Discover how your child\'s hormones control growth, sleep, mood, and so much more through chemical messages.',
      icon: Zap,
      color: 'endocrine',
      gradient: 'from-purple-400 to-pink-600',
      character: '⚡',
      duration: '16-20 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Your body makes over 50 different hormones',
        'Growth hormone works mostly while you sleep',
        'Adrenaline can make you 10 times stronger'
      ],
      activities: [
        'Sleep hygiene laboratory',
        'Stress management workshop',
        'Growth milestone celebration'
      ],
      previewContent: {
        stats: [
          { label: 'Different hormones', value: '50+' },
          { label: 'Adrenaline boost', value: '10x stronger' }
        ],
        quickFacts: [
          'Control growth, mood, and energy',
          'Work like a sophisticated communication network'
        ]
      }
    },
    {
      id: 'kidneys',
      title: 'The Filtration Plant',
      subtitle: 'Your Amazing Kidney System',
      description: 'Explore how your child\'s kidneys work like sophisticated water treatment plants, filtering 50 gallons of blood daily.',
      icon: Droplets,
      color: 'urinary',
      gradient: 'from-blue-400 to-cyan-600',
      character: '🫘',
      duration: '15-18 min',
      ageRange: 'All ages',
      difficulty: 'Beginner',
      wonderFacts: [
        'Kidneys filter 50 gallons of blood every day',
        'Each kidney has 1 million tiny filters',
        'You can live normally with just one kidney'
      ],
      activities: [
        'Hydration station challenge',
        'Kidney-friendly cooking lab',
        'Filtration science experiment'
      ],
      previewContent: {
        stats: [
          { label: 'Blood filtered/day', value: '50 gallons' },
          { label: 'Filters per kidney', value: '1 million' }
        ],
        quickFacts: [
          'Help make red blood cells',
          'Control blood pressure and fluid balance'
        ]
      }
    },
    {
      id: 'learning',
      title: 'The Learning Machine',
      subtitle: 'Cognitive Development & Thinking',
      description: 'Explore how your child\'s brain learns, remembers, and solves problems through amazing cognitive processes.',
      icon: Brain,
      color: 'cognitive',
      gradient: 'from-indigo-400 to-purple-600',
      character: '🧠',
      duration: '20-25 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Your brain forms 1 million new connections every second',
        'You can only hold 7±2 items in working memory',
        'Sleep helps consolidate memories'
      ],
      activities: [
        'Learning style discovery lab',
        'Memory palace builder',
        'Attention span training'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'New connections/sec', value: '1 million' },
          { label: 'Working memory limit', value: '7±2 items' }
        ],
        quickFacts: [
          'Everyone has a unique learning style',
          'Sleep is crucial for memory formation'
        ],
        interactiveElements: [
          'Learning style assessment',
          'Memory process visualization',
          'Attention span trainer'
        ]
      }
    },
    {
      id: 'language',
      title: 'The Communication Center',
      subtitle: 'Language Development & Speech',
      description: 'Discover how your child develops language skills, from first words to complex communication and multilingual abilities.',
      icon: MessageCircle,
      color: 'language',
      gradient: 'from-emerald-400 to-teal-600',
      character: '🗣️',
      duration: '18-22 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Children learn 9 new words every day during peak development',
        'Babies can distinguish all language sounds at birth',
        'Reading to children boosts language development by 32%'
      ],
      activities: [
        'Vocabulary building adventure',
        'Pronunciation practice studio',
        'Multilingual exploration journey'
      ],
      previewContent: {
        stats: [
          { label: 'New words/day', value: '9 words' },
          { label: 'Language boost from reading', value: '32%' }
        ],
        quickFacts: [
          'Bilingual children have enhanced cognitive abilities',
          'Language development follows predictable stages'
        ]
      }
    },
    {
      id: 'emotions',
      title: 'The Feeling Navigator',
      subtitle: 'Social-Emotional Development',
      description: 'Explore how your child learns to understand emotions, build relationships, and develop empathy and social skills.',
      icon: Heart,
      color: 'social-emotional',
      gradient: 'from-pink-400 to-rose-600',
      character: '❤️',
      duration: '20-25 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Children experience over 30 different emotions',
        'Empathy develops as early as 18 months',
        'Emotional skills predict success better than IQ'
      ],
      activities: [
        'Emotion recognition game',
        'Empathy building workshop',
        'Conflict resolution academy'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Different emotions', value: '30+' },
          { label: 'Empathy development', value: '18 months' }
        ],
        quickFacts: [
          'Mirror neurons help us understand others\' feelings',
          'Emotional intelligence can be learned and improved'
        ],
        interactiveElements: [
          'Emotion explorer',
          'Social skill stages',
          'Empathy level tracker'
        ]
      }
    },
    {
      id: 'movement',
      title: 'The Coordination Master',
      subtitle: 'Motor Development & Movement',
      description: 'Discover how your child develops movement skills, from first steps to complex coordination and athletic abilities.',
      icon: Activity,
      color: 'motor',
      gradient: 'from-violet-400 to-purple-600',
      character: '🏃',
      duration: '18-22 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'Your brain creates new movement patterns with practice',
        'Balance uses input from 3 different systems',
        'Fine motor skills develop from center outward'
      ],
      activities: [
        'Coordination challenge course',
        'Fine motor skill workshop',
        'Balance and body awareness games'
      ],
      previewContent: {
        stats: [
          { label: 'Balance systems', value: '3 systems' },
          { label: 'Motor skill types', value: 'Gross & Fine' }
        ],
        quickFacts: [
          'Cross-lateral movements boost brain development',
          'Practice literally rewires the brain for better movement'
        ]
      }
    },
    {
      id: 'senses',
      title: 'The Sensory Universe',
      subtitle: 'Sensory Processing & Integration',
      description: 'Explore your child\'s amazing 7+ senses and how they work together to create their unique experience of the world.',
      icon: Eye,
      color: 'sensory',
      gradient: 'from-cyan-400 to-blue-600',
      character: '🌈',
      duration: '20-25 min',
      ageRange: 'All ages',
      difficulty: 'Explorer',
      wonderFacts: [
        'You have more than 5 senses - actually 7 or more!',
        'Your brain processes 11 million bits of sensory info per second',
        'Everyone has unique sensory preferences'
      ],
      activities: [
        'Sensory exploration station',
        'Sensory diet planning',
        'Sensory-friendly environment design'
      ],
      featured: true,
      previewContent: {
        stats: [
          { label: 'Total senses', value: '7+ senses' },
          { label: 'Info processed/sec', value: '11 million bits' }
        ],
        quickFacts: [
          'Sensory integration happens automatically in most people',
          'Sensory preferences affect learning and behavior'
        ],
        interactiveElements: [
          '7+ senses explorer',
          'Sensory processing types',
          'Integration level tracker'
        ]
      }
    }
  ]

  const ageFilters = [
    { id: 'all', label: 'All Ages', icon: Users },
    { id: 'infant', label: '0-2 years', icon: Users },
    { id: 'toddler', label: '2-5 years', icon: Users },
    { id: 'school', label: '5-12 years', icon: Users },
    { id: 'teen', label: '12+ years', icon: Users }
  ]

  // Search suggestions data
  const allSearchTerms = [
    // Body systems
    'heart', 'cardiovascular', 'blood', 'circulation', 'pulse',
    'brain', 'nervous', 'thinking', 'memory', 'neurons',
    'lungs', 'respiratory', 'breathing', 'oxygen', 'air',
    'eyes', 'vision', 'sight', 'seeing', 'visual',
    'ears', 'hearing', 'sound', 'balance', 'auditory',
    'digestive', 'stomach', 'food', 'nutrition', 'eating',
    'skin', 'protection', 'temperature', 'touch',
    'muscles', 'bones', 'movement', 'strength', 'skeleton',
    'immune', 'defense', 'germs', 'antibodies', 'protection',
    'hormones', 'growth', 'endocrine', 'chemicals',
    'kidneys', 'urinary', 'filtering', 'waste', 'water',
    // Developmental domains
    'cognitive', 'learning', 'thinking', 'memory', 'attention',
    'language', 'speech', 'talking', 'words', 'communication',
    'emotions', 'feelings', 'social', 'empathy', 'relationships',
    'motor', 'movement', 'coordination', 'balance', 'skills',
    'sensory', 'senses', 'processing', 'touch', 'hearing', 'sight'
  ]

  // Update search suggestions based on query
  const updateSearchSuggestions = (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    const suggestions = allSearchTerms
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6)

    setSearchSuggestions(suggestions)
    setShowSuggestions(suggestions.length > 0)
  }

  // Enhanced filtering logic
  const filteredJourneys = discoveryJourneys.filter(journey => {
    // Age filter
    if (selectedAge !== 'all') {
      const ageRanges = {
        'infant': ['0-2', 'All ages'],
        'toddler': ['2-5', 'All ages'],
        'school': ['5-12', 'All ages'],
        'teen': ['12+', 'All ages']
      }
      const validAges = ageRanges[selectedAge as keyof typeof ageRanges]
      if (!validAges?.includes(journey.ageRange)) return false
    }

    // Category filter
    if (categoryFilter !== 'all') {
      const bodySystemIds = ['heart', 'brain', 'lungs', 'eyes', 'ears', 'digestive', 'skin', 'muscles', 'immune', 'hormones', 'kidneys']
      const developmentalIds = ['learning', 'language', 'emotions', 'movement', 'senses']

      if (categoryFilter === 'body-systems' && !bodySystemIds.includes(journey.id)) return false
      if (categoryFilter === 'developmental-domains' && !developmentalIds.includes(journey.id)) return false
    }

    // Completion filter
    if (completionFilter !== 'all') {
      const isCompleted = completedJourneys.includes(journey.id)
      const hasProgress = journey.progress && journey.progress > 0 && journey.progress < 100

      if (completionFilter === 'completed' && !isCompleted) return false
      if (completionFilter === 'in-progress' && !hasProgress) return false
      if (completionFilter === 'not-started' && (isCompleted || hasProgress)) return false
    }

    // Duration filter
    if (durationFilter !== 'all') {
      const duration = parseInt(journey.duration.split('-')[0])
      if (durationFilter === 'quick' && duration >= 20) return false
      if (durationFilter === 'longer' && duration < 20) return false
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const searchableText = [
        journey.title,
        journey.subtitle,
        journey.description,
        ...journey.wonderFacts,
        ...journey.activities,
        journey.ageRange,
        journey.character
      ].join(' ').toLowerCase()

      return searchableText.includes(query)
    }

    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Explorer': return 'bg-blue-100 text-blue-800'
      case 'Expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
            >
              🔍 Explore Your Child's
              <br />
              <span className="bg-gradient-to-r from-brain-600 via-cardiovascular-500 to-respiratory-500 bg-clip-text text-transparent">
                Amazing Body
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              Welcome to an incredible National Geographic-style journey through your child's body.
              Each discovery is designed to amaze, educate, and inspire both you and your child.
            </motion.p>

            {/* Care Plans CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ready to Take Action for Your Child's Health?
                </h3>
                <p className="text-gray-600 mb-4">
                  After exploring these amazing discoveries, ensure your child's optimal health with our comprehensive care plans featuring FDA-approved, non-invasive screenings.
                </p>
                <Link
                  href="/care-plans"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  <Shield className="w-5 h-5" />
                  <span>Explore Care Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Your Discovery Progress</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-brain-600">{completedJourneys.length}/{discoveryJourneys.length}</div>
                <div className="text-sm text-gray-600">Journeys Completed</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-brain-500 to-cardiovascular-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedJourneys.length / discoveryJourneys.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Enhanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by organ, system, or development area (e.g., heart, brain, emotions, movement)... Press Ctrl+K to focus"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    updateSearchSuggestions(e.target.value)
                  }}
                  onFocus={() => updateSearchSuggestions(searchQuery)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brain-500 focus:border-brain-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-brain-600 hover:text-brain-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Content', icon: Star },
                        { id: 'body-systems', label: 'Body Systems', icon: Heart },
                        { id: 'developmental-domains', label: 'Development', icon: Brain }
                      ].map((category) => {
                        const Icon = category.icon
                        return (
                          <button
                            key={category.id}
                            onClick={() => setCategoryFilter(category.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                              categoryFilter === category.id
                                ? 'border-brain-500 bg-brain-50 text-brain-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Completion Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Progress Status</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Journeys', icon: Star },
                        { id: 'completed', label: 'Completed', icon: CheckCircle },
                        { id: 'in-progress', label: 'In Progress', icon: Clock },
                        { id: 'not-started', label: 'Not Started', icon: ArrowRight }
                      ].map((status) => {
                        const Icon = status.icon
                        return (
                          <button
                            key={status.id}
                            onClick={() => setCompletionFilter(status.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                              completionFilter === status.id
                                ? 'border-brain-500 bg-brain-50 text-brain-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{status.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'Any Duration', icon: Clock },
                        { id: 'quick', label: 'Quick (15-18 min)', icon: Zap },
                        { id: 'longer', label: 'Longer (20+ min)', icon: Star }
                      ].map((duration) => {
                        const Icon = duration.icon
                        return (
                          <button
                            key={duration.id}
                            onClick={() => setDurationFilter(duration.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                              durationFilter === duration.id
                                ? 'border-brain-500 bg-brain-50 text-brain-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{duration.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setCategoryFilter('all')
                        setCompletionFilter('all')
                        setDurationFilter('all')
                        setSelectedAge('all')
                        setShowSuggestions(false)
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Age Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {ageFilters.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedAge(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedAge === filter.id
                      ? 'border-brain-500 bg-brain-50 text-brain-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              )
            })}
          </motion.div>

          {/* Results Counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-gray-600">
              <span className="font-medium text-gray-900">{filteredJourneys.length}</span> of {discoveryJourneys.length} discovery journeys
              {searchQuery && (
                <span className="ml-2 text-sm">
                  matching "<span className="font-medium">{searchQuery}</span>"
                </span>
              )}
            </div>

            {filteredJourneys.length === 0 && (
              <div className="text-sm text-gray-500">
                Try adjusting your filters or search terms
              </div>
            )}
          </motion.div>

          {/* Discovery Journeys Masonry Layout */}
          {filteredJourneys.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-0">
              {filteredJourneys.map((journey, index) => {
              const Icon = journey.icon
              const isCompleted = completedJourneys.includes(journey.id)
              
              return (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`group relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer mb-8 break-inside-avoid ${
                    journey.featured ? 'min-h-[600px]' : 'min-h-[400px]'
                  }`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${journey.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 z-10 bg-green-500 text-white p-2 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${journey.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Floating Character */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-3xl"
                      >
                        {journey.character}
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {journey.title}
                    </h3>
                    <p className="text-gray-600 font-medium mb-3">{journey.subtitle}</p>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {journey.description}
                    </p>

                    {/* Journey Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{journey.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{journey.ageRange}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(journey.difficulty)}`}>
                        {journey.difficulty}
                      </div>
                    </div>

                    {/* Wonder Facts Preview */}
                    <div className={`bg-gradient-to-r ${journey.gradient} bg-opacity-10 rounded-xl p-3 mb-4`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">✨</span>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm mb-1">Wonder Fact!</h4>
                          <p className="text-gray-700 text-xs">{journey.wonderFacts[0]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Preview Content for Featured Cards */}
                    {journey.featured && journey.previewContent && (
                      <div className="space-y-4 mb-4">
                        {/* Stats Preview */}
                        {journey.previewContent.stats && (
                          <div className="grid grid-cols-2 gap-2">
                            {journey.previewContent.stats.map((stat, i) => (
                              <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                                <div className="text-xs text-gray-600">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick Facts */}
                        {journey.previewContent.quickFacts && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-gray-900">Quick Facts:</h5>
                            {journey.previewContent.quickFacts.map((fact, i) => (
                              <div key={i} className="flex items-start space-x-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span className="text-xs text-gray-600">{fact}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Interactive Elements Preview */}
                        {journey.previewContent.interactiveElements && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-gray-900">Interactive Features:</h5>
                            <div className="flex flex-wrap gap-1">
                              {journey.previewContent.interactiveElements.map((element, i) => (
                                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {element}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/discovery/${journey.id}`}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isCompleted
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : `bg-gradient-to-r ${journey.gradient} text-white hover:shadow-lg group-hover:scale-105`
                      }`}
                    >
                      <span>{isCompleted ? 'Explore Again' : 'Begin Discovery'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Hover Effect Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${journey.gradient} rounded-full opacity-0 group-hover:opacity-60`}
                        style={{
                          left: `${15 + i * 10}%`,
                          top: `${10 + i * 8}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )
              })}
            </div>
          ) : (
            /* No Results State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No discoveries found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any discovery journeys matching your current filters.
                  Try adjusting your search terms or clearing some filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setCompletionFilter('all')
                    setDurationFilter('all')
                    setSelectedAge('all')
                    setShowSuggestions(false)
                  }}
                  className="bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Educational Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Continue Learning with World-Class Educational Content
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Expand your child's curiosity with these amazing educational resources that inspire wonder and learning
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <a
                href="https://kurzgesagt.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Microscope className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Kurzgesagt</h3>
                <p className="text-sm text-gray-600">Beautiful animated science videos that make complex topics accessible and engaging</p>
              </a>

              <a
                href="https://kids.nationalgeographic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Brain className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Nat Geo Kids</h3>
                <p className="text-sm text-gray-600">Explore nature, science, and the human body with stunning photography and facts</p>
              </a>

              <a
                href="https://www.brainpop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">BrainPOP</h3>
                <p className="text-sm text-gray-600">Interactive learning videos covering health, science, and human body systems</p>
              </a>

              <a
                href="https://www.khanacademy.org/science/biology/human-biology"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Khan Academy</h3>
                <p className="text-sm text-gray-600">Free, comprehensive lessons on human biology and body systems</p>
              </a>

              <a
                href="https://ed.ted.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Brain className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">TED-Ed</h3>
                <p className="text-sm text-gray-600">Thought-provoking animated lessons on science, health, and human body</p>
              </a>
            </div>
          </motion.div>

          {/* Care Plans CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Ensure Your Child's Health?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              After exploring these amazing discoveries, take the next step to protect and nurture your child's development with our comprehensive care plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/care-plans"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Shield className="w-5 h-5" />
                <span>Explore Care Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/interventions"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Target className="w-5 h-5" />
                <span>Specialized Interventions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Interventions Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎯 Need Specialized Care?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                If your discovery journey revealed specific concerns, our specialized interventions use cutting-edge technology
                and evidence-based approaches to address vision, hearing, behavioral, and developmental challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Vision Intervention</h3>
                <p className="text-sm text-gray-600">Myopia arrest lenses & amblyopia treatment</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ear className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Hearing Enhancement</h3>
                <p className="text-sm text-gray-600">SoundScout technology & auditory therapy</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Behavioral Support</h3>
                <p className="text-sm text-gray-600">ADHD, autism & learning interventions</p>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Amazing Discoveries Coming Soon!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're working on even more incredible journeys including the immune system, 
              nervous system, and musculoskeletal system. Each with interactive 3D models 
              and hands-on activities!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['🦴 Bones & Muscles', '🛡️ Immune System', '⚡ Nervous System', '🧬 DNA & Genetics'].map((coming, index) => (
                <motion.div
                  key={coming}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white px-4 py-2 rounded-full border border-purple-200 text-sm font-medium text-gray-700"
                >
                  {coming}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
