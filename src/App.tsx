import { useEffect } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { FolderPanel } from './components/FolderPanel';
import { NoteEditor } from './components/NoteEditor';
import { CommandsView } from './components/CommandsView';
import { LinksView } from './components/LinksView';
import { PromptsView } from './components/PromptsView';
import { SettingsModal } from './components/SettingsModal';
import type { NoteItem, BaseDataType } from './types';
import { FileText } from 'lucide-react';

// Get base type for any type (default or custom)
function getBaseType(activeType: string, customTypes: any[]): BaseDataType {
  const customType = customTypes?.find(t => t.id === activeType);
  if (customType) return customType.baseType;
  if (['notes', 'commands', 'links', 'prompts'].includes(activeType)) {
    return activeType as BaseDataType;
  }
  return 'notes';
}

function MainArea() {
  const { activeType, activeItemId, notes, activeFolderId, isDarkTheme, settings } = useStore();

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const mutedColor = isDarkTheme ? '#94a3b8' : '#64748b';
  
  const baseType = getBaseType(activeType, settings.customTypes || []);

  // Render based on base type
  if (baseType === 'notes') {
    const note = notes.find(n => n.id === activeItemId);
    if (note) {
      return <NoteEditor note={note as NoteItem} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: '#4CAF50', opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>No item selected</p>
          <p className="text-sm" style={{ color: mutedColor }}>Select an item from the list or create a new one</p>
        </div>
      </div>
    );
  }

  if (baseType === 'commands') {
    return <CommandsView folderId={activeFolderId} />;
  }

  if (baseType === 'links') {
    return <LinksView folderId={activeFolderId} />;
  }

  if (baseType === 'prompts') {
    return <PromptsView folderId={activeFolderId} />;
  }

  return null;
}

export function App() {
  const { isDarkTheme, showSettings } = useStore();

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#0f172a';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#ffffff';
    }
  }, [isDarkTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const { setActiveType } = useStore.getState();
        switch (e.key) {
          case '1': e.preventDefault(); setActiveType('notes'); break;
          case '2': e.preventDefault(); setActiveType('commands'); break;
          case '3': e.preventDefault(); setActiveType('links'); break;
          case '4': e.preventDefault(); setActiveType('prompts'); break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: isDarkTheme ? '#0f172a' : '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Folder Panel */}
      <FolderPanel />

      {/* Main Area */}
      <main className="flex-1 overflow-hidden">
        <MainArea />
      </main>

      {/* Settings Modal */}
      {showSettings && <SettingsModal />}
    </div>
  );
}
