'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Clock, CheckCircle, Star, Users } from 'lucide-react'

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

interface TestingModalProps {
  isOpen: boolean
  onClose: () => void
  organ: Organ | null
}

export function TestingModal({ isOpen, onClose, organ }: TestingModalProps) {
  if (!organ) return null

  const Icon = organ.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className={`bg-gradient-to-r from-${organ.color}-500 to-${organ.color}-600 p-6 rounded-t-2xl relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{organ.name}</h2>
                    <p className="text-white/90">{organ.description}</p>
                  </div>
                  <div className="text-4xl ml-auto">
                    {organ.character}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Testing Packages */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Testing Packages</h3>
                  
                  <div className="grid gap-4">
                    {/* Basic Package */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className={`w-5 h-5 text-${organ.color}-500`} />
                          <h4 className="font-medium text-gray-900">Basic Assessment</h4>
                        </div>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          15 min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Essential {organ.name.toLowerCase()} health screening with core measurements
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Ages 2-18</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>4.8/5</span>
                          </span>
                        </div>
                        <button className={`
                          bg-${organ.color}-500 text-white px-4 py-2 rounded-lg text-sm font-medium 
                          hover:bg-${organ.color}-600 transition-colors flex items-center space-x-1
                        `}>
                          <Play className="w-4 h-4" />
                          <span>Start Test</span>
                        </button>
                      </div>
                    </div>

                    {/* Comprehensive Package */}
                    <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/50 relative">
                      <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className={`w-5 h-5 text-${organ.color}-500`} />
                          <h4 className="font-medium text-gray-900">Comprehensive Analysis</h4>
                        </div>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          45 min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Complete {organ.name.toLowerCase()} evaluation with detailed insights and recommendations
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Ages 2-18</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>4.9/5</span>
                          </span>
                        </div>
                        <button className={`
                          bg-${organ.color}-500 text-white px-4 py-2 rounded-lg text-sm font-medium 
                          hover:bg-${organ.color}-600 transition-colors flex items-center space-x-1
                        `}>
                          <Play className="w-4 h-4" />
                          <span>Start Test</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Tests */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Tests</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {organ.tests.map((test) => (
                      <div key={test} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium text-gray-700">{test}</span>
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Schedule</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
