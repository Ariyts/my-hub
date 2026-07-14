import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useStore } from "../store";
import type { PromptContainer, PromptItem, PromptSection } from "../types";
import {
  Plus,
  Search,
  Copy,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Star,
  Check,
  Variable,
  X,
  FolderPlus,
  Palette,
} from "lucide-react";

// Predefined color palette for sections
const SECTION_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

// Strip markdown storage metadata from display text
function stripMdMetadata(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!--\s*(section|cmd|prompt):\s*\{.*?\}\s*-->/g, "")
    .replace(/_null_/g, "")
    .trim();
}

// ============================================
// INLINE ADD SECTION COMPONENT
// ============================================
interface InlineAddSectionProps {
  isDark: boolean;
  onAdd: (title: string) => void;
  onClose: () => void;
}

function InlineAddSection({ isDark, onAdd, onClose }: InlineAddSectionProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") onClose();
  };

  const borderColor = isDark ? "#374151" : "#e5e7eb";
  const inputBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <div
      className="animate-in fade-in flex items-center gap-2 rounded-xl border-2 border-dashed px-4 py-2 duration-150"
      style={{ background: isDark ? "#1e293b" : "#f8fafc", borderColor: "#9C27B0" }}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim()) onClose();
      }}
    >
      <MessageSquare size={14} style={{ color: "#9C27B0" }} />
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Section title..."
        className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:border-purple-400"
        style={{ background: inputBg, borderColor, color: isDark ? "#e2e8f0" : "#1e293b" }}
      />
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="rounded p-1 transition-colors hover:bg-green-500/20 disabled:opacity-50"
          title="Create section (Enter)"
        >
          <Check size={14} className="text-green-400" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="rounded p-1 transition-colors hover:bg-red-500/20"
          title="Cancel (Esc)"
        >
          <X size={14} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// PROMPT ROW COMPONENT
// ============================================
interface PromptRowProps {
  item: PromptItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function PromptRow({ item, containerId, isDark, index }: PromptRowProps) {
  const { updatePromptItem, deletePromptItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [showVars, setShowVars] = useState(false);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  // Clean metadata from display values
  const displayPrompt = stripMdMetadata(item.prompt);
  const displayDescription = item.description ? stripMdMetadata(item.description) : undefined;

  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{([^}]+)\}\}/g) || [];
    return [...new Set(matches)];
  };

  const variables = extractVariables(displayPrompt);

  const handleCopy = () => {
    let text = displayPrompt;
    variables.forEach((v) => {
      const key = v.replace(/\{\{|\}\}/g, "");
      if (varValues[key])
        text = text.replace(new RegExp(v.replace(/[{}]/g, "\\$&"), "g"), varValues[key]);
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const vars = extractVariables(editData.prompt);
    updatePromptItem(containerId, item.id, { ...editData, variables: vars });
    setEditing(false);
  };

  const border = isDark ? "#1e293b" : "#e2e8f0";
  const bg = isDark ? "#0f172a" : "#f8fafc";
  const codeBg = isDark ? "#1e1e2e" : "#f0f4f8";

  if (editing) {
    return (
      <tr style={{ background: isDark ? "#1e293b30" : "#f8fafc" }}>
        <td colSpan={6} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                style={{
                  background: bg,
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title..."
                autoFocus
              />
              <input
                className="w-40 rounded-lg border px-3 py-1.5 text-xs outline-none"
                style={{
                  background: bg,
                  borderColor: border,
                  color: isDark ? "#e2e8f0" : "#1e293b",
                }}
                value={editData.description || ""}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
            </div>
            <textarea
              className="w-full resize-none rounded-lg border px-3 py-2 font-mono text-xs outline-none"
              style={{
                background: codeBg,
                borderColor: border,
                color: isDark ? "#c4b5fd" : "#6b21a8",
                minHeight: "80px",
              }}
              value={editData.prompt}
              onChange={(e) => setEditData({ ...editData, prompt: e.target.value })}
              placeholder="Prompt... Use {{variable}} for variables"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="rounded px-3 py-1 text-xs font-medium"
                style={{ background: "#9C27B015", color: "#9C27B0" }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded px-3 py-1 text-xs"
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
    <>
      <tr
        className="group transition-colors hover:bg-purple-500/5"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <td className="w-8 px-2 py-2 text-center">
          <span className="font-mono text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
            {index + 1}
          </span>
        </td>
        <td className="min-w-[150px] px-2 py-2">
          <div className="flex items-center gap-2">
            <span
              className="truncate text-sm font-medium"
              style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
            >
              {item.title}
            </span>
            {item.isFavorite && (
              <Star size={10} className="flex-shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          {displayDescription && (
            <p className="mt-0.5 truncate text-[11px]" style={{ color: "#94a3b8" }}>
              {displayDescription}
            </p>
          )}
        </td>
        <td className="min-w-[250px] px-2 py-2">
          <div
            className="cursor-pointer truncate rounded px-3 py-1.5 font-mono text-xs hover:bg-purple-500/10"
            style={{ background: codeBg, color: isDark ? "#c4b5fd" : "#7c3aed", maxWidth: "300px" }}
            onClick={handleCopy}
            title="Click to copy"
          >
            {displayPrompt.length > 60 ? displayPrompt.slice(0, 60) + "..." : displayPrompt}
          </div>
        </td>
        <td className="hidden w-32 px-2 py-2 md:table-cell">
          {variables.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {variables.slice(0, 3).map((v) => (
                <span
                  key={v}
                  className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                  style={{ background: "#9C27B015", color: "#9C27B0" }}
                >
                  {v.replace(/\{\{|\}\}/g, "")}
                </span>
              ))}
              {variables.length > 3 && (
                <span className="text-[10px]" style={{ color: "#94a3b8" }}>
                  +{variables.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px]" style={{ color: "#64748b" }}>
              &mdash;
            </span>
          )}
        </td>
        <td className="hidden px-2 py-2 lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[10px]"
                style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </td>
        <td className="w-36 px-2 py-2">
          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {variables.length > 0 && (
              <button
                onClick={() => setShowVars(!showVars)}
                className="rounded p-1"
                style={{ background: showVars ? "#9C27B020" : "transparent" }}
              >
                <Variable size={11} style={{ color: showVars ? "#9C27B0" : "#64748b" }} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs"
              style={{
                background: copied ? "#4CAF5020" : "#9C27B015",
                color: copied ? "#4CAF50" : "#9C27B0",
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <button onClick={() => setEditing(true)} className="rounded p-1 hover:bg-slate-500/20">
              <Edit3 size={11} className="text-slate-400" />
            </button>
            <button
              onClick={() => deletePromptItem(containerId, item.id)}
              className="rounded p-1 hover:bg-red-500/20"
            >
              <Trash2 size={11} className="text-red-400" />
            </button>
          </div>
        </td>
      </tr>
      {showVars && variables.length > 0 && (
        <tr style={{ background: isDark ? "#1e1b4b30" : "#faf5ff" }}>
          <td colSpan={6} className="px-4 py-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: "#9C27B0" }}>
                  Variables:
                </span>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {variables.map((v) => {
                  const key = v.replace(/\{\{|\}\}/g, "");
                  return (
                    <div key={v} className="flex items-center gap-2">
                      <span
                        className="w-16 truncate font-mono text-[10px]"
                        style={{ color: "#9C27B0" }}
                      >
                        {key}
                      </span>
                      <input
                        className="flex-1 rounded border px-2 py-1 text-xs outline-none"
                        style={{
                          background: isDark ? "#0f172a" : "#fff",
                          borderColor: "#9C27B050",
                          color: isDark ? "#e2e8f0" : "#1e293b",
                        }}
                        value={varValues[key] || ""}
                        onChange={(e) => setVarValues({ ...varValues, [key]: e.target.value })}
                        placeholder="..."
                      />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setShowVars(false)} className="p-1">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ============================================
// PROMPT SECTION CARD COMPONENT
// ============================================
interface PromptSectionCardProps {
  section: PromptSection;
  items: PromptItem[];
  containerId: string;
  isDark: boolean;
  onToggleCollapse: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onColorSection: (sectionId: string) => void;
  onAddItem: (sectionId: string) => void;
}

function PromptSectionCard({
  section,
  items,
  containerId,
  isDark,
  onToggleCollapse,
  onEditSection,
  onDeleteSection,
  onColorSection,
  onAddItem,
}: PromptSectionCardProps) {
  const isCollapsed = section.collapsed ?? false;
  const border = isDark ? "#1e293b" : "#e2e8f0";
  const bg = isDark ? "#111827" : "#ffffff";
  const headerBg = isDark ? "#1e293b" : "#f8fafc";

  return (
    <div
      className="group overflow-hidden rounded-xl border transition-all duration-200"
      style={{ borderColor: border }}
    >
      {/* Section Header */}
      <div
        className="flex cursor-pointer items-center gap-2 px-4 py-2"
        style={{ background: headerBg }}
        onClick={() => onToggleCollapse(section.id)}
      >
        <button
          className="rounded p-0.5 hover:bg-slate-500/20"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(section.id);
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={14} style={{ color: section.color || "#9C27B0" }} />
          ) : (
            <ChevronDown size={14} style={{ color: section.color || "#9C27B0" }} />
          )}
        </button>
        {section.color && (
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ background: section.color }}
          />
        )}
        <MessageSquare size={14} style={{ color: section.color || "#9C27B0" }} />
        <span
          className="flex-1 text-sm font-medium"
          style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
        >
          {section.title}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: section.color ? `${section.color}20` : "#9C27B015",
            color: section.color || "#9C27B0",
          }}
        >
          {items.length}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onColorSection(section.id);
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-slate-500/20"
            title="Change color"
          >
            <Palette size={14} style={{ color: section.color || "#64748b" }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditSection(section.id);
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-purple-500/20"
            title="Rename section"
          >
            <Edit3 size={14} style={{ color: "#9C27B0" }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection(section.id);
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-red-500/20"
            title="Delete section"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(section.id);
          }}
          className="rounded p-1 hover:bg-purple-500/20"
          title="Add prompt to this section"
        >
          <Plus size={14} style={{ color: "#9C27B0" }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="border-t" style={{ borderColor: border, background: bg }}>
          {items.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr
                  className="text-[10px] tracking-wider uppercase"
                  style={{ color: "#64748b", background: isDark ? "#1e293b50" : "#f8fafc" }}
                >
                  <th className="w-8 px-2 py-1.5 text-center">#</th>
                  <th className="px-2 py-1.5 text-left">Title</th>
                  <th className="px-2 py-1.5 text-left">Prompt</th>
                  <th className="hidden px-2 py-1.5 text-left md:table-cell">Vars</th>
                  <th className="hidden px-2 py-1.5 text-left lg:table-cell">Tags</th>
                  <th className="w-36 px-2 py-1.5"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <PromptRow
                    key={item.id}
                    item={item}
                    containerId={containerId}
                    isDark={isDark}
                    index={idx}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="m-3 cursor-pointer rounded-lg border-2 border-dashed py-6 text-center text-xs transition-colors hover:border-purple-400"
              style={{ color: "#94a3b8", borderColor: "transparent" }}
              onClick={() => onAddItem(section.id)}
            >
              Click to add a prompt
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// INLINE ADD PROMPT FORM (for specific section)
// ============================================
interface InlineAddPromptProps {
  isDark: boolean;
  onAdd: (data: {
    title: string;
    prompt: string;
    description?: string;
    tags: string[];
    isFavorite: boolean;
    variables: string[];
    sectionId?: string;
  }) => void;
  onClose: () => void;
  sectionId?: string;
}

function InlineAddPrompt({ isDark, onAdd, onClose, sectionId }: InlineAddPromptProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (title.trim() && prompt.trim()) {
      const vars = prompt.match(/\{\{([^}]+)\}\}/g) || [];
      onAdd({
        title: title.trim(),
        prompt: prompt.trim(),
        description: description.trim() || undefined,
        tags: [],
        isFavorite: false,
        variables: [...new Set(vars)],
        sectionId,
      });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") onClose();
  };

  const border = isDark ? "#374151" : "#e5e7eb";
  const bg = isDark ? "#0f172a" : "#ffffff";
  const codeBg = isDark ? "#1e1e2e" : "#f0f4f8";

  return (
    <div
      className="animate-in fade-in space-y-2 rounded-xl border-2 border-dashed p-4 duration-150"
      style={{ borderColor: "#9C27B0", background: "#9C27B008" }}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim() && !prompt.trim())
          onClose();
      }}
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
          style={{ background: bg, borderColor: border, color: isDark ? "#e2e8f0" : "#1e293b" }}
          placeholder="Prompt title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-48 rounded-lg border px-3 py-1.5 text-xs outline-none"
          style={{ background: bg, borderColor: border, color: isDark ? "#e2e8f0" : "#1e293b" }}
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <textarea
        className="w-full resize-none rounded-lg border px-3 py-2 font-mono text-xs outline-none"
        style={{
          background: codeBg,
          borderColor: border,
          color: isDark ? "#c4b5fd" : "#6b21a8",
          minHeight: "60px",
        }}
        placeholder="Prompt text... Use {{variable}} for dynamic values. Ctrl+Enter to add."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          disabled={!title.trim() || !prompt.trim()}
          className="rounded px-3 py-1 text-xs font-medium disabled:opacity-50"
          style={{ background: "#9C27B015", color: "#9C27B0" }}
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="rounded px-3 py-1 text-xs"
          style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN PROMPTS VIEW
// ============================================
interface Props {
  container: PromptContainer;
}

export function PromptsView({ container }: Props) {
  const { isDarkTheme, addPromptItem, addPromptSection, updatePromptSection, deletePromptSection } =
    useStore();

  const [search, setSearch] = useState("");
  const [addingSection, setAddingSection] = useState(false);
  const [addingToSection, setAddingToSection] = useState<string | undefined>(undefined);

  // Sections sorted by order
  const sections: PromptSection[] = useMemo(() => {
    return [...(container.sections || [])].sort((a, b) => a.order - b.order);
  }, [container.sections]);

  // Get items for a specific section
  const getItemsForSection = useCallback(
    (sectionId: string) => {
      return container.subItems.filter((i) => i.sectionId === sectionId);
    },
    [container.subItems],
  );

  // Items without section (uncategorized)
  const uncategorizedItems = useMemo(() => {
    return container.subItems.filter((i) => !i.sectionId);
  }, [container.subItems]);

  // Filtered items (global search)
  const filteredUncategorized = useMemo(() => {
    if (!search) return uncategorizedItems;
    return uncategorizedItems.filter(
      (i) =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.prompt.toLowerCase().includes(search.toLowerCase()),
    );
  }, [uncategorizedItems, search]);

  const bg = isDarkTheme ? "#0f172a" : "#f1f5f9";
  const border = isDarkTheme ? "#1e293b" : "#e2e8f0";

  // Section handlers
  const handleToggleCollapse = (sectionId: string) => {
    updatePromptSection(container.id, sectionId, {
      collapsed: !sections.find((s) => s.id === sectionId)?.collapsed,
    });
  };

  const handleEditSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newTitle = prompt("Section title:", section.title);
    if (newTitle && newTitle.trim()) {
      updatePromptSection(container.id, sectionId, { title: newTitle.trim() });
    }
  };

  const handleColorSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const currentIndex = SECTION_COLORS.indexOf(section.color || "");
    const nextIndex = (currentIndex + 1) % SECTION_COLORS.length;
    updatePromptSection(container.id, sectionId, { color: SECTION_COLORS[nextIndex] });
  };

  const handleDeleteSection = (sectionId: string) => {
    const itemsInSection = container.subItems.filter((i) => i.sectionId === sectionId);
    if (itemsInSection.length > 0) {
      const result = window.confirm(
        `This section has ${itemsInSection.length} prompt(s). Delete section and all its prompts?`,
      );
      if (result) {
        // Delete all items in section + the section itself
        const newSubItems = container.subItems.filter((i) => i.sectionId !== sectionId);
        const { updatePromptContainer } = useStore.getState();
        updatePromptContainer(container.id, { subItems: newSubItems });
        deletePromptSection(container.id, sectionId);
      }
    } else {
      deletePromptSection(container.id, sectionId);
    }
  };

  const handleAddSection = (title: string) => {
    addPromptSection(container.id, title);
    setAddingSection(false);
  };

  const handleAddItem = (data: {
    title: string;
    prompt: string;
    description?: string;
    tags: string[];
    isFavorite: boolean;
    variables: string[];
    sectionId?: string;
  }) => {
    addPromptItem(container.id, data);
  };

  const handleStartAddToSection = (sectionId: string) => {
    setAddingToSection(sectionId);
  };

  return (
    <div className="flex h-full flex-col" style={{ background: bg }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-6 py-4"
        style={{ background: isDarkTheme ? "#111827" : "#fff", borderColor: border }}
      >
        <MessageSquare size={20} style={{ color: "#9C27B0" }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? "#e2e8f0" : "#1e293b" }}>
            {container.title}
          </h1>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            {container.subItems.length} prompts in {sections.length || "no"} section
            {sections.length !== 1 ? "s" : ""}
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
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Add Section button */}
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            background: isDarkTheme ? "#1e293b" : "#f1f5f9",
            color: isDarkTheme ? "#e2e8f0" : "#1e293b",
          }}
        >
          <FolderPlus size={14} style={{ color: "#9C27B0" }} />
          <span className="hidden sm:inline">Section</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {/* Inline Add Section */}
        {addingSection && (
          <InlineAddSection
            isDark={isDarkTheme}
            onAdd={handleAddSection}
            onClose={() => setAddingSection(false)}
          />
        )}

        {/* No sections & no items state */}
        {sections.length === 0 && container.subItems.length === 0 && !addingSection && (
          <div className="py-12 text-center">
            <FolderPlus size={48} className="mx-auto mb-4" style={{ color: "#64748b" }} />
            <h3
              className="mb-2 text-lg font-medium"
              style={{ color: isDarkTheme ? "#e2e8f0" : "#1e293b" }}
            >
              No sections yet
            </h3>
            <p className="mb-4 text-sm" style={{ color: "#64748b" }}>
              Create a section to start organizing your prompts
            </p>
            <button
              onClick={() => setAddingSection(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "#9C27B0", color: "white" }}
            >
              Create Section
            </button>
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => {
          const sectionItems = getItemsForSection(section.id);
          const filteredItems = search
            ? sectionItems.filter(
                (i) =>
                  i.title.toLowerCase().includes(search.toLowerCase()) ||
                  i.prompt.toLowerCase().includes(search.toLowerCase()),
              )
            : sectionItems;

          if (search && filteredItems.length === 0) return null;

          return (
            <div key={section.id}>
              <PromptSectionCard
                section={section}
                items={filteredItems}
                containerId={container.id}
                isDark={isDarkTheme}
                onToggleCollapse={handleToggleCollapse}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
                onColorSection={handleColorSection}
                onAddItem={handleStartAddToSection}
              />
              {/* Inline add prompt to section */}
              {addingToSection === section.id && (
                <div className="mt-2">
                  <InlineAddPrompt
                    isDark={isDarkTheme}
                    onAdd={handleAddItem}
                    onClose={() => setAddingToSection(undefined)}
                    sectionId={section.id}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized prompts (no sectionId) */}
        {uncategorizedItems.length > 0 && (
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: border, background: isDarkTheme ? "#111827" : "#ffffff" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{ background: isDarkTheme ? "#1e293b" : "#f8fafc" }}
            >
              <MessageSquare size={14} style={{ color: "#64748b" }} />
              <span
                className="text-sm font-medium"
                style={{ color: isDarkTheme ? "#e2e8f0" : "#1e293b" }}
              >
                Uncategorized
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: "#64748b20", color: "#64748b" }}
              >
                {filteredUncategorized.length}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => {
                    const newTitle = prompt(
                      "Create named section from Uncategorized prompts:",
                      "General",
                    );
                    if (newTitle && newTitle.trim()) {
                      // Create a new section and move all uncategorized items to it
                      const { updatePromptContainer } = useStore.getState();
                      const tempSectionId = "temp_" + Date.now();
                      const newSection: PromptSection = {
                        id: tempSectionId,
                        title: newTitle.trim(),
                        order: sections.length,
                        collapsed: false,
                      };
                      const updatedSections = [...(container.sections || []), newSection];
                      const updatedSubItems = container.subItems.map((item) =>
                        !item.sectionId ? { ...item, sectionId: tempSectionId } : item,
                      );
                      updatePromptContainer(container.id, {
                        sections: updatedSections,
                        subItems: updatedSubItems,
                      });
                    }
                  }}
                  className="rounded p-1 hover:bg-purple-500/20"
                  title="Convert to named section"
                >
                  <Edit3 size={14} style={{ color: "#9C27B0" }} />
                </button>
                <button
                  onClick={() => setAddingToSection("__uncategorized__")}
                  className="rounded p-1 hover:bg-purple-500/20"
                  title="Add prompt"
                >
                  <Plus size={14} style={{ color: "#9C27B0" }} />
                </button>
              </div>
            </div>
            <div className="border-t" style={{ borderColor: border }}>
              {filteredUncategorized.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr
                      className="text-[10px] tracking-wider uppercase"
                      style={{
                        color: "#64748b",
                        background: isDarkTheme ? "#1e293b50" : "#f8fafc",
                      }}
                    >
                      <th className="w-8 px-2 py-1.5 text-center">#</th>
                      <th className="px-2 py-1.5 text-left">Title</th>
                      <th className="px-2 py-1.5 text-left">Prompt</th>
                      <th className="hidden px-2 py-1.5 text-left md:table-cell">Vars</th>
                      <th className="hidden px-2 py-1.5 text-left lg:table-cell">Tags</th>
                      <th className="w-36 px-2 py-1.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUncategorized.map((item, idx) => (
                      <PromptRow
                        key={item.id}
                        item={item}
                        containerId={container.id}
                        isDark={isDarkTheme}
                        index={idx}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-6 text-center text-xs" style={{ color: "#94a3b8" }}>
                  No prompts found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inline add prompt to uncategorized */}
        {addingToSection === "__uncategorized__" && (
          <InlineAddPrompt
            isDark={isDarkTheme}
            onAdd={handleAddItem}
            onClose={() => setAddingToSection(undefined)}
          />
        )}
      </div>
    </div>
  );
}
