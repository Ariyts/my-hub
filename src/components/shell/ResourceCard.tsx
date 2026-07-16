import { useState, type ReactNode } from "react";
import { Copy, Check, ExternalLink, Trash2, Globe } from "lucide-react";
import { Chip, Badge, LevelBadge } from "./Badge";
import { StarToggle } from "./StarToggle";
import { domainOf } from "./util";

// ============================================
// ResourceCard — карточка ресурса (Задача 0.C / референсы)
// ============================================
// Богатая browse-карточка: фавикон + домен-eyebrow, заголовок, описание,
// теги, опциональные бейджи категории/уровня, звезда и действия (copy/open/
// delete) по наведению. Презентационная, на дизайн-токенах.

interface ResourceCardProps {
  title: string;
  url?: string;
  description?: string;
  favicon?: string;
  /** Акцент (hex категории/секции) для фолбэк-иконки */
  accent?: string;
  tags?: string[];
  starred?: boolean;
  onToggleStar?: () => void;
  onOpen?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  /** Опциональный бейдж категории */
  categoryLabel?: string;
  /** Опциональный бейдж уровня (L1/L2/L3) */
  level?: string;
  /** Доп. иконка категории для бейджа */
  categoryIcon?: ReactNode;
}

export function ResourceCard({
  title,
  url,
  description,
  favicon,
  accent = "var(--primary)",
  tags,
  starred,
  onToggleStar,
  onOpen,
  onCopy,
  onDelete,
  categoryLabel,
  level,
  categoryIcon,
}: ResourceCardProps) {
  const [copied, setCopied] = useState(false);
  const [faviconOk, setFaviconOk] = useState(true);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 transition-all hover:border-border-subtle hover:shadow-lg">
      {/* Верхняя строка: фавикон + домен + звезда */}
      <div className="flex items-center gap-2">
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md"
          style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
        >
          {favicon && faviconOk ? (
            <img
              src={favicon}
              alt=""
              className="h-4 w-4"
              onError={() => setFaviconOk(false)}
            />
          ) : (
            <Globe size={13} style={{ color: accent }} />
          )}
        </div>
        <span className="min-w-0 flex-1 truncate text-[11px] tracking-wide text-subtle uppercase">
          {domainOf(url)}
        </span>
        {onToggleStar && (
          <StarToggle active={!!starred} onToggle={onToggleStar} size={14} />
        )}
      </div>

      {/* Заголовок */}
      <button
        onClick={onOpen}
        className="text-left text-sm font-semibold text-foreground hover:underline"
        title={title}
      >
        <span className="line-clamp-1">{title}</span>
      </button>

      {/* Описание */}
      {description && <p className="line-clamp-2 text-xs text-muted">{description}</p>}

      {/* Теги */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((t) => (
            <Chip key={t} label={t} />
          ))}
        </div>
      )}

      {/* Низ: бейджи слева, действия справа (по hover) */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {categoryLabel && <Badge label={categoryLabel} icon={categoryIcon} accent={accent} />}
          {level && <LevelBadge level={level} />}
        </div>
        <div className="flex items-center gap-0.5">
          {onCopy && (
            <button
              onClick={handleCopy}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken"
              title="Copy URL"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          )}
          {onOpen && (
            <button
              onClick={onOpen}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken"
              title="Open link"
            >
              <ExternalLink size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken hover:text-danger"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
