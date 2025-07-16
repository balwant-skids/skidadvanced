'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Play } from 'lucide-react'

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

interface OrganCardProps {
  organ: Organ
}

export function OrganCard({ organ }: OrganCardProps) {
  const Icon = organ.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-80 relative"
    >
      {/* Arrow pointing to organ */}
      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45`} />
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${organ.color}-400 to-${organ.color}-600 flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{organ.name}</h3>
          <p className="text-sm text-gray-600">{organ.description}</p>
        </div>
      </div>

      {/* Available Tests */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Tests:</h4>
        <div className="space-y-2">
          {organ.tests.slice(0, 3).map((test, index) => (
            <div key={test} className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 text-${organ.color}-500`} />
              <span className="text-sm text-gray-600">{test}</span>
            </div>
          ))}
          {organ.tests.length > 3 && (
            <div className="text-sm text-gray-500">
              +{organ.tests.length - 3} more tests
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button className={`
          flex-1 bg-gradient-to-r from-${organ.color}-500 to-${organ.color}-600 
          text-white px-4 py-2 rounded-lg text-sm font-medium 
          hover:shadow-lg transition-all duration-200
          flex items-center justify-center space-x-1
        `}>
          <Play className="w-4 h-4" />
          <span>Start Test</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Schedule</span>
        </button>
      </div>

      {/* Character mascot */}
      <div className="absolute -top-6 -right-2 text-3xl">
        {organ.character}
      </div>
    </motion.div>
  )
}
