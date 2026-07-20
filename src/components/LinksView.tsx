import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useStore } from "../store";
import type { LinkItem, LinkSection } from "../types";
import { useAutoSync } from "../hooks/useAutoSync";
import {
  Plus,
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
  LayoutDashboard,
  Table,
  Columns3,
  FolderPlus,
  ArrowUpDown,
  TrendingUp,
  ArrowDownAZ,
  CheckSquare,
  Tag,
  FolderInput,
} from "lucide-react";
import { LinksImportExportModal } from "./LinksImportExportModal";
import { ViewHeader } from "./shell/ViewHeader";
import { ViewToolbar } from "./shell/ViewToolbar";
import { ResourceCard } from "./shell/ResourceCard";
import { ResourceList } from "./shell/ResourceList";
import { ResourceBoard } from "./shell/ResourceBoard";
import { ColorPicker } from "./shell/ColorPicker";
import { SelectCheckbox } from "./shell/SelectCheckbox";
import { HoverPreview } from "./shell/HoverPreview";
import { LinkPreviewCard } from "./shell/LinkPreviewCard";
import { LevelBadge } from "./shell/Badge";
import { fetchLinkMetadata, faviconForDomain } from "../utils/linkMetadata";

// Get domain from URL
function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Уровень сложности ссылки (Задача 2.8) — необязательный
const LINK_LEVELS = ["L1", "L2", "L3"] as const;
const LEVEL_PICK_COLORS: Record<string, string> = {
  L1: "#22c55e",
  L2: "#eab308",
  L3: "#ef4444",
};

// Компактный переключатель уровня для форм редактирования. Пусто = без уровня.
function LevelPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (level: string | undefined) => void;
}) {
  return (
    <div className="flex items-center gap-1" title="Difficulty level (optional)">
      {LINK_LEVELS.map((lvl) => {
        const active = value === lvl;
        const color = LEVEL_PICK_COLORS[lvl];
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange(active ? undefined : lvl)}
            className="rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors"
            style={
              active
                ? { background: `${color}30`, color }
                : { background: "transparent", color: "#94a3b8", border: "1px solid #94a3b840" }
            }
          >
            {lvl}
          </button>
        );
      })}
    </div>
  );
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
  // Мультивыбор (Задача 2.4)
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
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
  selectable,
  selected,
  onToggleSelect,
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
          {/* Уровень сложности (Задача 2.8) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Level:</span>
            <LevelPicker
              value={editData.level}
              onChange={(level) => setEditData({ ...editData, level })}
            />
          </div>
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
      draggable={!selectable}
      onDragStart={(e) => onDragStart(e, item.id, sectionId)}
      onDragOver={(e) => onDragOver(e, index, sectionId)}
      onDrop={onDrop}
      onClick={selectable ? () => onToggleSelect?.() : undefined}
      className={`group relative rounded-xl border transition-all duration-200 ${
        selectable ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "scale-95 opacity-50" : ""}`}
      style={{
        background: bg,
        borderColor: selected ? "#FF9800" : isCurrentDropTarget ? "#FF9800" : border,
        boxShadow: selected
          ? "0 0 0 2px #FF9800"
          : isCurrentDropTarget
            ? "0 0 0 2px #FF980040"
            : "none",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isCurrentDropTarget && (
        <div className="absolute -top-1 right-2 left-2 z-10 h-0.5 rounded bg-orange-400" />
      )}

      {/* Чекбокс выбора (Задача 2.4) — вместо ручки перетаскивания */}
      {selectable ? (
        <div className="absolute top-2 left-2 z-10">
          <SelectCheckbox checked={!!selected} onToggle={() => onToggleSelect?.()} />
        </div>
      ) : (
        <div
          className="absolute top-2 left-2 rounded bg-slate-500/20 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ cursor: "grab" }}
        >
          <GripVertical size={10} style={{ color: isDark ? "#64748b" : "#94a3b8" }} />
        </div>
      )}

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3"
        onClick={(e) => e.preventDefault()}
      >
        <div className="mb-2 flex items-start gap-2">
          {/* Фавикон — наведение показывает превью-карточку (Задача 2.6) */}
          <HoverPreview
            className="inline-flex shrink-0"
            content={
              <LinkPreviewCard
                title={item.title}
                url={item.url}
                description={item.description}
                favicon={item.favicon}
                tags={item.tags}
                accent="#FF9800"
              />
            }
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
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
          </HoverPreview>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3
                className="min-w-0 flex-1 truncate text-sm font-medium transition-colors hover:text-orange-400"
                style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
              >
                {item.title}
              </h3>
              {/* Бейдж уровня (Задача 2.8) — только если задан */}
              {item.level && <LevelBadge level={item.level} />}
            </div>
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
          {/* Color picker (Задача 2.3) */}
          <div onClick={(e) => e.preventDefault()}>
            <ColorPicker
              value={item.color}
              onChange={(c) => updateLinkItem(containerId, item.id, { color: c })}
              size={12}
            />
          </div>
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
  // Мультивыбор (Задача 2.4)
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

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
  selectable,
  selected,
  onToggleSelect,
}: CompactLinkItemProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editUrl, setEditUrl] = useState(item.url);
  const [editColor, setEditColor] = useState(item.color);
  const [editLevel, setEditLevel] = useState(item.level);
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
    setEditLevel(item.level);
    setIsEditing(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    if (editTitle.trim() && editUrl.trim()) {
      onUpdateItem(item.id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        color: editColor,
        level: editLevel,
      });
    }
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditColor(item.color);
    setEditLevel(item.level);
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

        {/* Level + color в режиме редактирования (Задачи 2.8 / 2.3) */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <LevelPicker value={editLevel} onChange={setEditLevel} />
          <ColorPicker value={editColor} onChange={setEditColor} size={14} />
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
      onClick={selectable ? () => onToggleSelect?.() : undefined}
      className={`group relative flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors transition-opacity duration-150 ${isDragging ? "scale-95 opacity-50 ring-2 ring-orange-400" : ""} ${isDropTarget ? "bg-blue-500/10 ring-2 ring-blue-400" : ""} ${selected ? "ring-2 ring-orange-400" : ""} ${selectable ? "cursor-pointer" : ""}`}
      style={{
        background: isDropTarget ? undefined : getTintedBg(),
        borderColor: isDropTarget
          ? "#3b82f6"
          : selected
            ? "#FF9800"
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

      {/* Чекбокс выбора (Задача 2.4) — вместо ручки перетаскивания */}
      {selectable ? (
        <div className="flex-shrink-0">
          <SelectCheckbox checked={!!selected} onToggle={() => onToggleSelect?.()} size={14} />
        </div>
      ) : (
        /* DRAG HANDLE - Only this area starts drag */
        <div
          draggable
          onDragStart={(e) => onDragStart(e, item.id, sectionId)}
          className="flex-shrink-0 cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-500/20 active:cursor-grabbing"
          title="Drag to move"
        >
          <GripVertical size={12} style={{ color: isDark ? "#6b7280" : "#9ca3af" }} />
        </div>
      )}

      {/* FAVICON — наведение показывает превью-карточку (Задача 2.6) */}
      <HoverPreview
        className="inline-flex shrink-0"
        content={
          <LinkPreviewCard
            title={item.title}
            url={item.url}
            description={item.description}
            favicon={item.favicon}
            tags={item.tags}
            accent={item.color || sectionColor || "#FF9800"}
          />
        }
      >
        <div className="flex h-4 w-4 items-center justify-center overflow-hidden rounded">
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
      </HoverPreview>

      {/* LINK AREA - Clickable link, no DnD here */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={selectable ? (e) => e.preventDefault() : undefined}
        className="flex-1 truncate text-xs font-medium transition-colors hover:text-orange-400"
        style={{ color: isDark ? "#e5e7eb" : "#1f2937" }}
        title={`${item.title}\n${item.url}`}
      >
        {item.title}
      </a>

      {/* Бейдж уровня (Задача 2.8) — только если задан */}
      {item.level && (
        <span className="shrink-0">
          <LevelBadge level={item.level} />
        </span>
      )}

      {/* Favorite indicator */}
      {item.isFavorite && (
        <Star size={10} className="flex-shrink-0 fill-amber-400 text-amber-400" />
      )}

      {/* Action buttons - show on hover (always in DOM to prevent layout shift) */}
      <div
        className="flex flex-shrink-0 items-center gap-0.5 transition-opacity duration-150"
        style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? "auto" : "none" }}
      >
        {/* Color picker (Задача 2.3) */}
        <ColorPicker
          value={item.color}
          onChange={(c) => onUpdateItem(item.id, { color: c })}
          size={12}
        />

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
type LinksViewMode = "grid" | "compact" | "tiles" | "list" | "board";

interface SectionProps {
  section: LinkSection; // Always a real section now
  links: LinkItem[];
  containerId: string;
  isDark: boolean;
  viewMode: LinksViewMode;
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
  // Теги-фасеты (для Tiles)
  activeTags: string[];
  onTagClick: (tag: string) => void;
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
  // Мультивыбор (Задача 2.4)
  selectMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
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
  activeTags,
  onTagClick,
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
  selectMode,
  selectedIds,
  onToggleSelect,
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
              : viewMode === "tiles"
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
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
                  selectable={selectMode}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={() => onToggleSelect(item.id)}
                />
              ))}

              {/* Inline Add Link - только при клике на +.
                  columnSpan:"all" растягивает форму на всю ширину секции: в Compact
                  контейнер многоколоночный, иначе форма зажимается в узкую колонку
                  и кнопки Save/Cancel обрезаются при большом числе ссылок. */}
              {addingLinkToSection !== undefined && addingLinkToSection === sectionId && (
                <div style={{ columnSpan: "all" }}>
                  <InlineAddLink
                    isDark={isDark}
                    onCreateLink={async (url, title) => {
                      await onCreateLink(sectionId, url, title);
                    }}
                    onClose={onCloseAddLink}
                  />
                </div>
              )}
            </>
          ) : viewMode === "tiles" ? (
            // Tiles view (Задача 0.C) — browse-карточки. Инлайн-редактирование
            // остаётся в Grid/Compact; здесь быстрые действия.
            <>
              {links.map((item) => (
                <ResourceCard
                  key={item.id}
                  title={item.title}
                  url={item.url}
                  description={item.description}
                  favicon={item.favicon}
                  accent={section.color || "#FF9800"}
                  tags={item.tags}
                  starred={item.isFavorite}
                  activeTags={activeTags}
                  onTagClick={onTagClick}
                  level={item.level}
                  onToggleStar={() => onUpdateItem(item.id, { isFavorite: !item.isFavorite })}
                  onOpen={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  onDelete={() => onDeleteItem(item.id)}
                  selectable={selectMode}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={() => onToggleSelect(item.id)}
                />
              ))}

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
                  selectable={selectMode}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={() => onToggleSelect(item.id)}
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
  const [viewMode, setViewMode] = useState<LinksViewMode>(() => {
    const saved = localStorage.getItem("links-viewMode");
    return saved === "compact" ||
      saved === "grid" ||
      saved === "tiles" ||
      saved === "list" ||
      saved === "board"
      ? saved
      : "grid";
  });

  // Save viewMode to localStorage
  const handleSetViewMode = (mode: LinksViewMode) => {
    setViewMode(mode);
    localStorage.setItem("links-viewMode", mode);
  };

  // Сортировка (rank = ручной порядок) и фильтр «только избранное».
  // «Recent» появится, когда у LinkItem будут таймстампы (Задача 2).
  const [sortMode, setSortMode] = useState<"rank" | "az">("rank");
  const [starredOnly, setStarredOnly] = useState(false);

  // Теги-фасеты: ссылка проходит, если содержит ВСЕ выбранные теги (AND)
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const toggleTag = (tag: string) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  // Мультивыбор и пакетные операции (Задача 2.4)
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setMoveMenuOpen(false);
  }, []);

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
    const existingSections = container?.sections || [];
    return [...existingSections].sort((a, b) => a.order - b.order);
  }, [container?.sections]);

  // Ссылки, сгруппированные по секции: фильтр+сортировка ОДНИМ проходом (0.E.1).
  // Раньше getLinksForSection вызывался на каждую секцию и каждый раз сканировал
  // ВСЕ subItems (+ .toLowerCase() поиска на каждую ссылку) — это O(секции × ссылки).
  // Теперь один проход O(n) + сортировка по секциям, а геттер — просто lookup.
  const linksBySection = useMemo(() => {
    const map = new Map<string, LinkItem[]>();
    if (!container) return map;
    const q = search.toLowerCase();
    for (const link of container.subItems) {
      if (!link.sectionId) continue;
      if (q && !(link.title.toLowerCase().includes(q) || link.url.toLowerCase().includes(q)))
        continue;
      if (starredOnly && !link.isFavorite) continue;
      if (activeTags.length && !activeTags.every((t) => link.tags?.includes(t))) continue;
      let arr = map.get(link.sectionId);
      if (!arr) {
        arr = [];
        map.set(link.sectionId, arr);
      }
      arr.push(link);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) =>
        sortMode === "az" ? a.title.localeCompare(b.title) : (a.order ?? 0) - (b.order ?? 0),
      );
    }
    return map;
  }, [container, search, starredOnly, sortMode, activeTags]);

  const EMPTY_LINKS: LinkItem[] = useMemo(() => [], []);
  const getLinksForSection = useCallback(
    (sectionId: string) => linksBySection.get(sectionId) ?? EMPTY_LINKS,
    [linksBySection, EMPTY_LINKS],
  );

  // Плоский список ссылок с их секцией — для раскладки List (глобальная сортировка)
  const flatLinks = useMemo(() => {
    if (!container) return [];
    const secById = new Map(sections.map((s) => [s.id, s]));
    const q = search.toLowerCase();
    return container.subItems
      .filter((l) => l.sectionId && secById.has(l.sectionId))
      .filter((l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q))
      .filter((l) => !starredOnly || l.isFavorite)
      .filter((l) => activeTags.every((t) => l.tags?.includes(t)))
      .sort((a, b) =>
        sortMode === "az" ? a.title.localeCompare(b.title) : (a.order ?? 0) - (b.order ?? 0),
      )
      .map((l) => ({ link: l, section: secById.get(l.sectionId!)! }));
  }, [container, sections, search, starredOnly, sortMode, activeTags]);

  // Все видимые (после фильтров) id — для «выбрать всё» и его состояния (Задача 2.4)
  const visibleLinkIds = useMemo(() => {
    if (!container) return [] as string[];
    const secIds = new Set(sections.map((s) => s.id));
    const q = search.toLowerCase();
    return container.subItems
      .filter((l) => l.sectionId && secIds.has(l.sectionId))
      .filter((l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q))
      .filter((l) => !starredOnly || l.isFavorite)
      .filter((l) => activeTags.every((t) => l.tags?.includes(t)))
      .map((l) => l.id);
  }, [container, sections, search, starredOnly, activeTags]);

  const allVisibleSelected =
    visibleLinkIds.length > 0 && visibleLinkIds.every((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      // Если все видимые уже выбраны — снимаем их; иначе добавляем все видимые
      if (visibleLinkIds.every((id) => prev.has(id))) {
        const next = new Set(prev);
        visibleLinkIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...visibleLinkIds]);
    });
  };

  // Пакетное удаление — одним атомарным апдейтом контейнера
  const bulkDelete = () => {
    if (!container || selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected link(s)?`)) return;
    updateLinkContainer(container.id, {
      subItems: container.subItems.filter((l) => !selectedIds.has(l.id)),
    });
    clearSelection();
  };

  // Пакетное перемещение в секцию (в конец целевой секции, порядок выбранных сохраняется)
  const bulkMove = (targetSectionId: string) => {
    if (!container || selectedIds.size === 0) return;
    let nextOrder = container.subItems
      .filter((l) => l.sectionId === targetSectionId && !selectedIds.has(l.id))
      .reduce((max, l) => Math.max(max, (l.order ?? 0) + 1), 0);
    const moved = container.subItems
      .filter((l) => selectedIds.has(l.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const orderById = new Map<string, number>();
    moved.forEach((l) => orderById.set(l.id, nextOrder++));
    updateLinkContainer(container.id, {
      subItems: container.subItems.map((l) =>
        selectedIds.has(l.id)
          ? { ...l, sectionId: targetSectionId, order: orderById.get(l.id) }
          : l,
      ),
    });
    setMoveMenuOpen(false);
    clearSelection();
  };

  // Пакетное добавление тега (выбор не сбрасываем — можно навесить несколько)
  const bulkAddTag = () => {
    if (!container || selectedIds.size === 0) return;
    const tag = prompt("Add tag to selected links:")?.trim();
    if (!tag) return;
    updateLinkContainer(container.id, {
      subItems: container.subItems.map((l) =>
        selectedIds.has(l.id)
          ? { ...l, tags: l.tags?.includes(tag) ? l.tags : [...(l.tags || []), tag] }
          : l,
      ),
    });
  };

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

    // Normalize orders per section — позиция каждого id вычисляется один раз (0.E.1).
    // Раньше здесь на каждый элемент фильтровался+сортировался весь массив — O(n²).
    const orderIndex = new Map<string, number>();
    const grouped = new Map<string | null, LinkItem[]>();
    for (const l of shiftedSubItems) {
      const sid = l.sectionId || null;
      let arr = grouped.get(sid);
      if (!arr) {
        arr = [];
        grouped.set(sid, arr);
      }
      arr.push(l);
    }
    for (const arr of grouped.values()) {
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      arr.forEach((l, i) => orderIndex.set(l.id, i));
    }
    const normalizedSubItems = shiftedSubItems.map((item) => ({
      ...item,
      order: orderIndex.get(item.id) ?? 0,
    }));

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
    // Фавикон детерминированно выводится из домена — доступен всегда (Задача 2.5)
    let favicon = faviconForDomain(getDomain(url));

    if (!finalTitle) {
      const meta = await fetchLinkMetadata(url);
      finalTitle = meta.title || getDomain(url);
      favicon = meta.favicon || favicon;
    }

    addLinkItem(container.id, {
      url: url.trim(),
      title: finalTitle || getDomain(url),
      favicon,
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
    <div className="relative flex h-full flex-col">
      {/* Панель управления (Задача 0.C) */}
      <ViewToolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search links, tags, urls..."
        accent="#FF9800"
        filters={[
          {
            key: "starred",
            label: "Starred",
            icon: <Star size={14} />,
            active: starredOnly,
            onToggle: () => setStarredOnly((v) => !v),
          },
        ]}
        sortOptions={[
          { value: "rank", label: "Rank", icon: <TrendingUp size={14} /> },
          { value: "az", label: "A–Z", icon: <ArrowDownAZ size={14} /> },
        ]}
        sortValue={sortMode}
        onSort={(v) => setSortMode(v as "rank" | "az")}
        layoutOptions={[
          { value: "tiles", label: "Tiles", icon: <LayoutDashboard size={16} /> },
          { value: "grid", label: "Grid", icon: <LayoutGrid size={16} /> },
          { value: "list", label: "List", icon: <Table size={16} /> },
          { value: "board", label: "Board", icon: <Columns3 size={16} /> },
          { value: "compact", label: "Compact", icon: <LayoutList size={16} /> },
        ]}
        layout={viewMode}
        onLayout={(v) => handleSetViewMode(v as LinksViewMode)}
        rightSlot={
          <div className="flex items-center gap-2">
            <button
              onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectMode
                  ? "bg-links/15 text-links"
                  : "hover:bg-sunken bg-surface text-foreground"
              }`}
              title="Select multiple links"
            >
              <CheckSquare size={14} className={selectMode ? "" : "text-links"} />
              <span className="hidden sm:inline">{selectMode ? "Done" : "Select"}</span>
            </button>
            <button
              onClick={() => setAddingSection(true)}
              className="hover:bg-sunken flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors"
            >
              <FolderPlus size={14} className="text-links" />
              <span className="hidden sm:inline">Section</span>
            </button>
            <button
              onClick={() => setShowImportExport(true)}
              className="hover:bg-sunken flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors"
              title="Import / Export"
            >
              <ArrowUpDown size={14} className="text-links" />
              <span className="hidden sm:inline">I/O</span>
            </button>
          </div>
        }
      />

      {/* Collection header (Задача 0.C) */}
      <ViewHeader
        eyebrow="~/ Links"
        title={container.title}
        subtitle={
          sections.length
            ? `${sections.length} ${sections.length === 1 ? "section" : "sections"}`
            : undefined
        }
        icon={<Link2 size={22} />}
        accent="#FF9800"
        count={container.subItems.length}
        countLabel="links"
      />

      {/* Активные теги-фасеты (Задача 0.D) */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 pb-2 sm:px-5">
          <span className="text-xs text-subtle">Tags:</span>
          {activeTags.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]"
              style={{
                background: "color-mix(in srgb, var(--primary) 22%, transparent)",
                color: "var(--primary)",
              }}
            >
              #{t}
              <X size={11} />
            </button>
          ))}
          <button
            onClick={() => setActiveTags([])}
            className="text-[11px] text-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

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

        {/* List layout (Задача 0.C) — плоская таблица со столбцом Category */}
        {viewMode === "list" &&
          (flatLinks.length > 0 ? (
            <ResourceList
              activeTags={activeTags}
              onTagClick={toggleTag}
              items={flatLinks.map(({ link, section }) => ({
                id: link.id,
                title: link.title,
                url: link.url,
                favicon: link.favicon,
                accent: section.color || "#FF9800",
                tags: link.tags,
                starred: link.isFavorite,
                categoryLabel: section.title,
                categoryColor: section.color || "#FF9800",
                level: link.level,
                onToggleStar: () => handleUpdateItem(link.id, { isFavorite: !link.isFavorite }),
                onOpen: () => window.open(link.url, "_blank", "noopener,noreferrer"),
                onDelete: () => handleDeleteItem(link.id),
                selectable: selectMode,
                selected: selectedIds.has(link.id),
                onToggleSelect: () => toggleSelect(link.id),
              }))}
            />
          ) : sections.length > 0 ? (
            <div className="py-12 text-center text-sm text-muted">No links match.</div>
          ) : null)}

        {/* Board layout (Задача 0.C) — канбан: колонка на секцию */}
        {viewMode === "board" && (
          <ResourceBoard
            activeTags={activeTags}
            onTagClick={toggleTag}
            columns={sections
              .map((section) => ({ section, links: getLinksForSection(section.id) }))
              .filter(
                ({ links }) => links.length > 0 || !(search || starredOnly || activeTags.length > 0),
              )
              .map(({ section, links }) => ({
                id: section.id,
                title: section.title,
                accent: section.color || "#FF9800",
                items: links.map((link) => ({
                  id: link.id,
                  title: link.title,
                  url: link.url,
                  description: link.description,
                  favicon: link.favicon,
                  accent: section.color || "#FF9800",
                  tags: link.tags,
                  starred: link.isFavorite,
                  level: link.level,
                  onToggleStar: () => handleUpdateItem(link.id, { isFavorite: !link.isFavorite }),
                  onOpen: () => window.open(link.url, "_blank", "noopener,noreferrer"),
                  onDelete: () => handleDeleteItem(link.id),
                  selectable: selectMode,
                  selected: selectedIds.has(link.id),
                  onToggleSelect: () => toggleSelect(link.id),
                })),
              }))}
          />
        )}

        {/* Sections (grid / tiles / compact) */}
        {viewMode !== "list" &&
          viewMode !== "board" &&
          sections.map((section, sectionIndex) => {
          const sectionLinks = getLinksForSection(section.id);
          if (sectionLinks.length === 0 && (search || starredOnly || activeTags.length > 0))
            return null;

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
              activeTags={activeTags}
              onTagClick={toggleTag}
              selectMode={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
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

      {/* Панель пакетных операций (Задача 2.4) */}
      {selectMode && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-3">
          <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-2xl">
            {/* Выбрать всё видимое */}
            <button
              onClick={toggleSelectAll}
              className="hover:bg-sunken flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-foreground transition-colors"
              title={allVisibleSelected ? "Deselect all" : "Select all visible"}
            >
              <SelectCheckbox checked={allVisibleSelected} onToggle={toggleSelectAll} size={15} />
              <span>
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
              </span>
            </button>

            <div className="h-5 w-px bg-border" />

            {/* Переместить в секцию */}
            <div className="relative">
              <button
                onClick={() => setMoveMenuOpen((v) => !v)}
                disabled={selectedIds.size === 0}
                className="hover:bg-sunken flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FolderInput size={14} className="text-links" />
                <span className="hidden sm:inline">Move</span>
              </button>
              {moveMenuOpen && selectedIds.size > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoveMenuOpen(false)} />
                  <div className="absolute bottom-full left-0 z-20 mb-1 max-h-60 w-48 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-2xl">
                    <div className="px-3 py-1 text-[10px] tracking-wide text-subtle uppercase">
                      Move to section
                    </div>
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => bulkMove(s.id)}
                        className="hover:bg-sunken flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground transition-colors"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: s.color || "#FF9800" }}
                        />
                        <span className="truncate">{s.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Добавить тег */}
            <button
              onClick={bulkAddTag}
              disabled={selectedIds.size === 0}
              className="hover:bg-sunken flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Tag size={14} className="text-links" />
              <span className="hidden sm:inline">Tag</span>
            </button>

            {/* Удалить */}
            <button
              onClick={bulkDelete}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <div className="h-5 w-px bg-border" />

            <button
              onClick={exitSelectMode}
              className="hover:bg-sunken rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Import/Export modal */}
      {showImportExport && container && (
        <LinksImportExportModal container={container} onClose={() => setShowImportExport(false)} />
      )}
    </div>
  );
}
