'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Wind, Heart, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface RespiratoryAssessmentProps {
  childAge: number // in months
  onComplete: (results: any) => void
}

export function RespiratoryAssessment({ childAge, onComplete }: RespiratoryAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState({
    breathingRate: 0,
    exerciseTolerance: '',
    environmentalFactors: [] as string[],
    symptoms: [] as string[],
    familyHistory: false
  })

  // Age-appropriate normal breathing rates
  const getNormalBreathingRate = (ageInMonths: number) => {
    if (ageInMonths < 12) return { min: 30, max: 60, label: 'Newborn-Infant' }
    if (ageInMonths < 24) return { min: 24, max: 40, label: 'Toddler' }
    if (ageInMonths < 72) return { min: 20, max: 30, label: 'Preschooler' }
    if (ageInMonths < 144) return { min: 16, max: 25, label: 'School-age' }
    return { min: 12, max: 20, label: 'Adolescent' }
  }

  const normalRange = getNormalBreathingRate(childAge)

  const assessmentSteps = [
    {
      title: 'Breathing Pattern Assessment',
      icon: Wind,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🫁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Let's Check Breathing Patterns
            </h3>
            <p className="text-gray-600">
              For {normalRange.label}: Normal rate is {normalRange.min}-{normalRange.max} breaths per minute
            </p>
          </div>

          <div className="bg-respiratory-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-respiratory-600" />
              <span className="font-medium text-respiratory-800">Wonder Fact!</span>
            </div>
            <p className="text-respiratory-700">
              {childAge < 12 
                ? "Newborns breathe 30-60 times per minute - 3 times faster than adults because their lungs are still developing!"
                : "Children's breathing rate slows down as their lungs grow stronger and more efficient!"
              }
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Current Breathing Rate (breaths per minute)
            </label>
            <div className="relative">
              <input
                type="number"
                value={assessmentData.breathingRate || ''}
                onChange={(e) => setAssessmentData({
                  ...assessmentData,
                  breathingRate: parseInt(e.target.value) || 0
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-respiratory-500 focus:border-transparent"
                placeholder="Count for 15 seconds, multiply by 4"
              />
              {assessmentData.breathingRate > 0 && (
                <div className="absolute right-3 top-3">
                  {assessmentData.breathingRate >= normalRange.min && assessmentData.breathingRate <= normalRange.max ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
              )}
            </div>
            {assessmentData.breathingRate > 0 && (
              <div className={`p-3 rounded-lg ${
                assessmentData.breathingRate >= normalRange.min && assessmentData.breathingRate <= normalRange.max
                  ? 'bg-green-50 text-green-800'
                  : 'bg-yellow-50 text-yellow-800'
              }`}>
                {assessmentData.breathingRate >= normalRange.min && assessmentData.breathingRate <= normalRange.max
                  ? '✅ Within normal range for age'
                  : '⚠️ Outside normal range - may need further evaluation'
                }
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Exercise Tolerance',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Physical Activity Assessment
            </h3>
            <p className="text-gray-600">
              How well can your child handle age-appropriate physical activities?
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Exercise Tolerance Level
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'excellent', label: 'Excellent - Keeps up with peers easily', color: 'green' },
                { value: 'good', label: 'Good - Occasional shortness of breath', color: 'blue' },
                { value: 'fair', label: 'Fair - Gets tired more quickly than peers', color: 'yellow' },
                { value: 'poor', label: 'Poor - Significant difficulty with activity', color: 'red' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAssessmentData({
                    ...assessmentData,
                    exerciseTolerance: option.value
                  })}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    assessmentData.exerciseTolerance === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Environmental & Risk Factors',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🌬️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Environmental Assessment
            </h3>
            <p className="text-gray-600">
              Let's check for factors that might affect respiratory health
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Environmental Exposures (check all that apply)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Secondhand smoke exposure',
                  'Air pollution/poor air quality',
                  'Pet dander allergies',
                  'Dust mites',
                  'Mold exposure',
                  'Chemical irritants'
                ].map((factor) => (
                  <label key={factor} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={assessmentData.environmentalFactors.includes(factor)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssessmentData({
                            ...assessmentData,
                            environmentalFactors: [...assessmentData.environmentalFactors, factor]
                          })
                        } else {
                          setAssessmentData({
                            ...assessmentData,
                            environmentalFactors: assessmentData.environmentalFactors.filter(f => f !== factor)
                          })
                        }
                      }}
                      className="w-4 h-4 text-respiratory-600 border-gray-300 rounded focus:ring-respiratory-500"
                    />
                    <span className="text-gray-700">{factor}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Respiratory Symptoms (check all that apply)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Persistent cough',
                  'Wheezing',
                  'Shortness of breath',
                  'Chest tightness',
                  'Frequent respiratory infections',
                  'Night-time breathing problems'
                ].map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={assessmentData.symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssessmentData({
                            ...assessmentData,
                            symptoms: [...assessmentData.symptoms, symptom]
                          })
                        } else {
                          setAssessmentData({
                            ...assessmentData,
                            symptoms: assessmentData.symptoms.filter(s => s !== symptom)
                          })
                        }
                      }}
                      className="w-4 h-4 text-respiratory-600 border-gray-300 rounded focus:ring-respiratory-500"
                    />
                    <span className="text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={assessmentData.familyHistory}
                  onChange={(e) => setAssessmentData({
                    ...assessmentData,
                    familyHistory: e.target.checked
                  })}
                  className="w-4 h-4 text-respiratory-600 border-gray-300 rounded focus:ring-respiratory-500"
                />
                <span className="text-gray-700 font-medium">Family history of asthma or respiratory conditions</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete assessment
      const results = {
        ...assessmentData,
        normalRange,
        riskLevel: calculateRiskLevel(),
        recommendations: generateRecommendations()
      }
      onComplete(results)
    }
  }

  const calculateRiskLevel = () => {
    let riskScore = 0
    
    // Breathing rate assessment
    if (assessmentData.breathingRate < normalRange.min || assessmentData.breathingRate > normalRange.max) {
      riskScore += 2
    }
    
    // Exercise tolerance
    if (assessmentData.exerciseTolerance === 'poor') riskScore += 3
    else if (assessmentData.exerciseTolerance === 'fair') riskScore += 2
    
    // Environmental factors
    riskScore += assessmentData.environmentalFactors.length
    
    // Symptoms
    riskScore += assessmentData.symptoms.length
    
    // Family history
    if (assessmentData.familyHistory) riskScore += 1
    
    if (riskScore >= 6) return 'high'
    if (riskScore >= 3) return 'moderate'
    return 'low'
  }

  const generateRecommendations = () => {
    const recommendations = []
    
    if (assessmentData.breathingRate < normalRange.min || assessmentData.breathingRate > normalRange.max) {
      recommendations.push('Follow up with pediatrician for breathing rate evaluation')
    }
    
    if (assessmentData.exerciseTolerance === 'poor' || assessmentData.exerciseTolerance === 'fair') {
      recommendations.push('Consider pulmonary function testing')
    }
    
    if (assessmentData.symptoms.length > 0) {
      recommendations.push('Discuss symptoms with healthcare provider')
    }
    
    if (assessmentData.environmentalFactors.includes('Secondhand smoke exposure')) {
      recommendations.push('Eliminate smoke exposure - critical for lung health')
    }
    
    if (assessmentData.familyHistory || assessmentData.symptoms.length > 2) {
      recommendations.push('Consider asthma screening and peak flow monitoring')
    }
    
    return recommendations
  }

  const currentStepData = assessmentSteps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {assessmentSteps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / assessmentSteps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-respiratory-500 to-respiratory-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / assessmentSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-respiratory-400 to-respiratory-600 rounded-xl flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
          </div>

          {currentStepData.content}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-respiratory-500 to-respiratory-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              {currentStep === assessmentSteps.length - 1 ? 'Complete Assessment' : 'Next Step'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
