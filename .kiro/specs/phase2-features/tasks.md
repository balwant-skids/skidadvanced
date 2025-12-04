# Implementation Plan - Phase 2 Features

## Overview

This plan covers PWA setup, admin analytics, educational modules, and integrations.

---

## Stream A: PWA & Deployment (Days 1-3)

- [-] 1. PWA Configuration
  - [x] 1.1 Create web app manifest
    - App name, icons, theme colors
    - Display mode: standalone
    - Start URL and scope
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Create service worker
    - Cache static assets
    - Cache API responses
    - Background sync for offline mutations
    - _Requirements: 1.3, 1.4_
  - [ ] 1.3 Add install prompt component
    - Detect installability
    - Custom install UI
    - _Requirements: 1.1_
  - [ ] 1.4 Configure push notifications
    - Firebase messaging in service worker
    - Notification click handling
    - _Requirements: 1.5_

- [ ] 2. Cloudflare Deployment Setup
  - [ ] 2.1 Configure next.config for edge
    - Output: export or edge runtime
    - Configure for Cloudflare Pages
    - _Requirements: 12.1, 12.2_
  - [ ] 2.2 Create wrangler.toml
    - Pages configuration
    - Environment bindings
    - _Requirements: 12.3_
  - [ ] 2.3 Set up CI/CD
    - GitHub Actions for auto-deploy
    - Environment secrets
    - _Requirements: 12.1_

---

## Stream B: Admin Dashboard & Export (Days 2-5)

- [ ] 3. Admin Analytics Dashboard
  - [ ] 3.1 Create analytics API endpoints
    - GET /api/admin/analytics/overview
    - GET /api/admin/analytics/subscriptions
    - GET /api/admin/analytics/assessments
    - GET /api/admin/analytics/appointments
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ] 3.2 Create dashboard page
    - Stats cards (parents, children, subscriptions)
    - Charts using Recharts library
    - Date range filters
    - _Requirements: 2.5_
  - [ ] 3.3 Implement trend charts
    - Registration trends
    - Assessment completion trends
    - Subscription trends
    - _Requirements: 2.5_

- [ ] 4. Data Export Feature
  - [ ] 4.1 Create export API endpoints
    - POST /api/admin/export/parents
    - POST /api/admin/export/children
    - POST /api/admin/export/assessments
    - POST /api/admin/export/appointments
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 4.2 Implement CSV generation
    - Use papaparse or csv-stringify
    - Include headers and data formatting
    - _Requirements: 3.5_
  - [ ] 4.3 Add export UI to admin pages
    - Export buttons on list pages
    - Filter selection before export
    - _Requirements: 3.1_

---

## Stream C: BYOK & WhatsApp (Days 3-6)

- [ ] 5. BYOK Configuration
  - [ ] 5.1 Create clinic settings schema
    - Add settings JSON field to Clinic model
    - Store encrypted API keys
    - _Requirements: 4.2, 4.3_
  - [ ] 5.2 Create settings API
    - GET /api/clinics/[id]/settings
    - PATCH /api/clinics/[id]/settings
    - Key validation endpoints
    - _Requirements: 4.1, 4.4_
  - [ ] 5.3 Create settings UI page
    - /admin/settings page
    - WhatsApp API key input
    - Razorpay key input
    - Test connection buttons
    - _Requirements: 4.1, 4.5_

- [ ] 6. WhatsApp Business Integration
  - [ ] 6.1 Create WhatsApp service
    - WhatsApp Cloud API client
    - Message templates
    - Send message function
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ] 6.2 Implement notification triggers
    - Report upload → WhatsApp
    - Appointment created → WhatsApp
    - Reminder scheduler (cron)
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ] 6.3 Implement broadcast feature
    - Admin broadcast UI
    - Bulk message sending
    - _Requirements: 5.4_
  - [ ] 6.4 Webhook for incoming messages
    - POST /api/webhooks/whatsapp
    - Parse and store replies
    - _Requirements: 5.5_

---

## Stream D: Assessment & Health Charts (Days 4-7)

- [ ] 7. Assessment Module Integration
  - [ ] 7.1 Create assessment results API
    - POST /api/children/[id]/assessments
    - GET /api/children/[id]/assessments
    - _Requirements: 6.2, 6.3_
  - [ ] 7.2 Connect existing assessment UI
    - Pass results to API on completion
    - Store in database
    - _Requirements: 6.1_
  - [ ] 7.3 Display assessment history
    - Assessment list in child profile
    - Score display with recommendations
    - _Requirements: 6.3, 6.5_
  - [ ] 7.4 Admin assessment analytics
    - Completion rates by type
    - Average scores
    - _Requirements: 6.4_

- [ ] 8. Health Charts & Visualization
  - [ ] 8.1 Install charting library
    - npm install recharts
    - _Requirements: 7.3_
  - [ ] 8.2 Create growth charts component
    - Height over time
    - Weight over time
    - BMI calculation
    - _Requirements: 7.1_
  - [ ] 8.3 Create assessment trend charts
    - Score trends by assessment type
    - Comparison to age norms
    - _Requirements: 7.2_
  - [ ] 8.4 Add interactivity
    - Tooltips on hover
    - Date range picker
    - _Requirements: 7.4, 7.5_

---

## Stream E: Educational Modules (Days 5-10)

- [ ] 9. Digital Parenting Module
  - [ ] 9.1 Create content structure
    - JSON/MDX content files
    - Age-group categorization
    - _Requirements: 8.1_
  - [ ] 9.2 Screen time guidelines page
    - AAP/IAP recommendations by age
    - Interactive calculator
    - _Requirements: 8.1_
  - [ ] 9.3 Internet safety page
    - Common risks and prevention
    - Parental controls guide
    - _Requirements: 8.2, 8.4_
  - [ ] 9.4 Social media guidance page
    - Age-appropriate platforms
    - Privacy settings guide
    - _Requirements: 8.3_
  - [ ] 9.5 Digital fasting program
    - Structured detox plans
    - Progress tracking
    - _Requirements: 8.5_
  - [ ] 9.6 Digital wellness assessment
    - Questionnaire
    - Personalized recommendations
    - _Requirements: 8.6_

- [ ] 10. Healthy Habits Module
  - [ ] 10.1 Circadian rhythm section
    - Educational content
    - Daily rhythm visualization
    - _Requirements: 9.1_
  - [ ] 10.2 Morning routine section
    - Age-appropriate activities
    - Checklist feature
    - _Requirements: 9.2_
  - [ ] 10.3 Meal timing section
    - Sun-aligned eating guide
    - Meal schedule planner
    - _Requirements: 9.3_
  - [ ] 10.4 Movement & activity section
    - Post-meal walking guide
    - Sitting break reminders
    - Daily activity tracker
    - _Requirements: 9.4, 9.5, 9.7_
  - [ ] 10.5 Sleep section
    - Age-appropriate duration
    - Sleep hygiene tips
    - Bedtime routine builder
    - _Requirements: 9.6_
  - [ ] 10.6 Mental wellness section
    - Stress management techniques
    - Mindfulness exercises
    - Relaxation guides
    - _Requirements: 9.8, 9.9, 9.10_

- [ ] 11. Nutrition Module
  - [ ] 11.1 Macronutrients section
    - Proteins, carbs, fats explained
    - Age-appropriate requirements
    - Food sources
    - _Requirements: 10.1_
  - [ ] 11.2 Micronutrients section
    - Vitamins and minerals guide
    - Deficiency signs
    - Food sources
    - _Requirements: 10.2_
  - [ ] 11.3 Microbiome health section
    - Gut health importance
    - Probiotic/prebiotic foods
    - _Requirements: 10.3_
  - [ ] 11.4 Meal planning section
    - Sample meal plans by age
    - Portion guide
    - _Requirements: 10.4, 10.5_

- [ ] 12. Information Nutrition Module
  - [ ] 12.1 Concept introduction
    - What is information nutrition
    - Impact on mental health
    - _Requirements: 11.1_
  - [ ] 12.2 Content categories section
    - Educational vs entertainment
    - Quality indicators
    - _Requirements: 11.2_
  - [ ] 12.3 Consumption guidelines
    - Time allocation by category
    - Balance recommendations
    - _Requirements: 11.3_
  - [ ] 12.4 Information detox section
    - Fasting strategies
    - Digital sabbath concept
    - _Requirements: 11.4_
  - [ ] 12.5 Content audit tool
    - Track current consumption
    - Analysis and recommendations
    - _Requirements: 11.5, 11.6_

---

## Stream F: Payment Integration (Days 8-10)

- [ ] 13. Razorpay Integration
  - [ ] 13.1 Install Razorpay SDK
    - npm install razorpay
    - _Requirements: 4.3_
  - [ ] 13.2 Create payment API
    - POST /api/payments/create-order
    - POST /api/payments/verify
    - _Requirements: 4.3_
  - [ ] 13.3 Create payment UI
    - Plan selection page
    - Razorpay checkout integration
    - Success/failure handling
    - _Requirements: 4.3_
  - [ ] 13.4 Subscription activation
    - Create subscription on payment success
    - Handle webhooks for renewals
    - _Requirements: 4.3_

---

## Checkpoint Tasks

- [ ] 14. Checkpoint - PWA & Deployment
  - Verify PWA installability
  - Test offline functionality
  - Confirm Cloudflare deployment

- [ ] 15. Checkpoint - Admin Features
  - Test analytics dashboard
  - Verify CSV exports
  - Test BYOK configuration

- [ ] 16. Checkpoint - Educational Modules
  - Review all content accuracy
  - Test navigation and UX
  - Verify mobile responsiveness

- [ ] 17. Final Checkpoint
  - End-to-end testing
  - Performance audit
  - Security review

