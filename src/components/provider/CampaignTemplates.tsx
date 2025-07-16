'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen,
  Heart,
  Gift,
  AlertCircle,
  Brain,
  Shield,
  Zap,
  Star,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Video,
  Download,
  Send,
  Edit3,
  Copy,
  Eye
} from 'lucide-react'

interface CampaignTemplate {
  id: string
  title: string
  type: 'newsletter' | 'health-alert' | 'promotion' | 'education'
  description: string
  icon: any
  targetAudience: string[]
  estimatedReach: number
  avgOpenRate: number
  content: {
    subject: string
    preview: string
    sections: {
      title: string
      content: string
      educationalLinks?: string[]
    }[]
  }
  tags: string[]
}

export function CampaignTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const templates: CampaignTemplate[] = [
    {
      id: 'digital-wellness',
      title: 'Digital Wellness Weekly',
      type: 'newsletter',
      description: 'Weekly newsletter focusing on healthy screen time and digital habits for children',
      icon: Brain,
      targetAudience: ['Essential Care', 'Comprehensive Care', 'Premium Care'],
      estimatedReach: 892,
      avgOpenRate: 78,
      content: {
        subject: 'This Week in Digital Wellness: Building Healthy Screen Time Habits',
        preview: 'Discover age-appropriate screen time guidelines and fun offline activities...',
        sections: [
          {
            title: 'This Week\'s Focus: Balanced Digital Diet',
            content: 'Just like we teach children about balanced nutrition, digital wellness requires a balanced approach to technology. This week, we explore how to create healthy boundaries that support your child\'s development.',
            educationalLinks: [
              'Kurzgesagt: How Technology Affects Your Brain',
              'TED-Ed: The Science of Screen Time'
            ]
          },
          {
            title: 'Age-Appropriate Guidelines',
            content: 'Updated recommendations from pediatric experts on screen time limits by age group, plus practical tips for implementation.',
          },
          {
            title: 'Fun Offline Activities',
            content: 'Creative alternatives to screen time that promote learning and development.',
            educationalLinks: [
              'National Geographic Kids: Nature Activities',
              'BrainPOP: Science Experiments at Home'
            ]
          }
        ]
      },
      tags: ['Digital Wellness', 'Screen Time', 'Child Development', 'Weekly']
    },
    {
      id: 'quarterly-screening',
      title: 'Quarterly Health Screening Reminder',
      type: 'health-alert',
      description: 'Gentle reminder for families about upcoming quarterly health screenings',
      icon: Heart,
      targetAudience: ['Essential Care', 'Comprehensive Care', 'Premium Care'],
      estimatedReach: 650,
      avgOpenRate: 85,
      content: {
        subject: 'Your Child\'s Quarterly Health Check-Up is Coming Up!',
        preview: 'Time for your child\'s comprehensive health screening - here\'s what to expect...',
        sections: [
          {
            title: 'What to Expect at Your Visit',
            content: 'Our comprehensive quarterly screening includes head-to-toe assessment, behavioral evaluation, and growth tracking. Here\'s how to prepare your child for a positive experience.',
          },
          {
            title: 'Preparing Your Child',
            content: 'Tips to make the health screening experience comfortable and educational for your child.',
            educationalLinks: [
              'TED-Ed: How Your Body Works',
              'Kurzgesagt: The Immune System Explained'
            ]
          },
          {
            title: 'Questions to Ask',
            content: 'Suggested questions to discuss with your healthcare provider during the visit.',
          }
        ]
      },
      tags: ['Health Screening', 'Quarterly', 'Preparation', 'Child Health']
    },
    {
      id: 'educational-upgrade',
      title: 'Unlock Premium Learning Content',
      type: 'promotion',
      description: 'Promotional campaign highlighting premium educational content benefits',
      icon: Gift,
      targetAudience: ['Essential Care', 'Comprehensive Care'],
      estimatedReach: 736,
      avgOpenRate: 72,
      content: {
        subject: 'Unlock a World of Premium Learning for Your Child',
        preview: 'Discover how premium educational content can accelerate your child\'s development...',
        sections: [
          {
            title: 'Premium Educational Benefits',
            content: 'See how families are using premium educational content to enhance their children\'s learning journey.',
            educationalLinks: [
              'BrainPOP: Interactive Science Lessons',
              'Khan Academy: Personalized Learning Paths'
            ]
          },
          {
            title: 'Success Stories',
            content: 'Real stories from families who have seen remarkable improvements in their children\'s curiosity and learning outcomes.',
          },
          {
            title: 'Limited Time Offer',
            content: 'Special pricing for upgrading to Comprehensive or Premium Care plans.',
          }
        ]
      },
      tags: ['Promotion', 'Educational Content', 'Upgrade', 'Premium']
    },
    {
      id: 'seasonal-health',
      title: 'Seasonal Health & Wellness',
      type: 'education',
      description: 'Educational content about seasonal health considerations and preventive care',
      icon: Shield,
      targetAudience: ['Essential Care', 'Comprehensive Care', 'Premium Care'],
      estimatedReach: 892,
      avgOpenRate: 80,
      content: {
        subject: 'Winter Wellness: Keeping Your Child Healthy This Season',
        preview: 'Essential tips for maintaining your child\'s health during winter months...',
        sections: [
          {
            title: 'Seasonal Health Priorities',
            content: 'Key health considerations for the current season, including immune system support and common concerns.',
            educationalLinks: [
              'Kurzgesagt: How Your Immune System Works',
              'National Geographic Kids: Seasonal Changes'
            ]
          },
          {
            title: 'Nutrition & Immunity',
            content: 'Foods and nutrients that support your child\'s immune system during seasonal transitions.',
          },
          {
            title: 'Activity Recommendations',
            content: 'Age-appropriate activities that promote health and development during the season.',
            educationalLinks: [
              'TED-Ed: The Science of Exercise',
              'BrainPOP: Nutrition and Health'
            ]
          }
        ]
      },
      tags: ['Seasonal Health', 'Education', 'Prevention', 'Wellness']
    },
    {
      id: 'behavioral-insights',
      title: 'Behavioral Development Insights',
      type: 'newsletter',
      description: 'Monthly deep-dive into child behavioral development and assessment insights',
      icon: Brain,
      targetAudience: ['Comprehensive Care', 'Premium Care'],
      estimatedReach: 568,
      avgOpenRate: 82,
      content: {
        subject: 'Understanding Your Child\'s Behavioral Development This Month',
        preview: 'Insights from recent behavioral assessments and development milestones...',
        sections: [
          {
            title: 'This Month\'s Behavioral Insights',
            content: 'Key findings from recent SKIDS Clinic Chatter assessments and what they mean for your child\'s development.',
          },
          {
            title: 'Age-Appropriate Expectations',
            content: 'Understanding normal behavioral variations and when to seek additional support.',
            educationalLinks: [
              'TED-Ed: How the Brain Develops',
              'Kurzgesagt: The Science of Emotions'
            ]
          },
          {
            title: 'Supporting Healthy Development',
            content: 'Practical strategies for supporting your child\'s emotional and behavioral growth.',
          }
        ]
      },
      tags: ['Behavioral Health', 'Development', 'Assessment', 'Monthly']
    },
    {
      id: 'learning-milestones',
      title: 'Learning Milestones & Achievements',
      type: 'education',
      description: 'Celebrating learning achievements and setting new educational goals',
      icon: Award,
      targetAudience: ['Premium Care'],
      estimatedReach: 156,
      avgOpenRate: 88,
      content: {
        subject: 'Celebrating Your Child\'s Learning Journey & Setting New Goals',
        preview: 'Recognizing achievements and planning the next steps in your child\'s education...',
        sections: [
          {
            title: 'Recent Learning Achievements',
            content: 'Highlighting your child\'s progress in educational content engagement and skill development.',
            educationalLinks: [
              'Khan Academy: Progress Tracking',
              'BrainPOP: Learning Assessments'
            ]
          },
          {
            title: 'Personalized Learning Recommendations',
            content: 'Customized educational content suggestions based on your child\'s interests and learning style.',
          },
          {
            title: 'Setting New Learning Goals',
            content: 'Collaborative goal-setting for continued educational growth and development.',
            educationalLinks: [
              'TED-Ed: The Science of Learning',
              'Kurzgesagt: How Memory Works'
            ]
          }
        ]
      },
      tags: ['Learning', 'Milestones', 'Personalized', 'Premium']
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-700'
      case 'health-alert': return 'bg-green-100 text-green-700'
      case 'promotion': return 'bg-purple-100 text-purple-700'
      case 'education': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter': return BookOpen
      case 'health-alert': return Heart
      case 'promotion': return Gift
      case 'education': return Brain
      default: return BookOpen
    }
  }

  return (
    <div className="space-y-6">
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon
          const TypeIcon = getTypeIcon(template.type)
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                  {template.type}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Est. Reach:</span>
                  <span className="font-medium text-gray-900">{template.estimatedReach} families</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg. Open Rate:</span>
                  <span className="font-medium text-green-600">{template.avgOpenRate}%</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 2 && (
                  <span className="text-gray-500 text-xs">+{template.tags.length - 2}</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTemplate(template)
                    setShowPreview(true)
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle use template
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>Use</span>
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
