# Implementation Plan

## Overview

This plan implements four educational modules (Nutrition, Digital Parenting, Internet Safety, Healthy Habits) following the existing discovery phase pattern with interactive sections, wonder facts, and age-adapted content.

---

## Phase 1: Foundation & Types (Day 1-2)

- [ ] 1. Set up types and data structures
  - [x] 1.1 Create educational module type definitions
    - Create `src/types/educational-modules.ts`
    - Define ModuleId, AgeGroup, SectionType enums
    - Define EducationalModule, ModuleSection, WonderFact, Activity, Resource interfaces
    - Define QuizQuestion, ModuleProgress, UserAchievement interfaces
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
  - [ ] 1.2 Write property test for module structure
    - **Property 1: Module Structure Completeness**
    - **Validates: Requirements 1.1, 2.1, 3.1, 4.1**

- [ ] 2. Update Prisma schema for progress tracking
  - [ ] 2.1 Add ModuleProgress model
    - Add fields: userId, moduleId, completedSections, currentSection, quizScores
    - Add timestamps: startedAt, completedAt, lastAccessedAt
    - Add unique constraint on [userId, moduleId]
    - _Requirements: 5.3_
  - [ ] 2.2 Add UserAchievement model
    - Add fields: userId, type, moduleId, earnedAt, metadata
    - Add indexes for userId and type
    - _Requirements: 5.5_
  - [ ] 2.3 Run Prisma migration
    - Execute `npx prisma db push`
    - Verify tables created
    - _Requirements: 5.3, 5.5_

- [ ] 3. Checkpoint - Foundation complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 2: Content Data (Day 2-4)

- [ ] 4. Create module content data files
  - [ ] 4.1 Create Nutrition module content
    - Create `src/data/modules/nutrition.ts`
    - Add 7 sections: intro, food-groups, age-nutrition, meal-planning, healthy-eating, quiz, resources
    - Add 8-10 wonder facts with visuals and explanations
    - Add 4-6 activities with materials and steps
    - Add age adaptations for each content section
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  - [ ] 4.2 Write property test for activity structure
    - **Property 4: Activity Structure Validity**
    - **Validates: Requirements 1.5, 2.4, 4.4, 4.5**
  - [ ] 4.3 Create Digital Parenting module content
    - Create `src/data/modules/digital-parenting.ts`
    - Add 7 sections: intro, screen-time, device-management, digital-boundaries, tech-conversations, quiz, resources
    - Add screen time guidelines by age group (AAP recommendations)
    - Add family media agreement template in resources
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ] 4.4 Create Internet Safety module content
    - Create `src/data/modules/internet-safety.ts`
    - Add 8 sections: intro, privacy, cyberbullying, social-media, digital-footprint, safety-activities, quiz, resources
    - Add platform-specific guidance (TikTok, Instagram, YouTube, gaming)
    - Add cyberbullying warning signs and response strategies
    - Add family safety contract in resources
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 4.5 Write property test for wonder fact structure
    - **Property 5: Wonder Fact Structure Validity**
    - **Validates: Requirements 1.4, 3.3**
  - [ ] 4.6 Create Healthy Habits module content
    - Create `src/data/modules/healthy-habits.ts`
    - Add 7 sections: intro, sleep, physical-activity, hygiene, mental-wellness, quiz, resources
    - Add age-specific sleep requirements
    - Add mindfulness and stress management activities
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Checkpoint - Content data complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 3: Services Layer (Day 4-6)

- [ ] 6. Create content service
  - [ ] 6.1 Implement content retrieval functions
    - Create `src/lib/educational-content.ts`
    - Implement getModule(moduleId) function
    - Implement getModuleSection(moduleId, sectionId) function
    - Implement getWonderFacts(moduleId, limit) function
    - Implement getActivities(moduleId, ageGroup) function
    - Implement getResources(moduleId) function
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
  - [ ] 6.2 Implement age adaptation function
    - Create getAgeAdaptedContent(content, ageGroup) function
    - Return age-specific content variations
    - Default to '6-12' if age group not specified
    - _Requirements: 1.2, 2.2, 3.2, 4.2_
  - [ ] 6.3 Write property test for age adaptation
    - **Property 2: Age Adaptation Consistency**
    - **Validates: Requirements 1.2, 2.2, 3.2, 4.2, 4.3**

- [ ] 7. Create progress service
  - [ ] 7.1 Implement progress tracking functions
    - Create `src/lib/educational-progress.ts`
    - Implement getProgress(userId, moduleId) function
    - Implement updateProgress(userId, moduleId, sectionId) function
    - Implement getAllProgress(userId) function
    - _Requirements: 5.3, 5.4_
  - [ ] 7.2 Implement module completion logic
    - Implement completeModule(userId, moduleId) function
    - Calculate and award achievements on completion
    - Check for all-modules-complete achievement
    - _Requirements: 5.5_
  - [ ] 7.3 Write property test for progress persistence
    - **Property 3: Progress Persistence Round-Trip**
    - **Validates: Requirements 5.3, 5.4**
  - [ ] 7.4 Write property test for progress bounds
    - **Property 10: Module Progress Bounds**
    - **Validates: Requirements 5.2**

- [ ] 8. Create offline sync service
  - [ ] 8.1 Implement educational offline functions
    - Create `src/lib/educational-offline.ts`
    - Implement cacheModule(moduleId) function
    - Implement getCachedModule(moduleId) function
    - Implement isCached(moduleId) function
    - Add 'educational-modules' store to IndexedDB
    - _Requirements: 7.1, 7.2_
  - [ ] 8.2 Implement offline progress queue
    - Implement queueProgressUpdate(progress) function
    - Implement syncProgress() function
    - Integrate with existing offline sync service
    - _Requirements: 7.3, 7.4_
  - [ ] 8.3 Write property test for offline cache
    - **Property 6: Offline Cache Round-Trip**
    - **Validates: Requirements 7.1, 7.2**
  - [ ] 8.4 Write property test for offline queue
    - **Property 7: Offline Progress Queue Integrity**
    - **Validates: Requirements 7.3, 7.4**

- [ ] 9. Checkpoint - Services complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 4: API Routes (Day 6-7)

- [ ] 10. Create content API routes
  - [ ] 10.1 Create modules list endpoint
    - Create `src/app/api/learn/modules/route.ts`
    - GET: Return all modules with user progress
    - Include completion percentage for each module
    - _Requirements: 5.1_
  - [ ] 10.2 Create module detail endpoint
    - Create `src/app/api/learn/modules/[moduleId]/route.ts`
    - GET: Return full module content
    - Cache module to IndexedDB on fetch
    - _Requirements: 1.1, 7.1_
  - [ ] 10.3 Create section endpoint
    - Create `src/app/api/learn/modules/[moduleId]/section/[sectionId]/route.ts`
    - GET: Return section with age-adapted content
    - Accept ageGroup query parameter
    - _Requirements: 1.2_

- [ ] 11. Create progress API routes
  - [ ] 11.1 Create progress endpoints
    - Create `src/app/api/learn/progress/route.ts`
    - GET: Return all module progress for authenticated user
    - _Requirements: 5.1_
  - [ ] 11.2 Create module progress endpoint
    - Create `src/app/api/learn/progress/[moduleId]/route.ts`
    - GET: Return progress for specific module
    - _Requirements: 5.4_
  - [ ] 11.3 Create section completion endpoint
    - Create `src/app/api/learn/progress/[moduleId]/section/route.ts`
    - POST: Mark section as complete, update currentSection
    - Return updated progress
    - _Requirements: 5.3_
  - [ ] 11.4 Create module completion endpoint
    - Create `src/app/api/learn/progress/[moduleId]/complete/route.ts`
    - POST: Mark module as complete, award achievements
    - Return achievements earned
    - _Requirements: 5.5_

- [ ] 12. Create achievements API route
  - [ ] 12.1 Create achievements endpoint
    - Create `src/app/api/learn/achievements/route.ts`
    - GET: Return all achievements for authenticated user
    - _Requirements: 5.5_

- [ ] 13. Checkpoint - API routes complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 5: UI Components (Day 7-10)

- [ ] 14. Create shared learn components
  - [ ] 14.1 Create ModuleCard component
    - Create `src/components/learn/ModuleCard.tsx`
    - Display module icon, title, subtitle, progress
    - Add gradient background matching module theme
    - Add hover animations with framer-motion
    - _Requirements: 5.1, 6.1_
  - [ ] 14.2 Create ProgressBar component
    - Create `src/components/learn/ProgressBar.tsx`
    - Display section progress within module
    - Animate progress changes
    - _Requirements: 5.2_
  - [ ] 14.3 Create WonderFactCard component
    - Create `src/components/learn/WonderFactCard.tsx`
    - Display fact with visual, explanation, source
    - Add sparkle animations
    - _Requirements: 1.4, 6.3_

- [ ] 15. Create section components
  - [ ] 15.1 Create StorySection component
    - Create `src/components/learn/StorySection.tsx`
    - Display narrative with animated character
    - Show wonder fact callout
    - Display age-adapted content
    - _Requirements: 1.1, 6.1_
  - [ ] 15.2 Create InteractiveSection component
    - Create `src/components/learn/InteractiveSection.tsx`
    - Display interactive features with animations
    - Add clickable elements and controls
    - _Requirements: 2.3, 6.1_
  - [ ] 15.3 Create FactsSection component
    - Create `src/components/learn/FactsSection.tsx`
    - Display facts grid with WonderFactCard
    - Add staggered entrance animations
    - _Requirements: 1.4, 3.3_
  - [ ] 15.4 Create ActivitiesSection component
    - Create `src/components/learn/ActivitiesSection.tsx`
    - Display activities with materials and steps
    - Show age range and difficulty
    - Add expandable activity cards
    - _Requirements: 1.5, 2.4, 4.5_
  - [ ] 15.5 Create QuizSection component
    - Create `src/components/learn/QuizSection.tsx`
    - Display questions with multiple choice options
    - Track score and show explanations
    - Add completion celebration animation
    - _Requirements: 6.2_
  - [ ] 15.6 Write property test for quiz validation
    - **Property 9: Quiz Answer Validation**
    - **Validates: Requirements 6.2**
  - [ ] 15.7 Create ResourcesSection component
    - Create `src/components/learn/ResourcesSection.tsx`
    - Display downloadable resources
    - Add download buttons with file type icons
    - _Requirements: 2.5, 3.5_

- [ ] 16. Create ModuleSection renderer
  - [ ] 16.1 Create ModuleSection component
    - Create `src/components/learn/ModuleSection.tsx`
    - Render appropriate section component based on type
    - Handle section navigation
    - Track section completion
    - _Requirements: 5.2_

- [ ] 17. Checkpoint - UI components complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 6: Module Pages (Day 10-12)

- [ ] 18. Create educational hub page
  - [ ] 18.1 Create learn hub page
    - Create `src/app/learn/page.tsx`
    - Display all 4 modules with ModuleCard
    - Show overall progress summary
    - Add search/filter by topic
    - Include link to discovery modules
    - _Requirements: 5.1_

- [ ] 19. Create Nutrition module page
  - [ ] 19.1 Create nutrition page
    - Create `src/app/learn/nutrition/page.tsx`
    - Implement section-by-section navigation
    - Add progress bar and section indicators
    - Handle section completion tracking
    - Add previous/next navigation buttons
    - Match discovery module style (brain/heart pages)
    - _Requirements: 1.1, 1.2, 1.3, 5.2_

- [ ] 20. Create Digital Parenting module page
  - [ ] 20.1 Create digital-parenting page
    - Create `src/app/learn/digital-parenting/page.tsx`
    - Implement section navigation
    - Add family media agreement builder in interactive section
    - Include screen time calculator tool
    - _Requirements: 2.1, 2.2, 2.3, 5.2_

- [ ] 21. Create Internet Safety module page
  - [ ] 21.1 Create internet-safety page
    - Create `src/app/learn/internet-safety/page.tsx`
    - Implement section navigation
    - Add platform-specific safety guides
    - Include cyberbullying response flowchart
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2_

- [ ] 22. Create Healthy Habits module page
  - [ ] 22.1 Create healthy-habits page
    - Create `src/app/learn/healthy-habits/page.tsx`
    - Implement section navigation
    - Add sleep calculator by age
    - Include habit tracker preview
    - _Requirements: 4.1, 4.2, 4.3, 5.2_

- [ ] 23. Checkpoint - Module pages complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 7: Integration & Polish (Day 12-14)

- [ ] 24. Integrate with navigation
  - [ ] 24.1 Add learn link to navigation
    - Update `src/components/layout/Navigation.tsx`
    - Add "Learn" menu item linking to /learn
    - Add educational modules to mobile menu
    - _Requirements: 5.1_
  - [ ] 24.2 Add learn modules to dashboard
    - Update parent dashboard to show learning progress
    - Add quick access cards for incomplete modules
    - _Requirements: 5.1_

- [ ] 25. Add offline indicators
  - [ ] 25.1 Add offline status to learn pages
    - Show cached/not-cached status for each module
    - Add "Download for offline" button
    - Show sync status indicator
    - _Requirements: 7.1, 7.2_

- [ ] 26. Add achievements display
  - [ ] 26.1 Create achievements section
    - Add achievements display to learn hub
    - Show earned badges with animations
    - Display completion certificates
    - _Requirements: 5.5, 6.4_

- [ ] 27. Final Checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 8: Admin Content Management (Day 14-16)

- [ ] 28. Create admin content management
  - [ ] 28.1 Create admin learn routes
    - Create `src/app/api/admin/learn/modules/route.ts`
    - GET: List all modules for editing
    - _Requirements: 8.1_
  - [ ] 28.2 Create module update endpoint
    - Create `src/app/api/admin/learn/modules/[moduleId]/route.ts`
    - PUT: Update module content with versioning
    - _Requirements: 8.2_
  - [ ] 28.3 Write property test for content versioning
    - **Property 8: Content Version Increment**
    - **Validates: Requirements 8.2**
  - [ ] 28.4 Create publish endpoint
    - Create `src/app/api/admin/learn/modules/[moduleId]/publish/route.ts`
    - POST: Publish content update, invalidate caches
    - _Requirements: 8.4_
  - [ ] 28.5 Create admin UI for content management
    - Create `src/app/admin/learn/page.tsx`
    - Add module editor with preview
    - Add wonder fact and activity editors
    - _Requirements: 8.1, 8.3_

- [ ] 29. Final Checkpoint - All features complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Summary

| Phase | Tasks | Duration | Dependencies |
|-------|-------|----------|--------------|
| 1. Foundation | Types, Prisma schema | Day 1-2 | None |
| 2. Content Data | 4 module content files | Day 2-4 | Phase 1 |
| 3. Services | Content, Progress, Offline services | Day 4-6 | Phase 1, 2 |
| 4. API Routes | Content, Progress, Achievement APIs | Day 6-7 | Phase 3 |
| 5. UI Components | Section components, cards | Day 7-10 | Phase 1 |
| 6. Module Pages | Hub + 4 module pages | Day 10-12 | Phase 4, 5 |
| 7. Integration | Navigation, offline, achievements | Day 12-14 | Phase 6 |
| 8. Admin | Content management | Day 14-16 | Phase 4 |

**Total: 16 days for complete implementation with all tests and admin features**
