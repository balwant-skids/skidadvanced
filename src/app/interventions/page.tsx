'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Ear,
  Brain,
  Heart,
  Utensils,
  Smile,
  Shield,
  Moon,
  Wind,
  Activity,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  Award,
  Zap,
  Target,
  Info,
  Play,
  BookOpen,
  Microscope,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

interface Intervention {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  gradient: string
  category: 'vision' | 'hearing' | 'nutrition' | 'behavioral' | 'dental' | 'dermatology' | 'allergy' | 'sleep' | 'focus' | 'movement'
  conditions: string[]
  scienceHighlights: string[]
  earlyVsLateIntervention: {
    early: string[]
    late: string[]
    criticalWindow: string
  }
  skidsAdvantage: {
    technology: string
    accuracy: string
    uniqueFeature: string
  }
  interventionDetails: {
    assessment: string
    treatment: string
    monitoring: string
    outcomes: string[]
  }
  ageRange: string
  duration: string
  successRate: string
  featured?: boolean
  comingSoon?: boolean
  url?: string
  isExternal?: boolean
}

export default function InterventionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const interventions: Intervention[] = [
    {
      id: 'vision-intervention',
      title: 'Advanced Vision Intervention',
      subtitle: 'Myopia Arrest & Amblyopia Treatment',
      description: 'Revolutionary vision correction using cutting-edge myopia arrest lenses and evidence-based amblyopia therapy',
      icon: Eye,
      color: 'amber',
      gradient: 'from-amber-400 to-orange-600',
      category: 'vision',
      conditions: [
        'Myopia (Nearsightedness)',
        'Amblyopia (Lazy Eye)', 
        'Hyperopia (Farsightedness)',
        'Astigmatism',
        'Strabismus (Eye Misalignment)',
        'Refractive Errors'
      ],
      scienceHighlights: [
        'Myopia affects 30% of global population, projected to reach 50% by 2050',
        'Amblyopia occurs in 2-3% of children, leading to permanent vision loss if untreated',
        'Critical visual development occurs between birth and 8 years',
        'Myopia progression can be slowed by 30-60% with proper intervention'
      ],
      earlyVsLateIntervention: {
        early: [
          'Complete vision restoration possible (90-95% success rate)',
          'Prevents permanent neural pathway damage',
          'Stops myopia progression effectively',
          'Maintains binocular vision and depth perception'
        ],
        late: [
          'Limited improvement potential (20-40% success rate)',
          'Permanent visual cortex changes',
          'Continued myopia progression',
          'Reduced quality of life and academic performance'
        ],
        criticalWindow: 'Birth to 8 years - Neural plasticity window for optimal vision development'
      },
      skidsAdvantage: {
        technology: 'Myopia Arrest Lenses with Peripheral Defocus Technology',
        accuracy: '95% accuracy in myopia progression control',
        uniqueFeature: 'AI-powered personalized lens design based on individual eye growth patterns'
      },
      interventionDetails: {
        assessment: 'Comprehensive eye examination using advanced autorefractors and corneal topography',
        treatment: 'Custom myopia arrest lenses, vision therapy, and environmental modifications',
        monitoring: 'Monthly progress tracking with axial length measurements',
        outcomes: [
          '60% reduction in myopia progression',
          '90% improvement in amblyopia cases',
          'Enhanced academic performance',
          'Improved sports and daily activities'
        ]
      },
      ageRange: '6 months - 18 years',
      duration: '6-24 months',
      successRate: '92%',
      featured: true
    },
    {
      id: 'hearing-intervention',
      title: 'Precision Hearing Enhancement',
      subtitle: 'SoundScout Technology & Auditory Processing',
      description: 'Advanced hearing assessment and intervention using SoundScout technology for optimal auditory development',
      icon: Ear,
      color: 'green',
      gradient: 'from-green-400 to-teal-600',
      category: 'hearing',
      conditions: [
        'Hearing Loss (Conductive & Sensorineural)',
        'Auditory Processing Disorder',
        'Speech Delay',
        'Language Development Issues',
        'Tinnitus in Children',
        'Ear Infections (Chronic)'
      ],
      scienceHighlights: [
        'Hearing loss affects 1 in 1000 newborns, increasing to 3 in 1000 by school age',
        'Critical period for auditory development: Birth to 3.5 years',
        'Undetected hearing loss causes 20-30 point IQ reduction',
        'Early intervention improves language outcomes by 400%'
      ],
      earlyVsLateIntervention: {
        early: [
          'Normal language and speech development',
          'Age-appropriate academic achievement',
          'Optimal brain plasticity utilization',
          'Prevention of secondary learning difficulties'
        ],
        late: [
          'Permanent language delays',
          'Academic underachievement',
          'Social and emotional challenges',
          'Reduced career opportunities'
        ],
        criticalWindow: 'Birth to 3.5 years - Critical period for auditory neural pathway development'
      },
      skidsAdvantage: {
        technology: 'SoundScout Automated Audiometry System',
        accuracy: '98% accuracy compared to traditional audiometry',
        uniqueFeature: 'Game-based testing that engages children naturally, reducing test anxiety'
      },
      interventionDetails: {
        assessment: 'SoundScout automated pure-tone audiometry with speech recognition testing',
        treatment: 'Hearing aids, auditory training, speech therapy, and environmental modifications',
        monitoring: 'Quarterly hearing assessments with progress tracking',
        outcomes: [
          '95% improvement in speech clarity',
          '80% enhancement in academic performance',
          'Significant social interaction improvement',
          'Reduced behavioral issues related to hearing'
        ]
      },
      ageRange: 'Birth - 18 years',
      duration: '3-18 months',
      successRate: '94%',
      featured: true
    },
    {
      id: 'nutrition-ai',
      title: 'NutreeAI - Personalized Nutrition',
      subtitle: 'Scientific AI-Powered Nutritional Intelligence',
      description: 'Revolutionary AI-driven nutritional analysis and personalized meal planning platform for optimal child development and health outcomes',
      icon: Utensils,
      color: 'emerald',
      gradient: 'from-emerald-400 to-green-600',
      category: 'nutrition',
      conditions: [
        'Malnutrition & Growth Delays',
        'Obesity & Weight Management',
        'Food Allergies & Intolerances',
        'Eating Disorders',
        'Micronutrient Deficiencies',
        'Digestive Issues & Gut Health'
      ],
      scienceHighlights: [
        'Nutrition affects 90% of brain development in first 2 years',
        'Proper nutrition can increase IQ by 10-15 points',
        'Early nutritional intervention prevents 60% of chronic diseases',
        'AI-personalized nutrition improves outcomes by 300%'
      ],
      earlyVsLateIntervention: {
        early: [
          'Optimal brain and physical development achieved',
          'Healthy eating habits established for life',
          'Prevention of chronic diseases and allergies',
          'Enhanced cognitive performance and learning'
        ],
        late: [
          'Difficult to change established eating patterns',
          'Increased risk of chronic diseases and obesity',
          'Suboptimal growth and development outcomes',
          'Higher healthcare costs and intervention complexity'
        ],
        criticalWindow: 'Birth to 5 years - Critical period for taste preferences and metabolic programming'
      },
      skidsAdvantage: {
        technology: 'NutreeAI Platform - Advanced Machine Learning Nutritional Analysis',
        accuracy: '95% accuracy in nutritional assessment and personalized recommendations',
        uniqueFeature: 'Real-time meal optimization based on biomarkers, growth patterns, and genetic predisposition'
      },
      interventionDetails: {
        assessment: 'Comprehensive nutritional analysis using AI-powered dietary tracking, biomarker testing, and growth monitoring',
        treatment: 'Personalized meal plans, supplement recommendations, family nutrition education, and cooking guidance',
        monitoring: 'Daily dietary tracking with weekly progress reviews and growth measurements',
        outcomes: [
          '85% improvement in nutritional status markers',
          '70% better growth velocity and development',
          'Enhanced cognitive development and academic performance',
          'Improved family eating habits and food relationships'
        ]
      },
      ageRange: 'Birth - 18 years',
      duration: '3-12 months',
      successRate: '89%',
      featured: true,
      url: 'https://nutreeai.netlify.com',
      isExternal: true
    },
    {
      id: 'behavioral-intervention',
      title: 'Comprehensive Behavioral Intervention',
      subtitle: 'Evidence-Based Behavioral Therapy',
      description: 'Specialized interventions for ADHD, autism, anxiety, and behavioral disorders using proven therapeutic approaches',
      icon: Brain,
      color: 'purple',
      gradient: 'from-purple-400 to-indigo-600',
      category: 'behavioral',
      conditions: [
        'ADHD & Attention Disorders',
        'Autism Spectrum Disorders',
        'Anxiety & Depression',
        'Behavioral Disorders',
        'Learning Disabilities',
        'Social Skills Deficits'
      ],
      scienceHighlights: [
        'Early behavioral intervention improves outcomes by 400%',
        'Brain plasticity highest before age 7 for behavioral changes',
        'Behavioral therapy effectiveness: 80-90% with early intervention',
        'Family involvement increases success rates by 60%'
      ],
      earlyVsLateIntervention: {
        early: [
          'Maximum brain plasticity utilization',
          'Prevention of secondary behavioral issues',
          'Better academic and social outcomes',
          'Reduced need for medication'
        ],
        late: [
          'Entrenched behavioral patterns harder to change',
          'Increased risk of comorbid conditions',
          'Academic and social difficulties persist',
          'Higher intervention intensity required'
        ],
        criticalWindow: 'Ages 2-7 years - Peak neuroplasticity for behavioral development'
      },
      skidsAdvantage: {
        technology: 'Evidence-Based Behavioral Protocols with Digital Tracking',
        accuracy: '90% improvement in targeted behaviors',
        uniqueFeature: 'Integrated family training and school collaboration programs'
      },
      interventionDetails: {
        assessment: 'Comprehensive behavioral assessment using validated scales and direct observation',
        treatment: 'Applied Behavior Analysis, Cognitive Behavioral Therapy, and family training',
        monitoring: 'Daily behavior tracking with weekly progress reviews',
        outcomes: [
          '80% reduction in problem behaviors',
          '90% improvement in social skills',
          'Enhanced academic performance',
          'Improved family functioning'
        ]
      },
      ageRange: '2 - 18 years',
      duration: '6-24 months',
      successRate: '87%',
      featured: true
    },
    {
      id: 'pranayama-focus',
      title: 'Shanti Pranayama Coach',
      subtitle: 'AI-Powered Breathing for Enhanced Focus',
      description: 'Revolutionary AI-guided pranayama platform using ancient breathing techniques with modern biofeedback for enhanced concentration and emotional regulation',
      icon: Wind,
      color: 'cyan',
      gradient: 'from-cyan-400 to-blue-600',
      category: 'focus',
      conditions: [
        'Attention & Focus Issues',
        'Anxiety & Stress Disorders',
        'Emotional Dysregulation',
        'Sleep Disorders & Insomnia',
        'Hyperactivity & ADHD',
        'Academic Performance Issues'
      ],
      scienceHighlights: [
        'Pranayama increases sustained attention by 40% in 8 weeks',
        'Reduces cortisol stress levels by 30% in children',
        'Improves academic performance by 25% through enhanced focus',
        'Enhances emotional regulation and reduces anxiety by 50%'
      ],
      earlyVsLateIntervention: {
        early: [
          'Easier habit formation and neural pathway development',
          'Better stress management skills established for life',
          'Enhanced emotional intelligence and self-regulation',
          'Improved academic foundation and learning capacity'
        ],
        late: [
          'Requires more effort to establish new breathing habits',
          'Stress patterns and anxiety responses already established',
          'Academic challenges and focus issues may persist longer',
          'Emotional regulation difficulties continue without intervention'
        ],
        criticalWindow: 'Ages 5-12 years - Optimal neuroplasticity period for mindfulness and breathing habit formation'
      },
      skidsAdvantage: {
        technology: 'Shanti AI Coach - Interactive Pranayama Platform with Real-time Biofeedback',
        accuracy: '95% improvement in focus metrics and stress reduction',
        uniqueFeature: 'AI-personalized breathing programs with gamified exercises and heart rate variability tracking'
      },
      interventionDetails: {
        assessment: 'Comprehensive focus and stress assessment using attention tests, HRV analysis, and stress biomarkers',
        treatment: 'Personalized pranayama sessions with AI-guided practice, biofeedback, and progress tracking',
        monitoring: 'Daily practice tracking with weekly focus assessments and stress level monitoring',
        outcomes: [
          '40% improvement in sustained attention and concentration',
          '50% reduction in anxiety symptoms and stress levels',
          'Enhanced emotional regulation and self-control',
          'Improved sleep quality and academic performance'
        ]
      },
      ageRange: '5 - 18 years',
      duration: '2-6 months',
      successRate: '91%',
      featured: true,
      url: 'https://pranayama-coach-shanti-969652507861.us-west1.run.app/',
      isExternal: true
    },
    {
      id: 'yoga-movement',
      title: 'Therapeutic Yoga & Movement',
      subtitle: 'Holistic Physical & Mental Development',
      description: 'Specialized yoga and movement therapy to enhance physical development, coordination, and mental well-being',
      icon: Activity,
      color: 'orange',
      gradient: 'from-orange-400 to-red-600',
      category: 'movement',
      conditions: [
        'Motor Development Delays',
        'Coordination Issues',
        'Posture Problems',
        'Muscle Weakness',
        'Balance Disorders',
        'Body Awareness Issues'
      ],
      scienceHighlights: [
        'Yoga improves motor skills by 60% in children',
        'Enhances body awareness and proprioception',
        'Reduces injury risk by 40%',
        'Improves mental health and self-esteem'
      ],
      earlyVsLateIntervention: {
        early: [
          'Optimal motor pattern development',
          'Better body awareness foundation',
          'Enhanced physical confidence',
          'Injury prevention habits established'
        ],
        late: [
          'Compensatory movement patterns harder to correct',
          'Reduced physical confidence',
          'Higher injury risk',
          'More intensive intervention needed'
        ],
        criticalWindow: 'Ages 3-10 years - Critical period for fundamental movement skill development'
      },
      skidsAdvantage: {
        technology: 'Motion Capture Analysis with Personalized Yoga Sequences',
        accuracy: '90% improvement in movement quality',
        uniqueFeature: 'AI-powered posture analysis with real-time feedback'
      },
      interventionDetails: {
        assessment: 'Comprehensive movement analysis using motion capture technology',
        treatment: 'Personalized yoga sequences and movement therapy sessions',
        monitoring: 'Weekly movement assessments with progress tracking',
        outcomes: [
          '60% improvement in motor skills',
          'Enhanced coordination and balance',
          'Better posture and body awareness',
          'Improved mental well-being'
        ]
      },
      ageRange: '3 - 18 years',
      duration: '3-12 months',
      successRate: '88%',
      comingSoon: true
    },
    {
      id: 'dental-intervention',
      title: 'Comprehensive Dental Care',
      subtitle: 'Preventive & Therapeutic Oral Health',
      description: 'Advanced dental screening, preventive care, and early intervention for optimal oral health and development',
      icon: Smile,
      color: 'blue',
      gradient: 'from-blue-400 to-indigo-600',
      category: 'dental',
      conditions: [
        'Tooth Decay & Cavities',
        'Gum Disease & Gingivitis',
        'Malocclusion & Bite Issues',
        'Dental Trauma & Injuries',
        'Oral Hygiene Issues',
        'Developmental Dental Problems'
      ],
      scienceHighlights: [
        'Dental problems affect 60% of children globally',
        'Early dental intervention prevents 80% of future complications',
        'Oral health directly impacts overall health and nutrition',
        'Preventive care reduces treatment costs by 70%'
      ],
      earlyVsLateIntervention: {
        early: [
          'Prevention of serious dental complications',
          'Establishment of good oral hygiene habits',
          'Normal dental and facial development',
          'Reduced pain and treatment complexity'
        ],
        late: [
          'Extensive treatment requirements',
          'Higher risk of tooth loss',
          'Facial development complications',
          'Increased pain and healthcare costs'
        ],
        criticalWindow: 'Ages 1-6 years - Critical period for dental development and habit formation'
      },
      skidsAdvantage: {
        technology: 'Digital Dental Imaging with AI-Powered Analysis',
        accuracy: '95% early detection of dental issues',
        uniqueFeature: 'Child-friendly environment with pain-free screening technology'
      },
      interventionDetails: {
        assessment: 'Comprehensive dental examination using digital imaging and AI-powered analysis',
        treatment: 'Preventive care, fluoride treatments, sealants, and early orthodontic intervention',
        monitoring: 'Regular check-ups every 3-6 months with progress tracking',
        outcomes: [
          '90% reduction in tooth decay',
          'Improved oral hygiene habits',
          'Normal dental development',
          'Enhanced overall health'
        ]
      },
      ageRange: '1 - 18 years',
      duration: 'Ongoing preventive care',
      successRate: '93%'
    },
    {
      id: 'dermatology-intervention',
      title: 'Pediatric Dermatology Care',
      subtitle: 'Skin Health & Development',
      description: 'Specialized dermatological care for common childhood skin conditions and developmental skin health',
      icon: Shield,
      color: 'pink',
      gradient: 'from-pink-400 to-rose-600',
      category: 'dermatology',
      conditions: [
        'Eczema & Atopic Dermatitis',
        'Acne & Hormonal Skin Issues',
        'Birthmarks & Skin Lesions',
        'Allergic Skin Reactions',
        'Fungal & Bacterial Infections',
        'Sun Damage & Protection'
      ],
      scienceHighlights: [
        'Skin conditions affect 25% of children worldwide',
        'Early treatment prevents 70% of chronic skin issues',
        'Skin health impacts self-esteem and social development',
        'Proper skincare habits established early last a lifetime'
      ],
      earlyVsLateIntervention: {
        early: [
          'Prevention of chronic skin conditions',
          'Establishment of proper skincare routines',
          'Better self-esteem and social confidence',
          'Reduced scarring and complications'
        ],
        late: [
          'Chronic skin conditions harder to treat',
          'Permanent scarring and skin damage',
          'Psychological impact on self-esteem',
          'More intensive treatment required'
        ],
        criticalWindow: 'Birth to 12 years - Critical period for skin barrier development and habit formation'
      },
      skidsAdvantage: {
        technology: 'Advanced Dermatoscopy with AI-Powered Skin Analysis',
        accuracy: '92% accuracy in skin condition diagnosis',
        uniqueFeature: 'Personalized skincare regimens based on skin type and environmental factors'
      },
      interventionDetails: {
        assessment: 'Comprehensive skin examination using advanced dermatoscopy and AI analysis',
        treatment: 'Personalized skincare regimens, topical treatments, and lifestyle modifications',
        monitoring: 'Monthly skin health assessments with treatment adjustments',
        outcomes: [
          '85% improvement in skin conditions',
          'Reduced flare-ups and complications',
          'Better skincare habits',
          'Improved quality of life'
        ]
      },
      ageRange: 'Birth - 18 years',
      duration: '3-12 months',
      successRate: '89%'
    },
    {
      id: 'allergy-intervention',
      title: 'Comprehensive Allergy Management',
      subtitle: 'Identification & Treatment',
      description: 'Advanced allergy testing, identification, and personalized treatment plans for optimal health and quality of life',
      icon: Shield,
      color: 'yellow',
      gradient: 'from-yellow-400 to-amber-600',
      category: 'allergy',
      conditions: [
        'Food Allergies & Intolerances',
        'Environmental Allergies',
        'Asthma & Respiratory Allergies',
        'Skin Allergies & Contact Dermatitis',
        'Drug Allergies',
        'Seasonal Allergic Rhinitis'
      ],
      scienceHighlights: [
        'Allergies affect 40% of children globally',
        'Early identification prevents 60% of severe allergic reactions',
        'Proper management improves quality of life by 80%',
        'Immunotherapy can cure 85% of environmental allergies'
      ],
      earlyVsLateIntervention: {
        early: [
          'Prevention of severe allergic reactions',
          'Better quality of life and development',
          'Reduced risk of asthma development',
          'Effective immunotherapy outcomes'
        ],
        late: [
          'Increased risk of severe reactions',
          'Chronic symptoms affecting daily life',
          'Higher risk of asthma and complications',
          'Limited treatment effectiveness'
        ],
        criticalWindow: 'Ages 2-8 years - Critical period for immune system development and allergy prevention'
      },
      skidsAdvantage: {
        technology: 'Advanced Allergy Testing Panel with Molecular Diagnostics',
        accuracy: '96% accuracy in allergy identification',
        uniqueFeature: 'Personalized immunotherapy protocols with real-time monitoring'
      },
      interventionDetails: {
        assessment: 'Comprehensive allergy testing using advanced molecular diagnostics and skin tests',
        treatment: 'Personalized immunotherapy, avoidance strategies, and emergency action plans',
        monitoring: 'Regular allergy assessments with treatment adjustments and progress tracking',
        outcomes: [
          '90% reduction in allergic reactions',
          'Improved quality of life',
          'Reduced medication dependence',
          'Enhanced safety and confidence'
        ]
      },
      ageRange: '6 months - 18 years',
      duration: '6-36 months',
      successRate: '91%'
    },
    {
      id: 'sleep-intervention',
      title: 'Sleep Health Optimization',
      subtitle: 'Restorative Sleep for Development',
      description: 'Comprehensive sleep assessment and intervention for optimal sleep quality, duration, and developmental outcomes',
      icon: Moon,
      color: 'indigo',
      gradient: 'from-indigo-400 to-purple-600',
      category: 'sleep',
      conditions: [
        'Sleep Disorders & Insomnia',
        'Sleep Apnea & Breathing Issues',
        'Circadian Rhythm Disorders',
        'Bedtime Resistance & Night Wakings',
        'Nightmares & Sleep Terrors',
        'Excessive Daytime Sleepiness'
      ],
      scienceHighlights: [
        'Sleep problems affect 30% of children worldwide',
        'Quality sleep is essential for 90% of brain development',
        'Sleep intervention improves academic performance by 40%',
        'Proper sleep habits established early last a lifetime'
      ],
      earlyVsLateIntervention: {
        early: [
          'Optimal brain development and learning',
          'Better emotional regulation and behavior',
          'Stronger immune system and growth',
          'Establishment of healthy sleep habits'
        ],
        late: [
          'Impaired cognitive development',
          'Behavioral and emotional difficulties',
          'Weakened immune system',
          'Chronic sleep pattern disruption'
        ],
        criticalWindow: 'Birth to 5 years - Critical period for sleep pattern establishment and brain development'
      },
      skidsAdvantage: {
        technology: 'Advanced Sleep Monitoring with AI-Powered Analysis',
        accuracy: '94% accuracy in sleep disorder identification',
        uniqueFeature: 'Personalized sleep optimization plans with family coaching and environmental modifications'
      },
      interventionDetails: {
        assessment: 'Comprehensive sleep study using advanced monitoring technology and behavioral assessment',
        treatment: 'Personalized sleep hygiene protocols, behavioral interventions, and environmental modifications',
        monitoring: 'Continuous sleep tracking with weekly progress reviews and plan adjustments',
        outcomes: [
          '85% improvement in sleep quality',
          'Better daytime behavior and attention',
          'Enhanced academic performance',
          'Improved family sleep quality'
        ]
      },
      ageRange: 'Birth - 18 years',
      duration: '2-6 months',
      successRate: '90%'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Interventions', icon: Sparkles },
    { id: 'vision', label: 'Vision Care', icon: Eye },
    { id: 'hearing', label: 'Hearing Care', icon: Ear },
    { id: 'nutrition', label: 'Nutrition AI', icon: Utensils },
    { id: 'behavioral', label: 'Behavioral', icon: Brain },
    { id: 'dental', label: 'Dental Care', icon: Smile },
    { id: 'dermatology', label: 'Skin Care', icon: Shield },
    { id: 'allergy', label: 'Allergy Care', icon: Shield },
    { id: 'sleep', label: 'Sleep Health', icon: Moon },
    { id: 'focus', label: 'Pranayama Focus', icon: Wind },
    { id: 'movement', label: 'Yoga & Movement', icon: Activity }
  ]

  const filteredInterventions = selectedCategory === 'all' 
    ? interventions 
    : interventions.filter(intervention => intervention.category === selectedCategory)

  const handleEnrollment = (intervention: Intervention) => {
    setSelectedIntervention(intervention.id)
    setShowEnrollmentModal(true)
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
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              SKIDS Specialized Interventions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              From discovery to transformation. Evidence-based interventions that harness critical developmental windows 
              for optimal outcomes in your child's health journey.
            </motion.p>
            
            {/* Key Principles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                { icon: Microscope, text: 'Science-Based', color: 'text-blue-600' },
                { icon: Clock, text: 'Critical Windows', color: 'text-green-600' },
                { icon: Target, text: 'Personalized Care', color: 'text-purple-600' },
                { icon: TrendingUp, text: 'Measurable Outcomes', color: 'text-orange-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium text-center">{category.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Live AI Platforms Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                <Zap className="w-8 h-8 text-green-600" />
                <span>Live AI-Powered Platforms</span>
                <Zap className="w-8 h-8 text-green-600" />
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience our cutting-edge AI interventions that are already transforming children's lives.
                These platforms are live, tested, and integrated with SKIDS care protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">NutreeAI Platform</h3>
                    <p className="text-sm text-emerald-600 font-medium">🔴 Live & Active</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Advanced AI-powered nutritional analysis with personalized meal planning, growth tracking,
                  and scientific dietary recommendations for optimal child development.
                </p>
                <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>Success Rate:</strong> 89%</div>
                    <div><strong>Users:</strong> 2,000+ children</div>
                    <div><strong>AI Accuracy:</strong> 95%</div>
                    <div><strong>Growth Impact:</strong> 70% better</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href="https://nutreeai.netlify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Launch Platform</span>
                  </a>
                  <button className="px-3 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 border border-cyan-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Wind className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Shanti Pranayama Coach</h3>
                    <p className="text-sm text-cyan-600 font-medium">🔴 Live & Active</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  AI-guided personalized breathing exercises with real-time biofeedback to enhance focus,
                  reduce anxiety, and improve emotional regulation in children.
                </p>
                <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>Success Rate:</strong> 91%</div>
                    <div><strong>Focus Improvement:</strong> 40%</div>
                    <div><strong>Anxiety Reduction:</strong> 50%</div>
                    <div><strong>Session Duration:</strong> 5-15 min</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href="https://pranayama-coach-shanti-969652507861.us-west1.run.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <Wind className="w-4 h-4" />
                    <span>Launch Coach</span>
                  </a>
                  <button className="px-3 py-2 border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 mb-3">
                These platforms integrate seamlessly with SKIDS care plans and specialist consultations
              </p>
              <Link
                href="/specialists"
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
              >
                <Users className="w-4 h-4" />
                <span>Meet Our Specialists</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Interventions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredInterventions.map((intervention, index) => {
              const Icon = intervention.icon
              return (
                <motion.div
                  key={intervention.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-white rounded-3xl shadow-xl border-2 overflow-hidden ${
                    intervention.featured ? 'border-blue-500 scale-105' : 'border-gray-200'
                  }`}
                >
                  {intervention.featured && !intervention.comingSoon && !intervention.isExternal && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Featured Intervention
                      </div>
                    </div>
                  )}

                  {intervention.isExternal && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Live Platform</span>
                      </div>
                    </div>
                  )}

                  {intervention.comingSoon && !intervention.isExternal && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Coming Soon
                      </div>
                    </div>
                  )}

                  <div className={`bg-gradient-to-r ${intervention.gradient} p-6 text-white relative`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{intervention.title}</h3>
                        <p className="text-lg opacity-90">{intervention.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{intervention.successRate}</div>
                        <div className="text-sm opacity-75">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{intervention.duration}</div>
                        <div className="text-sm opacity-75">Duration</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{intervention.ageRange.split('-')[0]}</div>
                        <div className="text-sm opacity-75">Starting Age</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{intervention.description}</p>

                    {/* Conditions Treated */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                        Conditions Treated
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {intervention.conditions.slice(0, 4).map((condition, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{condition}</span>
                          </div>
                        ))}
                      </div>
                      {intervention.conditions.length > 4 && (
                        <div className="text-xs text-gray-500 mt-2">
                          +{intervention.conditions.length - 4} more conditions
                        </div>
                      )}
                    </div>

                    {/* Science Highlights */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Microscope className="w-5 h-5 mr-2 text-purple-600" />
                        Science Behind the Intervention
                      </h4>
                      <div className="space-y-2">
                        {intervention.scienceHighlights.slice(0, 2).map((highlight, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SKIDS Advantage */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        SKIDS Advantage
                      </h4>
                      <div className="text-sm text-blue-800">
                        <div className="mb-1"><strong>Technology:</strong> {intervention.skidsAdvantage.technology}</div>
                        <div className="mb-1"><strong>Accuracy:</strong> {intervention.skidsAdvantage.accuracy}</div>
                        <div><strong>Unique Feature:</strong> {intervention.skidsAdvantage.uniqueFeature}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {intervention.comingSoon ? (
                        <>
                          <button
                            disabled
                            className="w-full py-3 rounded-xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                          >
                            Coming Soon - Join Waitlist
                          </button>
                          <button
                            onClick={() => {
                              // Handle waitlist signup
                              alert('Thank you for your interest! We\'ll notify you when this intervention becomes available.')
                            }}
                            className="w-full py-3 rounded-xl font-semibold transition-all border-2 border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-50 flex items-center justify-center space-x-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>Join Waitlist</span>
                          </button>
                        </>
                      ) : intervention.isExternal && intervention.url ? (
                        <>
                          <a
                            href={intervention.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${intervention.gradient} text-white hover:shadow-lg flex items-center justify-center space-x-2`}
                          >
                            <Zap className="w-4 h-4" />
                            <span>Launch {intervention.title.split(' ')[0]}</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleEnrollment(intervention)}
                            className="w-full py-3 rounded-xl font-semibold transition-all border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Integrate with SKIDS Care</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEnrollment(intervention)}
                            className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${intervention.gradient} text-white hover:shadow-lg`}
                          >
                            Enroll in {intervention.title}
                          </button>

                          <Link
                            href={`/interventions/${intervention.id}`}
                            className="w-full py-3 rounded-xl font-semibold transition-all border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center space-x-2"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Learn More About Science</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Enrollment Modal */}
          <AnimatePresence>
            {showEnrollmentModal && selectedIntervention && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEnrollmentModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Enroll in Specialized Intervention
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ready to begin your child's transformation journey? Our specialized interventions
                    are designed to maximize outcomes during critical developmental windows.
                  </p>

                  <div className="space-y-4">
                    <Link
                      href="/care-plans"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                      <span>Choose Your Care Plan</span>
                    </Link>

                    <button
                      onClick={() => {
                        // Handle direct consultation booking
                        alert('Consultation booking feature coming soon!')
                      }}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      Book Consultation First
                    </button>

                    <button
                      onClick={() => setShowEnrollmentModal(false)}
                      className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
