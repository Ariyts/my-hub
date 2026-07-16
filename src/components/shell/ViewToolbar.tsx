import { type ReactNode } from "react";
import { Search } from "lucide-react";

// ============================================
// ViewToolbar — верхняя панель управления (Задача 0.C / референсы)
// ============================================
// Переиспользуемый ярус-1 «браузера ресурсов»: поиск (с хинтом ⌘K),
// быстрые фильтры-чипы, сегмент сортировки, переключатель раскладок и слот
// для дополнительных кнопок справа. Презентационный, на дизайн-токенах.
// Акцент динамический (цвет категории) — передаётся пропсом.

export interface ToolbarFilter {
  key: string;
  label: string;
  icon?: ReactNode;
  active: boolean;
  onToggle: () => void;
}

export interface SegmentOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ViewToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  /** Быстрые фильтры-переключатели (напр. Starred) */
  filters?: ToolbarFilter[];
  /** Сегмент сортировки */
  sortOptions?: SegmentOption[];
  sortValue?: string;
  onSort?: (value: string) => void;
  /** Переключатель раскладок */
  layoutOptions: SegmentOption[];
  layout: string;
  onLayout: (value: string) => void;
  /** Дополнительные кнопки справа (Section, I/O и т.п.) */
  rightSlot?: ReactNode;
  /** Акцент (hex категории) для активных состояний */
  accent?: string;
}

export function ViewToolbar({
  search,
  onSearch,
  searchPlaceholder = "Search...",
  filters,
  sortOptions,
  sortValue,
  onSort,
  layoutOptions,
  layout,
  onLayout,
  rightSlot,
  accent = "var(--primary)",
}: ViewToolbarProps) {
  // Активный чип/сегмент: акцентная подложка + акцентный текст
  const activeStyle = {
    background: `color-mix(in srgb, ${accent} 18%, transparent)`,
    color: accent,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 sm:px-4 sm:py-3">
      {/* Поиск с хинтом ⌘K */}
      <div className="relative order-last w-full sm:order-0 sm:w-64">
        <Search
          size={15}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
          aria-hidden
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="focus:border-(--focus-ring) w-full rounded-lg border border-border bg-surface py-1.5 pr-12 pl-9 text-sm text-foreground outline-none"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle">
          ⌘K
        </kbd>
      </div>

      {/* Быстрые фильтры */}
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={f.onToggle}
              aria-pressed={f.active}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface"
              style={f.active ? activeStyle : undefined}
            >
              {f.icon}
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Сортировка */}
      {sortOptions && sortOptions.length > 0 && (
        <div className="flex items-center gap-1 rounded-lg bg-surface p-1">
          {sortOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => onSort?.(o.value)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors"
              style={sortValue === o.value ? activeStyle : undefined}
              title={o.label}
            >
              {o.icon}
              <span className="hidden sm:inline">{o.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Раскладки */}
      <div className="flex items-center gap-1 rounded-lg bg-surface p-1">
        {layoutOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onLayout(o.value)}
            className="rounded-md p-1.5 text-muted transition-colors"
            style={layout === o.value ? activeStyle : undefined}
            title={o.label}
            aria-label={o.label}
          >
            {o.icon}
          </button>
        ))}
      </div>

      {rightSlot}
    </div>
  );
}
