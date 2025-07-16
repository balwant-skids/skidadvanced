'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Minus,
  Save,
  X,
  Check,
  AlertTriangle,
  Sparkles,
  Calculator,
  Eye,
  Users,
  Clock,
  DollarSign,
  Target,
  Zap
} from 'lucide-react'
import { Service, CarePlan, PlanCreationRequest, AIRecommendation } from '@/types/care-plans'
import { carePlansAPI } from '@/lib/api/care-plans'

interface CarePlanBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (plan: CarePlan) => void
  editingPlan?: CarePlan | null
}

export function CarePlanBuilder({ isOpen, onClose, onSave, editingPlan }: CarePlanBuilderProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    category: 'custom',
    targetAgeGroup: { min: 6, max: 216, label: '6 months - 18 years', adaptations: [] as string[] },
    pricing: {
      basePrice: 0,
      finalPrice: 0,
      billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'annually',
      discountPercentage: 0
    },
    features: [] as string[],
    theme: 'holistic'
  })
  const [aiSuggestions, setAISuggestions] = useState<AIRecommendation[]>([])
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (isOpen) {
      loadServices()
      if (editingPlan) {
        populateEditingData()
      } else {
        resetForm()
      }
    }
  }, [isOpen, editingPlan])

  useEffect(() => {
    calculatePricing()
  }, [selectedServices])

  const loadServices = async () => {
    try {
      const servicesData = await carePlansAPI.getServices()
      setServices(servicesData)
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const populateEditingData = () => {
    if (!editingPlan) return
    
    setPlanData({
      name: editingPlan.name,
      description: editingPlan.description,
      category: editingPlan.category,
      targetAgeGroup: editingPlan.targetAgeGroup,
      pricing: editingPlan.pricing,
      features: editingPlan.features,
      theme: editingPlan.theme.id
    })
    
    setSelectedServices(editingPlan.services.map(s => ({
      serviceId: s.serviceId,
      frequency: s.frequency,
      sessions: s.sessions,
      priority: s.priority,
      customizations: s.customizations
    })))
  }

  const resetForm = () => {
    setPlanData({
      name: '',
      description: '',
      category: 'custom',
      targetAgeGroup: { min: 6, max: 216, label: '6 months - 18 years', adaptations: [] as string[] },
      pricing: {
        basePrice: 0,
        finalPrice: 0,
        billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'annually',
        discountPercentage: 0
      },
      features: [],
      theme: 'holistic'
    })
    setSelectedServices([])
    setStep(1)
  }

  const calculatePricing = () => {
    const basePrice = selectedServices.reduce((total, selectedService) => {
      const service = services.find(s => s.id === selectedService.serviceId)
      if (!service) return total
      
      const sessionCost = service.basePrice
      const totalSessions = selectedService.sessions || 1
      return total + (sessionCost * totalSessions)
    }, 0)

    const discountAmount = (basePrice * planData.pricing.discountPercentage) / 100
    const finalPrice = basePrice - discountAmount

    setPlanData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        basePrice,
        finalPrice
      }
    }))
  }

  const addService = (serviceId: string) => {
    if (selectedServices.find(s => s.serviceId === serviceId)) return

    const service = services.find(s => s.id === serviceId)
    if (!service) return

    setSelectedServices(prev => [...prev, {
      serviceId,
      frequency: service.frequency,
      sessions: 4,
      priority: 'secondary',
      customizations: []
    }])
  }

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.serviceId !== serviceId))
  }

  const updateServiceConfig = (serviceId: string, field: string, value: any) => {
    setSelectedServices(prev => prev.map(s => 
      s.serviceId === serviceId ? { ...s, [field]: value } : s
    ))
  }

  const getAISuggestions = async () => {
    setLoading(true)
    try {
      const suggestions = await carePlansAPI.getAIRecommendations('plan_creation', {
        selectedServices,
        planData,
        targetDemographics: planData.targetAgeGroup
      })
      setAISuggestions(suggestions)
      setShowAISuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (suggestion: AIRecommendation) => {
    const changes = suggestion.suggestedChanges
    if (changes.planName) {
      setPlanData(prev => ({ ...prev, name: changes.planName }))
    }
    if (changes.services) {
      // Apply suggested services
      const newServices = changes.services.map((serviceId: string) => ({
        serviceId,
        frequency: 'monthly',
        sessions: 4,
        priority: 'secondary',
        customizations: []
      }))
      setSelectedServices(newServices)
    }
    if (changes.pricing) {
      setPlanData(prev => ({
        ...prev,
        pricing: { ...prev.pricing, finalPrice: changes.pricing }
      }))
    }
    setShowAISuggestions(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const planRequest: PlanCreationRequest = {
        name: planData.name,
        description: planData.description,
        category: planData.category,
        services: selectedServices,
        pricing: planData.pricing,
        targetAgeGroup: planData.targetAgeGroup,
        theme: planData.theme,
        features: planData.features
      }

      const newPlan = await carePlansAPI.createCarePlan(planRequest)
      onSave(newPlan)
      onClose()
    } catch (error) {
      console.error('Error saving plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceById = (serviceId: string) => {
    return services.find(s => s.id === serviceId)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPlan ? 'Edit Care Plan' : 'Create New Care Plan'}
              </h2>
              <p className="text-gray-600">Build a customized care plan with AI assistance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={getAISuggestions}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assist</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Plan Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        value={planData.name}
                        onChange={(e) => setPlanData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Academic Excellence Bundle"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={planData.category}
                        onChange={(e) => setPlanData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="essential">Essential</option>
                        <option value="comprehensive">Comprehensive</option>
                        <option value="premium">Premium</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={planData.description}
                      onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the plan's focus and benefits..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={planData.theme}
                        onChange={(e) => setPlanData(prev => ({ ...prev, theme: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="academic">Academic Performance</option>
                        <option value="growth">Growth Optimization</option>
                        <option value="behavioral">Behavioral Support</option>
                        <option value="preventive">Preventive Care</option>
                        <option value="therapeutic">Therapeutic</option>
                        <option value="holistic">Holistic Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Cycle
                      </label>
                      <select
                        value={planData.pricing.billingCycle}
                        onChange={(e) => setPlanData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, billingCycle: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Next: Select Services
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Select Services</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      ← Back to Details
                    </button>
                  </div>

                  {/* Available Services */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Available Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => {
                        const isSelected = selectedServices.find(s => s.serviceId === service.id)
                        return (
                          <div
                            key={service.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => isSelected ? removeService(service.id) : addService(service.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{service.name}</h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">₹{service.basePrice}</span>
                                {isSelected ? (
                                  <Check className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <Plus className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.shortDescription}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{service.duration}min</span>
                              </span>
                              <span className="capitalize">{service.frequency}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Selected Services Configuration */}
                  {selectedServices.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Configure Selected Services</h4>
                      <div className="space-y-4">
                        {selectedServices.map((selectedService) => {
                          const service = getServiceById(selectedService.serviceId)
                          if (!service) return null

                          return (
                            <div key={selectedService.serviceId} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-medium text-gray-900">{service.name}</h5>
                                <button
                                  onClick={() => removeService(selectedService.serviceId)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency
                                  </label>
                                  <select
                                    value={selectedService.frequency}
                                    onChange={(e) => updateServiceConfig(selectedService.serviceId, 'frequency', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  >
                                    <option value="weekly">Weekly</option>
                                    <option value="bi-weekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sessions per Cycle
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={selectedService.sessions}
                                    onChange={(e) => updateServiceConfig(selectedService.serviceId, 'sessions', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                  </label>
                                  <select
                                    value={selectedService.priority}
                                    onChange={(e) => updateServiceConfig(selectedService.serviceId, 'priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  >
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                    <option value="optional">Optional</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={selectedServices.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Next: Pricing & Features
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Pricing & Features</h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      ← Back to Services
                    </button>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Pricing Summary
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price (all services)</span>
                        <span className="font-medium">₹{planData.pricing.basePrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={planData.pricing.discountPercentage}
                            onChange={(e) => setPlanData(prev => ({
                              ...prev,
                              pricing: { ...prev.pricing, discountPercentage: parseInt(e.target.value) || 0 }
                            }))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Final Price</span>
                          <span className="font-bold text-xl text-blue-600">
                            ₹{planData.pricing.finalPrice.toLocaleString()}/{planData.pricing.billingCycle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Features (one per line)
                    </label>
                    <textarea
                      value={planData.features.join('\n')}
                      onChange={(e) => setPlanData(prev => ({
                        ...prev,
                        features: e.target.value.split('\n').filter(f => f.trim())
                      }))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter plan features, one per line..."
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading || !planData.name || selectedServices.length === 0}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Plan'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestions Sidebar */}
            {showAISuggestions && (
              <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    AI Suggestions
                  </h4>
                  <button
                    onClick={() => setShowAISuggestions(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900 text-sm">
                          {suggestion.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h5>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{suggestion.reasoning}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="text-xs text-gray-500">Expected Impact:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Enrollment:</span>
                            <span className="text-green-600">+{suggestion.expectedImpact.enrollment}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span className="text-green-600">+{suggestion.expectedImpact.revenue}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        Apply Suggestion
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
