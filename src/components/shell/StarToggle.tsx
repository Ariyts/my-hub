import { Star } from "lucide-react";

// ============================================
// StarToggle — переключатель «избранное» (Задача 0.C)
// ============================================
// Единый вид звезды: залита акцентом при active. На токенах.

interface StarToggleProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
  /** Цвет залитой звезды. По умолчанию — золотой акцент. */
  accent?: string;
  title?: string;
}

export function StarToggle({
  active,
  onToggle,
  size = 15,
  accent = "#f5b301",
  title,
}: StarToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="rounded p-1 text-subtle transition-colors hover:bg-sunken"
      title={title ?? (active ? "Unstar" : "Star")}
      aria-pressed={active}
    >
      <Star
        size={size}
        style={active ? { color: accent, fill: accent } : undefined}
      />
    </button>
  );
}
