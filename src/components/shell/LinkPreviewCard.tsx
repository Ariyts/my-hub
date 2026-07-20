import { useState } from "react";
import { Globe, ExternalLink } from "lucide-react";
import { Chip } from "./Badge";
import { domainOf } from "./util";

// ============================================
// LinkPreviewCard — карточка предпросмотра ссылки (Задача 2.6)
// ============================================
// Богатый предпросмотр без перехода: фавикон, домен, заголовок, полное
// описание, теги и кнопка Open. Презентационная, на токенах. Показывается
// через HoverPreview при наведении.

interface LinkPreviewCardProps {
  title: string;
  url?: string;
  description?: string;
  favicon?: string;
  accent?: string;
  tags?: string[];
}

export function LinkPreviewCard({
  title,
  url,
  description,
  favicon,
  accent = "var(--primary)",
  tags,
}: LinkPreviewCardProps) {
  const [faviconOk, setFaviconOk] = useState(true);

  return (
    <div className="w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
      {/* Верхняя цветная полоса — акцент секции */}
      <div className="h-1 w-full" style={{ background: accent }} />

      <div className="flex flex-col gap-2 p-3">
        {/* Фавикон + домен */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md"
            style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
          >
            {favicon && faviconOk ? (
              <img src={favicon} alt="" className="h-5 w-5" onError={() => setFaviconOk(false)} />
            ) : (
              <Globe size={15} style={{ color: accent }} />
            )}
          </div>
          <span className="min-w-0 flex-1 truncate text-[11px] tracking-wide text-subtle uppercase">
            {domainOf(url)}
          </span>
        </div>

        {/* Заголовок */}
        <div className="text-sm leading-snug font-semibold text-foreground">{title}</div>

        {/* Описание (до 4 строк) */}
        {description && (
          <p className="line-clamp-4 text-xs leading-relaxed text-muted">{description}</p>
        )}

        {/* Теги */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 6).map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
        )}

        {/* Open */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-sunken"
            style={{ color: accent }}
          >
            <ExternalLink size={13} />
            Open link
          </a>
        )}
      </div>
    </div>
  );
}
