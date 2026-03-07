// ============================================
// LINK FILE PARSER - парсинг .md файла ссылок в State и обратно
// ============================================
// Формат файла:
// ---
// frontmatter (YAML)
// ---
// ## Section Title
// <!-- section: {"id":"...","order":0} -->
// - [Title](URL) description <!-- link: {"id":"...","favicon":"..."} -->
// ============================================

export interface ParsedLinkSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  links: ParsedLinkItem[];
}

export interface ParsedLinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  tags: string[];
  isFavorite: boolean;
  order: number;
}

export interface ParsedLinkFile {
  id: string;
  title: string;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  sections: ParsedLinkSection[];
  rawFrontmatter: string;
}

// Генерация уникальных ID
const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// ============================================
// ПАРСИНГ: .md -> State
// ============================================

/**
 * Парсит .md файл со ссылками в структурированный объект
 */
export function parseLinkFile(content: string): ParsedLinkFile {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterLines: string[] = [];
  let frontmatterEndIndex = 0;

  // 1. Извлекаем frontmatter
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
    if (inFrontmatter) {
      frontmatterLines.push(lines[i]);
    }
  }

  // 2. Парсим frontmatter (простой YAML парсер)
  const frontmatter = parseSimpleYaml(frontmatterLines.join('\n'));

  // 3. Парсим контент (секции и ссылки)
  const contentLines = lines.slice(frontmatterEndIndex + 1);
  const sections = parseSections(contentLines);

  return {
    id: frontmatter.id || genId(),
    title: frontmatter.title || 'Untitled',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    order: typeof frontmatter.order === 'number' ? frontmatter.order : parseInt(frontmatter.order) || 0,
    createdAt: frontmatter.createdAt || new Date().toISOString(),
    updatedAt: frontmatter.updatedAt || new Date().toISOString(),
    sections,
    rawFrontmatter: frontmatterLines.join('\n'),
  };
}

/**
 * Простой YAML парсер для frontmatter
 */
function parseSimpleYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yaml.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();

    // Убираем кавычки
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Массивы (простой случай: [a, b, c])
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map((v: string) => v.trim().replace(/^["']|["']$/g, ''))
        .filter((v: string) => v);
    }

    // Числа
    if (!isNaN(Number(value)) && value !== '') {
      value = Number(value);
    }

    // Булевы значения
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    result[key] = value;
  }

  return result;
}

/**
 * Парсит секции из контента
 */
function parseSections(lines: string[]): ParsedLinkSection[] {
  const sections: ParsedLinkSection[] = [];
  let currentSection: ParsedLinkSection | null = null;
  let currentLinks: ParsedLinkItem[] = [];
  let linkOrder = 0;

  const flushSection = () => {
    if (currentSection) {
      currentSection.links = currentLinks;
      sections.push(currentSection);
      currentLinks = [];
      linkOrder = 0;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Пропускаем пустые строки
    if (!trimmedLine) continue;

    // Заголовок секции (## Title)
    if (trimmedLine.startsWith('## ')) {
      flushSection();

      // Извлекаем эмодзи из заголовка если есть
      let sectionTitle = trimmedLine.slice(3).trim();
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

      // Проверяем следующую строку на метаданные секции
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith('<!-- section:')) {
        const match = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (match) {
          try {
            const meta = JSON.parse(match[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSection.order = typeof meta.order === 'number' ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
          } catch (e) {
            console.warn('Failed to parse section metadata:', match[1]);
          }
        }
        i++; // Пропускаем строку с метаданными
      }

      continue;
    }

    // Ссылка (- [Title](URL) description)
    if (trimmedLine.startsWith('- [') && currentSection) {
      const link = parseLinkLine(trimmedLine, linkOrder++);
      if (link) {
        currentLinks.push(link);
      }
    }
  }

  flushSection();
  return sections;
}

/**
 * Парсит строку ссылки
 */
function parseLinkLine(line: string, order: number): ParsedLinkItem | null {
  // Формат: - [Title](URL) description <!-- link: {...} -->

  // Извлекаем метаданные ссылки из комментария в конце
  let linkMeta: Partial<ParsedLinkItem> = {};
  const metaMatch = line.match(/<!--\s*link:\s*(\{.*?\})\s*-->/);
  if (metaMatch) {
    try {
      linkMeta = JSON.parse(metaMatch[1]);
    } catch (e) {
      console.warn('Failed to parse link metadata:', metaMatch[1]);
    }
  }

  // Убираем комментарий для парсинга основной части
  const cleanLine = line.replace(/<!--\s*link:.*?-->/, '').trim();

  // Парсим Markdown ссылку: - [Title](URL)
  const linkMatch = cleanLine.match(/^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/);
  if (!linkMatch) return null;

  const [, title, url, rest] = linkMatch;
  const description = rest.trim();

  return {
    id: linkMeta.id || genId(),
    url,
    title: title || url,
    description: linkMeta.description || description || undefined,
    favicon: linkMeta.favicon,
    tags: linkMeta.tags || [],
    isFavorite: linkMeta.isFavorite ?? false,
    order: linkMeta.order ?? order,
  };
}

// ============================================
// СЕРИАЛИЗАЦИЯ: State -> .md
// ============================================

/**
 * Преобразует структурированный объект обратно в .md содержимое
 */
export function serializeLinkFile(data: ParsedLinkFile): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push('---');
  lines.push(`id: "${data.id}"`);
  lines.push(`title: "${data.title}"`);
  lines.push(`tags: [${data.tags.map(t => `"${t}"`).join(', ')}]`);
  lines.push(`order: ${data.order}`);
  lines.push(`createdAt: "${data.createdAt}"`);
  lines.push(`updatedAt: "${data.updatedAt}"`);
  lines.push('---');
  lines.push('');

  // Секции
  const sortedSections = [...data.sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    // Заголовок секции
    lines.push(`## ${section.title}`);

    // Метаданные секции
    lines.push(`<!-- section: ${JSON.stringify({
      id: section.id,
      order: section.order,
      collapsed: section.collapsed,
    })} -->`);
    lines.push('');

    // Ссылки
    const sortedLinks = [...section.links].sort((a, b) => a.order - b.order);

    for (const link of sortedLinks) {
      const linkMeta: Record<string, any> = { id: link.id, order: link.order };

      if (link.favicon) linkMeta.favicon = link.favicon;
      if (link.tags.length > 0) linkMeta.tags = link.tags;
      if (link.isFavorite) linkMeta.isFavorite = true;
      if (link.description) linkMeta.description = link.description;

      // Формируем строку ссылки
      let linkLine = `- [${link.title}](${link.url})`;
      if (link.description && !linkMeta.description) {
        linkLine += ` ${link.description}`;
      }
      linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;

      lines.push(linkLine);
    }

    lines.push('');
  }

  return lines.join('\n');
}

// ============================================
// ХУК ДЛЯ РАБОТЫ С ФАЙЛОМ ССЫЛОК
// ============================================

import { useState, useCallback, useEffect } from 'react';
import type { LinkContainer, LinkItem } from '../types';

/**
 * Преобразует ParsedLinkFile в массив LinkContainer для совместимости с текущим Store
 */
export function parsedToContainers(parsed: ParsedLinkFile, folderId: string): LinkContainer[] {
  return parsed.sections.map(section => ({
    id: section.id,
    folderId,
    title: section.title,
    subItems: section.links.map(link => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      favicon: link.favicon,
      tags: link.tags,
      isFavorite: link.isFavorite,
    })) as LinkItem[],
    tags: [],
    order: section.order,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
    type: 'links' as const,
    isExpanded: !section.collapsed,
  }));
}

/**
 * Преобразует массив LinkContainer обратно в ParsedLinkFile
 */
export function containersToParsed(
  containers: LinkContainer[],
  _fileId: string,
  title: string,
  tags: string[],
  order: number,
  createdAt: string,
  updatedAt: string
): ParsedLinkFile {
  return {
    id: _fileId,
    title,
    tags,
    order,
    createdAt,
    updatedAt,
    rawFrontmatter: '',
    sections: containers
      .sort((a, b) => a.order - b.order)
      .map(container => ({
        id: container.id,
        title: container.title,
        order: container.order,
        collapsed: !container.isExpanded,
        links: container.subItems.map((link, index) => ({
          id: link.id,
          url: link.url,
          title: link.title,
          description: link.description,
          favicon: link.favicon,
          tags: link.tags,
          isFavorite: link.isFavorite,
          order: index,
        })),
      })),
  };
}

/**
 * Хук для работы с файлом ссылок
 */
export function useLinkFile(initialContent: string, _fileId: string, folderId: string) {
  const [data, setData] = useState<ParsedLinkFile>(() => parseLinkFile(initialContent));
  const [isDirty, setIsDirty] = useState(false);

  // Обновление при изменении исходного контента
  useEffect(() => {
    if (initialContent) {
      setData(parseLinkFile(initialContent));
    }
  }, [initialContent]);

  // Получить контейнеры для Store
  const getContainers = useCallback(() => {
    return parsedToContainers(data, folderId);
  }, [data, folderId]);

  // Добавить секцию
  const addSection = useCallback((title: string) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: [
        ...prev.sections,
        {
          id: genId(),
          title,
          order: prev.sections.length,
          collapsed: false,
          links: [],
        },
      ],
    }));
    setIsDirty(true);
  }, []);

  // Удалить секцию
  const removeSection = useCallback((sectionId: string) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
    setIsDirty(true);
  }, []);

  // Переименовать секцию
  const renameSection = useCallback((sectionId: string, title: string) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, title } : s
      ),
    }));
    setIsDirty(true);
  }, []);

  // Переместить секцию
  const reorderSections = useCallback((sectionIds: string[]) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map(s => ({
        ...s,
        order: sectionIds.indexOf(s.id),
      })),
    }));
    setIsDirty(true);
  }, []);

  // Добавить ссылку в секцию
  const addLink = useCallback((sectionId: string, link: Omit<ParsedLinkItem, 'id' | 'order'>) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              links: [
                ...s.links,
                {
                  ...link,
                  id: genId(),
                  order: s.links.length,
                },
              ],
            }
          : s
      ),
    }));
    setIsDirty(true);
  }, []);

  // Обновить ссылку
  const updateLink = useCallback((sectionId: string, linkId: string, updates: Partial<ParsedLinkItem>) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              links: s.links.map(l =>
                l.id === linkId ? { ...l, ...updates } : l
              ),
            }
          : s
      ),
    }));
    setIsDirty(true);
  }, []);

  // Удалить ссылку
  const removeLink = useCallback((sectionId: string, linkId: string) => {
    setData(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              links: s.links.filter(l => l.id !== linkId),
            }
          : s
      ),
    }));
    setIsDirty(true);
  }, []);

  // Переместить ссылку (внутри или между секциями)
  const moveLink = useCallback((
    fromSectionId: string,
    toSectionId: string,
    linkId: string,
    newOrder: number
  ) => {
    setData(prev => {
      const linkToMove = prev.sections
        .find(s => s.id === fromSectionId)
        ?.links.find(l => l.id === linkId);

      if (!linkToMove) return prev;

      let newSections = prev.sections.map(s => {
        if (s.id === fromSectionId && fromSectionId !== toSectionId) {
          // Удаляем из исходной секции
          return {
            ...s,
            links: s.links.filter(l => l.id !== linkId),
          };
        }
        return s;
      });

      newSections = newSections.map(s => {
        if (s.id === toSectionId) {
          // Добавляем в целевую секцию
          const newLinks = [...s.links];
          if (fromSectionId === toSectionId) {
            // Перемещение внутри той же секции
            const filteredLinks = newLinks.filter(l => l.id !== linkId);
            filteredLinks.splice(newOrder, 0, { ...linkToMove, order: newOrder });
            return {
              ...s,
              links: filteredLinks.map((l, i) => ({ ...l, order: i })),
            };
          } else {
            // Перемещение в другую секцию
            newLinks.splice(newOrder, 0, { ...linkToMove, order: newOrder });
            return {
              ...s,
              links: newLinks.map((l, i) => ({ ...l, order: i })),
            };
          }
        }
        return s;
      });

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: newSections,
      };
    });
    setIsDirty(true);
  }, []);

  // Сериализовать обратно в .md
  const serialize = useCallback(() => {
    return serializeLinkFile(data);
  }, [data]);

  return {
    data,
    isDirty,
    setIsDirty,
    getContainers,
    addSection,
    removeSection,
    renameSection,
    reorderSections,
    addLink,
    updateLink,
    removeLink,
    moveLink,
    serialize,
  };
}
