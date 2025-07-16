'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HealthMetricsCardProps {
  title: string
  value: number
  unit: string
  trend: string
  color: string
  icon: React.ComponentType<any>
  description: string
}

export function HealthMetricsCard({
  title,
  value,
  unit,
  trend,
  color,
  icon: Icon,
  description
}: HealthMetricsCardProps) {
  const isPositiveTrend = trend.startsWith('+')
  const trendValue = trend.replace(/[+\-]/, '')

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          `bg-${color}-100`
        )}>
          <Icon className={cn("w-6 h-6", `text-${color}-600`)} />
        </div>
        
        <div className={cn(
          "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
          isPositiveTrend 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        )}>
          {isPositiveTrend ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trendValue}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-900">
            {value}
          </span>
          <span className="text-sm text-gray-500 font-medium">
            {unit}
          </span>
        </div>
      </div>

      {/* Title and Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={cn("h-2 rounded-full", `bg-${color}-500`)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
