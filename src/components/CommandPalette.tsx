import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import { useStore } from "../store";
import {
  Search,
  FileText,
  Terminal,
  Link2,
  MessageSquare,
  BookOpen,
  Settings,
  Trash2,
  SunMoon,
  CornerDownLeft,
} from "lucide-react";

// ============================================
// CommandPalette — ⌘K: глобальный поиск + быстрые команды (Задача 0.D)
// ============================================
// Оверлей: ищет по всем элементам (workspace → category → folder → item) и даёт
// быстрые команды (тема, настройки, корзина). Навигация — переход к элементу.

interface Props {
  open: boolean;
  onClose: () => void;
}

const TYPE_ICON: Record<string, ReactNode> = {
  notes: <FileText size={15} />,
  commands: <Terminal size={15} />,
  links: <Link2 size={15} />,
  prompts: <MessageSquare size={15} />,
  playbooks: <BookOpen size={15} />,
};

interface Result {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  accent?: string;
  run: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const store = useStore();
  const {
    workspaces,
    categories,
    folders,
    notes,
    commands,
    links,
    prompts,
    playbooks,
    setActiveWorkspaceId,
    setActiveCategoryId,
    setActiveFolderId,
    setActiveItemId,
    setShowSettings,
    setShowTrash,
    toggleTheme,
  } = store;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Фокус и сброс при открытии
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      // фокус после монтирования
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Индекс всех элементов с путём workspace / category / folder
  const items = useMemo(() => {
    const folderById = new Map(folders.map((f) => [f.id, f]));
    const catById = new Map(categories.map((c) => [c.id, c]));
    const wsById = new Map(workspaces.map((w) => [w.id, w]));

    const build = (
      arr: { id: string; title: string; folderId: string; tags?: string[] }[],
      type: string,
    ) =>
      arr.map((it) => {
        const folder = folderById.get(it.folderId);
        const cat = folder ? catById.get(folder.categoryId) : undefined;
        const ws = cat ? wsById.get(cat.workspaceId) : undefined;
        return {
          id: it.id,
          title: it.title,
          tags: it.tags ?? [],
          type,
          accent: cat?.color,
          path: [ws?.name, cat?.name, folder?.name].filter(Boolean).join(" / "),
          workspaceId: ws?.id,
          categoryId: cat?.id,
          folderId: it.folderId,
        };
      });

    return [
      ...build(notes, "notes"),
      ...build(commands, "commands"),
      ...build(links, "links"),
      ...build(prompts, "prompts"),
      ...build(playbooks, "playbooks"),
    ];
  }, [notes, commands, links, prompts, playbooks, folders, categories, workspaces]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();

    const actions: Result[] = [
      {
        id: "act-theme",
        title: "Toggle theme",
        icon: <SunMoon size={15} />,
        run: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "act-settings",
        title: "Open settings",
        icon: <Settings size={15} />,
        run: () => {
          setShowSettings(true);
          onClose();
        },
      },
      {
        id: "act-trash",
        title: "Open trash",
        icon: <Trash2 size={15} />,
        run: () => {
          setShowTrash(true);
          onClose();
        },
      },
    ].filter((a) => !q || a.title.toLowerCase().includes(q));

    const itemResults: Result[] = items
      .filter(
        (it) =>
          !q ||
          it.title.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 50)
      .map((it) => ({
        id: it.id,
        title: it.title || "(untitled)",
        subtitle: it.path,
        icon: TYPE_ICON[it.type],
        accent: it.accent,
        run: () => {
          if (it.workspaceId) setActiveWorkspaceId(it.workspaceId);
          if (it.categoryId) setActiveCategoryId(it.categoryId);
          if (it.folderId) setActiveFolderId(it.folderId);
          setActiveItemId(it.id);
          onClose();
        },
      }));

    return [...actions, ...itemResults];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, items]);

  // Держим выделение в границах
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Прокрутка выделенного в зону видимости
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[selected]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="modal-sheet flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Поиск */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search size={16} className="text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search everything or run a command..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle">
            Esc
          </kbd>
        </div>

        {/* Результаты */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-1">
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted">Nothing found</div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.id}
                data-idx={i}
                onMouseMove={() => setSelected(i)}
                onClick={r.run}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
                style={i === selected ? { background: "var(--bg-sunken)" } : undefined}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: r.accent
                      ? `color-mix(in srgb, ${r.accent} 16%, transparent)`
                      : "var(--bg-sunken)",
                    color: r.accent || "var(--text-muted)",
                  }}
                >
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{r.title}</span>
                  {r.subtitle && (
                    <span className="block truncate text-xs text-subtle">{r.subtitle}</span>
                  )}
                </span>
                {i === selected && <CornerDownLeft size={14} className="shrink-0 text-subtle" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
