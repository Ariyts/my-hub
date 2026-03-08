// ============================================
// AUTO SYNC HOOK - автоматическое сохранение изменений
// ============================================
// Вызывает syncToCloud с debounce после изменений данных

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';

// Debounce time in milliseconds
const DEBOUNCE_TIME = 3000; // 3 seconds

/**
 * Хук для автоматической синхронизации с GitHub
 * Вызывает syncToCloud с debounce после изменений
 * 
 * @param dataId - ID изменённых данных (например, containerId)
 * @param updatedAt - timestamp последнего обновления (опционально)
 */
export function useAutoSync(_dataId: string | undefined, updatedAt: string | undefined) {
  const canSave = useStore(state => state.canSave);
  const syncToCloud = useStore(state => state.syncToCloud);
  const syncStatus = useStore(state => state.syncStatus);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggeredRef = useRef<string>('');
  
  // Debounced sync function
  const triggerSync = useCallback(() => {
    if (!canSave) {
      console.log('[AutoSync] Cannot sync: canSave is false');
      return;
    }
    
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set new timer
    timerRef.current = setTimeout(() => {
      // Only sync if we have new changes and not already syncing
      if (syncStatus !== 'syncing') {
        console.log('[AutoSync] Triggering sync...');
        lastTriggeredRef.current = updatedAt || '';
        syncToCloud();
      }
    }, DEBOUNCE_TIME);
  }, [canSave, syncToCloud, syncStatus, updatedAt]);
  
  // Watch for changes - trigger sync when updatedAt changes
  useEffect(() => {
    if (!updatedAt || !canSave) return;
    
    // If this is a new update, trigger debounced sync
    if (updatedAt !== lastTriggeredRef.current) {
      console.log('[AutoSync] Detected change, scheduling sync...');
      triggerSync();
    }
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [updatedAt, canSave, triggerSync]);
  
  // Return sync status for UI
  return {
    isSyncing: syncStatus === 'syncing',
    canAutoSave: canSave,
    syncStatus,
  };
}

/**
 * Хук для принудительной синхронизации (без debounce)
 */
export function useForceSync() {
  const canSave = useStore(state => state.canSave);
  const syncToCloud = useStore(state => state.syncToCloud);
  const syncStatus = useStore(state => state.syncStatus);
  
  const forceSync = useCallback(() => {
    if (canSave && syncStatus !== 'syncing') {
      syncToCloud();
    }
  }, [canSave, syncToCloud, syncStatus]);
  
  return {
    forceSync,
    isSyncing: syncStatus === 'syncing',
    canSave,
  };
}
