import { useEffect, useRef, useState } from "react";
import { Undo2, X } from "lucide-react";
import { useStore } from "../store";
import type { UndoEntry } from "../store";

// ============================================
// UndoToast — тост «Undo» для удаления под-элементов (Задача 0.E.2)
// ============================================
// Показывается при удалении под-элемента/секции (которые иначе уходят мимо
// корзины). Undo восстанавливает последнее удаление; также работает Ctrl/Cmd+Z
// — но НЕ когда фокус в поле ввода (там оставляем нативный undo текста).

const KIND_NOUN: Record<UndoEntry["kind"], string> = {
  linkItem: "link",
  commandItem: "command",
  promptItem: "prompt",
  playbookItem: "command",
  linkSection: "section",
  promptSection: "section",
  playbookSection: "section",
};

export function UndoToast() {
  const undoStack = useStore((s) => s.undoStack);
  const undoLastDelete = useStore((s) => s.undoLastDelete);

  const [visible, setVisible] = useState(false);
  const [entry, setEntry] = useState<UndoEntry | null>(null);
  const prevLen = useRef(undoStack.length);
  const prevTop = useRef<UndoEntry | undefined>(undoStack[undoStack.length - 1]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Показать тост, когда в стек ДОБАВИЛСЯ новый элемент (не при undo/снятии).
  // Сравниваем верхний элемент по ссылке + длину, чтобы работало и при достижении
  // лимита стека (когда длина не растёт, но верхушка меняется). Авто-скрытие 6 c.
  useEffect(() => {
    const top = undoStack[undoStack.length - 1];
    const added = top && top !== prevTop.current && undoStack.length >= prevLen.current;
    if (added) {
      setEntry(top);
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 6000);
    }
    prevLen.current = undoStack.length;
    prevTop.current = top;
  }, [undoStack]);

  // Ctrl/Cmd+Z — глобально, кроме полей ввода (там нативный undo)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.key.toLowerCase() !== "z") return;
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      if (useStore.getState().undoStack.length === 0) return;
      e.preventDefault();
      useStore.getState().undoLastDelete();
      setVisible(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!visible || !entry) return null;

  const handleUndo = () => {
    undoLastDelete();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-100 -translate-x-1/2 px-3">
      <div className="flex max-w-[90vw] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-2xl">
        <span className="truncate text-sm text-foreground">
          Deleted {KIND_NOUN[entry.kind]}{" "}
          <span className="font-medium text-muted">“{entry.label}”</span>
        </span>
        <button
          onClick={handleUndo}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={13} />
          Undo
        </button>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 rounded p-1 text-subtle transition-colors hover:bg-sunken hover:text-foreground"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
