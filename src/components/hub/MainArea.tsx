'use client';

import { useStore } from '@/lib/store';
import { NoteEditor } from './NoteEditor';
import { FilesView } from './FilesView';
import type { NoteItem } from '@/lib/types';
import { FileText } from 'lucide-react';

export function MainArea() {
  const { 
    activeItemId, 
    notes, 
    activeCategoryId, 
    categories,
    activeFolderId,
    isDarkTheme
  } = useStore();

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const mutedColor = isDarkTheme ? '#94a3b8' : '#64748b';
  
  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const baseType = activeCategory?.baseType || 'notes';

  // Render based on base type
  if (baseType === 'files') {
    return <FilesView folderId={activeFolderId || ''} />;
  }

  if (baseType === 'notes') {
    const note = notes.find(n => n.id === activeItemId);
    if (note) {
      return <NoteEditor note={note as NoteItem} />;
    }
  }

  // Empty state
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
        <FileText size={36} style={{ color: activeCategory?.color || '#4CAF50', opacity: 0.6 }} />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
          {activeCategory ? `${activeCategory.name} - Coming Soon` : 'No item selected'}
        </p>
        <p className="text-sm" style={{ color: mutedColor }}>
          {activeCategory 
            ? `This category type (${activeCategory.baseType}) is being developed` 
            : 'Select an item from the list or create a new one'}
        </p>
      </div>
    </div>
  );
}
