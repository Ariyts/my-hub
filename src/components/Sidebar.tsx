import { useState, useRef } from "react";
import { useStore } from "../store";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMobileDrawer } from "../hooks/useMobileDrawer";
import { useLongPress } from "../hooks/useLongPress";
import type { Category, BaseDataType } from "../types";
import {
  Settings,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  GripVertical,
  RotateCcw,
  PanelLeftClose,
  PanelLeft,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

// Человекочитаемые имена для новых категорий (иначе выходило «New playbooks»)
const BASE_TYPE_NAMES: Record<BaseDataType, string> = {
  notes: "Notes",
  commands: "Commands",
  links: "Links",
  prompts: "Prompts",
  playbooks: "Playbooks",
};

const BASE_TYPE_OPTIONS: { value: BaseDataType; label: string }[] = [
  { value: "notes", label: "Notes (text content)" },
  { value: "commands", label: "Commands (code snippets)" },
  { value: "links", label: "Links (URLs)" },
  { value: "prompts", label: "Prompts (AI templates)" },
  { value: "playbooks", label: "Playbooks (service commands)" },
];

const EMOJI_OPTIONS = [
  "📝",
  "⌘",
  "🔗",
  "💬",
  "📁",
  "🏷️",
  "📌",
  "🔖",
  "📋",
  "📊",
  "🗂️",
  "📚",
  "💡",
  "🎯",
  "⭐",
  "🚀",
  "💻",
  "🎨",
  "🔧",
  "⚡",
];
const COLOR_OPTIONS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#E91E63",
  "#00BCD4",
  "#FF5722",
  "#795548",
  "#607D8B",
  "#3F51B5",
];

export function Sidebar() {
  const {
    activeWorkspaceId,
    categories,
    activeCategoryId,
    setActiveCategoryId,
    setShowSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    notes,
    commands,
    links,
    prompts,
    playbooks,
    trash,
    setShowTrash,
    sidebarCompact,
    toggleSidebarCompact,
    isSidebarOpen,
    closeMobilePanels,
    toggleFolderPanel,
  } = useStore();

  const isMobile = useIsMobile();

  // Esc, блокировка прокрутки фона, фокус в панели, закрытие свайпом
  const { panelRef, swipeHandlers } = useMobileDrawer(isMobile, isSidebarOpen, closeMobilePanels);

  // На узком экране панель всегда развёрнута: компактный режим (иконки без подписей)
  // там бессмысленен — шторка и так поверх контента, экономить ширину не на чем
  const compact = isMobile ? false : sidebarCompact;

  // Какую категорию удерживают: обработчики общие для всех строк списка
  const longPressCategoryId = useRef<string | null>(null);

  // На тач-экранах правого клика нет — меню категории открывается долгим нажатием
  const categoryLongPress = useLongPress((x, y) => {
    if (longPressCategoryId.current) {
      setContextMenu({ id: longPressCategoryId.current, x, y });
    }
  });

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Filter categories for current workspace
  const workspaceCategories = categories
    .filter((c) => c.workspaceId === activeWorkspaceId)
    .sort((a, b) => a.order - b.order);

  const handleAddCategory = (baseType: BaseDataType) => {
    addCategory({
      workspaceId: activeWorkspaceId!,
      name: BASE_TYPE_NAMES[baseType],
      icon: "📁",
      color: "#6366f1",
      baseType,
      isDefault: false,
    });
    setShowAddMenu(false);
  };

  const handleEditCategory = (category: Category) => {
    if (!editingCategory.name?.trim()) return;

    updateCategory(category.id, {
      name: editingCategory.name || category.name,
      icon: editingCategory.icon || category.icon,
      color: editingCategory.color || category.color,
    });

    setShowEditModal(null);
    setEditingCategory({});
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) return;
    deleteCategory(category.id);
    setContextMenu(null);
  };

  // Перестановка на шаг вверх/вниз: замена перетаскиванию, которого нет на тач-экранах
  const canMoveCategory = (categoryId: string, delta: -1 | 1) => {
    const index = workspaceCategories.findIndex((c) => c.id === categoryId);
    const target = index + delta;
    return index !== -1 && target >= 0 && target < workspaceCategories.length;
  };

  const moveCategory = (categoryId: string, delta: -1 | 1) => {
    if (!activeWorkspaceId || !canMoveCategory(categoryId, delta)) return;

    const ids = workspaceCategories.map((c) => c.id);
    const index = ids.indexOf(categoryId);
    [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];

    reorderCategories(activeWorkspaceId, ids);
    setContextMenu(null);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory({ ...category });
    setShowEditModal(category);
    setContextMenu(null);
  };

  // Get item count for a category
  const getItemCount = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return 0;

    const categoryFolderIds = useStore
      .getState()
      .folders.filter((f) => f.categoryId === categoryId)
      .map((f) => f.id);

    switch (category.baseType) {
      case "notes":
        return notes.filter((n) => categoryFolderIds.includes(n.folderId)).length;
      case "commands":
        return commands.filter((c) => categoryFolderIds.includes(c.folderId)).length;
      case "links":
        return links.filter((l) => categoryFolderIds.includes(l.folderId)).length;
      case "prompts":
        return prompts.filter((p) => categoryFolderIds.includes(p.folderId)).length;
      case "playbooks":
        return playbooks.filter((pb) => categoryFolderIds.includes(pb.folderId)).length;
      default:
        return 0;
    }
  };

  // На десктопе — колонка в потоке. На мобильном — выдвижная панель поверх контента.
  // Цвет фона/границы — через токены (bg-background / border-border на элементе).
  const asideStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 40,
        width: "min(80vw, 280px)",
        paddingTop: "var(--safe-top)",
        paddingBottom: "var(--safe-bottom)",
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease-out",
        boxShadow: isSidebarOpen ? "0 0 24px rgba(0, 0, 0, 0.35)" : "none",
      }
    : {
        width: compact ? "56px" : "200px",
        minWidth: compact ? "56px" : "200px",
      };

  const isHidden = isMobile && !isSidebarOpen;

  return (
    <>
      {/* Затемнение фона: клик по нему закрывает панель */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={closeMobilePanels}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/50"
        />
      )}

      <aside
        ref={panelRef}
        tabIndex={-1}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile && isSidebarOpen ? true : undefined}
        aria-label={isMobile ? "Categories" : undefined}
        aria-hidden={isHidden || undefined}
        {...swipeHandlers}
        className={`relative z-20 flex flex-col overflow-hidden border-r border-border bg-background transition-all duration-300 ease-in-out outline-none ${
          isHidden ? "pointer-events-none" : ""
        }`}
        style={asideStyle}
      >
        {/* Workspace Switcher with compact toggle.
            В compact ширина всего 56px — воркспейс и переключатель не помещаются
            в один ряд, поэтому стек по вертикали (каждому вся ширина). */}
        <div
          className={`border-b border-border ${compact ? "flex flex-col-reverse items-stretch" : "flex items-center"}`}
        >
          <div className={compact ? "w-full" : "flex-1 overflow-hidden"}>
            <WorkspaceSwitcher compact={compact} />
          </div>
          {isMobile ? (
            <button
              onClick={closeMobilePanels}
              aria-label="Close categories panel"
              title="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-sunken"
            >
              <X size={20} className="text-subtle" />
            </button>
          ) : (
            <button
              onClick={toggleSidebarCompact}
              className={`shrink-0 p-2 transition-colors hover:bg-sunken ${
                compact ? "flex w-full justify-center" : ""
              }`}
              title={compact ? "Expand sidebar" : "Collapse sidebar"}
            >
              {compact ? (
                <PanelLeft size={16} className="text-subtle" />
              ) : (
                <PanelLeftClose size={16} className="text-subtle" />
              )}
            </button>
          )}
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto py-2">
          {!compact && (
            <div className="mb-2 px-3">
              <span className="text-[10px] font-semibold tracking-wider text-subtle uppercase">
                Categories
              </span>
            </div>
          )}

          {workspaceCategories.map((category, index) => {
            const isActive = activeCategoryId === category.id;
            const isDragging = draggedCategoryId === category.id;
            const isDropTarget = dropTargetId === category.id;
            const itemCount = getItemCount(category.id);

            return (
              <div
                key={category.id}
                className="group relative px-1"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  setDraggedCategoryId(category.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedCategoryId && draggedCategoryId !== category.id) {
                    setDropTargetId(category.id);
                  }
                }}
                onDragLeave={() => {
                  setDropTargetId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedCategoryId && draggedCategoryId !== category.id && activeWorkspaceId) {
                    // Reorder categories
                    const newOrder = [...workspaceCategories.map((c) => c.id)];
                    const draggedIndex = newOrder.indexOf(draggedCategoryId);
                    const targetIndex = newOrder.indexOf(category.id);

                    // Remove dragged item and insert at new position
                    newOrder.splice(draggedIndex, 1);
                    newOrder.splice(targetIndex, 0, draggedCategoryId);

                    reorderCategories(activeWorkspaceId, newOrder);
                  }
                  setDraggedCategoryId(null);
                  setDropTargetId(null);
                }}
                onDragEnd={() => {
                  setDraggedCategoryId(null);
                  setDropTargetId(null);
                }}
                style={{
                  opacity: isDragging ? 0.5 : 1,
                }}
              >
                {/* Drop indicator line */}
                {isDropTarget && !isDragging && (
                  <div
                    className="absolute right-0 left-0 z-10 h-0.5 rounded bg-primary"
                    style={{ top: index === 0 ? "0" : "50%" }}
                  />
                )}

                <button
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    // Категория выбрана — уводим с глаз панель и сразу показываем папки
                    if (isMobile) {
                      closeMobilePanels();
                      toggleFolderPanel();
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ id: category.id, x: e.clientX, y: e.clientY });
                  }}
                  {...categoryLongPress}
                  onPointerDown={(e) => {
                    longPressCategoryId.current = category.id;
                    categoryLongPress.onPointerDown(e);
                  }}
                  title={compact ? category.name : undefined}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200"
                  style={{
                    background: isActive
                      ? `${category.color}22`
                      : isDropTarget
                        ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                        : "transparent",
                    border: isActive
                      ? `1px solid ${category.color}40`
                      : isDropTarget
                        ? "1px solid var(--primary)"
                        : "1px solid transparent",
                    justifyContent: compact ? "center" : "flex-start",
                  }}
                >
                  {/* Drag handle - hidden in compact mode */}
                  {!compact && (
                    <div
                      className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <GripVertical size={12} className="text-subtle" />
                    </div>
                  )}
                  <span className="text-base">{category.icon}</span>
                  {!compact && (
                    <>
                      <span
                        className="flex-1 truncate text-left text-sm font-medium"
                        style={{
                          color: isActive ? category.color : "var(--text-muted)",
                        }}
                      >
                        {category.name}
                      </span>
                      <span className="rounded-full bg-sunken px-1.5 py-0.5 text-[10px] font-medium text-subtle">
                        {itemCount}
                      </span>
                    </>
                  )}
                </button>

                {/* Context menu button - hidden in compact mode */}
                {!compact && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenu({ id: category.id, x: e.clientX, y: e.clientY });
                    }}
                    aria-label="Category options"
                    className="tap-target absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-sunken"
                  >
                    <MoreHorizontal size={12} className="text-muted" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add category button */}
          <div className="mt-2 px-2">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              title={compact ? "Add Category" : undefined}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition-all hover:bg-sunken"
              style={{
                justifyContent: compact ? "center" : "flex-start",
              }}
            >
              <Plus size={14} />
              {!compact && <span>Add Category</span>}
            </button>
          </div>
        </nav>

        {/* Add Category Menu */}
        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
            <div className="absolute bottom-16 left-2 z-50 min-w-[160px] rounded-xl border border-border bg-surface p-2 shadow-xl">
              <div className="mb-1 px-2 py-1 text-[10px] tracking-wider text-muted uppercase">
                Choose base type:
              </div>
              {BASE_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAddCategory(option.value)}
                  className="w-full rounded-lg px-2 py-2 text-left text-xs text-foreground transition-colors hover:bg-sunken"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Context Menu */}
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <div
              className="fixed z-50 min-w-[120px] rounded-xl border border-border bg-surface p-1 shadow-xl"
              style={{
                left: contextMenu.x + 10,
                top: contextMenu.y,
              }}
            >
              <button
                onClick={() => {
                  const category = workspaceCategories.find((c) => c.id === contextMenu.id);
                  if (category) openEditModal(category);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-sunken"
              >
                <Edit2 size={12} /> Edit
              </button>

              {/* Порядок: перетаскивание работает только мышью, пальцем — этими кнопками */}
              <button
                onClick={() => moveCategory(contextMenu.id, -1)}
                disabled={!canMoveCategory(contextMenu.id, -1)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp size={12} /> Move up
              </button>
              <button
                onClick={() => moveCategory(contextMenu.id, 1)}
                disabled={!canMoveCategory(contextMenu.id, 1)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDown size={12} /> Move down
              </button>
              {(() => {
                const category = workspaceCategories.find((c) => c.id === contextMenu.id);
                return category && !category.isDefault ? (
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-danger transition-colors hover:bg-danger/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                ) : null;
              })()}
            </div>
          </>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowEditModal(null)}
          >
            <div
              className="w-full max-w-xs rounded-xl border border-border bg-surface p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-1 text-sm font-semibold text-foreground">Edit Category</h3>
              {showEditModal?.isDefault && (
                <p className="mb-3 text-[10px] text-subtle">Default category - cannot delete</p>
              )}

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted">Name</label>
                  <input
                    type="text"
                    value={editingCategory.name || ""}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted">Icon</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setEditingCategory({ ...editingCategory, icon: emoji })}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background text-lg transition-all ${editingCategory.icon === emoji ? "ring-2 ring-primary" : ""}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted">Color</label>
                  <div className="flex flex-wrap gap-1">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingCategory({ ...editingCategory, color })}
                        className={`h-6 w-6 rounded-full transition-all ${editingCategory.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 rounded-lg bg-sunken px-4 py-2 text-sm font-medium text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => showEditModal && handleEditCategory(showEditModal)}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom - Trash & Settings */}
        <div className="border-t border-border p-2">
          {/* Trash button */}
          <button
            onClick={() => setShowTrash(true)}
            title={compact ? "Trash" : undefined}
            className="mb-1 flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition-all hover:bg-sunken"
            style={{
              justifyContent: compact ? "center" : "space-between",
            }}
          >
            <div className="flex items-center gap-2">
              <Trash2 size={14} />
              {!compact && <span>Trash</span>}
            </div>
            {!compact && trash.length > 0 && (
              <span className="rounded-full bg-danger/15 px-1.5 py-0.5 text-[10px] font-medium text-danger">
                {trash.length}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            title={compact ? "Settings" : undefined}
            className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-all hover:bg-sunken"
            style={{
              justifyContent: compact ? "center" : "flex-start",
            }}
          >
            <Settings size={14} />
            {!compact && <span>Settings</span>}
          </button>

          {/* Reset button - clears localStorage and reloads */}
          <button
            onClick={() => {
              if (confirm("Reset to default data? All your changes will be lost.")) {
                localStorage.removeItem("knowledge-hub-storage");
                window.location.reload();
              }
            }}
            title={compact ? "Reset" : undefined}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-warning transition-all hover:bg-warning/10"
            style={{
              justifyContent: compact ? "center" : "flex-start",
            }}
          >
            <RotateCcw size={14} />
            {!compact && <span>Reset</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
