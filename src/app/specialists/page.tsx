'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Ear,
  Utensils,
  Brain,
  Smile,
  Shield,
  Users,
  Network,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  MessageCircle,
  FileText,
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

export default function SpecialistsPage() {
  const [showTeamModal, setShowTeamModal] = useState(false)

  const organSystems = [
    {
      id: 'vision-system',
      name: 'Vision & Eye Health',
      icon: Eye,
      gradient: 'from-amber-400 to-orange-600',
      specialists: ['Pediatric Ophthalmologist', 'Vision Therapist', 'Optometrist'],
      conditions: ['Myopia', 'Amblyopia', 'Strabismus', 'Refractive Errors'],
      technology: 'AI-Powered Myopia Arrest Lenses, Advanced Eye Imaging',
      teamApproach: 'Coordinated care between ophthalmologist, optometrist, and vision therapist for comprehensive eye development monitoring and intervention.',
      outcomes: '92% success rate in vision correction and development',
      criticalWindow: 'Birth to 8 years for optimal neural plasticity'
    },
    {
      id: 'hearing-system',
      name: 'Hearing & Auditory Health',
      icon: Ear,
      gradient: 'from-green-400 to-teal-600',
      specialists: ['Pediatric Audiologist', 'ENT Specialist', 'Speech Therapist'],
      conditions: ['Hearing Loss', 'Auditory Processing Disorder', 'Speech Delays'],
      technology: 'SoundScout Automated Audiometry, Cochlear Implant Technology',
      teamApproach: 'Integrated team of audiologist, ENT specialist, and speech therapist working together for complete auditory development and communication skills.',
      outcomes: '94% success rate in hearing intervention and speech development',
      criticalWindow: 'Birth to 3.5 years for auditory neural pathway development'
    },
    {
      id: 'nutrition-system',
      name: 'Nutrition & Growth',
      icon: Utensils,
      gradient: 'from-emerald-400 to-green-600',
      specialists: ['Pediatric Nutritionist', 'Gastroenterologist', 'Dietitian'],
      conditions: ['Growth Delays', 'Malnutrition', 'Food Allergies', 'Eating Disorders'],
      technology: 'AI-Powered Nutritional Analysis, Growth Tracking Systems',
      teamApproach: 'Collaborative approach between nutritionist, gastroenterologist, and dietitian for comprehensive growth optimization and healthy eating habits.',
      outcomes: '89% improvement in nutritional status and growth velocity',
      criticalWindow: 'Birth to 5 years for metabolic programming and taste preferences'
    },
    {
      id: 'behavioral-system',
      name: 'Behavioral & Mental Health',
      icon: Brain,
      gradient: 'from-purple-400 to-indigo-600',
      specialists: ['Pediatric Psychologist', 'Behavioral Therapist', 'Psychiatrist'],
      conditions: ['ADHD', 'Autism Spectrum', 'Anxiety', 'Learning Disabilities'],
      technology: 'Evidence-Based Behavioral Protocols, Digital Tracking Systems',
      teamApproach: 'Multidisciplinary team including psychologist, behavioral therapist, and psychiatrist for comprehensive mental health and developmental support.',
      outcomes: '87% improvement in behavioral challenges and developmental milestones',
      criticalWindow: 'Ages 2-7 years for peak neuroplasticity and habit formation'
    },
    {
      id: 'dental-system',
      name: 'Oral Health & Development',
      icon: Smile,
      gradient: 'from-blue-400 to-indigo-600',
      specialists: ['Pediatric Dentist', 'Orthodontist', 'Oral Hygienist'],
      conditions: ['Tooth Decay', 'Malocclusion', 'Gum Disease', 'Dental Trauma'],
      technology: 'Digital Dental Imaging, Laser Dentistry, AI-Powered Caries Detection',
      teamApproach: 'Coordinated care between pediatric dentist, orthodontist, and hygienist for comprehensive oral health and proper dental development.',
      outcomes: '93% success in preventive care and dental health optimization',
      criticalWindow: 'Ages 1-6 years for dental development and oral hygiene habits'
    },
    {
      id: 'skin-system',
      name: 'Skin Health & Dermatology',
      icon: Shield,
      gradient: 'from-pink-400 to-rose-600',
      specialists: ['Pediatric Dermatologist', 'Allergy Specialist', 'Dermatology Nurse'],
      conditions: ['Eczema', 'Acne', 'Birthmarks', 'Allergic Reactions'],
      technology: 'Advanced Dermatoscopy, AI-Powered Skin Analysis, Laser Therapy',
      teamApproach: 'Integrated team of dermatologist, allergy specialist, and specialized nurses for comprehensive skin health and condition management.',
      outcomes: '89% improvement in skin conditions and quality of life',
      criticalWindow: 'Birth to 12 years for skin barrier development and habit formation'
    }
  ]

  const handleTeamConsultation = () => {
    setShowTeamModal(true)
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
              SKIDS Holistic Care Team
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6"
            >
              Experience comprehensive pediatric care through our integrated team of organ system specialists. 
              Unlike traditional healthcare, SKIDS provides coordinated, holistic care for your child's complete development.
            </motion.p>
            
            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                { icon: Network, text: 'Integrated Team Care', color: 'text-blue-600' },
                { icon: Users, text: 'Organ System Specialists', color: 'text-green-600' },
                { icon: Target, text: 'Coordinated Treatment', color: 'text-purple-600' },
                { icon: TrendingUp, text: 'Holistic Outcomes', color: 'text-orange-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Unique SKIDS Approach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                <Network className="w-8 h-8 text-blue-600" />
                <span>Why SKIDS Holistic Care is Unique</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Traditional healthcare treats each organ system separately. SKIDS recognizes that your child's 
                development is interconnected - vision affects learning, nutrition impacts behavior, sleep influences growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-600 mb-4">❌ Traditional Healthcare</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Separate visits to different specialists</li>
                  <li>• Fragmented care across multiple locations</li>
                  <li>• Limited communication between doctors</li>
                  <li>• Isolated treatment of individual symptoms</li>
                  <li>• Parents coordinate care themselves</li>
                  <li>• Delayed diagnosis due to lack of coordination</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ SKIDS Holistic Care</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• All specialists under one roof</li>
                  <li>• Integrated team approach to care</li>
                  <li>• Real-time collaboration between specialists</li>
                  <li>• Comprehensive treatment of whole child</li>
                  <li>• Coordinated care plans and follow-ups</li>
                  <li>• Early detection through team insights</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Experience Holistic Pediatric Care</h2>
            <p className="text-xl mb-6 opacity-90">
              Book a comprehensive consultation with our integrated team of organ system specialists 
              and discover the SKIDS advantage of coordinated, holistic healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTeamConsultation}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Book Holistic Consultation
              </button>
              <Link
                href="/interventions"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Our Interventions
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
