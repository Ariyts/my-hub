import { useState } from "react";
import { Settings2, Plus, Check, Edit3, Trash2 } from "lucide-react";
import { useStore } from "../../store";
import type { PlaybookVariable } from "../../types";
import { BRAND } from "./constants";

interface Props {
  containerId: string;
  variables: PlaybookVariable[];
}

export function ContextPanel({ containerId, variables }: Props) {
  const { addPlaybookVariable, updatePlaybookVariable, deletePlaybookVariable } = useStore();
  const [expanded, setExpanded] = useState(variables.length > 0);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      addPlaybookVariable(
        containerId,
        newName.trim(),
        newValue.trim(),
        newDesc.trim() || undefined,
      );
      setNewName("");
      setNewValue("");
      setNewDesc("");
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      setAdding(false);
    }
  };

  return (
    <div className="border-t border-border bg-surface/30 backdrop-blur-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-2 transition-colors hover:bg-sunken"
      >
        <Settings2 size={13} className="text-playbooks" />
        <span className="text-xs font-semibold text-muted">Context Variables</span>
        <span className="text-[10px] text-subtle">({variables.length})</span>
        <div className="flex-1" />
        {variables.length > 0 && (
          <div className="flex items-center gap-1">
            {variables.slice(0, 3).map((v) => (
              <span
                key={v.id}
                className="rounded border px-1.5 py-0.5 font-mono text-[9px]"
                style={{
                  color: v.color || BRAND,
                  background: `${v.color || BRAND}15`,
                  borderColor: `${v.color || BRAND}40`,
                }}
              >
                ${v.name}
              </span>
            ))}
            {variables.length > 3 && (
              <span className="text-[9px] text-subtle">+{variables.length - 3}</span>
            )}
          </div>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="animate-in space-y-2 px-4 pb-3">
          {variables.length === 0 && !adding && (
            <p className="text-[11px] text-subtle italic">
              No variables defined. Add variables like TARGET, PORTS to auto-substitute in commands.
            </p>
          )}

          {/* Variable list */}
          <div className="space-y-1.5">
            {variables.map((v) => (
              <VariableRow
                key={v.id}
                variable={v}
                onUpdate={(patch) => updatePlaybookVariable(containerId, v.id, patch)}
                onDelete={() => deletePlaybookVariable(containerId, v.id)}
              />
            ))}
          </div>

          {/* Add form */}
          {adding ? (
            <div className="space-y-1.5 rounded-lg border border-playbooks/40 bg-playbooks/5 p-2">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="NAME (e.g. TARGET)"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground outline-none focus:border-playbooks"
                />
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="value (e.g. 10.10.10.5)"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-playbooks"
                />
              </div>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="description (optional)"
                className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-playbooks"
              />
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => setAdding(false)}
                  className="rounded px-2 py-1 text-[11px] text-muted transition-colors hover:bg-sunken"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex items-center gap-1 rounded bg-playbooks/20 px-2 py-1 text-[11px] font-medium text-playbooks transition-colors hover:bg-playbooks/30 disabled:opacity-40"
                >
                  <Check size={11} />
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-sunken px-3 py-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-sunken hover:text-foreground"
            >
              <Plus size={12} />
              Add Variable
            </button>
          )}

          <p className="text-[10px] leading-relaxed text-subtle">
            Use <code className="text-playbooks">$NAME</code> or{" "}
            <code className="text-playbooks">{"${NAME}"}</code> in commands. Values will be
            auto-substituted in Engagement mode.
          </p>
        </div>
      )}
    </div>
  );
}

// ===================== Variable Row =====================

interface VarRowProps {
  variable: PlaybookVariable;
  onUpdate: (patch: Partial<PlaybookVariable>) => void;
  onDelete: () => void;
}

function VariableRow({ variable, onUpdate, onDelete }: VarRowProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(variable.name);
  const [editValue, setEditValue] = useState(variable.value);
  const [editDesc, setEditDesc] = useState(variable.description || "");

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate({
        name: editName.trim(),
        value: editValue.trim(),
        description: editDesc.trim() || undefined,
      });
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(variable.name);
    setEditValue(variable.value);
    setEditDesc(variable.description || "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (editing) {
    return (
      <div className="space-y-1.5 rounded-lg border border-border-subtle bg-background/60 p-2">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded border border-border bg-surface px-2 py-1 font-mono text-xs text-foreground outline-none focus:border-playbooks"
          />
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-playbooks"
          />
        </div>
        <input
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="description"
          className="w-full rounded border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-playbooks"
        />
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleCancel}
            className="rounded px-2 py-1 text-[11px] text-muted transition-colors hover:bg-sunken"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editName.trim()}
            className="flex items-center gap-1 rounded bg-success/20 px-2 py-1 text-[11px] font-medium text-success transition-colors hover:bg-success/30 disabled:opacity-40"
          >
            <Check size={11} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-lg border border-border bg-background/40 px-2 py-1.5 transition-colors hover:border-border-subtle">
      <div
        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ background: variable.color || BRAND }}
      />
      <code
        className="font-mono text-xs font-semibold"
        style={{ color: variable.color || BRAND }}
      >
        ${variable.name}
      </code>
      <span className="text-subtle">=</span>
      <span className="flex-1 truncate font-mono text-xs text-muted">
        {variable.value || <span className="text-subtle italic">(empty)</span>}
      </span>
      {variable.description && (
        <span
          className="max-w-[200px] truncate text-[10px] text-subtle"
          title={variable.description}
        >
          {variable.description}
        </span>
      )}
      <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => setEditing(true)}
          className="rounded p-1 text-muted transition-colors hover:bg-sunken hover:text-playbooks"
        >
          <Edit3 size={11} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete variable $${variable.name}?`)) onDelete();
          }}
          className="rounded p-1 text-muted transition-colors hover:bg-danger/15 hover:text-danger"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}
