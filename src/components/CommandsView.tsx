import { useState } from 'react';
import { useStore } from '../store';
import type { CommandContainer, CommandItem } from '../types';
import {
  ChevronDown, ChevronRight, Plus, Copy, Edit3, Trash2, Check,
  Search, Star, Terminal, X
} from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  bash: '#4CAF50', zsh: '#4CAF50', powershell: '#2196F3',
  cmd: '#FF9800', python: '#9C27B0', javascript: '#F7DF1E',
};

interface SubItemCardProps {
  item: CommandItem;
  containerId: string;
  isDark: boolean;
}

function SubItemCard({ item, containerId, isDark }: SubItemCardProps) {
  const { updateCommandItem, deleteCommandItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });

  const handleCopy = () => {
    navigator.clipboard.writeText(item.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateCommandItem(containerId, item.id, editData);
    setEditing(false);
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#1e293b' : '#f8fafc';
  const codeBg = isDark ? '#0f172a' : '#f1f5f9';

  if (editing) {
    return (
      <div className="rounded-xl border p-4 space-y-3" style={{ background: bg, borderColor: border }}>
        <input
          className="w-full text-sm font-mono px-3 py-2 rounded-lg border outline-none"
          style={{ background: codeBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b', fontFamily: 'monospace' }}
          value={editData.command}
          onChange={(e) => setEditData({ ...editData, command: e.target.value })}
          placeholder="Command..."
        />
        <input
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
          style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          placeholder="Description..."
        />
        <div className="flex gap-2">
          <select
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            value={editData.language}
            onChange={(e) => setEditData({ ...editData, language: e.target.value as CommandItem['language'] })}
          >
            {['bash', 'zsh', 'powershell', 'cmd', 'python', 'javascript'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <input
            className="flex-1 text-xs px-2 py-1 rounded border outline-none"
            style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            value={editData.tags.join(', ')}
            onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="tags, comma, separated"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#2196F315', color: '#2196F3' }}>Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border transition-all duration-150 overflow-hidden" style={{ background: bg, borderColor: border }}>
      <div className="px-4 py-3">
        <div
          className="font-mono text-sm px-3 py-2 rounded-lg mb-2 flex items-start justify-between gap-2 overflow-x-auto"
          style={{ background: codeBg, borderLeft: `3px solid ${LANG_COLORS[item.language] || '#64748b'}` }}
        >
          <code style={{ color: isDark ? '#a5f3fc' : '#0369a1', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '13px' }}>
            {item.command}
          </code>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0"
            style={{ background: `${LANG_COLORS[item.language] || '#64748b'}20`, color: LANG_COLORS[item.language] || '#64748b' }}
          >
            {item.language}
          </span>
        </div>
        {item.description && (
          <p className="text-sm mb-2" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{item.description}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
              #{tag}
            </span>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => updateCommandItem(containerId, item.id, { isFavorite: !item.isFavorite })}
            className="p-1 rounded hover:bg-amber-50 transition-colors"
          >
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
          </button>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
            style={{ color: '#64748b', background: isDark ? '#334155' : '#f1f5f9' }}
          >
            <Edit3 size={11} /> Edit
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all"
            style={{ background: copied ? '#4CAF5020' : '#2196F315', color: copied ? '#4CAF50' : '#2196F3' }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => deleteCommandItem(containerId, item.id)}
            className="p-1 rounded hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ContainerCardProps {
  container: CommandContainer;
  isDark: boolean;
}

function ContainerCard({ container, isDark }: ContainerCardProps) {
  const { updateCommandContainer, deleteCommandContainer, addCommandItem } = useStore();
  const [localExpanded, setLocalExpanded] = useState(container.isExpanded !== false);
  const [searchQ, setSearchQ] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [newCmd, setNewCmd] = useState({ command: '', description: '', language: 'bash' as CommandItem['language'], tags: [] as string[], isFavorite: false });

  const filtered = container.subItems.filter(i =>
    i.command.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.description.toLowerCase().includes(searchQ.toLowerCase())
  );

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headBg = isDark ? '#1e293b' : '#f8fafc';

  const handleAddItem = () => {
    if (newCmd.command.trim()) {
      addCommandItem(container.id, newCmd);
      setNewCmd({ command: '', description: '', language: 'bash', tags: [], isFavorite: false });
      setAddingItem(false);
    }
  };

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ background: bg, borderColor: border }}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{ background: headBg, borderBottom: localExpanded ? `1px solid ${border}` : 'none' }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        <button className="flex-shrink-0">
          {localExpanded ? <ChevronDown size={16} style={{ color: '#2196F3' }} /> : <ChevronRight size={16} style={{ color: '#2196F3' }} />}
        </button>
        <Terminal size={16} style={{ color: '#2196F3' }} />
        <span className="flex-1 font-semibold text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
          {container.title}
        </span>
        {container.description && (
          <span className="text-xs hidden sm:block" style={{ color: '#94a3b8' }}>{container.description}</span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#2196F315', color: '#2196F3' }}>
          {container.subItems.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); if (confirm('Delete this container?')) deleteCommandContainer(container.id); }}
          className="p-1 rounded hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} className="text-red-400 opacity-0 group-hover:opacity-100" />
        </button>
      </div>

      {localExpanded && (
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none"
                style={{ background: isDark ? '#1e293b' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                placeholder="Search commands..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button
              onClick={() => setAddingItem(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: '#2196F315', color: '#2196F3' }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {addingItem && (
            <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#2196F350', background: '#2196F308' }}>
              <input
                className="w-full font-mono text-sm px-3 py-2 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b', fontFamily: 'monospace' }}
                placeholder="Enter command..."
                value={newCmd.command}
                onChange={(e) => setNewCmd({ ...newCmd, command: e.target.value })}
                autoFocus
              />
              <input
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                placeholder="Description..."
                value={newCmd.description}
                onChange={(e) => setNewCmd({ ...newCmd, description: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  className="text-xs px-2 py-1.5 rounded border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  value={newCmd.language}
                  onChange={(e) => setNewCmd({ ...newCmd, language: e.target.value as CommandItem['language'] })}
                >
                  {['bash', 'zsh', 'powershell', 'cmd', 'python', 'javascript'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <button onClick={handleAddItem} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#2196F315', color: '#2196F3' }}>Add</button>
                <button onClick={() => setAddingItem(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
            </div>
          )}

          {filtered.length === 0 && !addingItem && (
            <div className="text-center py-6 text-sm" style={{ color: '#94a3b8' }}>
              No commands yet. <button onClick={() => setAddingItem(true)} className="text-blue-400 hover:underline">Add one</button>
            </div>
          )}

          <div className="space-y-2">
            {filtered.map(item => (
              <SubItemCard key={item.id} item={item} containerId={container.id} isDark={isDark} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  folderId: string | null;
}

export function CommandsView({ folderId }: Props) {
  const { commands, addCommandContainer, searchQuery, isDarkTheme } = useStore();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = commands
    .filter(c => !folderId || c.folderId === folderId)
    .filter(c =>
      c.title.toLowerCase().includes((search || searchQuery).toLowerCase()) ||
      c.subItems.some(i => i.command.toLowerCase().includes((search || searchQuery).toLowerCase()))
    );

  const handleAdd = () => {
    if (newTitle.trim() && folderId) {
      addCommandContainer({ folderId, title: newTitle.trim(), description: newDesc, subItems: [], tags: [], type: 'commands', isExpanded: true });
      setNewTitle('');
      setNewDesc('');
      setAdding(false);
    }
  };

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ background: isDarkTheme ? '#111827' : '#fff', borderColor: border }}>
        <Terminal size={20} style={{ color: '#2196F3' }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>Commands</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{filtered.length} collections</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48"
            style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ background: '#2196F320', color: '#2196F3' }}
        >
          <Plus size={15} /> New Collection
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {adding && (
          <div className="rounded-2xl border p-4 space-y-2" style={{ borderColor: '#2196F350', background: isDarkTheme ? '#1e293b' : '#fff' }}>
            <h3 className="text-sm font-semibold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>New Command Collection</h3>
            <input
              autoFocus
              className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
              style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
              placeholder="Collection name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            />
            <input
              className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
              style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
              placeholder="Description (optional)..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#2196F320', color: '#2196F3' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        )}
        {filtered.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: '#94a3b8' }}>
            <Terminal size={48} className="opacity-20" />
            <p className="text-lg font-medium">No command collections</p>
            <p className="text-sm">Select a folder and create your first collection</p>
            {folderId && (
              <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#2196F320', color: '#2196F3' }}>
                Create Collection
              </button>
            )}
          </div>
        )}
        {filtered.map(container => (
          <ContainerCard key={container.id} container={container} isDark={isDarkTheme} />
        ))}
      </div>
    </div>
  );
}
