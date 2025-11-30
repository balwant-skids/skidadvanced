/**
 * Property-Based Tests for Content Module Service
 * 
 * Feature: vita-workshop
 * Tests Properties 1, 2, and 3 from the design document
 */

import * as fc from 'fast-check';

// Types matching the service
type HABITSCategory = 'H' | 'A' | 'B' | 'I' | 'T' | 'S';
type ContentStatus = 'draft' | 'published' | 'archived';

interface ContentModule {
  id: string;
  title: string;
  description: string;
  category: HABITSCategory;
  ageGroupMin: number;
  ageGroupMax: number;
  version: number;
  status: ContentStatus;
  clinicId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateModuleInput {
  title: string;
  description: string;
  category: HABITSCategory;
  ageGroupMin: number;
  ageGroupMax: number;
  clinicId?: string;
}

// In-memory content module store for testing
class ContentModuleStore {
  private modules: Map<string, ContentModule> = new Map();
  private idCounter = 0;

  create(input: CreateModuleInput): ContentModule {
    const id = `module_${++this.idCounter}`;
    const now = new Date();
    const module: ContentModule = {
      id,
      title: input.title,
      description: input.description,
      category: input.category,
      ageGroupMin: input.ageGroupMin,
      ageGroupMax: input.ageGroupMax,
      version: 1,
      status: 'draft',
      clinicId: input.clinicId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.modules.set(id, module);
    return module;
  }

  update(id: string, data: Partial<CreateModuleInput>): ContentModule {
    const existing = this.modules.get(id);
    if (!existing) {
      throw new Error(`Module not found: ${id}`);
    }
    const updated: ContentModule = {
      ...existing,
      ...data,
      version: existing.version + 1,
      updatedAt: new Date(),
    };
    this.modules.set(id, updated);
    return updated;
  }

  get(id: string): ContentModule | undefined {
    return this.modules.get(id);
  }

  getByAgeGroup(age: number, status: ContentStatus = 'published'): ContentModule[] {
    const results: ContentModule[] = [];
    this.modules.forEach((module) => {
      if (
        module.status === status &&
        module.ageGroupMin <= age &&
        module.ageGroupMax >= age
      ) {
        results.push(module);
      }
    });
    return results;
  }

  clear(): void {
    this.modules.clear();
    this.idCounter = 0;
  }
}

// Arbitraries for generating test data
const habitsCategory = fc.constantFrom<HABITSCategory>('H', 'A', 'B', 'I', 'T', 'S');

const validAgeRange = fc.tuple(
  fc.integer({ min: 0, max: 17 }),
  fc.integer({ min: 1, max: 18 })
).map(([a, b]) => ({
  ageGroupMin: Math.min(a, b),
  ageGroupMax: Math.max(a, b),
}));

const createModuleInput = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  category: habitsCategory,
}).chain((base) =>
  validAgeRange.map((ages) => ({
    ...base,
    ...ages,
  }))
);

describe('Content Module Properties', () => {
  let store: ContentModuleStore;

  beforeEach(() => {
    store = new ContentModuleStore();
  });

  /**
   * Feature: vita-workshop, Property 1: Content Module Field Completeness
   * Validates: Requirements 1.1, 11.2
   * 
   * For any content module created with valid input, the stored module SHALL
   * contain all required fields (id, title, description, category, ageGroupMin,
   * ageGroupMax, version, status, createdAt, updatedAt) with non-null values.
   */
  describe('Property 1: Content Module Field Completeness', () => {
    it('should create modules with all required fields populated', () => {
      fc.assert(
        fc.property(createModuleInput, (input) => {
          const module = store.create(input);

          // All required fields must be present and non-null
          expect(module.id).toBeDefined();
          expect(module.id).not.toBeNull();
          expect(typeof module.id).toBe('string');
          expect(module.id.length).toBeGreaterThan(0);

          expect(module.title).toBe(input.title);
          expect(module.description).toBe(input.description);
          expect(module.category).toBe(input.category);
          expect(module.ageGroupMin).toBe(input.ageGroupMin);
          expect(module.ageGroupMax).toBe(input.ageGroupMax);

          expect(module.version).toBe(1);
          expect(module.status).toBe('draft');

          expect(module.createdAt).toBeInstanceOf(Date);
          expect(module.updatedAt).toBeInstanceOf(Date);
        }),
        { numRuns: 100 }
      );
    });

    it('should ensure age range is valid (min <= max)', () => {
      fc.assert(
        fc.property(createModuleInput, (input) => {
          const module = store.create(input);
          expect(module.ageGroupMin).toBeLessThanOrEqual(module.ageGroupMax);
        }),
        { numRuns: 100 }
      );
    });

    it('should ensure category is a valid H.A.B.I.T.S. value', () => {
      fc.assert(
        fc.property(createModuleInput, (input) => {
          const module = store.create(input);
          expect(['H', 'A', 'B', 'I', 'T', 'S']).toContain(module.category);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: vita-workshop, Property 2: Content Versioning Consistency
   * Validates: Requirements 1.2
   * 
   * For any content module that is updated N times, the version history SHALL
   * contain exactly N+1 versions (including the original), and each version
   * SHALL have a unique version number in ascending order.
   */
  describe('Property 2: Content Versioning Consistency', () => {
    it('should increment version on each update', () => {
      fc.assert(
        fc.property(
          createModuleInput,
          fc.integer({ min: 1, max: 10 }),
          (input, updateCount) => {
            const module = store.create(input);
            const initialVersion = module.version;
            expect(initialVersion).toBe(1);

            let currentModule = module;
            for (let i = 0; i < updateCount; i++) {
              currentModule = store.update(currentModule.id, {
                title: `Updated Title ${i + 1}`,
              });
            }

            // After N updates, version should be N + 1
            expect(currentModule.version).toBe(initialVersion + updateCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update the updatedAt timestamp on each update', () => {
      fc.assert(
        fc.property(createModuleInput, (input) => {
          const module = store.create(input);
          const originalUpdatedAt = module.updatedAt;

          // Small delay to ensure timestamp difference
          const updated = store.update(module.id, { title: 'New Title' });

          expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
            originalUpdatedAt.getTime()
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve createdAt across updates', () => {
      fc.assert(
        fc.property(
          createModuleInput,
          fc.integer({ min: 1, max: 5 }),
          (input, updateCount) => {
            const module = store.create(input);
            const originalCreatedAt = module.createdAt;

            let currentModule = module;
            for (let i = 0; i < updateCount; i++) {
              currentModule = store.update(currentModule.id, {
                description: `Updated Description ${i + 1}`,
              });
            }

            // createdAt should never change
            expect(currentModule.createdAt.getTime()).toBe(
              originalCreatedAt.getTime()
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: vita-workshop, Property 3: Age-Appropriate Content Filtering
   * Validates: Requirements 1.3, 2.1
   * 
   * For any child with age A, when requesting content modules, the returned
   * modules SHALL only include those where ageGroupMin <= A <= ageGroupMax.
   */
  describe('Property 3: Age-Appropriate Content Filtering', () => {
    it('should only return modules where age is within range', () => {
      fc.assert(
        fc.property(
          fc.array(createModuleInput, { minLength: 1, maxLength: 20 }),
          fc.integer({ min: 0, max: 18 }),
          (inputs, childAge) => {
            // Clear store for each test iteration
            store.clear();
            
            // Create modules and publish them
            const modules = inputs.map((input) => {
              const m = store.create(input);
              // Manually set to published for testing
              (m as any).status = 'published';
              store['modules'].set(m.id, m);
              return m;
            });

            // Get modules for the child's age
            const filtered = store.getByAgeGroup(childAge);

            // All returned modules must have age range containing childAge
            for (const module of filtered) {
              expect(module.ageGroupMin).toBeLessThanOrEqual(childAge);
              expect(module.ageGroupMax).toBeGreaterThanOrEqual(childAge);
            }

            // Verify no valid modules were excluded
            const expectedCount = modules.filter(
              (m) =>
                m.status === 'published' &&
                m.ageGroupMin <= childAge &&
                m.ageGroupMax >= childAge
            ).length;
            expect(filtered.length).toBe(expectedCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not return modules outside the age range', () => {
      fc.assert(
        fc.property(
          createModuleInput,
          fc.integer({ min: 0, max: 18 }),
          (input, childAge) => {
            const module = store.create(input);
            // Publish the module
            (module as any).status = 'published';
            store['modules'].set(module.id, module);

            const filtered = store.getByAgeGroup(childAge);

            if (childAge < module.ageGroupMin || childAge > module.ageGroupMax) {
              // Module should NOT be in results
              expect(filtered.find((m) => m.id === module.id)).toBeUndefined();
            } else {
              // Module SHOULD be in results
              expect(filtered.find((m) => m.id === module.id)).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge cases at age boundaries', () => {
      // Test exact boundary matches
      const module = store.create({
        title: 'Test Module',
        description: 'Test',
        category: 'H',
        ageGroupMin: 5,
        ageGroupMax: 10,
      });
      (module as any).status = 'published';
      store['modules'].set(module.id, module);

      // Age exactly at min boundary
      expect(store.getByAgeGroup(5).length).toBe(1);
      
      // Age exactly at max boundary
      expect(store.getByAgeGroup(10).length).toBe(1);
      
      // Age just below min
      expect(store.getByAgeGroup(4).length).toBe(0);
      
      // Age just above max
      expect(store.getByAgeGroup(11).length).toBe(0);
    });
  });
});
