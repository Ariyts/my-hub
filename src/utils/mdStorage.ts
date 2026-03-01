// ============================================
// MD STORAGE - работа с файловой структурой .md
// ============================================
// Структура:
// data/
//   {workspaceName}/
//     {categoryName}/
//       {folderName}/
//         {noteTitle}.md

import type {
  Workspace, Category, Folder, NoteItem,
  CommandContainer, LinkContainer, PromptContainer,
  DataFile
} from '../types';

// Sanitize filename for safe file system usage
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterLines = match[1].split('\n');
  const frontmatter: Record<string, any> = {};
  
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Parse arrays (e.g., tags: [tag1, tag2])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^["']|["']$/g, ''))
          .filter(v => v);
      }
      // Parse booleans
      else if (value === 'true') value = true;
      else if (value === 'false') value = false;
      // Remove quotes from strings
      else if ((value.startsWith('"') && value.endsWith('"')) ||
               (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, body: match[2] };
}

// Create YAML frontmatter from object
function createFrontmatter(data: Record<string, any>): string {
  const lines: string[] = ['---'];
  
  for (const [key, value] of Object.entries(data)) {
    if (key === 'content') continue; // Skip content, it goes in body
    
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else if (value !== undefined && value !== null) {
      lines.push(`${key}: ${value}`);
    }
  }
  
  lines.push('---');
  return lines.join('\n');
}

// ============================================
// EXPORT TO FILES
// ============================================

export interface FileStructure {
  path: string;
  content: string;
}

export function dataToFiles(data: DataFile): FileStructure[] {
  const files: FileStructure[] = [];
  const usedPaths = new Set<string>();
  
  // Helper to generate unique path
  const getUniquePath = (basePath: string, extension: string): string => {
    let path = `${basePath}.${extension}`;
    let counter = 1;
    while (usedPaths.has(path)) {
      path = `${basePath}_${counter}.${extension}`;
      counter++;
    }
    usedPaths.add(path);
    return path;
  };
  
  // Helper to build path
  const buildPath = (parts: string[]): string => {
    return parts.map(sanitizeFilename).join('/');
  };
  
  // Process each workspace
  for (const workspace of data.workspaces) {
    // Get categories for this workspace
    const workspaceCategories = data.categories.filter(c => c.workspaceId === workspace.id);
    
    for (const category of workspaceCategories) {
      // Get folders for this category
      const categoryFolders = data.folders.filter(f => f.categoryId === category.id);
      
      for (const folder of categoryFolders) {
        const basePath = buildPath(['data', workspace.name, category.name, folder.name]);
        
        // Process notes
        if (category.baseType === 'notes') {
          const notes = data.notes.filter(n => n.folderId === folder.id);
          for (const note of notes) {
            const frontmatter = createFrontmatter({
              id: note.id,
              title: note.title,
              tags: note.tags,
              isFavorite: note.isFavorite,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
              folderId: note.folderId,
            });
            
            const content = `${frontmatter}\n${note.content}`;
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(note.title)}`, 'md');
            
            files.push({ path: filePath, content });
          }
        }
        
        // Process commands
        if (category.baseType === 'commands') {
          const commands = data.commands.filter(c => c.folderId === folder.id);
          for (const cmd of commands) {
            const frontmatter = createFrontmatter({
              id: cmd.id,
              title: cmd.title,
              description: cmd.description || '',
              tags: cmd.tags,
              createdAt: cmd.createdAt,
              updatedAt: cmd.updatedAt,
              folderId: cmd.folderId,
              type: 'commands',
            });
            
            // Format commands as markdown code blocks
            let body = '';
            if (cmd.description) {
              body += `${cmd.description}\n\n`;
            }
            for (const item of cmd.subItems) {
              body += `### ${item.id}\n`;
              body += `\`\`\`${item.language}\n${item.command}\n\`\`\`\n`;
              if (item.description) {
                body += `\n_${item.description}_\n`;
              }
              body += '\n';
            }
            
            const content = `${frontmatter}\n${body}`;
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(cmd.title)}`, 'md');
            
            files.push({ path: filePath, content });
          }
        }
        
        // Process links
        if (category.baseType === 'links') {
          const links = data.links.filter(l => l.folderId === folder.id);
          for (const link of links) {
            const frontmatter = createFrontmatter({
              id: link.id,
              title: link.title,
              tags: link.tags,
              createdAt: link.createdAt,
              updatedAt: link.updatedAt,
              folderId: link.folderId,
              type: 'links',
            });
            
            // Format links as markdown list
            let body = '';
            for (const item of link.subItems) {
              body += `- [${item.title}](${item.url})`;
              if (item.description) {
                body += ` - ${item.description}`;
              }
              body += '\n';
            }
            
            const content = `${frontmatter}\n${body}`;
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(link.title)}`, 'md');
            
            files.push({ path: filePath, content });
          }
        }
        
        // Process prompts
        if (category.baseType === 'prompts') {
          const prompts = data.prompts.filter(p => p.folderId === folder.id);
          for (const prompt of prompts) {
            const frontmatter = createFrontmatter({
              id: prompt.id,
              title: prompt.title,
              category: prompt.category,
              tags: prompt.tags,
              createdAt: prompt.createdAt,
              updatedAt: prompt.updatedAt,
              folderId: prompt.folderId,
              type: 'prompts',
            });
            
            // Format prompts
            let body = '';
            for (const item of prompt.subItems) {
              body += `### ${item.title}\n`;
              if (item.description) {
                body += `_${item.description}_\n\n`;
              }
              body += '```\n' + item.prompt + '\n```\n';
              if (item.variables && item.variables.length > 0) {
                body += `\n**Variables:** ${item.variables.join(', ')}\n`;
              }
              body += '\n';
            }
            
            const content = `${frontmatter}\n${body}`;
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(prompt.title)}`, 'md');
            
            files.push({ path: filePath, content });
          }
        }
      }
    }
  }
  
  // Add metadata file
  const metadata = {
    workspaces: data.workspaces,
    categories: data.categories,
    folders: data.folders,
    exportedAt: data.exportedAt,
    version: '3.0',
  };
  
  files.push({
    path: 'data/metadata.json',
    content: JSON.stringify(metadata, null, 2),
  });
  
  return files;
}

// ============================================
// IMPORT FROM FILES
// ============================================

interface ParsedFiles {
  metadata: {
    workspaces: Workspace[];
    categories: Category[];
    folders: Folder[];
    exportedAt: string;
    version: string;
  } | null;
  notes: NoteItem[];
  commands: CommandContainer[];
  links: LinkContainer[];
  prompts: PromptContainer[];
}

export function filesToData(files: FileStructure[]): ParsedFiles {
  const result: ParsedFiles = {
    metadata: null,
    notes: [],
    commands: [],
    links: [],
    prompts: [],
  };
  
  for (const file of files) {
    // Parse metadata
    if (file.path === 'data/metadata.json') {
      try {
        result.metadata = JSON.parse(file.content);
      } catch (e) {
        console.error('Failed to parse metadata:', e);
      }
      continue;
    }
    
    // Skip non-md files
    if (!file.path.endsWith('.md')) continue;
    
    // Parse frontmatter
    const { frontmatter, body } = parseFrontmatter(file.content);
    
    // Determine type from path or frontmatter
    const pathParts = file.path.split('/');
    const type = frontmatter.type || guessTypeFromPath(pathParts);
    
    if (type === 'notes' || !frontmatter.type) {
      // It's a note
      result.notes.push({
        id: frontmatter.id || generateId(),
        folderId: frontmatter.folderId || '',
        title: frontmatter.title || pathParts[pathParts.length - 1].replace('.md', ''),
        content: body.trim(),
        tags: frontmatter.tags || [],
        isFavorite: frontmatter.isFavorite || false,
        createdAt: frontmatter.createdAt || new Date().toISOString(),
        updatedAt: frontmatter.updatedAt || new Date().toISOString(),
        type: 'notes',
      });
    } else if (type === 'commands') {
      // Parse commands from body
      const subItems = parseCommandsFromMarkdown(body);
      result.commands.push({
        id: frontmatter.id || generateId(),
        folderId: frontmatter.folderId || '',
        title: frontmatter.title || pathParts[pathParts.length - 1].replace('.md', ''),
        description: frontmatter.description || '',
        subItems,
        tags: frontmatter.tags || [],
        createdAt: frontmatter.createdAt || new Date().toISOString(),
        updatedAt: frontmatter.updatedAt || new Date().toISOString(),
        type: 'commands',
      });
    } else if (type === 'links') {
      // Parse links from body
      const subItems = parseLinksFromMarkdown(body);
      result.links.push({
        id: frontmatter.id || generateId(),
        folderId: frontmatter.folderId || '',
        title: frontmatter.title || pathParts[pathParts.length - 1].replace('.md', ''),
        subItems,
        tags: frontmatter.tags || [],
        createdAt: frontmatter.createdAt || new Date().toISOString(),
        updatedAt: frontmatter.updatedAt || new Date().toISOString(),
        type: 'links',
      });
    } else if (type === 'prompts') {
      // Parse prompts from body
      const subItems = parsePromptsFromMarkdown(body);
      result.prompts.push({
        id: frontmatter.id || generateId(),
        folderId: frontmatter.folderId || '',
        title: frontmatter.title || pathParts[pathParts.length - 1].replace('.md', ''),
        subItems,
        category: frontmatter.category || '',
        tags: frontmatter.tags || [],
        createdAt: frontmatter.createdAt || new Date().toISOString(),
        updatedAt: frontmatter.updatedAt || new Date().toISOString(),
        type: 'prompts',
      });
    }
  }
  
  return result;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function guessTypeFromPath(pathParts: string[]): string {
  // Try to guess type from category name in path
  const categoryName = pathParts[2]?.toLowerCase() || '';
  if (categoryName.includes('note')) return 'notes';
  if (categoryName.includes('command')) return 'commands';
  if (categoryName.includes('link')) return 'links';
  if (categoryName.includes('prompt')) return 'prompts';
  return 'notes'; // Default
}

function parseCommandsFromMarkdown(body: string): any[] {
  const items: any[] = [];
  const codeBlockRegex = /###\s*(\S+)\s*\n```(\w+)\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(body)) !== null) {
    items.push({
      id: match[1],
      command: match[3].trim(),
      language: match[2] || 'bash',
      description: '',
      tags: [],
      isFavorite: false,
    });
  }
  
  return items;
}

function parseLinksFromMarkdown(body: string): any[] {
  const items: any[] = [];
  const linkRegex = /-\s*\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/g;
  let match;
  
  while ((match = linkRegex.exec(body)) !== null) {
    items.push({
      id: generateId(),
      url: match[2],
      title: match[1],
      description: match[3] || '',
      tags: [],
      isFavorite: false,
    });
  }
  
  return items;
}

function parsePromptsFromMarkdown(body: string): any[] {
  const items: any[] = [];
  const promptRegex = /###\s*(.+?)\n(?:_(.+?)_\n\n)?```[\s\S]*?```/g;
  let match;
  
  while ((match = promptRegex.exec(body)) !== null) {
    // Extract prompt content from code block
    const codeBlockMatch = body.substring(match.index).match(/```\n([\s\S]*?)```/);
    
    items.push({
      id: generateId(),
      title: match[1].trim(),
      description: match[2] || '',
      prompt: codeBlockMatch ? codeBlockMatch[1].trim() : '',
      variables: [],
      tags: [],
      isFavorite: false,
    });
  }
  
  return items;
}
