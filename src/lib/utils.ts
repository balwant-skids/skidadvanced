import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Organ color mappings for dynamic styling
export const organColors = {
  brain: {
    50: '#f3f0ff',
    100: '#ede9fe',
    400: '#a78bfa',
    500: '#8b5fbf',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  respiratory: {
    50: '#ecfeff',
    100: '#cffafe',
    400: '#22d3ee',
    500: '#00bcd4',
    600: '#0891b2',
    700: '#0e7490',
  },
  cardiovascular: {
    50: '#fdf2f8',
    100: '#fce7f3',
    400: '#f472b6',
    500: '#e91e63',
    600: '#db2777',
    700: '#be185d',
  },
  digestive: {
    50: '#f0fdf4',
    100: '#dcfce7',
    400: '#4ade80',
    500: '#4caf50',
    600: '#16a34a',
    700: '#15803d',
  },
  skin: {
    50: '#fef7f7',
    100: '#fef2f2',
    400: '#fb7185',
    500: '#ffb6c1',
    600: '#f87171',
    700: '#ef4444',
  },
  sensory: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#ff9800',
    600: '#f59e0b',
    700: '#d97706',
  },
} as const

export type OrganColorKey = keyof typeof organColors

// Animation utilities
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Health data utilities
export function calculateHealthScore(metrics: Record<string, number>): number {
  const values = Object.values(metrics)
  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  return Math.round(average * 100) / 100
}

export function formatHealthMetric(value: number, unit: string): string {
  return `${value.toFixed(1)} ${unit}`
}

export function getHealthStatusColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  if (score >= 50) return 'text-orange-600'
  return 'text-red-600'
}

export function getHealthStatusLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Attention'
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateAge(age: number): boolean {
  return age >= 0 && age <= 18
}

// Local storage utilities
export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
  }
}

// API utilities
export function createApiUrl(endpoint: string, params?: Record<string, string>): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  const url = new URL(endpoint, baseUrl)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  return url.toString()
}
