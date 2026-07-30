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
    <div className="flex h-10 items-center gap-3 border-b border-border bg-surface px-6">
      {/* Icon (small) */}
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-border-subtle bg-gradient-to-br from-playbooks/20 to-primary/20 text-sm">
        🎯
      </div>

      {/* Title */}
      <h1 className="flex-shrink-0 truncate text-sm font-bold text-foreground">{title}</h1>

      {/* Stats inline */}
      <div className="flex flex-shrink-0 items-center gap-2 text-[11px] text-subtle">
        <span>
          <span className="font-semibold text-foreground">{totalCommands}</span> cmds
        </span>
        <span className="text-subtle">·</span>
        <span>
          <span className="font-semibold text-foreground">{sectionCount}</span> sec
        </span>
        {favoriteCount > 0 && (
          <>
            <span className="text-subtle">·</span>
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
          className="flex flex-shrink-0 items-center gap-1 rounded-md border border-border-subtle bg-sunken px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-sunken"
          title="Import/Export playbook"
        >
          <ArrowUpDown size={11} className="text-playbooks" />
          <span>I/O</span>
        </button>
      )}

      {/* Add Section button */}
      <button
        onClick={onAddSection}
        className="flex flex-shrink-0 items-center gap-1 rounded-md border border-border-subtle bg-sunken px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-sunken"
        title="Add new section"
      >
        <FolderPlus size={11} className="text-playbooks" />
        <span>Section</span>
      </button>

      {/* Add Command button */}
      <button
        onClick={onAddCommand}
        className="flex flex-shrink-0 items-center gap-1 rounded-md bg-playbooks px-2 py-1 text-[11px] font-medium text-slate-950 shadow-lg transition-colors hover:opacity-90"
        title="Add new command"
      >
        <Plus size={11} strokeWidth={2.5} />
        <span>Command</span>
      </button>

      {/* Expand button */}
      <button
        onClick={onExpand}
        className="flex-shrink-0 rounded-md p-1.5 text-muted transition-colors hover:bg-sunken hover:text-foreground"
        title="Expand hero header"
      >
        <ChevronDown size={15} />
      </button>
    </div>
  );
}
