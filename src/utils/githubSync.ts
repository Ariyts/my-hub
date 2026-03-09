/**
 * GitHub Sync Service
 * Saves data as .md files to data/ folder in main branch
 * Creates ONE commit with all changes
 */

import { dataToFiles, FileStructure } from './mdStorage';
import type { DataFile } from '../types';

export interface GitHubConfig {
  token: string;
  username?: string;
  lastSync?: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface SyncPreview {
  filesToCreate: string[];
  filesToUpdate: string[];
  filesToDelete: string[];
  totalFiles: number;
  allFiles: string[];
}

const GITHUB_API = 'https://api.github.com';
const REPO = 'Ariyts/my-hub';
const MAIN_BRANCH = 'main';

async function githubRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

export async function getUserInfo(token: string): Promise<{ username: string; name: string } | null> {
  try {
    const response = await githubRequest('/user', token);
    if (!response.ok) return null;
    const user = await response.json();
    return { username: user.login, name: user.name || user.login };
  } catch {
    return null;
  }
}

async function checkWriteAccess(token: string, username: string): Promise<boolean> {
  const response = await githubRequest(`/repos/${REPO}/collaborators/${username}/permission`, token);
  if (!response.ok) return false;
  const data = await response.json();
  return data.permission === 'admin' || data.permission === 'write';
}

export async function initializeGitHubSync(token: string): Promise<GitHubConfig & SyncResult> {
  try {
    const userInfo = await getUserInfo(token);
    if (!userInfo) {
      return { token, success: false, message: 'Invalid token' };
    }
    const hasAccess = await checkWriteAccess(token, userInfo.username);
    if (!hasAccess) {
      return { token, username: userInfo.username, success: false, message: 'No write access' };
    }
    return { token, username: userInfo.username, success: true, message: `Ready as @${userInfo.username}` };
  } catch (error: any) {
    return { token, success: false, message: error.message || 'Failed to connect' };
  }
}

async function getHeadSha(token: string): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${MAIN_BRANCH}`, token);
  const data = await response.json();
  return data.object.sha;
}

async function getCommitTreeSha(token: string, commitSha: string): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/commits/${commitSha}`, token);
  const data = await response.json();
  return data.tree.sha;
}

async function listDataFiles(token: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  
  async function listDir(path: string): Promise<void> {
    const response = await githubRequest(
      `/repos/${REPO}/contents/${path}?ref=${MAIN_BRANCH}`,
      token
    );
    if (!response.ok) return;
    
    const data = await response.json();
    if (!Array.isArray(data)) return;
    
    for (const item of data) {
      if (item.type === 'dir') {
        await listDir(item.path);
      } else if (item.type === 'file' && item.path.endsWith('.md')) {
        files.set(item.path, item.sha);
      }
    }
  }
  
  await listDir('data');
  return files;
}

async function createBlob(token: string, content: string): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/blobs`, token, {
    method: 'POST',
    body: JSON.stringify({
      content: btoa(unescape(encodeURIComponent(content))),
      encoding: 'base64',
    }),
  });
  const data = await response.json();
  return data.sha;
}

async function createTree(
  token: string,
  baseTreeSha: string,
  files: { path: string; sha: string }[],
  pathsToDelete: string[]
): Promise<string> {
  const tree: any[] = [];
  
  for (const file of files) {
    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: file.sha,
    });
  }
  
  for (const path of pathsToDelete) {
    tree.push({
      path,
      mode: '100644',
      type: 'blob',
      sha: null,
    });
  }
  
  const response = await githubRequest(`/repos/${REPO}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree,
    }),
  });
  
  const data = await response.json();
  return data.sha;
}

async function createCommit(
  token: string,
  message: string,
  treeSha: string,
  parentSha: string
): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha],
    }),
  });
  const data = await response.json();
  return data.sha;
}

async function updateHead(token: string, commitSha: string): Promise<boolean> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${MAIN_BRANCH}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSha }),
  });
  return response.ok;
}

/**
 * Save sync time to localStorage
 */
export function saveSyncTime(): void {
  localStorage.setItem('sync-state-time', new Date().toISOString());
}

/**
 * Get local preview - compare by updatedAt timestamp
 * Priority: localStorage sync time > exportedAt (build time)
 */
export function getLocalPreview(data: DataFile): SyncPreview {
  const newFiles = dataToFiles(data);
  const allPaths = newFiles.map(f => f.path);
  
  // IMPORTANT: Check localStorage FIRST (user's last sync time)
  // Then fall back to exportedAt (build time) for initial load
  const lastSyncTime = localStorage.getItem('sync-state-time') || data.exportedAt || '1970-01-01';
  
  const filesToCreate: string[] = [];
  const filesToUpdate: string[] = [];
  const filesToDelete: string[] = [];
  
  // Build lookup maps
  const folderMap = new Map(data.folders.map(f => [f.id, f]));
  const categoryMap = new Map(data.categories.map(c => [c.id, c]));
  const workspaceMap = new Map(data.workspaces.map(w => [w.id, w]));
  
  // Helper to build file path
  const getItemPath = (folderId: string, title: string): string | null => {
    const folder = folderMap.get(folderId);
    if (!folder) return null;
    const category = categoryMap.get(folder.categoryId);
    if (!category) return null;
    const workspace = workspaceMap.get(category.workspaceId);
    if (!workspace) return null;
    
    const sanitize = (s: string) => s.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').substring(0, 50);
    const fileName = sanitize(title) || 'Untitled';
    
    return `data/${workspace.name}/${category.name}/${folder.name}/${fileName}.md`;
  };
  
  // Process all item types
  const processItems = (items: Array<{folderId: string; title: string; createdAt: string; updatedAt: string}>) => {
    for (const item of items) {
      const path = getItemPath(item.folderId, item.title);
      if (!path) continue;
      
      if (item.createdAt > lastSyncTime) {
        filesToCreate.push(path);
      } else if (item.updatedAt > lastSyncTime) {
        filesToUpdate.push(path);
      }
    }
  };
  
  processItems(data.notes);
  processItems(data.commands);
  processItems(data.links);
  processItems(data.prompts);
  
  // Remove duplicates (new takes priority over update)
  const createSet = new Set(filesToCreate);
  const updateSet = new Set(filesToUpdate);
  for (const path of createSet) {
    updateSet.delete(path);
  }
  
  return {
    filesToCreate: [...createSet],
    filesToUpdate: [...updateSet],
    filesToDelete,
    totalFiles: newFiles.length,
    allFiles: allPaths,
  };
}

/**
 * Preview what will be synced
 */
export async function previewSync(config: GitHubConfig, data: DataFile): Promise<SyncPreview> {
  return getLocalPreview(data);
}

/**
 * Save all data in ONE commit
 */
export async function saveToGitHub(config: GitHubConfig, data: DataFile): Promise<SyncResult> {
  if (!config.token) {
    return { success: false, message: 'Token required' };
  }
  
  try {
    const newFiles = dataToFiles(data);
    if (newFiles.length === 0) {
      return { success: false, message: 'No data to save' };
    }
    
    console.log(`Preparing ${newFiles.length} files...`);
    
    const headSha = await getHeadSha(config.token);
    const baseTreeSha = await getCommitTreeSha(config.token, headSha);
    const existingFiles = await listDataFiles(config.token);
    
    const newPaths = new Set(newFiles.map(f => f.path));
    const pathsToDelete: string[] = [];
    for (const [path] of existingFiles) {
      if (!newPaths.has(path)) {
        pathsToDelete.push(path);
      }
    }
    
    console.log('Creating blobs...');
    const blobs: { path: string; sha: string }[] = [];
    for (const file of newFiles) {
      const blobSha = await createBlob(config.token, file.content);
      blobs.push({ path: file.path, sha: blobSha });
    }
    
    console.log('Creating tree...');
    const treeSha = await createTree(config.token, baseTreeSha, blobs, pathsToDelete);
    
    console.log('Creating commit...');
    const timestamp = new Date().toLocaleString();
    const commitSha = await createCommit(
      config.token,
      `Update data - ${timestamp}`,
      treeSha,
      headSha
    );
    
    console.log('Updating HEAD...');
    const success = await updateHead(config.token, commitSha);
    
    if (!success) {
      return { success: false, message: 'Failed to update branch' };
    }
    
    // Save sync time for future change detection
    saveSyncTime();
    
    const stats = {
      created: newFiles.filter(f => !existingFiles.has(f.path)).length,
      updated: newFiles.filter(f => existingFiles.has(f.path)).length,
      deleted: pathsToDelete.length,
    };
    
    return {
      success: true,
      message: `Saved ${newFiles.length} files (${stats.created} new, ${stats.updated} updated, ${stats.deleted} deleted). Site rebuilding...`,
      data: { lastSync: new Date().toISOString(), stats },
    };
  } catch (error: any) {
    console.error('GitHub save error:', error);
    return { success: false, message: error.message || 'Failed to save' };
  }
}

// ============================================
// PUBLIC LOAD (no token required)
// ============================================

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Ariyts/my-hub/main';

/**
 * Fetch file content from GitHub raw URL (public, no auth required)
 */
async function fetchRawFile(path: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_RAW_URL}/${path}`, {
      cache: 'no-store', // Bypass cache
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`[fetchRawFile] Error fetching ${path}:`, error);
    return null;
  }
}

/**
 * List files in a directory using GitHub API (public, rate limited)
 */
async function listPublicFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${MAIN_BRANCH}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) return files;
    
    const data = await response.json();
    if (!Array.isArray(data)) return files;
    
    for (const item of data) {
      if (item.type === 'file' && item.path.endsWith('.md')) {
        files.push(item.path);
      } else if (item.type === 'dir') {
        const subFiles = await listPublicFiles(item.path);
        files.push(...subFiles);
      }
    }
  } catch (error) {
    console.error(`[listPublicFiles] Error listing ${dirPath}:`, error);
  }
  
  return files;
}

/**
 * Load data from GitHub without authentication
 * Uses public raw URLs for file access
 */
export async function loadFromGitHubPublic(): Promise<{ success: boolean; data?: DataFile; message: string }> {
  try {
    console.log('[loadFromGitHubPublic] Starting public data load...');
    
    // 1. Fetch metadata.json
    const metadataContent = await fetchRawFile('data/metadata.json');
    if (!metadataContent) {
      return { success: false, message: 'metadata.json not found in repository' };
    }
    
    const metadata = JSON.parse(metadataContent);
    
    // 2. Initialize result
    const result: DataFile = {
      workspaces: metadata.workspaces || [],
      categories: metadata.categories || [],
      folders: metadata.folders || [],
      notes: [],
      commands: [],
      links: [],
      prompts: [],
      files: [],
      exportedAt: metadata.exportedAt || new Date().toISOString(),
      version: metadata.version || '3.0',
    };
    
    // 3. List and fetch all .md files
    const mdFiles = await listPublicFiles('data');
    console.log(`[loadFromGitHubPublic] Found ${mdFiles.length} .md files`);
    
    for (const filePath of mdFiles) {
      const content = await fetchRawFile(filePath);
      if (!content) continue;
      
      // Parse path: data/Workspace/Category/Folder/file.md
      const pathParts = filePath.split('/');
      if (pathParts.length < 5) continue;
      
      const wsName = decodeURIComponent(pathParts[1]);
      const catName = decodeURIComponent(pathParts[2]);
      const folderName = decodeURIComponent(pathParts[3]);
      
      // Find matching workspace, category, folder
      const workspace = result.workspaces.find(w => w.name === wsName);
      if (!workspace) continue;
      
      const category = result.categories.find(c => 
        c.workspaceId === workspace.id && c.name === catName
      );
      if (!category) continue;
      
      const folder = result.folders.find(f => 
        f.categoryId === category.id && f.name === folderName
      );
      if (!folder) continue;
      
      // Parse frontmatter
      const { frontmatter, body } = parseFrontmatter(content);
      const fileName = pathParts[pathParts.length - 1].replace('.md', '');
      const title = frontmatter.title || fileName;
      
      // Add item based on category type
      if (category.baseType === 'notes') {
        result.notes.push({
          id: frontmatter.id || `note_${filePath}`,
          folderId: folder.id,
          title,
          content: body.trim(),
          tags: frontmatter.tags || [],
          isFavorite: frontmatter.isFavorite || false,
          order: frontmatter.order ?? result.notes.filter(n => n.folderId === folder.id).length,
          createdAt: frontmatter.createdAt || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt || new Date().toISOString(),
          type: 'notes',
        });
      } else if (category.baseType === 'links') {
        const parsed = parseLinksFromBody(body);
        result.links.push({
          id: frontmatter.id || `link_${filePath}`,
          folderId: folder.id,
          title,
          subItems: parsed.subItems,
          sections: parsed.sections,
          tags: frontmatter.tags || [],
          order: frontmatter.order ?? result.links.filter(l => l.folderId === folder.id).length,
          createdAt: frontmatter.createdAt || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt || new Date().toISOString(),
          type: 'links',
        });
      } else if (category.baseType === 'commands') {
        const subItems = parseCommandsFromBody(body);
        result.commands.push({
          id: frontmatter.id || `cmd_${filePath}`,
          folderId: folder.id,
          title,
          description: frontmatter.description || '',
          subItems,
          tags: frontmatter.tags || [],
          order: frontmatter.order ?? result.commands.filter(c => c.folderId === folder.id).length,
          createdAt: frontmatter.createdAt || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt || new Date().toISOString(),
          type: 'commands',
        });
      } else if (category.baseType === 'prompts') {
        const subItems = parsePromptsFromBody(body);
        result.prompts.push({
          id: frontmatter.id || `prm_${filePath}`,
          folderId: folder.id,
          title,
          category: frontmatter.category || '',
          subItems,
          tags: frontmatter.tags || [],
          order: frontmatter.order ?? result.prompts.filter(p => p.folderId === folder.id).length,
          createdAt: frontmatter.createdAt || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt || new Date().toISOString(),
          type: 'prompts',
        });
      }
    }
    
    // Save last sync time
    localStorage.setItem('last-public-sync', new Date().toISOString());
    
    console.log(`[loadFromGitHubPublic] Loaded: ${result.notes.length} notes, ${result.links.length} links, ${result.commands.length} commands, ${result.prompts.length} prompts`);
    
    return { 
      success: true, 
      data: result, 
      message: `Loaded ${result.notes.length + result.links.length + result.commands.length + result.prompts.length} items` 
    };
  } catch (error: any) {
    console.error('[loadFromGitHubPublic] Error:', error);
    return { success: false, message: error.message || 'Failed to load data' };
  }
}

// Helper parsing functions
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  
  const frontmatter: Record<string, any> = {};
  match[1].split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      let key = line.substring(0, idx).trim();
      let value: any = line.substring(idx + 1).trim();
      
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map((v: string) => v.trim().replace(/^["']|["']$/g, "")).filter((v: string) => v);
      } else if (value === "true") value = true;
      else if (value === "false") value = false;
      else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });
  return { frontmatter, body: match[2] };
}

function parseLinksFromBody(body: string): { sections: any[]; subItems: any[] } {
  const sections: any[] = [];
  const subItems: any[] = [];
  const lines = body.split('\n');
  
  let currentSection: any = null;
  let linkOrder = 0;
  const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;
    
    if (trimmedLine.startsWith('## ')) {
      let sectionTitle = trimmedLine.slice(3).trim();
      let sectionIcon: string | undefined;
      
      const emojiMatch = sectionTitle.match(/^([\u{1F300}-\u{1F9FF}]\s*)/u);
      if (emojiMatch) {
        sectionIcon = emojiMatch[0].trim();
        sectionTitle = sectionTitle.slice(emojiMatch[0].length).trim();
      }
      
      currentSection = {
        id: genId(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
        icon: sectionIcon,
      };
      
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith('<!-- section:')) {
        const metaMatch = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSection.order = typeof meta.order === 'number' ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
            currentSection.color = meta.color;
            currentSection.icon = meta.icon || currentSection.icon;
          } catch {}
        }
        i++;
      }
      
      sections.push(currentSection);
      linkOrder = 0;
      continue;
    }
    
    if (trimmedLine.startsWith('- [') || trimmedLine.startsWith('-[')) {
      let linkMeta: any = {};
      const metaMatch = trimmedLine.match(/<!--\s*link:\s*(\{.*?\})\s*-->/);
      if (metaMatch) {
        try {
          linkMeta = JSON.parse(metaMatch[1]);
        } catch {}
      }
      
      const cleanLine = trimmedLine.replace(/<!--\s*link:.*?-->/, '').trim();
      const linkMatch = cleanLine.match(/^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/);
      
      if (linkMatch) {
        const [, title, url, rest] = linkMatch;
        subItems.push({
          id: linkMeta.id || genId(),
          url,
          title: title || url,
          description: rest.trim() || linkMeta.description || undefined,
          favicon: linkMeta.favicon,
          tags: linkMeta.tags || [],
          isFavorite: linkMeta.isFavorite ?? false,
          order: linkMeta.order ?? linkOrder++,
          sectionId: linkMeta.sectionId || (currentSection?.id),
          color: linkMeta.color,
        });
      }
    }
  }
  
  return { sections, subItems };
}

function parseCommandsFromBody(body: string): any[] {
  const items: any[] = [];
  const sections = body.split(/^### /m).filter(s => s.trim());
  const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  
  for (const section of sections) {
    const lines = section.split('\n');
    const itemId = lines[0].trim();
    
    const codeMatch = section.match(/```(\w+)\n([\s\S]*?)```/);
    const descMatch = section.match(/```[\s\S]*?```\s*\n_(.+?)_/);
    
    if (codeMatch) {
      items.push({
        id: itemId || genId(),
        command: codeMatch[2].trim(),
        description: descMatch ? descMatch[1] : '',
        language: codeMatch[1] || 'bash',
        tags: [],
        isFavorite: false
      });
    }
  }
  
  return items;
}

function parsePromptsFromBody(body: string): any[] {
  const items: any[] = [];
  const sections = body.split(/^### /m).filter(s => s.trim());
  const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  
  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0].trim();
    
    const descMatch = section.match(/^_(.+?)_/m);
    const codeMatch = section.match(/```\n([\s\S]*?)```/);
    const varsMatch = section.match(/\*\*Variables:\*\*\s*(.+)/);
    
    if (codeMatch) {
      items.push({
        id: genId(),
        title,
        prompt: codeMatch[1].trim(),
        description: descMatch ? descMatch[1] : '',
        variables: varsMatch ? varsMatch[1].split(',').map(v => v.trim()) : [],
        tags: [],
        isFavorite: false
      });
    }
  }
  
  return items;
}
