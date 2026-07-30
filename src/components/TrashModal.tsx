import { useStore } from "../store";
import { Trash2, RotateCcw, X, FileText, Code, Link, MessageSquare, BookOpen } from "lucide-react";
import type { TrashItem } from "../types";

const TYPE_ICONS = {
  note: FileText,
  command: Code,
  link: Link,
  prompt: MessageSquare,
  playbook: BookOpen,
};

// Акценты типов — зеркалят токены --accent-* (hex: используются в тинтах `${color}20`)
const TYPE_COLORS = {
  note: "#3fb950",
  command: "#58a6ff",
  link: "#f0883e",
  prompt: "#bc8cff",
  playbook: "#39c5cf",
};

export function TrashModal() {
  const {
    showTrash,
    setShowTrash,
    trash,
    restoreFromTrash,
    permanentlyDelete,
    clearTrash,
  } = useStore();

  if (!showTrash) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleRestore = (trashId: string) => {
    restoreFromTrash(trashId);
  };

  const handleDelete = (trashId: string) => {
    if (confirm("Permanently delete this item?")) {
      permanentlyDelete(trashId);
    }
  };

  const handleClearAll = () => {
    if (confirm("Permanently delete all items in trash?")) {
      clearTrash();
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setShowTrash(false)}
    >
      <div
        className="modal-sheet flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)" }}
            >
              <Trash2 size={20} className="text-danger" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Trash
              </h2>
              <p className="text-xs text-subtle">
                {trash.length} item{trash.length !== 1 ? "s" : ""} deleted
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTrash(false)}
            className="rounded-lg p-2 transition-colors hover:bg-sunken"
          >
            <X size={20} className="text-subtle" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {trash.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-subtle">
              <Trash2 size={48} className="mb-4 opacity-50" />
              <p>Trash is empty</p>
              <p className="mt-1 text-xs">Deleted items will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trash.map((item: TrashItem) => {
                const Icon = TYPE_ICONS[item.type];
                const color = TYPE_COLORS[item.type];
                const title = "title" in item.item ? item.item.title : "Untitled";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-sunken"
                    style={{ background: "var(--bg-sunken)" }}
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${color}20` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {title}
                      </div>
                      <div className="truncate text-xs text-subtle">
                        {item.workspaceName} → {item.categoryName} → {item.folderName}
                      </div>
                      <div className="mt-1 text-[10px] text-subtle">
                        Deleted: {formatDate(item.deletedAt)}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="group rounded-lg p-2 transition-colors hover:bg-success/15"
                        title="Restore"
                      >
                        <RotateCcw
                          size={16}
                          className="text-subtle group-hover:text-success"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="group rounded-lg p-2 transition-colors hover:bg-danger/15"
                        title="Delete permanently"
                      >
                        <Trash2 size={16} className="text-subtle group-hover:text-danger" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {trash.length > 0 && (
          <div
            className="flex justify-end border-t p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={handleClearAll}
              className="rounded-lg bg-danger/10 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20"
            >
              Empty Trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
