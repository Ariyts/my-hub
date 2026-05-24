import { useState, useEffect } from 'react';

// 'grid' = текущий карточный вид (CommandCard в grid)
// 'list' = компактный list view (CommandListItem)
export type ViewLayout = 'grid' | 'list';

const STORAGE_KEY = 'pb:viewLayout';

export function useViewLayout(): [ViewLayout, (v: ViewLayout) => void] {
  const [layout, setLayout] = useState<ViewLayout>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'grid' || stored === 'list') return stored;
    } catch { /* ignore */ }
    return 'grid'; // default = текущий карточный вид
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, layout);
    } catch { /* ignore */ }
  }, [layout]);

  return [layout, setLayout];
}
