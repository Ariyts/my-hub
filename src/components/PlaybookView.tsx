import { useState, useMemo, useEffect } from "react";
import { useStore } from "../store";
import type { PlaybookContainer, PlaybookItem, PlaybookLanguage } from "../types";
import { PlaybookHero, PlaybookFilters, type StatusFilter } from "./playbook/PlaybookHero";
import { PlaybookSectionCard } from "./playbook/PlaybookSectionCard";
import { InlineAddSection } from "./playbook/InlineAddSection";
import { InlineAddCommand } from "./playbook/InlineAddCommand";
import { EmptyState } from "./playbook/EmptyStates";
import { CommandCard, type ViewMode } from "./playbook/CommandCard";
import { stripMdMetadata, cleanDescription } from "./playbook/utils";
import { getPhaseTag } from "./playbook/constants";
import { useChecklist } from "../hooks/useChecklist";
import { HeroCollapsed } from "./HeroCollapsed";
import { useHeroState } from "../hooks/useHeroState";
import { useViewLayout } from "../hooks/useViewLayout";
import { CommandListItem } from "./playbook/CommandListItem";
import { ImportExportModal } from "./ImportExportModal";
import { MarkdownView } from "./playbook/MarkdownView";
import { generateSectionExport } from "../utils/importExport";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

interface Props {
  container: PlaybookContainer;
}

type FilterMode = PlaybookLanguage | "all" | "favorites";

// Значение чипа фильтра → фаза из getPhaseTag
const PHASE_FILTER_TAGS: Record<string, string> = {
  recon: "RECON",
  exploit: "EXPLOIT",
  post: "POST",
};

export function PlaybookView({ container }: Props) {
  const {
    addPlaybookItem,
    addPlaybookSection,
    updatePlaybookSection,
    deletePlaybookSection,
    reorderPlaybookSections,
    reorderPlaybookItems,
  } = useStore();

  // DnD секций (Задача 3.1). Перетаскивание отключено при активных фильтрах:
  // порядок в отфильтрованном списке не соответствует реальному.
  const [sectionDrag, setSectionDrag] = useState<{
    id: string | null;
    overIndex: number | null;
  }>({ id: null, overIndex: null });

  const [search, setSearch] = useState("");
  const { heroExpanded, toggleHero } = useHeroState();
  const [layout, setLayout] = useViewLayout();
  const { copy } = useCopyToClipboard();
  const [langFilter, setLangFilter] = useState<FilterMode>("all");
  const [mode, setMode] = useState<ViewMode>("reference");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addingSection, setAddingSection] = useState(false);
  const [addingToSection, setAddingToSection] = useState<string | undefined>(undefined);
  const [showImportExport, setShowImportExport] = useState(false);
  const [phaseFilter, setPhaseFilter] = useState<string | "all">("all");

  // Keyboard shortcut: Cmd/Ctrl+L to toggle layout
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setLayout(layout === "grid" ? "list" : "grid");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [layout, setLayout]);

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
    const desc = (cleanDescription(item.description) || "").toLowerCase();
    const tags = item.tags.join(" ").toLowerCase();
    return cmd.includes(q) || desc.includes(q) || tags.includes(q);
  };

  const matchesLangFilter = (item: PlaybookItem): boolean => {
    if (langFilter === "all") return true;
    if (langFilter === "favorites") return item.isFavorite;
    return item.language === langFilter;
  };

  const matchesStatusFilter = (item: PlaybookItem): boolean => {
    if (mode !== "engagement" || statusFilter === "all") return true;
    return checklist.status(item.id) === statusFilter;
  };

  // Фильтр фаз опирается на тот же getPhaseTag, что и бейджи, — раньше здесь была
  // вторая, расходящаяся regex-таблица (напр. «shell» получал бейдж EXPLOIT,
  // но фильтром «exploit» не находился)
  const matchesPhaseFilter = (item: PlaybookItem): boolean => {
    if (phaseFilter === "all") return true;
    const section = sections.find((s) => s.id === item.sectionId);
    if (!section) return false;
    const expected = PHASE_FILTER_TAGS[phaseFilter];
    return expected ? getPhaseTag(section.title) === expected : true;
  };

  const filterItem = (item: PlaybookItem): boolean => {
    return (
      matchesSearch(item) &&
      matchesLangFilter(item) &&
      matchesStatusFilter(item) &&
      matchesPhaseFilter(item)
    );
  };

  // Stats
  const totalCount = container.subItems.length;
  const sectionCount = sections.length;
  const favoriteCount = container.subItems.filter((i) => i.isFavorite).length;

  // Filtered items per section
  const filteredSections = useMemo(() => {
    return sections
      .map((sec) => {
        const items = getItemsForSection(sec.id);
        const filtered = items.filter(filterItem);
        return { section: sec, items: filtered };
      })
      .filter(
        ({ items }) =>
          items.length > 0 ||
          (!search && langFilter === "all" && phaseFilter === "all" && statusFilter === "all"),
      );
  }, [
    sections,
    container.subItems,
    search,
    langFilter,
    statusFilter,
    phaseFilter,
    mode,
    checklist,
  ]);

  const resultCount = filteredSections.reduce((sum, { items }) => sum + items.length, 0);
  const isFiltered =
    !!search ||
    langFilter !== "all" ||
    phaseFilter !== "all" ||
    (mode === "engagement" && statusFilter !== "all");

  // --- DnD секций ---
  const sectionDragEnabled = !isFiltered;

  const handleSectionDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setSectionDrag({ id, overIndex: null });
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    if (!sectionDrag.id) return;
    e.preventDefault();
    setSectionDrag((d) => (d.overIndex === index ? d : { ...d, overIndex: index }));
  };

  const handleSectionDrop = () => {
    const { id, overIndex } = sectionDrag;
    setSectionDrag({ id: null, overIndex: null });
    if (!id || overIndex === null) return;

    const ordered = [...sections];
    const from = ordered.findIndex((s) => s.id === id);
    if (from === -1 || from === overIndex) return;

    const [moved] = ordered.splice(from, 1);
    ordered.splice(overIndex, 0, moved);
    reorderPlaybookSections(
      container.id,
      ordered.map((s) => s.id),
    );
  };

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

  /**
   * Экспорт одной секции в markdown (Задача 3.6). Формат тот же, что у полного
   * экспорта, поэтому файл можно импортировать обратно в режиме append.
   */
  const handleExportSection = (sectionId: string, kind: "copy" | "download") => {
    const md = generateSectionExport(container, sectionId);
    if (!md) return;

    if (kind === "copy") {
      copy(md);
      return;
    }

    const section = (container.sections || []).find((s) => s.id === sectionId);
    const slug = (section?.title || "section")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "section"}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
      setAddingToSection("__uncategorized__");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setLangFilter("all");
    setStatusFilter("all");
    setPhaseFilter("all");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950">
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
          onImportExport={() => setShowImportExport(true)}
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
          onImportExport={() => setShowImportExport(true)}
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
        layout={layout}
        onLayoutChange={setLayout}
        phaseFilter={phaseFilter}
        onPhaseFilterChange={setPhaseFilter}
        sections={sections.map((s) => ({ id: s.id, title: s.title, color: s.color }))}
      />

      {/* Engagement mode banner */}
      {mode === "engagement" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-emerald-500/20 bg-emerald-500/5 px-3 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-emerald-300">Engagement Mode</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              Progress:{" "}
              <span className="font-medium text-emerald-300">{checklist.counts.done}</span> done
              {checklist.counts.skipped > 0 && (
                <>
                  {" "}
                  · <span className="font-medium text-amber-300">
                    {checklist.counts.skipped}
                  </span>{" "}
                  skipped
                </>
              )}
              <span className="text-slate-500"> / {checklist.counts.total}</span>
            </span>
          </div>
          <div className="h-1.5 max-w-xs flex-1 overflow-hidden rounded-full bg-slate-800">
            <div className="flex h-full">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width:
                    checklist.counts.total > 0
                      ? `${(checklist.counts.done / checklist.counts.total) * 100}%`
                      : 0,
                }}
              />
              <div
                className="h-full bg-amber-500/70"
                style={{
                  width:
                    checklist.counts.total > 0
                      ? `${(checklist.counts.skipped / checklist.counts.total) * 100}%`
                      : 0,
                }}
              />
            </div>
          </div>
          {checklist.counts.done + checklist.counts.skipped > 0 && (
            <button
              onClick={() => {
                if (confirm("Reset all progress for this playbook?")) checklist.reset();
              }}
              className="text-[11px] text-slate-400 transition-colors hover:text-slate-200"
            >
              Reset progress
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {layout === "markdown" ? (
        <MarkdownView playbook={container} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-4 px-6 py-6">
            {/* Inline add section */}
            {addingSection && (
              <InlineAddSection onAdd={handleAddSection} onClose={() => setAddingSection(false)} />
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
            {filteredSections.map(({ section, items }, sectionIndex) => (
              <div
                key={section.id}
                className="space-y-2"
                onDragOver={(e) => sectionDragEnabled && handleSectionDragOver(e, sectionIndex)}
                onDrop={handleSectionDrop}
                style={{ opacity: sectionDrag.id === section.id ? 0.5 : 1 }}
              >
                {/* Индикатор места вставки */}
                {sectionDrag.id && sectionDrag.id !== section.id && sectionDrag.overIndex === sectionIndex && (
                  <div className="h-1 rounded-full bg-cyan-400" />
                )}
                <PlaybookSectionCard
                  onDragStartSection={
                    sectionDragEnabled ? (e) => handleSectionDragStart(e, section.id) : undefined
                  }
                  onDragEndSection={() => setSectionDrag({ id: null, overIndex: null })}
                  onReorderItems={
                    sectionDragEnabled
                      ? (itemIds) => reorderPlaybookItems(container.id, itemIds)
                      : undefined
                  }
                  section={section}
                  items={items}
                  containerId={container.id}
                  mode={mode}
                  variables={variables}
                  layout={layout}
                  getChecklistStatus={(id) => checklist.status(id)}
                  onChecklistCycle={(id) => checklist.cycle(id)}
                  onToggleCollapse={() => handleToggleCollapse(section.id)}
                  onRenameSection={(newTitle) => handleRenameSection(section.id, newTitle)}
                  onDeleteSection={() => handleDeleteSection(section.id)}
                  onColorSection={(color) => handleColorSection(section.id, color)}
                  onAddItem={() => setAddingToSection(section.id)}
                  onExportSection={(kind) => handleExportSection(section.id, kind)}
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
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
                <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-slate-300">
                  Uncategorized
                </h3>
                {layout === "list" ? (
                  <div className="divide-y divide-slate-800/40">
                    {container.subItems
                      .filter((i) => !i.sectionId)
                      .filter(filterItem)
                      .map((item) => (
                        <CommandListItem
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
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 p-4 pt-2">
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
                )}
                {addingToSection === "__uncategorized__" && (
                  <div className={layout === "list" ? "" : "mt-3 px-4 pb-4"}>
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
      )}

      {/* Import/Export modal */}
      {showImportExport && (
        <ImportExportModal playbook={container} onClose={() => setShowImportExport(false)} />
      )}
    </div>
  );
}
