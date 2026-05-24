import { useState, useCallback, useEffect } from 'react';
import type { ChecklistStatus } from '../types';

type ChecklistMap = Record<string, ChecklistStatus>;

const STORAGE_PREFIX = 'pb:checklist:';

function readFromStorage(playbookId: string): ChecklistMap {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + playbookId);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ChecklistMap;
    return {};
  } catch {
    return {};
  }
}

function writeToStorage(playbookId: string, map: ChecklistMap) {
  try {
    localStorage.setItem(STORAGE_PREFIX + playbookId, JSON.stringify(map));
  } catch {
    /* ignore quota errors */
  }
}

export interface ChecklistApi {
  status: (itemId: string) => ChecklistStatus;
  setStatus: (itemId: string, status: ChecklistStatus) => void;
  toggle: (itemId: string) => void;
  cycle: (itemId: string) => void;
  reset: () => void;
  counts: { total: number; done: number; skipped: number; pending: number };
}

export function useChecklist(playbookId: string, itemIds: string[]): ChecklistApi {
  const [map, setMap] = useState<ChecklistMap>(() => readFromStorage(playbookId));

  // Persist on change
  useEffect(() => {
    writeToStorage(playbookId, map);
  }, [playbookId, map]);

  // Reset if playbook changes
  useEffect(() => {
    setMap(readFromStorage(playbookId));
  }, [playbookId]);

  const status = useCallback(
    (itemId: string): ChecklistStatus => map[itemId] || 'pending',
    [map]
  );

  const setStatus = useCallback((itemId: string, s: ChecklistStatus) => {
    setMap((prev) => {
      if (s === 'pending') {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: s };
    });
  }, []);

  const toggle = useCallback((itemId: string) => {
    setMap((prev) => {
      const cur = prev[itemId];
      if (cur === 'done') {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: 'done' };
    });
  }, []);

  const cycle = useCallback((itemId: string) => {
    setMap((prev) => {
      const cur: ChecklistStatus = prev[itemId] || 'pending';
      const next: ChecklistStatus = cur === 'pending' ? 'done' : cur === 'done' ? 'skipped' : 'pending';
      if (next === 'pending') {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  }, []);

  const reset = useCallback(() => {
    setMap({});
    try { localStorage.removeItem(STORAGE_PREFIX + playbookId); } catch { /* */ }
  }, [playbookId]);

  const counts = {
    total: itemIds.length,
    done: itemIds.filter((id) => map[id] === 'done').length,
    skipped: itemIds.filter((id) => map[id] === 'skipped').length,
    pending: itemIds.filter((id) => !map[id] || map[id] === 'pending').length,
  };

  return { status, setStatus, toggle, cycle, reset, counts };
}
