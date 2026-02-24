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
  loadFromGitHub,
  isConfigComplete,
} from './utils/githubSync';

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

const sampleData = {
  folders: [
    { id: 'f1', name: 'Work', type: 'notes' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#4CAF50', isExpanded: true },
    { id: 'f2', name: 'Personal', type: 'notes' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#2196F3', isExpanded: false },
    { id: 'f3', name: 'Git', type: 'commands' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#FF9800', isExpanded: true },
    { id: 'f4', name: 'Docker', type: 'commands' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#9C27B0', isExpanded: false },
    { id: 'f5', name: 'Dev Resources', type: 'links' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#FF5722', isExpanded: true },
    { id: 'f6', name: 'Coding', type: 'prompts' as ObjectType, parentId: null, createdAt: new Date().toISOString(), color: '#607D8B', isExpanded: true },
  ] as Folder[],
  notes: [
    {
      id: 'n1', folderId: 'f1', title: 'Project Ideas', type: 'notes' as const,
      content: '# Project Ideas\n\n## Knowledge Hub\nA personal knowledge management system with:\n- Notes with Markdown support\n- Command snippets\n- Link collections\n- AI prompt library\n\n## Features\n- **Sync** via GitHub\n- **Dark/Light** theme\n- **Offline** support with LocalStorage\n\n```javascript\nconst hub = new KnowledgeHub({\n  sync: true,\n  theme: "dark"\n});\n```\n\n> Start small, iterate fast.\n',
      tags: ['project', 'ideas'], isFavorite: true,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: 'n2', folderId: 'f2', title: 'Goals 2025', type: 'notes' as const,
      content: '# Goals 2025\n\n## Technical\n- [ ] Learn Rust\n- [ ] Build 3 open source projects\n- [ ] Write 12 blog posts\n\n## Personal\n- [ ] Read 24 books\n- [ ] Exercise 4x/week\n\n## Financial\n- [ ] Emergency fund\n- [ ] Investments\n',
      tags: ['goals', 'personal'], isFavorite: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
  ] as NoteItem[],
  commands: [
    {
      id: 'c1', folderId: 'f3', title: 'Git Essentials', type: 'commands' as const,
      description: 'Essential git commands for daily workflow',
      subItems: [
        { id: 'ci1', command: 'git reset --hard HEAD~1', description: 'Undo last commit (destructive)', language: 'bash' as const, tags: ['reset', 'undo'], isFavorite: true },
        { id: 'ci2', command: 'git stash && git pull && git stash pop', description: 'Pull with local changes saved', language: 'bash' as const, tags: ['stash', 'pull'], isFavorite: false },
        { id: 'ci3', command: 'git log --oneline --graph --all', description: 'Visual branch history', language: 'bash' as const, tags: ['log', 'history'], isFavorite: true },
        { id: 'ci4', command: 'git cherry-pick <commit-hash>', description: 'Apply specific commit to current branch', language: 'bash' as const, tags: ['cherry-pick'], isFavorite: false },
      ],
      tags: ['git', 'vcs'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isExpanded: true,
    },
    {
      id: 'c2', folderId: 'f4', title: 'Docker Commands', type: 'commands' as const,
      description: 'Common Docker operations',
      subItems: [
        { id: 'ci5', command: 'docker ps -a', description: 'List all containers', language: 'bash' as const, tags: ['docker', 'containers'], isFavorite: false },
        { id: 'ci6', command: 'docker-compose up -d --build', description: 'Rebuild and start services', language: 'bash' as const, tags: ['compose', 'build'], isFavorite: true },
        { id: 'ci7', command: 'docker system prune -af', description: 'Remove all unused data', language: 'bash' as const, tags: ['cleanup'], isFavorite: false },
      ],
      tags: ['docker', 'containers'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isExpanded: false,
    },
  ] as CommandContainer[],
  links: [
    {
      id: 'l1', folderId: 'f5', title: 'Frontend Resources', type: 'links' as const,
      subItems: [
        { id: 'li1', url: 'https://react.dev', title: 'React Documentation', description: 'Official React docs', favicon: '⚛️', tags: ['react', 'docs'], isFavorite: true },
        { id: 'li2', url: 'https://tailwindcss.com', title: 'Tailwind CSS', description: 'Utility-first CSS framework', favicon: '🎨', tags: ['css', 'tailwind'], isFavorite: true },
        { id: 'li3', url: 'https://vitejs.dev', title: 'Vite', description: 'Next generation frontend tooling', favicon: '⚡', tags: ['build', 'vite'], isFavorite: false },
      ],
      tags: ['frontend', 'docs'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isExpanded: true,
    },
  ] as LinkContainer[],
  prompts: [
    {
      id: 'p1', folderId: 'f6', title: 'Code Review', type: 'prompts' as const,
      category: 'Coding',
      subItems: [
        {
          id: 'pi1', title: 'Code Review Prompt',
          prompt: 'Please review the following {{language}} code and provide feedback on:\n1. Code quality and readability\n2. Performance optimizations\n3. Security concerns\n4. Best practices\n\n```{{language}}\n{{code}}\n```',
          variables: ['{{language}}', '{{code}}'],
          description: 'Comprehensive code review assistant',
          tags: ['review', 'code'], isFavorite: true,
        },
        {
          id: 'pi2', title: 'Bug Fix Assistant',
          prompt: 'I have a bug in my {{language}} code. Here\'s the error:\n{{error}}\n\nHere\'s the relevant code:\n```{{language}}\n{{code}}\n```\n\nPlease help me identify and fix the issue.',
          variables: ['{{language}}', '{{error}}', '{{code}}'],
          description: 'Help debugging code issues',
          tags: ['debug', 'fix'], isFavorite: false,
        },
      ],
      tags: ['coding', 'review'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isExpanded: true,
    },
  ] as PromptContainer[],
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

  // GitHub sync - simplified
  syncStatus: 'idle' | 'connecting' | 'syncing' | 'success' | 'error';
  syncMessage: string;
  isConnected: boolean;
  connectGitHub: (token: string) => Promise<boolean>;
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  disconnectGitHub: () => void;
  autoLoadFromCloud: () => Promise<void>;
}

const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      activeType: 'notes',
      activeFolderId: 'f1',
      activeItemId: 'n1',
      folders: sampleData.folders,
      notes: sampleData.notes,
      commands: sampleData.commands,
      links: sampleData.links,
      prompts: sampleData.prompts,
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
        return newFolder.id;
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
          settings: state.settings,
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

      // GitHub sync - simplified
      syncStatus: 'idle',
      syncMessage: '',
      isConnected: false,

      connectGitHub: async (token: string) => {
        set({ syncStatus: 'connecting', syncMessage: 'Connecting to GitHub...' });
        
        const result = await initializeGitHubSync(token);
        
        if (result.success) {
          set({
            syncStatus: 'success',
            syncMessage: result.message,
            isConnected: true,
            settings: {
              ...get().settings,
              github: {
                token: result.token,
                username: result.username,
                repo: result.repo,
                branch: result.branch,
              },
            },
          });
          
          // Auto-load data from GitHub after connecting
          setTimeout(() => {
            get().loadFromCloud();
          }, 500);
          
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
        const config = state.settings.github;
        
        if (!isConfigComplete(config)) {
          set({ syncStatus: 'error', syncMessage: 'Not connected to GitHub' });
          return;
        }
        
        set({ syncStatus: 'syncing', syncMessage: 'Saving to GitHub...' });
        
        const data = {
          folders: state.folders,
          notes: state.notes,
          commands: state.commands,
          links: state.links,
          prompts: state.prompts,
          exportedAt: new Date().toISOString(),
        };
        
        const result = await saveToGitHub(config, data);
        
        if (result.success) {
          set({
            syncStatus: 'success',
            syncMessage: 'Saved! Your data is now in the cloud.',
            settings: {
              ...state.settings,
              github: { ...config, lastSync: result.data?.lastSync || new Date().toISOString() },
            },
          });
        } else {
          set({ syncStatus: 'error', syncMessage: result.message });
        }
        
        setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 3000);
      },

      loadFromCloud: async () => {
        const state = get();
        const config = state.settings.github;
        
        if (!isConfigComplete(config)) {
          return;
        }
        
        set({ syncStatus: 'syncing', syncMessage: 'Loading from GitHub...' });
        
        const result = await loadFromGitHub(config);
        
        if (result.success && result.data) {
          set({
            folders: result.data.folders || [],
            notes: result.data.notes || [],
            commands: result.data.commands || [],
            links: result.data.links || [],
            prompts: result.data.prompts || [],
            syncStatus: 'success',
            syncMessage: 'Data loaded from cloud!',
            settings: {
              ...state.settings,
              github: { ...config, lastSync: new Date().toISOString() },
            },
          });
        }
        
        setTimeout(() => set({ syncStatus: 'idle', syncMessage: '' }), 2000);
      },

      disconnectGitHub: () => {
        set({
          isConnected: false,
          settings: {
            ...get().settings,
            github: { token: '' },
          },
          syncStatus: 'idle',
          syncMessage: '',
        });
      },

      autoLoadFromCloud: async () => {
        const state = get();
        const config = state.settings.github;
        
        // Silently load data if connected
        if (isConfigComplete(config)) {
          const result = await loadFromGitHub(config);
          if (result.success && result.data) {
            set({
              folders: result.data.folders || [],
              notes: result.data.notes || [],
              commands: result.data.commands || [],
              links: result.data.links || [],
              prompts: result.data.prompts || [],
              isConnected: true,
            });
          }
        }
      },
    }),
    {
      name: 'knowledge-hub-storage',
      partialize: (state) => ({
        folders: state.folders,
        notes: state.notes,
        commands: state.commands,
        links: state.links,
        prompts: state.prompts,
        settings: state.settings,
        isDarkTheme: state.isDarkTheme,
        activeType: state.activeType,
      }),
    }
  )
);
