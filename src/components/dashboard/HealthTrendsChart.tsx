'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Filter } from 'lucide-react'

interface HealthTrendsChartProps {
  timeRange: string
}

export function HealthTrendsChart({ timeRange }: HealthTrendsChartProps) {
  // Mock data for the chart
  const healthData = [
    { date: '2024-01-01', overall: 85, cardiovascular: 88, cognitive: 92, physical: 78 },
    { date: '2024-01-08', overall: 87, cardiovascular: 89, cognitive: 94, physical: 80 },
    { date: '2024-01-15', overall: 90, cardiovascular: 91, cognitive: 95, physical: 82 },
    { date: '2024-01-22', overall: 92, cardiovascular: 88, cognitive: 96, physical: 85 },
    { date: '2024-01-29', overall: 94, cardiovascular: 90, cognitive: 97, physical: 88 },
  ]

  const metrics = [
    { name: 'Overall Health', color: 'brain', value: 94 },
    { name: 'Cardiovascular', color: 'cardiovascular', value: 90 },
    { name: 'Cognitive', color: 'sensory', value: 97 },
    { name: 'Physical Activity', color: 'digestive', value: 88 },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Health Trends</h3>
          <p className="text-sm text-gray-600">Track progress over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>{timeRange}</span>
          </button>
        </div>
      </div>

      {/* Chart Area - Simplified visualization */}
      <div className="mb-6">
        <div className="h-64 bg-gradient-to-t from-gray-50 to-white rounded-xl border border-gray-200 p-4 relative overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-4">
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-200"
                style={{ bottom: `${value}%` }}
              >
                <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Trend lines visualization */}
          <div className="relative h-full">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Simplified trend line */}
                <svg className="w-full h-full">
                  <motion.path
                    d={`M 0,${240 - (metric.value * 2)} Q 100,${240 - (metric.value * 2.2)} 200,${240 - (metric.value * 2.1)} T 400,${240 - (metric.value * 2)}`}
                    stroke={`var(--${metric.color}-500)`}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: index * 0.3 }}
                  />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Data points */}
          {healthData.map((point, index) => (
            <motion.div
              key={point.date}
              className="absolute w-3 h-3 bg-brain-500 rounded-full"
              style={{
                left: `${(index / (healthData.length - 1)) * 90 + 5}%`,
                bottom: `${point.overall}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 1 }}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className={`w-4 h-4 rounded-full bg-${metric.color}-500`} />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {metric.value}%
              </div>
              <div className="text-xs text-gray-600">
                {metric.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Positive Health Trend
            </h4>
            <p className="text-sm text-gray-600">
              Overall health score has improved by 9% over the past month. 
              Cognitive development shows exceptional progress with consistent growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
