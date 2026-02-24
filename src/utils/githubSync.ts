/**
 * GitHub Sync Service - Public Version
 * - Reading data: PUBLIC (no token needed)
 * - Writing data: requires token
 * - Data stored in public repo: my-hub-data
 */

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
const DATA_FILE = 'knowledge-hub-data.json';
const DATA_BRANCH = 'data';

// Public data URL - works without authentication!
const PUBLIC_DATA_URL = 'https://raw.githubusercontent.com/Ariyts/my-hub-data/data/knowledge-hub-data.json';

/**
 * Load data from public URL - NO TOKEN NEEDED
 * This is the primary way data loads - always works, no rate limits
 */
export async function loadPublicData(): Promise<SyncResult> {
  try {
    const response = await fetch(PUBLIC_DATA_URL, {
      cache: 'no-store', // Always get fresh data
    });
    
    if (response.status === 404) {
      return {
        success: false,
        message: 'No data found. Save your data first.',
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        message: `Failed to load data (${response.status})`,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: 'Data loaded!',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to load data',
    };
  }
}

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
 * Check if user has write access to my-hub-data repo
 */
async function checkWriteAccess(token: string, username: string): Promise<boolean> {
  const response = await githubRequest(`/repos/Ariyts/my-hub-data/collaborators/${username}/permission`, token);
  if (!response.ok) return false;
  
  const data = await response.json();
  return data.permission === 'admin' || data.permission === 'write';
}

/**
 * Initialize - verify token has write access
 */
export async function initializeGitHubSync(token: string): Promise<GitHubConfig & SyncResult> {
  try {
    // Get user info
    const userInfo = await getUserInfo(token);
    if (!userInfo) {
      return {
        token,
        success: false,
        message: 'Invalid token. Please check your Personal Access Token.',
      };
    }
    
    // Check write access to the data repo
    const hasAccess = await checkWriteAccess(token, userInfo.username);
    if (!hasAccess) {
      return {
        token,
        username: userInfo.username,
        success: false,
        message: 'You need write access to the repository. Contact the owner.',
      };
    }
    
    return {
      token,
      username: userInfo.username,
      success: true,
      message: `Ready to save as @${userInfo.username}`,
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
 * Get file SHA from GitHub (needed for update)
 */
async function getFileSha(token: string): Promise<string | null> {
  const response = await githubRequest(
    `/repos/Ariyts/my-hub-data/contents/${DATA_FILE}?ref=${DATA_BRANCH}`,
    token
  );
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return data.sha;
}

/**
 * Save data to GitHub - REQUIRES TOKEN
 */
export async function saveToGitHub(config: GitHubConfig, data: any): Promise<SyncResult> {
  if (!config.token) {
    return {
      success: false,
      message: 'Token required to save data. Go to Settings → Sync.',
    };
  }
  
  try {
    // Get existing file SHA
    const sha = await getFileSha(config.token);
    
    const content = JSON.stringify(data, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    
    const body: any = {
      message: `Update data - ${new Date().toLocaleString()}`,
      content: base64Content,
      branch: DATA_BRANCH,
    };
    
    if (sha) {
      body.sha = sha;
    }
    
    const response = await githubRequest(
      `/repos/Ariyts/my-hub-data/contents/${DATA_FILE}`,
      config.token,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to save',
      };
    }
    
    return {
      success: true,
      message: 'Saved successfully! Data will appear on all devices.',
      data: { lastSync: new Date().toISOString() },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to save',
    };
  }
}
