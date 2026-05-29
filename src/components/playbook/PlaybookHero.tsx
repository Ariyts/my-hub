import { Search, FolderPlus, Plus, ChevronsDown, ChevronsUp, ChevronUp, X, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { PlaybookContainer, PlaybookLanguage, PlaybookVariable } from '../../types';
import { getServiceIcon } from './constants';
import { ContextPanel } from './ContextPanel';

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
  container, totalCount, sectionCount, favoriteCount, variables,
  onAddSection, onAddCommand, onExpandAll, onCollapseAll, onCollapseHero, onImportExport,
}: HeroProps) {
  const icon = getServiceIcon(container.title);

  return (
    <div className="relative overflow-hidden border-b border-slate-800">
      {/* Decorative gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative px-6 py-6">
        <div className="flex items-start gap-4">
          {/* Icon tile */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-slate-700/60 flex items-center justify-center text-3xl backdrop-blur-sm shadow-xl shadow-black/20">
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-cyan-400">
                Playbook
              </span>
              <span className="text-slate-700">·</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Pentest Reference
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-50 truncate">
              {container.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-2.5 text-[11px]">
              <StatPill label="Commands" value={totalCount} color="#00BCD4" />
              <StatPill label="Sections" value={sectionCount} color="#8b5cf6" />
              <StatPill label="Favorites" value={favoriteCount} color="#fbbf24" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onExpandAll}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title="Expand all sections"
            >
              <ChevronsDown size={15} />
            </button>
            <button
              onClick={onCollapseAll}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title="Collapse all sections"
            >
              <ChevronsUp size={15} />
            </button>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            {onImportExport && (
              <button
                onClick={onImportExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors"
                title="Import/Export playbook"
              >
                <ArrowUpDown size={13} className="text-cyan-400" />
                I/O
              </button>
            )}
            <button
              onClick={onAddSection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors"
            >
              <FolderPlus size={13} className="text-cyan-400" />
              Section
            </button>
            <button
              onClick={onAddCommand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Plus size={13} strokeWidth={2.5} />
              Command
            </button>
            {onCollapseHero && (
              <button
                onClick={onCollapseHero}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
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
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="font-semibold text-slate-200">{value}</span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

// ===================== FILTER BAR =====================

export type StatusFilter = 'all' | 'pending' | 'done' | 'skipped';

export type ViewLayout = 'grid' | 'list' | 'markdown';

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  langFilter: PlaybookLanguage | 'all' | 'favorites';
  onLangFilterChange: (v: PlaybookLanguage | 'all' | 'favorites') => void;
  resultCount: number;
  mode: 'reference' | 'engagement';
  onModeChange: (m: 'reference' | 'engagement') => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (s: StatusFilter) => void;
  checklistCounts: { total: number; done: number; skipped: number; pending: number };
  layout: ViewLayout;
  onLayoutChange: (v: ViewLayout) => void;
  phaseFilter: string | 'all';
  onPhaseFilterChange: (p: string | 'all') => void;
  sections: { id: string; title: string; color?: string }[];
}

export function PlaybookFilters({
  search, onSearchChange, langFilter, onLangFilterChange, resultCount,
  mode, onModeChange, statusFilter, onStatusFilterChange, checklistCounts,
  layout, onLayoutChange, phaseFilter, onPhaseFilterChange, sections,
}: FiltersProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="px-6 py-3 space-y-2.5">
        {/* Search row + mode toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search commands, descriptions, tags…"
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400/60 focus:bg-slate-900 transition-colors"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium tabular-nums">
            <span className="text-slate-200 font-semibold">{resultCount}</span>
            <span className="ml-1">result{resultCount === 1 ? '' : 's'}</span>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
            <button
              onClick={() => onModeChange('reference')}
              className={cn(
                'px-3 py-1 rounded-md text-[11px] font-medium transition-all',
                mode === 'reference'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              📖 Reference
            </button>
            <button
              onClick={() => onModeChange('engagement')}
              className={cn(
                'px-3 py-1 rounded-md text-[11px] font-medium transition-all',
                mode === 'engagement'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              ✅ Engagement
            </button>
          </div>

          {/* Layout toggle: Grid / List / MD */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
            <button
              onClick={() => onLayoutChange('grid')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                layout === 'grid'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-200'
              )}
              title="Card view"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                layout === 'list'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-200'
              )}
              title="List view (compact, ⌘/Ctrl+L)"
            >
              <List size={13} />
            </button>
            <button
              onClick={() => onLayoutChange('markdown')}
              className={cn(
                'px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all',
                layout === 'markdown'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-200'
              )}
              title="Markdown view (edit as markdown)"
            >
              MD
            </button>
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterChip
            active={langFilter === 'all' && phaseFilter === 'all'}
            onClick={() => { onLangFilterChange('all'); onPhaseFilterChange('all'); }}
            label="All"
          />
          <FilterChip
            active={langFilter === 'favorites'}
            onClick={() => onLangFilterChange('favorites')}
            label="★ Favorites"
            activeColor="#fbbf24"
          />

          {/* Phase quick filters */}
          {sections.length > 0 && (
            <>
              <div className="w-px h-4 bg-slate-800 mx-1" />
              <FilterChip
                active={phaseFilter === 'recon'}
                onClick={() => onPhaseFilterChange(phaseFilter === 'recon' ? 'all' : 'recon')}
                label="🔍 Recon"
                activeColor="#3b82f6"
              />
              <FilterChip
                active={phaseFilter === 'exploit'}
                onClick={() => onPhaseFilterChange(phaseFilter === 'exploit' ? 'all' : 'exploit')}
                label="💥 Exploit"
                activeColor="#ef4444"
              />
              <FilterChip
                active={phaseFilter === 'post'}
                onClick={() => onPhaseFilterChange(phaseFilter === 'post' ? 'all' : 'post')}
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
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  e.target.value = '';
                }}
                className="text-[11px] px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 outline-none focus:border-cyan-400 cursor-pointer"
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
          {mode === 'engagement' && (
            <>
              <div className="w-px h-4 bg-slate-800 mx-1" />
              <FilterChip
                active={statusFilter === 'all'}
                onClick={() => onStatusFilterChange('all')}
                label={`All (${checklistCounts.total})`}
              />
              <FilterChip
                active={statusFilter === 'pending'}
                onClick={() => onStatusFilterChange('pending')}
                label={`Pending (${checklistCounts.pending})`}
                activeColor="#94a3b8"
              />
              <FilterChip
                active={statusFilter === 'done'}
                onClick={() => onStatusFilterChange('done')}
                label={`Done (${checklistCounts.done})`}
                activeColor="#10b981"
              />
              <FilterChip
                active={statusFilter === 'skipped'}
                onClick={() => onStatusFilterChange('skipped')}
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
  active, onClick, label, activeColor = '#00BCD4',
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
        'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border',
        active
          ? 'border-transparent text-slate-950 shadow-sm'
          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
      )}
      style={active ? { background: activeColor, color: '#0f172a' } : undefined}
    >
      {label}
    </button>
  );
}
