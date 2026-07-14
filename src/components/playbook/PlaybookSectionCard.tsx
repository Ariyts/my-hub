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
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { PlaybookSection, PlaybookItem, PlaybookVariable, ChecklistStatus } from "../../types";
import { SECTION_COLORS, getPhaseTag } from "./constants";
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
}: Props) {
  const isCollapsed = section.collapsed ?? false;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const color = section.color || "#00BCD4";
  const phaseTag = getPhaseTag(section.title);

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

            {/* Phase tag */}
            {phaseTag && (
              <span
                className="flex-shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-[0.15em]"
                style={{
                  color,
                  background: `${color}15`,
                  borderColor: `${color}40`,
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
                {items.map((item) => (
                  <CommandListItem
                    key={item.id}
                    item={item}
                    containerId={containerId}
                    mode={mode}
                    variables={variables}
                    checklistStatus={getChecklistStatus(item.id)}
                    onChecklistCycle={() => onChecklistCycle(item.id)}
                    onEdit={() => {
                      /* Switch to grid mode and the user can edit via CommandCard */
                      // This is the simplest approach — list mode is for quick scanning,
                      // grid mode is for detailed editing
                    }}
                  />
                ))}
              </div>
            ) : (
              /* GRID MODE — current card layout */
              <div className="grid grid-cols-1 gap-2.5 p-3">
                {items.map((item) => (
                  <CommandCard
                    key={item.id}
                    item={item}
                    containerId={containerId}
                    mode={mode}
                    variables={variables}
                    checklistStatus={getChecklistStatus(item.id)}
                    onChecklistCycle={() => onChecklistCycle(item.id)}
                  />
                ))}
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
