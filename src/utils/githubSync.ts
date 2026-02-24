/**
 * GitHub Sync Service
 * Provides functions to sync data with a GitHub repository
 */

export interface GitHubConfig {
  token: string;
  repo: string; // format: "username/repo"
  branch: string;
  path: string; // e.g., "data/" or "data/notes.json"
}

export interface GitHubFile {
  content: string;
  sha: string;
  path: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
}

const GITHUB_API = 'https://api.github.com';

/**
 * Check if GitHub config is valid
 */
export function isGitHubConfigValid(config: GitHubConfig): boolean {
  return !!(config.token && config.repo && config.branch);
}

/**
 * Get the full file path in the repository
 */
function getFilePath(config: GitHubConfig): string {
  let path = config.path || 'data/';
  // Ensure it ends with a filename
  if (path.endsWith('/')) {
    path += 'knowledge-hub-data.json';
  }
  return path;
}

/**
 * Make an authenticated request to GitHub API
 */
async function githubRequest(
  endpoint: string,
  config: GitHubConfig,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

/**
 * Get file content from GitHub repository
 */
export async function getFileFromGitHub(config: GitHubConfig): Promise<GitHubFile | null> {
  if (!isGitHubConfigValid(config)) {
    throw new Error('GitHub configuration is incomplete');
  }

  const filePath = getFilePath(config);
  const endpoint = `/repos/${config.repo}/contents/${filePath}?ref=${config.branch}`;

  const response = await githubRequest(endpoint, config);

  if (response.status === 404) {
    // File doesn't exist yet
    return null;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch file from GitHub');
  }

  const data = await response.json();
  
  // Decode base64 content
  const content = atob(data.content);
  
  return {
    content,
    sha: data.sha,
    path: data.path,
  };
}

/**
 * Create or update file in GitHub repository
 */
export async function saveFileToGitHub(
  config: GitHubConfig,
  content: string,
  sha?: string,
  message: string = 'Update knowledge-hub data'
): Promise<SyncResult> {
  if (!isGitHubConfigValid(config)) {
    return {
      success: false,
      message: 'GitHub configuration is incomplete. Please check your settings.',
    };
  }

  const filePath = getFilePath(config);
  const endpoint = `/repos/${config.repo}/contents/${filePath}`;

  const body: any = {
    message,
    content: btoa(unescape(encodeURIComponent(content))), // Base64 encode with UTF-8 support
    branch: config.branch,
  };

  // If sha is provided, we're updating an existing file
  if (sha) {
    body.sha = sha;
  }

  const response = await githubRequest(endpoint, config, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      message: error.message || 'Failed to save file to GitHub',
    };
  }

  return {
    success: true,
    message: sha ? 'Data updated successfully!' : 'Data saved to GitHub!',
  };
}

/**
 * Sync data to GitHub - handles both create and update
 */
export async function syncToGitHub(config: GitHubConfig, data: any): Promise<SyncResult> {
  try {
    // Try to get existing file to get SHA
    const existingFile = await getFileFromGitHub(config);
    
    const content = JSON.stringify(data, null, 2);
    
    return await saveFileToGitHub(
      config,
      content,
      existingFile?.sha,
      existingFile ? 'Update knowledge-hub data' : 'Create knowledge-hub data'
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to sync to GitHub',
    };
  }
}

/**
 * Load data from GitHub
 */
export async function loadFromGitHub(config: GitHubConfig): Promise<SyncResult> {
  try {
    const file = await getFileFromGitHub(config);
    
    if (!file) {
      return {
        success: false,
        message: 'No data found in GitHub repository. Try syncing first.',
      };
    }

    const data = JSON.parse(file.content);
    
    return {
      success: true,
      message: 'Data loaded from GitHub!',
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
 * Test GitHub connection
 */
export async function testGitHubConnection(config: GitHubConfig): Promise<SyncResult> {
  if (!isGitHubConfigValid(config)) {
    return {
      success: false,
      message: 'GitHub configuration is incomplete',
    };
  }

  try {
    // Try to get user info to verify token
    const response = await githubRequest('/user', config);
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Invalid token or insufficient permissions',
      };
    }

    const user = await response.json();

    // Try to access the repo
    const repoResponse = await githubRequest(`/repos/${config.repo}`, config);
    
    if (!repoResponse.ok) {
      return {
        success: false,
        message: 'Cannot access repository. Check if it exists and token has access.',
      };
    }

    return {
      success: true,
      message: `Connected as @${user.login}`,
      data: { username: user.login },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Connection failed',
    };
  }
}
