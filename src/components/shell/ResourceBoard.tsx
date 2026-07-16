import type { ReactNode } from "react";
import { ResourceCard } from "./ResourceCard";
import type { ResourceRowData } from "./ResourceList";

// ============================================
// ResourceBoard — канбан-раскладка (Задача 0.C / референсы)
// ============================================
// Горизонтальные колонки (одна на категорию/секцию) с вертикальным стеком
// карточек. Презентационный, на дизайн-токенах.

export interface BoardColumn {
  id: string;
  title: string;
  accent?: string;
  icon?: ReactNode;
  items: ResourceRowData[];
}

export function ResourceBoard({
  columns,
  activeTags,
  onTagClick,
}: {
  columns: BoardColumn[];
  activeTags?: string[];
  onTagClick?: (tag: string) => void;
}) {
  return (
    // На узком экране (<768px) колонки стекаются вертикально на всю ширину —
    // без горизонтальной прокрутки; на десктопе — привычный канбан со скроллом вбок.
    <div className="flex flex-col gap-3 md:flex-row md:overflow-x-auto md:pb-2">
      {columns.map((col) => {
        const accent = col.accent || "var(--primary)";
        return (
          <div
            key={col.id}
            className="flex w-full flex-col overflow-hidden rounded-xl border border-border md:w-72 md:shrink-0"
          >
            {/* Шапка колонки */}
            <div
              className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2"
              style={{ borderTop: `2px solid ${accent}` }}
            >
              {col.icon}
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {col.title}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  background: `color-mix(in srgb, ${accent} 16%, transparent)`,
                  color: accent,
                }}
              >
                {col.items.length}
              </span>
            </div>

            {/* Карточки */}
            <div className="flex flex-col gap-2 p-2">
              {col.items.length > 0 ? (
                col.items.map((item) => (
                  <ResourceCard
                    key={item.id}
                    title={item.title}
                    url={item.url}
                    description={item.description}
                    favicon={item.favicon}
                    accent={item.accent || accent}
                    tags={item.tags}
                    starred={item.starred}
                    level={item.level}
                    activeTags={activeTags}
                    onTagClick={onTagClick}
                    onToggleStar={item.onToggleStar}
                    onOpen={item.onOpen}
                    onDelete={item.onDelete}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-xs text-subtle">No links</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
