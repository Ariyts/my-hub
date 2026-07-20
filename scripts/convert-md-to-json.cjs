const fs = require("fs");
const path = require("path");

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.substring(0, idx).trim();
      let value = line.substring(idx + 1).trim();

      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^["']|["']$/g, ""))
          .filter((v) => v);
      } else if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });
  return { frontmatter, body: match[2] };
}

// Generate deterministic ID from string
function hashId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate ID from path (deterministic)
function genId(prefix, path) {
  return prefix + "_" + hashId(path);
}

// Generate random ID (for items without stored ID)
const genIdLocal = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// Parse commands from markdown body
function parseCommandsFromBody(body) {
  const items = [];
  const sections = body.split(/^### /m).filter((s) => s.trim());

  for (const section of sections) {
    const lines = section.split("\n");
    const itemId = lines[0].trim();

    // Find code block
    const codeMatch = section.match(/```(\w+)\n([\s\S]*?)```/);
    // Find description (italic after code block)
    const descMatch = section.match(/```[\s\S]*?```\s*\n_(.+?)_/);

    if (codeMatch) {
      items.push({
        id: itemId,
        command: codeMatch[2].trim(),
        description: descMatch ? descMatch[1] : "",
        language: codeMatch[1] || "bash",
        tags: [],
        isFavorite: false,
      });
    }
  }

  return items;
}

// ============================================
// NEW: Parse links with sections and metadata
// FIXED: Properly handle uncategorized links
// ============================================
function parseLinksWithSectionsFromBody(body) {
  const sections = [];
  const subItems = [];
  const lines = body.split("\n");

  let currentSection = null;
  let currentSectionId = null; // Track current section ID separately
  let linkOrder = 0;
  let uncategorizedOrder = 0;

  // Track if we've seen an empty line after last section content
  let seenEmptyLineAfterSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Empty line handling
    if (!trimmedLine) {
      // Mark that we've seen an empty line - this could indicate end of section content
      if (currentSectionId) {
        seenEmptyLineAfterSection = true;
      }
      continue;
    }

    // Section header: ## Title
    if (trimmedLine.startsWith("## ")) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }

      let sectionTitle = trimmedLine.slice(3).trim();
      let sectionIcon = undefined;

      // Extract emoji from title
      const emojiMatch = sectionTitle.match(/^([\u{1F300}-\u{1F9FF}]\s*)/u);
      if (emojiMatch) {
        sectionIcon = emojiMatch[0].trim();
        sectionTitle = sectionTitle.slice(emojiMatch[0].length).trim();
      }

      currentSection = {
        id: genIdLocal(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
        icon: sectionIcon,
      };
      currentSectionId = currentSection.id;
      seenEmptyLineAfterSection = false;

      // Check for section metadata on next line: <!-- section: {...} -->
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith("<!-- section:")) {
        const metaMatch = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSectionId = currentSection.id;
            currentSection.order =
              typeof meta.order === "number" ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
            currentSection.color = meta.color;
            currentSection.icon = meta.icon || currentSection.icon;
          } catch {
            // Ignore parse errors
          }
        }
        i++; // Skip metadata line
      }

      linkOrder = 0;
      continue;
    }

    // Link: - [Title](URL) description <!-- link: {...} -->
    if (trimmedLine.startsWith("- [") || trimmedLine.startsWith("-[")) {
      // Extract link metadata
      let linkMeta = {};
      const metaMatch = trimmedLine.match(/<!--\s*link:\s*(\{.*?\})\s*-->/);
      if (metaMatch) {
        try {
          linkMeta = JSON.parse(metaMatch[1]);
        } catch {
          // Ignore parse errors
        }
      }

      // Remove comment for main parsing
      const cleanLine = trimmedLine.replace(/<!--\s*link:.*?-->/, "").trim();

      // Parse Markdown link
      const linkMatch = cleanLine.match(/^-\s*\[([^\]]*)\]\(([^)]+)\)(.*)$/);
      if (linkMatch) {
        const [, title, url, rest] = linkMatch;
        const description = rest.trim() || linkMeta.description || undefined;

        // Determine sectionId:
        // 1. If link has explicit sectionId in metadata, always use it
        // 2. If we've seen empty line after section and link has NO sectionId -> uncategorized
        // 3. Otherwise, use current section
        let linkSectionId = linkMeta.sectionId || undefined;

        if (!linkMeta.sectionId) {
          // No explicit sectionId in metadata
          if (seenEmptyLineAfterSection) {
            // Empty line before this link suggests it's uncategorized
            linkSectionId = undefined;
          } else if (currentSectionId) {
            // We're inside a section without empty line
            linkSectionId = currentSectionId;
          }
        }

        const linkItem = {
          id: linkMeta.id || genIdLocal(),
          url,
          title: title || url,
          description,
          favicon: linkMeta.favicon,
          tags: linkMeta.tags || [],
          isFavorite: linkMeta.isFavorite ?? false,
          order: linkSectionId
            ? (linkMeta.order ?? linkOrder++)
            : (linkMeta.order ?? uncategorizedOrder++),
          sectionId: linkSectionId,
          color: linkMeta.color,
        };

        subItems.push(linkItem);
      }
    }
  }

  // Save last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return { sections, subItems };
}

// ============================================
// FIXED: Parse prompts with sections and metadata
// Preserves section titles, IDs, and sectionId on items
// ============================================
function parsePromptsWithSectionsFromBody(body) {
  const sections = [];
  const subItems = [];
  const lines = body.split("\n");

  let currentSection = null;
  let currentSectionId = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Section header: ## Title
    if (trimmedLine.startsWith("## ")) {
      const sectionTitle = trimmedLine.slice(3).trim();

      currentSection = {
        id: genIdLocal(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
      };
      currentSectionId = currentSection.id;

      // Check for section metadata on next line: <!-- section: {...} -->
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith("<!-- section:")) {
        const metaMatch = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSectionId = currentSection.id;
            currentSection.order =
              typeof meta.order === "number" ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
            currentSection.color = meta.color;
          } catch {
            // Ignore parse errors
          }
        }
        i++; // Skip metadata line
      }

      sections.push(currentSection);
      continue;
    }

    // Prompt header: ### Title
    if (trimmedLine.startsWith("### ")) {
      const promptTitle = trimmedLine.slice(4).trim();

      // Collect all lines until next ### or ## or end
      const promptLines = [];
      let j = i + 1;
      while (j < lines.length) {
        const nextTrimmed = lines[j].trim();
        if (nextTrimmed.startsWith("### ") || nextTrimmed.startsWith("## ")) break;
        promptLines.push(lines[j]);
        j++;
      }

      const promptBlock = promptLines.join("\n");

      // Find description (italic)
      const descMatch = promptBlock.match(/^_(.+?)_/m);
      // Find code block (prompt)
      const codeMatch =
        promptBlock.match(/```\n([\s\S]*?)```/) || promptBlock.match(/```(\w*)\n([\s\S]*?)```/);
      // Find variables
      const varsMatch = promptBlock.match(/\*\*Variables:\*\*\s*(.+)/);
      // Find prompt metadata: <!-- prompt: {...} -->
      let promptMeta = {};
      const metaMatch = promptBlock.match(/<!--\s*prompt:\s*(\{.*?\})\s*-->/);
      if (metaMatch) {
        try {
          promptMeta = JSON.parse(metaMatch[1]);
        } catch {
          // Ignore parse errors
        }
      }

      const promptText = codeMatch ? (codeMatch[2] || codeMatch[1]).trim() : "";

      // Determine sectionId from metadata or current section
      const itemSectionId = promptMeta.sectionId || currentSectionId || undefined;

      const promptItem = {
        id: promptMeta.id || genId("pi", promptTitle),
        title: promptTitle,
        prompt: promptText,
        description: descMatch ? descMatch[1] : "",
        variables: varsMatch ? varsMatch[1].split(",").map((v) => v.trim()) : [],
        tags: promptMeta.tags || [],
        isFavorite: promptMeta.isFavorite ?? false,
        sectionId: itemSectionId,
      };

      subItems.push(promptItem);

      // Skip the lines we already consumed
      i = j - 1;
      continue;
    }
  }

  return { sections, subItems };
}

// ============================================
// NEW: Parse playbooks with sections and metadata
// Preserves section titles, IDs, and sectionId on items
// ============================================
function parsePlaybooksWithSectionsFromBody(body) {
  const sections = [];
  const subItems = [];
  const lines = body.split("\n");

  let currentSection = null;
  let currentSectionId = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Section header: ## Title
    if (trimmedLine.startsWith("## ")) {
      const sectionTitle = trimmedLine.slice(3).trim();

      currentSection = {
        id: genIdLocal(),
        title: sectionTitle,
        order: sections.length,
        collapsed: false,
      };
      currentSectionId = currentSection.id;

      // Check for section metadata on next line: <!-- section: {...} -->
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith("<!-- section:")) {
        const metaMatch = nextLine.match(/<!--\s*section:\s*(\{.*?\})\s*-->/);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            currentSection.id = meta.id || currentSection.id;
            currentSectionId = currentSection.id;
            currentSection.order =
              typeof meta.order === "number" ? meta.order : currentSection.order;
            currentSection.collapsed = meta.collapsed ?? false;
            currentSection.color = meta.color;
          } catch {
            // Ignore parse errors
          }
        }
        i++; // Skip metadata line
      }

      sections.push(currentSection);
      continue;
    }

    // Command header: ### itemId
    if (trimmedLine.startsWith("### ")) {
      const itemId = trimmedLine.slice(4).trim();

      // Collect all lines until next ### or ## or end
      const cmdLines = [];
      let j = i + 1;
      while (j < lines.length) {
        const nextTrimmed = lines[j].trim();
        if (nextTrimmed.startsWith("### ") || nextTrimmed.startsWith("## ")) break;
        cmdLines.push(lines[j]);
        j++;
      }

      const cmdBlock = cmdLines.join("\n");

      // Find code block
      const codeMatch = cmdBlock.match(/```(\w+)\n([\s\S]*?)```/);
      // Find description (italic)
      const descMatch = cmdBlock.match(/_(.+?)_/);
      // Find tags
      const tagsMatch = cmdBlock.match(/\*\*Tags:\*\*\s*(.+)/);
      // Find command metadata: <!-- cmd: {...} -->
      let cmdMeta = {};
      const metaMatch = cmdBlock.match(/<!--\s*cmd:\s*(\{.*?\})\s*-->/);
      if (metaMatch) {
        try {
          cmdMeta = JSON.parse(metaMatch[1]);
        } catch {
          // Ignore parse errors
        }
      }

      // Filter out _null_ descriptions (item had no description, stored as _null_)
      let description = "";
      if (descMatch) {
        const descValue = descMatch[1].trim();
        description = descValue === "null" || descValue === "_null_" ? "" : descValue;
      }

      // Determine sectionId from metadata or current section
      const itemSectionId = cmdMeta.sectionId || currentSectionId || undefined;

      const cmdItem = {
        id: cmdMeta.id || itemId,
        command: codeMatch ? codeMatch[2].trim() : "",
        description: description,
        language: (codeMatch ? codeMatch[1] : cmdMeta.language) || "bash",
        tags: cmdMeta.tags || (tagsMatch ? tagsMatch[1].split(",").map((v) => v.trim()) : []),
        isFavorite: cmdMeta.isFavorite ?? false,
        sectionId: itemSectionId,
        // Прогресс чеклиста (Задача 3.5); pending не сохраняется
        ...(cmdMeta.status ? { status: cmdMeta.status } : {}),
      };

      subItems.push(cmdItem);

      // Skip the lines we already consumed
      i = j - 1;
      continue;
    }
  }

  return { sections, subItems };
}

// Category type icons and colors
const CATEGORY_CONFIG = {
  notes: { icon: "📝", color: "#4CAF50" },
  commands: { icon: "⌘", color: "#2196F3" },
  links: { icon: "🔗", color: "#FF9800" },
  prompts: { icon: "💬", color: "#9C27B0" },
  playbooks: { icon: "📖", color: "#00BCD4" },
};

// Determine type from category name
function getCategoryType(name) {
  const lower = name.toLowerCase();
  if (lower.includes("command")) return "commands";
  if (lower.includes("link")) return "links";
  if (lower.includes("prompt")) return "prompts";
  if (lower.includes("playbook")) return "playbooks";
  return "notes";
}

const result = {
  workspaces: [],
  categories: [],
  folders: [],
  notes: [],
  commands: [],
  links: [],
  prompts: [],
  playbooks: [],
  exportedAt: new Date().toISOString(),
  version: "3.0",
};

// Lookup maps
const workspaceMap = new Map(); // name -> workspace
const categoryMap = new Map(); // workspaceId_name -> category
const folderMap = new Map(); // categoryId_name -> folder

const dataDir = "./data";
const metadataPath = "./data/metadata.json";

// Load metadata if exists (preserves order!)
let metadata = null;
if (fs.existsSync(metadataPath)) {
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    console.log("✅ Loaded metadata.json - preserving categories order!");

    // Use metadata for workspaces, categories, folders (with correct order!)
    if (metadata.workspaces) {
      result.workspaces = metadata.workspaces;
      metadata.workspaces.forEach((ws) => workspaceMap.set(ws.name, ws));
    }
    if (metadata.categories) {
      result.categories = metadata.categories;
      metadata.categories.forEach((cat) => {
        const ws = result.workspaces.find((w) => w.id === cat.workspaceId);
        if (ws) categoryMap.set(`${ws.name}_${cat.name}`, cat);
      });
    }
    if (metadata.folders) {
      result.folders = metadata.folders;
      metadata.folders.forEach((fld) => {
        const cat = result.categories.find((c) => c.id === fld.categoryId);
        if (cat) folderMap.set(`${cat.id}_${fld.name}`, fld);
      });
    }
  } catch {
    console.log("⚠️ Failed to parse metadata.json, will scan folders");
  }
}

if (fs.existsSync(dataDir)) {
  // Get all workspaces (top level directories)
  const workspaceEntries = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "metadata.json");

  for (const wsEntry of workspaceEntries) {
    const wsName = wsEntry.name;
    const wsPath = path.join(dataDir, wsName);

    // Create workspace if not in metadata
    if (!workspaceMap.has(wsName)) {
      const workspace = {
        id: genId("ws", wsName),
        name: wsName,
        icon: "📁",
        color: "#6366f1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      result.workspaces.push(workspace);
      workspaceMap.set(wsName, workspace);
    }
    const workspace = workspaceMap.get(wsName);

    // Get categories for this workspace
    const categoryEntries = fs
      .readdirSync(wsPath, { withFileTypes: true })
      .filter((e) => e.isDirectory());

    for (const catEntry of categoryEntries) {
      const catName = catEntry.name;
      const catPath = path.join(wsPath, catName);
      const baseType = getCategoryType(catName);
      const config = CATEGORY_CONFIG[baseType];

      // Create category if not in metadata
      // IMPORTANT: Directory names use underscores for spaces (e.g., 'New_playbooks' vs 'New playbooks')
      // Try exact match first, then try with underscores replaced by spaces
      const catKey = `${workspace.name}_${catName}`;
      const catKeyWithSpaces = `${workspace.name}_${catName.replace(/_/g, " ")}`;
      const existingCatKey = categoryMap.has(catKey)
        ? catKey
        : categoryMap.has(catKeyWithSpaces)
          ? catKeyWithSpaces
          : null;

      if (!existingCatKey) {
        const category = {
          id: genId("cat", `${wsName}/${catName}`),
          workspaceId: workspace.id,
          // Use the name with spaces (more natural) as the display name
          name: catName.replace(/_/g, " "),
          icon: config ? config.icon : "📁",
          color: config ? config.color : "#6366f1",
          baseType: baseType,
          order: result.categories.filter((c) => c.workspaceId === workspace.id).length,
          isDefault: false,
        };
        result.categories.push(category);
        categoryMap.set(catKey, category);
        // Also register with spaces variant to prevent duplicates
        categoryMap.set(catKeyWithSpaces, category);
      }
      const category = categoryMap.get(existingCatKey || catKey);

      // Get folders for this category
      const folderEntries = fs
        .readdirSync(catPath, { withFileTypes: true })
        .filter((e) => e.isDirectory());

      for (const fldEntry of folderEntries) {
        const fldName = fldEntry.name;
        const fldPath = path.join(catPath, fldName);

        // Create folder if not in metadata
        // IMPORTANT: Directory names use underscores for spaces, same as categories
        const fldKey = `${category.id}_${fldName}`;
        const fldKeyWithSpaces = `${category.id}_${fldName.replace(/_/g, " ")}`;
        const existingFldKey = folderMap.has(fldKey)
          ? fldKey
          : folderMap.has(fldKeyWithSpaces)
            ? fldKeyWithSpaces
            : null;

        if (!existingFldKey) {
          const folder = {
            id: genId("f", `${wsName}/${catName}/${fldName}`),
            categoryId: category.id,
            parentId: null,
            name: fldName.replace(/_/g, " "),
            order: result.folders.filter((f) => f.categoryId === category.id).length,
            isExpanded: true,
            createdAt: new Date().toISOString(),
          };
          result.folders.push(folder);
          folderMap.set(fldKey, folder);
          folderMap.set(fldKeyWithSpaces, folder);
        }
        const folder = folderMap.get(existingFldKey || fldKey);

        // Get notes in this folder
        const noteEntries = fs
          .readdirSync(fldPath, { withFileTypes: true })
          .filter((e) => e.isFile() && e.name.endsWith(".md"));

        for (const noteEntry of noteEntries) {
          const notePath = path.join(fldPath, noteEntry.name);
          const content = fs.readFileSync(notePath, "utf8");
          const { frontmatter, body } = parseFrontmatter(content);

          const title = frontmatter.title || noteEntry.name.replace(".md", "");
          const notePathForId = `${wsName}/${catName}/${fldName}/${noteEntry.name}`;

          if (baseType === "notes") {
            result.notes.push({
              id: frontmatter.id || genId("n", notePathForId),
              folderId: folder.id,
              title,
              content: body.trim(),
              tags: frontmatter.tags || [],
              isFavorite: frontmatter.isFavorite || false,
              order:
                frontmatter.order ?? result.notes.filter((n) => n.folderId === folder.id).length,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "notes",
            });
          } else if (baseType === "commands") {
            const subItems = parseCommandsFromBody(body);
            result.commands.push({
              id: frontmatter.id || genId("cmd", notePathForId),
              folderId: folder.id,
              title,
              description: frontmatter.description || "",
              subItems: subItems.length > 0 ? subItems : frontmatter.subItems || [],
              tags: frontmatter.tags || [],
              order:
                frontmatter.order ?? result.commands.filter((c) => c.folderId === folder.id).length,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "commands",
            });
          } else if (baseType === "links") {
            // Parse links with sections and metadata
            const parsed = parseLinksWithSectionsFromBody(body);
            result.links.push({
              id: frontmatter.id || genId("lnk", notePathForId),
              folderId: folder.id,
              title,
              subItems: parsed.subItems.length > 0 ? parsed.subItems : frontmatter.subItems || [],
              sections: parsed.sections.length > 0 ? parsed.sections : frontmatter.sections || [],
              tags: frontmatter.tags || [],
              order:
                frontmatter.order ?? result.links.filter((l) => l.folderId === folder.id).length,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "links",
            });
          } else if (baseType === "prompts") {
            // FIXED: Parse prompts with sections and metadata
            const parsed = parsePromptsWithSectionsFromBody(body);
            result.prompts.push({
              id: frontmatter.id || genId("prm", notePathForId),
              folderId: folder.id,
              title,
              category: frontmatter.category || "",
              subItems: parsed.subItems.length > 0 ? parsed.subItems : frontmatter.subItems || [],
              sections: parsed.sections.length > 0 ? parsed.sections : frontmatter.sections || [],
              tags: frontmatter.tags || [],
              order:
                frontmatter.order ?? result.prompts.filter((p) => p.folderId === folder.id).length,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "prompts",
            });
          } else if (baseType === "playbooks") {
            // NEW: Parse playbooks with sections and metadata
            const parsed = parsePlaybooksWithSectionsFromBody(body);
            result.playbooks.push({
              id: frontmatter.id || genId("pb", notePathForId),
              folderId: folder.id,
              title,
              description: frontmatter.description || "",
              subItems: parsed.subItems.length > 0 ? parsed.subItems : frontmatter.subItems || [],
              sections: parsed.sections.length > 0 ? parsed.sections : frontmatter.sections || [],
              tags: frontmatter.tags || [],
              order:
                frontmatter.order ??
                result.playbooks.filter((pb) => pb.folderId === folder.id).length,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "playbooks",
            });
          }
        }
      }
    }
  }
}

console.log("Scanned data/ folder:");
console.log("- Workspaces:", result.workspaces.length);
console.log("- Categories:", result.categories.length);
console.log("- Folders:", result.folders.length);
console.log("- Notes:", result.notes.length);
console.log("- Commands:", result.commands.length);
console.log("- Links:", result.links.length);
console.log("- Prompts:", result.prompts.length);
console.log("- Playbooks:", result.playbooks.length);

// Log sections count for debugging
const linksWithSections = result.links.filter((l) => l.sections && l.sections.length > 0);
console.log("- Links with sections:", linksWithSections.length);

const promptsWithSections = result.prompts.filter((p) => p.sections && p.sections.length > 0);
console.log("- Prompts with sections:", promptsWithSections.length);

const playbooksWithSections = result.playbooks.filter(
  (pb) => pb.sections && pb.sections.length > 0,
);
console.log("- Playbooks with sections:", playbooksWithSections.length);

// Log detailed info for debugging
result.links.forEach((link) => {
  console.log(`\nLink container "${link.title}":`);
  console.log(`  - Sections: ${link.sections?.length || 0}`);
  console.log(`  - SubItems: ${link.subItems?.length || 0}`);
  if (link.sections) {
    link.sections.forEach((s) => {
      const count = link.subItems.filter((i) => i.sectionId === s.id).length;
      console.log(`    - Section "${s.title}": ${count} items`);
    });
  }
  const uncategorized = link.subItems.filter((i) => !i.sectionId).length;
  if (uncategorized > 0) {
    console.log(`    - Uncategorized: ${uncategorized} items`);
  }
});

result.prompts.forEach((prompt) => {
  console.log(`\nPrompt container "${prompt.title}":`);
  console.log(`  - Sections: ${prompt.sections?.length || 0}`);
  console.log(`  - SubItems: ${prompt.subItems?.length || 0}`);
  if (prompt.sections) {
    prompt.sections.forEach((s) => {
      const count = prompt.subItems.filter((i) => i.sectionId === s.id).length;
      console.log(`    - Section "${s.title}": ${count} items`);
    });
  }
  const uncategorized = prompt.subItems.filter((i) => !i.sectionId).length;
  if (uncategorized > 0) {
    console.log(`    - Uncategorized: ${uncategorized} items`);
  }
});

result.playbooks.forEach((playbook) => {
  console.log(`\nPlaybook container "${playbook.title}":`);
  console.log(`  - Sections: ${playbook.sections?.length || 0}`);
  console.log(`  - SubItems: ${playbook.subItems?.length || 0}`);
  if (playbook.sections) {
    playbook.sections.forEach((s) => {
      const count = playbook.subItems.filter((i) => i.sectionId === s.id).length;
      console.log(`    - Section "${s.title}": ${count} items`);
    });
  }
  const uncategorized = playbook.subItems.filter((i) => !i.sectionId).length;
  if (uncategorized > 0) {
    console.log(`    - Uncategorized: ${uncategorized} items`);
  }
});

fs.writeFileSync("./src/data.json", JSON.stringify(result, null, 2));
console.log("\nWritten to src/data.json");
