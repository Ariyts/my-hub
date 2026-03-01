/**
 * GitHub Sync Service
 * Saves data as .md files to data/ folder in main branch
 * Structure: data/{workspace}/{category}/{folder}/{note}.md
 */

import { dataToFiles } from './mdStorage';
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
const MAIN_BRANCH = 'main';

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
 * Get file SHA
 */
async function getFileSha(token: string, path: string): Promise<string | null> {
  const response = await githubRequest(
    `/repos/${REPO}/contents/${path}?ref=${MAIN_BRANCH}`,
    token
  );
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return data.sha;
}

/**
 * Create or update a file
 */
async function upsertFile(
  token: string, 
  path: string, 
  content: string, 
  message: string
): Promise<boolean> {
  const sha = await getFileSha(token, path);
  
  const base64Content = btoa(unescape(encodeURIComponent(content)));
  
  const body: any = {
    message,
    content: base64Content,
    branch: MAIN_BRANCH,
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  const response = await githubRequest(
    `/repos/${REPO}/contents/${path}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    }
  );
  
  return response.ok;
}

/**
 * Delete a file
 */
async function deleteFile(
  token: string,
  path: string,
  message: string
): Promise<boolean> {
  const sha = await getFileSha(token, path);
  if (!sha) return true; // Already deleted
  
  const response = await githubRequest(
    `/repos/${REPO}/contents/${path}`,
    token,
    {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
        branch: MAIN_BRANCH,
      }),
    }
  );
  
  return response.ok;
}

/**
 * Get list of files in a directory
 */
async function listFiles(token: string, path: string): Promise<string[]> {
  const response = await githubRequest(
    `/repos/${REPO}/contents/${path}?ref=${MAIN_BRANCH}`,
    token
  );
  
  if (!response.ok) return [];
  
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  
  return data.map((item: any) => item.name);
}

/**
 * Save data to GitHub as .md files in data/ folder
 */
export async function saveToGitHub(config: GitHubConfig, data: DataFile): Promise<SyncResult> {
  if (!config.token) {
    return {
      success: false,
      message: 'Token required',
    };
  }
  
  try {
    const files = dataToFiles(data);
    const timestamp = new Date().toLocaleString();
    
    console.log(`Saving ${files.length} files...`);
    
    // Process files in batches
    const batchSize = 10;
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      const results = await Promise.all(
        batch.map(async (file) => {
          const success = await upsertFile(
            config.token,
            file.path,
            file.content,
            `Update ${file.path}`
          );
          return { path: file.path, success };
        })
      );
      
      for (const r of results) {
        if (r.success) successCount++;
        else failCount++;
      }
      
      // Small delay between batches
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    if (failCount > 0) {
      return {
        success: false,
        message: `Saved ${successCount} files, failed ${failCount}`,
      };
    }
    
    return {
      success: true,
      message: `Saved ${successCount} files! Site rebuilding... (~1 min)`,
      data: { lastSync: new Date().toISOString() },
    };
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
