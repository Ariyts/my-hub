import { useState } from 'react';
import { useStore } from '../store';
import type { LinkContainer, LinkItem } from '../types';
import { Plus, Search, ExternalLink, Trash2, Edit3, ChevronDown, ChevronRight, Link2, Star, Check, Copy } from 'lucide-react';

interface LinkCardProps {
  item: LinkItem;
  containerId: string;
  isDark: boolean;
}

function LinkCard({ item, containerId, isDark }: LinkCardProps) {
  const { updateLinkItem, deleteLinkItem } = useStore();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    updateLinkItem(containerId, item.id, editData);
    setEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#1e293b' : '#f8fafc';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#64748b' : '#94a3b8';

  const getDomain = (url: string) => {
    try { return new URL(url).hostname; } catch { return url; }
  };

  if (editing) {
    return (
      <div className="rounded-xl border p-4 space-y-2" style={{ background: bg, borderColor: border }}>
        <input
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }}
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          placeholder="Title..."
          autoFocus
        />
        <input
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }}
          value={editData.url}
          onChange={(e) => setEditData({ ...editData, url: e.target.value })}
          placeholder="URL..."
        />
        <input
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }}
          value={editData.description || ''}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          placeholder="Description..."
        />
        <input
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }}
          value={editData.tags.join(', ')}
          onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
          placeholder="tags, comma, separated"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border transition-all duration-150 overflow-hidden hover:shadow-sm" style={{ background: bg, borderColor: border }}>
      <div className="px-4 py-3 flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
          style={{ background: isDark ? '#0f172a' : '#fff', border: `1px solid ${border}` }}
        >
          {item.favicon || '🔗'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h4 className="font-semibold text-sm flex-1 truncate" style={{ color: textColor }}>{item.title}</h4>
            <button onClick={() => updateLinkItem(containerId, item.id, { isFavorite: !item.isFavorite })} className="flex-shrink-0">
              <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
            </button>
          </div>
          {item.description && (
            <p className="text-xs mb-1.5 line-clamp-2" style={{ color: mutedColor }}>{item.description}</p>
          )}
          <div className="flex items-center gap-1 text-xs mb-2" style={{ color: mutedColor }}>
            <Link2 size={10} />
            <span className="truncate">{getDomain(item.url)}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
                #{tag}
              </span>
            ))}
            <div className="flex-1" />
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
              <Edit3 size={10} /> Edit
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: copied ? '#4CAF5015' : '#FF980015', color: copied ? '#4CAF50' : '#FF9800' }}>
              {copied ? <Check size={10} /> : <Copy size={10} />} Copy URL
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
              style={{ background: '#2196F315', color: '#2196F3' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={10} /> Open
            </a>
            <button onClick={() => deleteLinkItem(containerId, item.id)} className="p-1 rounded hover:bg-red-50">
              <Trash2 size={11} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContainerCardProps {
  container: LinkContainer;
  isDark: boolean;
}

function ContainerCard({ container, isDark }: ContainerCardProps) {
  const { deleteLinkContainer, addLinkItem } = useStore();
  const [localExpanded, setLocalExpanded] = useState(container.isExpanded !== false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ url: '', title: '', description: '', favicon: '🔗', tags: [] as string[], isFavorite: false });
  const [searchQ, setSearchQ] = useState('');

  const filtered = container.subItems.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.url.toLowerCase().includes(searchQ.toLowerCase())
  );

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headBg = isDark ? '#1e293b' : '#f8fafc';

  const handleAdd = () => {
    if (newItem.url.trim()) {
      const title = newItem.title || new URL(newItem.url).hostname;
      addLinkItem(container.id, { ...newItem, title });
      setNewItem({ url: '', title: '', description: '', favicon: '🔗', tags: [], isFavorite: false });
      setAdding(false);
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
          {localExpanded ? <ChevronDown size={16} style={{ color: '#FF9800' }} /> : <ChevronRight size={16} style={{ color: '#FF9800' }} />}
        </button>
        <Link2 size={16} style={{ color: '#FF9800' }} />
        <span className="flex-1 font-semibold text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
          {container.title}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>
          {container.subItems.length}
        </span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deleteLinkContainer(container.id); }} className="p-1 rounded hover:bg-red-50">
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
                placeholder="Search links..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>
              <Plus size={14} /> Add Link
            </button>
          </div>
          {adding && (
            <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#FF980050', background: '#FF980008' }}>
              <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }} placeholder="URL (https://...)" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} />
              <input className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }} placeholder="Title (optional)" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
              <input className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }} placeholder="Description (optional)" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Add</button>
                <button onClick={() => setAdding(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
            </div>
          )}
          {filtered.length === 0 && !adding && (
            <div className="text-center py-4 text-sm" style={{ color: '#94a3b8' }}>
              No links yet. <button onClick={() => setAdding(true)} className="text-orange-400 hover:underline">Add one</button>
            </div>
          )}
          <div className="space-y-2">
            {filtered.map(item => (
              <LinkCard key={item.id} item={item} containerId={container.id} isDark={isDark} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props { folderId: string | null; }

export function LinksView({ folderId }: Props) {
  const { links, addLinkContainer, searchQuery, isDarkTheme } = useStore();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const filtered = links
    .filter(l => !folderId || l.folderId === folderId)
    .filter(l => l.title.toLowerCase().includes((search || searchQuery).toLowerCase()));

  const handleAdd = () => {
    if (newTitle.trim() && folderId) {
      addLinkContainer({ folderId, title: newTitle.trim(), subItems: [], tags: [], type: 'links', isExpanded: true });
      setNewTitle(''); setAdding(false);
    }
  };

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ background: isDarkTheme ? '#111827' : '#fff', borderColor: border }}>
        <Link2 size={20} style={{ color: '#FF9800' }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>Links</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{filtered.length} collections</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48" style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: '#FF980020', color: '#FF9800' }}>
          <Plus size={15} /> New Collection
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {adding && (
          <div className="rounded-2xl border p-4 space-y-2" style={{ borderColor: '#FF980050', background: isDarkTheme ? '#1e293b' : '#fff' }}>
            <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Collection name..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        )}
        {filtered.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: '#94a3b8' }}>
            <Link2 size={48} className="opacity-20" />
            <p className="text-lg font-medium">No link collections</p>
            <p className="text-sm">Select a folder and create your first collection</p>
          </div>
        )}
        {filtered.map(container => <ContainerCard key={container.id} container={container} isDark={isDarkTheme} />)}
      </div>
    </div>
  );
}
