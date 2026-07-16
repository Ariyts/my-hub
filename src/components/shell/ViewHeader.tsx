import type { ReactNode } from "react";

// ============================================
// ViewHeader — шапка коллекции (Задача 0.C / референсы)
// ============================================
// Переиспользуемый ярус-2 «браузера ресурсов»: строка-«хлебная крошка»,
// иконка в акцентном контейнере, крупный заголовок + подпись, пилюля-счётчик.
// Презентационный компонент, на дизайн-токенах. Акцентный цвет динамический
// (цвет категории), поэтому передаётся пропсом и применяется inline.

interface ViewHeaderProps {
  /** Верхняя мелкая строка, напр. "~/ Links" */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Иконка (lucide и т.п.); наследует акцентный цвет через currentColor */
  icon?: ReactNode;
  /** Акцент (hex категории). По умолчанию — брендовый --primary. */
  accent?: string;
  /** Число элементов для пилюли справа */
  count?: number;
  /** Подпись у счётчика: "items" / "links" / ... */
  countLabel?: string;
}

export function ViewHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  accent = "var(--primary)",
  count,
  countLabel = "items",
}: ViewHeaderProps) {
  return (
    <div className="px-3 pt-4 pb-3 sm:px-5">
      {eyebrow && (
        <div className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-subtle uppercase">
          {eyebrow}
        </div>
      )}

      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        </div>

        {count !== undefined && (
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
            {count} {countLabel}
          </div>
        )}
      </div>
    </div>
  );
}
