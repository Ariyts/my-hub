import {
  Search,
  FolderPlus,
  Plus,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { PlaybookContainer, PlaybookLanguage, PlaybookVariable } from "../../types";
import { getServiceIcon } from "./constants";
import { ContextPanel } from "./ContextPanel";

interface HeroProps {
  container: PlaybookContainer;
  totalCount: number;
  sectionCount: number;
  favoriteCount: number;
  variables: PlaybookVariable[];
  onAddSection: () => void;
  onAddCommand: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onCollapseHero?: () => void;
  onImportExport?: () => void;
}

export function PlaybookHero({
  container,
  totalCount,
  sectionCount,
  favoriteCount,
  variables,
  onAddSection,
  onAddCommand,
  onExpandAll,
  onCollapseAll,
  onCollapseHero,
  onImportExport,
}: HeroProps) {
  const icon = getServiceIcon(container.title);

  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Decorative gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-background to-violet-500/10" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative px-3 py-4 sm:px-6 sm:py-6">
        {/* На мобильном кнопки действий переносятся на свою строку */}
        <div className="flex flex-wrap items-start gap-3 sm:gap-4">
          {/* Icon tile */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border-subtle bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-2xl shadow-xl shadow-black/20 backdrop-blur-sm sm:h-16 sm:w-16 sm:text-3xl">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                Playbook
              </span>
              <span className="text-subtle">·</span>
              <span className="text-[10px] tracking-wider text-subtle uppercase">
                Pentest Reference
              </span>
            </div>
            <h1 className="truncate text-2xl font-bold text-foreground">{container.title}</h1>

            {/* Stats */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
              <StatPill label="Commands" value={totalCount} color="#00BCD4" />
              <StatPill label="Sections" value={sectionCount} color="#8b5cf6" />
              <StatPill label="Favorites" value={favoriteCount} color="#fbbf24" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full shrink-0 items-center justify-end gap-1.5 sm:w-auto">
            <button
              onClick={onExpandAll}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-sunken hover:text-foreground"
              title="Expand all sections"
            >
              <ChevronsDown size={15} />
            </button>
            <button
              onClick={onCollapseAll}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-sunken hover:text-foreground"
              title="Collapse all sections"
            >
              <ChevronsUp size={15} />
            </button>
            <div className="mx-1 h-5 w-px bg-border" />
            {onImportExport && (
              <button
                onClick={onImportExport}
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-sunken"
                title="Import/Export playbook"
              >
                <ArrowUpDown size={13} className="text-cyan-400" />
                I/O
              </button>
            )}
            <button
              onClick={onAddSection}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-sunken"
            >
              <FolderPlus size={13} className="text-cyan-400" />
              Section
            </button>
            <button
              onClick={onAddCommand}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-400"
            >
              <Plus size={13} strokeWidth={2.5} />
              Command
            </button>
            {onCollapseHero && (
              <button
                onClick={onCollapseHero}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-sunken hover:text-foreground"
                title="Collapse hero header"
              >
                <ChevronUp size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Context variables panel */}
      <div className="relative">
        <ContextPanel containerId={container.id} variables={variables} />
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-subtle">{label}</span>
    </div>
  );
}

// ===================== FILTER BAR =====================

export type StatusFilter = "all" | "pending" | "done" | "skipped";

export type ViewLayout = "grid" | "list" | "markdown";

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  langFilter: PlaybookLanguage | "all" | "favorites";
  onLangFilterChange: (v: PlaybookLanguage | "all" | "favorites") => void;
  resultCount: number;
  mode: "reference" | "engagement";
  onModeChange: (m: "reference" | "engagement") => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (s: StatusFilter) => void;
  checklistCounts: { total: number; done: number; skipped: number; pending: number };
  layout: ViewLayout;
  onLayoutChange: (v: ViewLayout) => void;
  phaseFilter: string | "all";
  onPhaseFilterChange: (p: string | "all") => void;
  sections: { id: string; title: string; color?: string }[];
}

export function PlaybookFilters({
  search,
  onSearchChange,
  langFilter,
  onLangFilterChange,
  resultCount,
  mode,
  onModeChange,
  statusFilter,
  onStatusFilterChange,
  checklistCounts,
  layout,
  onLayoutChange,
  phaseFilter,
  onPhaseFilterChange,
  sections,
}: FiltersProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="space-y-2.5 px-3 py-3 sm:px-6">
        {/* Search row + mode toggle. На мобильном переносится по строкам */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative max-w-xl min-w-[180px] flex-1">
            <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search commands, descriptions, tags…"
              inputMode="search"
              enterKeyHint="search"
              className="w-full rounded-lg border border-border bg-surface py-2 pr-8 pl-9 text-sm text-foreground placeholder-subtle transition-colors outline-none focus:border-cyan-400/60 focus:bg-surface"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-subtle transition-colors hover:bg-sunken hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="text-[11px] font-medium text-subtle tabular-nums">
            <span className="font-semibold text-foreground">{resultCount}</span>
            <span className="ml-1">result{resultCount === 1 ? "" : "s"}</span>
          </div>

          {/* Mode toggle */}
          <div className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-border bg-surface p-0.5">
            <button
              onClick={() => onModeChange("reference")}
              className={cn(
                "rounded-md px-3 py-1 text-[11px] font-medium transition-all",
                mode === "reference"
                  ? "bg-sunken text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              📖 Reference
            </button>
            <button
              onClick={() => onModeChange("engagement")}
              className={cn(
                "rounded-md px-3 py-1 text-[11px] font-medium transition-all",
                mode === "engagement"
                  ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              ✅ Engagement
            </button>
          </div>

          {/* Layout toggle: Grid / List / MD */}
          <div className="flex flex-shrink-0 items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
            <button
              onClick={() => onLayoutChange("grid")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                layout === "grid"
                  ? "bg-sunken text-cyan-400 shadow-sm"
                  : "text-subtle hover:text-foreground",
              )}
              title="Card view"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => onLayoutChange("list")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                layout === "list"
                  ? "bg-sunken text-cyan-400 shadow-sm"
                  : "text-subtle hover:text-foreground",
              )}
              title="List view (compact, ⌘/Ctrl+L)"
            >
              <List size={13} />
            </button>
            <button
              onClick={() => onLayoutChange("markdown")}
              className={cn(
                "rounded-md px-2 py-1 font-mono text-[11px] font-bold transition-all",
                layout === "markdown"
                  ? "bg-sunken text-cyan-300 shadow-sm"
                  : "text-subtle hover:text-foreground",
              )}
              title="Markdown view (edit as markdown)"
            >
              MD
            </button>
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip
            active={langFilter === "all" && phaseFilter === "all"}
            onClick={() => {
              onLangFilterChange("all");
              onPhaseFilterChange("all");
            }}
            label="All"
          />
          <FilterChip
            active={langFilter === "favorites"}
            onClick={() => onLangFilterChange("favorites")}
            label="★ Favorites"
            activeColor="#fbbf24"
          />

          {/* Phase quick filters */}
          {sections.length > 0 && (
            <>
              <div className="mx-1 h-4 w-px bg-border" />
              <FilterChip
                active={phaseFilter === "recon"}
                onClick={() => onPhaseFilterChange(phaseFilter === "recon" ? "all" : "recon")}
                label="🔍 Recon"
                activeColor="#3b82f6"
              />
              <FilterChip
                active={phaseFilter === "exploit"}
                onClick={() => onPhaseFilterChange(phaseFilter === "exploit" ? "all" : "exploit")}
                label="💥 Exploit"
                activeColor="#ef4444"
              />
              <FilterChip
                active={phaseFilter === "post"}
                onClick={() => onPhaseFilterChange(phaseFilter === "post" ? "all" : "post")}
                label="🏴 Post"
                activeColor="#22c55e"
              />
            </>
          )}

          {/* Jump to section dropdown */}
          {sections.length > 0 && (
            <>
              <div className="flex-1" />
              <select
                value=""
                onChange={(e) => {
                  const sectionId = e.target.value;
                  if (!sectionId) return;
                  const el = document.getElementById(`section-${sectionId}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  e.target.value = "";
                }}
                className="cursor-pointer rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted outline-none focus:border-cyan-400"
              >
                <option value="">Jump to section…</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Engagement mode: status filters */}
          {mode === "engagement" && (
            <>
              <div className="mx-1 h-4 w-px bg-border" />
              <FilterChip
                active={statusFilter === "all"}
                onClick={() => onStatusFilterChange("all")}
                label={`All (${checklistCounts.total})`}
              />
              <FilterChip
                active={statusFilter === "pending"}
                onClick={() => onStatusFilterChange("pending")}
                label={`Pending (${checklistCounts.pending})`}
                activeColor="#94a3b8"
              />
              <FilterChip
                active={statusFilter === "done"}
                onClick={() => onStatusFilterChange("done")}
                label={`Done (${checklistCounts.done})`}
                activeColor="#10b981"
              />
              <FilterChip
                active={statusFilter === "skipped"}
                onClick={() => onStatusFilterChange("skipped")}
                label={`Skipped (${checklistCounts.skipped})`}
                activeColor="#f59e0b"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  activeColor = "#00BCD4",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all",
        active
          ? "border-transparent text-slate-950 shadow-sm"
          : "border-border bg-surface/60 text-muted hover:border-border-subtle hover:text-foreground",
      )}
      style={active ? { background: activeColor, color: "#0f172a" } : undefined}
    >
      {label}
    </button>
  );
}
