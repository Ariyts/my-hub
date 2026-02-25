/**
 * GitHub Sync Service
 * Saves data to the 'data' branch of the same repository
 * Triggers automatic rebuild via GitHub Actions
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
const REPO = 'Ariyts/my-hub';
const DATA_FILE = 'knowledge-hub-data.json';
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
 * Ensure data branch exists
 */
async function ensureDataBranch(token: string): Promise<void> {
  // Check if branch exists
  const checkResponse = await githubRequest(`/repos/${REPO}/branches/${DATA_BRANCH}`, token);
  if (checkResponse.ok) return;
  
  // Get default branch SHA
  const repoResponse = await githubRequest(`/repos/${REPO}`, token);
  if (!repoResponse.ok) throw new Error('Cannot access repo');
  
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;
  
  const refResponse = await githubRequest(`/repos/${REPO}/git/refs/heads/${defaultBranch}`, token);
  if (!refResponse.ok) throw new Error('Cannot get branch ref');
  
  const refData = await refResponse.json();
  
  // Create data branch
  await githubRequest(`/repos/${REPO}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${DATA_BRANCH}`,
      sha: refData.object.sha,
    }),
  });
}

/**
 * Get file SHA from data branch
 */
async function getFileSha(token: string): Promise<string | null> {
  const response = await githubRequest(
    `/repos/${REPO}/contents/${DATA_FILE}?ref=${DATA_BRANCH}`,
    token
  );
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return data.sha;
}

/**
 * Save data to GitHub - triggers rebuild automatically
 */
export async function saveToGitHub(config: GitHubConfig, data: any): Promise<SyncResult> {
  if (!config.token) {
    return {
      success: false,
      message: 'Token required',
    };
  }
  
  try {
    // Ensure data branch exists
    await ensureDataBranch(config.token);
    
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
      `/repos/${REPO}/contents/${DATA_FILE}`,
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
    
    // Trigger rebuild automatically
    const rebuildTriggered = await triggerRebuild(config.token);
    
    if (rebuildTriggered) {
      return {
        success: true,
        message: 'Saved! Site rebuilding... (~1 min)',
        data: { lastSync: new Date().toISOString() },
      };
    } else {
      return {
        success: true,
        message: 'Saved! Go to Actions to rebuild manually.',
        data: { lastSync: new Date().toISOString() },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to save',
    };
  }
}
