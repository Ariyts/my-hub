import type { ReactNode } from "react";

// ============================================
// Badge / LevelBadge / Chip (Задача 0.C / референсы)
// ============================================
// Мелкие презентационные примитивы для карточек и раскладок. На токенах.

// --- Badge: пилюля категории (иконка + подпись, акцентная подложка) ---
interface BadgeProps {
  label: string;
  icon?: ReactNode;
  /** Акцент (hex). По умолчанию нейтральный muted. */
  accent?: string;
}

export function Badge({ label, icon, accent }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
      style={
        accent
          ? { background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }
          : { background: "var(--bg-sunken)", color: "var(--text-muted)" }
      }
    >
      {icon}
      {label}
    </span>
  );
}

// --- LevelBadge: L1 / L2 / L3 с цветовой шкалой сложности ---
const LEVEL_COLORS: Record<string, string> = {
  L1: "var(--success)", // просто
  L2: "var(--warning)", // средне
  L3: "var(--danger)", // сложно
};

export function LevelBadge({ level }: { level: string }) {
  const color = LEVEL_COLORS[level] ?? "var(--text-muted)";
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold"
      style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
    >
      {level}
    </span>
  );
}

// --- Chip: тег (#name) ---
export function Chip({ label }: { label: string }) {
  return (
    <span className="rounded bg-sunken px-1.5 py-0.5 text-[11px] text-muted">
      {label.startsWith("#") ? label : `#${label}`}
    </span>
  );
}
