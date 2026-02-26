import { useEffect } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { FolderPanel } from './components/FolderPanel';
import { NoteEditor } from './components/NoteEditor';
import { CommandsView } from './components/CommandsView';
import { LinksView } from './components/LinksView';
import { PromptsView } from './components/PromptsView';
import { SettingsModal } from './components/SettingsModal';
import type { NoteItem } from './types';
import { FileText, Plus } from 'lucide-react';

function MainArea() {
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
  if (baseType === 'notes') {
    const note = notes.find(n => n.id === activeItemId);
    if (note) {
      return <NoteEditor note={note as NoteItem} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: activeCategory?.color || '#4CAF50', opacity: 0.6 }} />
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
  const { isDarkTheme, showSettings, workspaces, activeWorkspaceId } = useStore();

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#0f172a';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#ffffff';
    }
  }, [isDarkTheme]);

  // Show workspace selector if no workspace is active
  if (!activeWorkspaceId || workspaces.length === 0) {
    return (
      <div 
        className="flex h-screen items-center justify-center"
        style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc' }}
      >
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
            Knowledge Hub
          </h1>
          <p className="text-sm mb-6" style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>
            Create your first workspace to get started
          </p>
          <button
            onClick={() => useStore.getState().addWorkspace({ name: 'My Workspace', icon: '🏠', color: '#6366f1' })}
            className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
          >
            <Plus size={18} className="inline mr-2" />
            Create Workspace
          </button>
        </div>
        {showSettings && <SettingsModal />}
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: isDarkTheme ? '#0f172a' : '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Sidebar - Categories */}
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
