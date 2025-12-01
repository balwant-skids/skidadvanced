/**
 * Data Validation Utilities
 * 
 * Validation functions for pricing and care plan data
 */

import { CarePlan, PlanPricing } from '@/types/care-plans'

/**
 * Approved plan names
 */
const APPROVED_PLAN_NAMES = ['Essential', 'Comprehensive', 'Guardian'] as const

/**
 * Approved plan categories
 */
const APPROVED_CATEGORIES = ['essential', 'comprehensive', 'premium', 'custom'] as const

/**
 * Validate pricing configuration
 * @param pricing - The pricing object to validate
 * @returns Validation result with errors if any
 */
export function validatePricing(pricing: PlanPricing): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check base price
  if (typeof pricing.basePrice !== 'number' || pricing.basePrice <= 0) {
    errors.push('Base price must be a positive number')
  }

  // Check final price
  if (typeof pricing.finalPrice !== 'number' || pricing.finalPrice <= 0) {
    errors.push('Final price must be a positive number')
  }

  // Check discount percentage
  if (typeof pricing.discountPercentage !== 'number' || 
      pricing.discountPercentage < 0 || 
      pricing.discountPercentage > 100) {
    errors.push('Discount percentage must be between 0 and 100')
  }

  // Check currency
  if (pricing.currency !== 'INR') {
    errors.push('Currency must be INR')
  }

  // Check billing cycle
  if (!['monthly', 'quarterly', 'annually'].includes(pricing.billingCycle)) {
    errors.push('Billing cycle must be monthly, quarterly, or annually')
  }

  // Check fees are non-negative
  if (pricing.setupFee < 0 || pricing.cancellationFee < 0 || pricing.upgradeCredit < 0) {
    errors.push('Fees and credits must be non-negative')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate plan name
 * @param name - The plan name to validate
 * @returns True if valid, false otherwise
 */
export function isValidPlanName(name: string): boolean {
  return APPROVED_PLAN_NAMES.includes(name as any)
}

/**
 * Validate plan category
 * @param category - The category to validate
 * @returns True if valid, false otherwise
 */
export function isValidCategory(category: string): boolean {
  return APPROVED_CATEGORIES.includes(category as any)
}

/**
 * Validate care plan has required fields
 * @param plan - The care plan to validate
 * @returns Validation result with errors if any
 */
export function validateCarePlan(plan: Partial<CarePlan>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required fields
  if (!plan.id) errors.push('Plan ID is required')
  if (!plan.name) errors.push('Plan name is required')
  if (!plan.displayName) errors.push('Display name is required')
  if (!plan.description) errors.push('Description is required')
  if (!plan.category) errors.push('Category is required')
  if (!plan.pricing) errors.push('Pricing is required')
  if (!plan.services || plan.services.length === 0) {
    errors.push('At least one service is required')
  }

  // Validate pricing if present
  if (plan.pricing) {
    const pricingValidation = validatePricing(plan.pricing)
    if (!pricingValidation.valid) {
      errors.push(...pricingValidation.errors)
    }
  }

  // Validate category if present
  if (plan.category && !isValidCategory(plan.category)) {
    errors.push(`Invalid category: ${plan.category}. Must be one of: ${APPROVED_CATEGORIES.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate boundary conditions for pricing
 * @param price - The price to validate
 * @returns True if within acceptable bounds
 */
export function isWithinBounds(price: number): boolean {
  const MIN_PRICE = 0
  const MAX_PRICE = 1000000 // 10 lakhs
  return price >= MIN_PRICE && price <= MAX_PRICE
}

/**
 * Get approved plan names
 * @returns Array of approved plan names
 */
export function getApprovedPlanNames(): readonly string[] {
  return APPROVED_PLAN_NAMES
}

/**
 * Get approved categories
 * @returns Array of approved categories
 */
export function getApprovedCategories(): readonly string[] {
  return APPROVED_CATEGORIES
}
