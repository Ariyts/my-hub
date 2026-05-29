import { useState, useEffect } from 'react';

// 'grid' = текущий карточный вид (CommandCard в grid)
// 'list' = компактный list view (CommandListItem)
// 'markdown' = markdown editor/preview view
export type ViewLayout = 'grid' | 'list' | 'markdown';

const STORAGE_KEY = 'pb:viewLayout';

export function useViewLayout(): [ViewLayout, (v: ViewLayout) => void] {
  const [layout, setLayout] = useState<ViewLayout>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'grid' || stored === 'list' || stored === 'markdown') return stored;
    } catch { /* ignore */ }
    return 'list'; // default = компактный list view
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, layout);
    } catch { /* ignore */ }
  }, [layout]);

  return [layout, setLayout];
}
