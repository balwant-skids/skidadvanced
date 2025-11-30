# Vita Workshop Module - Design Document

## Overview

The Vita Workshop module extends the SKIDS platform to deliver the H.A.B.I.T.S. health education framework through interactive digital content. The module provides workshop sessions, progress tracking, assessments, gamification, and personalized recommendations for children, parents, and trainers.

The design leverages the existing backend infrastructure (Clerk auth, Prisma/Neon database, Cloudflare R2 storage, Firebase FCM notifications) while adding new domain models and APIs specific to the workshop functionality.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│  Child Portal   │  Parent Portal  │       Trainer Dashboard         │
│  - Sessions     │  - Progress     │       - Aggregate Stats         │
│  - Activities   │  - Recommendations│     - Reports                 │
│  - Badges       │  - Tips         │       - Participant View        │
└────────┬────────┴────────┬────────┴────────────────┬────────────────┘
         │                 │                          │
         ▼                 ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Layer (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│  /api/workshop/content     - Content CRUD                           │
│  /api/workshop/sessions    - Session delivery & progress            │
│  /api/workshop/assessments - Quiz management & scoring              │
│  /api/workshop/activities  - Activity library & completion          │
│  /api/workshop/badges      - Gamification & rewards                 │
│  /api/workshop/recommendations - Personalized suggestions           │
│  /api/workshop/trainer     - Trainer dashboard data                 │
│  /api/workshop/offline     - Offline sync endpoints                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────────┐
│   Prisma/Neon   │   │  Cloudflare R2  │   │     Firebase FCM        │
│   PostgreSQL    │   │  Media Storage  │   │     Notifications       │
└─────────────────┘   └─────────────────┘   └─────────────────────────┘
```

## Components and Interfaces

### 1. Content Management Service

```typescript
interface ContentModule {
  id: string;
  title: string;
  description: string;
  category: 'H' | 'A' | 'B' | 'I' | 'T' | 'S';
  ageGroupMin: number;
  ageGroupMax: number;
  version: number;
  status: 'draft' | 'published' | 'archived';
  mediaAssets: MediaAsset[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

interface ContentService {
  createModule(data: CreateModuleInput): Promise<ContentModule>;
  updateModule(id: string, data: UpdateModuleInput): Promise<ContentModule>;
  publishModule(id: string): Promise<ContentModule>;
  archiveModule(id: string): Promise<ContentModule>;
  getModulesByAgeGroup(age: number): Promise<ContentModule[]>;
  getModulesByCategory(category: string): Promise<ContentModule[]>;
}
```

### 2. Session Delivery Service

```typescript
interface WorkshopSession {
  id: string;
  moduleId: string;
  childId: string;
  currentActivityIndex: number;
  completedActivities: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt: Date | null;
}

interface SessionService {
  startSession(childId: string, moduleId: string): Promise<WorkshopSession>;
  getSession(sessionId: string): Promise<WorkshopSession>;
  completeActivity(sessionId: string, activityId: string): Promise<WorkshopSession>;
  resumeSession(sessionId: string): Promise<WorkshopSession>;
  getSessionProgress(sessionId: string): Promise<SessionProgress>;
}
```

### 3. Progress Tracking Service

```typescript
interface ProgressData {
  childId: string;
  overallCompletion: number;
  categoryProgress: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastEngagementDate: Date;
  totalPoints: number;
}

interface ProgressService {
  updateProgress(childId: string, moduleId: string): Promise<ProgressData>;
  getProgress(childId: string): Promise<ProgressData>;
  getCategoryProgress(childId: string, category: string): Promise<number>;
  updateStreak(childId: string): Promise<number>;
  syncProgress(childId: string, localProgress: LocalProgress): Promise<ProgressData>;
}
```

### 4. Assessment Service

```typescript
interface Assessment {
  id: string;
  moduleId: string;
  questions: Question[];
  passingScore: number;
}

interface AssessmentResult {
  id: string;
  assessmentId: string;
  childId: string;
  score: number;
  categoryScores: Record<string, number>;
  answers: AnswerRecord[];
  completedAt: Date;
}

interface AssessmentService {
  startAssessment(childId: string, assessmentId: string): Promise<AssessmentAttempt>;
  submitAnswer(attemptId: string, questionId: string, answer: string): Promise<AnswerFeedback>;
  completeAssessment(attemptId: string): Promise<AssessmentResult>;
  getResults(childId: string): Promise<AssessmentResult[]>;
  getCategoryBreakdown(resultId: string): Promise<CategoryBreakdown>;
}
```

### 5. Gamification Service

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'module' | 'streak' | 'milestone' | 'activity';
  criteria: BadgeCriteria;
}

interface EarnedBadge {
  badgeId: string;
  childId: string;
  earnedAt: Date;
}

interface GamificationService {
  checkAndAwardBadges(childId: string, event: GamificationEvent): Promise<Badge[]>;
  getBadgeCollection(childId: string): Promise<BadgeCollection>;
  getStreakStatus(childId: string): Promise<StreakStatus>;
  awardPoints(childId: string, points: number, reason: string): Promise<number>;
}
```

### 6. Recommendation Service

```typescript
interface Recommendation {
  moduleId: string;
  priority: number;
  rationale: string;
  category: string;
  basedOn: 'assessment' | 'completion' | 'engagement';
}

interface RecommendationService {
  generateRecommendations(childId: string): Promise<Recommendation[]>;
  getRecommendations(childId: string): Promise<Recommendation[]>;
  updateAfterCompletion(childId: string, moduleId: string): Promise<Recommendation[]>;
  getAdvancedContent(childId: string): Promise<ContentModule[]>;
}
```

### 7. Trainer Dashboard Service

```typescript
interface TrainerStats {
  totalParticipants: number;
  averageCompletion: number;
  categoryCompletionRates: Record<string, number>;
  recentActivity: ActivityLog[];
}

interface TrainerService {
  getAggregateStats(trainerId: string): Promise<TrainerStats>;
  getParticipantProgress(trainerId: string, participantId: string): Promise<ProgressData>;
  filterParticipants(trainerId: string, filters: ParticipantFilters): Promise<Participant[]>;
  exportReport(trainerId: string, format: 'csv' | 'pdf'): Promise<Buffer>;
}
```

### 8. Activity Library Service

```typescript
interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'H' | 'A' | 'B' | 'I' | 'T' | 'S';
  type: 'brain_break' | 'breathing' | 'quiz' | 'interactive' | 'parent_child';
  duration: number;
  steps: ActivityStep[];
  points: number;
}

interface ActivityService {
  getActivitiesByCategory(category: string): Promise<Activity[]>;
  completeActivity(childId: string, activityId: string): Promise<ActivityCompletion>;
  favoriteActivity(childId: string, activityId: string): Promise<void>;
  getFavorites(childId: string): Promise<Activity[]>;
}
```

### 9. Offline Sync Service

```typescript
interface OfflineSyncService {
  downloadForOffline(userId: string, moduleIds: string[]): Promise<OfflinePackage>;
  syncProgress(userId: string, localData: LocalSyncData): Promise<SyncResult>;
  checkForUpdates(userId: string, cachedVersions: VersionMap): Promise<UpdateInfo>;
  resolveConflicts(serverData: any, localData: any): any; // Server-wins
}
```

## Data Models

### Prisma Schema Extensions

```prisma
// Workshop Content
model ContentModule {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  category    String   // H, A, B, I, T, S
  ageGroupMin Int
  ageGroupMax Int
  version     Int      @default(1)
  status      String   @default("draft") // draft, published, archived
  clinicId    String?
  clinic      Clinic?  @relation(fields: [clinicId], references: [id])
  
  mediaAssets MediaAsset[]
  activities  Activity[]
  sessions    WorkshopSession[]
  assessments Assessment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([status])
  @@index([ageGroupMin, ageGroupMax])
}

model MediaAsset {
  id        String   @id @default(cuid())
  moduleId  String
  module    ContentModule @relation(fields: [moduleId], references: [id])
  type      String   // image, video, audio
  url       String
  filename  String
  size      Int
  createdAt DateTime @default(now())
  
  @@index([moduleId])
}

model Activity {
  id          String   @id @default(cuid())
  moduleId    String?
  module      ContentModule? @relation(fields: [moduleId], references: [id])
  name        String
  description String   @db.Text
  category    String
  type        String   // brain_break, breathing, quiz, interactive, parent_child
  duration    Int      // in seconds
  steps       Json     // ActivityStep[]
  points      Int      @default(10)
  
  completions ActivityCompletion[]
  favorites   ActivityFavorite[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([type])
}

model WorkshopSession {
  id                   String   @id @default(cuid())
  moduleId             String
  module               ContentModule @relation(fields: [moduleId], references: [id])
  childId              String
  child                Child    @relation(fields: [childId], references: [id])
  currentActivityIndex Int      @default(0)
  completedActivities  Json     @default("[]") // string[]
  startedAt            DateTime @default(now())
  lastAccessedAt       DateTime @default(now())
  completedAt          DateTime?
  
  @@unique([moduleId, childId])
  @@index([childId])
}

model ChildProgress {
  id                 String   @id @default(cuid())
  childId            String   @unique
  child              Child    @relation(fields: [childId], references: [id])
  overallCompletion  Float    @default(0)
  categoryProgress   Json     @default("{}") // Record<string, number>
  currentStreak      Int      @default(0)
  longestStreak      Int      @default(0)
  lastEngagementDate DateTime?
  totalPoints        Int      @default(0)
  
  updatedAt          DateTime @updatedAt
  
  @@index([childId])
}

model Assessment {
  id           String   @id @default(cuid())
  moduleId     String
  module       ContentModule @relation(fields: [moduleId], references: [id])
  title        String
  questions    Json     // Question[]
  passingScore Int      @default(60)
  
  results      AssessmentResult[]
  
  createdAt    DateTime @default(now())
  
  @@index([moduleId])
}

model AssessmentResult {
  id             String   @id @default(cuid())
  assessmentId   String
  assessment     Assessment @relation(fields: [assessmentId], references: [id])
  childId        String
  child          Child    @relation(fields: [childId], references: [id])
  score          Float
  categoryScores Json     // Record<string, number>
  answers        Json     // AnswerRecord[]
  completedAt    DateTime @default(now())
  
  @@index([childId])
  @@index([assessmentId])
}

model Badge {
  id          String   @id @default(cuid())
  name        String
  description String
  imageUrl    String
  type        String   // module, streak, milestone, activity
  criteria    Json     // BadgeCriteria
  
  earnedBadges EarnedBadge[]
  
  createdAt   DateTime @default(now())
}

model EarnedBadge {
  id       String   @id @default(cuid())
  badgeId  String
  badge    Badge    @relation(fields: [badgeId], references: [id])
  childId  String
  child    Child    @relation(fields: [childId], references: [id])
  earnedAt DateTime @default(now())
  
  @@unique([badgeId, childId])
  @@index([childId])
}

model ActivityCompletion {
  id         String   @id @default(cuid())
  activityId String
  activity   Activity @relation(fields: [activityId], references: [id])
  childId    String
  child      Child    @relation(fields: [childId], references: [id])
  points     Int
  completedAt DateTime @default(now())
  
  @@index([childId])
  @@index([activityId])
}

model ActivityFavorite {
  id         String   @id @default(cuid())
  activityId String
  activity   Activity @relation(fields: [activityId], references: [id])
  childId    String
  child      Child    @relation(fields: [childId], references: [id])
  createdAt  DateTime @default(now())
  
  @@unique([activityId, childId])
  @@index([childId])
}

model Recommendation {
  id        String   @id @default(cuid())
  childId   String
  child     Child    @relation(fields: [childId], references: [id])
  moduleId  String
  priority  Int
  rationale String
  category  String
  basedOn   String   // assessment, completion, engagement
  createdAt DateTime @default(now())
  
  @@index([childId])
}

model WeeklyChallenge {
  id          String   @id @default(cuid())
  title       String
  description String
  targetValue Int
  startDate   DateTime
  endDate     DateTime
  
  progress    ChallengeProgress[]
  
  createdAt   DateTime @default(now())
}

model ChallengeProgress {
  id          String   @id @default(cuid())
  challengeId String
  challenge   WeeklyChallenge @relation(fields: [challengeId], references: [id])
  parentId    String
  childId     String
  progress    Int      @default(0)
  completedAt DateTime?
  
  @@unique([challengeId, parentId, childId])
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified. After reflection to eliminate redundancy, these properties provide comprehensive coverage:

### Property 1: Content Module Field Completeness
*For any* content module created with valid input, the stored module SHALL contain all required fields (id, title, description, category, ageGroupMin, ageGroupMax, version, status, createdAt, updatedAt) with non-null values.
**Validates: Requirements 1.1, 11.2**

### Property 2: Content Versioning Consistency
*For any* content module that is updated N times, the version history SHALL contain exactly N+1 versions (including the original), and each version SHALL have a unique version number in ascending order.
**Validates: Requirements 1.2**

### Property 3: Age-Appropriate Content Filtering
*For any* child with age A, when requesting content modules, the returned modules SHALL only include those where ageGroupMin <= A <= ageGroupMax.
**Validates: Requirements 1.3, 2.1**

### Property 4: Session Progress Persistence
*For any* workshop session where a child exits after completing K activities, when the session is resumed, the currentActivityIndex SHALL equal K and completedActivities SHALL contain exactly K activity IDs.
**Validates: Requirements 2.5**

### Property 5: Progress Calculation Accuracy
*For any* child who has completed M modules out of N total modules in a category, the category progress percentage SHALL equal (M/N) * 100, rounded to two decimal places.
**Validates: Requirements 3.1, 3.2**

### Property 6: Streak Calculation Correctness
*For any* child with engagement on consecutive days D1, D2, ..., Dn where each Di+1 = Di + 1 day, the currentStreak SHALL equal n.
**Validates: Requirements 3.4**

### Property 7: Assessment Score Calculation
*For any* completed assessment with Q questions where C answers are correct, the score SHALL equal (C/Q) * 100.
**Validates: Requirements 4.3**

### Property 8: Category Score Breakdown
*For any* assessment result, the sum of (categoryScore * categoryQuestionCount) across all categories SHALL equal the total score * total questions.
**Validates: Requirements 4.4**

### Property 9: Low Score Recommendation Trigger
*For any* assessment result where a category score is below 60%, the recommendations list SHALL contain at least one module from that category.
**Validates: Requirements 4.5, 6.1**

### Property 10: Badge Award Idempotence
*For any* badge and child, completing the badge criteria multiple times SHALL result in exactly one EarnedBadge record (the badge is awarded only once).
**Validates: Requirements 5.1, 5.2, 5.5**

### Property 11: Badge Collection Completeness
*For any* child viewing their badge collection, the collection SHALL contain all badges where: earned badges show earnedAt dates, and unearned badges show as locked.
**Validates: Requirements 5.4**

### Property 12: Recommendation Priority Ordering
*For any* set of recommendations for a child, recommendations SHALL be ordered by priority in descending order (highest priority first), where priority is inversely proportional to assessment score.
**Validates: Requirements 6.2**

### Property 13: Recommendation Rationale Presence
*For any* recommendation in the list, the rationale field SHALL be non-empty and SHALL reference either an assessment score, completion status, or engagement metric.
**Validates: Requirements 6.3**

### Property 14: Trainer Aggregate Accuracy
*For any* trainer with N assigned participants, the aggregate completion rate SHALL equal the average of all N participants' individual completion rates.
**Validates: Requirements 7.1, 7.2**

### Property 15: Participant Filter Correctness
*For any* filter applied to participants (age group, clinic, completion status), the returned list SHALL only contain participants matching ALL specified filter criteria.
**Validates: Requirements 7.5**

### Property 16: Activity Category Grouping
*For any* request to the activity library with category filter C, all returned activities SHALL have category equal to C.
**Validates: Requirements 8.1**

### Property 17: Activity Points Award
*For any* activity completion, the points awarded SHALL equal the activity's defined points value, and the child's totalPoints SHALL increase by exactly that amount.
**Validates: Requirements 8.4**

### Property 18: Favorites List Consistency
*For any* activity favorited by a child, that activity SHALL appear in the child's favorites list, and unfavoriting SHALL remove it.
**Validates: Requirements 8.5**

### Property 19: Joint Activity Dual Recording
*For any* parent-child activity completion, both the parent's and child's completion records SHALL be created with the same timestamp.
**Validates: Requirements 9.2**

### Property 20: Parent-Child Progress Independence
*For any* parent and child pair, updating the parent's progress SHALL NOT affect the child's progress data, and vice versa.
**Validates: Requirements 9.4**

### Property 21: Offline Sync Server-Wins Resolution
*For any* sync conflict where server data has timestamp Ts and local data has timestamp Tl, the resolved data SHALL equal the server data regardless of which timestamp is newer.
**Validates: Requirements 10.3**

### Property 22: Data Serialization Round-Trip
*For any* valid workshop data object, serializing to JSON and deserializing back SHALL produce an object equivalent to the original.
**Validates: Requirements 11.5**

### Property 23: API Error Response Consistency
*For any* API error, the response SHALL include an HTTP status code in the 4xx or 5xx range and a JSON body with an "error" field containing a non-empty message.
**Validates: Requirements 11.4**

## Error Handling

### API Error Responses

```typescript
interface ApiError {
  error: string;
  code: string;
  details?: Record<string, any>;
}

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// HTTP Status mapping
const StatusCodes = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
```

### Error Scenarios

1. **Content not found**: Return 404 with module ID
2. **Age restriction violation**: Return 403 with age requirements
3. **Session already completed**: Return 409 with completion timestamp
4. **Invalid assessment answer**: Return 400 with validation details
5. **Offline sync conflict**: Log conflict, apply server-wins, return merged data

## Testing Strategy

### Unit Testing

Unit tests will cover:
- Individual service methods
- Data validation functions
- Score calculation logic
- Streak calculation logic
- Filter application logic

### Property-Based Testing

The module will use **fast-check** as the property-based testing library (consistent with the existing backend-integration tests).

**Configuration:**
- Minimum 100 iterations per property test
- Seed logging for reproducibility
- Shrinking enabled for minimal counterexamples

**Test Organization:**
Each correctness property will have a dedicated test file:
- `content-module.property.test.ts` - Properties 1, 2, 3
- `session-progress.property.test.ts` - Property 4
- `progress-tracking.property.test.ts` - Properties 5, 6
- `assessment.property.test.ts` - Properties 7, 8, 9
- `gamification.property.test.ts` - Properties 10, 11
- `recommendations.property.test.ts` - Properties 12, 13
- `trainer-dashboard.property.test.ts` - Properties 14, 15
- `activity-library.property.test.ts` - Properties 16, 17, 18
- `parent-engagement.property.test.ts` - Properties 19, 20
- `offline-sync.property.test.ts` - Property 21
- `serialization.property.test.ts` - Properties 22, 23

**Test Annotation Format:**
```typescript
// **Feature: vita-workshop, Property 1: Content Module Field Completeness**
// **Validates: Requirements 1.1, 11.2**
```

### Integration Testing

Integration tests will verify:
- API endpoint responses
- Database operations
- Cross-service interactions
- Notification delivery

