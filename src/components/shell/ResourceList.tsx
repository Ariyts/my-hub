import { useState } from "react";
import { Copy, Check, ExternalLink, Trash2, Globe } from "lucide-react";
import { Chip, Badge, LevelBadge } from "./Badge";
import { StarToggle } from "./StarToggle";
import { domainOf } from "./util";

// ============================================
// ResourceList — табличная раскладка (Задача 0.C / референсы)
// ============================================
// Плоская таблица: Resource | Category | Tags | Actions. На мобильном строки
// превращаются в карточки через существующий CSS-класс .table-cards.

export interface ResourceRowData {
  id: string;
  title: string;
  url?: string;
  description?: string;
  favicon?: string;
  accent?: string;
  tags?: string[];
  starred?: boolean;
  categoryLabel?: string;
  categoryColor?: string;
  categoryIcon?: React.ReactNode;
  level?: string;
  onOpen?: () => void;
  onCopy?: () => void;
  onToggleStar?: () => void;
  onDelete?: () => void;
}

function Row({ row }: { row: ResourceRowData }) {
  const [copied, setCopied] = useState(false);
  const [faviconOk, setFaviconOk] = useState(true);

  const handleCopy = () => {
    row.onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const accent = row.accent || "var(--primary)";

  return (
    <tr className="group border-t border-border-subtle transition-colors hover:bg-surface">
      {/* Resource */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md"
            style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
          >
            {row.favicon && faviconOk ? (
              <img src={row.favicon} alt="" className="h-4 w-4" onError={() => setFaviconOk(false)} />
            ) : (
              <Globe size={13} style={{ color: accent }} />
            )}
          </div>
          <div className="min-w-0">
            <button
              onClick={row.onOpen}
              className="block max-w-full truncate text-left text-sm font-medium text-foreground hover:underline"
              title={row.title}
            >
              {row.title}
            </button>
            <span className="block truncate text-[11px] text-subtle">{domainOf(row.url)}</span>
          </div>
          {row.level && <LevelBadge level={row.level} />}
          {row.starred && row.onToggleStar && (
            <StarToggle active onToggle={row.onToggleStar} size={13} />
          )}
        </div>
      </td>

      {/* Category */}
      <td className="hidden px-3 py-2 md:table-cell">
        {row.categoryLabel && (
          <Badge
            label={row.categoryLabel}
            icon={row.categoryIcon}
            accent={row.categoryColor || accent}
          />
        )}
      </td>

      {/* Tags */}
      <td className="hidden px-3 py-2 lg:table-cell">
        {row.tags && row.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 3).map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {!row.starred && row.onToggleStar && (
            <StarToggle active={false} onToggle={row.onToggleStar} size={14} />
          )}
          {row.onCopy && (
            <button
              onClick={handleCopy}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken"
              title="Copy URL"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          )}
          {row.onOpen && (
            <button
              onClick={row.onOpen}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken"
              title="Open link"
            >
              <ExternalLink size={14} />
            </button>
          )}
          {row.onDelete && (
            <button
              onClick={row.onDelete}
              className="rounded p-1 text-subtle transition-colors hover:bg-sunken hover:text-danger"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function ResourceList({ items }: { items: ResourceRowData[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="table-cards w-full border-collapse">
        <thead>
          <tr className="bg-surface text-left text-[11px] tracking-wider text-subtle uppercase">
            <th className="px-3 py-2 font-medium">Resource</th>
            <th className="hidden px-3 py-2 font-medium md:table-cell">Category</th>
            <th className="hidden px-3 py-2 font-medium lg:table-cell">Tags</th>
            <th className="px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
