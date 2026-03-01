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

// Sanitize for matching
function sanitize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "_");
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

// Load metadata if exists
if (fs.existsSync("metadata.json")) {
  try {
    const metadata = JSON.parse(fs.readFileSync("metadata.json", "utf8"));
    result.workspaces = metadata.workspaces || [];
    result.categories = metadata.categories || [];
    result.folders = metadata.folders || [];
    console.log("Loaded metadata:", result.workspaces.length, "workspaces,", result.categories.length, "categories,", result.folders.length, "folders");
  } catch (e) {
    console.error("Failed to parse metadata.json:", e);
  }
}

// Build lookup maps from metadata
const workspaceMap = new Map();
const categoryMap = new Map();
const folderMap = new Map();

result.workspaces.forEach(w => workspaceMap.set(sanitize(w.name), w));
result.categories.forEach(c => categoryMap.set(sanitize(c.name), c));
result.folders.forEach(f => folderMap.set(sanitize(f.name), f));

// Process MD files
const dataDir = "./data";
if (fs.existsSync(dataDir)) {
  function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const { frontmatter, body } = parseFrontmatter(content);
        
        const relativePath = path.relative(dataDir, fullPath);
        const parts = relativePath.split(path.sep);
        
        if (parts.length >= 4) {
          const wsName = parts[0];
          const catName = parts[1];
          const folderName = parts[2];
          
          // Find or create workspace
          let workspace = workspaceMap.get(sanitize(wsName));
          if (!workspace) {
            workspace = {
              id: "ws_" + Math.random().toString(36).substr(2, 9),
              name: wsName,
              icon: "📁",
              color: "#6366f1",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            result.workspaces.push(workspace);
            workspaceMap.set(sanitize(wsName), workspace);
          }
          
          // Determine type from category name
          const type = catName.toLowerCase().includes("command") ? "commands" :
                      catName.toLowerCase().includes("link") ? "links" :
                      catName.toLowerCase().includes("prompt") ? "prompts" : "notes";
          
          // Find or create category
          let category = result.categories.find(c => 
            c.workspaceId === workspace.id && sanitize(c.name) === sanitize(catName)
          );
          if (!category) {
            category = {
              id: "cat_" + Math.random().toString(36).substr(2, 9),
              workspaceId: workspace.id,
              name: catName,
              icon: type === "notes" ? "📝" : type === "commands" ? "⌘" : type === "links" ? "🔗" : "💬",
              color: "#6366f1",
              baseType: type,
              order: result.categories.filter(c => c.workspaceId === workspace.id).length,
              isDefault: false
            };
            result.categories.push(category);
          }
          
          // Find or create folder
          let folder = result.folders.find(f => 
            f.categoryId === category.id && sanitize(f.name) === sanitize(folderName)
          );
          if (!folder) {
            folder = {
              id: "f_" + Math.random().toString(36).substr(2, 9),
              categoryId: category.id,
              parentId: null,
              name: folderName,
              order: result.folders.filter(f => f.categoryId === category.id).length,
              isExpanded: true,
              createdAt: new Date().toISOString()
            };
            result.folders.push(folder);
          }
          
          const title = frontmatter.title || entry.name.replace(".md", "");
          
          if (type === "notes") {
            result.notes.push({
              id: frontmatter.id || "n_" + Math.random().toString(36).substr(2, 9),
              folderId: folder.id,
              title,
              content: body.trim(),
              tags: frontmatter.tags || [],
              isFavorite: frontmatter.isFavorite || false,
              createdAt: frontmatter.createdAt || new Date().toISOString(),
              updatedAt: frontmatter.updatedAt || new Date().toISOString(),
              type: "notes"
            });
          }
        }
      }
    }
  }
  
  processDir(dataDir);
}

console.log("Converted:", result.notes.length, "notes,", result.commands.length, "commands,", result.links.length, "links,", result.prompts.length, "prompts");

fs.writeFileSync("./src/data.json", JSON.stringify(result, null, 2));
console.log("Written to src/data.json");
