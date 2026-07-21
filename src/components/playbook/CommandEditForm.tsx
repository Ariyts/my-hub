import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";
import type { PlaybookItem, PlaybookLanguage } from "../../types";
import { LANG_LABELS, PLAYBOOK_LANGUAGES } from "./constants";

// ============================================
// CommandEditForm — общая форма правки команды (Задача 3.8)
// ============================================
// Единый инлайн-редактор, используется и в CommandCard (grid), и в
// CommandListItem (list) — раньше list-режим редактировать не мог (заглушка).

interface Props {
  item: PlaybookItem;
  containerId: string;
  onDone: () => void;
}

export function CommandEditForm({ item, containerId, onDone }: Props) {
  const { updatePlaybookItem } = useStore();
  const [editData, setEditData] = useState({ ...item });
  const cmdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cmdRef.current?.focus();
  }, []);

  const save = () => {
    if (!editData.command.trim()) return;
    updatePlaybookItem(containerId, item.id, editData);
    onDone();
  };

  const cancel = () => {
    setEditData({ ...item });
    onDone();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  return (
    <div className="animate-in space-y-2 rounded-xl border border-cyan-400/40 bg-surface/60 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-border-subtle bg-background px-2 py-1.5 text-[11px] text-foreground outline-none focus:border-cyan-400"
          value={editData.language}
          onChange={(e) => setEditData({ ...editData, language: e.target.value as PlaybookLanguage })}
        >
          {PLAYBOOK_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANG_LABELS[l]}
            </option>
          ))}
        </select>
        <input
          ref={cmdRef}
          className="flex-1 rounded-md border border-border-subtle bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-cyan-400"
          value={editData.command}
          onChange={(e) => setEditData({ ...editData, command: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="command (use $VAR for context variables)..."
        />
      </div>
      <input
        className="w-full rounded-md border border-border-subtle bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-400"
        value={editData.description}
        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        placeholder="description..."
        onKeyDown={onKeyDown}
      />
      <input
        className="w-full rounded-md border border-border-subtle bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-400"
        value={editData.tags.join(", ")}
        onChange={(e) =>
          setEditData({
            ...editData,
            tags: e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          })
        }
        placeholder="tags (comma separated)..."
        onKeyDown={onKeyDown}
      />
      <div className="flex items-center justify-end gap-2">
        <span className="mr-auto text-[10px] text-subtle">
          ⌘/Ctrl + Enter to save · Esc to cancel
        </span>
        <button
          onClick={cancel}
          className="rounded-md px-2.5 py-1 text-xs text-muted transition-colors hover:bg-sunken"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={!editData.command.trim()}
          className="rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/30 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}
