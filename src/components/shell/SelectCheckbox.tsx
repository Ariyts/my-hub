import { Check } from "lucide-react";

// ============================================
// SelectCheckbox — чекбокс мультивыбора (Задача 2.4)
// ============================================
// Единый вид чекбокса для выбора ссылок во всех раскладках. На токенах.
// Клик гасит навигацию/DnD родителя (stopPropagation + preventDefault).

interface SelectCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  title?: string;
}

export function SelectCheckbox({ checked, onToggle, size = 16, title }: SelectCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      title={title ?? (checked ? "Deselect" : "Select")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`flex shrink-0 items-center justify-center rounded border transition-colors ${
        checked
          ? "border-transparent bg-primary text-white"
          : "border-border bg-surface hover:border-primary"
      }`}
      style={{ width: size, height: size }}
    >
      {checked && <Check size={size - 5} strokeWidth={3} />}
    </button>
  );
}
