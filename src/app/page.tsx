'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/hub/Sidebar';
import { FolderPanel } from '@/components/hub/FolderPanel';
import { MainArea } from '@/components/hub/MainArea';
import { SettingsModal } from '@/components/hub/SettingsModal';
import { Plus } from 'lucide-react';

export default function Home() {
  const { isDarkTheme, showSettings, workspaces, activeWorkspaceId, addWorkspace } = useStore();

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
            Your personal knowledge base with Dropbox integration
          </p>
          <button
            onClick={() => addWorkspace({ name: 'My Workspace', icon: '🏠', color: '#6366f1' })}
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
