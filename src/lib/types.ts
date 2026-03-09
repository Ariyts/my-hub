// ============================================
// KNOWLEDGE HUB TYPES
// ============================================

// Base data types for items
export type BaseDataType = 'notes' | 'commands' | 'links' | 'prompts' | 'files';

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
  isDefault?: boolean;
}

// ============================================
// FOLDER - папки пользователя внутри категории
// ============================================
export interface Folder {
  id: string;
  categoryId: string;
  parentId: string | null;
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

// ============================================
// DROPBOX FILES
// ============================================
export interface DropboxFile {
  id: string;
  name: string;
  path_display: string;
  path_lower: string;
  '.tag': 'file' | 'folder';
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  size?: number;
  is_downloadable?: boolean;
  content_hash?: string;
}

export interface DropboxFolder {
  id: string;
  name: string;
  path_display: string;
  path_lower: string;
  '.tag': 'folder';
}

export interface FileItem {
  id: string;
  folderId: string;
  title: string;
  dropboxPath: string;
  fileName: string;
  fileType: string;
  size: number;
  tags: string[];
  isFavorite: boolean;
  thumbnailUrl?: string;
  sharedUrl?: string;
  createdAt: string;
  updatedAt: string;
  type: 'files';
}

export interface FileContainer {
  id: string;
  folderId: string;
  title: string;
  dropboxFolder?: string;
  subItems: FileItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  type: 'files';
  isExpanded?: boolean;
}

export type AnyItem = NoteItem | CommandContainer | LinkContainer | PromptContainer | FileContainer;

// ============================================
// SETTINGS
// ============================================
export interface GitHubSyncConfig {
  token: string;
  username?: string;
  lastSync?: string;
}

export interface DropboxConfig {
  accessToken: string;
  connected: boolean;
  email?: string;
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
  dropbox: DropboxConfig;
}

// ============================================
// APP STATE
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
  files: FileContainer[];
  activeItemId: string | null;
  
  // UI State
  settings: Settings;
  searchQuery: string;
  showSettings: boolean;
  sidebarCollapsed: boolean;
  isDarkTheme: boolean;
}

// ============================================
// DATA FILE STRUCTURE
// ============================================
export interface DataFile {
  workspaces: Workspace[];
  categories: Category[];
  folders: Folder[];
  notes: NoteItem[];
  commands: CommandContainer[];
  links: LinkContainer[];
  prompts: PromptContainer[];
  files: FileContainer[];
  exportedAt: string;
  version: string;
}

// ============================================
// DROPBOX API TYPES
// ============================================
export interface DropboxListFolderResult {
  entries: DropboxFile[];
  cursor: string;
  has_more: boolean;
}

export interface DropboxFileMetadata {
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  size?: number;
  media_info?: {
    '.tag': string;
    metadata?: {
      '.tag': string;
      dimensions?: {
        height: number;
        width: number;
      };
    };
  };
}

export interface DropboxSharedLink {
  url: string;
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  expires?: string;
}

// File type categories
export type FileCategory = 'image' | 'document' | 'video' | 'audio' | 'code' | 'archive' | 'other';

export function getFileCategory(filename: string): FileCategory {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'json', 'xml', 'yaml', 'yml'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  
  if (imageExts.includes(ext)) return 'image';
  if (documentExts.includes(ext)) return 'document';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (codeExts.includes(ext)) return 'code';
  if (archiveExts.includes(ext)) return 'archive';
  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
