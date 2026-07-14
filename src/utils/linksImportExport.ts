import type { LinkContainer } from "../types";

/**
 * Markdown Import/Export utilities for Links.
 *
 * Format:
 *   # Links: <title>
 *
 *   ## Section Name
 *   <!-- color: #hex -->
 *
 *   - [Title](URL) description
 *   Tags: #tag1, #tag2
 *   Favorite: true
 */

// ============================================================================
// EXPORT
// ============================================================================

export function generateMarkdownTemplate(title: string): string {
  return `# Links: ${title}

<!-- 
  INSTRUCTIONS FOR AI:
  - Replace this content with useful links organized by sections
  - Each section starts with ## Section Name
  - Each link is a Markdown link: - [Title](URL) Description
  - Add tags AFTER the link as "Tags: #tag1, #tag2"
  - Add "Favorite: true" to mark important links
  - Use descriptive titles and add brief descriptions after the URL
  - Group related links under meaningful section names
-->

## Documentation

Official documentation and reference materials.

- [MDN Web Docs](https://developer.mozilla.org/) Comprehensive web development documentation
Tags: #docs, #web
Favorite: true

- [React Docs](https://react.dev/) Official React documentation
Tags: #react, #frontend

## Tools

Development tools and utilities.

- [VS Code](https://code.visualstudio.com/) Popular code editor
Tags: #editor, #tools
`;
}

export function generateFullExport(container: LinkContainer): string {
  const lines: string[] = [];
  lines.push(`# Links: ${container.title}`);
  lines.push("");

  // Sections
  const sections = [...(container.sections || [])].sort((a, b) => a.order - b.order);

  if (sections.length === 0 && container.subItems.length === 0) {
    lines.push("_No links yet._");
    return lines.join("\n");
  }

  for (const section of sections) {
    const iconPrefix = section.icon ? `${section.icon} ` : "";
    lines.push(`## ${iconPrefix}${section.title}`);
    if (section.color) {
      lines.push(`<!-- color: ${section.color} -->`);
    }
    lines.push("");

    const items = container.subItems
      .filter((i) => i.sectionId === section.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (items.length === 0) {
      lines.push("_Empty section._");
      lines.push("");
      continue;
    }

    for (const item of items) {
      let line = `- [${item.title}](${item.url})`;
      if (item.description) {
        line += ` ${item.description}`;
      }
      lines.push(line);
      if (item.tags && item.tags.length > 0) {
        lines.push("Tags: " + item.tags.map((t) => "#" + t).join(", "));
      }
      if (item.isFavorite) {
        lines.push("Favorite: true");
      }
      if (item.color) {
        lines.push(`<!-- color: ${item.color} -->`);
      }
      lines.push("");
    }
  }

  // Uncategorized links
  const uncategorized = container.subItems.filter((i) => !i.sectionId);
  if (uncategorized.length > 0) {
    if (sections.length > 0) {
      lines.push("## Uncategorized");
      lines.push("");
    }
    for (const item of uncategorized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
      let line = `- [${item.title}](${item.url})`;
      if (item.description) {
        line += ` ${item.description}`;
      }
      lines.push(line);
      if (item.tags && item.tags.length > 0) {
        lines.push("Tags: " + item.tags.map((t) => "#" + t).join(", "));
      }
      if (item.isFavorite) {
        lines.push("Favorite: true");
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ============================================================================
// IMPORT / PARSING
// ============================================================================

export interface ParsedLinkSection {
  title: string;
  color?: string;
  icon?: string;
  items: ParsedLinkItem[];
}

export interface ParsedLinkItem {
  url: string;
  title: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  color?: string;
}

export interface ParsedLinks {
  title: string;
  sections: ParsedLinkSection[];
}

export function parseMarkdown(content: string): ParsedLinks {
  const result: ParsedLinks = {
    title: "Untitled Links",
    sections: [],
  };

  // Extract title
  const titleMatch = content.match(/^#\s+Links:\s*(.+)$/m) || content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Split by ## sections
  const sectionBlocks = content.split(/^##\s+/m).slice(1);

  for (const block of sectionBlocks) {
    const lines = block.split("\n");
    let sectionTitle = lines[0]?.trim() || "Untitled Section";

    // Extract emoji icon from section title
    let sectionIcon: string | undefined;
    const emojiMatch = sectionTitle.match(/^([\u{1F300}-\u{1F9FF}]\s*)/u);
    if (emojiMatch) {
      sectionIcon = emojiMatch[0].trim();
      sectionTitle = sectionTitle.slice(emojiMatch[0].length).trim();
    }

    const section: ParsedLinkSection = { title: sectionTitle, items: [] };
    if (sectionIcon) section.icon = sectionIcon;

    // Extract color from HTML comment
    const colorMatch = block.match(/<!--\s*color:\s*(#[0-9a-fA-F]{6})\s*-->/);
    if (colorMatch) section.color = colorMatch[1];

    // Parse link lines: - [Title](URL) description
    const linkRegex = /^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/;
    let currentItem: ParsedLinkItem | null = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith("<!--") || trimmedLine.startsWith("_Empty"))
        continue;

      // Check for link line
      const linkMatch = trimmedLine.match(linkRegex);
      if (linkMatch) {
        // Push previous item if exists
        if (currentItem) {
          section.items.push(currentItem);
        }

        const [, linkTitle, url, rest] = linkMatch;
        const description = rest.trim();
        currentItem = {
          url,
          title: linkTitle || url,
          description,
          tags: [],
          isFavorite: false,
        };
        continue;
      }

      // Check for Tags: line (belongs to current item)
      if (currentItem) {
        const tagsMatch = trimmedLine.match(/^Tags?:\s*(.+)$/i);
        if (tagsMatch) {
          const raw = tagsMatch[1];
          const found = raw.match(/#?[\w-]+/g) || [];
          for (const t of found) {
            const clean = t.replace(/^#/, "").trim();
            if (clean) currentItem.tags.push(clean);
          }
          continue;
        }

        const favMatch = trimmedLine.match(/^Favorite:\s*(true|yes|1)/i);
        if (favMatch) {
          currentItem.isFavorite = true;
          continue;
        }

        // Check for item-level color comment
        const itemColorMatch = trimmedLine.match(/<!--\s*color:\s*(#[0-9a-fA-F]{6})\s*-->/);
        if (itemColorMatch) {
          currentItem.color = itemColorMatch[1];
          continue;
        }
      }
    }

    // Push last item
    if (currentItem) {
      section.items.push(currentItem);
    }

    if (section.items.length > 0 || sectionTitle !== "Untitled Section") {
      result.sections.push(section);
    }
  }

  // If no ## sections found, look for flat links in the content
  if (result.sections.length === 0) {
    const flatSection: ParsedLinkSection = { title: "Links", items: [] };
    const linkRegex = /^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/;

    for (const line of content.split("\n")) {
      const trimmedLine = line.trim();
      const linkMatch = trimmedLine.match(linkRegex);
      if (linkMatch) {
        const [, linkTitle, url, rest] = linkMatch;
        flatSection.items.push({
          url,
          title: linkTitle || url,
          description: rest.trim(),
          tags: [],
          isFavorite: false,
        });
      }
    }

    if (flatSection.items.length > 0) {
      result.sections.push(flatSection);
    }
  }

  return result;
}

export function parseJson(content: string): ParsedLinks {
  const data = JSON.parse(content);
  return {
    title: data.title || "Untitled Links",
    sections: (data.sections || []).map((s: any) => ({
      title: s.title || "Untitled",
      color: s.color,
      icon: s.icon,
      items: (s.items || []).map((i: any) => ({
        url: i.url || "",
        title: i.title || i.url || "",
        description: i.description || "",
        tags: i.tags || [],
        isFavorite: i.isFavorite || false,
        color: i.color,
      })),
    })),
  };
}

export function autoDetect(content: string): ParsedLinks {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return parseJson(trimmed);
    } catch {
      // fall through to markdown
    }
  }
  return parseMarkdown(trimmed);
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  stats: { sections: number; links: number };
}

export function validateParsed(parsed: ParsedLinks): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!parsed.title || parsed.title.trim() === "") {
    errors.push("Links title is missing");
  }

  let links = 0;
  for (const section of parsed.sections) {
    if (!section.title) {
      warnings.push('Section has no title, will be named "Untitled"');
    }
    for (const item of section.items) {
      if (!item.url) {
        errors.push(`Link without URL in section "${section.title}"`);
      }
      links++;
    }
  }

  if (parsed.sections.length === 0) {
    warnings.push("No sections found — content will be added as uncategorized");
  }

  if (links === 0) {
    warnings.push("No links found in the imported content");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: { sections: parsed.sections.length, links },
  };
}
