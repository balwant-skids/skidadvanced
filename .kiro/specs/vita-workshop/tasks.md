# Implementation Plan

## Overview

This implementation plan builds the Vita Workshop module incrementally, starting with database schema and core services, then APIs, and finally UI integration. Property-based tests are placed close to their related implementations.

---

## Phase 1: Database Schema and Core Models (Day 1-2)

- [x] 1. Extend Prisma schema for Vita Workshop
  - [x] 1.1 Add ContentModule and MediaAsset models
    - Create ContentModule with title, description, category, ageGroup fields
    - Create MediaAsset with type, url, filename, size fields
    - Add indexes for category, status, and age range queries
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Add Activity and WorkshopSession models
    - Create Activity with name, category, type, steps, points fields
    - Create WorkshopSession with progress tracking fields
    - Add unique constraint on [moduleId, childId]
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.3 Add Assessment and AssessmentResult models
    - Create Assessment with questions JSON and passingScore
    - Create AssessmentResult with score, categoryScores, answers
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 1.4 Add ChildProgress model
    - Create ChildProgress with overallCompletion, categoryProgress, streak fields
    - Add unique constraint on childId
    - _Requirements: 3.1, 3.4_
  - [x] 1.5 Add Badge and EarnedBadge models
    - Create Badge with name, type, criteria JSON
    - Create EarnedBadge with unique [badgeId, childId]
    - _Requirements: 5.1, 5.4_
  - [x] 1.6 Add ActivityCompletion, ActivityFavorite, Recommendation models
    - Create completion and favorite tracking tables
    - Create Recommendation with priority, rationale, basedOn fields
    - _Requirements: 6.1, 8.4, 8.5_
  - [x] 1.7 Add WeeklyChallenge and ChallengeProgress models
    - Create challenge tracking for parent-child activities
    - _Requirements: 9.3_
  - [x] 1.8 Run Prisma migration
    - Execute npx prisma db push
    - Verify all tables created in Neon
    - _Requirements: 11.1_

- [x] 2. Checkpoint - Schema complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 2: Content Management Service (Day 2-4)

- [x] 3. Implement Content Management Service
  - [x] 3.1 Create content service with CRUD operations
    - Implement createModule, updateModule, getModule functions
    - Add version incrementing on updates
    - Store edit history in version field
    - _Requirements: 1.1, 1.2_
  - [x] 3.2 Implement content publishing and archiving
    - Add publishModule and archiveModule functions
    - Ensure archived content preserves completion records
    - _Requirements: 1.3, 1.5_
  - [x] 3.3 Implement age-group filtering
    - Add getModulesByAgeGroup function
    - Filter by ageGroupMin <= age <= ageGroupMax
    - _Requirements: 1.3, 2.1_
  - [x] 3.4 Property test: Content Module Field Completeness
    - **Property 1: Content Module Field Completeness**
    - **Validates: Requirements 1.1, 11.2**
  - [x] 3.5 Property test: Content Versioning Consistency
    - **Property 2: Content Versioning Consistency**
    - **Validates: Requirements 1.2**
  - [x] 3.6 Property test: Age-Appropriate Content Filtering
    - **Property 3: Age-Appropriate Content Filtering**
    - **Validates: Requirements 1.3, 2.1**

- [x] 4. Create Content Management API routes
  - [x] 4.1 POST /api/workshop/content - create module
    - Validate admin role
    - Upload media assets to R2
    - Return created module with ID
    - _Requirements: 1.1, 1.4_
  - [x] 4.2 GET /api/workshop/content - list modules
    - Filter by category, age group, status
    - Support pagination
    - _Requirements: 1.3, 2.1_
  - [x] 4.3 PATCH /api/workshop/content/[id] - update module
    - Increment version on update
    - _Requirements: 1.2_
  - [x] 4.4 POST /api/workshop/content/[id]/publish - publish module
    - Change status to published
    - _Requirements: 1.3_
  - [x] 4.5 DELETE /api/workshop/content/[id] - archive module
    - Change status to archived (soft delete)
    - _Requirements: 1.5_

- [x] 5. Checkpoint - Content management complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 3: Session Delivery Service (Day 4-5)

- [x] 6. Implement Session Delivery Service
  - [x] 6.1 Create session service with start/resume functions
    - Implement startSession, getSession, resumeSession
    - Track currentActivityIndex and completedActivities
    - _Requirements: 2.1, 2.5_
  - [x] 6.2 Implement activity completion tracking
    - Add completeActivity function
    - Update session progress on completion
    - Provide immediate feedback
    - _Requirements: 2.3_
  - [x] 6.3 Implement session progress calculation
    - Calculate completion percentage
    - Track last accessed timestamp
    - _Requirements: 2.5, 3.1_
  - [x] 6.4 Property test: Session Progress Persistence
    - **Property 4: Session Progress Persistence**
    - **Validates: Requirements 2.5**

- [x] 7. Create Session API routes
  - [x] 7.1 POST /api/workshop/sessions - start session
    - Create or resume existing session
    - Return session with current progress
    - _Requirements: 2.1_
  - [x] 7.2 GET /api/workshop/sessions/[id] - get session
    - Return session with module content
    - _Requirements: 2.1, 2.2_
  - [x] 7.3 POST /api/workshop/sessions/[id]/complete-activity - complete activity
    - Update completedActivities array
    - Award points
    - _Requirements: 2.3_

- [x] 8. Checkpoint - Session delivery complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 4: Progress Tracking Service (Day 5-6)

- [x] 9. Implement Progress Tracking Service
  - [x] 9.1 Create progress service with update/get functions
    - Implement updateProgress, getProgress, getCategoryProgress
    - Calculate overall and category completion percentages
    - _Requirements: 3.1, 3.2_
  - [x] 9.2 Implement streak tracking
    - Add updateStreak function
    - Track consecutive engagement days
    - Update longestStreak when exceeded
    - _Requirements: 3.4_
  - [x] 9.3 Implement progress sync
    - Add syncProgress function for offline data
    - Apply server-wins conflict resolution
    - _Requirements: 3.5, 10.3_
  - [x] 9.4 Property test: Progress Calculation Accuracy
    - **Property 5: Progress Calculation Accuracy**
    - **Validates: Requirements 3.1, 3.2**
  - [x] 9.5 Property test: Streak Calculation Correctness
    - **Property 6: Streak Calculation Correctness**
    - **Validates: Requirements 3.4**

- [x] 10. Create Progress API routes
  - [x] 10.1 GET /api/workshop/progress/[childId] - get progress
    - Return overall and category progress
    - Include streak information
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 10.2 POST /api/workshop/progress/sync - sync offline progress
    - Accept local progress data
    - Apply server-wins resolution
    - Return merged progress
    - _Requirements: 3.5, 10.3_

- [x] 11. Checkpoint - Progress tracking complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 5: Assessment Service (Day 6-7)

- [x] 12. Implement Assessment Service
  - [x] 12.1 Create assessment service with start/submit functions
    - Implement startAssessment, submitAnswer, completeAssessment
    - Randomize question order
    - Filter by age appropriateness
    - _Requirements: 4.1, 4.2_
  - [x] 12.2 Implement score calculation
    - Calculate overall score as (correct/total) * 100
    - Calculate category breakdown scores
    - _Requirements: 4.3, 4.4_
  - [x] 12.3 Implement recommendation triggering
    - Detect categories below 60%
    - Generate recommendations for weak areas
    - _Requirements: 4.5_
  - [x] 12.4 Property test: Assessment Score Calculation
    - **Property 7: Assessment Score Calculation**
    - **Validates: Requirements 4.3**
  - [x] 12.5 Property test: Category Score Breakdown
    - **Property 8: Category Score Breakdown**
    - **Validates: Requirements 4.4**
  - [x] 12.6 Property test: Low Score Recommendation Trigger
    - **Property 9: Low Score Recommendation Trigger**
    - **Validates: Requirements 4.5, 6.1**

- [x] 13. Create Assessment API routes
  - [x] 13.1 POST /api/workshop/assessments/[id]/start - start assessment
    - Return randomized questions
    - _Requirements: 4.1_
  - [x] 13.2 POST /api/workshop/assessments/[id]/submit - submit answer
    - Validate answer and return feedback
    - _Requirements: 4.2_
  - [x] 13.3 POST /api/workshop/assessments/[id]/complete - complete assessment
    - Calculate and store results
    - Trigger recommendations if needed
    - _Requirements: 4.3, 4.4, 4.5_
  - [x] 13.4 GET /api/workshop/assessments/results/[childId] - get results
    - Return all assessment results with category breakdown
    - _Requirements: 4.4_

- [x] 14. Checkpoint - Assessment service complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 6: Gamification Service (Day 7-8)

- [x] 15. Implement Gamification Service
  - [x] 15.1 Create badge service with award functions
    - Implement checkAndAwardBadges, getBadgeCollection
    - Check badge criteria on events
    - Ensure idempotent badge awarding
    - _Requirements: 5.1, 5.4_
  - [x] 15.2 Implement streak badges
    - Award badge on 7-day streak
    - Track milestone achievements
    - _Requirements: 5.2, 5.5_
  - [x] 15.3 Implement badge notifications
    - Send FCM notification on badge earned
    - Notify both child and parent
    - _Requirements: 5.3_
  - [x] 15.4 Property test: Badge Award Idempotence
    - **Property 10: Badge Award Idempotence**
    - **Validates: Requirements 5.1, 5.2, 5.5**
  - [x] 15.5 Property test: Badge Collection Completeness
    - **Property 11: Badge Collection Completeness**
    - **Validates: Requirements 5.4**

- [x] 16. Create Gamification API routes
  - [x] 16.1 GET /api/workshop/badges/[childId] - get badge collection
    - Return earned and unearned badges
    - _Requirements: 5.4_
  - [x] 16.2 GET /api/workshop/badges/[childId]/streak - get streak status
    - Return current and longest streak
    - _Requirements: 5.2_

- [x] 17. Checkpoint - Gamification complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 7: Recommendation Service (Day 8-9)

- [x] 18. Implement Recommendation Service
  - [x] 18.1 Create recommendation service
    - Implement generateRecommendations, getRecommendations
    - Prioritize by assessment scores (lower score = higher priority)
    - _Requirements: 6.1, 6.2_
  - [x] 18.2 Implement rationale generation
    - Generate explanations for each recommendation
    - Reference assessment scores or completion status
    - _Requirements: 6.3_
  - [x] 18.3 Implement recommendation updates
    - Update recommendations after module completion
    - Suggest advanced content when no weak areas
    - _Requirements: 6.4, 6.5_
  - [x] 18.4 Property test: Recommendation Priority Ordering
    - **Property 12: Recommendation Priority Ordering**
    - **Validates: Requirements 6.2**
  - [x] 18.5 Property test: Recommendation Rationale Presence
    - **Property 13: Recommendation Rationale Presence**
    - **Validates: Requirements 6.3**

- [x] 19. Create Recommendation API routes
  - [x] 19.1 GET /api/workshop/recommendations/[childId] - get recommendations
    - Return prioritized list with rationales
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 19.2 POST /api/workshop/recommendations/[childId]/refresh - refresh recommendations
    - Regenerate based on latest progress
    - _Requirements: 6.4_

- [x] 20. Checkpoint - Recommendations complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 8: Trainer Dashboard Service (Day 9-10)

- [x] 21. Implement Trainer Dashboard Service
  - [x] 21.1 Create trainer service with aggregate functions
    - Implement getAggregateStats, getParticipantProgress
    - Calculate average completion across participants
    - _Requirements: 7.1, 7.2_
  - [x] 21.2 Implement participant filtering
    - Add filterParticipants function
    - Support age group, clinic, completion status filters
    - _Requirements: 7.5_
  - [x] 21.3 Implement report export
    - Generate CSV and PDF reports
    - Include progress and assessment data
    - _Requirements: 7.4_
  - [x] 21.4 Property test: Trainer Aggregate Accuracy
    - **Property 14: Trainer Aggregate Accuracy**
    - **Validates: Requirements 7.1, 7.2**
  - [x] 21.5 Property test: Participant Filter Correctness
    - **Property 15: Participant Filter Correctness**
    - **Validates: Requirements 7.5**

- [x] 22. Create Trainer API routes
  - [x] 22.1 GET /api/workshop/trainer/stats - get aggregate stats
    - Return completion rates by category
    - _Requirements: 7.1, 7.2_
  - [x] 22.2 GET /api/workshop/trainer/participants - list participants
    - Support filtering and pagination
    - _Requirements: 7.3, 7.5_
  - [x] 22.3 GET /api/workshop/trainer/participants/[id] - get participant detail
    - Return individual progress and assessment history
    - _Requirements: 7.3_
  - [x] 22.4 GET /api/workshop/trainer/export - export report
    - Generate CSV or PDF
    - _Requirements: 7.4_

- [x] 23. Checkpoint - Trainer dashboard complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 9: Activity Library Service (Day 10-11)

- [x] 24. Implement Activity Library Service
  - [x] 24.1 Create activity service with browse/complete functions
    - Implement getActivitiesByCategory, completeActivity
    - Award points on completion
    - _Requirements: 8.1, 8.4_
  - [x] 24.2 Implement favorites functionality
    - Add favoriteActivity, unfavoriteActivity, getFavorites
    - _Requirements: 8.5_
  - [x] 24.3 Property test: Activity Category Grouping
    - **Property 16: Activity Category Grouping**
    - **Validates: Requirements 8.1**
  - [x] 24.4 Property test: Activity Points Award
    - **Property 17: Activity Points Award**
    - **Validates: Requirements 8.4**
  - [x] 24.5 Property test: Favorites List Consistency
    - **Property 18: Favorites List Consistency**
    - **Validates: Requirements 8.5**

- [x] 25. Create Activity API routes
  - [x] 25.1 GET /api/workshop/activities - list activities
    - Filter by category
    - _Requirements: 8.1_
  - [x] 25.2 POST /api/workshop/activities/[id]/complete - complete activity
    - Award points and log completion
    - _Requirements: 8.4_
  - [x] 25.3 POST /api/workshop/activities/[id]/favorite - toggle favorite
    - Add or remove from favorites
    - _Requirements: 8.5_
  - [x] 25.4 GET /api/workshop/activities/favorites/[childId] - get favorites
    - Return favorited activities
    - _Requirements: 8.5_

- [x] 26. Checkpoint - Activity library complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 10: Parent Engagement Features (Day 11-12)

- [x] 27. Implement Parent Engagement Service
  - [x] 27.1 Create parent-child activity tracking
    - Implement completeJointActivity
    - Record completion for both profiles
    - _Requirements: 9.1, 9.2_
  - [x] 27.2 Implement weekly challenges
    - Track family challenge progress
    - _Requirements: 9.3_
  - [x] 27.3 Implement parent progress tracking
    - Track parent engagement separately
    - _Requirements: 9.4_
  - [x] 27.4 Implement contextual tips
    - Deliver tips based on child's current focus
    - _Requirements: 9.5_
  - [x] 27.5 Property test: Joint Activity Dual Recording
    - **Property 19: Joint Activity Dual Recording**
    - **Validates: Requirements 9.2**
  - [x] 27.6 Property test: Parent-Child Progress Independence
    - **Property 20: Parent-Child Progress Independence**
    - **Validates: Requirements 9.4**

- [x] 28. Create Parent Engagement API routes
  - [x] 28.1 POST /api/workshop/activities/[id]/complete-joint - complete joint activity
    - Record for both parent and child
    - _Requirements: 9.2_
  - [x] 28.2 GET /api/workshop/challenges - get active challenges
    - Return family challenges with progress
    - _Requirements: 9.3_
  - [x] 28.3 GET /api/workshop/tips/[childId] - get contextual tips
    - Return tips based on child's learning focus
    - _Requirements: 9.5_

- [x] 29. Checkpoint - Parent engagement complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 11: Offline Sync and Serialization (Day 12-13)

- [x] 30. Implement Offline Sync Service
  - [x] 30.1 Create offline download functionality
    - Package content modules with media for offline use
    - _Requirements: 10.1_
  - [x] 30.2 Implement sync with server-wins resolution
    - Resolve conflicts by preferring server data
    - _Requirements: 10.3_
  - [x] 30.3 Implement version checking
    - Detect outdated offline content
    - _Requirements: 10.5_
  - [x] 30.4 Property test: Offline Sync Server-Wins Resolution
    - **Property 21: Offline Sync Server-Wins Resolution**
    - **Validates: Requirements 10.3**

- [x] 31. Implement Data Serialization
  - [x] 31.1 Create serialization utilities
    - JSON serialization with schema validation
    - Round-trip consistency
    - _Requirements: 11.1, 11.2, 11.5_
  - [x] 31.2 Implement API error handling
    - Consistent error response format
    - Appropriate HTTP status codes
    - _Requirements: 11.3, 11.4_
  - [x] 31.3 Property test: Data Serialization Round-Trip
    - **Property 22: Data Serialization Round-Trip**
    - **Validates: Requirements 11.5**
  - [x] 31.4 Property test: API Error Response Consistency
    - **Property 23: API Error Response Consistency**
    - **Validates: Requirements 11.4**

- [x] 32. Create Offline API routes
  - [x] 32.1 POST /api/workshop/offline/download - download for offline
    - Return packaged content
    - _Requirements: 10.1_
  - [x] 32.2 POST /api/workshop/offline/sync - sync offline data
    - Apply server-wins resolution
    - _Requirements: 10.3_
  - [x] 32.3 GET /api/workshop/offline/updates - check for updates
    - Return list of outdated content
    - _Requirements: 10.5_

- [x] 33. Checkpoint - Offline sync complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 12: UI Integration (Day 13-16)

- [x] 34. Connect Child Portal UI
  - [x] 34.1 Workshop session pages
    - Session list with progress indicators
    - Session detail with activity sequence
    - Activity completion UI with feedback
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 34.2 Activity library pages
    - Category-filtered activity browser
    - Activity detail with timer for breathing exercises
    - Favorites quick-access
    - _Requirements: 8.1, 8.3, 8.5_
  - [x] 34.3 Badge collection page
    - Earned badges with dates
    - Locked badges with criteria
    - Celebration animations
    - _Requirements: 5.4, 5.2_
  - [x] 34.4 Assessment pages
    - Quiz interface with progress
    - Results with category breakdown
    - _Requirements: 4.1, 4.4_

- [x] 35. Connect Parent Portal UI
  - [x] 35.1 Progress dashboard
    - Overall and category progress charts
    - Streak display
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 35.2 Recommendations section
    - Prioritized recommendations with rationales
    - Quick-start buttons
    - _Requirements: 6.1, 6.3_
  - [x] 35.3 Parent-child activities
    - Joint activity list
    - Weekly challenge progress
    - Contextual tips
    - _Requirements: 9.1, 9.3, 9.5_

- [x] 36. Connect Trainer Dashboard UI
  - [x] 36.1 Aggregate statistics page
    - Completion rates by category
    - Participant count and averages
    - _Requirements: 7.1, 7.2_
  - [x] 36.2 Participant management
    - Filterable participant list
    - Individual progress detail view
    - _Requirements: 7.3, 7.5_
  - [x] 36.3 Report export
    - CSV and PDF download buttons
    - _Requirements: 7.4_

- [x] 37. Implement offline UI features
  - [x] 37.1 Download for offline UI
    - Content download buttons
    - Storage usage indicator
    - _Requirements: 10.1, 10.4_
  - [x] 37.2 Sync status indicator
    - Online/offline status
    - Sync progress
    - _Requirements: 10.2, 10.3_

- [x] 38. Final Checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-2 | Database schema and Prisma models |
| 2 | 3-5 | Content management service and APIs |
| 3 | 6-8 | Session delivery service and APIs |
| 4 | 9-11 | Progress tracking service and APIs |
| 5 | 12-14 | Assessment service and APIs |
| 6 | 15-17 | Gamification service and APIs |
| 7 | 18-20 | Recommendation service and APIs |
| 8 | 21-23 | Trainer dashboard service and APIs |
| 9 | 24-26 | Activity library service and APIs |
| 10 | 27-29 | Parent engagement features |
| 11 | 30-33 | Offline sync and serialization |
| 12 | 34-38 | UI integration |

### Property-Based Tests (23 Total)

| Property | Test File | Validates |
|----------|-----------|-----------|
| 1-3 | content-module.property.test.ts | Req 1.1, 1.2, 1.3, 2.1, 11.2 |
| 4 | session-progress.property.test.ts | Req 2.5 |
| 5-6 | progress-tracking.property.test.ts | Req 3.1, 3.2, 3.4 |
| 7-9 | assessment.property.test.ts | Req 4.3, 4.4, 4.5, 6.1 |
| 10-11 | gamification.property.test.ts | Req 5.1, 5.2, 5.4, 5.5 |
| 12-13 | recommendations.property.test.ts | Req 6.2, 6.3 |
| 14-15 | trainer-dashboard.property.test.ts | Req 7.1, 7.2, 7.5 |
| 16-18 | activity-library.property.test.ts | Req 8.1, 8.4, 8.5 |
| 19-20 | parent-engagement.property.test.ts | Req 9.2, 9.4 |
| 21 | offline-sync.property.test.ts | Req 10.3 |
| 22-23 | serialization.property.test.ts | Req 11.4, 11.5 |

