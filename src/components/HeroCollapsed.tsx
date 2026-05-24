import { ChevronDown, FolderPlus, Plus, ArrowUpDown } from 'lucide-react';

interface Props {
  title: string;
  totalCommands: number;
  sectionCount: number;
  favoriteCount: number;
  onExpand: () => void;
  onAddSection: () => void;
  onAddCommand: () => void;
  onImportExport?: () => void;
}

/**
 * Compact hero header (40px height) — shown when hero is collapsed.
 * Uses Tailwind classes to match the new PlaybookView design.
 */
export function HeroCollapsed({
  title, totalCommands, sectionCount, favoriteCount,
  onExpand, onAddSection, onAddCommand, onImportExport,
}: Props) {
  return (
    <div className="flex items-center gap-3 h-10 px-6 border-b border-slate-800 bg-slate-900">
      {/* Icon (small) */}
      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-slate-700/60 flex items-center justify-center text-sm flex-shrink-0">
        🎯
      </div>

      {/* Title */}
      <h1 className="text-sm font-bold text-slate-100 truncate flex-shrink-0">
        {title}
      </h1>

      {/* Stats inline */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-shrink-0">
        <span>
          <span className="font-semibold text-slate-200">{totalCommands}</span> cmds
        </span>
        <span className="text-slate-700">·</span>
        <span>
          <span className="font-semibold text-slate-200">{sectionCount}</span> sec
        </span>
        {favoriteCount > 0 && (
          <>
            <span className="text-slate-700">·</span>
            <span>
              <span className="font-semibold text-amber-400">{favoriteCount}</span> ★
            </span>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Import/Export button */}
      {onImportExport && (
        <button
          onClick={onImportExport}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors flex-shrink-0"
          title="Import/Export playbook"
        >
          <ArrowUpDown size={11} className="text-cyan-400" />
          <span>I/O</span>
        </button>
      )}

      {/* Add Section button */}
      <button
        onClick={onAddSection}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors flex-shrink-0"
        title="Add new section"
      >
        <FolderPlus size={11} className="text-cyan-400" />
        <span>Section</span>
      </button>

      {/* Add Command button */}
      <button
        onClick={onAddCommand}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 flex-shrink-0"
        title="Add new command"
      >
        <Plus size={11} strokeWidth={2.5} />
        <span>Command</span>
      </button>

      {/* Expand button */}
      <button
        onClick={onExpand}
        className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors flex-shrink-0"
        title="Expand hero header"
      >
        <ChevronDown size={15} />
      </button>
    </div>
  );
}
