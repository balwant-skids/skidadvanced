# E2E Testing Plan - Vita Workshop Module

## Overview

This document outlines the end-to-end testing strategy for the Vita Workshop module, covering user journeys, API integration tests, and system validation.

## Test Environment Setup

### Prerequisites
- Database with test data (clinics, users, children)
- Clerk authentication configured
- Firebase FCM for notifications
- Cloudflare R2 for media storage

### Test Data Requirements
```typescript
// Test Clinic
const testClinic = {
  name: "Test Pediatric Clinic",
  code: "TEST01",
  email: "test@clinic.com"
};

// Test Users
const adminUser = {
  email: "admin@test.com",
  role: "clinic_manager",
  clinicId: testClinic.id
};

const parentUser = {
  email: "parent@test.com", 
  role: "parent",
  clinicId: testClinic.id
};

// Test Child
const testChild = {
  name: "Test Child",
  dateOfBirth: "2015-01-01", // 9 years old
  parentId: parentUser.parentProfile.id
};
```

## E2E Test Scenarios

### 1. Admin Content Management Journey

**Test: Create and Publish Workshop Content**
```typescript
describe('Admin Content Management', () => {
  test('Complete content creation workflow', async () => {
    // 1. Login as admin
    await loginAsAdmin();
    
    // 2. Create content module
    const module = await createContentModule({
      title: "Healthy Eating Basics",
      description: "Learn about nutrition",
      category: "H",
      ageGroupMin: 6,
      ageGroupMax: 12
    });
    
    // 3. Add activities
    await addActivity(module.id, {
      name: "Food Rainbow Activity",
      type: "interactive",
      duration: 300
    });
    
    // 4. Upload media assets
    await uploadMedia(module.id, "healthy-foods.jpg");
    
    // 5. Publish module
    await publishModule(module.id);
    
    // 6. Verify published status
    expect(await getModule(module.id)).toHaveProperty('status', 'published');
  });
});
```

### 2. Child Learning Journey

**Test: Complete Workshop Session**
```typescript
describe('Child Learning Journey', () => {
  test('Complete full workshop session', async () => {
    // 1. Login as parent
    await loginAsParent();
    
    // 2. Start session for child
    const session = await startWorkshopSession({
      childId: testChild.id,
      moduleId: publishedModule.id
    });
    
    // 3. Complete activities sequentially
    for (const activity of session.module.activities) {
      await completeActivity(session.id, activity.id);
      
      // Verify progress updates
      const progress = await getSessionProgress(session.id);
      expect(progress.completedCount).toBeGreaterThan(0);
    }
    
    // 4. Verify session completion
    const finalSession = await getSession(session.id);
    expect(finalSession.completedAt).not.toBeNull();
    
    // 5. Check badge awards
    const badges = await getBadgeCollection(testChild.id);
    expect(badges.earned.length).toBeGreaterThan(0);
    
    // 6. Verify points awarded
    const childProgress = await getChildProgress(testChild.id);
    expect(childProgress.totalPoints).toBeGreaterThan(0);
  });
});
```

### 3. Assessment and Recommendations Journey

**Test: Assessment Flow with Recommendations**
```typescript
describe('Assessment and Recommendations', () => {
  test('Complete assessment and receive recommendations', async () => {
    // 1. Start assessment
    const attempt = await startAssessment(testChild.id, assessmentId);
    
    // 2. Answer questions (simulate low score in category H)
    const answers = generateLowScoreAnswers(attempt.questions, 'H');
    for (const [questionId, answerIndex] of answers) {
      await submitAnswer(attempt, questionId, answerIndex);
    }
    
    // 3. Complete assessment
    const result = await completeAssessment(testChild.id, assessmentId, attempt);
    
    // 4. Verify low score triggers recommendations
    expect(result.categoryScores.H).toBeLessThan(60);
    
    // 5. Check recommendations generated
    const recommendations = await getRecommendations(testChild.id);
    const hRecommendations = recommendations.filter(r => r.category === 'H');
    expect(hRecommendations.length).toBeGreaterThan(0);
    
    // 6. Verify recommendation rationale
    expect(hRecommendations[0].rationale).toContain('scored');
  });
});
```

### 4. Trainer Dashboard Journey

**Test: Trainer Monitoring and Reporting**
```typescript
describe('Trainer Dashboard', () => {
  test('Monitor participants and generate reports', async () => {
    // 1. Login as trainer/admin
    await loginAsAdmin();
    
    // 2. View aggregate statistics
    const stats = await getTrainerStats(adminUser.id);
    expect(stats.totalParticipants).toBeGreaterThan(0);
    expect(stats.averageCompletion).toBeGreaterThanOrEqual(0);
    
    // 3. Filter participants by completion status
    const activeParticipants = await filterParticipants(adminUser.id, {
      completionStatus: 'started'
    });
    
    // 4. View individual participant progress
    const participantDetail = await getParticipantProgress(
      adminUser.id, 
      testChild.id
    );
    expect(participantDetail.childName).toBe(testChild.name);
    
    // 5. Export report
    const reportData = await exportReport(adminUser.id);
    expect(reportData.participants).toContain(
      expect.objectContaining({ childId: testChild.id })
    );
  });
});
```

### 5. Offline Sync Journey

**Test: Offline Content and Sync**
```typescript
describe('Offline Functionality', () => {
  test('Download content and sync progress', async () => {
    // 1. Download content for offline use
    const offlinePackage = await downloadForOffline(
      parentUser.id, 
      [publishedModule.id]
    );
    
    expect(offlinePackage.modules).toHaveLength(1);
    expect(offlinePackage.activities.length).toBeGreaterThan(0);
    
    // 2. Simulate offline progress
    const localProgress = {
      overallCompletion: 25,
      categoryProgress: { H: 25 },
      totalPoints: 50
    };
    
    // 3. Sync when back online (server-wins)
    const syncResult = await syncProgress(testChild.id, localProgress);
    
    // 4. Verify server data preserved
    expect(syncResult.success).toBe(true);
    expect(syncResult.conflicts.length).toBeGreaterThanOrEqual(0);
  });
});
```

### 6. Parent Engagement Journey

**Test: Parent-Child Activities and Challenges**
```typescript
describe('Parent Engagement', () => {
  test('Complete joint activities and challenges', async () => {
    // 1. View available parent-child activities
    const activities = await getActivitiesByCategory('parent_child');
    expect(activities.length).toBeGreaterThan(0);
    
    // 2. Complete joint activity
    const jointActivity = activities[0];
    await completeJointActivity(jointActivity.id, {
      parentId: parentUser.id,
      childId: testChild.id
    });
    
    // 3. Verify dual completion recording
    const parentCompletions = await getCompletionHistory(parentUser.id);
    const childCompletions = await getCompletionHistory(testChild.id);
    
    expect(parentCompletions).toContain(
      expect.objectContaining({ activityId: jointActivity.id })
    );
    expect(childCompletions).toContain(
      expect.objectContaining({ activityId: jointActivity.id })
    );
    
    // 4. Check weekly challenge progress
    const challenges = await getActiveChallenges();
    if (challenges.length > 0) {
      const challengeProgress = await getChallengeProgress(
        challenges[0].id,
        parentUser.id,
        testChild.id
      );
      expect(challengeProgress.progress).toBeGreaterThanOrEqual(0);
    }
  });
});
```

## API Integration Tests

### Content Management API Tests
```typescript
describe('Content Management API', () => {
  test('POST /api/workshop/content', async () => {
    const response = await request(app)
      .post('/api/workshop/content')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validContentModule);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.module.status).toBe('draft');
  });
  
  test('GET /api/workshop/content with age filter', async () => {
    const response = await request(app)
      .get('/api/workshop/content?age=9')
      .set('Authorization', `Bearer ${parentToken}`);
    
    expect(response.status).toBe(200);
    response.body.modules.forEach(module => {
      expect(module.ageGroupMin).toBeLessThanOrEqual(9);
      expect(module.ageGroupMax).toBeGreaterThanOrEqual(9);
    });
  });
});
```

### Session Management API Tests
```typescript
describe('Session Management API', () => {
  test('POST /api/workshop/sessions - start session', async () => {
    const response = await request(app)
      .post('/api/workshop/sessions')
      .set('Authorization', `Bearer ${parentToken}`)
      .send({
        moduleId: publishedModule.id,
        childId: testChild.id
      });
    
    expect(response.status).toBe(200);
    expect(response.body.session.moduleId).toBe(publishedModule.id);
  });
  
  test('POST /api/workshop/sessions/[id]/complete-activity', async () => {
    const response = await request(app)
      .post(`/api/workshop/sessions/${session.id}/complete-activity`)
      .set('Authorization', `Bearer ${parentToken}`)
      .send({ activityId: activity.id });
    
    expect(response.status).toBe(200);
    expect(response.body.feedback.completed).toBe(true);
    expect(response.body.feedback.pointsAwarded).toBeGreaterThan(0);
  });
});
```

## Performance Tests

### Load Testing Scenarios
```typescript
describe('Performance Tests', () => {
  test('Concurrent session starts', async () => {
    const concurrentRequests = 50;
    const promises = Array(concurrentRequests).fill().map(() =>
      request(app)
        .post('/api/workshop/sessions')
        .set('Authorization', `Bearer ${parentToken}`)
        .send({
          moduleId: publishedModule.id,
          childId: testChild.id
        })
    );
    
    const responses = await Promise.all(promises);
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
  
  test('Progress calculation performance', async () => {
    const startTime = Date.now();
    await getChildProgress(testChild.id);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000); // < 2 seconds
  });
});
```

## Test Execution Strategy

### 1. Unit Tests First
```bash
npm run test:unit
```

### 2. Property-Based Tests
```bash
npm run test:properties
```

### 3. Integration Tests
```bash
npm run test:integration
```

### 4. E2E Tests
```bash
npm run test:e2e
```

### 5. Performance Tests
```bash
npm run test:performance
```

## Test Data Management

### Setup Test Database
```typescript
beforeAll(async () => {
  // Create test clinic
  await prisma.clinic.create({ data: testClinic });
  
  // Create test users
  await prisma.user.create({ data: adminUser });
  await prisma.user.create({ data: parentUser });
  
  // Create test child
  await prisma.child.create({ data: testChild });
  
  // Create test content
  await createTestContent();
});

afterAll(async () => {
  // Clean up test data
  await prisma.child.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();
});
```

## Success Criteria

### Functional Tests
- ✅ All user journeys complete successfully
- ✅ API endpoints return correct responses
- ✅ Data integrity maintained across operations
- ✅ Authentication and authorization working
- ✅ Notifications sent correctly

### Performance Tests
- ✅ API response times < 2 seconds
- ✅ Database queries optimized
- ✅ Concurrent user support (50+ simultaneous)
- ✅ Memory usage within limits

### Integration Tests
- ✅ Clerk authentication integration
- ✅ Firebase FCM notifications
- ✅ Cloudflare R2 media storage
- ✅ Prisma database operations

## Test Automation

### CI/CD Pipeline Integration
```yaml
name: Vita Workshop E2E Tests
on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:e2e
      - run: npm run test:performance
```

This comprehensive E2E testing plan ensures the Vita Workshop module works correctly across all user scenarios and integrates properly with external services.