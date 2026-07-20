// ============================================
// AUTO SYNC HOOK - автоматическое сохранение изменений
// ============================================
// Вызывает syncToCloud с debounce после изменений данных

import { useEffect, useRef, useCallback } from "react";
import { useStore } from "../store";
import { debug } from "../utils/debug";

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
  const canSave = useStore((state) => state.canSave);
  const syncToCloud = useStore((state) => state.syncToCloud);
  const syncStatus = useStore((state) => state.syncStatus);
  // Тумблер «Auto-save» из настроек (раньше был декоративным) — Задача 0.E.3
  const autoSave = useStore((state) => state.settings.autoSave);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggeredRef = useRef<string>("");

  // Debounced sync function
  const triggerSync = useCallback(() => {
    if (!canSave || !autoSave) {
      debug("[AutoSync] Skip: canSave/autoSave is false");
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      // Only sync if we have new changes and not already syncing
      if (syncStatus !== "syncing") {
        debug("[AutoSync] Triggering sync...");
        lastTriggeredRef.current = updatedAt || "";
        syncToCloud();
      }
    }, DEBOUNCE_TIME);
  }, [canSave, autoSave, syncToCloud, syncStatus, updatedAt]);

  // Watch for changes - trigger sync when updatedAt changes
  useEffect(() => {
    if (!updatedAt || !canSave || !autoSave) return;

    // If this is a new update, trigger debounced sync
    if (updatedAt !== lastTriggeredRef.current) {
      debug("[AutoSync] Detected change, scheduling sync...");
      triggerSync();
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [updatedAt, canSave, autoSave, triggerSync]);

  // Return sync status for UI
  return {
    isSyncing: syncStatus === "syncing",
    canAutoSave: canSave && autoSave,
    syncStatus,
  };
}

/**
 * Хук для принудительной синхронизации (без debounce)
 */
export function useForceSync() {
  const canSave = useStore((state) => state.canSave);
  const syncToCloud = useStore((state) => state.syncToCloud);
  const syncStatus = useStore((state) => state.syncStatus);

  const forceSync = useCallback(() => {
    if (canSave && syncStatus !== "syncing") {
      syncToCloud();
    }
  }, [canSave, syncToCloud, syncStatus]);

  return {
    forceSync,
    isSyncing: syncStatus === "syncing",
    canSave,
  };
}
