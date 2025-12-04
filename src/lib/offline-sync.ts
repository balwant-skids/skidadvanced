/**
 * IndexedDB Offline Sync Service
 * Provides offline-first data caching and sync queue functionality
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema definition
interface SkidsDB extends DBSchema {
  children: {
    key: string;
    value: {
      id: string;
      name: string;
      dateOfBirth: string;
      gender?: string;
      bloodGroup?: string;
      allergies?: string;
      healthMetrics: Record<string, any>;
      parentId: string;
      updatedAt: string;
    };
    indexes: { 'by-parent': string };
  };
  appointments: {
    key: string;
    value: {
      id: string;
      type: string;
      title?: string;
      description?: string;
      scheduledAt: string;
      duration: number;
      status: string;
      childId: string;
      updatedAt: string;
    };
    indexes: { 'by-child': string; 'by-date': string };
  };
  reports: {
    key: string;
    value: {
      id: string;
      title: string;
      description?: string;
      fileType: string;
      fileSize: number;
      reportType: string;
      childId: string;
      createdAt: string;
    };
    indexes: { 'by-child': string };
  };
  campaigns: {
    key: string;
    value: {
      id: string;
      title: string;
      description?: string;
      mediaUrl?: string;
      mediaType?: string;
      ctaText?: string;
      ctaUrl?: string;
      createdAt: string;
    };
  };
  messages: {
    key: string;
    value: {
      id: string;
      content: string;
      isFromParent: boolean;
      isRead: boolean;
      senderId: string;
      senderName: string;
      createdAt: string;
    };
    indexes: { 'by-date': string };
  };
  syncQueue: {
    key: number;
    value: {
      id?: number;
      entity: string;
      entityId?: string;
      action: 'create' | 'update' | 'delete';
      data: Record<string, any>;
      createdAt: string;
      retryCount: number;
    };
    indexes: { 'by-entity': string };
  };
  metadata: {
    key: string;
    value: {
      key: string;
      value: any;
      updatedAt: string;
    };
  };
}

const DB_NAME = 'skids-offline';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SkidsDB> | null = null;

/**
 * Initialize and get the IndexedDB instance
 */
export async function getDB(): Promise<IDBPDatabase<SkidsDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SkidsDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Children store
      if (!db.objectStoreNames.contains('children')) {
        const childrenStore = db.createObjectStore('children', { keyPath: 'id' });
        childrenStore.createIndex('by-parent', 'parentId');
      }

      // Appointments store
      if (!db.objectStoreNames.contains('appointments')) {
        const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' });
        appointmentsStore.createIndex('by-child', 'childId');
        appointmentsStore.createIndex('by-date', 'scheduledAt');
      }

      // Reports store
      if (!db.objectStoreNames.contains('reports')) {
        const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportsStore.createIndex('by-child', 'childId');
      }

      // Campaigns store
      if (!db.objectStoreNames.contains('campaigns')) {
        db.createObjectStore('campaigns', { keyPath: 'id' });
      }

      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
        messagesStore.createIndex('by-date', 'createdAt');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        syncStore.createIndex('by-entity', 'entity');
      }

      // Metadata store
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}


// ============ CACHE OPERATIONS ============

/**
 * Save data to cache
 */
export async function saveToCache<T extends keyof SkidsDB>(
  storeName: T,
  data: SkidsDB[T]['value'] | SkidsDB[T]['value'][]
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(storeName as any, 'readwrite');
  const store = tx.objectStore(storeName as any);

  if (Array.isArray(data)) {
    await Promise.all(data.map(item => store.put(item)));
  } else {
    await store.put(data);
  }

  await tx.done;
}

/**
 * Get data from cache by key
 */
export async function getFromCache<T extends keyof SkidsDB>(
  storeName: T,
  key: SkidsDB[T]['key']
): Promise<SkidsDB[T]['value'] | undefined> {
  const db = await getDB();
  return db.get(storeName as any, key as any);
}

/**
 * Get all data from a store
 */
export async function getAllFromCache<T extends keyof SkidsDB>(
  storeName: T
): Promise<SkidsDB[T]['value'][]> {
  const db = await getDB();
  return db.getAll(storeName as any);
}

/**
 * Get data by index
 */
export async function getByIndex(
  storeName: string,
  indexName: string,
  value: string
): Promise<any[]> {
  const db = await getDB();
  // @ts-ignore - dynamic store/index access
  const tx = db.transaction(storeName, 'readonly');
  // @ts-ignore
  const index = tx.objectStore(storeName).index(indexName);
  // @ts-ignore
  return index.getAll(value);
}

/**
 * Delete from cache
 */
export async function deleteFromCache<T extends keyof SkidsDB>(
  storeName: T,
  key: SkidsDB[T]['key']
): Promise<void> {
  const db = await getDB();
  await db.delete(storeName as any, key as any);
}

/**
 * Clear all data from a store
 */
export async function clearStore<T extends keyof SkidsDB>(
  storeName: T
): Promise<void> {
  const db = await getDB();
  await db.clear(storeName as any);
}

// ============ SYNC QUEUE OPERATIONS ============

/**
 * Add an operation to the sync queue
 */
export async function addToSyncQueue(
  entity: string,
  action: 'create' | 'update' | 'delete',
  data: Record<string, any>,
  entityId?: string
): Promise<void> {
  const db = await getDB();
  await db.add('syncQueue', {
    entity,
    entityId,
    action,
    data,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  });
}

/**
 * Get all pending sync operations
 */
export async function getPendingSyncOperations(): Promise<SkidsDB['syncQueue']['value'][]> {
  const db = await getDB();
  return db.getAll('syncQueue');
}

/**
 * Remove a sync operation after successful sync
 */
export async function removeSyncOperation(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('syncQueue', id);
}

/**
 * Increment retry count for a failed sync operation
 */
export async function incrementSyncRetry(id: number): Promise<void> {
  const db = await getDB();
  const operation = await db.get('syncQueue', id);
  if (operation) {
    operation.retryCount += 1;
    await db.put('syncQueue', operation);
  }
}

// ============ METADATA OPERATIONS ============

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(): Promise<Date | null> {
  const db = await getDB();
  const meta = await db.get('metadata', 'lastSyncAt');
  return meta ? new Date(meta.value) : null;
}

/**
 * Update last sync timestamp
 */
export async function setLastSyncTime(date: Date = new Date()): Promise<void> {
  const db = await getDB();
  await db.put('metadata', {
    key: 'lastSyncAt',
    value: date.toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Check if we're online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}


// ============ SYNC SERVICE ============

const API_BASE = '/api';
const MAX_RETRIES = 3;

/**
 * Sync data from server to local cache
 */
export async function syncFromServer(): Promise<{ success: boolean; error?: string }> {
  if (!isOnline()) {
    return { success: false, error: 'Offline' };
  }

  try {
    // Fetch children
    const childrenRes = await fetch(`${API_BASE}/children`);
    if (childrenRes.ok) {
      const { children } = await childrenRes.json();
      if (children?.length > 0) {
        await saveToCache('children', children.map((c: any) => ({
          ...c,
          healthMetrics: typeof c.healthMetrics === 'string' 
            ? JSON.parse(c.healthMetrics) 
            : c.healthMetrics,
          updatedAt: c.updatedAt || new Date().toISOString(),
        })));
      }
    }

    // Fetch appointments
    const appointmentsRes = await fetch(`${API_BASE}/appointments?limit=50`);
    if (appointmentsRes.ok) {
      const { appointments } = await appointmentsRes.json();
      if (appointments?.length > 0) {
        await saveToCache('appointments', appointments.map((a: any) => ({
          ...a,
          updatedAt: a.updatedAt || new Date().toISOString(),
        })));
      }
    }

    // Fetch campaigns
    const campaignsRes = await fetch(`${API_BASE}/campaigns?limit=20`);
    if (campaignsRes.ok) {
      const { campaigns } = await campaignsRes.json();
      if (campaigns?.length > 0) {
        await saveToCache('campaigns', campaigns);
      }
    }

    // Fetch messages
    const messagesRes = await fetch(`${API_BASE}/messages?limit=100`);
    if (messagesRes.ok) {
      const { messages } = await messagesRes.json();
      if (messages?.length > 0) {
        await saveToCache('messages', messages.map((m: any) => ({
          ...m,
          senderName: m.sender?.name || 'Unknown',
        })));
      }
    }

    await setLastSyncTime();
    return { success: true };
  } catch (error) {
    console.error('Sync from server failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Process the sync queue - push local changes to server
 */
export async function processSyncQueue(): Promise<{ 
  processed: number; 
  failed: number;
  errors: string[];
}> {
  if (!isOnline()) {
    return { processed: 0, failed: 0, errors: ['Offline'] };
  }

  const operations = await getPendingSyncOperations();
  let processed = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const op of operations) {
    if (op.retryCount >= MAX_RETRIES) {
      // Skip operations that have failed too many times
      errors.push(`Operation ${op.id} exceeded max retries`);
      failed++;
      continue;
    }

    try {
      let endpoint = '';
      let method = '';
      let body: any = null;

      switch (op.entity) {
        case 'child':
          endpoint = op.action === 'create' 
            ? `${API_BASE}/children`
            : `${API_BASE}/children/${op.entityId}`;
          method = op.action === 'create' ? 'POST' : op.action === 'update' ? 'PATCH' : 'DELETE';
          body = op.action !== 'delete' ? op.data : null;
          break;

        case 'appointment':
          endpoint = op.action === 'create'
            ? `${API_BASE}/children/${op.data.childId}/appointments`
            : `${API_BASE}/appointments/${op.entityId}`;
          method = op.action === 'create' ? 'POST' : op.action === 'update' ? 'PATCH' : 'DELETE';
          body = op.action !== 'delete' ? op.data : null;
          break;

        case 'message':
          endpoint = `${API_BASE}/messages`;
          method = 'POST';
          body = op.data;
          break;

        default:
          errors.push(`Unknown entity type: ${op.entity}`);
          failed++;
          continue;
      }

      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        await removeSyncOperation(op.id!);
        processed++;
      } else {
        await incrementSyncRetry(op.id!);
        errors.push(`Failed to sync ${op.entity}: ${response.statusText}`);
        failed++;
      }
    } catch (error) {
      await incrementSyncRetry(op.id!);
      errors.push(`Error syncing ${op.entity}: ${error instanceof Error ? error.message : 'Unknown'}`);
      failed++;
    }
  }

  return { processed, failed, errors };
}

/**
 * Full sync - pull from server and push local changes
 */
export async function fullSync(): Promise<{
  pullSuccess: boolean;
  pushResult: { processed: number; failed: number; errors: string[] };
}> {
  // First, push local changes (server-wins on conflict)
  const pushResult = await processSyncQueue();
  
  // Then, pull latest from server
  const pullResult = await syncFromServer();

  return {
    pullSuccess: pullResult.success,
    pushResult,
  };
}

/**
 * Clear all offline data (for logout)
 */
export async function clearAllOfflineData(): Promise<void> {
  const stores: (keyof SkidsDB)[] = [
    'children',
    'appointments',
    'reports',
    'campaigns',
    'messages',
    'syncQueue',
    'metadata',
  ];

  for (const store of stores) {
    await clearStore(store);
  }
}
