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

/**
 * Get current HEAD commit SHA
 */
async function getHeadSha(token: string): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${MAIN_BRANCH}`, token);
  const data = await response.json();
  return data.object.sha;
}

/**
 * Get tree SHA from a commit
 */
async function getCommitTreeSha(token: string, commitSha: string): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/commits/${commitSha}`, token);
  const data = await response.json();
  return data.tree.sha;
}

/**
 * List all files in data/ directory recursively
 */
async function listDataFiles(token: string): Promise<Map<string, string>> {
  const files = new Map<string, string>(); // path -> sha
  
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

/**
 * Create a blob for a file
 */
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

/**
 * Create a tree with all files
 */
async function createTree(
  token: string,
  baseTreeSha: string,
  files: { path: string; sha: string }[],
  pathsToDelete: string[]
): Promise<string> {
  const tree: any[] = [];
  
  // Add files to create/update
  for (const file of files) {
    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: file.sha,
    });
  }
  
  // Add files to delete (null sha)
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

/**
 * Create a commit
 */
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

/**
 * Update HEAD reference
 */
async function updateHead(token: string, commitSha: string): Promise<boolean> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${MAIN_BRANCH}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSha }),
  });
  return response.ok;
}

/**
 * Preview what will be synced
 */
export async function previewSync(config: GitHubConfig, data: DataFile): Promise<SyncPreview> {
  const newFiles = dataToFiles(data);
  const newPaths = new Set(newFiles.map(f => f.path));
  
  let existingFiles: Map<string, string>;
  try {
    existingFiles = await listDataFiles(config.token);
  } catch {
    existingFiles = new Map();
  }
  
  const filesToCreate: string[] = [];
  const filesToUpdate: string[] = [];
  const filesToDelete: string[] = [];
  
  for (const file of newFiles) {
    if (existingFiles.has(file.path)) {
      filesToUpdate.push(file.path);
    } else {
      filesToCreate.push(file.path);
    }
  }
  
  for (const [path] of existingFiles) {
    if (!newPaths.has(path)) {
      filesToDelete.push(path);
    }
  }
  
  return {
    filesToCreate,
    filesToUpdate,
    filesToDelete,
    totalFiles: newFiles.length,
  };
}

/**
 * Save all data in ONE commit
 */
export async function saveToGitHub(config: GitHubConfig, data: DataFile): Promise<SyncResult> {
  if (!config.token) {
    return { success: false, message: 'Token required' };
  }
  
  try {
    // Generate files
    const newFiles = dataToFiles(data);
    if (newFiles.length === 0) {
      return { success: false, message: 'No data to save' };
    }
    
    console.log(`Preparing ${newFiles.length} files...`);
    
    // Get current state
    const headSha = await getHeadSha(config.token);
    const baseTreeSha = await getCommitTreeSha(config.token, headSha);
    const existingFiles = await listDataFiles(config.token);
    
    // Determine what to delete
    const newPaths = new Set(newFiles.map(f => f.path));
    const pathsToDelete: string[] = [];
    for (const [path] of existingFiles) {
      if (!newPaths.has(path)) {
        pathsToDelete.push(path);
      }
    }
    
    // Create blobs for all files
    console.log('Creating blobs...');
    const blobs: { path: string; sha: string }[] = [];
    for (const file of newFiles) {
      const blobSha = await createBlob(config.token, file.content);
      blobs.push({ path: file.path, sha: blobSha });
    }
    
    // Create tree
    console.log('Creating tree...');
    const treeSha = await createTree(config.token, baseTreeSha, blobs, pathsToDelete);
    
    // Create commit
    console.log('Creating commit...');
    const timestamp = new Date().toLocaleString();
    const commitSha = await createCommit(
      config.token,
      `Update data - ${timestamp}`,
      treeSha,
      headSha
    );
    
    // Update HEAD
    console.log('Updating HEAD...');
    const success = await updateHead(config.token, commitSha);
    
    if (!success) {
      return { success: false, message: 'Failed to update branch' };
    }
    
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
