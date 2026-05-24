import { useState, useMemo } from 'react';
import { useStore } from '../store';
import type { PlaybookContainer, PlaybookItem, PlaybookLanguage } from '../types';
import { PlaybookHero, PlaybookFilters, type StatusFilter } from './playbook/PlaybookHero';
import { PlaybookSectionCard } from './playbook/PlaybookSectionCard';
import { InlineAddSection } from './playbook/InlineAddSection';
import { InlineAddCommand } from './playbook/InlineAddCommand';
import { EmptyState } from './playbook/EmptyStates';
import { CommandCard, type ViewMode } from './playbook/CommandCard';
import { stripMdMetadata, cleanDescription } from './playbook/utils';
import { useChecklist } from '../hooks/useChecklist';
import { HeroCollapsed } from './HeroCollapsed';
import { useHeroState } from '../hooks/useHeroState';

interface Props {
  container: PlaybookContainer;
}

type FilterMode = PlaybookLanguage | 'all' | 'favorites';

export function PlaybookView({ container }: Props) {
  const {
    addPlaybookItem, addPlaybookSection,
    updatePlaybookSection, deletePlaybookSection,
  } = useStore();

  const [search, setSearch] = useState('');
  const { heroExpanded, toggleHero } = useHeroState();
  const [langFilter, setLangFilter] = useState<FilterMode>('all');
  const [mode, setMode] = useState<ViewMode>('reference');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [addingSection, setAddingSection] = useState(false);
  const [addingToSection, setAddingToSection] = useState<string | undefined>(undefined);

  const variables = container.variables || [];

  // Sections sorted by order
  const sections = useMemo(() => {
    return [...(container.sections || [])].sort((a, b) => a.order - b.order);
  }, [container.sections]);

  const getItemsForSection = (sectionId: string) => {
    return container.subItems.filter((i) => i.sectionId === sectionId);
  };

  // All item IDs for checklist (across all sections + uncategorized)
  const allItemIds = useMemo(() => container.subItems.map((i) => i.id), [container.subItems]);
  const checklist = useChecklist(container.id, allItemIds);

  // Filtering logic
  const matchesSearch = (item: PlaybookItem): boolean => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (container.title.toLowerCase().includes(q)) return true;
    const cmd = stripMdMetadata(item.command).toLowerCase();
    const desc = (cleanDescription(item.description) || '').toLowerCase();
    const tags = item.tags.join(' ').toLowerCase();
    return cmd.includes(q) || desc.includes(q) || tags.includes(q);
  };

  const matchesLangFilter = (item: PlaybookItem): boolean => {
    if (langFilter === 'all') return true;
    if (langFilter === 'favorites') return item.isFavorite;
    return item.language === langFilter;
  };

  const matchesStatusFilter = (item: PlaybookItem): boolean => {
    if (mode !== 'engagement' || statusFilter === 'all') return true;
    return checklist.status(item.id) === statusFilter;
  };

  const filterItem = (item: PlaybookItem): boolean => {
    return matchesSearch(item) && matchesLangFilter(item) && matchesStatusFilter(item);
  };

  // Stats
  const totalCount = container.subItems.length;
  const sectionCount = sections.length;
  const favoriteCount = container.subItems.filter((i) => i.isFavorite).length;

  // Filtered items per section
  const filteredSections = useMemo(() => {
    return sections.map((sec) => {
      const items = getItemsForSection(sec.id);
      const filtered = items.filter(filterItem);
      return { section: sec, items: filtered };
    }).filter(({ items }) => items.length > 0 || (!search && langFilter === 'all' && statusFilter === 'all'));
  }, [sections, container.subItems, search, langFilter, statusFilter, mode, checklist]);

  const resultCount = filteredSections.reduce((sum, { items }) => sum + items.length, 0);
  const isFiltered = !!search || langFilter !== 'all' || (mode === 'engagement' && statusFilter !== 'all');

  // Handlers
  const handleAddSection = (title: string) => {
    addPlaybookSection(container.id, title);
    setAddingSection(false);
  };

  const handleAddItem = (data: {
    command: string;
    description: string;
    language: PlaybookLanguage;
    tags: string[];
    isFavorite: boolean;
    sectionId?: string;
  }) => {
    addPlaybookItem(container.id, data);
  };

  const handleToggleCollapse = (sectionId: string) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (sec) {
      updatePlaybookSection(container.id, sectionId, { collapsed: !sec.collapsed });
    }
  };

  const handleRenameSection = (sectionId: string, newTitle: string) => {
    updatePlaybookSection(container.id, sectionId, { title: newTitle });
  };

  const handleColorSection = (sectionId: string, color: string) => {
    updatePlaybookSection(container.id, sectionId, { color });
  };

  const handleDeleteSection = (sectionId: string) => {
    deletePlaybookSection(container.id, sectionId);
  };

  const handleExpandAll = () => {
    sections.forEach((sec) => {
      if (sec.collapsed) updatePlaybookSection(container.id, sec.id, { collapsed: false });
    });
  };

  const handleCollapseAll = () => {
    sections.forEach((sec) => {
      if (!sec.collapsed) updatePlaybookSection(container.id, sec.id, { collapsed: true });
    });
  };

  const handleAddCommandToFirstSection = () => {
    if (sections.length > 0) {
      setAddingToSection(sections[0].id);
    } else {
      setAddingToSection('__uncategorized__');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setLangFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Hero header — collapsible */}
      {heroExpanded ? (
        <PlaybookHero
          container={container}
          totalCount={totalCount}
          sectionCount={sectionCount}
          favoriteCount={favoriteCount}
          variables={variables}
          onAddSection={() => setAddingSection(true)}
          onAddCommand={handleAddCommandToFirstSection}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onCollapseHero={toggleHero}
        />
      ) : (
        <HeroCollapsed
          title={container.title}
          totalCommands={totalCount}
          sectionCount={sectionCount}
          favoriteCount={favoriteCount}
          onExpand={toggleHero}
          onAddSection={() => setAddingSection(true)}
          onAddCommand={handleAddCommandToFirstSection}
        />
      )}

      {/* Sticky filters */}
      <PlaybookFilters
        search={search}
        onSearchChange={setSearch}
        langFilter={langFilter}
        onLangFilterChange={setLangFilter}
        resultCount={resultCount}
        mode={mode}
        onModeChange={setMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        checklistCounts={checklist.counts}
      />

      {/* Engagement mode banner */}
      {mode === 'engagement' && (
        <div className="px-6 py-2 bg-emerald-500/5 border-b border-emerald-500/20 flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-emerald-300 font-semibold">Engagement Mode</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              Progress: <span className="text-emerald-300 font-medium">{checklist.counts.done}</span> done
              {checklist.counts.skipped > 0 && <> · <span className="text-amber-300 font-medium">{checklist.counts.skipped}</span> skipped</>}
              <span className="text-slate-500"> / {checklist.counts.total}</span>
            </span>
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden max-w-xs">
            <div className="h-full flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: checklist.counts.total > 0 ? `${(checklist.counts.done / checklist.counts.total) * 100}%` : 0 }}
              />
              <div
                className="h-full bg-amber-500/70"
                style={{ width: checklist.counts.total > 0 ? `${(checklist.counts.skipped / checklist.counts.total) * 100}%` : 0 }}
              />
            </div>
          </div>
          {checklist.counts.done + checklist.counts.skipped > 0 && (
            <button
              onClick={() => {
                if (confirm('Reset all progress for this playbook?')) checklist.reset();
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset progress
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
          {/* Inline add section */}
          {addingSection && (
            <InlineAddSection
              onAdd={handleAddSection}
              onClose={() => setAddingSection(false)}
            />
          )}

          {/* Empty state */}
          {sections.length === 0 && !addingSection && (
            <EmptyState
              hasSections={false}
              isFiltered={false}
              onAddSection={() => setAddingSection(true)}
            />
          )}

          {/* No results from filters */}
          {sections.length > 0 && filteredSections.length === 0 && isFiltered && (
            <EmptyState
              hasSections={true}
              isFiltered={true}
              onAddSection={() => {}}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Sections */}
          {filteredSections.map(({ section, items }) => (
            <div key={section.id} className="space-y-2">
              <PlaybookSectionCard
                section={section}
                items={items}
                containerId={container.id}
                mode={mode}
                variables={variables}
                getChecklistStatus={(id) => checklist.status(id)}
                onChecklistCycle={(id) => checklist.cycle(id)}
                onToggleCollapse={() => handleToggleCollapse(section.id)}
                onRenameSection={(newTitle) => handleRenameSection(section.id, newTitle)}
                onDeleteSection={() => handleDeleteSection(section.id)}
                onColorSection={(color) => handleColorSection(section.id, color)}
                onAddItem={() => setAddingToSection(section.id)}
              />

              {/* Inline add command to this section */}
              {addingToSection === section.id && (
                <InlineAddCommand
                  onAdd={handleAddItem}
                  onClose={() => setAddingToSection(undefined)}
                  sectionId={section.id}
                />
              )}
            </div>
          ))}

          {/* Uncategorized items (no sectionId) */}
          {container.subItems.filter((i) => !i.sectionId).length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Uncategorized</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {container.subItems
                  .filter((i) => !i.sectionId)
                  .filter(filterItem)
                  .map((item) => (
                    <CommandCard
                      key={item.id}
                      item={item}
                      containerId={container.id}
                      mode={mode}
                      variables={variables}
                      checklistStatus={checklist.status(item.id)}
                      onChecklistCycle={() => checklist.cycle(item.id)}
                    />
                  ))}
              </div>
              {addingToSection === '__uncategorized__' && (
                <div className="mt-3">
                  <InlineAddCommand
                    onAdd={handleAddItem}
                    onClose={() => setAddingToSection(undefined)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
