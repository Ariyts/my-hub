import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Trash2,
  Palette,
  Plus,
  Target,
  X,
  Check,
  GripVertical,
  Share2,
  Copy,
  Download,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { PlaybookSection, PlaybookItem, PlaybookVariable, ChecklistStatus } from "../../types";
import { SECTION_COLORS, getPhaseTag, PHASE_COLORS } from "./constants";
import { CommandCard, type ViewMode } from "./CommandCard";
import { CommandListItem } from "./CommandListItem";

interface Props {
  section: PlaybookSection;
  items: PlaybookItem[];
  containerId: string;
  mode: ViewMode;
  variables: PlaybookVariable[];
  layout: "grid" | "list";
  getChecklistStatus: (itemId: string) => ChecklistStatus;
  onChecklistCycle: (itemId: string) => void;
  /** DnD секций (Задача 3.1). Если не передан — перетаскивание недоступно. */
  onDragStartSection?: (e: React.DragEvent) => void;
  onDragEndSection?: () => void;
  /** Переупорядочивание команд внутри секции. Не передан — DnD команд выключен. */
  onReorderItems?: (itemIds: string[]) => void;
  /** Экспорт секции в markdown (Задача 3.6). Не передан — кнопка скрыта. */
  onExportSection?: (kind: "copy" | "download") => void;
  onToggleCollapse: () => void;
  onRenameSection: (newTitle: string) => void;
  onDeleteSection: () => void;
  onColorSection: (color: string) => void;
  onAddItem: () => void;
}

export function PlaybookSectionCard({
  section,
  items,
  containerId,
  mode,
  variables,
  layout,
  getChecklistStatus,
  onChecklistCycle,
  onToggleCollapse,
  onRenameSection,
  onDeleteSection,
  onColorSection,
  onAddItem,
  onDragStartSection,
  onDragEndSection,
  onReorderItems,
  onExportSection,
}: Props) {
  const isCollapsed = section.collapsed ?? false;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [editing, setEditing] = useState(false);

  // DnD команд внутри секции (Задача 3.1)
  const [itemDrag, setItemDrag] = useState<{ id: string | null; overIndex: number | null }>({
    id: null,
    overIndex: null,
  });

  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setItemDrag({ id, overIndex: null });
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    if (!itemDrag.id) return;
    e.preventDefault();
    setItemDrag((d) => (d.overIndex === index ? d : { ...d, overIndex: index }));
  };

  const handleItemDrop = () => {
    const { id, overIndex } = itemDrag;
    setItemDrag({ id: null, overIndex: null });
    if (!id || overIndex === null || !onReorderItems) return;

    const ids = items.map((i) => i.id);
    const from = ids.indexOf(id);
    if (from === -1 || from === overIndex) return;

    const next = [...ids];
    const [moved] = next.splice(from, 1);
    next.splice(overIndex, 0, moved);
    onReorderItems(next);
  };

  // Обёртка с ручкой перетаскивания и индикатором места вставки
  const draggableItem = (item: PlaybookItem, index: number, child: React.ReactNode) => (
    <div
      key={item.id}
      className="group/item relative"
      onDragOver={(e) => handleItemDragOver(e, index)}
      onDrop={handleItemDrop}
      style={{ opacity: itemDrag.id === item.id ? 0.5 : 1 }}
    >
      {itemDrag.id && itemDrag.id !== item.id && itemDrag.overIndex === index && (
        <div className="absolute -top-px right-0 left-0 z-10 h-0.5 rounded-full bg-cyan-400" />
      )}
      <div className="flex items-start gap-1">
        {onReorderItems && (
          <div
            draggable
            onDragStart={(e) => handleItemDragStart(e, item.id)}
            onDragEnd={() => setItemDrag({ id: null, overIndex: null })}
            onClick={(e) => e.stopPropagation()}
            className="mt-1.5 flex-shrink-0 cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100 hover:bg-slate-700/50 active:cursor-grabbing"
            title="Drag to reorder command"
          >
            <GripVertical size={12} className="text-slate-600" />
          </div>
        )}
        <div className="min-w-0 flex-1">{child}</div>
      </div>
    </div>
  );
  const [editTitle, setEditTitle] = useState(section.title);

  // Фаза задаёт цвет секции по умолчанию (визуальная группировка по фазам).
  // Явно выбранный цвет секции имеет приоритет.
  const phaseTag = getPhaseTag(section.title);
  const phaseColor = phaseTag ? PHASE_COLORS[phaseTag] : undefined;
  const color = section.color || phaseColor || "#00BCD4";

  // Checklist progress for this section
  const done = items.filter((i) => getChecklistStatus(i.id) === "done").length;
  const skipped = items.filter((i) => getChecklistStatus(i.id) === "skipped").length;
  const progressPct = items.length > 0 ? ((done + skipped) / items.length) * 100 : 0;

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== section.title) {
      onRenameSection(editTitle.trim());
    }
    setEditing(false);
  };

  return (
    <div
      id={`section-${section.id}`}
      className={cn(
        "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm",
        "transition-all duration-200",
        "hover:border-slate-700",
      )}
    >
      {/* Header */}
      <div
        className="group relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors select-none hover:bg-slate-800/40"
        onClick={onToggleCollapse}
      >
        {/* Left accent bar */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1 rounded-r-full transition-all"
          style={{ background: color, boxShadow: `0 0 12px ${color}40` }}
        />

        {/* Drag handle (Задача 3.1) — тянуть за него, чтобы поменять порядок секций */}
        {onDragStartSection && (
          <div
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStartSection(e);
            }}
            onDragEnd={onDragEndSection}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-700/50 active:cursor-grabbing"
            title="Drag to reorder section"
          >
            <GripVertical size={14} className="text-slate-500" />
          </div>
        )}

        {/* Collapse chevron */}
        <button
          className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-slate-700/50"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={15} style={{ color }} />
          ) : (
            <ChevronDown size={15} style={{ color }} />
          )}
        </button>

        {/* Icon */}
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Target size={13} style={{ color }} />
        </div>

        {/* Title */}
        {editing ? (
          <div className="flex flex-1 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                else if (e.key === "Escape") {
                  setEditTitle(section.title);
                  setEditing(false);
                }
              }}
              className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSaveTitle}
              className="rounded p-1 text-emerald-400 hover:bg-emerald-500/20"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => {
                setEditTitle(section.title);
                setEditing(false);
              }}
              className="rounded p-1 text-red-400 hover:bg-red-500/20"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="flex-1 truncate text-sm font-semibold text-slate-100">
              {section.title}
            </h2>

            {/* Phase tag — всегда цветом фазы, чтобы фазы различались визуально */}
            {phaseTag && (
              <span
                className="flex-shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-[0.15em]"
                style={{
                  color: phaseColor || color,
                  background: `${phaseColor || color}15`,
                  borderColor: `${phaseColor || color}40`,
                }}
              >
                {phaseTag}
              </span>
            )}

            {/* Count + progress */}
            <span
              className="flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ background: `${color}20`, color }}
            >
              {mode === "engagement" ? `${done}/${items.length}` : items.length}
            </span>

            {mode === "engagement" && items.length > 0 && (
              <div className="flex w-20 flex-shrink-0 items-center gap-1.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="flex h-full" style={{ width: `${progressPct}%` }}>
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width:
                          items.length > 0 ? `${(done / (done + skipped || 1)) * 100}%` : "100%",
                      }}
                    />
                    <div className="h-full flex-1 bg-amber-500/70" />
                  </div>
                </div>
                <span className="w-8 text-right text-[10px] font-medium text-slate-400 tabular-nums">
                  {Math.round((done / items.length) * 100)}%
                </span>
              </div>
            )}
          </>
        )}

        {/* Actions (visible on hover) */}
        {!editing && (
          <div
            className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker((s) => !s)}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200"
                title="Change color"
              >
                <Palette size={13} />
              </button>
              {showColorPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                  <div className="absolute top-full right-0 z-20 mt-1 grid w-28 grid-cols-3 gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                    {SECTION_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onColorSection(c);
                          setShowColorPicker(false);
                        }}
                        className={cn(
                          "h-6 w-6 rounded-md transition-transform hover:scale-110",
                          color === c &&
                            "ring-2 ring-slate-100 ring-offset-2 ring-offset-slate-900",
                        )}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Экспорт секции в markdown (Задача 3.6) */}
            {onExportSection && (
              <div className="relative">
                <button
                  onClick={() => setShowExport((v) => !v)}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-cyan-300"
                  title="Export section as markdown"
                >
                  <Share2 size={13} />
                </button>
                {showExport && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
                    <div className="absolute top-full right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-2xl">
                      <button
                        onClick={() => {
                          onExportSection("copy");
                          setShowExport(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-slate-300 transition-colors hover:bg-slate-800 hover:text-cyan-300"
                      >
                        <Copy size={11} />
                        Copy markdown
                      </button>
                      <button
                        onClick={() => {
                          onExportSection("download");
                          setShowExport(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-slate-300 transition-colors hover:bg-slate-800 hover:text-cyan-300"
                      >
                        <Download size={11} />
                        Download .md
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setEditing(true);
                setEditTitle(section.title);
              }}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-cyan-300"
              title="Rename section"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => {
                if (items.length > 0) {
                  if (!confirm(`Delete "${section.title}" and its ${items.length} command(s)?`))
                    return;
                }
                onDeleteSection();
              }}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
              title="Delete section"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={onAddItem}
              className="ml-1 flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
              title="Add command"
            >
              <Plus size={12} strokeWidth={2.5} />
              Add
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="border-t border-slate-800/80 bg-slate-950/40">
          {items.length > 0 ? (
            layout === "list" ? (
              /* LIST MODE — compact rows */
              <div className="divide-y divide-slate-800/40">
                {items.map((item, index) =>
                  draggableItem(
                    item,
                    index,
                    <CommandListItem
                      item={item}
                      containerId={containerId}
                      mode={mode}
                      variables={variables}
                      checklistStatus={getChecklistStatus(item.id)}
                      onChecklistCycle={() => onChecklistCycle(item.id)}
                    />,
                  ),
                )}
              </div>
            ) : (
              /* GRID MODE — current card layout */
              <div className="grid grid-cols-1 gap-2.5 p-3">
                {items.map((item, index) =>
                  draggableItem(
                    item,
                    index,
                    <CommandCard
                      item={item}
                      containerId={containerId}
                      mode={mode}
                      variables={variables}
                      checklistStatus={getChecklistStatus(item.id)}
                      onChecklistCycle={() => onChecklistCycle(item.id)}
                    />,
                  ),
                )}
              </div>
            )
          ) : (
            <button onClick={onAddItem} className="group/empty w-full py-8 text-center">
              <div className="inline-flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-700 px-4 py-3 transition-colors group-hover/empty:border-cyan-400/60">
                <Plus
                  size={18}
                  className="text-slate-600 transition-colors group-hover/empty:text-cyan-400"
                />
                <span className="text-xs text-slate-500 transition-colors group-hover/empty:text-slate-300">
                  Add your first command to this section
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
