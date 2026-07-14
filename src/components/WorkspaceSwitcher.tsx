import { useState } from "react";
import { useStore } from "../store";
import type { Workspace } from "../types";
import { Plus, Edit2, Trash2 } from "lucide-react";

const EMOJI_OPTIONS = ["🏠", "💼", "🎯", "🚀", "📚", "💡", "🎨", "🔧", "⚡", "🎮", "🏠", "📊"];
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
    isDarkTheme,
  } = useStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", icon: "🏠", color: "#6366f1" });

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

  const bg = isDarkTheme ? "#1e293b" : "#ffffff";
  const textColor = isDarkTheme ? "#e2e8f0" : "#1e293b";

  return (
    <div className="flex items-center gap-1 px-2 py-1.5">
      {/* Workspace list */}
      {workspaces.map((workspace) => {
        const isActive = activeWorkspaceId === workspace.id;
        return (
          <div key={workspace.id} className="group relative">
            <button
              onClick={() => setActiveWorkspaceId(workspace.id)}
              title={compact ? workspace.name : undefined}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all duration-200"
              style={{
                background: isActive ? `${workspace.color}22` : "transparent",
                border: isActive ? `1px solid ${workspace.color}50` : "1px solid transparent",
                justifyContent: compact ? "center" : "flex-start",
              }}
            >
              <span className="text-sm">{workspace.icon}</span>
              {!compact && (
                <span
                  className="max-w-[60px] truncate text-xs font-medium"
                  style={{
                    color: isActive ? workspace.color : isDarkTheme ? "#94a3b8" : "#64748b",
                  }}
                >
                  {workspace.name}
                </span>
              )}
            </button>

            {/* Edit/Delete buttons on hover - hidden in compact mode */}
            {!compact && (
              <div className="absolute top-0 right-0 bottom-0 flex items-center gap-0.5 bg-gradient-to-l from-transparent via-transparent to-[#1e293b] pr-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingWorkspace(workspace);
                  }}
                  className="rounded p-0.5 hover:bg-slate-600"
                >
                  <Edit2 size={10} className="text-slate-400" />
                </button>
                {workspaces.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete workspace "${workspace.name}"?`)) {
                        deleteWorkspace(workspace.id);
                      }
                    }}
                    className="rounded p-0.5 hover:bg-red-900/30"
                  >
                    <Trash2 size={10} className="text-red-400" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add workspace button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="rounded-lg p-1.5 transition-colors hover:bg-slate-700"
        title="Add workspace"
      >
        <Plus size={14} className="text-slate-400" />
      </button>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-5"
            style={{ background: bg, border: "1px solid #334155" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-sm font-semibold" style={{ color: textColor }}>
              Create Workspace
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Name</label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  placeholder="My Workspace"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    background: isDarkTheme ? "#0f172a" : "#f1f5f9",
                    color: textColor,
                    border: "1px solid #334155",
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewWorkspace({ ...newWorkspace, icon: emoji })}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all ${newWorkspace.icon === emoji ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ background: isDarkTheme ? "#0f172a" : "#f1f5f9" }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Color</label>
                <div className="flex flex-wrap gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewWorkspace({ ...newWorkspace, color })}
                      className={`h-6 w-6 rounded-full transition-all ${newWorkspace.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: isDarkTheme ? "#0f172a" : "#f1f5f9", color: "#94a3b8" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setEditingWorkspace(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-5"
            style={{ background: bg, border: "1px solid #334155" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-sm font-semibold" style={{ color: textColor }}>
              Edit Workspace
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Name</label>
                <input
                  type="text"
                  value={editingWorkspace.name}
                  onChange={(e) =>
                    setEditingWorkspace({ ...editingWorkspace, name: e.target.value })
                  }
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    background: isDarkTheme ? "#0f172a" : "#f1f5f9",
                    color: textColor,
                    border: "1px solid #334155",
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, icon: emoji })}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all ${editingWorkspace.icon === emoji ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ background: isDarkTheme ? "#0f172a" : "#f1f5f9" }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Color</label>
                <div className="flex flex-wrap gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, color })}
                      className={`h-6 w-6 rounded-full transition-all ${editingWorkspace.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setEditingWorkspace(null)}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: isDarkTheme ? "#0f172a" : "#f1f5f9", color: "#94a3b8" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleEdit(editingWorkspace)}
                className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
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
