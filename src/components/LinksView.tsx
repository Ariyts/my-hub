import { useState, useEffect } from 'react';
import { useStore } from '../store';
import type { LinkContainer, LinkItem } from '../types';
import { Plus, Search, ExternalLink, Trash2, Edit3, ChevronDown, ChevronRight, Link2, Star, Check, Copy, Globe, RefreshCw } from 'lucide-react';

// Fetch link metadata
async function fetchLinkMetadata(url: string): Promise<{ title?: string; description?: string; favicon?: string }> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return {};
    
    const data = await response.json();
    const html = data.contents;
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;
    
    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : undefined;
    
    // Extract favicon
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
    let favicon = iconMatch ? iconMatch[1] : undefined;
    
    // Handle relative favicon URLs
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = favicon.startsWith('/') ? `${urlObj.origin}${favicon}` : `${urlObj.origin}/${favicon}`;
    }
    
    // Default favicon
    if (!favicon) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    }
    
    return { title, description, favicon };
  } catch {
    return {};
  }
}

interface LinkRowProps {
  item: LinkItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function LinkRow({ item, containerId, isDark, index }: LinkRowProps) {
  const { updateLinkItem, deleteLinkItem } = useStore();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [copied, setCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleSave = () => {
    updateLinkItem(containerId, item.id, editData);
    setEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomain = (url: string) => {
    try { return new URL(url).hostname; } catch { return url; }
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  if (editing) {
    return (
      <tr style={{ background: isDark ? '#1e293b30' : '#f8fafc' }}>
        <td colSpan={6} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                placeholder="URL..."
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title..."
              />
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
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
      
      {/* Favicon */}
      <td className="px-2 py-2 w-10">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center overflow-hidden bg-center bg-contain"
          style={{ background: isDark ? '#1e293b' : '#f1f5f9' }}
        >
          {item.favicon && !faviconError ? (
            <img 
              src={item.favicon} 
              alt="" 
              className="w-4 h-4 object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe size={14} className="text-slate-400" />
          )}
        </div>
      </td>
      
      {/* Title & URL */}
      <td className="px-2 py-2">
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-sm hover:underline block truncate"
          style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
        >
          {item.title}
        </a>
        <span className="text-xs truncate block" style={{ color: '#94a3b8' }}>{getDomain(item.url)}</span>
      </td>
      
      {/* Description */}
      <td className="px-2 py-2 min-w-[200px] hidden md:table-cell">
        {item.description && (
          <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{item.description}</p>
        )}
      </td>
      
      {/* Tags */}
      <td className="px-2 py-2 hidden lg:table-cell">
        <div className="flex gap-1 flex-wrap">
          {item.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
              {tag}
            </span>
          ))}
        </div>
      </td>
      
      {/* Actions */}
      <td className="px-2 py-2 w-36">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => updateLinkItem(containerId, item.id, { isFavorite: !item.isFavorite })}>
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ background: copied ? '#4CAF5020' : 'transparent', color: copied ? '#4CAF50' : '#64748b' }}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-blue-500/20"
          >
            <ExternalLink size={12} className="text-blue-400" />
          </a>
          <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-slate-500/20">
            <Edit3 size={11} className="text-slate-400" />
          </button>
          <button onClick={() => deleteLinkItem(containerId, item.id)} className="p-1 rounded hover:bg-red-500/20">
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </td>
    </tr>
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
  const [fetching, setFetching] = useState(false);

  const filtered = container.subItems.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.url.toLowerCase().includes(searchQ.toLowerCase())
  );

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headBg = isDark ? '#1e293b' : '#f8fafc';

  const handleAdd = async () => {
    if (newItem.url.trim()) {
      setFetching(true);
      
      // Auto-fetch metadata if no title provided
      let title = newItem.title;
      let description = newItem.description;
      let favicon = newItem.favicon;
      
      if (!title) {
        const meta = await fetchLinkMetadata(newItem.url);
        title = meta.title || new URL(newItem.url).hostname;
        description = description || meta.description || '';
        favicon = meta.favicon || '🔗';
      }
      
      addLinkItem(container.id, { ...newItem, title: title || new URL(newItem.url).hostname, description, favicon });
      setNewItem({ url: '', title: '', description: '', favicon: '🔗', tags: [], isFavorite: false });
      setAdding(false);
      setFetching(false);
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: bg, borderColor: border }}>
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
        style={{ background: headBg }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        {localExpanded ? <ChevronDown size={14} style={{ color: '#FF9800' }} /> : <ChevronRight size={14} style={{ color: '#FF9800' }} />}
        <Link2 size={14} style={{ color: '#FF9800' }} />
        <span className="font-medium text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{container.title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto" style={{ background: '#FF980015', color: '#FF9800' }}>
          {container.subItems.length}
        </span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deleteLinkContainer(container.id); }} className="p-1 rounded hover:bg-red-50">
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
                style={{ background: isDark ? '#1e293b' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                placeholder="Search..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>
              <Plus size={12} /> Add Link
            </button>
          </div>

          {/* Add new link form */}
          {adding && (
            <div className="p-3 border-b" style={{ borderColor: '#FF980050', background: '#FF980008' }}>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="https://..."
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
                />
                <button 
                  onClick={handleAdd} 
                  disabled={fetching}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                  style={{ background: '#FF980015', color: '#FF9800' }}
                >
                  {fetching ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                  Add
                </button>
                <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="Title (auto-fetched if empty)"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
                <input
                  className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="Description (auto-fetched if empty)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#94a3b8' }}>Tip: Just paste URL - title & description will be fetched automatically</p>
            </div>
          )}

          {/* Links table */}
          {filtered.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b', background: isDark ? '#1e293b50' : '#f8fafc' }}>
                  <th className="px-2 py-1.5 text-center w-8">#</th>
                  <th className="px-2 py-1.5 w-10"></th>
                  <th className="px-2 py-1.5 text-left">Title</th>
                  <th className="px-2 py-1.5 text-left hidden md:table-cell">Description</th>
                  <th className="px-2 py-1.5 text-left hidden lg:table-cell">Tags</th>
                  <th className="px-2 py-1.5 w-36"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <LinkRow key={item.id} item={item} containerId={container.id} isDark={isDark} index={idx} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-xs" style={{ color: '#94a3b8' }}>
              No links. <button onClick={() => setAdding(true)} className="text-orange-400 hover:underline">Add one</button>
            </div>
          )}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {adding && (
          <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#FF980050', background: isDarkTheme ? '#1e293b' : '#fff' }}>
            <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Collection name..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
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
