/**
 * Property-Based Tests for Offline Data Sync
 * 
 * Feature: backend-integration, Property 7: Offline Data Freshness
 * Validates: Requirements 10.1, 10.3
 * 
 * For any cached data in IndexedDB, the data SHALL be synchronized 
 * with the server within 6 hours of the last online connection.
 */

import * as fc from 'fast-check';

// Types for offline sync testing
interface CachedData {
  id: string;
  data: Record<string, unknown>;
  cachedAt: Date;
  syncedAt: Date | null;
}

interface SyncQueueItem {
  id: number;
  entity: string;
  entityId?: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  createdAt: Date;
  retryCount: number;
}

interface SyncMetadata {
  lastSyncAt: Date | null;
  lastOnlineAt: Date | null;
}

// Factory function to create fresh service instances
function createOfflineSyncService() {
  const cache = new Map<string, CachedData>();
  const syncQueue: SyncQueueItem[] = [];
  let metadata: SyncMetadata = { lastSyncAt: null, lastOnlineAt: null };
  let isOnline = true;
  let nextQueueId = 1;

  return {
    setOnlineStatus(online: boolean): void {
      isOnline = online;
      if (online) {
        metadata.lastOnlineAt = new Date();
      }
    },

    getOnlineStatus(): boolean {
      return isOnline;
    },

    saveToCache(key: string, data: Record<string, unknown>): void {
      const now = new Date();
      cache.set(key, {
        id: key,
        data,
        cachedAt: now,
        syncedAt: isOnline ? now : null,
      });
    },

    getFromCache(key: string): CachedData | undefined {
      return cache.get(key);
    },

    getAllCached(): CachedData[] {
      return Array.from(cache.values());
    },

    addToSyncQueue(
      entity: string,
      action: 'create' | 'update' | 'delete',
      data: Record<string, unknown>,
      entityId?: string
    ): number {
      const item: SyncQueueItem = {
        id: nextQueueId++,
        entity,
        entityId,
        action,
        data,
        createdAt: new Date(),
        retryCount: 0,
      };
      syncQueue.push(item);
      return item.id;
    },

    getPendingOperations(): SyncQueueItem[] {
      return [...syncQueue];
    },

    removeSyncOperation(id: number): boolean {
      const index = syncQueue.findIndex(item => item.id === id);
      if (index !== -1) {
        syncQueue.splice(index, 1);
        return true;
      }
      return false;
    },

    async syncFromServer(): Promise<{ success: boolean; itemsSynced: number }> {
      if (!isOnline) {
        return { success: false, itemsSynced: 0 };
      }

      const now = new Date();
      let itemsSynced = 0;
      const entries = Array.from(cache.entries());

      for (let i = 0; i < entries.length; i++) {
        const [, item] = entries[i];
        item.syncedAt = now;
        itemsSynced++;
      }

      metadata.lastSyncAt = now;
      return { success: true, itemsSynced };
    },

    async processSyncQueue(): Promise<{
      processed: number;
      failed: number;
      errors: string[];
    }> {
      if (!isOnline) {
        return { processed: 0, failed: 0, errors: ['Offline'] };
      }

      const results = { processed: 0, failed: 0, errors: [] as string[] };
      const maxRetries = 3;
      const toRemove: number[] = [];

      for (const item of syncQueue) {
        if (item.retryCount >= maxRetries) {
          results.failed++;
          results.errors.push(`Item ${item.id} exceeded max retries`);
          continue;
        }
        toRemove.push(item.id);
        results.processed++;
      }

      for (const id of toRemove) {
        const index = syncQueue.findIndex(item => item.id === id);
        if (index !== -1) syncQueue.splice(index, 1);
      }

      return results;
    },

    isDataFresh(maxAgeHours: number = 6): boolean {
      const now = new Date();
      const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
      const items = Array.from(cache.values());

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.syncedAt) return false;
        const age = now.getTime() - item.syncedAt.getTime();
        if (age > maxAgeMs) return false;
      }
      return true;
    },

    getStaleItems(maxAgeHours: number = 6): CachedData[] {
      const now = new Date();
      const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
      const stale: CachedData[] = [];
      const items = Array.from(cache.values());

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.syncedAt) {
          stale.push(item);
          continue;
        }
        const age = now.getTime() - item.syncedAt.getTime();
        if (age > maxAgeMs) stale.push(item);
      }
      return stale;
    },
  };
}

// Arbitraries for generating test data
const dataArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  value: fc.integer(),
});

describe('Offline Sync Properties', () => {
  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.1, 10.3
   * 
   * Data synced while online should be marked as fresh
   */
  it('should mark data as fresh when synced online', () => {
    fc.assert(
      fc.property(fc.uuid(), dataArbitrary, (key, data) => {
        const service = createOfflineSyncService();
        service.setOnlineStatus(true);
        service.saveToCache(key, data);
        
        const cached = service.getFromCache(key);
        expect(cached).toBeDefined();
        expect(cached?.syncedAt).not.toBeNull();
        expect(service.isDataFresh()).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.1, 10.3
   * 
   * Data cached while offline should be marked as not synced
   */
  it('should mark data as not synced when cached offline', () => {
    fc.assert(
      fc.property(fc.uuid(), dataArbitrary, (key, data) => {
        const service = createOfflineSyncService();
        service.setOnlineStatus(false);
        service.saveToCache(key, data);
        
        const cached = service.getFromCache(key);
        expect(cached).toBeDefined();
        expect(cached?.syncedAt).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.1, 10.3
   * 
   * Sync from server should update all cached items' sync timestamps
   */
  it('should update sync timestamps on server sync', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }),
        async (itemCount) => {
          const service = createOfflineSyncService();
          service.setOnlineStatus(false);
          
          for (let i = 0; i < itemCount; i++) {
            service.saveToCache(`key-${i}`, { name: `item-${i}`, value: i });
          }
          
          const allCached = service.getAllCached();
          expect(allCached.length).toBe(itemCount);
          
          for (const item of allCached) {
            expect(item.syncedAt).toBeNull();
          }
          
          service.setOnlineStatus(true);
          const result = await service.syncFromServer();
          
          expect(result.success).toBe(true);
          expect(result.itemsSynced).toBe(itemCount);
          
          const syncedItems = service.getAllCached();
          for (const item of syncedItems) {
            expect(item.syncedAt).not.toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.3
   * 
   * Offline changes should be queued and processed on reconnect
   */
  it('should queue offline changes and process on reconnect', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }),
        async (operationCount) => {
          const service = createOfflineSyncService();
          service.setOnlineStatus(false);
          
          for (let i = 0; i < operationCount; i++) {
            service.addToSyncQueue('child', 'create', { name: `child-${i}` });
          }
          
          expect(service.getPendingOperations().length).toBe(operationCount);
          
          service.setOnlineStatus(true);
          const result = await service.processSyncQueue();
          
          expect(result.processed).toBe(operationCount);
          expect(result.failed).toBe(0);
          expect(service.getPendingOperations().length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.1, 10.3
   * 
   * Data older than 6 hours should be considered stale
   */
  it('should identify stale data older than 6 hours', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 7, max: 24 }),
        (hoursOld) => {
          const service = createOfflineSyncService();
          service.setOnlineStatus(true);
          service.saveToCache('test-key', { name: 'test', value: 1 });
          
          // Get the cached item and modify its syncedAt to be in the past
          const allCached = service.getAllCached();
          expect(allCached.length).toBe(1);
          
          // Directly modify the syncedAt of the cached item
          allCached[0].syncedAt = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
          
          // Now check if the data is considered stale
          const isFresh = service.isDataFresh(6);
          const staleItems = service.getStaleItems(6);
          
          expect(isFresh).toBe(false);
          expect(staleItems.length).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.1, 10.3
   * 
   * Data within 6 hours should be considered fresh
   */
  it('should consider data within 6 hours as fresh', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5 }),
        (hoursOld) => {
          const service = createOfflineSyncService();
          service.setOnlineStatus(true);
          service.saveToCache('test-key', { name: 'test', value: 1 });
          
          const cached = service.getFromCache('test-key');
          if (cached) {
            cached.syncedAt = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
          }
          
          expect(service.isDataFresh(6)).toBe(true);
          expect(service.getStaleItems(6).length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 7: Offline Data Freshness
   * Validates: Requirements 10.3
   * 
   * Sync queue should not process when offline
   */
  it('should not process sync queue when offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (operationCount) => {
          const service = createOfflineSyncService();
          service.setOnlineStatus(false);
          
          for (let i = 0; i < operationCount; i++) {
            service.addToSyncQueue('message', 'create', { content: `msg-${i}` });
          }
          
          const result = await service.processSyncQueue();
          
          expect(result.processed).toBe(0);
          expect(result.failed).toBe(0);
          expect(result.errors).toContain('Offline');
          expect(service.getPendingOperations().length).toBe(operationCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
