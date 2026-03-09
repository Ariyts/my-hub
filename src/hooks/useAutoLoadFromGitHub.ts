/**
 * Auto-load data from GitHub on app startup
 * This hook automatically fetches the latest data from GitHub when the app starts
 * It uses the public GitHub API (no token required) for read access
 */

'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MIN_SYNC_AGE = 60 * 1000; // 1 minute - minimum time before auto-sync again

export function useAutoLoadFromGitHub() {
  const loadFromCloudPublic = useStore((state) => state.loadFromCloudPublic);
  const syncStatus = useStore((state) => state.syncStatus);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple loads
    if (hasLoadedRef.current) return;
    
    // Check if we recently synced
    const lastSync = localStorage.getItem('last-public-sync');
    if (lastSync) {
      const lastSyncTime = new Date(lastSync).getTime();
      const now = Date.now();
      
      // If synced within the last minute, skip auto-load
      if (now - lastSyncTime < MIN_SYNC_AGE) {
        console.log('[useAutoLoadFromGitHub] Recently synced, skipping auto-load');
        hasLoadedRef.current = true;
        return;
      }
    }

    // Only load if not currently syncing
    if (syncStatus === 'idle') {
      console.log('[useAutoLoadFromGitHub] Auto-loading data from GitHub...');
      hasLoadedRef.current = true;
      loadFromCloudPublic();
    }
  }, [loadFromCloudPublic, syncStatus]);

  // Set up periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (syncStatus === 'idle') {
        console.log('[useAutoLoadFromGitHub] Periodic sync check...');
        loadFromCloudPublic();
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [loadFromCloudPublic, syncStatus]);
}
