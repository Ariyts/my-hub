import { useEffect } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { FolderPanel } from './components/FolderPanel';
import { NoteEditor } from './components/NoteEditor';
import { CommandsView } from './components/CommandsView';
import { LinksView } from './components/LinksView';
import { PromptsView } from './components/PromptsView';
import { SettingsModal } from './components/SettingsModal';
import { TrashModal } from './components/TrashModal';
import type { NoteItem, CommandContainer, PromptContainer } from './types';
import { FileText, Plus } from 'lucide-react';

function MainArea() {
  const { 
    activeItemId, 
    notes, 
    commands,
    links,
    prompts,
    activeCategoryId, 
    categories,
    isDarkTheme
  } = useStore();

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const mutedColor = isDarkTheme ? '#94a3b8' : '#64748b';
  
  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const baseType = activeCategory?.baseType || 'notes';
  const typeColor = activeCategory?.color || '#4CAF50';

  // Получаем текущий активный файл/контейнер
  const getActiveFile = (): { id: string; title: string; data: any } | null => {
    if (!activeItemId) return null;
    
    switch (baseType) {
      case 'notes': {
        const note = notes.find(n => n.id === activeItemId);
        return note ? { id: note.id, title: note.title, data: note } : null;
      }
      case 'commands': {
        const cmd = commands.find(c => c.id === activeItemId);
        return cmd ? { id: cmd.id, title: cmd.title, data: cmd } : null;
      }
      case 'links': {
        const link = links.find(l => l.id === activeItemId);
        return link ? { id: link.id, title: link.title, data: link } : null;
      }
      case 'prompts': {
        const prompt = prompts.find(p => p.id === activeItemId);
        return prompt ? { id: prompt.id, title: prompt.title, data: prompt } : null;
      }
      default:
        return null;
    }
  };

  const activeFile = getActiveFile();

  // Рендерим в зависимости от типа и выбранного файла
  if (baseType === 'notes') {
    if (activeFile?.data) {
      return <NoteEditor note={activeFile.data as NoteItem} />;
    }
    // Показываем плейсхолдер когда нет выбранного файла
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: typeColor, opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>No file selected</p>
          <p className="text-sm" style={{ color: mutedColor }}>Select a file from the list or create a new one</p>
        </div>
      </div>
    );
  }

  if (baseType === 'commands') {
    if (activeFile?.data) {
      return <CommandsView container={activeFile.data as CommandContainer} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: typeColor, opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>No command file selected</p>
          <p className="text-sm" style={{ color: mutedColor }}>Select a file from the list or create a new one</p>
        </div>
      </div>
    );
  }

  if (baseType === 'links') {
    if (activeFile?.data) {
      // Передаём ID контейнера для reactive updates
      return <LinksView containerId={activeFile.data.id} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: '#FF9800', opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>No link file selected</p>
          <p className="text-sm" style={{ color: mutedColor }}>Select a file from the sidebar to view its links</p>
        </div>
      </div>
    );
  }

  if (baseType === 'prompts') {
    if (activeFile?.data) {
      return <PromptsView container={activeFile.data as PromptContainer} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: bg }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9' }}>
          <FileText size={36} style={{ color: '#9C27B0', opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>No prompt file selected</p>
          <p className="text-sm" style={{ color: mutedColor }}>Select a file from the list or create a new one</p>
        </div>
      </div>
    );
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
      
      {/* Trash Modal */}
      <TrashModal />
    </div>
  );
}
