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
  DataFile,
  LinkContainer,
  LinkItem,
  LinkSection,
  PromptContainer,
  PromptItem,
  PlaybookContainer,
  PlaybookItem,
} from "../types";

// Sanitize filename for safe file system usage
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 100);
}

// Create YAML frontmatter from object
function createFrontmatter(data: Record<string, unknown>): string {
  const lines: string[] = ["---"];

  for (const [key, value] of Object.entries(data)) {
    if (key === "content") continue; // Skip content, it goes in body

    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === "string") {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else if (value !== undefined && value !== null) {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

// ============================================
// LINKS FORMAT: Multiple Sections per File
// ============================================

/**
 * Создаёт .md файл ссылок с поддержкой множественных секций
 * Формат:
 * ---
 * frontmatter
 * ---
 * ## Section Title
 * <!-- section: {id, order, collapsed, color, icon} -->
 * - [Title](URL) description <!-- link: {id, order, favicon, tags, isFavorite, color, sectionId} -->
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

  const lines: string[] = [frontmatter, ""];

  // Группируем ссылки по секциям
  const sectionLinksMap = new Map<string | undefined, LinkItem[]>();

  for (const item of container.subItems) {
    const sectionId = item.sectionId;
    if (!sectionLinksMap.has(sectionId)) {
      sectionLinksMap.set(sectionId, []);
    }
    sectionLinksMap.get(sectionId)!.push(item);
  }

  // Сортируем секции по order
  const sortedSections = [...(container.sections || [])].sort((a, b) => a.order - b.order);

  // Пишем каждую секцию
  for (const section of sortedSections) {
    const iconPrefix = section.icon ? `${section.icon} ` : "";
    lines.push(`## ${iconPrefix}${section.title}`);

    // Метаданные секции
    const sectionMeta: Record<string, unknown> = {
      id: section.id,
      order: section.order,
      collapsed: section.collapsed,
    };
    if (section.color) sectionMeta.color = section.color;
    if (section.icon) sectionMeta.icon = section.icon;

    lines.push(`<!-- section: ${JSON.stringify(sectionMeta)} -->`);
    lines.push("");

    // Ссылки этой секции
    const sectionLinks = sectionLinksMap.get(section.id) || [];
    sectionLinksMap.delete(section.id); // Удаляем из map

    // Сортируем по order
    const sortedLinks = [...sectionLinks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const item of sortedLinks) {
      const linkMeta: Record<string, unknown> = {
        id: item.id,
        order: item.order ?? 0,
      };

      if (item.favicon) linkMeta.favicon = item.favicon;
      if (item.tags.length > 0) linkMeta.tags = item.tags;
      if (item.isFavorite) linkMeta.isFavorite = true;
      if (item.sectionId) linkMeta.sectionId = item.sectionId;
      if (item.color) linkMeta.color = item.color;
      if (item.level) linkMeta.level = item.level;
      if (item.description) linkMeta.description = item.description;

      let linkLine = `- [${item.title}](${item.url})`;
      if (item.description && !linkMeta.description) {
        linkLine += ` ${item.description}`;
      }
      linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;

      lines.push(linkLine);
    }

    lines.push("");
  }

  // Ссылки без секции (uncategorized) - пишем в конце без заголовка
  const uncategorizedLinks = sectionLinksMap.get(undefined) || [];
  if (uncategorizedLinks.length > 0) {
    const sortedLinks = [...uncategorizedLinks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const item of sortedLinks) {
      const linkMeta: Record<string, unknown> = {
        id: item.id,
        order: item.order ?? 0,
      };

      if (item.favicon) linkMeta.favicon = item.favicon;
      if (item.tags.length > 0) linkMeta.tags = item.tags;
      if (item.isFavorite) linkMeta.isFavorite = true;
      if (item.color) linkMeta.color = item.color;
      if (item.level) linkMeta.level = item.level;
      if (item.description) linkMeta.description = item.description;

      let linkLine = `- [${item.title}](${item.url})`;
      if (item.description && !linkMeta.description) {
        linkLine += ` ${item.description}`;
      }
      linkLine += ` <!-- link: ${JSON.stringify(linkMeta)} -->`;

      lines.push(linkLine);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Парсит .md файл со ссылками в формате с секциями
 * Возвращает все данные файла включая массив секций
 */
export interface ParsedSection {
  id: string;
  title: string;
  order: number;
  collapsed: boolean;
  color?: string;
  icon?: string;
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
  const lines = content.split("\n");
  let inFrontmatter = false;
  let frontmatterEndIndex = 0;
  const frontmatterData: Record<string, unknown> = {};
  const genId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

  // Парсим frontmatter
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
    if (inFrontmatter && line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const key = line.slice(0, colonIndex).trim();
      let value: unknown = line.slice(colonIndex + 1).trim();

      // Убираем кавычки
      if (typeof value === "string") {
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
      }

      // Массивы
      if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v: string) => v.trim().replace(/^["']|["']$/g, ""))
          .filter((v: string) => v);
      }

      // Числа
      if (typeof value === "string" && !isNaN(Number(value)) && value !== "") {
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

  // Uncategorized ссылки
  const uncategorizedLinks: LinkItem[] = [];

  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Заголовок секции
    if (trimmedLine.startsWith("## ")) {
      // Сохраняем предыдущую секцию
      if (currentSection) {
        sections.push(currentSection);
      }

      let sectionTitle = trimmedLine.slice(3).trim();
      let sectionIcon: string | undefined;

      // Убираем эмодзи из заголовка
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
        icon: sectionIcon,
        links: [],
      };

      // Проверяем метаданные секции на следующей строке
      const nextLine = contentLines[i + 1]?.trim();
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
            // Ignore parse errors
          }
        }
        i++; // Пропускаем строку с метаданными
      }

      linkOrder = 0;
      continue;
    }

    // Ссылка
    if (trimmedLine.startsWith("- [") || trimmedLine.startsWith("-[")) {
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
      const cleanLine = trimmedLine.replace(/<!--\s*link:.*?-->/, "").trim();

      // Парсим Markdown ссылку
      const linkMatch = cleanLine.match(/^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/);
      if (linkMatch) {
        const [, title, url, rest] = linkMatch;
        const description = rest.trim() || linkMeta.description || undefined;

        const linkItem: LinkItem = {
          id: linkMeta.id || genId(),
          url,
          title: title || url,
          description,
          favicon: linkMeta.favicon,
          tags: linkMeta.tags || [],
          isFavorite: linkMeta.isFavorite ?? false,
          order: linkMeta.order ?? linkOrder++,
          sectionId: linkMeta.sectionId,
          color: linkMeta.color,
          level: linkMeta.level,
        };

        if (currentSection) {
          linkItem.sectionId = currentSection.id;
          currentSection.links.push(linkItem);
        } else {
          uncategorizedLinks.push(linkItem);
        }
      }
    }
  }

  // Сохраняем последнюю секцию
  if (currentSection) {
    sections.push(currentSection);
  }

  // Добавляем uncategorized как первую секцию если есть
  if (uncategorizedLinks.length > 0) {
    sections.unshift({
      id: "uncategorized",
      title: "Uncategorized",
      order: -1,
      collapsed: false,
      links: uncategorizedLinks,
    });
  }

  return {
    id: (frontmatterData.id as string) || genId(),
    title: (frontmatterData.title as string) || "Untitled",
    tags: (frontmatterData.tags as string[]) || [],
    order: (frontmatterData.order as number) || 0,
    createdAt: (frontmatterData.createdAt as string) || new Date().toISOString(),
    updatedAt: (frontmatterData.updatedAt as string) || new Date().toISOString(),
    sections,
  };
}

/**
 * Преобразует распаршенный файл в LinkContainer
 */
export function parsedSectionsToContainer(
  parsed: ReturnType<typeof parseLinkFileWithSections>,
  folderId: string,
): LinkContainer {
  // Собираем все ссылки
  const allLinks: LinkItem[] = [];

  for (const section of parsed.sections) {
    for (const link of section.links) {
      allLinks.push({
        ...link,
        sectionId: link.sectionId || (section.id !== "uncategorized" ? section.id : undefined),
      });
    }
  }

  // Создаём секции (кроме uncategorized)
  const sections: LinkSection[] = parsed.sections
    .filter((s) => s.id !== "uncategorized")
    .map((s) => ({
      id: s.id,
      title: s.title,
      order: s.order,
      collapsed: s.collapsed,
      color: s.color,
      icon: s.icon,
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

// ============================================
// PROMPTS FORMAT: Multiple Sections per File
// ============================================

/**
 * Создаёт .md файл промптов с поддержкой множественных секций
 * Формат:
 * ---
 * frontmatter
 * ---
 * ## Section Title
 * <!-- section: {id, order, collapsed, color} -->
 * ### Prompt Title
 * _description_
 * ```
 * prompt text
 * ```
 * **Variables:** var1, var2
 * <!-- prompt: {id, sectionId, isFavorite, tags} -->
 */
export function createPromptFileWithSections(container: PromptContainer): string {
  const frontmatter = createFrontmatter({
    id: container.id,
    title: container.title,
    category: container.category,
    tags: container.tags,
    order: container.order,
    createdAt: container.createdAt,
    updatedAt: container.updatedAt,
  });

  const lines: string[] = [frontmatter, ""];

  // Группируем промпты по секциям
  const sectionItemsMap = new Map<string | undefined, PromptItem[]>();
  for (const item of container.subItems) {
    const sectionId = item.sectionId;
    if (!sectionItemsMap.has(sectionId)) sectionItemsMap.set(sectionId, []);
    sectionItemsMap.get(sectionId)!.push(item);
  }

  // Сортируем секции по order
  const sortedSections = [...(container.sections || [])].sort((a, b) => a.order - b.order);

  // Пишем каждую секцию
  for (const section of sortedSections) {
    lines.push(`## ${section.title}`);

    const sectionMeta: Record<string, unknown> = {
      id: section.id,
      order: section.order,
      collapsed: section.collapsed,
    };
    if (section.color) sectionMeta.color = section.color;

    lines.push(`<!-- section: ${JSON.stringify(sectionMeta)} -->`);
    lines.push("");

    const sectionItems = sectionItemsMap.get(section.id) || [];
    sectionItemsMap.delete(section.id);

    for (const item of sectionItems) {
      lines.push(`### ${item.title}`);
      if (item.description) lines.push(`_${item.description}_\n`);
      lines.push("```");
      lines.push(item.prompt);
      lines.push("```");
      if (item.variables && item.variables.length > 0) {
        lines.push(`\n**Variables:** ${item.variables.join(", ")}`);
      }

      const promptMeta: Record<string, unknown> = { id: item.id };
      if (item.sectionId) promptMeta.sectionId = item.sectionId;
      if (item.isFavorite) promptMeta.isFavorite = true;
      if (item.tags.length > 0) promptMeta.tags = item.tags;
      lines.push(`<!-- prompt: ${JSON.stringify(promptMeta)} -->`);
      lines.push("");
    }
  }

  // Промпты без секции (uncategorized)
  const uncategorizedItems = sectionItemsMap.get(undefined) || [];
  if (uncategorizedItems.length > 0) {
    for (const item of uncategorizedItems) {
      lines.push(`### ${item.title}`);
      if (item.description) lines.push(`_${item.description}_\n`);
      lines.push("```");
      lines.push(item.prompt);
      lines.push("```");
      if (item.variables && item.variables.length > 0) {
        lines.push(`\n**Variables:** ${item.variables.join(", ")}`);
      }

      const promptMeta: Record<string, unknown> = { id: item.id };
      if (item.isFavorite) promptMeta.isFavorite = true;
      if (item.tags.length > 0) promptMeta.tags = item.tags;
      lines.push(`<!-- prompt: ${JSON.stringify(promptMeta)} -->`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ============================================
// PLAYBOOKS FORMAT: Multiple Sections per File
// ============================================

/**
 * Создаёт .md файл плейбука с поддержкой множественных секций
 * Формат:
 * ---
 * frontmatter
 * ---
 * ## Section Title
 * <!-- section: {id, order, collapsed, color} -->
 * ### cmd_id
 * ```bash
 * command
 * ```
 * _description_
 * **Tags:** tag1, tag2
 * <!-- cmd: {id, sectionId, isFavorite, language} -->
 */
export function createPlaybookFileWithSections(container: PlaybookContainer): string {
  const frontmatter = createFrontmatter({
    id: container.id,
    title: container.title,
    description: container.description || "",
    tags: container.tags,
    order: container.order,
    createdAt: container.createdAt,
    updatedAt: container.updatedAt,
  });

  const lines: string[] = [frontmatter, ""];

  if (container.description) {
    lines.push(container.description);
    lines.push("");
  }

  // Группируем команды по секциям
  const sectionItemsMap = new Map<string | undefined, PlaybookItem[]>();
  for (const item of container.subItems) {
    const sectionId = item.sectionId;
    if (!sectionItemsMap.has(sectionId)) sectionItemsMap.set(sectionId, []);
    sectionItemsMap.get(sectionId)!.push(item);
  }

  // Сортируем секции по order
  const sortedSections = [...(container.sections || [])].sort((a, b) => a.order - b.order);

  // Пишем каждую секцию
  for (const section of sortedSections) {
    lines.push(`## ${section.title}`);

    const sectionMeta: Record<string, unknown> = {
      id: section.id,
      order: section.order,
      collapsed: section.collapsed,
    };
    if (section.color) sectionMeta.color = section.color;

    lines.push(`<!-- section: ${JSON.stringify(sectionMeta)} -->`);
    lines.push("");

    const sectionItems = sectionItemsMap.get(section.id) || [];
    sectionItemsMap.delete(section.id);

    for (const item of sectionItems) {
      lines.push(`### ${item.id}`);
      lines.push(`\`\`\`${item.language}`);
      lines.push(item.command);
      lines.push("```");
      if (item.description) lines.push(`\n_${item.description}_`);
      if (item.tags && item.tags.length > 0) {
        lines.push(`\n**Tags:** ${item.tags.join(", ")}`);
      }

      const cmdMeta: Record<string, unknown> = { id: item.id, language: item.language };
      if (item.sectionId) cmdMeta.sectionId = item.sectionId;
      if (item.isFavorite) cmdMeta.isFavorite = true;
      if (item.tags && item.tags.length > 0) cmdMeta.tags = item.tags;
      // Прогресс чеклиста едет вместе с командой (Задача 3.5)
      if (item.status && item.status !== "pending") cmdMeta.status = item.status;
      lines.push(`<!-- cmd: ${JSON.stringify(cmdMeta)} -->`);
      lines.push("");
    }
  }

  // Команды без секции (uncategorized)
  const uncategorizedItems = sectionItemsMap.get(undefined) || [];
  if (uncategorizedItems.length > 0) {
    for (const item of uncategorizedItems) {
      lines.push(`### ${item.id}`);
      lines.push(`\`\`\`${item.language}`);
      lines.push(item.command);
      lines.push("```");
      if (item.description) lines.push(`\n_${item.description}_`);
      if (item.tags && item.tags.length > 0) {
        lines.push(`\n**Tags:** ${item.tags.join(", ")}`);
      }

      const cmdMeta: Record<string, unknown> = { id: item.id, language: item.language };
      if (item.isFavorite) cmdMeta.isFavorite = true;
      if (item.tags && item.tags.length > 0) cmdMeta.tags = item.tags;
      // Прогресс чеклиста едет вместе с командой (Задача 3.5)
      if (item.status && item.status !== "pending") cmdMeta.status = item.status;
      lines.push(`<!-- cmd: ${JSON.stringify(cmdMeta)} -->`);
      lines.push("");
    }
  }

  return lines.join("\n");
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
    return parts.map(sanitizeFilename).join("/");
  };

  // Process each workspace
  for (const workspace of data.workspaces) {
    // Get categories for this workspace
    const workspaceCategories = data.categories.filter((c) => c.workspaceId === workspace.id);

    for (const category of workspaceCategories) {
      // Get folders for this category
      const categoryFolders = data.folders.filter((f) => f.categoryId === category.id);

      for (const folder of categoryFolders) {
        const basePath = buildPath(["data", workspace.name, category.name, folder.name]);

        // Process notes
        if (category.baseType === "notes") {
          const notes = data.notes.filter((n) => n.folderId === folder.id);
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
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(note.title)}`, "md");

            files.push({ path: filePath, content });
          }
        }

        // Process commands
        if (category.baseType === "commands") {
          const commands = data.commands.filter((c) => c.folderId === folder.id);
          for (const cmd of commands) {
            const frontmatter = createFrontmatter({
              id: cmd.id,
              title: cmd.title,
              description: cmd.description || "",
              tags: cmd.tags,
              order: cmd.order,
              createdAt: cmd.createdAt,
              updatedAt: cmd.updatedAt,
            });

            // Format commands as markdown code blocks
            let body = "";
            if (cmd.description) {
              body += `${cmd.description}\n\n`;
            }
            for (const item of cmd.subItems) {
              body += `### ${item.id}\n`;
              body += `\`\`\`${item.language}\n${item.command}\n\`\`\`\n`;
              if (item.description) {
                body += `\n_${item.description}_\n`;
              }
              body += "\n";
            }

            const content = `${frontmatter}\n${body}`;
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(cmd.title)}`, "md");

            files.push({ path: filePath, content });
          }
        }

        // Process links - NEW FORMAT with multiple sections
        if (category.baseType === "links") {
          const links = data.links.filter((l) => l.folderId === folder.id);
          for (const link of links) {
            const content = createLinkFileWithSections(link);
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(link.title)}`, "md");

            files.push({ path: filePath, content });
          }
        }

        // Process prompts - with sections support
        if (category.baseType === "prompts") {
          const prompts = data.prompts.filter((p) => p.folderId === folder.id);
          for (const prompt of prompts) {
            const content = createPromptFileWithSections(prompt);
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(prompt.title)}`, "md");
            files.push({ path: filePath, content });
          }
        }

        // Process playbooks - with sections support
        if (category.baseType === "playbooks") {
          const playbooks = data.playbooks.filter((pb) => pb.folderId === folder.id);
          for (const playbook of playbooks) {
            const content = createPlaybookFileWithSections(playbook);
            const filePath = getUniquePath(`${basePath}/${sanitizeFilename(playbook.title)}`, "md");
            files.push({ path: filePath, content });
          }
        }
      }
    }
  }

  return files;
}
