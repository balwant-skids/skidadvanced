'use client';

/**
 * React Hook for Offline Sync
 * Provides offline-first data access with automatic sync
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getDB,
  saveToCache,
  getAllFromCache,
  getByIndex,
  addToSyncQueue,
  syncFromServer,
  processSyncQueue,
  fullSync,
  getLastSyncTime,
  isOnline,
  clearAllOfflineData,
} from '@/lib/offline-sync';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  pendingChanges: number;
  error: string | null;
}

export function useOfflineSync() {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    lastSyncAt: null,
    pendingChanges: 0,
    error: null,
  });

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load initial sync status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const lastSync = await getLastSyncTime();
        const db = await getDB();
        const pendingOps = await db.count('syncQueue');
        
        setStatus(prev => ({
          ...prev,
          lastSyncAt: lastSync,
          pendingChanges: pendingOps,
        }));
      } catch (error) {
        console.error('Failed to load sync status:', error);
      }
    };

    loadStatus();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (status.isOnline && status.pendingChanges > 0) {
      sync();
    }
  }, [status.isOnline]);

  // Sync function
  const sync = useCallback(async () => {
    if (!isOnline() || status.isSyncing) return;

    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const result = await fullSync();
      const db = await getDB();
      const pendingOps = await db.count('syncQueue');
      const lastSync = await getLastSyncTime();

      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: lastSync,
        pendingChanges: pendingOps,
        error: result.pullSuccess ? null : 'Sync failed',
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      }));
    }
  }, [status.isSyncing]);

  // Queue a change for sync
  const queueChange = useCallback(async (
    entity: string,
    action: 'create' | 'update' | 'delete',
    data: Record<string, any>,
    entityId?: string
  ) => {
    await addToSyncQueue(entity, action, data, entityId);
    
    const db = await getDB();
    const pendingOps = await db.count('syncQueue');
    setStatus(prev => ({ ...prev, pendingChanges: pendingOps }));

    // Try to sync immediately if online
    if (isOnline()) {
      await processSyncQueue();
      const newPendingOps = await db.count('syncQueue');
      setStatus(prev => ({ ...prev, pendingChanges: newPendingOps }));
    }
  }, []);

  // Clear all data (for logout)
  const clearData = useCallback(async () => {
    await clearAllOfflineData();
    setStatus(prev => ({
      ...prev,
      lastSyncAt: null,
      pendingChanges: 0,
    }));
  }, []);

  return {
    status,
    sync,
    queueChange,
    clearData,
  };
}

// Hook for accessing cached children data
export function useOfflineChildren() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const cached = await getAllFromCache('children');
        setChildren(cached);
      } catch (error) {
        console.error('Failed to load cached children:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (isOnline()) {
        await syncFromServer();
      }
      const cached = await getAllFromCache('children');
      setChildren(cached);
    } catch (error) {
      console.error('Failed to refresh children:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { children, loading, refresh };
}

// Hook for accessing cached appointments
export function useOfflineAppointments(childId?: string) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        let cached;
        if (childId) {
          cached = await getByIndex('appointments', 'by-child', childId);
        } else {
          cached = await getAllFromCache('appointments');
        }
        // Sort by date
        cached.sort((a, b) => 
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
        setAppointments(cached);
      } catch (error) {
        console.error('Failed to load cached appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [childId]);

  return { appointments, loading };
}

// Hook for accessing cached campaigns
export function useOfflineCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const cached = await getAllFromCache('campaigns');
        setCampaigns(cached);
      } catch (error) {
        console.error('Failed to load cached campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  return { campaigns, loading };
}
