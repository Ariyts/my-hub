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
