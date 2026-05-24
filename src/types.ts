// ============================================
// WORKSPACE ARCHITECTURE
// ============================================
// Workspace (главный уровень)
// └── Category (Notes, Commands, Links, Prompts, Playbooks)
//     └── Folder (папки пользователя)
//         └── Items (заметки, команды, ссылки, промпты, плейбуки)

// Base data types for items
export type BaseDataType = 'notes' | 'commands' | 'links' | 'prompts' | 'playbooks';

// ============================================
// WORKSPACE - главный уровень организации
// ============================================
export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CATEGORY - тип контента внутри воркспейса
// ============================================
export interface Category {
  id: string;
  workspaceId: string;
  name: string;
  icon: string;
  color: string;
  baseType: BaseDataType;
  order: number;
  isDefault?: boolean; // Дефолтные 4 категории нельзя удалить
}

// ============================================
// FOLDER - папки пользователя внутри категории
// ============================================
export interface Folder {
  id: string;
  categoryId: string;
  parentId: string | null; // Для вложенных папок
  name: string;
  icon?: string;
  color?: string;
  order: number;
  isExpanded: boolean;
  createdAt: string;
}

// ============================================
// ITEMS - контент внутри папок
// ============================================
export interface NoteItem {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'notes';
}

export interface CommandItem {
  id: string;
  command: string;
  description: string;
  language: 'bash' | 'powershell' | 'cmd' | 'zsh' | 'python' | 'javascript';
  tags: string[];
  isFavorite: boolean;
}

export interface CommandContainer {
  id: string;
  folderId: string;
  title: string;
  description?: string;
  subItems: CommandItem[];
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'commands';
  isExpanded?: boolean;
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  tags: string[];
  isFavorite: boolean;
  order?: number;
  sectionId?: string; // ID секции, к которой принадлежит ссылка
  color?: string; // Индивидуальный цвет ячейки (hex)
}

// Секция ссылок (категория внутри файла)
export interface LinkSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  icon?: string;
  color?: string; // Цвет секции для визуальной группировки (hex или название)
}

// Контейнер ссылок (один .md файл)
// Поддерживает два режима:
// 1. Простой: subItems без секций (все ссылки в одном списке)
// 2. С секциями: sections + subItems с sectionId
export interface LinkContainer {
  id: string;
  folderId: string;
  title: string;
  subItems: LinkItem[];
  sections?: LinkSection[]; // Секции для группировки ссылок
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'links';
  isExpanded?: boolean;
}

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  variables: string[];
  description?: string;
  tags: string[];
  isFavorite: boolean;
  sectionId?: string; // ID секции, к которой принадлежит промпт
}

// Секция промптов (категория внутри файла)
export interface PromptSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  color?: string;
}

export interface PromptContainer {
  id: string;
  folderId: string;
  title: string;
  subItems: PromptItem[];
  sections?: PromptSection[]; // Секции для группировки промптов
  category: string;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'prompts';
  isExpanded?: boolean;
}

export type PlaybookLanguage =
  | 'bash' | 'zsh' | 'powershell' | 'cmd'
  | 'python' | 'javascript' | 'sql' | 'yaml' | 'nginx';

export type ChecklistStatus = 'pending' | 'done' | 'skipped';

export interface PlaybookVariable {
  id: string;
  name: string;        // e.g. "TARGET" (uppercase recommended)
  value: string;       // e.g. "10.10.10.5"
  description?: string;
  color?: string;      // accent color for highlighting in code
}

export interface PlaybookItem {
  id: string;
  command: string;
  description: string;
  language: PlaybookLanguage;
  tags: string[];
  isFavorite: boolean;
  sectionId?: string; // ID секции, к которой принадлежит команда
  order: number;
}

// Секция плейбука (категория внутри файла)
export interface PlaybookSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  color?: string;
}

export interface PlaybookContainer {
  id: string;
  folderId: string;
  title: string; // Название сервиса (Docker, Git, nginx, PostgreSQL и т.д.)
  description?: string;
  subItems: PlaybookItem[];
  sections?: PlaybookSection[]; // Секции для группировки команд
  variables?: PlaybookVariable[]; // Context variables for engagement mode
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'playbooks';
  isExpanded?: boolean;
}

export type AnyItem = NoteItem | CommandContainer | LinkContainer | PromptContainer | PlaybookContainer;

// ============================================
// TRASH - удаленные элементы
// ============================================
export interface TrashItem {
  id: string;
  originalId: string;
  type: 'note' | 'command' | 'link' | 'prompt' | 'playbook';
  item: NoteItem | CommandContainer | LinkContainer | PromptContainer | PlaybookContainer;
  // Path info for restoration
  workspaceId: string;
  workspaceName: string;
  categoryId: string;
  categoryName: string;
  folderId: string;
  folderName: string;
  deletedAt: string;
}

// ============================================
// SETTINGS - глобальные настройки приложения
// ============================================
export interface GitHubSyncConfig {
  token: string;
  username?: string;
  lastSync?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  editorWidth: 'full' | 'centered';
  previewMode: 'split' | 'tab' | 'off';
  autoSave: boolean;
  spellCheck: boolean;
  lineNumbers: boolean;
  codeFont: string;
  github: GitHubSyncConfig;
}

// ============================================
// APP STATE - состояние приложения
// ============================================
export interface AppState {
  // Workspaces
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  
  // Categories
  categories: Category[];
  activeCategoryId: string | null;
  
  // Folders
  folders: Folder[];
  activeFolderId: string | null;
  
  // Items
  notes: NoteItem[];
  commands: CommandContainer[];
  links: LinkContainer[];
  prompts: PromptContainer[];
  playbooks: PlaybookContainer[];
  activeItemId: string | null;
  
  // Trash
  trash: TrashItem[];
  showTrash: boolean;
  
  // UI State
  settings: Settings;
  searchQuery: string;
  showSettings: boolean;
  sidebarCollapsed: boolean;
  sidebarCompact: boolean;
  isDarkTheme: boolean;
}

// ============================================
// DATA FILE STRUCTURE - структура файла данных
// ============================================
export interface DataFile {
  workspaces: Workspace[];
  categories: Category[];
  folders: Folder[];
  notes: NoteItem[];
  commands: CommandContainer[];
  links: LinkContainer[];
  prompts: PromptContainer[];
  playbooks: PlaybookContainer[];
  exportedAt: string;
  version: string;
}
