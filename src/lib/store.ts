'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, Workspace, Category, Folder, NoteItem,
  CommandContainer, LinkContainer, PromptContainer, FileContainer,
  CommandItem, LinkItem, PromptItem, FileItem, Settings, AnyItem
} from './types';

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
  dropbox: {
    accessToken: '',
    connected: false,
  },
};

// ============================================
// STORE ACTIONS INTERFACE
// ============================================
interface StoreActions {
  // Workspace actions
  setActiveWorkspaceId: (id: string) => void;
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;

  // Category actions
  setActiveCategoryId: (id: string | null) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Folder actions
  setActiveFolderId: (id: string | null) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'order'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  toggleFolderExpanded: (id: string) => void;

  // Item selection
  setActiveItemId: (id: string | null) => void;

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

  // File container actions
  addFileContainer: (container: Omit<FileContainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFileContainer: (id: string, updates: Partial<FileContainer>) => void;
  deleteFileContainer: (id: string) => void;
  addFileItem: (containerId: string, item: Omit<FileItem, 'id'>) => void;
  updateFileItem: (containerId: string, itemId: string, updates: Partial<FileItem>) => void;
  deleteFileItem: (containerId: string, itemId: string) => void;

  // UI actions
  setSearchQuery: (query: string) => void;
  setShowSettings: (show: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setSettings: (settings: Partial<Settings>) => void;

  // Data operations
  exportData: () => void;
  importData: (data: string) => void;
  clearAllData: () => void;
  getActiveItem: () => AnyItem | null;
  loadData: (data: Partial<AppState>) => void;
}

const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// Initial data with default workspace and categories
const initialData = {
  workspaces: [
    { 
      id: 'ws1', 
      name: 'My Workspace', 
      icon: '🏠', 
      color: '#6366f1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: 'cat1', workspaceId: 'ws1', name: 'Notes', icon: '📝', color: '#4CAF50', baseType: 'notes' as const, order: 0, isDefault: true },
    { id: 'cat2', workspaceId: 'ws1', name: 'Commands', icon: '⌘', color: '#2196F3', baseType: 'commands' as const, order: 1, isDefault: true },
    { id: 'cat3', workspaceId: 'ws1', name: 'Links', icon: '🔗', color: '#FF9800', baseType: 'links' as const, order: 2, isDefault: true },
    { id: 'cat4', workspaceId: 'ws1', name: 'Prompts', icon: '💬', color: '#9C27B0', baseType: 'prompts' as const, order: 3, isDefault: true },
    { id: 'cat5', workspaceId: 'ws1', name: 'Files', icon: '📁', color: '#00BCD4', baseType: 'files' as const, order: 4, isDefault: true },
  ],
  folders: [
    { id: 'f1', categoryId: 'cat1', parentId: null, name: 'Work', color: '#4CAF50', order: 0, isExpanded: true, createdAt: new Date().toISOString() },
    { id: 'f5', categoryId: 'cat5', parentId: null, name: 'Dropbox Files', color: '#00BCD4', order: 0, isExpanded: true, createdAt: new Date().toISOString() },
  ],
  notes: [
    {
      id: 'n1',
      folderId: 'f1',
      title: 'Welcome to Knowledge Hub',
      content: `# Welcome! 👋

This is your personal knowledge hub with workspace support and Dropbox integration.

## Features

- 📁 **Workspaces** - Organize different projects/areas
- 📝 **Notes** - Write in Markdown with preview
- 💻 **Commands** - Store code snippets
- 🔗 **Links** - Bookmark resources
- 🤖 **Prompts** - AI prompt templates
- 📦 **Files** - Dropbox file storage and preview

## Dropbox Integration

The Files category allows you to:
- Browse your Dropbox files
- Upload new files
- Preview images and documents
- Share files with others

---
> Start organizing your knowledge!`,
      tags: ['welcome', 'guide'],
      isFavorite: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'notes' as const
    }
  ],
  commands: [],
  links: [],
  prompts: [],
  files: [],
};

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // ============================================
      // INITIAL STATE
      // ============================================
      workspaces: initialData.workspaces,
      activeWorkspaceId: initialData.workspaces[0]?.id || null,
      
      categories: initialData.categories,
      activeCategoryId: null,
      
      folders: initialData.folders,
      activeFolderId: null,
      
      notes: initialData.notes,
      commands: initialData.commands,
      links: initialData.links,
      prompts: initialData.prompts,
      files: initialData.files,
      activeItemId: null,
      
      settings: defaultSettings,
      searchQuery: '',
      showSettings: false,
      sidebarCollapsed: false,
      isDarkTheme: true,

      // ============================================
      // LOAD DATA
      // ============================================
      loadData: (data) => set((state) => ({ ...state, ...data })),

      // ============================================
      // WORKSPACE ACTIONS
      // ============================================
      setActiveWorkspaceId: (id) => set({ 
        activeWorkspaceId: id, 
        activeCategoryId: null,
        activeFolderId: null,
        activeItemId: null 
      }),
      
      addWorkspace: (workspace) => {
        const newWorkspace: Workspace = {
          ...workspace,
          id: genId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const defaultCategories: Category[] = [
          { id: genId(), workspaceId: newWorkspace.id, name: 'Notes', icon: '📝', color: '#4CAF50', baseType: 'notes', order: 0, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Commands', icon: '⌘', color: '#2196F3', baseType: 'commands', order: 1, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Links', icon: '🔗', color: '#FF9800', baseType: 'links', order: 2, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Prompts', icon: '💬', color: '#9C27B0', baseType: 'prompts', order: 3, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Files', icon: '📁', color: '#00BCD4', baseType: 'files', order: 4, isDefault: true },
        ];
        
        set((s) => ({ 
          workspaces: [...s.workspaces, newWorkspace],
          categories: [...s.categories, ...defaultCategories],
          activeWorkspaceId: newWorkspace.id,
          activeCategoryId: null,
          activeFolderId: null,
          activeItemId: null
        }));
      },
      
      updateWorkspace: (id, updates) => set((s) => ({
        workspaces: s.workspaces.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w)
      })),
      
      deleteWorkspace: (id) => set((s) => {
        const workspaceCategoryIds = s.categories.filter(c => c.workspaceId === id).map(c => c.id);
        const categoryFolderIds = s.folders.filter(f => workspaceCategoryIds.includes(f.categoryId)).map(f => f.id);
        
        return {
          workspaces: s.workspaces.filter(w => w.id !== id),
          categories: s.categories.filter(c => c.workspaceId !== id),
          folders: s.folders.filter(f => !workspaceCategoryIds.includes(f.categoryId)),
          notes: s.notes.filter(n => !categoryFolderIds.includes(n.folderId)),
          commands: s.commands.filter(c => !categoryFolderIds.includes(c.folderId)),
          links: s.links.filter(l => !categoryFolderIds.includes(l.folderId)),
          prompts: s.prompts.filter(p => !categoryFolderIds.includes(p.folderId)),
          files: s.files.filter(f => !categoryFolderIds.includes(f.folderId)),
          activeWorkspaceId: s.activeWorkspaceId === id ? (s.workspaces[0]?.id || null) : s.activeWorkspaceId,
          activeCategoryId: null,
          activeFolderId: null,
          activeItemId: null,
        };
      }),

      // ============================================
      // CATEGORY ACTIONS
      // ============================================
      setActiveCategoryId: (id) => set({ activeCategoryId: id, activeFolderId: null, activeItemId: null }),
      
      addCategory: (category) => {
        const state = get();
        const maxOrder = Math.max(0, ...state.categories.filter(c => c.workspaceId === state.activeWorkspaceId).map(c => c.order));
        const newCategory: Category = {
          ...category,
          id: genId(),
          order: maxOrder + 1,
        };
        set((s) => ({ categories: [...s.categories, newCategory] }));
      },
      
      updateCategory: (id, updates) => set((s) => ({
        categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      
      deleteCategory: (id) => set((s) => {
        const categoryFolderIds = s.folders.filter(f => f.categoryId === id).map(f => f.id);
        return {
          categories: s.categories.filter(c => c.id !== id),
          folders: s.folders.filter(f => f.categoryId !== id),
          notes: s.notes.filter(n => !categoryFolderIds.includes(n.folderId)),
          commands: s.commands.filter(c => !categoryFolderIds.includes(c.folderId)),
          links: s.links.filter(l => !categoryFolderIds.includes(l.folderId)),
          prompts: s.prompts.filter(p => !categoryFolderIds.includes(p.folderId)),
          files: s.files.filter(f => !categoryFolderIds.includes(f.folderId)),
          activeCategoryId: s.activeCategoryId === id ? null : s.activeCategoryId,
        };
      }),

      // ============================================
      // FOLDER ACTIONS
      // ============================================
      setActiveFolderId: (id) => set({ activeFolderId: id }),
      
      addFolder: (folder) => {
        const state = get();
        const maxOrder = Math.max(0, ...state.folders.filter(f => f.categoryId === folder.categoryId && f.parentId === folder.parentId).map(f => f.order));
        const newFolder: Folder = {
          ...folder,
          id: genId(),
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ folders: [...s.folders, newFolder] }));
      },
      
      updateFolder: (id, updates) => set((s) => ({
        folders: s.folders.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      
      deleteFolder: (id) => set((s) => {
        const getChildFolderIds = (parentId: string): string[] => {
          const children = s.folders.filter(f => f.parentId === parentId);
          return [parentId, ...children.flatMap(c => getChildFolderIds(c.id))];
        };
        const folderIds = getChildFolderIds(id);
        
        return {
          folders: s.folders.filter(f => !folderIds.includes(f.id)),
          notes: s.notes.filter(n => !folderIds.includes(n.folderId)),
          commands: s.commands.filter(c => !folderIds.includes(c.folderId)),
          links: s.links.filter(l => !folderIds.includes(l.folderId)),
          prompts: s.prompts.filter(p => !folderIds.includes(p.folderId)),
          files: s.files.filter(f => !folderIds.includes(f.folderId)),
          activeFolderId: s.activeFolderId === id ? null : s.activeFolderId,
        };
      }),
      
      toggleFolderExpanded: (id) => set((s) => ({
        folders: s.folders.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f)
      })),

      // ============================================
      // ITEM SELECTION
      // ============================================
      setActiveItemId: (id) => set({ activeItemId: id }),

      // ============================================
      // NOTE ACTIONS
      // ============================================
      addNote: (note) => {
        const newNote: NoteItem = { 
          ...note, 
          id: genId(), 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
        set((s) => ({ notes: [...s.notes, newNote], activeItemId: newNote.id }));
      },
      
      updateNote: (id, updates) => set((s) => ({
        notes: s.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
      })),
      
      deleteNote: (id) => set((s) => ({
        notes: s.notes.filter(n => n.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),

      // ============================================
      // COMMAND CONTAINER ACTIONS
      // ============================================
      addCommandContainer: (container) => {
        const newC: CommandContainer = { 
          ...container, 
          id: genId(), 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
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
          commands: s.commands.map(c => c.id === containerId ? { 
            ...c, 
            subItems: [...c.subItems, newItem], 
            updatedAt: new Date().toISOString() 
          } : c)
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
          ...c, 
          subItems: c.subItems.filter(i => i.id !== itemId)
        } : c)
      })),

      // ============================================
      // LINK CONTAINER ACTIONS
      // ============================================
      addLinkContainer: (container) => {
        const newC: LinkContainer = { 
          ...container, 
          id: genId(), 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
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
          links: s.links.map(l => l.id === containerId ? { 
            ...l, 
            subItems: [...l.subItems, newItem], 
            updatedAt: new Date().toISOString() 
          } : l)
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

      // ============================================
      // PROMPT CONTAINER ACTIONS
      // ============================================
      addPromptContainer: (container) => {
        const newC: PromptContainer = { 
          ...container, 
          id: genId(), 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
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
          prompts: s.prompts.map(p => p.id === containerId ? { 
            ...p, 
            subItems: [...p.subItems, newItem], 
            updatedAt: new Date().toISOString() 
          } : p)
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

      // ============================================
      // FILE CONTAINER ACTIONS
      // ============================================
      addFileContainer: (container) => {
        const newC: FileContainer = { 
          ...container, 
          id: genId(), 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
        set((s) => ({ files: [...s.files, newC], activeItemId: newC.id }));
      },
      
      updateFileContainer: (id, updates) => set((s) => ({
        files: s.files.map(f => f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)
      })),
      
      deleteFileContainer: (id) => set((s) => ({
        files: s.files.filter(f => f.id !== id),
        activeItemId: s.activeItemId === id ? null : s.activeItemId,
      })),
      
      addFileItem: (containerId, item) => {
        const newItem: FileItem = { 
          ...item, 
          id: item.id || genId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          files: s.files.map(f => f.id === containerId ? { 
            ...f, 
            subItems: [...f.subItems, newItem], 
            updatedAt: new Date().toISOString() 
          } : f)
        }));
      },
      
      updateFileItem: (containerId, itemId, updates) => set((s) => ({
        files: s.files.map(f => f.id === containerId ? {
          ...f, updatedAt: new Date().toISOString(),
          subItems: f.subItems.map(i => i.id === itemId ? { ...i, ...updates } : i)
        } : f)
      })),
      
      deleteFileItem: (containerId, itemId) => set((s) => ({
        files: s.files.map(f => f.id === containerId ? {
          ...f, subItems: f.subItems.filter(i => i.id !== itemId)
        } : f)
      })),

      // ============================================
      // UI ACTIONS
      // ============================================
      setSearchQuery: (query) => set({ searchQuery: query }),
      setShowSettings: (show) => set({ showSettings: show }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleTheme: () => set((s) => ({ isDarkTheme: !s.isDarkTheme })),
      setSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),

      // ============================================
      // DATA OPERATIONS
      // ============================================
      exportData: () => {
        const state = get();
        const data = {
          workspaces: state.workspaces,
          categories: state.categories,
          folders: state.folders,
          notes: state.notes,
          commands: state.commands,
          links: state.links,
          prompts: state.prompts,
          files: state.files,
          exportedAt: new Date().toISOString(),
          version: '3.0',
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
            workspaces: data.workspaces || [],
            categories: data.categories || [],
            folders: data.folders || [],
            notes: data.notes || [],
            commands: data.commands || [],
            links: data.links || [],
            prompts: data.prompts || [],
            files: data.files || [],
            activeWorkspaceId: data.workspaces?.[0]?.id || null,
            activeCategoryId: null,
            activeFolderId: null,
            activeItemId: null,
          });
        } catch (e) {
          console.error('Import failed', e);
        }
      },

      clearAllData: () => set({
        workspaces: [],
        categories: [],
        folders: [],
        notes: [],
        commands: [],
        links: [],
        prompts: [],
        files: [],
        activeWorkspaceId: null,
        activeCategoryId: null,
        activeFolderId: null,
        activeItemId: null,
      }),

      getActiveItem: () => {
        const state = get();
        const { activeItemId, activeCategoryId } = state;
        if (!activeItemId || !activeCategoryId) return null;
        
        const category = state.categories.find(c => c.id === activeCategoryId);
        if (!category) return null;
        
        switch (category.baseType) {
          case 'notes': return state.notes.find(n => n.id === activeItemId) || null;
          case 'commands': return state.commands.find(c => c.id === activeItemId) || null;
          case 'links': return state.links.find(l => l.id === activeItemId) || null;
          case 'prompts': return state.prompts.find(p => p.id === activeItemId) || null;
          case 'files': return state.files.find(f => f.id === activeItemId) || null;
          default: return null;
        }
      },
    }),
    {
      name: 'knowledge-hub-storage',
      partialize: (state) => ({
        settings: state.settings,
        isDarkTheme: state.isDarkTheme,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
