import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useStore } from "../store";
import type { Workspace } from "../types";
import { Plus, Edit2, Trash2, ChevronDown, Check, Search } from "lucide-react";

const EMOJI_OPTIONS = ["🏠", "💼", "🎯", "🚀", "📚", "💡", "🎨", "🔧", "⚡", "🎮", "📁", "📊"];
const COLOR_OPTIONS = [
  "#6366f1",
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#E91E63",
  "#00BCD4",
  "#FF5722",
];

interface WorkspaceSwitcherProps {
  compact?: boolean;
}

export function WorkspaceSwitcher({ compact = false }: WorkspaceSwitcherProps) {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const MENU_W = 240;

  // Позиция меню считается от кнопки и рендерится порталом в body — иначе
  // overflow-hidden сайдбара обрезает выпадашку (Задача: воркспейсы).
  const openMenu = () => {
    const el = triggerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const left = Math.max(8, Math.min(r.left, window.innerWidth - MENU_W - 8));
      setMenuPos({ top: r.bottom + 4, left });
    }
    setMenuOpen(true);
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", icon: "🏠", color: "#6366f1" });

  const active =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? workspaces.filter((w) => w.name.toLowerCase().includes(q)) : workspaces;
  }, [workspaces, search]);

  const closeMenu = () => {
    setMenuOpen(false);
    setSearch("");
  };

  const handleCreate = () => {
    if (newWorkspace.name.trim()) {
      addWorkspace({
        name: newWorkspace.name.trim(),
        icon: newWorkspace.icon,
        color: newWorkspace.color,
      });
      setNewWorkspace({ name: "", icon: "🏠", color: "#6366f1" });
      setShowCreateModal(false);
    }
  };

  const handleEdit = (workspace: Workspace) => {
    if (editingWorkspace && editingWorkspace.name.trim()) {
      updateWorkspace(workspace.id, {
        name: editingWorkspace.name,
        icon: editingWorkspace.icon,
        color: editingWorkspace.color,
      });
      setEditingWorkspace(null);
    }
  };

  return (
    <div className="relative px-2 py-1.5">
      {/* Триггер — текущий воркспейс */}
      <button
        ref={triggerRef}
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
        title={active?.name}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        className={`hover:bg-sunken w-full rounded-lg transition-colors ${
          compact
            ? "flex flex-col items-center gap-0.5 px-1 py-1.5"
            : "flex items-center gap-2 px-2 py-1.5"
        }`}
        style={{
          background: active ? `${active.color}18` : "transparent",
          border: active ? `1px solid ${active.color}45` : "1px solid transparent",
        }}
      >
        {compact ? (
          // В compact — только короткое имя (без иконки, без шеврона), чтобы было
          // видно открытый воркспейс и не теснить 56px-рельс.
          <span
            className="max-w-full truncate text-[10px] leading-tight font-semibold"
            style={{ color: active?.color }}
          >
            {active?.name ?? "WS"}
          </span>
        ) : (
          <>
            <span className="text-base leading-none">{active?.icon ?? "🗂️"}</span>
            <span
              className="min-w-0 flex-1 truncate text-left text-xs font-semibold"
              style={{ color: active?.color }}
            >
              {active?.name ?? "Workspace"}
            </span>
            <ChevronDown size={14} className="text-subtle shrink-0" />
          </>
        )}
      </button>

      {/* Меню со всеми воркспейсами — портал в body, иначе overflow сайдбара режет */}
      {menuOpen &&
        menuPos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-60" onClick={closeMenu} />
            <div
              className="fixed z-61 rounded-xl border border-border bg-surface p-1 shadow-2xl"
              style={{ top: menuPos.top, left: menuPos.left, width: MENU_W }}
            >
            {/* Поиск — только когда воркспейсов много */}
            {workspaces.length > 6 && (
              <div className="relative mb-1">
                <Search
                  size={13}
                  className="text-subtle absolute top-1/2 left-2 -translate-y-1/2"
                />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search workspaces…"
                  className="w-full rounded-lg border border-border bg-background py-1.5 pr-2 pl-7 text-xs text-foreground placeholder-subtle outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="max-h-64 overflow-y-auto">
              {filtered.map((ws) => {
                const isActive = ws.id === active?.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      closeMenu();
                    }}
                    className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                      isActive ? "bg-sunken" : "hover:bg-sunken"
                    }`}
                  >
                    <span className="text-sm">{ws.icon}</span>
                    <span
                      className="min-w-0 flex-1 truncate text-xs font-medium text-foreground"
                      style={isActive ? { color: ws.color } : undefined}
                    >
                      {ws.name}
                    </span>
                    {isActive && <Check size={12} className="shrink-0" style={{ color: ws.color }} />}

                    {/* Rename / Delete — явные действия */}
                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWorkspace(ws);
                          closeMenu();
                        }}
                        className="hover:bg-background rounded p-1 text-subtle transition-colors hover:text-foreground"
                        title="Rename workspace"
                      >
                        <Edit2 size={12} />
                      </button>
                      {workspaces.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete workspace "${ws.name}"?`)) {
                              deleteWorkspace(ws.id);
                            }
                          }}
                          className="rounded p-1 text-subtle transition-colors hover:bg-red-500/15 hover:text-red-400"
                          title="Delete workspace"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="px-2 py-3 text-center text-xs text-subtle">No workspaces found</div>
              )}
            </div>

            <div className="my-1 h-px bg-border" />

            <button
              onClick={() => {
                setShowCreateModal(true);
                closeMenu();
              }}
              className="hover:bg-sunken flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              <Plus size={14} className="text-primary" />
              New workspace
            </button>
            </div>
          </>,
          document.body,
        )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-sm font-semibold text-foreground">Create Workspace</h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Name</label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  placeholder="My Workspace"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji, i) => (
                    <button
                      key={`${emoji}-${i}`}
                      onClick={() => setNewWorkspace({ ...newWorkspace, icon: emoji })}
                      className={`bg-background flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all ${
                        newWorkspace.icon === emoji ? "ring-2 ring-primary" : ""
                      }`}
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
                      onClick={() => setNewWorkspace({ ...newWorkspace, color })}
                      className={`h-6 w-6 rounded-full transition-all ${
                        newWorkspace.color === color
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                          : ""
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-background flex-1 rounded-lg px-4 py-2 text-sm font-medium text-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingWorkspace(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-sm font-semibold text-foreground">Edit Workspace</h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Name</label>
                <input
                  type="text"
                  value={editingWorkspace.name}
                  onChange={(e) =>
                    setEditingWorkspace({ ...editingWorkspace, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji, i) => (
                    <button
                      key={`${emoji}-${i}`}
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, icon: emoji })}
                      className={`bg-background flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all ${
                        editingWorkspace.icon === emoji ? "ring-2 ring-primary" : ""
                      }`}
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
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, color })}
                      className={`h-6 w-6 rounded-full transition-all ${
                        editingWorkspace.color === color
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                          : ""
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setEditingWorkspace(null)}
                className="bg-background flex-1 rounded-lg px-4 py-2 text-sm font-medium text-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEdit(editingWorkspace)}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
