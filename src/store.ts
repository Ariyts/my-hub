import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, Workspace, Category, Folder, NoteItem,
  CommandContainer, LinkContainer, PromptContainer,
  CommandItem, LinkItem, PromptItem, Settings, AnyItem, TrashItem
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

  // Trash actions
  setShowTrash: (show: boolean) => void;
  restoreFromTrash: (trashId: string) => void;
  permanentlyDelete: (trashId: string) => void;
  clearTrash: () => void;

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
      // ============================================
      // INITIAL STATE
      // ============================================
      workspaces: initialData.workspaces || [],
      activeWorkspaceId: initialData.workspaces?.[0]?.id || null,
      
      categories: initialData.categories || [],
      activeCategoryId: null,
      
      folders: initialData.folders || [],
      activeFolderId: null,
      
      notes: initialData.notes || [],
      commands: initialData.commands || [],
      links: initialData.links || [],
      prompts: initialData.prompts || [],
      activeItemId: null,
      
      // Trash
      trash: [],
      showTrash: false,
      
      settings: defaultSettings,
      searchQuery: '',
      showSettings: false,
      sidebarCollapsed: false,
      isDarkTheme: false,

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
        
        // Create default categories for new workspace
        const defaultCategories: Category[] = [
          { id: genId(), workspaceId: newWorkspace.id, name: 'Notes', icon: '📝', color: '#4CAF50', baseType: 'notes', order: 0, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Commands', icon: '⌘', color: '#2196F3', baseType: 'commands', order: 1, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Links', icon: '🔗', color: '#FF9800', baseType: 'links', order: 2, isDefault: true },
          { id: genId(), workspaceId: newWorkspace.id, name: 'Prompts', icon: '💬', color: '#9C27B0', baseType: 'prompts', order: 3, isDefault: true },
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
        // Get all categories for this workspace
        const workspaceCategoryIds = s.categories.filter(c => c.workspaceId === id).map(c => c.id);
        // Get all folders for these categories
        const categoryFolderIds = s.folders.filter(f => workspaceCategoryIds.includes(f.categoryId)).map(f => f.id);
        
        return {
          workspaces: s.workspaces.filter(w => w.id !== id),
          categories: s.categories.filter(c => c.workspaceId !== id),
          folders: s.folders.filter(f => !workspaceCategoryIds.includes(f.categoryId)),
          notes: s.notes.filter(n => !categoryFolderIds.includes(n.folderId)),
          commands: s.commands.filter(c => !categoryFolderIds.includes(c.folderId)),
          links: s.links.filter(l => !categoryFolderIds.includes(l.folderId)),
          prompts: s.prompts.filter(p => !categoryFolderIds.includes(p.folderId)),
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
        // Get all child folder IDs recursively
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
      
      deleteNote: (id) => set((s) => {
        const note = s.notes.find(n => n.id === id);
        if (!note) return s;
        
        // Find folder, category and workspace info
        const folder = s.folders.find(f => f.id === note.folderId);
        const category = folder ? s.categories.find(c => c.id === folder.categoryId) : null;
        const workspace = category ? s.workspaces.find(w => w.id === category.workspaceId) : null;
        
        const trashItem: TrashItem = {
          id: genId(),
          originalId: note.id,
          type: 'note',
          item: note,
          workspaceId: workspace?.id || '',
          workspaceName: workspace?.name || 'Unknown',
          categoryId: category?.id || '',
          categoryName: category?.name || 'Unknown',
          folderId: folder?.id || '',
          folderName: folder?.name || 'Unknown',
          deletedAt: new Date().toISOString(),
        };
        
        return {
          notes: s.notes.filter(n => n.id !== id),
          trash: [...s.trash, trashItem],
          activeItemId: s.activeItemId === id ? null : s.activeItemId,
        };
      }),

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
      
      deleteCommandContainer: (id) => set((s) => {
        const command = s.commands.find(c => c.id === id);
        if (!command) return s;
        
        const folder = s.folders.find(f => f.id === command.folderId);
        const category = folder ? s.categories.find(c => c.id === folder.categoryId) : null;
        const workspace = category ? s.workspaces.find(w => w.id === category.workspaceId) : null;
        
        const trashItem: TrashItem = {
          id: genId(),
          originalId: command.id,
          type: 'command',
          item: command,
          workspaceId: workspace?.id || '',
          workspaceName: workspace?.name || 'Unknown',
          categoryId: category?.id || '',
          categoryName: category?.name || 'Unknown',
          folderId: folder?.id || '',
          folderName: folder?.name || 'Unknown',
          deletedAt: new Date().toISOString(),
        };
        
        return {
          commands: s.commands.filter(c => c.id !== id),
          trash: [...s.trash, trashItem],
          activeItemId: s.activeItemId === id ? null : s.activeItemId,
        };
      }),
      
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
      
      deleteLinkContainer: (id) => set((s) => {
        const link = s.links.find(l => l.id === id);
        if (!link) return s;
        
        const folder = s.folders.find(f => f.id === link.folderId);
        const category = folder ? s.categories.find(c => c.id === folder.categoryId) : null;
        const workspace = category ? s.workspaces.find(w => w.id === category.workspaceId) : null;
        
        const trashItem: TrashItem = {
          id: genId(),
          originalId: link.id,
          type: 'link',
          item: link,
          workspaceId: workspace?.id || '',
          workspaceName: workspace?.name || 'Unknown',
          categoryId: category?.id || '',
          categoryName: category?.name || 'Unknown',
          folderId: folder?.id || '',
          folderName: folder?.name || 'Unknown',
          deletedAt: new Date().toISOString(),
        };
        
        return {
          links: s.links.filter(l => l.id !== id),
          trash: [...s.trash, trashItem],
          activeItemId: s.activeItemId === id ? null : s.activeItemId,
        };
      }),
      
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
      
      deletePromptContainer: (id) => set((s) => {
        const prompt = s.prompts.find(p => p.id === id);
        if (!prompt) return s;
        
        const folder = s.folders.find(f => f.id === prompt.folderId);
        const category = folder ? s.categories.find(c => c.id === folder.categoryId) : null;
        const workspace = category ? s.workspaces.find(w => w.id === category.workspaceId) : null;
        
        const trashItem: TrashItem = {
          id: genId(),
          originalId: prompt.id,
          type: 'prompt',
          item: prompt,
          workspaceId: workspace?.id || '',
          workspaceName: workspace?.name || 'Unknown',
          categoryId: category?.id || '',
          categoryName: category?.name || 'Unknown',
          folderId: folder?.id || '',
          folderName: folder?.name || 'Unknown',
          deletedAt: new Date().toISOString(),
        };
        
        return {
          prompts: s.prompts.filter(p => p.id !== id),
          trash: [...s.trash, trashItem],
          activeItemId: s.activeItemId === id ? null : s.activeItemId,
        };
      }),
      
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
      // TRASH ACTIONS
      // ============================================
      setShowTrash: (show) => set({ showTrash: show }),
      
      restoreFromTrash: (trashId) => set((s) => {
        const trashItem = s.trash.find(t => t.id === trashId);
        if (!trashItem) return s;
        
        // Check if the original folder still exists
        const folderExists = s.folders.some(f => f.id === trashItem.folderId);
        if (!folderExists) {
          // Create the folder back if it doesn't exist
          // First check if category exists
          const categoryExists = s.categories.some(c => c.id === trashItem.categoryId);
          if (!categoryExists) {
            // Create category
            const newCategory: Category = {
              id: trashItem.categoryId,
              workspaceId: trashItem.workspaceId,
              name: trashItem.categoryName,
              icon: '📁',
              color: '#6366f1',
              baseType: trashItem.type === 'note' ? 'notes' : 
                        trashItem.type === 'command' ? 'commands' : 
                        trashItem.type === 'link' ? 'links' : 'prompts',
              order: 999,
              isDefault: false,
            };
            s.categories.push(newCategory);
          }
          
          // Create folder
          const newFolder: Folder = {
            id: trashItem.folderId,
            categoryId: trashItem.categoryId,
            parentId: null,
            name: trashItem.folderName,
            order: 999,
            isExpanded: true,
            createdAt: new Date().toISOString(),
          };
          s.folders.push(newFolder);
        }
        
        // Restore the item
        const restoredItem = { ...trashItem.item } as any;
        
        const newState: any = {
          trash: s.trash.filter(t => t.id !== trashId),
        };
        
        switch (trashItem.type) {
          case 'note':
            newState.notes = [...s.notes, restoredItem as NoteItem];
            break;
          case 'command':
            newState.commands = [...s.commands, restoredItem as CommandContainer];
            break;
          case 'link':
            newState.links = [...s.links, restoredItem as LinkContainer];
            break;
          case 'prompt':
            newState.prompts = [...s.prompts, restoredItem as PromptContainer];
            break;
        }
        
        return newState;
      }),
      
      permanentlyDelete: (trashId) => set((s) => ({
        trash: s.trash.filter(t => t.id !== trashId),
      })),
      
      clearTrash: () => set({ trash: [] }),

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
          exportedAt: new Date().toISOString(),
          version: '2.0',
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
        trash: [],
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
          default: return null;
        }
      },

      // ============================================
      // GITHUB SYNC
      // ============================================
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
          workspaces: state.workspaces,
          categories: state.categories,
          folders: state.folders,
          notes: state.notes,
          commands: state.commands,
          links: state.links,
          prompts: state.prompts,
          exportedAt: new Date().toISOString(),
          version: '2.0',
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
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
