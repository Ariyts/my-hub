import { useState } from 'react';
import { useStore } from '../store';
import type { CommandContainer, CommandItem } from '../types';
import {
  ChevronDown, ChevronRight, Plus, Copy, Edit3, Trash2, Check,
  Search, Star, Terminal, GripVertical
} from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  bash: '#4CAF50', zsh: '#4CAF50', powershell: '#2196F3',
  cmd: '#FF9800', python: '#9C27B0', javascript: '#F7DF1E',
};

const LANG_ICONS: Record<string, string> = {
  bash: '>$', zsh: '>%', powershell: 'PS', cmd: '>', python: 'py', javascript: 'JS',
};

// Syntax highlighting - simple approach
function highlightSyntax(code: string, lang: string): JSX.Element {
  const keywords = ['git', 'npm', 'docker', 'kubectl', 'cd', 'ls', 'cat', 'echo', 'export', 'import', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'sudo', 'apt', 'brew', 'pip', 'node', 'python'];
  
  const parts = code.split(/(\s+|['"][^'"]*['"]|#[^\n]*)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} style={{ color: '#c792ea' }}>{part}</span>;
        }
        if (part.startsWith('#')) {
          return <span key={i} style={{ color: '#546e7a' }}>{part}</span>;
        }
        if (/^['"].*['"]$/.test(part)) {
          return <span key={i} style={{ color: '#c3e88d' }}>{part}</span>;
        }
        if (/^--?[a-zA-Z]/.test(part)) {
          return <span key={i} style={{ color: '#ffcb6b' }}>{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface CommandRowProps {
  item: CommandItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function CommandRow({ item, containerId, isDark, index }: CommandRowProps) {
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
  const codeBg = isDark ? '#0f172a' : '#f1f5f9';
  const langColor = LANG_COLORS[item.language] || '#64748b';

  if (editing) {
    return (
      <tr style={{ background: isDark ? '#1e293b30' : '#f8fafc' }}>
        <td colSpan={5} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="text-xs px-2 py-1 rounded border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.language}
                onChange={(e) => setEditData({ ...editData, language: e.target.value as CommandItem['language'] })}
              >
                {['bash', 'zsh', 'powershell', 'cmd', 'python', 'javascript'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <input
                className="flex-1 font-mono text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: codeBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.command}
                onChange={(e) => setEditData({ ...editData, command: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
              <input
                className="w-48 text-xs px-2 py-1.5 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.tags.join(', ')}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                placeholder="tags..."
              />
              <button onClick={handleSave} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#4CAF5020', color: '#4CAF50' }}>Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr 
      className="group hover:bg-slate-500/5 transition-colors"
      style={{ borderBottom: `1px solid ${border}` }}
    >
      {/* Number */}
      <td className="px-2 py-2 text-center w-8">
        <span className="text-xs font-mono" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{index + 1}</span>
      </td>
      
      {/* Language */}
      <td className="px-2 py-2 w-16">
        <span 
          className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
          style={{ background: `${langColor}20`, color: langColor }}
        >
          {LANG_ICONS[item.language] || item.language.slice(0, 2).toUpperCase()}
        </span>
      </td>
      
      {/* Command */}
      <td className="px-2 py-2">
        <div 
          className="font-mono text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-slate-500/10 transition-colors"
          style={{ background: codeBg, borderLeft: `2px solid ${langColor}` }}
          onClick={handleCopy}
          title={item.description || 'Click to copy'}
        >
          {highlightSyntax(item.command, item.language)}
        </div>
      </td>
      
      {/* Description & Tags */}
      <td className="px-2 py-2 min-w-[150px]">
        {item.description && (
          <p className="text-xs mb-1 truncate" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{item.description}</p>
        )}
        <div className="flex gap-1 flex-wrap">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
              {tag}
            </span>
          ))}
        </div>
      </td>
      
      {/* Actions */}
      <td className="px-2 py-2 w-32">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => updateCommandItem(containerId, item.id, { isFavorite: !item.isFavorite })}>
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ background: copied ? '#4CAF5020' : 'transparent', color: copied ? '#4CAF50' : '#64748b' }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-slate-500/20">
            <Edit3 size={11} className="text-slate-400" />
          </button>
          <button onClick={() => deleteCommandItem(containerId, item.id)} className="p-1 rounded hover:bg-red-500/20">
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface ContainerCardProps {
  container: CommandContainer;
  isDark: boolean;
}

function ContainerCard({ container, isDark }: ContainerCardProps) {
  const { deleteCommandContainer, addCommandItem } = useStore();
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
    <div className="rounded-xl border overflow-hidden" style={{ background: bg, borderColor: border }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
        style={{ background: headBg }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        {localExpanded ? <ChevronDown size={14} style={{ color: '#2196F3' }} /> : <ChevronRight size={14} style={{ color: '#2196F3' }} />}
        <Terminal size={14} style={{ color: '#2196F3' }} />
        <span className="font-medium text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{container.title}</span>
        {container.description && (
          <span className="text-xs hidden sm:block" style={{ color: '#64748b' }}>{container.description}</span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto" style={{ background: '#2196F315', color: '#2196F3' }}>
          {container.subItems.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); if (confirm('Delete collection?')) deleteCommandContainer(container.id); }}
          className="p-1 rounded hover:bg-red-500/20 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>

      {localExpanded && (
        <div className="border-t" style={{ borderColor: border }}>
          {/* Toolbar */}
          <div className="flex gap-2 p-3 border-b" style={{ borderColor: border }}>
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                placeholder="Search..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button
              onClick={() => setAddingItem(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: '#2196F315', color: '#2196F3' }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {/* Add new command form */}
          {addingItem && (
            <div className="p-3 border-b" style={{ borderColor: '#2196F350', background: '#2196F308' }}>
              <div className="flex gap-2 mb-2">
                <select
                  className="text-xs px-2 py-1.5 rounded border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  value={newCmd.language}
                  onChange={(e) => setNewCmd({ ...newCmd, language: e.target.value as CommandItem['language'] })}
                >
                  {['bash', 'zsh', 'powershell', 'cmd', 'python', 'javascript'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <input
                  className="flex-1 font-mono text-xs px-3 py-1.5 rounded-lg border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="command..."
                  value={newCmd.command}
                  onChange={(e) => setNewCmd({ ...newCmd, command: e.target.value })}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem(); if (e.key === 'Escape') setAddingItem(false); }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="description..."
                  value={newCmd.description}
                  onChange={(e) => setNewCmd({ ...newCmd, description: e.target.value })}
                />
                <button onClick={handleAddItem} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#2196F315', color: '#2196F3' }}>Add</button>
                <button onClick={() => setAddingItem(false)} className="px-3 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Commands table */}
          {filtered.length > 0 ? (
            <table className="w-full">
              <tbody>
                {filtered.map((item, idx) => (
                  <CommandRow key={item.id} item={item} containerId={container.id} isDark={isDark} index={idx} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-xs" style={{ color: '#94a3b8' }}>
              No commands. <button onClick={() => setAddingItem(true)} className="text-blue-400 hover:underline">Add one</button>
            </div>
          )}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {adding && (
          <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#2196F350', background: isDarkTheme ? '#1e293b' : '#fff' }}>
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
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#2196F315', color: '#2196F3' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
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
