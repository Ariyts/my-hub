import { useEffect, useRef } from "react";

// Свайп влево длиннее этого расстояния закрывает панель
const SWIPE_CLOSE_PX = 60;

/**
 * Общее поведение выдвижных панелей на мобильном: Esc, блокировка прокрутки фона,
 * фокус внутри панели, закрытие свайпом влево.
 * Используется и в FolderPanel, и в Sidebar.
 */
export function useMobileDrawer(isMobile: boolean, isOpen: boolean, close: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Внутри полей ввода Esc уже занят (отмена ввода) — не перехватываем
      if (e.key !== "Escape" || e.target instanceof HTMLInputElement) return;
      close();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, isOpen, close]);

  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (!isMobile) return;
      swipeStartX.current = e.clientX;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (swipeStartX.current === null) return;
      if (e.clientX - swipeStartX.current < -SWIPE_CLOSE_PX) {
        swipeStartX.current = null;
        close();
      }
    },
    onPointerUp: () => {
      swipeStartX.current = null;
    },
    onPointerCancel: () => {
      swipeStartX.current = null;
    },
  };

  return { panelRef, swipeHandlers };
}
