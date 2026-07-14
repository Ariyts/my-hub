import { useRef } from "react";

// Столько нужно удерживать палец, чтобы открылось контекстное меню
const LONG_PRESS_MS = 500;
// Если палец уехал дальше — это прокрутка, а не долгое нажатие
const MOVE_TOLERANCE_PX = 10;

/**
 * Долгое нажатие как замена правому клику: события contextmenu на тач-экранах нет.
 * Срабатывает только для пальца (pointerType === "touch"), мышь не трогаем —
 * там по-прежнему работает onContextMenu.
 *
 * Возвращает обработчики, которые нужно разложить на элемент.
 */
export function useLongPress(onLongPress: (x: number, y: number) => void) {
  const timer = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  // Меню уже открыли — гасим клик, который браузер пришлёт после отпускания пальца
  const fired = useRef(false);

  const cancel = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    startPos.current = null;
  };

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const { clientX: x, clientY: y } = e;
      startPos.current = { x, y };
      fired.current = false;
      timer.current = window.setTimeout(() => {
        fired.current = true;
        onLongPress(x, y);
      }, LONG_PRESS_MS);
    },

    onPointerMove: (e: React.PointerEvent) => {
      if (!startPos.current) return;
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > MOVE_TOLERANCE_PX || dy > MOVE_TOLERANCE_PX) cancel();
    },

    onPointerUp: cancel,
    onPointerCancel: cancel,

    onClickCapture: (e: React.MouseEvent) => {
      if (!fired.current) return;
      // Иначе долгое нажатие по файлу открыло бы и меню, и сам файл
      fired.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };
}
