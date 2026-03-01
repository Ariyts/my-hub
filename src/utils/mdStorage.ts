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
  
  return files;
}
