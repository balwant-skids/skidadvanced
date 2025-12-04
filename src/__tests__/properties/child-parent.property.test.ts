/**
 * Property-Based Tests for Child-Parent Ownership
 * 
 * Feature: backend-integration, Property 5: Child-Parent Ownership
 * Validates: Requirements 5.1
 * 
 * For any child profile, the child SHALL belong to exactly one parent profile.
 */

import * as fc from 'fast-check';

// Types for child-parent relationship testing
interface Child {
  id: string;
  name: string;
  dateOfBirth: Date;
  parentId: string;
}

interface Parent {
  id: string;
  userId: string;
  clinicId: string;
}

// Simulated data store
class ChildParentStore {
  private children: Map<string, Child> = new Map();
  private parents: Map<string, Parent> = new Map();

  addParent(parent: Parent): void {
    this.parents.set(parent.id, parent);
  }

  addChild(child: Child): { success: boolean; error?: string } {
    // Validate parent exists
    if (!this.parents.has(child.parentId)) {
      return { success: false, error: 'Parent not found' };
    }
    
    // Validate child doesn't already exist
    if (this.children.has(child.id)) {
      return { success: false, error: 'Child already exists' };
    }
    
    this.children.set(child.id, child);
    return { success: true };
  }

  getChild(childId: string): Child | undefined {
    return this.children.get(childId);
  }

  getChildrenByParent(parentId: string): Child[] {
    return Array.from(this.children.values()).filter(c => c.parentId === parentId);
  }

  getParent(parentId: string): Parent | undefined {
    return this.parents.get(parentId);
  }

  getChildParent(childId: string): Parent | undefined {
    const child = this.children.get(childId);
    if (!child) return undefined;
    return this.parents.get(child.parentId);
  }

  clear(): void {
    this.children.clear();
    this.parents.clear();
  }
}

// Arbitraries for generating test data
const parentArbitrary = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  clinicId: fc.uuid(),
});

const childArbitrary = (parentId: string) => fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  dateOfBirth: fc.date({ min: new Date('2010-01-01'), max: new Date('2024-01-01') }),
  parentId: fc.constant(parentId),
});

describe('Child-Parent Ownership Properties', () => {
  let store: ChildParentStore;

  beforeEach(() => {
    store = new ChildParentStore();
  });

  /**
   * Feature: backend-integration, Property 5: Child-Parent Ownership
   * Validates: Requirements 5.1
   * 
   * Every child must belong to exactly one parent
   */
  it('should ensure every child belongs to exactly one parent', () => {
    fc.assert(
      fc.property(parentArbitrary, (parent) => {
        store.clear();
        store.addParent(parent);
        
        // Generate and add multiple children for this parent
        const childCount = Math.floor(Math.random() * 5) + 1;
        const children: Child[] = [];
        
        for (let i = 0; i < childCount; i++) {
          const child: Child = {
            id: `child-${i}-${Date.now()}`,
            name: `Child ${i}`,
            dateOfBirth: new Date('2020-01-01'),
            parentId: parent.id,
          };
          store.addChild(child);
          children.push(child);
        }
        
        // Verify each child belongs to exactly one parent
        for (const child of children) {
          const childParent = store.getChildParent(child.id);
          expect(childParent).toBeDefined();
          expect(childParent?.id).toBe(parent.id);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 5: Child-Parent Ownership
   * Validates: Requirements 5.1
   * 
   * A child cannot be created without a valid parent
   */
  it('should reject child creation without valid parent', () => {
    fc.assert(
      fc.property(fc.uuid(), fc.string({ minLength: 1 }), (fakeParentId, childName) => {
        store.clear();
        // Don't add any parent
        
        const child: Child = {
          id: `child-${Date.now()}`,
          name: childName,
          dateOfBirth: new Date('2020-01-01'),
          parentId: fakeParentId,
        };
        
        const result = store.addChild(child);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Parent not found');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 5: Child-Parent Ownership
   * Validates: Requirements 5.1
   * 
   * Parent's children list should be consistent with child's parent reference
   */
  it('should maintain bidirectional consistency', () => {
    fc.assert(
      fc.property(
        fc.array(parentArbitrary, { minLength: 1, maxLength: 5 }),
        (parents) => {
          store.clear();
          
          // Add all parents
          for (const parent of parents) {
            store.addParent(parent);
          }
          
          // Add children to random parents
          const allChildren: Child[] = [];
          for (const parent of parents) {
            const childCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < childCount; i++) {
              const child: Child = {
                id: `child-${parent.id}-${i}`,
                name: `Child ${i}`,
                dateOfBirth: new Date('2020-01-01'),
                parentId: parent.id,
              };
              store.addChild(child);
              allChildren.push(child);
            }
          }
          
          // Verify bidirectional consistency
          for (const parent of parents) {
            const parentChildren = store.getChildrenByParent(parent.id);
            
            for (const child of parentChildren) {
              // Child's parent reference should point back to this parent
              expect(child.parentId).toBe(parent.id);
              
              // Getting parent from child should return same parent
              const childParent = store.getChildParent(child.id);
              expect(childParent?.id).toBe(parent.id);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 5: Child-Parent Ownership
   * Validates: Requirements 5.1
   * 
   * Child IDs must be unique across all parents
   */
  it('should enforce unique child IDs', () => {
    fc.assert(
      fc.property(
        parentArbitrary,
        parentArbitrary,
        (parent1, parent2) => {
          store.clear();
          store.addParent(parent1);
          store.addParent(parent2);
          
          const sharedChildId = 'shared-child-id';
          
          // Add child to first parent
          const child1: Child = {
            id: sharedChildId,
            name: 'Child 1',
            dateOfBirth: new Date('2020-01-01'),
            parentId: parent1.id,
          };
          const result1 = store.addChild(child1);
          expect(result1.success).toBe(true);
          
          // Attempt to add child with same ID to second parent
          const child2: Child = {
            id: sharedChildId,
            name: 'Child 2',
            dateOfBirth: new Date('2021-01-01'),
            parentId: parent2.id,
          };
          const result2 = store.addChild(child2);
          expect(result2.success).toBe(false);
          expect(result2.error).toBe('Child already exists');
          
          // Original child should still belong to first parent
          const storedChild = store.getChild(sharedChildId);
          expect(storedChild?.parentId).toBe(parent1.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
