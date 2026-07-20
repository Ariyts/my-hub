import type {
  PlaybookContainer,
  PlaybookItem,
  PlaybookLanguage,
  PlaybookVariable,
} from "../types";

/**
 * Markdown Import/Export utilities.
 *
 * Format:
 *   # Playbook: <title>
 *
 *   ## Section Name
 *   <!-- color: #hex -->
 *
 *   Description line (optional)
 *   ```bash
 *   command here
 *   ```
 *   Tags: #tag1, #tag2
 */

// ============================================================================
// EXPORT
// ============================================================================

export function generateMarkdownTemplate(title: string): string {
  return `# Playbook: ${title}

<!-- 
  INSTRUCTIONS FOR AI:
  - Replace this content with pentest commands organized by sections
  - Each section starts with ## Section Name
  - Each command is a code block with language tag (\`\`\`bash, \`\`\`python, etc)
  - Add description BEFORE the code block
  - Add tags AFTER the code block as "Tags: #tag1, #tag2"
  - Use $TARGET, $PORTS, $USER etc for placeholders
  - Keep commands practical and ready to execute
  
  Supported languages: bash, zsh, powershell, cmd, python, javascript, sql, yaml, nginx
-->

## Recon & Enumeration

Initial service fingerprinting and port scanning.

\`\`\`bash
nmap -sV -sC -p $PORTS $TARGET
\`\`\`
Tags: #nmap, #scan

## Exploitation

Automated exploitation commands.

\`\`\`bash
sqlmap -u 'http://$TARGET/page?id=1' --batch --dbs --risk=3
\`\`\`
Tags: #sqlmap, #sqli

## Post-Exploitation

Privilege escalation and persistence.

\`\`\`bash
# Add your commands here
\`\`\`
`;
}

/** Одна команда в markdown-формате (тот же, что понимает импорт). */
function pushItem(lines: string[], item: PlaybookItem): void {
  if (item.description) {
    lines.push(item.description);
    lines.push("");
  }
  lines.push("```" + (item.language || "bash"));
  lines.push(item.command);
  lines.push("```");
  if (item.tags && item.tags.length > 0) {
    lines.push("Tags: " + item.tags.map((t) => "#" + t).join(", "));
  }
  if (item.isFavorite) {
    lines.push("Favorite: true");
  }
  lines.push("");
}

/** Блок переменных `<!-- Variables: ... -->`. */
function pushVariables(lines: string[], variables: PlaybookVariable[]): void {
  if (variables.length === 0) return;
  lines.push("<!-- Variables:");
  for (const v of variables) {
    const desc = v.description ? ` — ${v.description}` : "";
    lines.push(`  $${v.name} = ${v.value}${desc}`);
  }
  lines.push("-->");
  lines.push("");
}

/** Команды секции в порядке отображения. */
function itemsOfSection(playbook: PlaybookContainer, sectionId: string): PlaybookItem[] {
  return playbook.subItems
    .filter((i) => i.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Экспорт одной секции — самодостаточный markdown, который можно
 * импортировать обратно (в режиме append) как отдельную секцию (Задача 3.6).
 * Переменные включаются только те, что реально встречаются в командах секции.
 */
export function generateSectionExport(
  playbook: PlaybookContainer,
  sectionId: string,
): string {
  const section = (playbook.sections || []).find((s) => s.id === sectionId);
  if (!section) return "";

  const items = itemsOfSection(playbook, sectionId);
  const lines: string[] = [];
  lines.push(`# Playbook: ${playbook.title} — ${section.title}`);
  lines.push("");

  const haystack = items.map((i) => i.command).join("\n");
  const used = (playbook.variables || []).filter((v) =>
    new RegExp(`\\$\\{${v.name}\\}|\\$${v.name}\\b`).test(haystack),
  );
  pushVariables(lines, used);

  lines.push(`## ${section.title}`);
  if (section.color) lines.push(`<!-- color: ${section.color} -->`);
  lines.push("");

  if (items.length === 0) {
    lines.push("_Empty section._");
    lines.push("");
  } else {
    for (const item of items) pushItem(lines, item);
  }

  return lines.join("\n");
}

/** Экспорт одной команды как markdown-фрагмента (вставить в заметку/чат). */
export function generateItemExport(item: PlaybookItem): string {
  const lines: string[] = [];
  pushItem(lines, item);
  return lines.join("\n").trimEnd();
}

export function generateFullExport(playbook: PlaybookContainer): string {
  const lines: string[] = [];
  lines.push(`# Playbook: ${playbook.title}`);
  lines.push("");

  // Variables (if any)
  pushVariables(lines, playbook.variables || []);

  // Sections
  const sections = [...(playbook.sections || [])].sort((a, b) => a.order - b.order);

  if (sections.length === 0) {
    lines.push("_No sections yet._");
    return lines.join("\n");
  }

  for (const section of sections) {
    lines.push(`## ${section.title}`);
    if (section.color) {
      lines.push(`<!-- color: ${section.color} -->`);
    }
    lines.push("");

    const items = itemsOfSection(playbook, section.id);

    if (items.length === 0) {
      lines.push("_Empty section._");
      lines.push("");
      continue;
    }

    for (const item of items) pushItem(lines, item);
  }

  // Uncategorized
  const uncategorized = playbook.subItems.filter((i) => !i.sectionId);
  if (uncategorized.length > 0) {
    lines.push("## Uncategorized");
    lines.push("");
    for (const item of uncategorized) pushItem(lines, item);
  }

  return lines.join("\n");
}

// ============================================================================
// IMPORT / PARSING
// ============================================================================

export interface ParsedSection {
  title: string;
  color?: string;
  items: ParsedItem[];
}

export interface ParsedItem {
  command: string;
  language: PlaybookLanguage;
  description: string;
  tags: string[];
  isFavorite: boolean;
}

export interface ParsedPlaybook {
  title: string;
  sections: ParsedSection[];
  variables?: { name: string; value: string; description?: string }[];
}

const SUPPORTED_LANGS: PlaybookLanguage[] = [
  "bash",
  "zsh",
  "powershell",
  "cmd",
  "python",
  "javascript",
  "sql",
  "yaml",
  "nginx",
];

function isSupportedLang(s: string): s is PlaybookLanguage {
  return (SUPPORTED_LANGS as string[]).includes(s.toLowerCase());
}

export function parseMarkdown(content: string): ParsedPlaybook {
  const result: ParsedPlaybook = {
    title: "Untitled Playbook",
    sections: [],
  };

  // Extract title
  const titleMatch = content.match(/^#\s+Playbook:\s*(.+)$/m) || content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Extract variables from HTML comment
  const varsComment = content.match(/<!--\s*Variables:\s*([\s\S]*?)-->/);
  if (varsComment) {
    result.variables = [];
    const varsLines = varsComment[1].split("\n");
    for (const line of varsLines) {
      const m = line.match(/\s*\$(\w+)\s*=\s*(.+?)(?:\s*—\s*(.+))?$/);
      if (m) {
        result.variables.push({
          name: m[1],
          value: m[2].trim(),
          description: m[3]?.trim(),
        });
      }
    }
  }

  // Split by ## sections
  const sectionBlocks = content.split(/^##\s+/m).slice(1); // remove preamble before first ##

  for (const block of sectionBlocks) {
    const lines = block.split("\n");
    const sectionTitle = lines[0]?.trim() || "Untitled Section";
    const section: ParsedSection = { title: sectionTitle, items: [] };

    // Extract color from HTML comment
    const colorMatch = block.match(/<!--\s*color:\s*(#[0-9a-fA-F]{6})\s*-->/);
    if (colorMatch) section.color = colorMatch[1];

    // Extract code blocks with surrounding context
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(block)) !== null) {
      const langRaw = (match[1] || "bash").toLowerCase();
      const language: PlaybookLanguage = isSupportedLang(langRaw) ? langRaw : "bash";
      const rawCode = match[2].trim();

      if (!rawCode) continue;

      const blockStart = match.index;
      const blockEnd = match.index + match[0].length;

      // Text BEFORE the code block (between previous code block or section start)
      const before = block.slice(0, blockStart);
      const afterPrevBlock = before.split("```").pop() || "";
      // Strip HTML comments, section title line, and clean up
      const description = afterPrevBlock
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/^#+\s+.*$/gm, "")
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(" ")
        .trim();

      // Text AFTER the code block — look for Tags: and Favorite:
      const after = block.slice(blockEnd);
      const afterLines = after.split("\n").slice(0, 5);

      const tags: string[] = [];
      let isFavorite = false;

      for (const line of afterLines) {
        const tagsMatch = line.match(/^Tags?:\s*(.+)$/i);
        if (tagsMatch) {
          const raw = tagsMatch[1];
          const found = raw.match(/#?[\w-]+/g) || [];
          for (const t of found) {
            const clean = t.replace(/^#/, "").trim();
            if (clean) tags.push(clean);
          }
        }
        const favMatch = line.match(/^Favorite:\s*(true|yes|1)/i);
        if (favMatch) isFavorite = true;
        if (line.startsWith("```") || line.startsWith("## ")) break;
      }

      // ====================================================================
      // SPLIT MULTI-LINE CODE BLOCKS INTO SEPARATE COMMANDS
      // ====================================================================
      // Each non-empty, non-comment line becomes its own command.
      // If the first line is a "# comment", use it as description for ALL commands in the block.
      const codeLines = rawCode.split("\n");
      let blockInlineDesc = "";
      let startIndex = 0;

      if (codeLines.length > 0 && codeLines[0].trim().startsWith("#")) {
        blockInlineDesc = codeLines[0].trim().replace(/^#\s*/, "");
        startIndex = 1;
      }

      const commandsInBlock: string[] = [];
      for (let i = startIndex; i < codeLines.length; i++) {
        const line = codeLines[i].trim();
        // Skip empty lines and pure comment lines
        if (!line) continue;
        if (line.startsWith("#")) continue;
        commandsInBlock.push(codeLines[i]);
      }

      // If no commands found (only comments), skip the block
      if (commandsInBlock.length === 0) continue;

      // Create one item per command line
      const baseDescription = description || blockInlineDesc;
      commandsInBlock.forEach((cmd, idx) => {
        section.items.push({
          command: cmd,
          language,
          // Only the first command gets the description (it applies to the block)
          description: idx === 0 ? baseDescription : "",
          tags: idx === 0 ? tags : [...tags], // first gets the tags, rest get copies
          isFavorite: idx === 0 ? isFavorite : false,
        });
      });
    }

    if (section.items.length > 0 || sectionTitle !== "Untitled Section") {
      result.sections.push(section);
    }
  }

  return result;
}

export function parseJson(content: string): ParsedPlaybook {
  const data = JSON.parse(content);
  return {
    title: data.title || "Untitled Playbook",
    sections: (data.sections || []).map((s: any) => ({
      title: s.title || "Untitled",
      color: s.color,
      items: (s.items || []).map((i: any) => ({
        command: i.command || "",
        language: (i.language as PlaybookLanguage) || "bash",
        description: i.description || "",
        tags: i.tags || [],
        isFavorite: i.isFavorite || false,
      })),
    })),
    variables: data.variables,
  };
}

export function autoDetect(content: string): ParsedPlaybook {
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
  stats: { sections: number; commands: number };
}

export function validateParsed(parsed: ParsedPlaybook): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!parsed.title || parsed.title.trim() === "") {
    errors.push("Playbook title is missing");
  }

  let commands = 0;
  for (const section of parsed.sections) {
    if (!section.title) {
      warnings.push('Section has no title, will be named "Untitled"');
    }
    for (const item of section.items) {
      if (!item.command) {
        errors.push(`Empty command in section "${section.title}"`);
      }
      commands++;
    }
  }

  if (parsed.sections.length === 0) {
    warnings.push("No sections found — content will be added as uncategorized");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: { sections: parsed.sections.length, commands },
  };
}
