import { useState } from 'react';
import { Settings2, Plus, Check, Edit3, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import type { PlaybookVariable } from '../../types';

interface Props {
  containerId: string;
  variables: PlaybookVariable[];
}

export function ContextPanel({ containerId, variables }: Props) {
  const { addPlaybookVariable, updatePlaybookVariable, deletePlaybookVariable } = useStore();
  const [expanded, setExpanded] = useState(variables.length > 0);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      addPlaybookVariable(containerId, newName.trim(), newValue.trim(), newDesc.trim() || undefined);
      setNewName('');
      setNewValue('');
      setNewDesc('');
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      setAdding(false);
    }
  };

  return (
    <div className="border-t border-slate-800/60 bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-800/40 transition-colors"
      >
        <Settings2 size={13} className="text-cyan-400" />
        <span className="text-xs font-semibold text-slate-300">Context Variables</span>
        <span className="text-[10px] text-slate-500">({variables.length})</span>
        <div className="flex-1" />
        {variables.length > 0 && (
          <div className="flex items-center gap-1">
            {variables.slice(0, 3).map((v) => (
              <span
                key={v.id}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                style={{
                  color: v.color || '#00BCD4',
                  background: `${v.color || '#00BCD4'}15`,
                  borderColor: `${v.color || '#00BCD4'}40`,
                }}
              >
                ${v.name}
              </span>
            ))}
            {variables.length > 3 && (
              <span className="text-[9px] text-slate-500">+{variables.length - 3}</span>
            )}
          </div>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2 animate-in">
          {variables.length === 0 && !adding && (
            <p className="text-[11px] text-slate-500 italic">
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
            <div className="rounded-lg border border-cyan-400/40 bg-cyan-500/5 p-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  onKeyDown={handleKeyDown}
                  placeholder="NAME (e.g. TARGET)"
                  className="flex-1 text-xs font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
                />
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="value (e.g. 10.10.10.5)"
                  className="flex-1 text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
                />
              </div>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="description (optional)"
                className="w-full text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
              />
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => setAdding(false)}
                  className="px-2 py-1 rounded text-[11px] text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors disabled:opacity-40"
                >
                  <Check size={11} />
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 bg-slate-800/40 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50 transition-colors"
            >
              <Plus size={12} />
              Add Variable
            </button>
          )}

          <p className="text-[10px] text-slate-500 leading-relaxed">
            Use <code className="text-cyan-400">$NAME</code> or <code className="text-cyan-400">{'${NAME}'}</code> in commands.
            Values will be auto-substituted in Engagement mode.
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
  const [editDesc, setEditDesc] = useState(variable.description || '');

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
    setEditDesc(variable.description || '');
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (editing) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
          />
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
          />
        </div>
        <input
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="description"
          className="w-full text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-cyan-400"
        />
        <div className="flex items-center gap-1 justify-end">
          <button onClick={handleCancel} className="px-2 py-1 rounded text-[11px] text-slate-400 hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editName.trim()}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors disabled:opacity-40"
          >
            <Check size={11} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-2 py-1.5 hover:border-slate-700 transition-colors">
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: variable.color || '#00BCD4' }} />
      <code className="text-xs font-mono font-semibold" style={{ color: variable.color || '#00BCD4' }}>
        ${variable.name}
      </code>
      <span className="text-slate-600">=</span>
      <span className="flex-1 text-xs text-slate-300 font-mono truncate">{variable.value || <span className="italic text-slate-500">(empty)</span>}</span>
      {variable.description && (
        <span className="text-[10px] text-slate-500 truncate max-w-[200px]" title={variable.description}>
          {variable.description}
        </span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
        >
          <Edit3 size={11} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete variable $${variable.name}?`)) onDelete();
          }}
          className="p-1 rounded text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}
