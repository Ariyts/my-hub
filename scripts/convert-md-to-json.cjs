const fs = require("fs");
const path = require("path");

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  
  const frontmatter = {};
  match[1].split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      let key = line.substring(0, idx).trim();
      let value = line.substring(idx + 1).trim();
      
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map(v => v.trim().replace(/^["']|["']$/g, "")).filter(v => v);
      } else if (value === "true") value = true;
      else if (value === "false") value = false;
      else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
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
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate ID from path (deterministic)
function genId(prefix, path) {
  return prefix + "_" + hashId(path);
}

// Category type icons and colors
const CATEGORY_CONFIG = {
  notes: { icon: "📝", color: "#4CAF50" },
  commands: { icon: "⌘", color: "#2196F3" },
  links: { icon: "🔗", color: "#FF9800" },
  prompts: { icon: "💬", color: "#9C27B0" }
};

// Determine type from category name
function getCategoryType(name) {
  const lower = name.toLowerCase();
  if (lower.includes("command")) return "commands";
  if (lower.includes("link")) return "links";
  if (lower.includes("prompt")) return "prompts";
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
  exportedAt: new Date().toISOString(),
  version: "3.0"
};

// Lookup maps
const workspaceMap = new Map();  // name -> workspace
const categoryMap = new Map();   // workspaceId_name -> category
const folderMap = new Map();     // categoryId_name -> folder

const dataDir = "./data";

if (fs.existsSync(dataDir)) {
  // Get all workspaces (top level directories)
  const workspaceEntries = fs.readdirSync(dataDir, { withFileTypes: true })
    .filter(e => e.isDirectory());
  
  for (const wsEntry of workspaceEntries) {
    const wsName = wsEntry.name;
    const wsPath = path.join(dataDir, wsName);
    
    // Create workspace
    const workspace = {
      id: genId("ws", wsName),
      name: wsName,
      icon: "📁",
      color: "#6366f1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    result.workspaces.push(workspace);
    workspaceMap.set(wsName, workspace);
    
    // Get categories for this workspace
    const categoryEntries = fs.readdirSync(wsPath, { withFileTypes: true })
      .filter(e => e.isDirectory());
    
    for (const catEntry of categoryEntries) {
      const catName = catEntry.name;
      const catPath = path.join(wsPath, catName);
      const baseType = getCategoryType(catName);
      const config = CATEGORY_CONFIG[baseType];
      
      // Create category
      const category = {
        id: genId("cat", `${wsName}/${catName}`),
        workspaceId: workspace.id,
        name: catName,
        icon: config.icon,
        color: config.color,
        baseType: baseType,
        order: result.categories.filter(c => c.workspaceId === workspace.id).length,
        isDefault: false
      };
      result.categories.push(category);
      categoryMap.set(`${workspace.id}_${catName}`, category);
      
      // Get folders for this category
      const folderEntries = fs.readdirSync(catPath, { withFileTypes: true })
        .filter(e => e.isDirectory());
      
      for (const fldEntry of folderEntries) {
        const fldName = fldEntry.name;
        const fldPath = path.join(catPath, fldName);
        
        // Create folder
        const folder = {
          id: genId("f", `${wsName}/${catName}/${fldName}`),
          categoryId: category.id,
          parentId: null,
          name: fldName,
          order: result.folders.filter(f => f.categoryId === category.id).length,
          isExpanded: true,
          createdAt: new Date().toISOString()
        };
        result.folders.push(folder);
        folderMap.set(`${category.id}_${fldName}`, folder);
        
        // Get notes in this folder
        const noteEntries = fs.readdirSync(fldPath, { withFileTypes: true })
          .filter(e => e.isFile() && e.name.endsWith(".md"));
        
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
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "notes"
            });
          } else if (baseType === "commands") {
            result.commands.push({
              id: frontmatter.id || genId("cmd"),
              folderId: folder.id,
              title,
              description: frontmatter.description || "",
              subItems: frontmatter.subItems || [],
              tags: frontmatter.tags || [],
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "commands"
            });
          } else if (baseType === "links") {
            result.links.push({
              id: frontmatter.id || genId("lnk"),
              folderId: folder.id,
              title,
              subItems: frontmatter.subItems || [],
              tags: frontmatter.tags || [],
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "links"
            });
          } else if (baseType === "prompts") {
            result.prompts.push({
              id: frontmatter.id || genId("prm"),
              folderId: folder.id,
              title,
              category: frontmatter.category || "",
              subItems: frontmatter.subItems || [],
              tags: frontmatter.tags || [],
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "prompts"
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

fs.writeFileSync("./src/data.json", JSON.stringify(result, null, 2));
console.log("Written to src/data.json");
