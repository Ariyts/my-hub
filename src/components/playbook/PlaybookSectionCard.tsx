import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit3, Trash2, Palette, Plus, Target, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { PlaybookSection, PlaybookItem, PlaybookVariable, ChecklistStatus } from '../../types';
import { SECTION_COLORS, getPhaseTag } from './constants';
import { CommandCard, type ViewMode } from './CommandCard';

interface Props {
  section: PlaybookSection;
  items: PlaybookItem[];
  containerId: string;
  mode: ViewMode;
  variables: PlaybookVariable[];
  getChecklistStatus: (itemId: string) => ChecklistStatus;
  onChecklistCycle: (itemId: string) => void;
  onToggleCollapse: () => void;
  onRenameSection: (newTitle: string) => void;
  onDeleteSection: () => void;
  onColorSection: (color: string) => void;
  onAddItem: () => void;
}

export function PlaybookSectionCard({
  section, items, containerId, mode, variables,
  getChecklistStatus, onChecklistCycle,
  onToggleCollapse, onRenameSection, onDeleteSection, onColorSection, onAddItem,
}: Props) {
  const isCollapsed = section.collapsed ?? false;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const color = section.color || '#00BCD4';
  const phaseTag = getPhaseTag(section.title);

  // Checklist progress for this section
  const done = items.filter((i) => getChecklistStatus(i.id) === 'done').length;
  const skipped = items.filter((i) => getChecklistStatus(i.id) === 'skipped').length;
  const progressPct = items.length > 0 ? ((done + skipped) / items.length) * 100 : 0;

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== section.title) {
      onRenameSection(editTitle.trim());
    }
    setEditing(false);
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden',
        'transition-all duration-200',
        'hover:border-slate-700'
      )}
    >
      {/* Header */}
      <div
        className="group relative flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
        onClick={onToggleCollapse}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all"
          style={{ background: color, boxShadow: `0 0 12px ${color}40` }}
        />

        {/* Collapse chevron */}
        <button
          className="p-0.5 rounded hover:bg-slate-700/50 transition-colors flex-shrink-0"
          onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}
        >
          {isCollapsed ? (
            <ChevronRight size={15} style={{ color }} />
          ) : (
            <ChevronDown size={15} style={{ color }} />
          )}
        </button>

        {/* Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Target size={13} style={{ color }} />
        </div>

        {/* Title */}
        {editing ? (
          <div className="flex-1 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                else if (e.key === 'Escape') { setEditTitle(section.title); setEditing(false); }
              }}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => { setEditTitle(section.title); setEditing(false); }}
              className="p-1 rounded hover:bg-red-500/20 text-red-400"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="flex-1 font-semibold text-sm text-slate-100 truncate">
              {section.title}
            </h2>

            {/* Phase tag */}
            {phaseTag && (
              <span
                className="text-[9px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded border flex-shrink-0"
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
              className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: `${color}20`, color }}
            >
              {mode === 'engagement' ? `${done}/${items.length}` : items.length}
            </span>

            {mode === 'engagement' && items.length > 0 && (
              <div className="flex items-center gap-1.5 flex-shrink-0 w-20">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full flex"
                    style={{ width: `${progressPct}%` }}
                  >
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: items.length > 0 ? `${(done / (done + skipped || 1)) * 100}%` : '100%' }}
                    />
                    <div className="h-full flex-1 bg-amber-500/70" />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tabular-nums w-8 text-right">
                  {Math.round((done / items.length) * 100)}%
                </span>
              </div>
            )}
          </>
        )}

        {/* Actions (visible on hover) */}
        {!editing && (
          <div
            className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker((s) => !s)}
                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 transition-colors"
                title="Change color"
              >
                <Palette size={13} />
              </button>
              {showColorPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 p-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl grid grid-cols-3 gap-1 w-28">
                    {SECTION_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => { onColorSection(c); setShowColorPicker(false); }}
                        className={cn(
                          'w-6 h-6 rounded-md transition-transform hover:scale-110',
                          color === c && 'ring-2 ring-slate-100 ring-offset-2 ring-offset-slate-900'
                        )}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => { setEditing(true); setEditTitle(section.title); }}
              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700/60 hover:text-cyan-300 transition-colors"
              title="Rename section"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => {
                if (items.length > 0) {
                  if (!confirm(`Delete "${section.title}" and its ${items.length} command(s)?`)) return;
                }
                onDeleteSection();
              }}
              className="p-1.5 rounded-md text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
              title="Delete section"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={onAddItem}
              className="flex items-center gap-1 ml-1 px-2 py-1 rounded-md text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
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
          ) : (
            <button
              onClick={onAddItem}
              className="w-full py-8 text-center group/empty"
            >
              <div className="inline-flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-700 group-hover/empty:border-cyan-400/60 transition-colors">
                <Plus size={18} className="text-slate-600 group-hover/empty:text-cyan-400 transition-colors" />
                <span className="text-xs text-slate-500 group-hover/empty:text-slate-300 transition-colors">
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
