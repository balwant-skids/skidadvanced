/**
 * Pricing Calculation Utilities
 * 
 * Helper functions for consistent pricing calculations across the application
 */

/**
 * Calculate monthly equivalent from annual price
 * @param annualPrice - The annual price in rupees
 * @returns Monthly equivalent rounded to nearest rupee
 */
export function calculateMonthlyEquivalent(annualPrice: number): number {
  return Math.round(annualPrice / 12)
}

/**
 * Calculate annual savings from monthly vs annual pricing
 * @param monthlyPrice - The monthly price in rupees
 * @param annualPrice - The annual price in rupees
 * @returns Savings amount in rupees
 */
export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice * 12) - annualPrice
}

/**
 * Format currency amount with rupee symbol and thousand separators
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹3,999")
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Calculate discount percentage
 * @param originalPrice - The original price before discount
 * @param discountedPrice - The price after discount
 * @returns Discount percentage rounded to 2 decimal places
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice === 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100 * 100) / 100
}

/**
 * Calculate final price after applying discount percentage
 * @param originalPrice - The original price
 * @param discountPercentage - The discount percentage (0-100)
 * @returns Final price after discount
 */
export function applyDiscount(originalPrice: number, discountPercentage: number): number {
  return Math.round(originalPrice * (1 - discountPercentage / 100))
}

/**
 * Validate pricing data
 * @param price - The price to validate
 * @returns True if valid, false otherwise
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && Number.isFinite(price)
}

/**
 * Calculate total cost of services
 * @param services - Array of services with basePrice and sessions
 * @returns Total cost
 */
export function calculateServiceTotal(services: Array<{ basePrice: number; sessions: number }>): number {
  return services.reduce((total, service) => {
    return total + (service.basePrice * service.sessions)
  }, 0)
}
