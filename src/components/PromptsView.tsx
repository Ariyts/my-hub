import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useStore } from "../store";
import type { PromptContainer, PromptItem, PromptSection } from "../types";
import { useAutoSync } from "../hooks/useAutoSync";
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

// Акцент типа «Prompts». Зеркалит токен --accent-prompts (тема-независим), но
// hex-константой: значение конкатенируется с альфой в тинтах `${…}15`.
const PROMPTS_ACCENT = "#bc8cff";

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
  onAdd: (title: string) => void;
  onClose: () => void;
}

function InlineAddSection({ onAdd, onClose }: InlineAddSectionProps) {
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

  const borderColor = "var(--border)";
  const inputBg = "var(--bg-sunken)";

  return (
    <div
      className="animate-in fade-in flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 duration-150"
      style={{ background: "var(--bg-sunken)", borderColor: PROMPTS_ACCENT }}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim()) onClose();
      }}
    >
      <MessageSquare size={14} style={{ color: PROMPTS_ACCENT }} />
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Section title..."
        className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:border-prompts"
        style={{ background: inputBg, borderColor, color: "var(--text)" }}
      />
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="rounded p-1 transition-colors hover:bg-success/15 disabled:opacity-50"
          title="Create section (Enter)"
        >
          <Check size={14} className="text-success" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="rounded p-1 transition-colors hover:bg-danger/15"
          title="Cancel (Esc)"
        >
          <X size={14} className="text-danger" />
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
  index: number;
}

function PromptRow({ item, containerId, index }: PromptRowProps) {
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

  const border = "var(--border)";
  const bg = "var(--bg-sunken)";
  const codeBg = "var(--bg-sunken)";

  if (editing) {
    return (
      <tr style={{ background: "var(--bg-sunken)" }}>
        <td colSpan={6} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                style={{
                  background: bg,
                  borderColor: border,
                  color: "var(--text)",
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
                  color: "var(--text)",
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
                color: "var(--text)",
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
                style={{ background: `${PROMPTS_ACCENT}15`, color: PROMPTS_ACCENT }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded px-3 py-1 text-xs"
                style={{ background: "var(--bg-sunken)", color: "var(--text-muted)" }}
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
        className="group transition-colors hover:bg-prompts/5"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <td className="cell-index w-8 px-2 py-2 text-center">
          <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>
            {index + 1}
          </span>
        </td>
        <td className="min-w-[150px] px-2 py-2">
          <div className="flex items-center gap-2">
            <span
              className="truncate text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              {item.title}
            </span>
            {item.isFavorite && (
              <Star size={10} className="flex-shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          {displayDescription && (
            <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-subtle)" }}>
              {displayDescription}
            </p>
          )}
        </td>
        <td className="min-w-[250px] px-2 py-2">
          <div
            className="cursor-pointer truncate rounded px-3 py-1.5 font-mono text-xs hover:bg-prompts/10"
            style={{ background: codeBg, color: "var(--text)", maxWidth: "300px" }}
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
                  style={{ background: `${PROMPTS_ACCENT}15`, color: PROMPTS_ACCENT }}
                >
                  {v.replace(/\{\{|\}\}/g, "")}
                </span>
              ))}
              {variables.length > 3 && (
                <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                  +{variables.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
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
                style={{ background: "var(--bg-sunken)", color: "var(--text-muted)" }}
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
                style={{ background: showVars ? `${PROMPTS_ACCENT}20` : "transparent" }}
              >
                <Variable size={11} style={{ color: showVars ? PROMPTS_ACCENT : "var(--text-muted)" }} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs"
              style={{
                background: copied ? "color-mix(in srgb, var(--success) 12%, transparent)" : `${PROMPTS_ACCENT}15`,
                color: copied ? "var(--success)" : PROMPTS_ACCENT,
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <button onClick={() => setEditing(true)} className="rounded p-1 hover:bg-slate-500/20">
              <Edit3 size={11} className="text-subtle" />
            </button>
            <button
              onClick={() => deletePromptItem(containerId, item.id)}
              className="rounded p-1 hover:bg-danger/15"
            >
              <Trash2 size={11} className="text-danger" />
            </button>
          </div>
        </td>
      </tr>
      {showVars && variables.length > 0 && (
        <tr style={{ background: "color-mix(in srgb, var(--accent-prompts) 8%, transparent)" }}>
          <td colSpan={6} className="px-4 py-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: PROMPTS_ACCENT }}>
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
                        style={{ color: PROMPTS_ACCENT }}
                      >
                        {key}
                      </span>
                      <input
                        className="flex-1 rounded border px-2 py-1 text-xs outline-none"
                        style={{
                          background: "var(--bg-sunken)",
                          borderColor: `${PROMPTS_ACCENT}50`,
                          color: "var(--text)",
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
                <X size={12} className="text-subtle" />
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
  onToggleCollapse,
  onEditSection,
  onDeleteSection,
  onColorSection,
  onAddItem,
}: PromptSectionCardProps) {
  const isCollapsed = section.collapsed ?? false;
  const border = "var(--border)";
  const bg = "var(--bg-elevated)";
  const headerBg = "var(--bg-sunken)";

  return (
    <div
      className="group overflow-hidden rounded-lg border transition-all duration-200"
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
            <ChevronRight size={14} style={{ color: section.color || PROMPTS_ACCENT }} />
          ) : (
            <ChevronDown size={14} style={{ color: section.color || PROMPTS_ACCENT }} />
          )}
        </button>
        {section.color && (
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ background: section.color }}
          />
        )}
        <MessageSquare size={14} style={{ color: section.color || PROMPTS_ACCENT }} />
        <span
          className="flex-1 text-sm font-medium"
          style={{ color: "var(--text)" }}
        >
          {section.title}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: section.color ? `${section.color}20` : `${PROMPTS_ACCENT}15`,
            color: section.color || PROMPTS_ACCENT,
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
            <Palette size={14} style={{ color: section.color || "var(--text-muted)" }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditSection(section.id);
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-prompts/20"
            title="Rename section"
          >
            <Edit3 size={14} style={{ color: PROMPTS_ACCENT }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection(section.id);
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-danger/15"
            title="Delete section"
          >
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(section.id);
          }}
          className="rounded p-1 hover:bg-prompts/20"
          title="Add prompt to this section"
        >
          <Plus size={14} style={{ color: PROMPTS_ACCENT }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="border-t" style={{ borderColor: border, background: bg }}>
          {items.length > 0 ? (
            <table className="table-cards w-full">
              <thead>
                <tr
                  className="text-[10px] tracking-wider uppercase"
                  style={{ color: "var(--text-muted)", background: "var(--bg-sunken)" }}
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
                    index={idx}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="m-3 cursor-pointer rounded-lg border-2 border-dashed py-6 text-center text-xs transition-colors hover:border-prompts"
              style={{ color: "var(--text-subtle)", borderColor: "transparent" }}
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

function InlineAddPrompt({ onAdd, onClose, sectionId }: InlineAddPromptProps) {
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

  const border = "var(--border)";
  const bg = "var(--bg-sunken)";
  const codeBg = "var(--bg-sunken)";

  return (
    <div
      className="animate-in fade-in space-y-2 rounded-lg border-2 border-dashed p-4 duration-150"
      style={{ borderColor: PROMPTS_ACCENT, background: `${PROMPTS_ACCENT}08` }}
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
          style={{ background: bg, borderColor: border, color: "var(--text)" }}
          placeholder="Prompt title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-48 rounded-lg border px-3 py-1.5 text-xs outline-none"
          style={{ background: bg, borderColor: border, color: "var(--text)" }}
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
          color: "var(--text)",
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
          style={{ background: `${PROMPTS_ACCENT}15`, color: PROMPTS_ACCENT }}
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="rounded px-3 py-1 text-xs"
          style={{ background: "var(--bg-sunken)", color: "var(--text-muted)" }}
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
  const { addPromptItem, addPromptSection, updatePromptSection, deletePromptSection } = useStore();

  // Единый автосинк, управляемый тумблером settings.autoSave (Задача 0.E.3)
  useAutoSync(container.id, container.updatedAt);

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

  const bg = "var(--bg)";
  const border = "var(--border)";

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
        style={{ background: "var(--bg-elevated)", borderColor: border }}
      >
        <MessageSquare size={20} style={{ color: PROMPTS_ACCENT }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            {container.title}
          </h1>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {container.subItems.length} prompts in {sections.length || "no"} section
            {sections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-subtle" />
          <input
            className="w-48 rounded-lg border py-1.5 pr-3 pl-8 text-sm outline-none"
            style={{
              background: "var(--bg-sunken)",
              borderColor: border,
              color: "var(--text)",
            }}
            placeholder="Search prompts..."
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Add Section button */}
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            background: "var(--bg-sunken)",
            color: "var(--text)",
          }}
        >
          <FolderPlus size={14} style={{ color: PROMPTS_ACCENT }} />
          <span className="hidden sm:inline">Section</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {/* Inline Add Section */}
        {addingSection && (
          <InlineAddSection
            onAdd={handleAddSection}
            onClose={() => setAddingSection(false)}
          />
        )}

        {/* No sections & no items state */}
        {sections.length === 0 && container.subItems.length === 0 && !addingSection && (
          <div className="py-12 text-center">
            <FolderPlus size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3
              className="mb-2 text-lg font-medium"
              style={{ color: "var(--text)" }}
            >
              No sections yet
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Create a section to start organizing your prompts
            </p>
            <button
              onClick={() => setAddingSection(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: PROMPTS_ACCENT, color: "white" }}
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
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: border, background: "var(--bg-elevated)" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{ background: "var(--bg-sunken)" }}
            >
              <MessageSquare size={14} style={{ color: "var(--text-muted)" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Uncategorized
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: "var(--bg-sunken)", color: "var(--text-muted)" }}
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
                  className="rounded p-1 hover:bg-prompts/20"
                  title="Convert to named section"
                >
                  <Edit3 size={14} style={{ color: PROMPTS_ACCENT }} />
                </button>
                <button
                  onClick={() => setAddingToSection("__uncategorized__")}
                  className="rounded p-1 hover:bg-prompts/20"
                  title="Add prompt"
                >
                  <Plus size={14} style={{ color: PROMPTS_ACCENT }} />
                </button>
              </div>
            </div>
            <div className="border-t" style={{ borderColor: border }}>
              {filteredUncategorized.length > 0 ? (
                <table className="table-cards w-full">
                  <thead>
                    <tr
                      className="text-[10px] tracking-wider uppercase"
                      style={{
                        color: "var(--text-muted)",
                        background: "var(--bg-sunken)",
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
                        index={idx}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-6 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
                  No prompts found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inline add prompt to uncategorized */}
        {addingToSection === "__uncategorized__" && (
          <InlineAddPrompt
            onAdd={handleAddItem}
            onClose={() => setAddingToSection(undefined)}
          />
        )}
      </div>
    </div>
  );
}
