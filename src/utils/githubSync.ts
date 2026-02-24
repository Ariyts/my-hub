/**
 * GitHub Sync Service - Simplified
 * User only needs to provide a token, everything else is automatic
 */

export interface GitHubConfig {
  token: string;
  // Auto-detected values
  username?: string;
  repo?: string;
  branch?: string;
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
 * Check if repo exists, create if not
 */
async function ensureRepo(token: string, username: string): Promise<string> {
  const repoName = 'my-hub-data';
  
  // Check if repo exists
  const checkResponse = await githubRequest(`/repos/${username}/${repoName}`, token);
  
  if (checkResponse.ok) {
    return repoName;
  }
  
  // Create repo if it doesn't exist
  const createResponse = await githubRequest('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify({
      name: repoName,
      description: 'Knowledge Hub - Personal notes and data storage',
      private: false,
      auto_init: true,
    }),
  });
  
  if (!createResponse.ok) {
    throw new Error('Failed to create repository');
  }
  
  // Wait a moment for repo to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return repoName;
}

/**
 * Ensure data branch exists
 */
async function ensureBranch(token: string, username: string, repo: string): Promise<string> {
  // Get default branch
  const repoResponse = await githubRequest(`/repos/${username}/${repo}`, token);
  if (!repoResponse.ok) {
    throw new Error('Cannot access repository');
  }
  
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;
  
  // Check if data branch exists
  const branchResponse = await githubRequest(
    `/repos/${username}/${repo}/branches/${DATA_BRANCH}`,
    token
  );
  
  if (branchResponse.ok) {
    return DATA_BRANCH;
  }
  
  // Create data branch from default branch
  // First get the SHA of the default branch
  const refResponse = await githubRequest(
    `/repos/${username}/${repo}/git/refs/heads/${defaultBranch}`,
    token
  );
  
  if (!refResponse.ok) {
    // If no commits yet, just use default branch
    return defaultBranch;
  }
  
  const refData = await refResponse.json();
  
  // Create new branch
  const createBranchResponse = await githubRequest(
    `/repos/${username}/${repo}/git/refs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${DATA_BRANCH}`,
        sha: refData.object.sha,
      }),
    }
  );
  
  if (createBranchResponse.ok) {
    return DATA_BRANCH;
  }
  
  // If branch creation fails, use default branch
  return defaultBranch;
}

/**
 * Initialize GitHub sync - auto-detect everything
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
    
    // Ensure repo exists
    const repo = await ensureRepo(token, userInfo.username);
    
    // Ensure branch exists
    const branch = await ensureBranch(token, userInfo.username, repo);
    
    return {
      token,
      username: userInfo.username,
      repo,
      branch,
      success: true,
      message: `Connected as @${userInfo.username}`,
    };
  } catch (error: any) {
    return {
      token,
      success: false,
      message: error.message || 'Failed to initialize GitHub sync',
    };
  }
}

/**
 * Get file from GitHub
 */
async function getFile(token: string, username: string, repo: string, branch: string): Promise<{ content: string; sha: string } | null> {
  const response = await githubRequest(
    `/repos/${username}/${repo}/contents/${DATA_FILE}?ref=${branch}`,
    token
  );
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  const data = await response.json();
  const content = atob(data.content);
  
  return {
    content,
    sha: data.sha,
  };
}

/**
 * Save data to GitHub
 */
export async function saveToGitHub(config: GitHubConfig, data: any): Promise<SyncResult> {
  if (!config.token || !config.username || !config.repo || !config.branch) {
    return {
      success: false,
      message: 'GitHub not configured. Please connect first.',
    };
  }
  
  try {
    // Get existing file to get SHA (if exists)
    let existingFile: { content: string; sha: string } | null = null;
    try {
      existingFile = await getFile(config.token, config.username, config.repo, config.branch);
    } catch {
      // File doesn't exist yet
    }
    
    const content = JSON.stringify(data, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    
    const body: any = {
      message: `Update data - ${new Date().toLocaleString()}`,
      content: base64Content,
      branch: config.branch,
    };
    
    if (existingFile) {
      body.sha = existingFile.sha;
    }
    
    const response = await githubRequest(
      `/repos/${config.username}/${config.repo}/contents/${DATA_FILE}`,
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
        message: error.message || 'Failed to save to GitHub',
      };
    }
    
    return {
      success: true,
      message: 'Data saved successfully!',
      data: { lastSync: new Date().toISOString() },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to save to GitHub',
    };
  }
}

/**
 * Load data from GitHub
 */
export async function loadFromGitHub(config: GitHubConfig): Promise<SyncResult> {
  if (!config.token || !config.username || !config.repo || !config.branch) {
    return {
      success: false,
      message: 'GitHub not configured',
    };
  }
  
  try {
    const file = await getFile(config.token, config.username, config.repo, config.branch);
    
    if (!file) {
      return {
        success: false,
        message: 'No saved data found. Save your data first.',
      };
    }
    
    const data = JSON.parse(file.content);
    
    return {
      success: true,
      message: 'Data loaded successfully!',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to load from GitHub',
    };
  }
}

/**
 * Check if config is complete
 */
export function isConfigComplete(config: GitHubConfig): boolean {
  return !!(config.token && config.username && config.repo && config.branch);
}
