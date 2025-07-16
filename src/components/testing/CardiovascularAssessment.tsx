'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Activity, Stethoscope, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface CardiovascularAssessmentProps {
  childAge: number // in months
  onComplete: (results: any) => void
}

export function CardiovascularAssessment({ childAge, onComplete }: CardiovascularAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    exerciseTolerance: '',
    symptoms: [] as string[],
    familyHistory: [] as string[],
    murmurPresent: false,
    murmurDetails: ''
  })

  // Age-appropriate normal heart rates
  const getNormalHeartRate = (ageInMonths: number) => {
    if (ageInMonths < 1) return { min: 120, max: 160, label: 'Newborn' }
    if (ageInMonths < 12) return { min: 100, max: 150, label: 'Infant' }
    if (ageInMonths < 24) return { min: 90, max: 140, label: 'Toddler' }
    if (ageInMonths < 72) return { min: 80, max: 120, label: 'Preschooler' }
    if (ageInMonths < 144) return { min: 70, max: 110, label: 'School-age' }
    return { min: 60, max: 100, label: 'Adolescent' }
  }

  const normalHeartRate = getNormalHeartRate(childAge)

  const assessmentSteps = [
    {
      title: 'Heart Rate Assessment',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Heart Rate Monitoring
            </h3>
            <p className="text-gray-600">
              For {normalHeartRate.label}: Normal rate is {normalHeartRate.min}-{normalHeartRate.max} beats per minute
            </p>
          </div>

          <div className="bg-cardiovascular-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-cardiovascular-600" />
              <span className="font-medium text-cardiovascular-800">Wonder Fact!</span>
            </div>
            <p className="text-cardiovascular-700">
              {childAge < 12 
                ? "A child's heart beats 120-160 times per minute at birth - it's working hard to support rapid growth!"
                : "As children grow, their heart becomes more efficient and beats slower, just like an athlete's heart!"
              }
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Resting Heart Rate (beats per minute)
            </label>
            <div className="relative">
              <input
                type="number"
                value={assessmentData.heartRate || ''}
                onChange={(e) => setAssessmentData({
                  ...assessmentData,
                  heartRate: parseInt(e.target.value) || 0
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardiovascular-500 focus:border-transparent"
                placeholder="Count pulse for 15 seconds, multiply by 4"
              />
              {assessmentData.heartRate > 0 && (
                <div className="absolute right-3 top-3">
                  {assessmentData.heartRate >= normalHeartRate.min && assessmentData.heartRate <= normalHeartRate.max ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
              )}
            </div>
            {assessmentData.heartRate > 0 && (
              <div className={`p-3 rounded-lg ${
                assessmentData.heartRate >= normalHeartRate.min && assessmentData.heartRate <= normalHeartRate.max
                  ? 'bg-green-50 text-green-800'
                  : 'bg-yellow-50 text-yellow-800'
              }`}>
                {assessmentData.heartRate >= normalHeartRate.min && assessmentData.heartRate <= normalHeartRate.max
                  ? '✅ Within normal range for age'
                  : '⚠️ Outside normal range - may need further evaluation'
                }
              </div>
            )}

            {/* Animated Heart Rate Visualization */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: assessmentData.heartRate > 0 ? 60 / assessmentData.heartRate : 1,
                    repeat: Infinity 
                  }}
                  className="text-4xl"
                >
                  💓
                </motion.div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cardiovascular-600">
                    {assessmentData.heartRate || '--'}
                  </div>
                  <div className="text-sm text-gray-600">BPM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Heart Sounds & Murmur Check',
      icon: Stethoscope,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🩺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Heart Sound Assessment
            </h3>
            <p className="text-gray-600">
              Listening for normal heart sounds and any murmurs
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Heart Murmur Assessment
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="murmur"
                    checked={!assessmentData.murmurPresent}
                    onChange={() => setAssessmentData({
                      ...assessmentData,
                      murmurPresent: false,
                      murmurDetails: ''
                    })}
                    className="w-4 h-4 text-cardiovascular-600 border-gray-300 focus:ring-cardiovascular-500"
                  />
                  <span className="text-gray-700">No murmur detected - normal heart sounds</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="murmur"
                    checked={assessmentData.murmurPresent}
                    onChange={() => setAssessmentData({
                      ...assessmentData,
                      murmurPresent: true
                    })}
                    className="w-4 h-4 text-cardiovascular-600 border-gray-300 focus:ring-cardiovascular-500"
                  />
                  <span className="text-gray-700">Murmur detected</span>
                </label>
              </div>
            </div>

            {assessmentData.murmurPresent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Murmur Characteristics
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Innocent/functional murmur (soft, musical)',
                    'Systolic murmur (during heart contraction)',
                    'Diastolic murmur (during heart relaxation)',
                    'Continuous murmur (throughout heart cycle)',
                    'Loud murmur (grade 3+ intensity)'
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAssessmentData({
                        ...assessmentData,
                        murmurDetails: type
                      })}
                      className={`p-3 text-left border-2 rounded-lg transition-all ${
                        assessmentData.murmurDetails === type
                          ? 'border-cardiovascular-500 bg-cardiovascular-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm text-gray-900">{type}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Note</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Any detected murmur should be evaluated by a pediatric cardiologist to determine if it's innocent or requires further investigation.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Exercise Tolerance & Symptoms',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏃‍♀️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Physical Activity Assessment
            </h3>
            <p className="text-gray-600">
              How well does your child handle physical activities?
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Exercise Tolerance
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'excellent', label: 'Excellent - Very active, no limitations', color: 'green' },
                  { value: 'good', label: 'Good - Keeps up with peers most of the time', color: 'blue' },
                  { value: 'fair', label: 'Fair - Some difficulty with strenuous activity', color: 'yellow' },
                  { value: 'poor', label: 'Poor - Significant limitations with activity', color: 'red' }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cardiovascular Symptoms (check all that apply)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Chest pain or discomfort',
                  'Shortness of breath with activity',
                  'Fainting or dizziness',
                  'Rapid or irregular heartbeat',
                  'Fatigue with minimal activity',
                  'Swelling in legs or feet',
                  'Blue coloring around lips or fingernails'
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
                      className="w-4 h-4 text-cardiovascular-600 border-gray-300 rounded focus:ring-cardiovascular-500"
                    />
                    <span className="text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Family History (check all that apply)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Heart disease before age 50',
                  'High blood pressure',
                  'High cholesterol',
                  'Sudden cardiac death',
                  'Congenital heart defects',
                  'Stroke'
                ].map((condition) => (
                  <label key={condition} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={assessmentData.familyHistory.includes(condition)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssessmentData({
                            ...assessmentData,
                            familyHistory: [...assessmentData.familyHistory, condition]
                          })
                        } else {
                          setAssessmentData({
                            ...assessmentData,
                            familyHistory: assessmentData.familyHistory.filter(h => h !== condition)
                          })
                        }
                      }}
                      className="w-4 h-4 text-cardiovascular-600 border-gray-300 rounded focus:ring-cardiovascular-500"
                    />
                    <span className="text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
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
        normalHeartRate,
        riskLevel: calculateRiskLevel(),
        recommendations: generateRecommendations()
      }
      onComplete(results)
    }
  }

  const calculateRiskLevel = () => {
    let riskScore = 0
    
    // Heart rate assessment
    if (assessmentData.heartRate < normalHeartRate.min || assessmentData.heartRate > normalHeartRate.max) {
      riskScore += 2
    }
    
    // Murmur assessment
    if (assessmentData.murmurPresent) {
      if (assessmentData.murmurDetails.includes('Diastolic') || 
          assessmentData.murmurDetails.includes('Continuous') || 
          assessmentData.murmurDetails.includes('Loud')) {
        riskScore += 3
      } else {
        riskScore += 1
      }
    }
    
    // Exercise tolerance
    if (assessmentData.exerciseTolerance === 'poor') riskScore += 3
    else if (assessmentData.exerciseTolerance === 'fair') riskScore += 2
    
    // Symptoms
    riskScore += assessmentData.symptoms.length
    
    // Family history
    riskScore += assessmentData.familyHistory.length
    
    if (riskScore >= 6) return 'high'
    if (riskScore >= 3) return 'moderate'
    return 'low'
  }

  const generateRecommendations = () => {
    const recommendations = []
    
    if (assessmentData.heartRate < normalHeartRate.min || assessmentData.heartRate > normalHeartRate.max) {
      recommendations.push('Follow up with pediatrician for heart rate evaluation')
    }
    
    if (assessmentData.murmurPresent) {
      if (assessmentData.murmurDetails.includes('Diastolic') || 
          assessmentData.murmurDetails.includes('Continuous') || 
          assessmentData.murmurDetails.includes('Loud')) {
        recommendations.push('Urgent referral to pediatric cardiologist for murmur evaluation')
      } else {
        recommendations.push('Routine follow-up for murmur assessment')
      }
    }
    
    if (assessmentData.symptoms.length > 0) {
      recommendations.push('Discuss cardiovascular symptoms with healthcare provider')
    }
    
    if (assessmentData.exerciseTolerance === 'poor' || assessmentData.exerciseTolerance === 'fair') {
      recommendations.push('Consider cardiac evaluation and exercise stress testing')
    }
    
    if (assessmentData.familyHistory.length > 0) {
      recommendations.push('Discuss family history with pediatrician for risk assessment')
    }
    
    if (childAge >= 36) { // 3 years old
      recommendations.push('Annual blood pressure monitoring recommended')
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
            className="bg-gradient-to-r from-cardiovascular-500 to-cardiovascular-600 h-2 rounded-full"
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
            <div className="w-12 h-12 bg-gradient-to-br from-cardiovascular-400 to-cardiovascular-600 rounded-xl flex items-center justify-center">
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
              className="px-6 py-3 bg-gradient-to-r from-cardiovascular-500 to-cardiovascular-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              {currentStep === assessmentSteps.length - 1 ? 'Complete Assessment' : 'Next Step'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
