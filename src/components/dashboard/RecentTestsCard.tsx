'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Eye, Heart, Brain, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const recentTests = [
  {
    id: 1,
    name: 'Vision Assessment',
    date: '2024-01-15',
    status: 'completed',
    score: 95,
    icon: Eye,
    color: 'sensory',
    notes: 'Excellent visual acuity, no concerns detected'
  },
  {
    id: 2,
    name: 'Cardiovascular Check',
    date: '2024-01-12',
    status: 'completed',
    score: 88,
    icon: Heart,
    color: 'cardiovascular',
    notes: 'Heart rate and blood pressure within normal range'
  },
  {
    id: 3,
    name: 'Cognitive Assessment',
    date: '2024-01-10',
    status: 'completed',
    score: 92,
    icon: Brain,
    color: 'brain',
    notes: 'Strong performance in memory and attention tasks'
  },
  {
    id: 4,
    name: 'Motor Skills Evaluation',
    date: '2024-01-08',
    status: 'pending',
    score: null,
    icon: Activity,
    color: 'digestive',
    notes: 'Scheduled for completion this week'
  }
]

export function RecentTestsCard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'attention':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Tests</h3>
        <button className="text-brain-600 hover:text-brain-700 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {recentTests.map((test, index) => {
          const Icon = test.icon
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                `bg-${test.color}-100`
              )}>
                <Icon className={cn("w-6 h-6", `text-${test.color}-600`)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {test.name}
                  </h4>
                  {getStatusIcon(test.status)}
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(test.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                
                <p className="text-xs text-gray-500 truncate">
                  {test.notes}
                </p>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                {test.score ? (
                  <>
                    <div className={cn("text-2xl font-bold", getScoreColor(test.score))}>
                      {test.score}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">
                    Pending
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brain-600">92</div>
            <div className="text-xs text-gray-500">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
