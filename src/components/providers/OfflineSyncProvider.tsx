'use client';

/**
 * Offline Sync Provider
 * Handles automatic data sync on app load and provides sync context
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  fullSync,
  getLastSyncTime,
  isOnline,
  clearAllOfflineData,
  getDB,
} from '@/lib/offline-sync';

interface OfflineSyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  pendingChanges: number;
  error: string | null;
  sync: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | null>(null);

export function useOfflineSyncContext() {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSyncContext must be used within OfflineSyncProvider');
  }
  return context;
}

interface OfflineSyncProviderProps {
  children: ReactNode;
}

export function OfflineSyncProvider({ children }: OfflineSyncProviderProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [state, setState] = useState<Omit<OfflineSyncContextType, 'sync'>>({
    isOnline: true,
    isSyncing: false,
    lastSyncAt: null,
    pendingChanges: 0,
    error: null,
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setState(prev => ({ ...prev, isOnline: navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync on app load when user is signed in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const initialSync = async () => {
      // Check if offline mode is enabled
      if (process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== 'true') return;

      setState(prev => ({ ...prev, isSyncing: true }));

      try {
        // Load last sync time
        const lastSync = await getLastSyncTime();
        setState(prev => ({ ...prev, lastSyncAt: lastSync }));

        // Perform sync if online
        if (isOnline()) {
          await fullSync();
          const newLastSync = await getLastSyncTime();
          const db = await getDB();
          const pendingOps = await db.count('syncQueue');

          setState(prev => ({
            ...prev,
            lastSyncAt: newLastSync,
            pendingChanges: pendingOps,
            error: null,
          }));
        }
      } catch (error) {
        console.error('Initial sync failed:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Sync failed',
        }));
      } finally {
        setState(prev => ({ ...prev, isSyncing: false }));
      }
    };

    initialSync();
  }, [isLoaded, isSignedIn]);

  // Clear data on sign out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearAllOfflineData().catch(console.error);
    }
  }, [isLoaded, isSignedIn]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (state.isOnline && state.pendingChanges > 0 && !state.isSyncing) {
      sync();
    }
  }, [state.isOnline, state.pendingChanges]);

  // Manual sync function
  const sync = async () => {
    if (!isOnline() || state.isSyncing) return;

    setState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      await fullSync();
      const lastSync = await getLastSyncTime();
      const db = await getDB();
      const pendingOps = await db.count('syncQueue');

      setState(prev => ({
        ...prev,
        lastSyncAt: lastSync,
        pendingChanges: pendingOps,
        isSyncing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      }));
    }
  };

  // Periodic sync every 5 minutes when online
  useEffect(() => {
    if (!isSignedIn || !state.isOnline) return;

    const interval = setInterval(() => {
      if (isOnline() && !state.isSyncing) {
        sync();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isSignedIn, state.isOnline, state.isSyncing]);

  return (
    <OfflineSyncContext.Provider value={{ ...state, sync }}>
      {children}
    </OfflineSyncContext.Provider>
  );
}

// Offline indicator component
export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingChanges } = useOfflineSyncContext();

  if (isOnline && pendingChanges === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" 
            />
          </svg>
          <span>You&apos;re offline</span>
        </div>
      )}
      {isSyncing && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Syncing...</span>
        </div>
      )}
      {isOnline && pendingChanges > 0 && !isSyncing && (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {pendingChanges} pending change{pendingChanges > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
