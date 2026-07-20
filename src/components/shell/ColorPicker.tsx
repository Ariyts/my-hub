import { useState } from "react";
import { Check, X } from "lucide-react";

// ============================================
// ColorPicker — поповер-палитра (Задача 2.3)
// ============================================
// Пресеты (8–10) + «без цвета» + кастомный цвет через нативный input[type=color].
// Заменяет циклическую кнопку цвета: клик по свотчу открывает палитру, а не
// перебирает цвета вслепую. На токенах, паттерн поповера как в PlaybookSectionCard
// (overlay z-10 закрывает клик мимо, панель z-20).

/** Дефолтные пресеты (undefined = «без цвета»). */
const DEFAULT_COLOR_PRESETS: (string | undefined)[] = [
  undefined,
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string | undefined) => void;
  presets?: (string | undefined)[];
  /** Размер свотча-триггера. */
  size?: number;
  title?: string;
  /** Выравнивание поповера относительно триггера. */
  align?: "left" | "right";
}

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_COLOR_PRESETS,
  size = 12,
  title = "Change color",
  align = "right",
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const pick = (c: string | undefined) => {
    onChange(c);
    setOpen(false);
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="rounded p-1 transition-colors hover:bg-sunken"
        title={title}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span
          className="block rounded-full border"
          style={{
            width: size,
            height: size,
            background: value || "transparent",
            borderColor: value || "var(--border)",
          }}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            className={`absolute top-full z-20 mt-1 w-40 rounded-lg border border-border bg-surface p-2 shadow-2xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-5 gap-1.5">
              {presets.map((c, i) => {
                const active = (c ?? "") === (value ?? "");
                return (
                  <button
                    key={c ?? `none-${i}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      pick(c);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md border transition-transform hover:scale-110"
                    style={{
                      background: c || "transparent",
                      borderColor: c || "var(--border)",
                    }}
                    title={c ?? "No color"}
                  >
                    {c === undefined ? (
                      <X size={11} className="text-subtle" />
                    ) : active ? (
                      <Check size={12} className="text-white" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Кастомный цвет */}
            <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-md border border-border-subtle px-2 py-1 text-[11px] text-muted hover:bg-sunken">
              <span
                className="h-4 w-4 shrink-0 rounded border border-border"
                style={{ background: value || "transparent" }}
              />
              Custom…
              <input
                type="color"
                value={value || "#3b82f6"}
                onChange={(e) => onChange(e.target.value)}
                className="ml-auto h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
