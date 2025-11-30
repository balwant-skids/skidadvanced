# Requirements Document - Phase 2 Features

## Introduction

This document outlines the requirements for Phase 2 of SKIDS Advanced, including PWA capabilities, admin dashboard analytics, digital parenting modules, healthy habits guidance, nutrition education, and WhatsApp Business integration.

## Glossary

- **PWA**: Progressive Web App - installable web application with offline capabilities
- **BYOK**: Bring Your Own Key - allow users to configure their own API keys
- **AAP**: American Academy of Pediatrics
- **IAP**: Indian Academy of Pediatrics
- **Circadian Rhythm**: Natural 24-hour biological cycle affecting sleep and metabolism
- **Digital Fasting**: Intentional periods of reduced screen/device usage
- **Information Nutrition**: Concept of consuming balanced, healthy digital content
- **Microbiome**: Community of microorganisms in the digestive system

---

## Requirements

### Requirement 1: PWA Setup

**User Story:** As a parent, I want to install the app on my device and use it offline, so that I can access my child's information anytime.

#### Acceptance Criteria

1. WHEN a user visits the app on a supported browser THEN the system SHALL display an install prompt
2. WHEN the app is installed THEN the system SHALL provide a native app-like experience with splash screen
3. WHEN the device is offline THEN the system SHALL serve cached pages and data from IndexedDB
4. WHEN the app regains connectivity THEN the system SHALL sync pending changes automatically
5. WHEN push notifications are enabled THEN the system SHALL receive notifications even when app is closed

---

### Requirement 2: Admin Dashboard Analytics

**User Story:** As a clinic admin, I want to see analytics and metrics about my clinic, so that I can make data-driven decisions.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the system SHALL display total registered parents count
2. WHEN an admin views the dashboard THEN the system SHALL display active subscriptions by plan type
3. WHEN an admin views the dashboard THEN the system SHALL display assessment completion rates
4. WHEN an admin views the dashboard THEN the system SHALL display appointment statistics
5. WHEN an admin views the dashboard THEN the system SHALL display charts for trends over time
6. WHEN an admin requests data export THEN the system SHALL generate CSV/Excel files

---

### Requirement 3: Data Export (CSV/Excel)

**User Story:** As an admin, I want to export data to CSV/Excel, so that I can analyze it externally or share reports.

#### Acceptance Criteria

1. WHEN an admin exports parent list THEN the system SHALL generate a CSV with parent details
2. WHEN an admin exports children data THEN the system SHALL generate a CSV with child profiles
3. WHEN an admin exports assessments THEN the system SHALL generate a CSV with assessment results
4. WHEN an admin exports appointments THEN the system SHALL generate a CSV with appointment history
5. WHEN export is requested THEN the system SHALL include timestamp and filter criteria in filename

---

### Requirement 4: BYOK (Bring Your Own Key)

**User Story:** As an admin, I want to configure my own API keys for services, so that I can use my own accounts for WhatsApp, payments, etc.

#### Acceptance Criteria

1. WHEN an admin accesses settings THEN the system SHALL display BYOK configuration options
2. WHEN an admin enters WhatsApp Business API credentials THEN the system SHALL validate and store them securely
3. WHEN an admin enters Razorpay credentials THEN the system SHALL validate and store them securely
4. WHEN BYOK keys are configured THEN the system SHALL use clinic-specific keys for that clinic
5. WHEN BYOK keys are not configured THEN the system SHALL fall back to platform default keys

---

### Requirement 5: WhatsApp Business Integration

**User Story:** As a clinic, I want to communicate with parents via WhatsApp Business API, so that I can send automated messages and notifications.

#### Acceptance Criteria

1. WHEN a report is uploaded THEN the system SHALL send WhatsApp notification to parent
2. WHEN an appointment is scheduled THEN the system SHALL send WhatsApp confirmation
3. WHEN appointment reminder is due THEN the system SHALL send WhatsApp reminder 24 hours before
4. WHEN admin sends broadcast THEN the system SHALL deliver to all subscribed parents via WhatsApp
5. WHEN parent replies THEN the system SHALL capture response in messaging system

---

### Requirement 6: Assessment Module Integration

**User Story:** As a parent, I want to complete assessments for my child and see results stored in their profile.

#### Acceptance Criteria

1. WHEN a parent starts an assessment THEN the system SHALL load the appropriate assessment module
2. WHEN assessment is completed THEN the system SHALL store results in child's profile
3. WHEN viewing child profile THEN the system SHALL display assessment history with scores
4. WHEN admin views assessments THEN the system SHALL show completion rates and averages
5. WHEN assessment has recommendations THEN the system SHALL display actionable guidance

---

### Requirement 7: Health Charts & Visualization

**User Story:** As a parent, I want to see my child's health metrics visualized over time, so that I can track progress.

#### Acceptance Criteria

1. WHEN viewing child profile THEN the system SHALL display growth charts (height, weight)
2. WHEN viewing assessments THEN the system SHALL display score trends over time
3. WHEN viewing health metrics THEN the system SHALL display interactive charts
4. WHEN hovering on chart points THEN the system SHALL show detailed values
5. WHEN viewing charts THEN the system SHALL allow date range filtering

---

### Requirement 8: Digital Parenting Module

**User Story:** As a parent, I want guidance on managing my child's digital life based on AAP/IAP guidelines.

#### Acceptance Criteria

1. WHEN accessing digital parenting module THEN the system SHALL display age-appropriate screen time guidelines
2. WHEN viewing internet safety THEN the system SHALL provide AAP/IAP recommended practices
3. WHEN viewing social media guidance THEN the system SHALL display age-specific recommendations
4. WHEN viewing digital hazards THEN the system SHALL list common risks and prevention strategies
5. WHEN viewing digital fasting THEN the system SHALL provide structured detox programs
6. WHEN completing digital assessment THEN the system SHALL provide personalized recommendations

---

### Requirement 9: Healthy Habits Module

**User Story:** As a parent, I want guidance on establishing healthy daily routines for my child.

#### Acceptance Criteria

1. WHEN accessing circadian rhythm section THEN the system SHALL explain natural body clock optimization
2. WHEN viewing morning activities THEN the system SHALL provide age-appropriate morning routine suggestions
3. WHEN viewing meal timing THEN the system SHALL explain sun-aligned eating patterns
4. WHEN viewing post-meal guidance THEN the system SHALL recommend post-prandial walking duration
5. WHEN viewing movement breaks THEN the system SHALL provide intermittent sitting break reminders
6. WHEN viewing sleep guidance THEN the system SHALL display age-appropriate sleep duration and hygiene
7. WHEN viewing physical activity THEN the system SHALL provide daily movement recommendations
8. WHEN viewing stress management THEN the system SHALL offer resilience-building techniques
9. WHEN viewing mind training THEN the system SHALL provide age-appropriate mindfulness exercises
10. WHEN viewing relaxation THEN the system SHALL offer guided relaxation techniques

---

### Requirement 10: Nutrition Module

**User Story:** As a parent, I want comprehensive nutrition guidance for my child's optimal development.

#### Acceptance Criteria

1. WHEN accessing macronutrients section THEN the system SHALL explain proteins, carbs, fats requirements
2. WHEN accessing micronutrients section THEN the system SHALL explain vitamins and minerals needs
3. WHEN viewing microbiome health THEN the system SHALL explain gut health importance and foods
4. WHEN viewing nutrition management THEN the system SHALL provide meal planning guidance
5. WHEN viewing food recommendations THEN the system SHALL display age-appropriate portions

---

### Requirement 11: Information Nutrition Module

**User Story:** As a parent, I want guidance on managing the information my child consumes for mental well-being.

#### Acceptance Criteria

1. WHEN accessing information nutrition THEN the system SHALL explain concept of balanced content consumption
2. WHEN viewing content categories THEN the system SHALL classify educational, entertainment, social content
3. WHEN viewing healthy consumption THEN the system SHALL provide time allocation recommendations
4. WHEN viewing information detox THEN the system SHALL offer digital content fasting strategies
5. WHEN completing information audit THEN the system SHALL analyze current consumption patterns
6. WHEN viewing recommendations THEN the system SHALL suggest quality content sources by age

---

### Requirement 12: Cloudflare Deployment

**User Story:** As a developer, I want to deploy the application on Cloudflare, so that it's globally distributed and performant.

#### Acceptance Criteria

1. WHEN deploying THEN the system SHALL build as static/edge-compatible Next.js app
2. WHEN deployed THEN the system SHALL serve from Cloudflare's edge network
3. WHEN API routes are called THEN the system SHALL execute via Cloudflare Workers
4. WHEN database is accessed THEN the system SHALL connect to Turso via libSQL
5. WHEN files are uploaded THEN the system SHALL store in Cloudflare R2

