import { useCallback, useEffect } from "react";
import { useStore } from "../store";
import type { ChecklistStatus } from "../types";

// ============================================
// useChecklist (Задача 3.5)
// ============================================
// Прогресс чеклиста хранится на самих командах (PlaybookItem.status), поэтому
// он персистится вместе с данными и уезжает в GitHub — раньше он жил только в
// localStorage (`pb:checklist:<id>`) и терялся между устройствами/при очистке кэша.
// Старые данные из localStorage переносятся один раз при первом открытии.

const LEGACY_PREFIX = "pb:checklist:";

export interface ChecklistApi {
  status: (itemId: string) => ChecklistStatus;
  setStatus: (itemId: string, status: ChecklistStatus) => void;
  toggle: (itemId: string) => void;
  cycle: (itemId: string) => void;
  reset: () => void;
  counts: { total: number; done: number; skipped: number; pending: number };
}

export function useChecklist(playbookId: string, itemIds: string[]): ChecklistApi {
  const playbook = useStore((s) => s.playbooks.find((p) => p.id === playbookId));
  const updatePlaybookItem = useStore((s) => s.updatePlaybookItem);
  const resetPlaybookChecklist = useStore((s) => s.resetPlaybookChecklist);
  const setPlaybookChecklist = useStore((s) => s.setPlaybookChecklist);

  // Разовая миграция прежнего прогресса из localStorage
  useEffect(() => {
    const key = LEGACY_PREFIX + playbookId;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return;
    }
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        setPlaybookChecklist(playbookId, parsed as Record<string, ChecklistStatus>);
      }
    } catch {
      /* повреждённые данные просто отбрасываем */
    }
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [playbookId, setPlaybookChecklist]);

  const status = useCallback(
    (itemId: string): ChecklistStatus =>
      playbook?.subItems.find((i) => i.id === itemId)?.status || "pending",
    [playbook],
  );

  const setStatus = useCallback(
    (itemId: string, s: ChecklistStatus) => {
      updatePlaybookItem(playbookId, itemId, { status: s === "pending" ? undefined : s });
    },
    [playbookId, updatePlaybookItem],
  );

  const toggle = useCallback(
    (itemId: string) => {
      const cur = status(itemId);
      setStatus(itemId, cur === "done" ? "pending" : "done");
    },
    [status, setStatus],
  );

  const cycle = useCallback(
    (itemId: string) => {
      const cur = status(itemId);
      const next: ChecklistStatus =
        cur === "pending" ? "done" : cur === "done" ? "skipped" : "pending";
      setStatus(itemId, next);
    },
    [status, setStatus],
  );

  const reset = useCallback(() => {
    resetPlaybookChecklist(playbookId);
  }, [playbookId, resetPlaybookChecklist]);

  const counts = {
    total: itemIds.length,
    done: itemIds.filter((id) => status(id) === "done").length,
    skipped: itemIds.filter((id) => status(id) === "skipped").length,
    pending: itemIds.filter((id) => status(id) === "pending").length,
  };

  return { status, setStatus, toggle, cycle, reset, counts };
}
