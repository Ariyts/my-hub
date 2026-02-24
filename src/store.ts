import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, ObjectType, Folder, NoteItem,
  CommandContainer, LinkContainer, PromptContainer,
  CommandItem, LinkItem, PromptItem, Settings, AnyItem
} from './types';
import {
  initializeGitHubSync,
  saveToGitHub,
} from './utils/githubSync';

// Import embedded data - this will be bundled at build time
import embeddedData from './data.json';

const defaultSettings: Settings = {
  theme: 'system',
  fontSize: 14,
  editorWidth: 'full',
  previewMode: 'split',
  autoSave: true,
  spellCheck: false,
  lineNumbers: true,
  codeFont: 'Fira Code',
  github: {
    token: '',
  },
};

interface StoreActions {
  setActiveType: (type: ObjectType) => void;
  setActiveFolderId: (id: string | null) => void;
  setActiveItemId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setShowSettings: (show: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setSettings: (settings: Partial<Settings>) => void;

  // Folder actions
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  toggleFolderExpanded: (id: string) => void;

  // Note actions
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  // Command container actions
  addCommandContainer: (container: Omit<CommandContainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCommandContainer: (id: string, updates: Partial<CommandContainer>) => void;
  deleteCommandContainer: (id: string) => void;
  addCommandItem: (containerId: string, item: Omit<CommandItem, 'id'>) => void;
  updateCommandItem: (containerId: string, itemId: string, updates: Partial<CommandItem>) => void;
  deleteCommandItem: (containerId: string, itemId: string) => void;

  // Link container actions
  addLinkContainer: (container: Omit<LinkContainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLinkContainer: (id: string, updates: Partial<LinkContainer>) => void;
  deleteLinkContainer: (id: string) => void;
  addLinkItem: (containerId: string, item: Omit<LinkItem, 'id'>) => void;
  updateLinkItem: (containerId: string, itemId: string, updates: Partial<LinkItem>) => void;
  deleteLinkItem: (containerId: string, itemId: string) => void;

  // Prompt container actions
  addPromptContainer: (container: Omit<PromptContainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePromptContainer: (id: string, updates: Partial<PromptContainer>) => void;
  deletePromptContainer: (id: string) => void;
  addPromptItem: (containerId: string, item: Omit<PromptItem, 'id'>) => void;
  updatePromptItem: (containerId: string, itemId: string, updates: Partial<PromptItem>) => void;
  deletePromptItem: (containerId: string, itemId: string) => void;

  exportData: () => void;
  importData: (data: string) => void;
  clearAllData: () => void;
  getActiveItem: () => AnyItem | null;

  // GitHub sync
  syncStatus: 'idle' | 'connecting' | 'syncing' | 'success' | 'error';
  syncMessage: string;
  canSave: boolean;
  dataExportedAt: string;
  connectGitHub: (token: string) => Promise<boolean>;
  syncToCloud: () => Promise<void>;
  disconnectGitHub: () => void;
}

const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// Use embedded data (built into the app)
const initialData = embeddedData as any;

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      activeType: 'notes',
      activeFolderId: initialData.folders?.[0]?.id || null,
      activeItemId: initialData.notes?.[0]?.id || null,
      folders: initialData.folders || [],
      notes: initialData.notes || [],
      commands: initialData.commands || [],
      links: initialData.links || [],
      prompts: initialData.prompts || [],
      settings: defaultSettings,
      searchQuery: '',
      showSettings: false,
      sidebarCollapsed: false,
      isDarkTheme: false,

      setActiveType: (type) => set({ activeType: type, activeFolderId: null, activeItemId: null }),
      setActiveFolderId: (id) => set({ activeFolderId: id }),
      setActiveItemId: (id) => set({ activeItemId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setShowSettings: (show) => set({ showSettings: show }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleTheme: () => set((s) => ({ isDarkTheme: !s.isDarkTheme })),
      setSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),

      addFolder: (folder) => {
        const newFolder: Folder = { ...folder, id: genId(), createdAt: new Date().toISOString() };
        set((s) => ({ folders: [...s.folders, newFolder] }));
      },
      updateFolder: (id, updates) => set((s) => ({
        folders: s.folders.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteFolder: (id) => set((s) => ({
        folders: s.folders.filter(f => f.id !== id),
        notes: s.notes.filter(n => n.folderId !== id),
        commands: s.commands.filter(c => c.folderId !== id),
        links: s.links.filter(l => l.folderId !== id),
        prompts: s.prompts.filter(p => p.folderId !== id),
      })),
      toggleFolderExpanded: (id) => set((s) => ({
        folders: s.folders.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f)
      })),

      addNote: (note) => {
        const newNote: NoteItem = { ...note, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set((s) => ({ notes: [...s.notes, newNote], activeItemId: newNote.id }));
      },
      updateNote: (id, updates) => set((s) => ({
        notes: s.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
      })),
      deleteNote: (id) => set((s) => ({
        notes: s.notes.filter(n => n.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),

      addCommandContainer: (container) => {
        const newC: CommandContainer = { ...container, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set((s) => ({ commands: [...s.commands, newC], activeItemId: newC.id }));
      },
      updateCommandContainer: (id, updates) => set((s) => ({
        commands: s.commands.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
      })),
      deleteCommandContainer: (id) => set((s) => ({
        commands: s.commands.filter(c => c.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),
      addCommandItem: (containerId, item) => {
        const newItem: CommandItem = { ...item, id: genId() };
        set((s) => ({
          commands: s.commands.map(c => c.id === containerId ? { ...c, subItems: [...c.subItems, newItem], updatedAt: new Date().toISOString() } : c)
        }));
      },
      updateCommandItem: (containerId, itemId, updates) => set((s) => ({
        commands: s.commands.map(c => c.id === containerId ? {
          ...c, updatedAt: new Date().toISOString(),
          subItems: c.subItems.map(i => i.id === itemId ? { ...i, ...updates } : i)
        } : c)
      })),
      deleteCommandItem: (containerId, itemId) => set((s) => ({
        commands: s.commands.map(c => c.id === containerId ? {
          ...c, subItems: c.subItems.filter(i => i.id !== itemId)
        } : c)
      })),

      addLinkContainer: (container) => {
        const newC: LinkContainer = { ...container, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set((s) => ({ links: [...s.links, newC], activeItemId: newC.id }));
      },
      updateLinkContainer: (id, updates) => set((s) => ({
        links: s.links.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)
      })),
      deleteLinkContainer: (id) => set((s) => ({
        links: s.links.filter(l => l.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),
      addLinkItem: (containerId, item) => {
        const newItem: LinkItem = { ...item, id: genId() };
        set((s) => ({
          links: s.links.map(l => l.id === containerId ? { ...l, subItems: [...l.subItems, newItem], updatedAt: new Date().toISOString() } : l)
        }));
      },
      updateLinkItem: (containerId, itemId, updates) => set((s) => ({
        links: s.links.map(l => l.id === containerId ? {
          ...l, updatedAt: new Date().toISOString(),
          subItems: l.subItems.map(i => i.id === itemId ? { ...i, ...updates } : i)
        } : l)
      })),
      deleteLinkItem: (containerId, itemId) => set((s) => ({
        links: s.links.map(l => l.id === containerId ? {
          ...l, subItems: l.subItems.filter(i => i.id !== itemId)
        } : l)
      })),

      addPromptContainer: (container) => {
        const newC: PromptContainer = { ...container, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set((s) => ({ prompts: [...s.prompts, newC], activeItemId: newC.id }));
      },
      updatePromptContainer: (id, updates) => set((s) => ({
        prompts: s.prompts.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      })),
      deletePromptContainer: (id) => set((s) => ({
        prompts: s.prompts.filter(p => p.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),
      addPromptItem: (containerId, item) => {
        const newItem: PromptItem = { ...item, id: genId() };
        set((s) => ({
          prompts: s.prompts.map(p => p.id === containerId ? { ...p, subItems: [...p.subItems, newItem], updatedAt: new Date().toISOString() } : p)
        }));
      },
      updatePromptItem: (containerId, itemId, updates) => set((s) => ({
        prompts: s.prompts.map(p => p.id === containerId ? {
          ...p, updatedAt: new Date().toISOString(),
          subItems: p.subItems.map(i => i.id === itemId ? { ...i, ...updates } : i)
        } : p)
      })),
      deletePromptItem: (containerId, itemId) => set((s) => ({
        prompts: s.prompts.map(p => p.id === containerId ? {
          ...p, subItems: p.subItems.filter(i => i.id !== itemId)
        } : p)
      })),

      exportData: () => {
        const state = get();
        const data = {
          folders: state.folders,
          notes: state.notes,
          commands: state.commands,
          links: state.links,
          prompts: state.prompts,
          exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge-hub-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importData: (dataStr) => {
        try {
          const data = JSON.parse(dataStr);
          set({
            folders: data.folders || [],
            notes: data.notes || [],
            commands: data.commands || [],
            links: data.links || [],
            prompts: data.prompts || [],
          });
        } catch (e) {
          console.error('Import failed', e);
        }
      },

      clearAllData: () => set({
        folders: [],
        notes: [],
        commands: [],
        links: [],
        prompts: [],
        activeItemId: null,
        activeFolderId: null,
      }),

      getActiveItem: () => {
        const state = get();
        const { activeItemId, activeType } = state;
        if (!activeItemId) return null;
        switch (activeType) {
          case 'notes': return state.notes.find(n => n.id === activeItemId) || null;
          case 'commands': return state.commands.find(c => c.id === activeItemId) || null;
          case 'links': return state.links.find(l => l.id === activeItemId) || null;
          case 'prompts': return state.prompts.find(p => p.id === activeItemId) || null;
        }
      },

      // GitHub sync
      syncStatus: 'idle',
      syncMessage: '',
      canSave: false,
      dataExportedAt: initialData.exportedAt || '',

      connectGitHub: async (token: string) => {
        set({ syncStatus: 'connecting', syncMessage: 'Connecting...' });
        
        const result = await initializeGitHubSync(token);
        
        if (result.success) {
          set({
            syncStatus: 'success',
            syncMessage: result.message,
            canSave: true,
            settings: {
              ...get().settings,
              github: {
                token: result.token,
                username: result.username,
              },
            },
          });
          setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 3000);
          return true;
        } else {
          set({ syncStatus: 'error', syncMessage: result.message });
          setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 5000);
          return false;
        }
      },

      syncToCloud: async () => {
        const state = get();
        
        if (!state.canSave || !state.settings.github.token) {
          set({ syncStatus: 'error', syncMessage: 'Connect with token first' });
          setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 3000);
          return;
        }
        
        set({ syncStatus: 'syncing', syncMessage: 'Saving...' });
        
        const data = {
          folders: state.folders,
          notes: state.notes,
          commands: state.commands,
          links: state.links,
          prompts: state.prompts,
          exportedAt: new Date().toISOString(),
        };
        
        const result = await saveToGitHub(state.settings.github, data);
        
        if (result.success) {
          set({
            syncStatus: 'success',
            syncMessage: 'Saved! Site will rebuild automatically.',
            settings: {
              ...state.settings,
              github: { ...state.settings.github, lastSync: new Date().toISOString() },
            },
          });
        } else {
          set({ syncStatus: 'error', syncMessage: result.message });
        }
        
        setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 4000);
      },

      disconnectGitHub: () => {
        set({
          canSave: false,
          settings: {
            ...get().settings,
            github: { token: '' },
          },
        });
      },
    }),
    {
      name: 'knowledge-hub-storage',
      partialize: (state) => ({
        // Only persist UI preferences
        settings: state.settings,
        isDarkTheme: state.isDarkTheme,
        activeType: state.activeType,
      }),
    }
  )
);
