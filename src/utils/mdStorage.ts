// ============================================
// MD STORAGE - работа с файловой структурой .md
// ============================================
// Структура:
// data/
//   {workspaceName}/
//     {categoryName}/
//       {folderName}/
//         {noteTitle}.md

import type { DataFile, LinkContainer, LinkItem } from '../types';

// Sanitize filename for safe file system usage
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

// Create YAML frontmatter from object
function createFrontmatter(data: Record<string, unknown>): string {
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
// NEW FORMAT: Links with Sections
// ============================================

/**
 * Создаёт .md файл ссылок в новом формате с секциями
 * Формат:
 * ## Section Title
 * <!-- section: {id, order, collapsed} -->
 * - [Title](URL) description <!-- link: {id, favicon, tags, isFavorite} -->
 */
export function createLinkFileWithSections(container: LinkContainer): string {
  const frontmatter = createFrontmatter({
    id: container.id,
    title: container.title,
    tags: container.tags,
    order: container.order,
    createdAt: container.createdAt,
    updatedAt: container.updatedAt,
  });
  
  const lines: string[] = [frontmatter, ''];
  
  // Временно считаем, что subItems содержат секции (будущая структура)
  // Для текущей структуры — один контейнер = одна секция
  lines.push(`## ${container.title}`);
  lines.push(`<!-- section: ${JSON.stringify({
    id: container.id,
    order: 0,
    collapsed: !container.isExpanded,
  })} -->`);
  lines.push('');
  
  // Ссылки
  for (const item of container.subItems) {
    const linkMeta: Record<string, unknown> = { 
      id: item.id, 
      order: item.order ?? 0 
    };
    
    if (item.favicon) linkMeta.favicon = item.favicon;
    if (item.tags.length > 0) linkMeta.tags = item.tags;
    if (item.isFavorite) linkMeta.isFavorite = true;
    
    let linkLine = `- [${item.title}](${item.url})`;
    if (item.description) {
      linkLine += ` ${item.description}`;
    }
    linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;
    
    lines.push(linkLine);
  }
  
  lines.push('');
  return lines.join('\n');
}

/**
 * Парсит .md файл со ссылками в формате с секциями
 * Возвращает массив секций с ссылками
 */
export interface ParsedSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  links: LinkItem[];
}

export function parseLinkFileWithSections(content: string): {
  id: string;
  title: string;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  sections: ParsedSection[];
} {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterEndIndex = 0;
  const frontmatterData: Record<string, unknown> = {};
  
  // Парсим frontmatter
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        frontmatterEndIndex = i;
        break;
      }
    }
    if (inFrontmatter && line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const key = line.slice(0, colonIndex).trim();
      let value: unknown = line.slice(colonIndex + 1).trim();
      
      // Убираем кавычки
      if (typeof value === 'string') {
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
      }
      
      // Массивы
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1)
          .split(',')
          .map((v: string) => v.trim().replace(/^["']|["']$/g, ''))
          .filter((v: string) => v);
      }
      
      // Числа
      if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
        value = Number(value);
      }
      
      frontmatterData[key] = value;
    }
  }
  
  // Парсим секции
  const contentLines = lines.slice(frontmatterEndIndex + 1);
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let linkOrder = 0;
  const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i];
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;
    
    // Заголовок секции
    if (trimmedLine.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      
      let sectionTitle = trimmedLine.slice(3).trim();
      // Убираем эмодзи из заголовка
      const emojiMatch = sectionTitle.match(/^([\u{1F300}-\u{1F9FF}]\s*)/u);
      if (emojiMatch) {
        sectionTitle = sectionTitle.slice(emojiMatch[0].length).trim();
      }
      
      currentSection = {
        id: genId(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
        links: [],
      };
      
      // Проверяем метаданные секции на следующей строке
      const nextLine = contentLines[i + 1]?.trim();
      if (nextLine?.startsWith('<!-- section:')) {
        const match = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (match) {
          try {
            const meta = JSON.parse(match[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSection.order = typeof meta.order === 'number' ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
          } catch {
            // Ignore parse errors
          }
        }
        i++; // Пропускаем строку с метаданными
      }
      
      linkOrder = 0;
      continue;
    }
    
    // Ссылка
    if (trimmedLine.startsWith('- [') && currentSection) {
      // Извлекаем метаданные ссылки
      let linkMeta: Partial<LinkItem> = {};
      const metaMatch = trimmedLine.match(/<!--\s*link:\s*(\{.*?\})\s*-->/);
      if (metaMatch) {
        try {
          linkMeta = JSON.parse(metaMatch[1]);
        } catch {
          // Ignore parse errors
        }
      }
      
      // Убираем комментарий для парсинга основной части
      const cleanLine = trimmedLine.replace(/<!--\s*link:.*?-->/, '').trim();
      
      // Парсим Markdown ссылку
      const linkMatch = cleanLine.match(/^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/);
      if (linkMatch) {
        const [, title, url, rest] = linkMatch;
        const description = rest.trim() || linkMeta.description || undefined;
        
        currentSection.links.push({
          id: linkMeta.id || genId(),
          url,
          title: title || url,
          description,
          favicon: linkMeta.favicon,
          tags: linkMeta.tags || [],
          isFavorite: linkMeta.isFavorite ?? false,
          order: linkMeta.order ?? linkOrder++,
        });
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return {
    id: frontmatterData.id as string || genId(),
    title: frontmatterData.title as string || 'Untitled',
    tags: frontmatterData.tags as string[] || [],
    order: frontmatterData.order as number || 0,
    createdAt: frontmatterData.createdAt as string || new Date().toISOString(),
    updatedAt: frontmatterData.updatedAt as string || new Date().toISOString(),
    sections,
  };
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
              order: note.order,
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
              order: cmd.order,
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
        
        // Process links - NEW FORMAT with sections
        if (category.baseType === 'links') {
          const links = data.links.filter(l => l.folderId === folder.id);
          for (const link of links) {
            const content = createLinkFileWithSections(link);
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
              order: prompt.order,
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
