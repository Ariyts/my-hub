import { useState } from "react";
import { useStore } from "../store";
import type { CommandContainer, CommandItem } from "../types";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Copy,
  Edit3,
  Trash2,
  Check,
  Search,
  Star,
  Terminal,
} from "lucide-react";
import { useAutoSync } from "../hooks/useAutoSync";

const LANG_COLORS: Record<string, string> = {
  bash: "#4CAF50",
  zsh: "#4CAF50",
  powershell: "#2196F3",
  cmd: "#FF9800",
  python: "#9C27B0",
  javascript: "#F7DF1E",
};

const LANG_ICONS: Record<string, string> = {
  bash: ">$",
  zsh: ">%",
  powershell: "PS",
  cmd: ">",
  python: "py",
  javascript: "JS",
};

// Syntax highlighting - simple approach
function highlightSyntax(code: string): React.ReactElement {
  const keywords = [
    "git",
    "npm",
    "docker",
    "kubectl",
    "cd",
    "ls",
    "cat",
    "echo",
    "export",
    "import",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "return",
    "sudo",
    "apt",
    "brew",
    "pip",
    "node",
    "python",
  ];

  const parts = code.split(/(\s+|['"][^'"]*['"]|#[^\n]*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return (
            <span key={i} style={{ color: "#c792ea" }}>
              {part}
            </span>
          );
        }
        if (part.startsWith("#")) {
          return (
            <span key={i} style={{ color: "#546e7a" }}>
              {part}
            </span>
          );
        }
        if (/^['"].*['"]$/.test(part)) {
          return (
            <span key={i} style={{ color: "#c3e88d" }}>
              {part}
            </span>
          );
        }
        if (/^--?[a-zA-Z]/.test(part)) {
          return (
            <span key={i} style={{ color: "#ffcb6b" }}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface CommandRowProps {
  item: CommandItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function CommandRow({ item, containerId, isDark, index }: CommandRowProps) {
  const { updateCommandItem, deleteCommandItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });

  const handleCopy = () => {
    navigator.clipboard.writeText(item.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateCommandItem(containerId, item.id, editData);
    setEditing(false);
  };

  const border = isDark ? "#1e293b" : "#e2e8f0";
  const codeBg = isDark ? "#0f172a" : "#f1f5f9";
  const langColor = LANG_COLORS[item.language] || "#64748b";

  if (editing) {
    return (
      <tr style={{ background: isDark ? "#1e293b30" : "#f8fafc" }}>
        <td colSpan={5} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="rounded border px-2 py-1 text-xs outline-none"
                style={{
                  background: isDark ? "#0f172a" : "#fff",
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.language}
                onChange={(e) =>
                  setEditData({ ...editData, language: e.target.value as CommandItem["language"] })
                }
              >
                {["bash", "zsh", "powershell", "cmd", "python", "javascript"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <input
                className="flex-1 rounded-lg border px-3 py-1.5 font-mono text-sm outline-none"
                style={{
                  background: codeBg,
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.command}
                onChange={(e) => setEditData({ ...editData, command: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                style={{
                  background: isDark ? "#0f172a" : "#fff",
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
              <input
                className="w-48 rounded-lg border px-2 py-1.5 text-xs outline-none"
                style={{
                  background: isDark ? "#0f172a" : "#fff",
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.tags.join(", ")}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="tags..."
              />
              <button
                onClick={handleSave}
                className="rounded px-3 py-1.5 text-xs font-medium"
                style={{ background: "#4CAF5020", color: "#4CAF50" }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded px-3 py-1.5 text-xs"
                style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className="group transition-colors hover:bg-slate-500/5"
      style={{ borderBottom: `1px solid ${border}` }}
    >
      {/* Number */}
      <td className="cell-index w-8 px-2 py-2 text-center">
        <span className="font-mono text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
          {index + 1}
        </span>
      </td>

      {/* Language */}
      <td className="w-16 px-2 py-2">
        <span
          className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
          style={{ background: `${langColor}20`, color: langColor }}
        >
          {LANG_ICONS[item.language] || item.language.slice(0, 2).toUpperCase()}
        </span>
      </td>

      {/* Command */}
      <td className="px-2 py-2">
        <div
          className="cursor-pointer rounded px-3 py-1.5 font-mono text-xs transition-colors hover:bg-slate-500/10"
          style={{ background: codeBg, borderLeft: `2px solid ${langColor}` }}
          onClick={handleCopy}
          title={item.description || "Click to copy"}
        >
          {highlightSyntax(item.command)}
        </div>
      </td>

      {/* Description & Tags */}
      <td className="min-w-[150px] px-2 py-2">
        {item.description && (
          <p className="mb-1 truncate text-xs" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
            {item.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded px-1.5 py-0.5 text-[10px]"
              style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Actions */}
      <td className="w-32 px-2 py-2">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() =>
              updateCommandItem(containerId, item.id, { isFavorite: !item.isFavorite })
            }
          >
            <Star
              size={12}
              className={item.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"}
            />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs"
            style={{
              background: copied ? "#4CAF5020" : "transparent",
              color: copied ? "#4CAF50" : "#64748b",
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <button onClick={() => setEditing(true)} className="rounded p-1 hover:bg-slate-500/20">
            <Edit3 size={11} className="text-slate-400" />
          </button>
          <button
            onClick={() => deleteCommandItem(containerId, item.id)}
            className="rounded p-1 hover:bg-red-500/20"
          >
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface ContainerCardProps {
  container: CommandContainer;
  isDark: boolean;
}

function ContainerCard({ container, isDark }: ContainerCardProps) {
  const { deleteCommandContainer, addCommandItem } = useStore();
  const [localExpanded, setLocalExpanded] = useState(container.isExpanded !== false);
  const [searchQ, setSearchQ] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [newCmd, setNewCmd] = useState({
    command: "",
    description: "",
    language: "bash" as CommandItem["language"],
    tags: [] as string[],
    isFavorite: false,
  });

  const filtered = container.subItems.filter(
    (i) =>
      i.command.toLowerCase().includes(searchQ.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQ.toLowerCase()),
  );

  const border = isDark ? "#1e293b" : "#e2e8f0";
  const bg = isDark ? "#111827" : "#ffffff";
  const headBg = isDark ? "#1e293b" : "#f8fafc";

  const handleAddItem = () => {
    if (newCmd.command.trim()) {
      addCommandItem(container.id, newCmd);
      setNewCmd({ command: "", description: "", language: "bash", tags: [], isFavorite: false });
      setAddingItem(false);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: bg, borderColor: border }}
    >
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-2.5"
        style={{ background: headBg }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        {localExpanded ? (
          <ChevronDown size={14} style={{ color: "#2196F3" }} />
        ) : (
          <ChevronRight size={14} style={{ color: "#2196F3" }} />
        )}
        <Terminal size={14} style={{ color: "#2196F3" }} />
        <span className="text-sm font-medium" style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>
          {container.title}
        </span>
        {container.description && (
          <span className="hidden text-xs sm:block" style={{ color: "#64748b" }}>
            {container.description}
          </span>
        )}
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: "#2196F315", color: "#2196F3" }}
        >
          {container.subItems.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete collection?")) deleteCommandContainer(container.id);
          }}
          className="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>

      {localExpanded && (
        <div className="border-t" style={{ borderColor: border }}>
          {/* Toolbar */}
          <div className="flex gap-2 border-b p-3" style={{ borderColor: border }}>
            <div className="relative flex-1">
              <Search
                size={12}
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400"
              />
              <input
                className="w-full rounded-lg border py-1.5 pr-3 pl-7 text-xs outline-none"
                style={{
                  background: isDark ? "#0f172a" : "#f8fafc",
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                placeholder="Search..."
                inputMode="search"
                enterKeyHint="search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button
              onClick={() => setAddingItem(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium"
              style={{ background: "#2196F315", color: "#2196F3" }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {/* Add new command form */}
          {addingItem && (
            <div
              className="border-b p-3"
              style={{ borderColor: "#2196F350", background: "#2196F308" }}
            >
              <div className="mb-2 flex gap-2">
                <select
                  className="rounded border px-2 py-1.5 text-xs outline-none"
                  style={{
                    background: isDark ? "#0f172a" : "#fff",
                    borderColor: border,
                    color: isDark ? "#e2e8f0" : "#1e293b",
                  }}
                  value={newCmd.language}
                  onChange={(e) =>
                    setNewCmd({ ...newCmd, language: e.target.value as CommandItem["language"] })
                  }
                >
                  {["bash", "zsh", "powershell", "cmd", "python", "javascript"].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  className="flex-1 rounded-lg border px-3 py-1.5 font-mono text-xs outline-none"
                  style={{
                    background: isDark ? "#0f172a" : "#f8fafc",
                    borderColor: border,
                    color: isDark ? "#e2e8f0" : "#1e293b",
                  }}
                  placeholder="command..."
                  value={newCmd.command}
                  onChange={(e) => setNewCmd({ ...newCmd, command: e.target.value })}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                    if (e.key === "Escape") setAddingItem(false);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border px-3 py-1.5 text-xs outline-none"
                  style={{
                    background: isDark ? "#0f172a" : "#f8fafc",
                    borderColor: border,
                    color: isDark ? "#e2e8f0" : "#1e293b",
                  }}
                  placeholder="description..."
                  value={newCmd.description}
                  onChange={(e) => setNewCmd({ ...newCmd, description: e.target.value })}
                />
                <button
                  onClick={handleAddItem}
                  className="rounded px-3 py-1 text-xs font-medium"
                  style={{ background: "#2196F315", color: "#2196F3" }}
                >
                  Add
                </button>
                <button
                  onClick={() => setAddingItem(false)}
                  className="rounded px-3 py-1 text-xs"
                  style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Commands table */}
          {filtered.length > 0 ? (
            <table className="table-cards w-full">
              <tbody>
                {filtered.map((item, idx) => (
                  <CommandRow
                    key={item.id}
                    item={item}
                    containerId={container.id}
                    isDark={isDark}
                    index={idx}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-xs" style={{ color: "#94a3b8" }}>
              No commands.{" "}
              <button onClick={() => setAddingItem(true)} className="text-blue-400 hover:underline">
                Add one
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  container: CommandContainer; // ИЗМЕНЕНО: принимаем конкретный контейнер (файл)
}

export function CommandsView({ container }: Props) {
  const { isDarkTheme } = useStore();
  const [search, setSearch] = useState("");

  // Единый автосинк, управляемый тумблером settings.autoSave (Задача 0.E.3)
  useAutoSync(container.id, container.updatedAt);

  const filtered = container.subItems.filter(
    (i) =>
      i.command.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()),
  );

  const bg = isDarkTheme ? "#0f172a" : "#f1f5f9";
  const border = isDarkTheme ? "#1e293b" : "#e2e8f0";

  return (
    <div className="flex h-full flex-col" style={{ background: bg }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-6 py-4"
        style={{ background: isDarkTheme ? "#111827" : "#fff", borderColor: border }}
      >
        <Terminal size={20} style={{ color: "#2196F3" }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? "#e2e8f0" : "#1e293b" }}>
            {container.title}
          </h1>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            {filtered.length} commands
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400" />
          <input
            className="w-48 rounded-lg border py-1.5 pr-3 pl-8 text-sm outline-none"
            style={{
              background: isDarkTheme ? "#1e293b" : "#f8fafc",
              borderColor: border,
              color: isDarkTheme ? "#e2e8f0" : "#1e293b",
            }}
            placeholder="Search commands..."
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div
            className="flex h-64 flex-col items-center justify-center gap-3"
            style={{ color: "#94a3b8" }}
          >
            <Terminal size={48} className="opacity-20" />
            <p className="text-lg font-medium">No commands yet</p>
            <p className="text-sm">Add your first command using the panel below</p>
          </div>
        ) : (
          <ContainerCard container={{ ...container, subItems: filtered }} isDark={isDarkTheme} />
        )}
      </div>
    </div>
  );
}
