import { useState } from 'react';
import { Copy, Check, Edit3, Trash2, Star } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useStore } from '../../store';
import type { PlaybookItem, PlaybookVariable, ChecklistStatus } from '../../types';
import { LANG_COLORS, LANG_LABELS } from './constants';
import { stripMdMetadata } from './utils';

interface Props {
  item: PlaybookItem;
  containerId: string;
  mode: 'reference' | 'engagement';
  variables: PlaybookVariable[];
  checklistStatus: ChecklistStatus;
  onChecklistCycle: () => void;
  onEdit: () => void;
}

/**
 * Compact command row (~36px height) for list view.
 * Uses Tailwind classes to match the existing PlaybookView design.
 */
export function CommandListItem({
  item, containerId, mode, variables, checklistStatus, onChecklistCycle, onEdit,
}: Props) {
  const { updatePlaybookItem, deletePlaybookItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Clean markdown metadata from display
  const template = stripMdMetadata(item.command);
  const langColor = LANG_COLORS[item.language] || '#64748b';
  const langLabel = LANG_LABELS[item.language] || item.language.toUpperCase().slice(0, 2);

  // Render command: substitute variables in engagement mode
  const getRenderedText = (): string => {
    if (mode !== 'engagement' || variables.length === 0) return template;
    let out = template;
    for (const v of variables) {
      if (!v.value) continue;
      const re = new RegExp(`\\$\\{${v.name}\\}|\\$${v.name}\\b`, 'g');
      out = out.replace(re, v.value);
    }
    return out;
  };

  const renderedText = getRenderedText();
  const copyText = mode === 'engagement' ? renderedText : template;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(copyText).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = copyText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const isDone = checklistStatus === 'done';
  const isSkipped = checklistStatus === 'skipped';

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.description || 'Click to copy'}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer transition-colors relative',
        'hover:bg-slate-800/40',
        isDone && 'opacity-50',
        isSkipped && 'opacity-40',
      )}
    >
      {/* Engagement mode: checklist indicator */}
      {mode === 'engagement' && (
        <button
          onClick={(e) => { e.stopPropagation(); onChecklistCycle(); }}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
            isDone ? 'bg-emerald-500/20 border-emerald-500/50' :
            isSkipped ? 'bg-slate-700/40 border-slate-600' :
            'border-slate-700 hover:border-slate-500'
          )}
          title={`Status: ${checklistStatus}`}
        >
          {isDone && <Check size={10} className="text-emerald-400" />}
          {isSkipped && <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
        </button>
      )}

      {/* Language badge */}
      <span
        className={cn(
          'flex-shrink-0 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded font-mono',
        )}
        style={{
          background: `${langColor}20`,
          color: langColor,
          border: `1px solid ${langColor}40`,
        }}
      >
        {langLabel}
      </span>

      {/* Code (with truncation) */}
      <div
        className={cn(
          'flex-1 min-w-0 font-mono text-[11.5px] text-slate-100',
          'whitespace-pre-wrap break-all leading-relaxed max-h-20 overflow-hidden',
          isDone && 'line-through decoration-slate-600',
        )}
      >
        {copyText}
      </div>

      {/* Tags (max 2) */}
      <div className="flex-shrink-0 flex items-center gap-1 max-w-[150px] overflow-hidden">
        {(item.tags || []).slice(0, 2).map((tag: string) => (
          <span
            key={tag}
            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50 flex-shrink-0"
          >
            #{tag}
          </span>
        ))}
        {(item.tags || []).length > 2 && (
          <span className="text-[9px] text-slate-600 flex-shrink-0">
            +{(item.tags || []).length - 2}
          </span>
        )}
      </div>

      {/* Favorite */}
      <button
        onClick={(e) => { e.stopPropagation(); updatePlaybookItem(containerId, item.id, { isFavorite: !item.isFavorite }); }}
        className="flex-shrink-0 p-0.5 rounded hover:bg-amber-400/10 transition-colors"
        title={item.isFavorite ? 'Remove favorite' : 'Add favorite'}
      >
        <Star
          size={12}
          className={cn(
            'transition-colors',
            item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-700 hover:text-amber-400'
          )}
        />
      </button>

      {/* Actions (hover) */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center gap-0.5 transition-opacity',
          hovered ? 'opacity-100' : 'opacity-0',
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); handleCopy(e); }}
          className={cn(
            'p-1 rounded transition-colors',
            copied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
          )}
          title="Copy"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1 rounded text-slate-500 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
          title="Edit"
        >
          <Edit3 size={11} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete this command?')) deletePlaybookItem(containerId, item.id);
          }}
          className="p-1 rounded text-slate-500 hover:bg-red-500/15 hover:text-red-300 transition-colors"
          title="Delete"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 pointer-events-none">
          Copied!
        </div>
      )}
    </div>
  );
}
