import { ChevronDown, FolderPlus, Plus, ArrowUpDown } from "lucide-react";

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
  title,
  totalCommands,
  sectionCount,
  favoriteCount,
  onExpand,
  onAddSection,
  onAddCommand,
  onImportExport,
}: Props) {
  return (
    <div className="flex h-10 items-center gap-3 border-b border-slate-800 bg-slate-900 px-6">
      {/* Icon (small) */}
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-slate-700/60 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-sm">
        🎯
      </div>

      {/* Title */}
      <h1 className="flex-shrink-0 truncate text-sm font-bold text-slate-100">{title}</h1>

      {/* Stats inline */}
      <div className="flex flex-shrink-0 items-center gap-2 text-[11px] text-slate-500">
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
          className="flex flex-shrink-0 items-center gap-1 rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-200 transition-colors hover:bg-slate-700"
          title="Import/Export playbook"
        >
          <ArrowUpDown size={11} className="text-cyan-400" />
          <span>I/O</span>
        </button>
      )}

      {/* Add Section button */}
      <button
        onClick={onAddSection}
        className="flex flex-shrink-0 items-center gap-1 rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-200 transition-colors hover:bg-slate-700"
        title="Add new section"
      >
        <FolderPlus size={11} className="text-cyan-400" />
        <span>Section</span>
      </button>

      {/* Add Command button */}
      <button
        onClick={onAddCommand}
        className="flex flex-shrink-0 items-center gap-1 rounded-md bg-cyan-500 px-2 py-1 text-[11px] font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-400"
        title="Add new command"
      >
        <Plus size={11} strokeWidth={2.5} />
        <span>Command</span>
      </button>

      {/* Expand button */}
      <button
        onClick={onExpand}
        className="flex-shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        title="Expand hero header"
      >
        <ChevronDown size={15} />
      </button>
    </div>
  );
}
