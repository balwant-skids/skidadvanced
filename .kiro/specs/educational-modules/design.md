# Design Document

## Overview

This design document outlines the architecture for implementing four educational content modules in SKIDS Advanced: Nutrition, Digital Parenting, Internet & Social Media Safety, and Healthy Habits. These modules follow the existing discovery phase pattern with immersive, National Geographic-style experiences featuring interactive sections, wonder facts, age-adapted content, and hands-on activities. The modules integrate with the existing offline-first architecture and user progress tracking system.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│                 EDUCATIONAL MODULES ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EDUCATIONAL HUB (/learn)                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐│
│  │  Nutrition   │  │   Digital    │  │   Internet   │  │  Healthy ││
│  │   Module     │  │  Parenting   │  │    Safety    │  │  Habits  ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬─────┘│
│         │                 │                 │                │      │
│         └─────────────────┼─────────────────┼────────────────┘      │
│                           │                 │                       │
│                           ▼                 ▼                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Module Components                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │   │
│  │  │   Story     │ │ Interactive │ │   Facts     │            │   │
│  │  │  Section    │ │   Section   │ │  Section    │            │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │   │
│  │  │ Activities  │ │   Quiz      │ │  Resources  │            │   │
│  │  │  Section    │ │  Section    │ │  Section    │            │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                         │
│                           ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Shared Services                           │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │   │
│  │  │ Progress  │  │  Content  │  │  Offline  │  │   Age     │ │   │
│  │  │ Tracker   │  │  Manager  │  │   Sync    │  │ Adapter   │ │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                         │
│                           ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                                │   │
│  │  ┌───────────────────────┐  ┌───────────────────────────┐   │   │
│  │  │   Prisma (Server)     │  │   IndexedDB (Client)      │   │   │
│  │  │   - ModuleProgress    │  │   - Cached Content        │   │   │
│  │  │   - UserAchievements  │  │   - Offline Progress      │   │   │
│  │  │   - ContentVersions   │  │   - Sync Queue            │   │   │
│  │  └───────────────────────┘  └───────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Educational Module Types

```typescript
// types/educational-modules.ts

type AgeGroup = '0-2' | '3-5' | '6-12' | '13+';
type SectionType = 'story' | 'interactive' | 'facts' | 'activities' | 'quiz' | 'resources';
type ModuleId = 'nutrition' | 'digital-parenting' | 'internet-safety' | 'healthy-habits';

interface EducationalModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  character: string;
  duration: string;
  sections: ModuleSection[];
  wonderFacts: WonderFact[];
  activities: Activity[];
  resources: Resource[];
}

interface ModuleSection {
  id: string;
  title: string;
  type: SectionType;
  content: SectionContent;
  ageAdaptations?: Record<AgeGroup, string>;
}

interface SectionContent {
  narrative?: string;
  wonderFact?: string;
  visual?: string;
  interactive?: boolean;
  features?: Feature[];
  facts?: FactItem[];
  activities?: Activity[];
  quiz?: QuizQuestion[];
}

interface WonderFact {
  id: string;
  fact: string;
  explanation: string;
  visual: string;
  source?: string;
  ageGroup?: AgeGroup;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  ageRange: string;
  duration: string;
  learningGoal: string;
  difficulty: 'easy' | 'medium' | 'challenging';
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'checklist' | 'contract' | 'guide';
  downloadUrl: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
```

### 2. Progress Tracking

```typescript
// types/progress.ts

interface ModuleProgress {
  id: string;
  userId: string;
  moduleId: ModuleId;
  completedSections: string[];
  currentSection: number;
  quizScores: Record<string, number>;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

interface UserAchievement {
  id: string;
  userId: string;
  type: 'module_complete' | 'all_modules' | 'quiz_perfect' | 'streak';
  moduleId?: ModuleId;
  earnedAt: Date;
  metadata?: Record<string, unknown>;
}
```

### 3. Content Service

```typescript
// lib/educational-content.ts

interface ContentService {
  getModule(moduleId: ModuleId): Promise<EducationalModule>;
  getModuleSection(moduleId: ModuleId, sectionId: string): Promise<ModuleSection>;
  getAgeAdaptedContent(content: SectionContent, ageGroup: AgeGroup): SectionContent;
  getWonderFacts(moduleId: ModuleId, limit?: number): Promise<WonderFact[]>;
  getActivities(moduleId: ModuleId, ageGroup?: AgeGroup): Promise<Activity[]>;
  getResources(moduleId: ModuleId): Promise<Resource[]>;
}

interface ProgressService {
  getProgress(userId: string, moduleId: ModuleId): Promise<ModuleProgress | null>;
  updateProgress(userId: string, moduleId: ModuleId, sectionId: string): Promise<ModuleProgress>;
  completeModule(userId: string, moduleId: ModuleId): Promise<UserAchievement[]>;
  getAchievements(userId: string): Promise<UserAchievement[]>;
  getAllProgress(userId: string): Promise<ModuleProgress[]>;
}
```

### 4. Offline Sync Integration

```typescript
// lib/educational-offline.ts

interface EducationalOfflineService {
  cacheModule(moduleId: ModuleId): Promise<void>;
  getCachedModule(moduleId: ModuleId): Promise<EducationalModule | null>;
  queueProgressUpdate(progress: Partial<ModuleProgress>): Promise<void>;
  syncProgress(): Promise<void>;
  isCached(moduleId: ModuleId): Promise<boolean>;
}
```

## Data Models

### Prisma Schema Extensions

```prisma
// Add to existing schema.prisma

model ModuleProgress {
  id                String   @id @default(cuid())
  userId            String
  moduleId          String
  completedSections String[] @default([])
  currentSection    Int      @default(0)
  quizScores        Json     @default("{}")
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  lastAccessedAt    DateTime @default(now())
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, moduleId])
  @@index([userId])
  @@index([moduleId])
}

model UserAchievement {
  id        String   @id @default(cuid())
  userId    String
  type      String
  moduleId  String?
  earnedAt  DateTime @default(now())
  metadata  Json?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([type])
}

model ContentVersion {
  id          String   @id @default(cuid())
  moduleId    String   @unique
  version     Int      @default(1)
  content     Json
  publishedAt DateTime @default(now())
  publishedBy String?
  
  @@index([moduleId])
}
```

### IndexedDB Schema (Client-Side)

```typescript
// Educational content stores for IndexedDB

interface EducationalStores {
  modules: {
    key: ModuleId;
    value: EducationalModule;
    indexes: ['lastCached'];
  };
  progress: {
    key: string; // `${userId}-${moduleId}`
    value: ModuleProgress;
    indexes: ['userId', 'moduleId'];
  };
  syncQueue: {
    key: string;
    value: {
      type: 'progress_update';
      data: Partial<ModuleProgress>;
      timestamp: number;
    };
    indexes: ['timestamp'];
  };
}
```

## Module Content Structure

### Nutrition Module Sections

```typescript
const nutritionModule: EducationalModule = {
  id: 'nutrition',
  title: 'The Food Adventure',
  subtitle: 'Fueling Your Child\'s Growth',
  description: 'Discover how the right foods power your child\'s amazing body and brain development.',
  icon: '🥗',
  gradient: 'from-green-400 to-emerald-600',
  character: '🍎',
  duration: '25-30 min',
  sections: [
    { id: 'intro', title: 'Welcome to Food World', type: 'story' },
    { id: 'food-groups', title: 'The Five Food Friends', type: 'interactive' },
    { id: 'age-nutrition', title: 'Growing Strong', type: 'facts' },
    { id: 'meal-planning', title: 'Building Balanced Plates', type: 'interactive' },
    { id: 'healthy-eating', title: 'Fun Eating Habits', type: 'activities' },
    { id: 'quiz', title: 'Nutrition Knowledge Check', type: 'quiz' },
    { id: 'resources', title: 'Take-Home Tools', type: 'resources' }
  ],
  // ... wonderFacts, activities, resources
};
```

### Digital Parenting Module Sections

```typescript
const digitalParentingModule: EducationalModule = {
  id: 'digital-parenting',
  title: 'The Digital Balance',
  subtitle: 'Guiding Tech-Smart Kids',
  description: 'Learn how to help your child develop a healthy relationship with technology.',
  icon: '📱',
  gradient: 'from-blue-400 to-indigo-600',
  character: '🖥️',
  duration: '20-25 min',
  sections: [
    { id: 'intro', title: 'Welcome to the Digital Age', type: 'story' },
    { id: 'screen-time', title: 'Screen Time Guidelines', type: 'facts' },
    { id: 'device-management', title: 'Managing Devices', type: 'interactive' },
    { id: 'digital-boundaries', title: 'Setting Healthy Boundaries', type: 'interactive' },
    { id: 'tech-conversations', title: 'Talking Tech with Kids', type: 'activities' },
    { id: 'quiz', title: 'Digital Parenting Check', type: 'quiz' },
    { id: 'resources', title: 'Family Media Agreement', type: 'resources' }
  ],
  // ... wonderFacts, activities, resources
};
```

### Internet Safety Module Sections

```typescript
const internetSafetyModule: EducationalModule = {
  id: 'internet-safety',
  title: 'The Safe Web Explorer',
  subtitle: 'Protecting Kids Online',
  description: 'Equip yourself with knowledge to keep your child safe in the digital world.',
  icon: '🛡️',
  gradient: 'from-purple-400 to-pink-600',
  character: '🔒',
  duration: '25-30 min',
  sections: [
    { id: 'intro', title: 'The Online World', type: 'story' },
    { id: 'privacy', title: 'Privacy Matters', type: 'interactive' },
    { id: 'cyberbullying', title: 'Stopping Cyberbullying', type: 'facts' },
    { id: 'social-media', title: 'Social Media Safety', type: 'interactive' },
    { id: 'digital-footprint', title: 'Your Digital Shadow', type: 'facts' },
    { id: 'safety-activities', title: 'Safety Conversations', type: 'activities' },
    { id: 'quiz', title: 'Safety Knowledge Check', type: 'quiz' },
    { id: 'resources', title: 'Family Safety Contract', type: 'resources' }
  ],
  // ... wonderFacts, activities, resources
};
```

### Healthy Habits Module Sections

```typescript
const healthyHabitsModule: EducationalModule = {
  id: 'healthy-habits',
  title: 'The Wellness Journey',
  subtitle: 'Building Lifelong Health',
  description: 'Discover how daily habits shape your child\'s physical and mental wellbeing.',
  icon: '💪',
  gradient: 'from-orange-400 to-red-600',
  character: '🌟',
  duration: '25-30 min',
  sections: [
    { id: 'intro', title: 'The Power of Habits', type: 'story' },
    { id: 'sleep', title: 'Sweet Dreams Science', type: 'interactive' },
    { id: 'physical-activity', title: 'Move & Groove', type: 'facts' },
    { id: 'hygiene', title: 'Clean & Healthy', type: 'interactive' },
    { id: 'mental-wellness', title: 'Happy Mind, Happy Child', type: 'activities' },
    { id: 'quiz', title: 'Habits Knowledge Check', type: 'quiz' },
    { id: 'resources', title: 'Habit Trackers', type: 'resources' }
  ],
  // ... wonderFacts, activities, resources
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Module Structure Completeness

*For any* educational module, the module SHALL contain all required sections (intro, content sections, quiz, resources) with valid content for each section type.
**Validates: Requirements 1.1, 2.1, 3.1, 4.1**

### Property 2: Age Adaptation Consistency

*For any* content with age adaptations and any valid age group, the getAgeAdaptedContent function SHALL return content specific to that age group, and the returned content SHALL differ from other age groups.
**Validates: Requirements 1.2, 2.2, 3.2, 4.2, 4.3**

### Property 3: Progress Persistence Round-Trip

*For any* user and module, completing a section and then querying progress SHALL return that section in the completedSections array.
**Validates: Requirements 5.3, 5.4**

### Property 4: Activity Structure Validity

*For any* activity in any module, the activity SHALL contain a non-empty materials array and a non-empty steps array with at least 2 steps.
**Validates: Requirements 1.5, 2.4, 4.4, 4.5**

### Property 5: Wonder Fact Structure Validity

*For any* wonder fact in any module, the fact SHALL contain a non-empty fact string, explanation, and visual element.
**Validates: Requirements 1.4, 3.3**

### Property 6: Offline Cache Round-Trip

*For any* module that is cached, retrieving from cache SHALL return content equivalent to the original module.
**Validates: Requirements 7.1, 7.2**

### Property 7: Offline Progress Queue Integrity

*For any* progress update made while offline, the update SHALL be added to the sync queue, and syncing SHALL apply all queued updates to the server.
**Validates: Requirements 7.3, 7.4**

### Property 8: Content Version Increment

*For any* content update by an admin, the version number SHALL increment by exactly 1 from the previous version.
**Validates: Requirements 8.2**

### Property 9: Quiz Answer Validation

*For any* quiz question, the correctAnswer index SHALL be within the bounds of the options array.
**Validates: Requirements 6.2**

### Property 10: Module Progress Bounds

*For any* module progress, the currentSection SHALL be between 0 and the total number of sections minus 1.
**Validates: Requirements 5.2**

## Error Handling

### Content Errors

- Module not found → Return 404 with suggestion to check module ID
- Section not found → Return 404 with available sections list
- Invalid age group → Default to '6-12' age group with warning

### Progress Errors

- User not authenticated → Redirect to sign-in
- Progress save failure → Queue for retry, show offline indicator
- Achievement calculation error → Log error, continue without achievement

### Offline Errors

- Cache miss → Fetch from server if online, show offline unavailable message if offline
- Sync conflict → Server wins, log conflict for review
- Storage quota exceeded → Clear oldest cached modules, notify user

### Admin Errors

- Invalid content format → Return validation errors with field details
- Version conflict → Reject update, require refresh
- Publish failure → Rollback to previous version, notify admin

## Testing Strategy

### Unit Testing (Jest)

- Content service methods
- Progress calculation logic
- Age adaptation functions
- Quiz scoring algorithms
- Offline queue operations

### Property-Based Testing (fast-check)

- Module structure validation
- Age adaptation consistency
- Progress round-trip persistence
- Activity/fact structure validation
- Offline cache integrity

### Integration Testing

- API routes for progress tracking
- Content retrieval with caching
- Achievement unlocking flow
- Admin content management

### E2E Testing (Playwright)

- Complete module journey flow
- Progress persistence across sessions
- Offline mode functionality
- Quiz completion and scoring

### Testing Libraries

- **Unit/Integration**: Jest + @testing-library/react
- **Property-Based**: fast-check
- **E2E**: Playwright
- **Mocking**: MSW (Mock Service Worker)

### Test Annotation Format

Each property-based test must include:
```typescript
/**
 * Feature: educational-modules, Property {number}: {property_text}
 * Validates: Requirements {X.Y}
 */
```

## API Routes

### Content Routes

```
GET  /api/learn/modules                    - List all modules with progress
GET  /api/learn/modules/[moduleId]         - Get module content
GET  /api/learn/modules/[moduleId]/section/[sectionId] - Get section content
```

### Progress Routes

```
GET  /api/learn/progress                   - Get all module progress for user
GET  /api/learn/progress/[moduleId]        - Get progress for specific module
POST /api/learn/progress/[moduleId]/section - Mark section complete
POST /api/learn/progress/[moduleId]/complete - Mark module complete
```

### Achievement Routes

```
GET  /api/learn/achievements               - Get user achievements
```

### Admin Routes

```
GET  /api/admin/learn/modules              - List modules for editing
PUT  /api/admin/learn/modules/[moduleId]   - Update module content
POST /api/admin/learn/modules/[moduleId]/publish - Publish content update
```

## File Structure

```
src/
├── app/
│   └── learn/
│       ├── page.tsx                       # Educational hub
│       ├── nutrition/
│       │   └── page.tsx                   # Nutrition module
│       ├── digital-parenting/
│       │   └── page.tsx                   # Digital parenting module
│       ├── internet-safety/
│       │   └── page.tsx                   # Internet safety module
│       └── healthy-habits/
│           └── page.tsx                   # Healthy habits module
├── components/
│   └── learn/
│       ├── ModuleCard.tsx                 # Module preview card
│       ├── ModuleSection.tsx              # Section renderer
│       ├── StorySection.tsx               # Story content
│       ├── InteractiveSection.tsx         # Interactive content
│       ├── FactsSection.tsx               # Facts display
│       ├── ActivitiesSection.tsx          # Activities list
│       ├── QuizSection.tsx                # Quiz component
│       ├── ResourcesSection.tsx           # Downloadable resources
│       ├── ProgressBar.tsx                # Module progress
│       └── WonderFactCard.tsx             # Animated fact card
├── lib/
│   ├── educational-content.ts             # Content service
│   ├── educational-progress.ts            # Progress service
│   └── educational-offline.ts             # Offline sync
├── types/
│   └── educational-modules.ts             # Type definitions
└── data/
    └── modules/
        ├── nutrition.ts                   # Nutrition content
        ├── digital-parenting.ts           # Digital parenting content
        ├── internet-safety.ts             # Internet safety content
        └── healthy-habits.ts              # Healthy habits content
```
