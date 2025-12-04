/**
 * Property-Based Tests for Session Progress Persistence
 *
 * Feature: vita-workshop, Property 4: Session Progress Persistence
 * Validates: Requirements 2.5
 */

import * as fc from 'fast-check';

// Types
interface Activity {
  id: string;
  name: string;
  points: number;
}

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

interface ContentModule {
  id: string;
  title: string;
  activities: Activity[];
}

// In-memory session store for testing
class SessionStore {
  private sessions: Map<string, WorkshopSession> = new Map();
  private modules: Map<string, ContentModule> = new Map();
  private idCounter: number;

  constructor() {
    this.idCounter = 0;
  }

  addModule(module: ContentModule): void {
    this.modules.set(module.id, module);
  }

  startSession(childId: string, moduleId: string): WorkshopSession {
    const key = `${moduleId}_${childId}`;
    const existing = this.sessions.get(key);

    if (existing) {
      existing.lastAccessedAt = new Date();
      return existing;
    }

    const sessionId = `session_${++this.idCounter}`;
    const session: WorkshopSession = {
      id: sessionId,
      moduleId,
      childId,
      currentActivityIndex: 0,
      completedActivities: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completedAt: null,
    };

    // Store by both composite key and session ID for lookup
    this.sessions.set(key, session);
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): WorkshopSession | undefined {
    return this.sessions.get(sessionId);
  }

  completeActivity(sessionId: string, activityId: string): WorkshopSession {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const module = this.modules.get(session.moduleId);
    if (!module) {
      throw new Error(`Module not found: ${session.moduleId}`);
    }

    // Check if already completed
    if (session.completedActivities.includes(activityId)) {
      return session;
    }

    // Add to completed
    session.completedActivities.push(activityId);

    // Update current index
    const activityIds = module.activities.map((a) => a.id);
    const currentIndex = activityIds.indexOf(activityId);
    session.currentActivityIndex = Math.min(
      currentIndex + 1,
      module.activities.length - 1
    );

    // Check if all completed
    if (session.completedActivities.length >= module.activities.length) {
      session.completedAt = new Date();
    }

    session.lastAccessedAt = new Date();
    return session;
  }

  resumeSession(sessionId: string): WorkshopSession {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Simulate resume - return session state as-is
    return { ...session };
  }

  clear(): void {
    this.sessions.clear();
    this.modules.clear();
    this.idCounter = 0;
  }
}

// Arbitraries
const activityArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  points: fc.integer({ min: 1, max: 100 }),
});

const moduleArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
}).chain((base) =>
  fc.array(activityArb, { minLength: 1, maxLength: 10 }).map((activities) => ({
    ...base,
    activities,
  }))
);

describe('Session Progress Properties', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  /**
   * Feature: vita-workshop, Property 4: Session Progress Persistence
   * Validates: Requirements 2.5
   *
   * For any workshop session where a child exits after completing K activities,
   * when the session is resumed, the currentActivityIndex SHALL equal K and
   * completedActivities SHALL contain exactly K activity IDs.
   */
  describe('Property 4: Session Progress Persistence', () => {
    it('should persist completed activities count after resume', () => {
      fc.assert(
        fc.property(
          moduleArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 0, max: 9 }),
          (module, childId, activitiesToComplete) => {
            // Create fresh store for each iteration
            const testStore = new SessionStore();
            testStore.addModule(module);

            // Start session
            const session = testStore.startSession(childId, module.id);

            // Complete K activities (bounded by actual activity count)
            const K = Math.min(activitiesToComplete, module.activities.length);
            for (let i = 0; i < K; i++) {
              testStore.completeActivity(session.id, module.activities[i].id);
            }

            // "Exit" and resume session
            const resumed = testStore.resumeSession(session.id);

            // Verify completedActivities contains exactly K activity IDs
            expect(resumed.completedActivities.length).toBe(K);

            // Verify currentActivityIndex equals K (or last index if all completed)
            if (K < module.activities.length) {
              expect(resumed.currentActivityIndex).toBe(K);
            } else {
              // When all activities are completed, index stays at last
              expect(resumed.currentActivityIndex).toBe(module.activities.length - 1);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve exact activity IDs after resume', () => {
      fc.assert(
        fc.property(
          moduleArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 1, max: 5 }),
          (module, childId, activitiesToComplete) => {
            const testStore = new SessionStore();
            testStore.addModule(module);

            const session = testStore.startSession(childId, module.id);
            const K = Math.min(activitiesToComplete, module.activities.length);

            // Track which activities we complete
            const completedIds: string[] = [];
            for (let i = 0; i < K; i++) {
              const activityId = module.activities[i].id;
              testStore.completeActivity(session.id, activityId);
              completedIds.push(activityId);
            }

            // Resume and verify exact IDs
            const resumed = testStore.resumeSession(session.id);

            expect(resumed.completedActivities).toEqual(completedIds);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not lose progress on multiple resumes', () => {
      fc.assert(
        fc.property(
          moduleArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 1, max: 5 }),
          fc.integer({ min: 1, max: 5 }),
          (module, childId, firstBatch, resumeCount) => {
            const testStore = new SessionStore();
            testStore.addModule(module);

            const session = testStore.startSession(childId, module.id);
            const K = Math.min(firstBatch, module.activities.length);

            // Complete K activities
            for (let i = 0; i < K; i++) {
              testStore.completeActivity(session.id, module.activities[i].id);
            }

            // Resume multiple times
            let lastResumed = session;
            for (let r = 0; r < resumeCount; r++) {
              lastResumed = testStore.resumeSession(session.id);
            }

            // Progress should be preserved through all resumes
            expect(lastResumed.completedActivities.length).toBe(K);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should mark session as completed when all activities are done', () => {
      fc.assert(
        fc.property(moduleArb, fc.string({ minLength: 1, maxLength: 20 }), (module, childId) => {
          const testStore = new SessionStore();
          testStore.addModule(module);

          const session = testStore.startSession(childId, module.id);

          // Complete all activities
          for (const activity of module.activities) {
            testStore.completeActivity(session.id, activity.id);
          }

          const resumed = testStore.resumeSession(session.id);

          // Session should be marked as completed
          expect(resumed.completedAt).not.toBeNull();
          expect(resumed.completedActivities.length).toBe(module.activities.length);
        }),
        { numRuns: 100 }
      );
    });

    it('should not mark session as completed when activities remain', () => {
      fc.assert(
        fc.property(
          moduleArb.filter((m) => m.activities.length > 1),
          fc.string({ minLength: 1, maxLength: 20 }),
          (module, childId) => {
            const testStore = new SessionStore();
            testStore.addModule(module);

            const session = testStore.startSession(childId, module.id);

            // Complete all but one activity
            for (let i = 0; i < module.activities.length - 1; i++) {
              testStore.completeActivity(session.id, module.activities[i].id);
            }

            const resumed = testStore.resumeSession(session.id);

            // Session should NOT be marked as completed
            expect(resumed.completedAt).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle completing same activity multiple times idempotently', () => {
      fc.assert(
        fc.property(
          moduleArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 1, max: 5 }),
          (module, childId, repeatCount) => {
            const testStore = new SessionStore();
            testStore.addModule(module);

            const session = testStore.startSession(childId, module.id);
            const activityId = module.activities[0].id;

            // Complete same activity multiple times
            for (let i = 0; i < repeatCount; i++) {
              testStore.completeActivity(session.id, activityId);
            }

            const resumed = testStore.resumeSession(session.id);

            // Should only count as one completion
            expect(resumed.completedActivities.filter((id) => id === activityId).length).toBe(1);
            expect(resumed.completedActivities.length).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
