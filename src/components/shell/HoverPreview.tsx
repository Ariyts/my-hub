import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ============================================
// HoverPreview — показ произвольного контента при наведении (Задача 2.6)
// ============================================
// Оборачивает триггер (например, фавикон) и по наведению с задержкой
// показывает поповер рядом с ним. Рендерится порталом в document.body, чтобы
// не обрезаться overflow-контейнерами (таблица List, компактная сетка).
// Небольшая задержка закрытия («мостик») позволяет довести курсор до поповера
// и нажать кнопку Open внутри.

const CARD_W = 288; // ширина карточки предпросмотра (w-72)
const CARD_H_EST = 240; // оценка высоты для решения «сверху/снизу»
const GAP = 6;
const MARGIN = 8;

interface HoverPreviewProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function HoverPreview({ content, children, delay = 350, className }: HoverPreviewProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const left = Math.max(
        MARGIN,
        Math.min(r.left, window.innerWidth - CARD_W - MARGIN),
      );
      const below = r.bottom + GAP;
      const top =
        below + CARD_H_EST > window.innerHeight
          ? Math.max(MARGIN, r.top - GAP - CARD_H_EST)
          : below;
      setPos({ top, left });
    }, delay);
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPos(null), 140);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <span
      ref={anchorRef}
      className={className}
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
    >
      {children}
      {pos &&
        createPortal(
          <div
            style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 60, width: CARD_W }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {content}
          </div>,
          document.body,
        )}
    </span>
  );
}
