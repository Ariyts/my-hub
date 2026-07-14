// ============================================
// LINK FILE PARSER - парсинг .md файла ссылок в State и обратно
// ============================================
// Формат файла:
// ---
// frontmatter (YAML)
// ---
// ## Section Title
// <!-- section: {"id":"...","order":0,"color":"#ff5555"} -->
// - [Title](URL) description <!-- link: {"id":"...","favicon":"...","color":"#ff5555","sectionId":"..."} -->
// ============================================

export interface ParsedLinkSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  color?: string; // Цвет секции
  icon?: string; // Эмодзи иконка секции
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
  sectionId?: string; // ID секции, к которой принадлежит ссылка
  color?: string; // Индивидуальный цвет ссылки
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
  const lines = content.split("\n");
  let inFrontmatter = false;
  const frontmatterLines: string[] = [];
  let frontmatterEndIndex = 0;

  // 1. Извлекаем frontmatter
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "---") {
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
  const frontmatter = parseSimpleYaml(frontmatterLines.join("\n"));

  // 3. Парсим контент (секции и ссылки)
  const contentLines = lines.slice(frontmatterEndIndex + 1);
  const sections = parseSections(contentLines);

  return {
    id: frontmatter.id || genId(),
    title: frontmatter.title || "Untitled",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    order:
      typeof frontmatter.order === "number" ? frontmatter.order : parseInt(frontmatter.order) || 0,
    createdAt: frontmatter.createdAt || new Date().toISOString(),
    updatedAt: frontmatter.updatedAt || new Date().toISOString(),
    sections,
    rawFrontmatter: frontmatterLines.join("\n"),
  };
}

/**
 * Простой YAML парсер для frontmatter
 */
function parseSimpleYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yaml.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();

    // Убираем кавычки
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Массивы (простой случай: [a, b, c])
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v: string) => v.trim().replace(/^["']|["']$/g, ""))
        .filter((v: string) => v);
    }

    // Числа
    if (!isNaN(Number(value)) && value !== "") {
      value = Number(value);
    }

    // Булевы значения
    if (value === "true") value = true;
    if (value === "false") value = false;

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

  // Секция "Uncategorized" для ссылок без секции
  const uncategorizedLinks: ParsedLinkItem[] = [];

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
    if (trimmedLine.startsWith("## ")) {
      flushSection();

      // Извлекаем эмодзи из заголовка если есть
      let sectionTitle = trimmedLine.slice(3).trim();
      let sectionIcon: string | undefined;
      const emojiMatch = sectionTitle.match(/^([\u{1F300}-\u{1F9FF}]\s*)/u);
      if (emojiMatch) {
        sectionIcon = emojiMatch[0].trim();
        sectionTitle = sectionTitle.slice(emojiMatch[0].length).trim();
      }

      currentSection = {
        id: genId(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
        links: [],
      };

      if (sectionIcon) {
        currentSection.icon = sectionIcon;
      }

      // Проверяем следующую строку на метаданные секции
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith("<!-- section:")) {
        const match = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (match) {
          try {
            const meta = JSON.parse(match[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSection.order =
              typeof meta.order === "number" ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
            currentSection.color = meta.color;
            currentSection.icon = meta.icon || currentSection.icon;
          } catch {
            console.warn("Failed to parse section metadata:", match[1]);
          }
        }
        i++; // Пропускаем строку с метаданными
      }

      continue;
    }

    // Ссылка (- [Title](URL) description)
    if (trimmedLine.startsWith("- [") || trimmedLine.startsWith("-[")) {
      const link = parseLinkLine(trimmedLine, linkOrder++);
      if (link) {
        // Если есть currentSection, добавляем в неё, иначе в uncategorized
        if (currentSection) {
          // Привязываем ссылку к секции через sectionId
          link.sectionId = currentSection.id;
          currentLinks.push(link);
        } else {
          uncategorizedLinks.push(link);
        }
      }
    }
  }

  flushSection();

  // Если есть uncategorized ссылки, создаём для них секцию
  if (uncategorizedLinks.length > 0) {
    sections.unshift({
      id: "uncategorized",
      title: "Uncategorized",
      order: -1,
      collapsed: false,
      links: uncategorizedLinks,
    });
  }

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
    } catch {
      console.warn("Failed to parse link metadata:", metaMatch[1]);
    }
  }

  // Убираем комментарий для парсинга основной части
  const cleanLine = line.replace(/<!--\s*link:.*?-->/, "").trim();

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
    sectionId: linkMeta.sectionId,
    color: linkMeta.color,
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
  lines.push("---");
  lines.push(`id: "${data.id}"`);
  lines.push(`title: "${data.title}"`);
  lines.push(`tags: [${data.tags.map((t) => `"${t}"`).join(", ")}]`);
  lines.push(`order: ${data.order}`);
  lines.push(`createdAt: "${data.createdAt}"`);
  lines.push(`updatedAt: "${data.updatedAt}"`);
  lines.push("---");
  lines.push("");

  // Секции (сортируем по order)
  const sortedSections = [...data.sections]
    .filter((s) => s.id !== "uncategorized") // Uncategorized не пишем как секцию
    .sort((a, b) => a.order - b.order);

  // Сначала собираем все ссылки без секции (uncategorized)
  const uncategorizedLinks = data.sections.find((s) => s.id === "uncategorized")?.links || [];

  for (const section of sortedSections) {
    // Заголовок секции
    const iconPrefix = section.icon ? `${section.icon} ` : "";
    lines.push(`## ${iconPrefix}${section.title}`);

    // Метаданные секции (сохраняем все важные поля)
    const sectionMeta: Record<string, any> = {
      id: section.id,
      order: section.order,
      collapsed: section.collapsed,
    };
    if (section.color) sectionMeta.color = section.color;
    if (section.icon) sectionMeta.icon = section.icon;

    lines.push(`<!-- section: ${JSON.stringify(sectionMeta)} -->`);
    lines.push("");

    // Ссылки (сортируем по order)
    const sortedLinks = [...section.links].sort((a, b) => a.order - b.order);

    for (const link of sortedLinks) {
      const linkMeta: Record<string, any> = {
        id: link.id,
        order: link.order,
      };

      if (link.favicon) linkMeta.favicon = link.favicon;
      if (link.tags.length > 0) linkMeta.tags = link.tags;
      if (link.isFavorite) linkMeta.isFavorite = true;
      if (link.description) linkMeta.description = link.description;
      if (link.sectionId) linkMeta.sectionId = link.sectionId;
      if (link.color) linkMeta.color = link.color;

      // Формируем строку ссылки
      let linkLine = `- [${link.title}](${link.url})`;
      if (link.description && !linkMeta.description) {
        linkLine += ` ${link.description}`;
      }
      linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;

      lines.push(linkLine);
    }

    lines.push("");
  }

  // Uncategorized ссылки в конце без заголовка секции
  if (uncategorizedLinks.length > 0) {
    for (const link of uncategorizedLinks.sort((a, b) => a.order - b.order)) {
      const linkMeta: Record<string, any> = {
        id: link.id,
        order: link.order,
      };

      if (link.favicon) linkMeta.favicon = link.favicon;
      if (link.tags.length > 0) linkMeta.tags = link.tags;
      if (link.isFavorite) linkMeta.isFavorite = true;
      if (link.description) linkMeta.description = link.description;
      if (link.color) linkMeta.color = link.color;

      let linkLine = `- [${link.title}](${link.url})`;
      if (link.description && !linkMeta.description) {
        linkLine += ` ${link.description}`;
      }
      linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;

      lines.push(linkLine);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ============================================
// ХУК ДЛЯ РАБОТЫ С ФАЙЛОМ ССЫЛОК
// ============================================

import { useState, useCallback, useEffect } from "react";
import type { LinkContainer, LinkItem, LinkSection } from "../types";

/**
 * Преобразует ParsedLinkFile в LinkContainer для совместимости с текущим Store
 * ВАЖНО: Один ParsedLinkFile = один LinkContainer со всеми секциями и ссылками
 */
export function parsedToContainer(parsed: ParsedLinkFile, folderId: string): LinkContainer {
  // Собираем все ссылки из всех секций
  const allLinks: LinkItem[] = [];

  for (const section of parsed.sections) {
    for (const link of section.links) {
      allLinks.push({
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        favicon: link.favicon,
        tags: link.tags,
        isFavorite: link.isFavorite,
        order: link.order,
        sectionId: link.sectionId || (section.id !== "uncategorized" ? section.id : undefined),
        color: link.color,
      });
    }
  }

  // Создаём секции (кроме uncategorized)
  const sections: LinkSection[] = parsed.sections
    .filter((s) => s.id !== "uncategorized")
    .map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      collapsed: section.collapsed,
      color: section.color,
      icon: section.icon,
    }));

  return {
    id: parsed.id,
    folderId,
    title: parsed.title,
    subItems: allLinks,
    sections,
    tags: parsed.tags,
    order: parsed.order,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
    type: "links",
    isExpanded: true,
  };
}

/**
 * Преобразует LinkContainer обратно в ParsedLinkFile
 */
export function containerToParsed(container: LinkContainer): ParsedLinkFile {
  // Группируем ссылки по секциям
  const sectionMap = new Map<string | undefined, LinkItem[]>();

  for (const link of container.subItems) {
    const sectionId = link.sectionId;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, []);
    }
    sectionMap.get(sectionId)!.push(link);
  }

  // Создаём секции
  const sections: ParsedLinkSection[] = [];

  // Добавляем секции из container.sections в правильном порядке
  const sortedSections = [...(container.sections || [])].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    const sectionLinks = sectionMap.get(section.id) || [];
    sectionMap.delete(section.id); // Удаляем из map, чтобы потом добавить uncategorized

    sections.push({
      id: section.id,
      title: section.title,
      order: section.order,
      collapsed: section.collapsed,
      color: section.color,
      icon: section.icon,
      links: sectionLinks
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((link, index) => ({
          id: link.id,
          url: link.url,
          title: link.title,
          description: link.description,
          favicon: link.favicon,
          tags: link.tags,
          isFavorite: link.isFavorite,
          order: link.order ?? index,
          sectionId: link.sectionId,
          color: link.color,
        })),
    });
  }

  // Оставшиеся ссылки без секции -> Uncategorized
  const uncategorizedLinks = sectionMap.get(undefined) || [];
  if (uncategorizedLinks.length > 0) {
    sections.push({
      id: "uncategorized",
      title: "Uncategorized",
      order: -1,
      collapsed: false,
      links: uncategorizedLinks
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((link, index) => ({
          id: link.id,
          url: link.url,
          title: link.title,
          description: link.description,
          favicon: link.favicon,
          tags: link.tags,
          isFavorite: link.isFavorite,
          order: link.order ?? index,
          color: link.color,
        })),
    });
  }

  return {
    id: container.id,
    title: container.title,
    tags: container.tags,
    order: container.order,
    createdAt: container.createdAt,
    updatedAt: container.updatedAt,
    rawFrontmatter: "",
    sections,
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

  // Получить контейнер для Store
  const getContainer = useCallback(() => {
    return parsedToContainer(data, folderId);
  }, [data, folderId]);

  // Добавить секцию
  const addSection = useCallback((title: string, color?: string) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: [
        ...prev.sections.filter((s) => s.id !== "uncategorized"),
        {
          id: genId(),
          title,
          order: prev.sections.filter((s) => s.id !== "uncategorized").length,
          collapsed: false,
          color,
          links: [],
        },
        ...(prev.sections.find((s) => s.id === "uncategorized")
          ? [prev.sections.find((s) => s.id === "uncategorized")!]
          : []),
      ],
    }));
    setIsDirty(true);
  }, []);

  // Удалить секцию
  const removeSection = useCallback((sectionId: string) => {
    setData((prev) => {
      const section = prev.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      // Перемещаем ссылки в uncategorized
      const uncategorizedSection = prev.sections.find((s) => s.id === "uncategorized");
      const newUncategorizedLinks = [
        ...(uncategorizedSection?.links || []),
        ...section.links.map((l) => ({ ...l, sectionId: undefined })),
      ];

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: [
          ...prev.sections
            .filter((s) => s.id !== sectionId && s.id !== "uncategorized")
            .map((s, i) => ({ ...s, order: i })),
          ...(newUncategorizedLinks.length > 0
            ? [
                {
                  id: "uncategorized",
                  title: "Uncategorized",
                  order: -1,
                  collapsed: false,
                  links: newUncategorizedLinks,
                },
              ]
            : []),
        ],
      };
    });
    setIsDirty(true);
  }, []);

  // Переименовать секцию
  const renameSection = useCallback((sectionId: string, title: string) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
    setIsDirty(true);
  }, []);

  // Обновить цвет секции
  const setSectionColor = useCallback((sectionId: string, color: string | undefined) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, color } : s)),
    }));
    setIsDirty(true);
  }, []);

  // Переместить секцию
  const reorderSections = useCallback((sectionIds: string[]) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map((s) => ({
        ...s,
        order: s.id === "uncategorized" ? -1 : sectionIds.indexOf(s.id),
      })),
    }));
    setIsDirty(true);
  }, []);

  // Добавить ссылку в секцию
  const addLink = useCallback(
    (sectionId: string | null, link: Omit<ParsedLinkItem, "id" | "order">) => {
      setData((prev) => {
        const targetSectionId = sectionId || "uncategorized";
        const targetSection = prev.sections.find((s) => s.id === targetSectionId);

        if (!targetSection) {
          // Если секция не найдена, добавляем в uncategorized
          const uncategorized = prev.sections.find((s) => s.id === "uncategorized");
          if (uncategorized) {
            return {
              ...prev,
              updatedAt: new Date().toISOString(),
              sections: prev.sections.map((s) =>
                s.id === "uncategorized"
                  ? {
                      ...s,
                      links: [...s.links, { ...link, id: genId(), order: s.links.length }],
                    }
                  : s,
              ),
            };
          }
          return prev;
        }

        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          sections: prev.sections.map((s) =>
            s.id === targetSectionId
              ? {
                  ...s,
                  links: [
                    ...s.links,
                    {
                      ...link,
                      id: genId(),
                      order: s.links.length,
                      sectionId: sectionId || undefined,
                    },
                  ],
                }
              : s,
          ),
        };
      });
      setIsDirty(true);
    },
    [],
  );

  // Обновить ссылку
  const updateLink = useCallback((linkId: string, updates: Partial<ParsedLinkItem>) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map((s) => ({
        ...s,
        links: s.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)),
      })),
    }));
    setIsDirty(true);
  }, []);

  // Удалить ссылку
  const removeLink = useCallback((linkId: string) => {
    setData((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sections: prev.sections.map((s) => ({
        ...s,
        links: s.links.filter((l) => l.id !== linkId),
      })),
    }));
    setIsDirty(true);
  }, []);

  // Переместить ссылку (внутри или между секциями)
  const moveLink = useCallback(
    (
      fromSectionId: string | null,
      toSectionId: string | null,
      linkId: string,
      newOrder: number,
    ) => {
      setData((prev) => {
        const fromSecId = fromSectionId || "uncategorized";
        const toSecId = toSectionId || "uncategorized";

        // Находим ссылку
        let linkToMove: ParsedLinkItem | undefined;
        for (const section of prev.sections) {
          const found = section.links.find((l) => l.id === linkId);
          if (found) {
            linkToMove = found;
            break;
          }
        }

        if (!linkToMove) return prev;

        let newSections = prev.sections.map((s) => {
          // Удаляем из исходной секции
          if (s.id === fromSecId && fromSecId !== toSecId) {
            return {
              ...s,
              links: s.links.filter((l) => l.id !== linkId),
            };
          }
          return s;
        });

        newSections = newSections.map((s) => {
          if (s.id === toSecId) {
            const newLinks = [...s.links];
            if (fromSecId === toSecId) {
              // Перемещение внутри той же секции
              const filteredLinks = newLinks.filter((l) => l.id !== linkId);
              filteredLinks.splice(newOrder, 0, {
                ...linkToMove!,
                order: newOrder,
                sectionId: toSectionId || undefined,
              });
              return {
                ...s,
                links: filteredLinks.map((l, i) => ({ ...l, order: i })),
              };
            } else {
              // Перемещение в другую секцию
              newLinks.splice(newOrder, 0, {
                ...linkToMove!,
                order: newOrder,
                sectionId: toSectionId || undefined,
              });
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
    },
    [],
  );

  // Сериализовать обратно в .md
  const serialize = useCallback(() => {
    return serializeLinkFile(data);
  }, [data]);

  return {
    data,
    isDirty,
    setIsDirty,
    getContainer,
    addSection,
    removeSection,
    renameSection,
    setSectionColor,
    reorderSections,
    addLink,
    updateLink,
    removeLink,
    moveLink,
    serialize,
  };
}

// Экспорт для обратной совместимости
export function parsedToContainers(parsed: ParsedLinkFile, folderId: string): LinkContainer[] {
  return [parsedToContainer(parsed, folderId)];
}

export function containersToParsed(
  containers: LinkContainer[],
  _fileId: string,
  title: string,
  tags: string[],
  order: number,
  createdAt: string,
  updatedAt: string,
): ParsedLinkFile {
  // Берем первый контейнер (должен быть только один)
  const container = containers[0];
  if (!container) {
    return {
      id: _fileId,
      title,
      tags,
      order,
      createdAt,
      updatedAt,
      rawFrontmatter: "",
      sections: [],
    };
  }

  return containerToParsed({
    ...container,
    title: title || container.title,
    tags: tags.length > 0 ? tags : container.tags,
    order: order ?? container.order,
    createdAt: createdAt || container.createdAt,
    updatedAt: updatedAt || container.updatedAt,
  });
}
