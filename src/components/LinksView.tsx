import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useStore } from "../store";
import type { LinkItem, LinkSection } from "../types";
import { useAutoSync } from "../hooks/useAutoSync";
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit3,
  Link2,
  Star,
  Check,
  Copy,
  Globe,
  RefreshCw,
  GripVertical,
  X,
  ChevronDown,
  ChevronRight,
  Palette,
  LayoutGrid,
  LayoutList,
  FolderPlus,
  ArrowUpDown,
} from "lucide-react";
import { LinksImportExportModal } from "./LinksImportExportModal";

// Fetch link metadata
async function fetchLinkMetadata(
  url: string,
): Promise<{ title?: string; description?: string; favicon?: string }> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return {};

    const data = await response.json();
    const html = data.contents;

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    const description = descMatch ? descMatch[1].trim() : undefined;

    const iconMatch = html.match(
      /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i,
    );
    let favicon = iconMatch ? iconMatch[1] : undefined;

    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(url);
      favicon = favicon.startsWith("/")
        ? `${urlObj.origin}${favicon}`
        : `${urlObj.origin}/${favicon}`;
    }

    if (!favicon) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    }

    return { title, description, favicon };
  } catch {
    return {};
  }
}

// Get domain from URL
function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// ============================================
// LINK CARD COMPONENT (Grid View)
// ============================================
interface LinkCardProps {
  item: LinkItem;
  containerId: string;
  sectionId: string;
  isDark: boolean;
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string) => void;
  onDragOver: (e: React.DragEvent, target: number | string, sectionId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  dropIndex: number;
  dropSectionId: string | null;
}

function LinkCard({
  item,
  containerId,
  sectionId,
  isDark,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  isDragging,
  isDropTarget,
  dropIndex,
  dropSectionId,
}: LinkCardProps) {
  const { updateLinkItem, deleteLinkItem } = useStore();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [copied, setCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    updateLinkItem(containerId, item.id, editData);
    setEditing(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const border = isDark ? "#1e293b" : "#e2e8f0";
  const bg = isDark ? "#1e293b" : "#ffffff";
  const isCurrentDropTarget = isDropTarget && dropIndex === index && dropSectionId === sectionId;

  if (editing) {
    return (
      <div
        className="col-span-1 rounded-xl border-2 p-3 transition-all"
        style={{ background: bg, borderColor: "#FF9800" }}
      >
        <div className="space-y-2">
          <input
            className="w-full rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{
              background: isDark ? "#0f172a" : "#f8fafc",
              borderColor: border,
              color: isDark ? "#e2e8f0" : "#1e293b",
            }}
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            placeholder="URL..."
            // Клавиатура для адресов; без автозаглавных и автозамены — иначе телефон
            // норовит превратить "github.com" в "Github.com"
            type="url"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
          />
          <input
            className="w-full rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{
              background: isDark ? "#0f172a" : "#f8fafc",
              borderColor: border,
              color: isDark ? "#e2e8f0" : "#1e293b",
            }}
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Title..."
          />
          <input
            className="w-full rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{
              background: isDark ? "#0f172a" : "#f8fafc",
              borderColor: border,
              color: isDark ? "#e2e8f0" : "#1e293b",
            }}
            value={editData.description || ""}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium"
              style={{ background: "#FF980020", color: "#FF9800" }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 rounded-lg px-3 py-1.5 text-xs"
              style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id, sectionId)}
      onDragOver={(e) => onDragOver(e, index, sectionId)}
      onDrop={onDrop}
      className={`group relative cursor-grab rounded-xl border transition-all duration-200 active:cursor-grabbing ${isDragging ? "scale-95 opacity-50" : ""}`}
      style={{
        background: bg,
        borderColor: isCurrentDropTarget ? "#FF9800" : border,
        boxShadow: isCurrentDropTarget ? "0 0 0 2px #FF980040" : "none",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isCurrentDropTarget && (
        <div className="absolute -top-1 right-2 left-2 z-10 h-0.5 rounded bg-orange-400" />
      )}

      <div
        className="absolute top-2 left-2 rounded bg-slate-500/20 p-1 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ cursor: "grab" }}
      >
        <GripVertical size={10} style={{ color: isDark ? "#64748b" : "#94a3b8" }} />
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3"
        onClick={(e) => e.preventDefault()}
      >
        <div className="mb-2 flex items-start gap-2">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
            style={{ background: isDark ? "#0f172a" : "#f1f5f9" }}
          >
            {item.favicon && !faviconError ? (
              <img
                src={item.favicon}
                alt=""
                className="h-5 w-5 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <Globe size={16} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-sm font-medium transition-colors hover:text-orange-400"
              style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
            >
              {item.title}
            </h3>
            <p className="truncate text-[10px]" style={{ color: "#94a3b8" }}>
              {getDomain(item.url)}
            </p>
          </div>
        </div>

        {item.description && (
          <p className="mb-2 line-clamp-2 text-xs" style={{ color: "#64748b" }}>
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[9px]"
                style={{ background: isDark ? "#334155" : "#f1f5f9", color: "#64748b" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center gap-1 transition-opacity"
          style={{ opacity: showActions ? 1 : 0 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateLinkItem(containerId, item.id, { isFavorite: !item.isFavorite });
            }}
            className="rounded p-1 hover:bg-slate-500/20"
          >
            <Star
              size={12}
              className={item.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"}
            />
          </button>
          <button onClick={handleCopy} className="rounded p-1 hover:bg-slate-500/20">
            {copied ? (
              <Check size={12} className="text-green-400" />
            ) : (
              <Copy size={12} className="text-slate-400" />
            )}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded p-1 hover:bg-blue-500/20"
          >
            <ExternalLink size={12} className="text-blue-400" />
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditing(true);
            }}
            className="rounded p-1 hover:bg-slate-500/20"
          >
            <Edit3 size={12} className="text-slate-400" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm("Delete?")) deleteLinkItem(containerId, item.id);
            }}
            className="rounded p-1 hover:bg-red-500/20"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </a>
    </div>
  );
}

// ============================================
// COMPACT LINK ITEM COMPONENT (Google Drive Style)
// Key: Drag Handle separated from Link Area
// ============================================
interface CompactLinkItemProps {
  item: LinkItem;
  sectionColor?: string;
  isDark: boolean;
  sectionId: string;
  isDragging: boolean;
  isDropTarget: boolean;
  onUpdateItem: (itemId: string, updates: Partial<LinkItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string) => void;
  onDragOver: (e: React.DragEvent, target: number | string, sectionId: string) => void;
  onDrop: (e: React.DragEvent) => void;
}

// Color palette for link items
const LINK_COLORS = [
  undefined, // No color (default)
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

function CompactLinkItem({
  item,
  sectionColor,
  isDark,
  sectionId,
  isDragging,
  isDropTarget,
  onUpdateItem,
  onDeleteItem,
  onDragStart,
  onDragOver,
  onDrop,
}: CompactLinkItemProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editUrl, setEditUrl] = useState(item.url);
  const [editColor, setEditColor] = useState(item.color);
  const inputRef = useRef<HTMLInputElement>(null);

  // Google Drive style colors
  const borderColor = isDark ? "#374151" : "#e5e7eb";
  const hoverBg = isDark ? "#1f2937" : "#f3f4f6";
  const normalBg = isDark ? "#111827" : "#ffffff";

  // Priority: item color > section color > default
  const activeColor = item.color || sectionColor;

  // Background with subtle tint
  const getTintedBg = () => {
    if (isHovered || isEditing) return hoverBg;
    if (!activeColor) return normalBg;
    return `${activeColor}10`;
  };

  // Start editing
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditColor(item.color);
    setIsEditing(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    if (editTitle.trim() && editUrl.trim()) {
      onUpdateItem(item.id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        color: editColor,
      });
    }
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditColor(item.color);
    setIsEditing(false);
  };

  // Handle key down in edit mode
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Cycle color
  const handleCycleColor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = LINK_COLORS.indexOf(item.color);
    const nextIndex = (currentIndex + 1) % LINK_COLORS.length;
    onUpdateItem(item.id, { color: LINK_COLORS[nextIndex] });
  };

  // Delete item
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this link?")) {
      onDeleteItem(item.id);
    }
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // ========================================
  // EDITING MODE - Inline form
  // ========================================
  if (isEditing) {
    return (
      <div
        className="flex items-center gap-2 rounded-lg border-2 px-2.5 py-2 transition-all"
        style={{
          background: hoverBg,
          borderColor: "#FF9800",
          minWidth: 0,
        }}
        onBlur={(e) => {
          // Save when focus leaves the form (but not when clicking buttons inside)
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleSaveEdit();
          }
        }}
      >
        {/* Color indicator */}
        {activeColor && (
          <div className="h-8 w-1 flex-shrink-0 rounded-full" style={{ background: activeColor }} />
        )}

        {/* Edit inputs */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            placeholder="Title"
            className="w-full rounded border px-2 py-1 text-xs outline-none focus:border-orange-400"
            style={{
              background: isDark ? "#0f172a" : "#ffffff",
              borderColor: borderColor,
              color: isDark ? "#e5e7eb" : "#1f2937",
            }}
          />
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            onKeyDown={handleEditKeyDown}
            placeholder="URL"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded border px-2 py-0.5 text-[10px] outline-none focus:border-orange-400"
            style={{
              background: isDark ? "#0f172a" : "#ffffff",
              borderColor: borderColor,
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          />
        </div>

        {/* Color selector in edit mode */}
        <div className="flex flex-shrink-0 items-center gap-1">
          <select
            value={editColor || ""}
            onChange={(e) => setEditColor(e.target.value || undefined)}
            className="rounded border px-1 py-0.5 text-[10px] outline-none"
            style={{
              background: isDark ? "#0f172a" : "#ffffff",
              borderColor: borderColor,
              color: isDark ? "#e5e7eb" : "#1f2937",
            }}
          >
            <option value="">No color</option>
            {LINK_COLORS.filter((c) => c).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Save / Cancel buttons */}
        <div className="flex flex-shrink-0 items-center gap-0.5">
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur
            onClick={handleSaveEdit}
            className="rounded p-1 transition-colors hover:bg-green-500/20"
            title="Save (Enter)"
          >
            <Check size={14} className="text-green-400" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur
            onClick={handleCancelEdit}
            className="rounded p-1 transition-colors hover:bg-red-500/20"
            title="Cancel (Esc)"
          >
            <X size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // VIEW MODE - Clickable link + Drag Handle
  // ========================================
  return (
    <div
      className={`group relative flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors transition-opacity duration-150 ${isDragging ? "scale-95 opacity-50 ring-2 ring-orange-400" : ""} ${isDropTarget ? "bg-blue-500/10 ring-2 ring-blue-400" : ""} `}
      style={{
        background: isDropTarget ? undefined : getTintedBg(),
        borderColor: isDropTarget
          ? "#3b82f6"
          : isHovered
            ? isDark
              ? "#4b5563"
              : "#d1d5db"
            : borderColor,
        minWidth: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, item.id, sectionId);
      }}
      onDrop={onDrop}
    >
      {/* Drop indicator line */}
      {isDropTarget && (
        <div className="absolute -top-0.5 right-0 left-0 z-10 h-0.5 rounded bg-blue-400" />
      )}

      {/* Color indicator bar (left) */}
      {activeColor && (
        <div className="h-5 w-1 flex-shrink-0 rounded-full" style={{ background: activeColor }} />
      )}

      {/* DRAG HANDLE - Only this area starts drag */}
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item.id, sectionId)}
        className="flex-shrink-0 cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-500/20 active:cursor-grabbing"
        title="Drag to move"
      >
        <GripVertical size={12} style={{ color: isDark ? "#6b7280" : "#9ca3af" }} />
      </div>

      {/* FAVICON */}
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded">
        {item.favicon && !faviconError ? (
          <img
            src={item.favicon}
            alt=""
            className="h-4 w-4 object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <Globe size={12} style={{ color: isDark ? "#6b7280" : "#9ca3af" }} />
        )}
      </div>

      {/* LINK AREA - Clickable link, no DnD here */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 truncate text-xs font-medium transition-colors hover:text-orange-400"
        style={{ color: isDark ? "#e5e7eb" : "#1f2937" }}
        title={`${item.title}\n${item.url}`}
      >
        {item.title}
      </a>

      {/* Favorite indicator */}
      {item.isFavorite && (
        <Star size={10} className="flex-shrink-0 fill-amber-400 text-amber-400" />
      )}

      {/* Action buttons - show on hover (always in DOM to prevent layout shift) */}
      <div
        className="flex flex-shrink-0 items-center gap-0.5 transition-opacity duration-150"
        style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? "auto" : "none" }}
      >
        {/* Color button */}
        <button
          onClick={handleCycleColor}
          className="rounded p-1 transition-colors hover:bg-slate-500/20"
          title="Change color"
        >
          <div
            className="h-3 w-3 rounded-full border"
            style={{
              background: item.color || "transparent",
              borderColor: item.color || (isDark ? "#4b5563" : "#d1d5db"),
            }}
          />
        </button>

        {/* Edit button */}
        <button
          onClick={handleStartEdit}
          className="rounded p-1 transition-colors hover:bg-blue-500/20"
          title="Edit"
        >
          <Edit3 size={12} style={{ color: isDark ? "#60a5fa" : "#3b82f6" }} />
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="rounded p-1 transition-colors hover:bg-red-500/20"
          title="Delete"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// INLINE ADD LINK COMPONENT
// ============================================
interface InlineAddLinkProps {
  isDark: boolean;
  onCreateLink: (url: string, title?: string) => Promise<void>;
  onClose: () => void;
}

function InlineAddLink({ isDark, onCreateLink, onClose }: InlineAddLinkProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = async () => {
    if (!url.trim()) return;

    let finalTitle = title.trim();

    if (!finalTitle) {
      setIsFetching(true);
      const meta = await fetchLinkMetadata(url.trim());
      finalTitle = meta.title || getDomain(url.trim());
      setIsFetching(false);
    }

    await onCreateLink(url.trim(), finalTitle);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const borderColor = isDark ? "#374151" : "#e5e7eb";
  const inputBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <div
      className="animate-in fade-in flex items-center gap-2 rounded-lg border-2 border-dashed px-2.5 py-2 duration-150"
      style={{
        background: isDark ? "#111827" : "#fafafa",
        borderColor: "#FF9800",
      }}
      tabIndex={-1}
      onBlur={(e) => {
        // Close when focus leaves the form (but not when clicking buttons inside)
        if (!e.currentTarget.contains(e.relatedTarget) && !url.trim()) {
          onClose();
        }
      }}
    >
      {/* URL Input */}
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste URL and press Enter..."
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        className="flex-1 rounded border px-2 py-1 text-xs outline-none focus:border-orange-400"
        style={{
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? "#e5e7eb" : "#1f2937",
        }}
      />

      {/* Title Input (optional) */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Title (auto)"
        className="w-32 rounded border px-2 py-1 text-xs outline-none focus:border-orange-400"
        style={{
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? "#e5e7eb" : "#1f2937",
        }}
      />

      {/* Add / Cancel buttons */}
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!url.trim() || isFetching}
          className="rounded p-1 transition-colors hover:bg-green-500/20 disabled:opacity-50"
          title="Add link (Enter)"
        >
          {isFetching ? (
            <RefreshCw size={14} className="animate-spin text-orange-400" />
          ) : (
            <Check size={14} className="text-green-400" />
          )}
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
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const borderColor = isDark ? "#374151" : "#e5e7eb";
  const inputBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <div
      className="animate-in fade-in flex items-center gap-2 rounded-xl border-2 border-dashed px-4 py-2 duration-150"
      style={{
        background: isDark ? "#1e293b" : "#f8fafc",
        borderColor: "#FF9800",
      }}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim()) {
          onClose();
        }
      }}
    >
      <Link2 size={14} style={{ color: "#FF9800" }} />

      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Section title..."
        className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:border-orange-400"
        style={{
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? "#e2e8f0" : "#1e293b",
        }}
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
// SECTION COMPONENT
// ============================================
interface SectionProps {
  section: LinkSection; // Always a real section now
  links: LinkItem[];
  containerId: string;
  isDark: boolean;
  viewMode: "grid" | "compact";
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string) => void;
  onDragOver: (e: React.DragEvent, target: number | string, sectionId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  dragState: {
    draggingItemId: string | null;
    draggingSectionId: string | null;
    dropIndex: number | null;
    dropSectionId: string | null;
  };
  onToggleCollapse: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onColorSection: (sectionId: string) => void;
  // Item actions for compact mode
  onUpdateItem: (itemId: string, updates: Partial<LinkItem>) => void;
  onDeleteItem: (itemId: string) => void;
  // Inline add link state
  addingLinkToSection: string | undefined;
  onStartAddLink: (sectionId: string) => void;
  onCloseAddLink: () => void;
  onCreateLink: (sectionId: string, url: string, title?: string) => Promise<void>;
  // Section DnD
  sectionIndex: number;
  isDraggingSection: boolean;
  isDropTargetSection: boolean;
  onSectionDragStart: (e: React.DragEvent, sectionId: string) => void;
  onSectionDragOver: (e: React.DragEvent, targetIndex: number) => void;
  onSectionDrop: (e: React.DragEvent) => void;
}

// Predefined color palette
const SECTION_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
];

function Section({
  section,
  links,
  containerId,
  isDark,
  viewMode,
  onDragStart,
  onDragOver,
  onDrop,
  dragState,
  onToggleCollapse,
  onEditSection,
  onDeleteSection,
  onColorSection,
  onUpdateItem,
  onDeleteItem,
  addingLinkToSection,
  onStartAddLink,
  onCloseAddLink,
  onCreateLink,
  sectionIndex,
  isDraggingSection,
  isDropTargetSection,
  onSectionDragStart,
  onSectionDragOver,
  onSectionDrop,
}: SectionProps) {
  const sectionId = section.id;
  const isCollapsed = section.collapsed ?? false;

  const border = isDark ? "#1e293b" : "#e2e8f0";
  const bg = isDark ? "#111827" : "#ffffff";
  const headerBg = isDark ? "#1e293b" : "#f8fafc";

  return (
    <div
      className="group overflow-hidden rounded-xl border transition-all duration-200"
      style={{
        borderColor: isDraggingSection ? "#FF9800" : isDropTargetSection ? "#3b82f6" : border,
        opacity: isDraggingSection ? 0.5 : 1,
        boxShadow: isDropTargetSection ? "0 0 0 2px #3b82f640" : "none",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onSectionDragOver(e, sectionIndex);
      }}
      onDrop={onSectionDrop}
    >
      {/* Drop indicator above section */}
      {isDropTargetSection && <div className="h-1 rounded-t-xl bg-blue-400" />}

      {/* Section Header */}
      <div
        className="flex cursor-pointer items-center gap-2 px-2 py-2 sm:px-4"
        style={{ background: headerBg }}
        onClick={() => onToggleCollapse(section.id)}
      >
        {/* Drag Handle */}
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            onSectionDragStart(e, section.id);
          }}
          className="cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-500/20 active:cursor-grabbing"
          title="Drag to reorder section"
        >
          <GripVertical size={14} style={{ color: isDark ? "#64748b" : "#94a3b8" }} />
        </div>
        <button
          className="rounded p-0.5 hover:bg-slate-500/20"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(section.id);
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={14} style={{ color: section.color || "#FF9800" }} />
          ) : (
            <ChevronDown size={14} style={{ color: section.color || "#FF9800" }} />
          )}
        </button>
        {section.color && (
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ background: section.color }}
          />
        )}
        <Link2 size={14} style={{ color: section.color || "#FF9800" }} />
        <span
          className="flex-1 text-sm font-medium"
          style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
        >
          {section.title}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: section.color ? `${section.color}20` : "#FF980015",
            color: section.color || "#FF9800",
          }}
        >
          {links.length}
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
            className="rounded-lg p-1.5 transition-colors hover:bg-orange-500/20"
            title="Rename section"
          >
            <Edit3 size={14} style={{ color: "#FF9800" }} />
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
            onStartAddLink(sectionId);
          }}
          className="rounded p-1 hover:bg-orange-500/20"
          title="Add link to this section"
        >
          <Plus size={14} style={{ color: "#FF9800" }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div
          className={`min-h-[80px] p-3 ${
            viewMode === "compact"
              ? "compact-grid"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
          style={{
            background: bg,
            ...(viewMode === "compact"
              ? {
                  columnCount: Math.min(Math.max(Math.floor(links.length / 8) + 1, 2), 6),
                  columnGap: "6px",
                }
              : {}),
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragState.draggingItemId && dragState.dropSectionId !== sectionId) {
              onDragOver(e, links.length, sectionId);
            }
          }}
          onDrop={onDrop}
        >
          {viewMode === "compact" ? (
            // Compact view
            <>
              {links.map((item, index) => (
                <CompactLinkItem
                  key={item.id}
                  item={item}
                  sectionColor={section?.color}
                  isDark={isDark}
                  sectionId={sectionId}
                  isDragging={dragState.draggingItemId === item.id}
                  isDropTarget={
                    dragState.dropIndex === index && dragState.dropSectionId === sectionId
                  }
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                />
              ))}

              {/* Inline Add Link - только при клике на + */}
              {addingLinkToSection !== undefined && addingLinkToSection === sectionId && (
                <InlineAddLink
                  isDark={isDark}
                  onCreateLink={async (url, title) => {
                    await onCreateLink(sectionId, url, title);
                  }}
                  onClose={onCloseAddLink}
                />
              )}
            </>
          ) : (
            // Grid view
            <>
              {links.map((item, index) => (
                <LinkCard
                  key={item.id}
                  item={item}
                  containerId={containerId}
                  sectionId={sectionId}
                  isDark={isDark}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  index={index}
                  isDragging={dragState.draggingItemId === item.id}
                  isDropTarget={dragState.dropIndex !== null}
                  dropIndex={dragState.dropIndex ?? -1}
                  dropSectionId={dragState.dropSectionId}
                />
              ))}

              {/* Inline Add Link for Grid view - только при клике на + */}
              {addingLinkToSection !== undefined && addingLinkToSection === sectionId && (
                <InlineAddLink
                  isDark={isDark}
                  onCreateLink={async (url, title) => {
                    await onCreateLink(sectionId, url, title);
                  }}
                  onClose={onCloseAddLink}
                />
              )}
            </>
          )}

          {links.length === 0 &&
            (addingLinkToSection === undefined || addingLinkToSection !== sectionId) && (
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed py-6 text-center text-xs transition-colors hover:border-orange-400"
                style={{
                  color: "#94a3b8",
                  borderColor: dragState.dropSectionId === sectionId ? "#FF9800" : "transparent",
                  background: dragState.dropSectionId === sectionId ? "#FF980010" : "transparent",
                }}
                onClick={() => onStartAddLink(sectionId)}
              >
                {dragState.draggingItemId
                  ? "Drop here to move to this section"
                  : "Click to add a link"}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN LINKS VIEW
// ============================================
interface Props {
  containerId: string;
}

export function LinksView({ containerId }: Props) {
  // Get container directly from store
  const container = useStore((state) => state.links.find((l) => l.id === containerId));
  const {
    updateLinkContainer,
    updateLinkSection,
    deleteLinkSection,
    addLinkSection,
    updateLinkItem,
    deleteLinkItem,
    addLinkItem,
    reorderLinkSections,
    isDarkTheme,
  } = useStore();

  // Auto-sync hook - triggers debounced sync after changes
  useAutoSync(containerId, container?.updatedAt);

  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURN
  const [search, setSearch] = useState("");

  // View mode - persists in localStorage
  const [viewMode, setViewMode] = useState<"grid" | "compact">(() => {
    const saved = localStorage.getItem("links-viewMode");
    return saved === "compact" || saved === "grid" ? saved : "grid";
  });

  // Save viewMode to localStorage
  const handleSetViewMode = (mode: "grid" | "compact") => {
    setViewMode(mode);
    localStorage.setItem("links-viewMode", mode);
  };

  // Drag & Drop state
  const [dragState, setDragState] = useState<{
    draggingItemId: string | null;
    draggingSectionId: string | null;
    dropIndex: number | null;
    dropSectionId: string | null;
  }>({
    draggingItemId: null,
    draggingSectionId: null,
    dropIndex: null,
    dropSectionId: null,
  });

  // Section DnD state
  const [sectionDragState, setSectionDragState] = useState<{
    draggingSectionId: string | null;
    dropSectionIndex: number | null;
  }>({
    draggingSectionId: null,
    dropSectionIndex: null,
  });

  // Inline add states
  // undefined = hidden, null = uncategorized section, string = specific section ID
  const [addingLinkToSection, setAddingLinkToSection] = useState<string | undefined>(undefined);
  const [addingSection, setAddingSection] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  // Get sections (only real sections, no null/uncategorized)
  const sections: LinkSection[] = useMemo(() => {
    console.log("[LinksView] Computing sections from container:", {
      containerId: container?.id,
      sections: container?.sections,
    });
    const existingSections = container?.sections || [];
    return [...existingSections].sort((a, b) => a.order - b.order);
  }, [container?.sections]);

  // Get links for a section
  const getLinksForSection = useCallback(
    (sectionId: string) => {
      if (!container) return [];
      return container.subItems
        .filter((link) => link.sectionId === sectionId)
        .filter(
          (link) =>
            link.title.toLowerCase().includes(search.toLowerCase()) ||
            link.url.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    [container, search],
  );

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, itemId: string, sectionId: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDragState({
      draggingItemId: itemId,
      draggingSectionId: sectionId,
      dropIndex: null,
      dropSectionId: null,
    });
  };

  // Handle drag over - accepts targetItemId (for compact) or calculates from index (for grid)
  const handleDragOver = (e: React.DragEvent, target: number | string, sectionId: string) => {
    e.preventDefault();
    if (!dragState.draggingItemId || !container) return;

    // Calculate drop index
    let dropIndex: number;

    if (typeof target === "number") {
      // Grid mode: target is already an index
      dropIndex = target;
    } else if (typeof target === "string") {
      // Compact mode: target is itemId, find its index in section
      const sectionLinks = container.subItems
        .filter((link) => (link.sectionId || null) === sectionId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      if (target === "") {
        // Empty string means drop at end of section
        dropIndex = sectionLinks.length;
      } else {
        const targetIndex = sectionLinks.findIndex((l) => l.id === target);
        dropIndex = targetIndex >= 0 ? targetIndex : sectionLinks.length;
      }
    } else {
      return;
    }

    setDragState((prev) => ({
      ...prev,
      dropIndex,
      dropSectionId: sectionId,
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const { draggingItemId, draggingSectionId, dropIndex, dropSectionId } = dragState;

    if (!container || !draggingItemId || dropIndex === null) {
      setDragState({
        draggingItemId: null,
        draggingSectionId: null,
        dropIndex: null,
        dropSectionId: null,
      });
      return;
    }

    const itemToMove = container.subItems.find((item) => item.id === draggingItemId);
    if (!itemToMove) {
      setDragState({
        draggingItemId: null,
        draggingSectionId: null,
        dropIndex: null,
        dropSectionId: null,
      });
      return;
    }

    // ============================================
    // SAME SECTION REORDER (Intra-list DnD)
    // ============================================
    if (draggingSectionId === dropSectionId) {
      const sectionLinks = container.subItems
        .filter((link) => (link.sectionId || null) === dropSectionId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const fromIndex = sectionLinks.findIndex((l) => l.id === draggingItemId);
      if (fromIndex === -1) {
        setDragState({
          draggingItemId: null,
          draggingSectionId: null,
          dropIndex: null,
          dropSectionId: null,
        });
        return;
      }

      // Calculate actual drop position
      let toIndex = dropIndex;
      if (toIndex > fromIndex) {
        toIndex = Math.min(toIndex, sectionLinks.length);
      }

      // Skip if dropping at same position
      if (fromIndex === toIndex || (fromIndex === toIndex - 1 && toIndex > fromIndex)) {
        setDragState({
          draggingItemId: null,
          draggingSectionId: null,
          dropIndex: null,
          dropSectionId: null,
        });
        return;
      }

      // Remove from old position and insert at new position
      const reorderedLinks = [...sectionLinks];
      const [removed] = reorderedLinks.splice(fromIndex, 1);
      reorderedLinks.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, removed);

      // Update orders
      const updatedSubItems = container.subItems.map((item) => {
        if ((item.sectionId || null) !== dropSectionId) return item;
        const newOrder = reorderedLinks.findIndex((l) => l.id === item.id);
        return { ...item, order: newOrder };
      });

      updateLinkContainer(container.id, { subItems: updatedSubItems });
      setDragState({
        draggingItemId: null,
        draggingSectionId: null,
        dropIndex: null,
        dropSectionId: null,
      });
      return;
    }

    // ============================================
    // CROSS-SECTION MOVE (Inter-list DnD)
    // ============================================
    // Get links in target section
    const targetSectionLinks = container.subItems
      .filter((link) => (link.sectionId || null) === dropSectionId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Insert at drop position
    const insertIndex = Math.min(dropIndex, targetSectionLinks.length);

    // Update the moved item
    const newSubItems = container.subItems.map((item) => {
      if (item.id === draggingItemId) {
        return {
          ...item,
          sectionId: dropSectionId || undefined,
          order: insertIndex,
        };
      }
      return item;
    });

    // Shift orders for items at or after insert position in target section
    const shiftedSubItems = newSubItems.map((item) => {
      if (item.id === draggingItemId) return item;
      if ((item.sectionId || null) !== dropSectionId) return item;

      const currentOrder = item.order ?? 0;
      if (currentOrder >= insertIndex) {
        return { ...item, order: currentOrder + 1 };
      }
      return item;
    });

    // Normalize orders per section
    const normalizedSubItems = shiftedSubItems.map((item) => {
      const sectionId = item.sectionId || null;
      const sectionLinks = shiftedSubItems
        .filter((l) => (l.sectionId || null) === sectionId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return {
        ...item,
        order: sectionLinks.findIndex((l) => l.id === item.id),
      };
    });

    updateLinkContainer(container.id, { subItems: normalizedSubItems });
    setDragState({
      draggingItemId: null,
      draggingSectionId: null,
      dropIndex: null,
      dropSectionId: null,
    });
  };

  // Section handlers
  const handleToggleCollapse = (sectionId: string) => {
    if (!container) return;
    updateLinkSection(container.id, sectionId, {
      collapsed: !sections.find((s) => s?.id === sectionId)?.collapsed,
    });
  };

  const handleEditSection = (sectionId: string) => {
    if (!container) return;
    const section = sections.find((s) => s?.id === sectionId);
    if (!section) return;

    const newTitle = prompt("Section title:", section.title);
    if (newTitle && newTitle.trim()) {
      updateLinkSection(container.id, sectionId, { title: newTitle.trim() });
    }
  };

  const handleColorSection = (sectionId: string) => {
    if (!container) return;
    const section = sections.find((s) => s?.id === sectionId);
    if (!section) return;

    const currentIndex = SECTION_COLORS.indexOf(section.color || "");
    const nextIndex = (currentIndex + 1) % SECTION_COLORS.length;
    const newColor = SECTION_COLORS[nextIndex];

    console.log("[handleColorSection] Updating section:", {
      containerId: container.id,
      sectionId,
      newColor,
      currentSection: section,
      allSections: container.sections,
    });

    updateLinkSection(container.id, sectionId, { color: newColor });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!container) return;

    const linksInSection = container.subItems.filter((link) => link.sectionId === sectionId);

    if (linksInSection.length > 0) {
      const result = window.confirm(
        `This section has ${linksInSection.length} link(s). Delete section and all its links?`,
      );
      if (result) {
        // Delete all links in this section and the section itself
        const newSubItems = container.subItems.filter((link) => link.sectionId !== sectionId);
        updateLinkContainer(container.id, { subItems: newSubItems });
        deleteLinkSection(container.id, sectionId);
      }
    } else {
      deleteLinkSection(container.id, sectionId);
    }
  };

  // Inline add link
  const handleStartAddLink = (sectionId: string) => {
    setAddingLinkToSection(sectionId);
  };

  const handleCloseAddLink = () => {
    setAddingLinkToSection(undefined);
  };

  // Handle inline link creation with URL and title
  const handleCreateLink = async (sectionId: string, url: string, title?: string) => {
    if (!container || !url.trim()) return;

    let finalTitle = title;
    let favicon: string | undefined;

    if (!finalTitle) {
      const meta = await fetchLinkMetadata(url);
      finalTitle = meta.title || getDomain(url);
      favicon = meta.favicon;
    }

    addLinkItem(container.id, {
      url: url.trim(),
      title: finalTitle || getDomain(url),
      favicon: favicon || `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`,
      tags: [],
      isFavorite: false,
      sectionId: sectionId,
    });
  };

  // Section actions
  const handleAddSection = (title: string) => {
    if (!container) return;
    addLinkSection(container.id, title);
    setAddingSection(false);
  };

  // Item actions (for compact mode)
  const handleUpdateItem = (itemId: string, updates: Partial<LinkItem>) => {
    if (!container) return;
    updateLinkItem(container.id, itemId, updates);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!container) return;
    deleteLinkItem(container.id, itemId);
  };

  // Section DnD handlers
  const handleSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "section"); // Mark as section drag
    setSectionDragState({
      draggingSectionId: sectionId,
      dropSectionIndex: null,
    });
  };

  const handleSectionDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!sectionDragState.draggingSectionId) return;

    setSectionDragState((prev) => ({
      ...prev,
      dropSectionIndex: targetIndex,
    }));
  };

  const handleSectionDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const { draggingSectionId, dropSectionIndex } = sectionDragState;

    if (!container || !draggingSectionId || dropSectionIndex === null) {
      setSectionDragState({ draggingSectionId: null, dropSectionIndex: null });
      return;
    }

    // Get only named sections (exclude null/uncategorized)
    const namedSections = (container.sections || []).sort((a, b) => a.order - b.order);
    const fromIndex = namedSections.findIndex((s) => s.id === draggingSectionId);

    if (fromIndex === -1) {
      setSectionDragState({ draggingSectionId: null, dropSectionIndex: null });
      return;
    }

    // Skip if dropping at same position
    if (fromIndex === dropSectionIndex) {
      setSectionDragState({ draggingSectionId: null, dropSectionIndex: null });
      return;
    }

    // Reorder sections
    const reorderedSections = [...namedSections];
    const [removed] = reorderedSections.splice(fromIndex, 1);
    reorderedSections.splice(dropSectionIndex, 0, removed);

    // Create new order array of section IDs
    const newSectionIds = reorderedSections.map((s) => s.id);

    reorderLinkSections(container.id, newSectionIds);
    setSectionDragState({ draggingSectionId: null, dropSectionIndex: null });
  };

  // NOW we can do conditional return AFTER all hooks
  if (!container) {
    return (
      <div className="flex h-full items-center justify-center">
        <p style={{ color: "#64748b" }}>Links container not found</p>
      </div>
    );
  }

  const isDark = isDarkTheme;

  return (
    <div className="flex h-full flex-col">
      {/* Header. На узком экране переносится по строкам: в один ряд заголовок,
          переключатель вида, поиск и две кнопки на 360px не помещаются */}
      <div
        className="flex flex-wrap items-center gap-2 border-b px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
        style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}
      >
        <Link2 size={18} className="shrink-0" style={{ color: "#FF9800" }} />
        <h2
          className="min-w-0 flex-1 truncate font-semibold"
          style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
        >
          {container.title}
        </h2>

        {/* View mode toggle */}
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ background: isDark ? "#1e293b" : "#f1f5f9" }}
        >
          <button
            onClick={() => handleSetViewMode("grid")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-orange-500/20" : ""}`}
            title="Grid View"
          >
            <LayoutGrid
              size={14}
              style={{ color: viewMode === "grid" ? "#FF9800" : isDark ? "#64748b" : "#94a3b8" }}
            />
          </button>
          <button
            onClick={() => handleSetViewMode("compact")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "compact" ? "bg-orange-500/20" : ""}`}
            title="Compact View"
          >
            <LayoutList
              size={14}
              style={{ color: viewMode === "compact" ? "#FF9800" : isDark ? "#64748b" : "#94a3b8" }}
            />
          </button>
        </div>

        {/* Search. На мобильном уезжает на всю ширину отдельной строкой */}
        <div className="relative order-last w-full sm:order-0 sm:w-auto">
          <Search
            size={14}
            className="absolute top-1/2 left-3 -translate-y-1/2"
            style={{ color: "#64748b" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full rounded-lg border py-1.5 pr-4 pl-9 text-sm outline-none sm:w-48"
            style={{
              background: isDark ? "#1e293b" : "#ffffff",
              borderColor: isDark ? "#334155" : "#e2e8f0",
              color: isDark ? "#e2e8f0" : "#1e293b",
            }}
          />
        </div>

        {/* Add Section button */}
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            background: isDark ? "#1e293b" : "#f1f5f9",
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        >
          <FolderPlus size={14} style={{ color: "#FF9800" }} />
          <span className="hidden sm:inline">Section</span>
        </button>

        {/* Import/Export button */}
        <button
          onClick={() => setShowImportExport(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            background: isDark ? "#1e293b" : "#f1f5f9",
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
          title="Import / Export"
        >
          <ArrowUpDown size={14} style={{ color: "#FF9800" }} />
          <span className="hidden sm:inline">I/O</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-auto p-2 sm:p-4">
        {/* Inline Add Section */}
        {addingSection && (
          <InlineAddSection
            isDark={isDark}
            onAdd={handleAddSection}
            onClose={() => setAddingSection(false)}
          />
        )}

        {/* No sections state - prompt to create one */}
        {sections.length === 0 && !addingSection && (
          <div className="py-12 text-center">
            <FolderPlus size={48} className="mx-auto mb-4" style={{ color: "#64748b" }} />
            <h3
              className="mb-2 text-lg font-medium"
              style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
            >
              No sections yet
            </h3>
            <p className="mb-4 text-sm" style={{ color: "#64748b" }}>
              Create a section to start organizing your links
            </p>
            <button
              onClick={() => setAddingSection(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "#FF9800", color: "white" }}
            >
              Create Section
            </button>
          </div>
        )}

        {/* Sections */}
        {sections.map((section, sectionIndex) => {
          const sectionLinks = getLinksForSection(section.id);
          if (sectionLinks.length === 0 && search) return null;

          return (
            <Section
              key={section.id}
              section={section}
              links={sectionLinks}
              containerId={container.id}
              isDark={isDark}
              viewMode={viewMode}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dragState={dragState}
              onToggleCollapse={handleToggleCollapse}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              onColorSection={handleColorSection}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              addingLinkToSection={addingLinkToSection}
              onStartAddLink={handleStartAddLink}
              onCloseAddLink={handleCloseAddLink}
              onCreateLink={handleCreateLink}
              // Section DnD props
              sectionIndex={sectionIndex}
              isDraggingSection={sectionDragState.draggingSectionId === section.id}
              isDropTargetSection={sectionDragState.dropSectionIndex === sectionIndex}
              onSectionDragStart={handleSectionDragStart}
              onSectionDragOver={handleSectionDragOver}
              onSectionDrop={handleSectionDrop}
            />
          );
        })}

        {/* Empty state - when sections exist but no links */}
        {sections.length > 0 && container.subItems.length === 0 && (
          <div className="py-12 text-center">
            <Link2 size={48} className="mx-auto mb-4" style={{ color: "#64748b" }} />
            <h3
              className="mb-2 text-lg font-medium"
              style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
            >
              No links yet
            </h3>
            <p className="mb-4 text-sm" style={{ color: "#64748b" }}>
              Add your first link to a section
            </p>
          </div>
        )}
      </div>

      {/* Import/Export modal */}
      {showImportExport && container && (
        <LinksImportExportModal container={container} onClose={() => setShowImportExport(false)} />
      )}
    </div>
  );
}
