/**
 * GitHub Sync Service
 * Saves data as .md files to the 'data' branch of the same repository
 * File structure: data/{workspace}/{category}/{folder}/{note}.md
 * Triggers automatic rebuild via GitHub Actions
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

const GITHUB_API = 'https://api.github.com';
const REPO = 'Ariyts/my-hub';
const DATA_BRANCH = 'data';

/**
 * Make an authenticated request to GitHub API
 */
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

/**
 * Get authenticated user info
 */
export async function getUserInfo(token: string): Promise<{ username: string; name: string } | null> {
  try {
    const response = await githubRequest('/user', token);
    if (!response.ok) return null;
    
    const user = await response.json();
    return {
      username: user.login,
      name: user.name || user.login,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user has write access to the repo
 */
async function checkWriteAccess(token: string, username: string): Promise<boolean> {
  const response = await githubRequest(`/repos/${REPO}/collaborators/${username}/permission`, token);
  if (!response.ok) return false;
  
  const data = await response.json();
  return data.permission === 'admin' || data.permission === 'write';
}

/**
 * Initialize - verify token has write access
 */
export async function initializeGitHubSync(token: string): Promise<GitHubConfig & SyncResult> {
  try {
    const userInfo = await getUserInfo(token);
    if (!userInfo) {
      return {
        token,
        success: false,
        message: 'Invalid token',
      };
    }
    
    const hasAccess = await checkWriteAccess(token, userInfo.username);
    if (!hasAccess) {
      return {
        token,
        username: userInfo.username,
        success: false,
        message: 'No write access. Contact the owner.',
      };
    }
    
    return {
      token,
      username: userInfo.username,
      success: true,
      message: `Ready as @${userInfo.username}`,
    };
  } catch (error: any) {
    return {
      token,
      success: false,
      message: error.message || 'Failed to connect',
    };
  }
}

/**
 * Get base branch ref
 */
async function getBranchRef(token: string, branch: string): Promise<{ sha: string }> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${branch}`, token);
  if (!response.ok) throw new Error(`Cannot get branch ref: ${branch}`);
  const data = await response.json();
  return { sha: data.object.sha };
}

/**
 * Ensure data branch exists
 */
async function ensureDataBranch(token: string): Promise<string> {
  // Check if branch exists
  const checkResponse = await githubRequest(`/repos/${REPO}/branches/${DATA_BRANCH}`, token);
  if (checkResponse.ok) {
    const ref = await getBranchRef(token, DATA_BRANCH);
    return ref.sha;
  }
  
  // Get default branch SHA
  const repoResponse = await githubRequest(`/repos/${REPO}`, token);
  if (!repoResponse.ok) throw new Error('Cannot access repo');
  
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;
  
  const refResponse = await githubRequest(`/repos/${REPO}/git/refs/heads/${defaultBranch}`, token);
  if (!refResponse.ok) throw new Error('Cannot get branch ref');
  
  const refData = await refResponse.json();
  
  // Create orphan branch (empty)
  // First create a tree with no files
  const treeResponse = await githubRequest(`/repos/${REPO}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: refData.object.sha,
      tree: [],
    }),
  });
  
  if (!treeResponse.ok) {
    // Just create branch from default
    await githubRequest(`/repos/${REPO}/git/refs`, token, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${DATA_BRANCH}`,
        sha: refData.object.sha,
      }),
    });
    return refData.object.sha;
  }
  
  const treeData = await treeResponse.json();
  
  // Create commit
  const commitResponse = await githubRequest(`/repos/${REPO}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({
      message: 'Initialize data branch',
      tree: treeData.sha,
      parents: [],
    }),
  });
  
  if (!commitResponse.ok) throw new Error('Cannot create initial commit');
  const commitData = await commitResponse.json();
  
  // Create branch
  await githubRequest(`/repos/${REPO}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${DATA_BRANCH}`,
      sha: commitData.sha,
    }),
  });
  
  return commitData.sha;
}

/**
 * Create blobs for all files
 */
async function createBlobs(token: string, files: FileStructure[]): Promise<string[]> {
  const blobs: string[] = [];
  
  // Process in batches of 20 (GitHub API limit)
  const batchSize = 20;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const promises = batch.map(async (file) => {
      const response = await githubRequest(`/repos/${REPO}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({
          content: btoa(unescape(encodeURIComponent(file.content))),
          encoding: 'base64',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create blob for ${file.path}`);
      }
      
      const data = await response.json();
      return data.sha;
    });
    
    const batchBlobs = await Promise.all(promises);
    blobs.push(...batchBlobs);
  }
  
  return blobs;
}

/**
 * Create tree with all files
 */
async function createTree(token: string, files: FileStructure[], blobShas: string[]): Promise<string> {
  const tree = files.map((file, index) => ({
    path: file.path,
    mode: '100644',
    type: 'blob',
    sha: blobShas[index],
  }));
  
  const response = await githubRequest(`/repos/${REPO}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({ tree }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create tree: ${error.message}`);
  }
  
  const data = await response.json();
  return data.sha;
}

/**
 * Create commit
 */
async function createCommit(
  token: string, 
  treeSha: string, 
  parentSha: string
): Promise<string> {
  const response = await githubRequest(`/repos/${REPO}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({
      message: `Update data - ${new Date().toLocaleString()}`,
      tree: treeSha,
      parents: [parentSha],
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create commit: ${error.message}`);
  }
  
  const data = await response.json();
  return data.sha;
}

/**
 * Update branch ref
 */
async function updateBranchRef(token: string, commitSha: string): Promise<void> {
  const response = await githubRequest(`/repos/${REPO}/git/refs/heads/${DATA_BRANCH}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSha }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update branch: ${error.message}`);
  }
}

/**
 * Trigger rebuild workflow
 */
async function triggerRebuild(token: string): Promise<boolean> {
  try {
    const response = await githubRequest(
      `/repos/${REPO}/actions/workflows/rebuild.yml/dispatches`,
      token,
      {
        method: 'POST',
        body: JSON.stringify({ ref: 'main' }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Save data to GitHub as .md files
 */
export async function saveToGitHub(config: GitHubConfig, data: DataFile): Promise<SyncResult> {
  if (!config.token) {
    return {
      success: false,
      message: 'Token required',
    };
  }
  
  try {
    // Convert data to files
    const files = dataToFiles(data);
    
    if (files.length === 0) {
      return {
        success: false,
        message: 'No data to save',
      };
    }
    
    console.log(`Saving ${files.length} files to GitHub...`);
    
    // Ensure data branch exists and get current SHA
    const parentSha = await ensureDataBranch(config.token);
    
    // Create blobs
    const blobShas = await createBlobs(config.token, files);
    
    // Create tree
    const treeSha = await createTree(config.token, files, blobShas);
    
    // Create commit
    const commitSha = await createCommit(config.token, treeSha, parentSha);
    
    // Update branch
    await updateBranchRef(config.token, commitSha);
    
    // Trigger rebuild
    const rebuildTriggered = await triggerRebuild(config.token);
    
    if (rebuildTriggered) {
      return {
        success: true,
        message: `Saved ${files.length} files! Site rebuilding... (~1 min)`,
        data: { lastSync: new Date().toISOString() },
      };
    } else {
      return {
        success: true,
        message: `Saved ${files.length} files! Go to Actions to rebuild manually.`,
        data: { lastSync: new Date().toISOString() },
      };
    }
  } catch (error: any) {
    console.error('GitHub save error:', error);
    return {
      success: false,
      message: error.message || 'Failed to save',
    };
  }
}

/**
 * Legacy save function for backward compatibility
 */
export async function saveToGitHubLegacy(config: GitHubConfig, data: any): Promise<SyncResult> {
  const dataFile: DataFile = {
    workspaces: data.workspaces || [],
    categories: data.categories || [],
    folders: data.folders || [],
    notes: data.notes || [],
    commands: data.commands || [],
    links: data.links || [],
    prompts: data.prompts || [],
    exportedAt: data.exportedAt || new Date().toISOString(),
    version: data.version || '3.0',
  };
  
  return saveToGitHub(config, dataFile);
}
