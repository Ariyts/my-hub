export type ObjectType = 'notes' | 'commands' | 'links' | 'prompts';

export interface Folder {
  id: string;
  name: string;
  type: ObjectType;
  parentId: string | null;
  createdAt: string;
  color?: string;
  icon?: string;
  isExpanded?: boolean;
}

export interface NoteItem {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
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
}

export interface LinkContainer {
  id: string;
  folderId: string;
  title: string;
  subItems: LinkItem[];
  tags: string[];
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
}

export interface PromptContainer {
  id: string;
  folderId: string;
  title: string;
  subItems: PromptItem[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  type: 'prompts';
  isExpanded?: boolean;
}

export type AnyItem = NoteItem | CommandContainer | LinkContainer | PromptContainer;

export interface GitHubSyncConfig {
  token: string;
  username?: string;
  repo?: string;
  branch?: string;
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

export interface AppState {
  activeType: ObjectType;
  activeFolderId: string | null;
  activeItemId: string | null;
  folders: Folder[];
  notes: NoteItem[];
  commands: CommandContainer[];
  links: LinkContainer[];
  prompts: PromptContainer[];
  settings: Settings;
  searchQuery: string;
  showSettings: boolean;
  sidebarCollapsed: boolean;
  isDarkTheme: boolean;
}
