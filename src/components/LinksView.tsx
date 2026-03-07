import { useState, useRef } from 'react';
import { useStore } from '../store';
import type { LinkContainer, LinkItem } from '../types';
import { Plus, Search, ExternalLink, Trash2, Edit3, Link2, Star, Check, Copy, Globe, RefreshCw, GripVertical, X } from 'lucide-react';

// Fetch link metadata
async function fetchLinkMetadata(url: string): Promise<{ title?: string; description?: string; favicon?: string }> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return {};
    
    const data = await response.json();
    const html = data.contents;
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : undefined;
    
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
    let favicon = iconMatch ? iconMatch[1] : undefined;
    
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = favicon.startsWith('/') ? `${urlObj.origin}${favicon}` : `${urlObj.origin}/${favicon}`;
    }
    
    if (!favicon) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    }
    
    return { title, description, favicon };
  } catch {
    return {};
  }
}

// Get domain from URL
function getDomain(url: string) {
  try { return new URL(url).hostname; } catch { return url; }
}

// ============================================
// LINK CARD COMPONENT
// ============================================
interface LinkCardProps {
  item: LinkItem;
  containerId: string;
  isDark: boolean;
  onDragStart: (e: React.DragEvent, itemId: string, containerId: string) => void;
  onDragOver: (e: React.DragEvent, containerId: string, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  dropIndex: number;
}

function LinkCard({ 
  item, containerId, isDark, onDragStart, onDragOver, onDrop, 
  index, isDragging, isDropTarget, dropIndex 
}: LinkCardProps) {
  const { updateLinkItem, deleteLinkItem } = useStore();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [copied, setCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    updateLinkItem(containerId, item.id, editData);
    setEditing(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#1e293b' : '#ffffff';
  const hoverBg = isDark ? '#334155' : '#f8fafc';

  if (editing) {
    return (
      <div 
        className="rounded-xl p-3 border-2 transition-all"
        style={{ background: bg, borderColor: '#FF9800' }}
      >
        <div className="space-y-2">
          <input
            className="w-full text-sm px-2 py-1.5 rounded-lg border outline-none"
            style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            placeholder="URL..."
            autoFocus
          />
          <input
            className="w-full text-sm px-2 py-1.5 rounded-lg border outline-none"
            style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Title..."
          />
          <input
            className="w-full text-sm px-2 py-1.5 rounded-lg border outline-none"
            style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            value={editData.description || ''}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description..."
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FF980020', color: '#FF9800' }}>Save</button>
            <button onClick={() => setEditing(false)} className="flex-1 px-3 py-1.5 rounded-lg text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id, containerId)}
      onDragOver={(e) => onDragOver(e, containerId, index)}
      onDrop={onDrop}
      className={`rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing group relative ${isDragging ? 'opacity-50 scale-95' : ''}`}
      style={{ 
        background: bg, 
        borderColor: isDropTarget && dropIndex === index ? '#FF9800' : border,
        boxShadow: isDropTarget && dropIndex === index ? '0 0 0 2px #FF980040' : 'none'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drop indicator line at top */}
      {isDropTarget && dropIndex === index && (
        <div className="absolute -top-1 left-2 right-2 h-0.5 bg-orange-400 rounded z-10" />
      )}
      
      {/* Drag handle */}
      <div 
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-500/20"
        style={{ cursor: 'grab' }}
      >
        <GripVertical size={10} style={{ color: isDark ? '#64748b' : '#94a3b8' }} />
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3"
        onClick={(e) => e.preventDefault()}
      >
        {/* Header: Favicon + Title */}
        <div className="flex items-start gap-2 mb-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: isDark ? '#0f172a' : '#f1f5f9' }}
          >
            {item.favicon && !faviconError ? (
              <img 
                src={item.favicon} 
                alt="" 
                className="w-5 h-5 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <Globe size={16} className="text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-sm truncate hover:text-orange-400 transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
            >
              {item.title}
            </h3>
            <p className="text-[10px] truncate" style={{ color: '#94a3b8' }}>
              {getDomain(item.url)}
            </p>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#64748b' }}>
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {item.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="text-[9px] px-1.5 py-0.5 rounded" 
                style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div 
          className="flex items-center gap-1 transition-opacity"
          style={{ opacity: showActions ? 1 : 0 }}
        >
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateLinkItem(containerId, item.id, { isFavorite: !item.isFavorite }); }}
            className="p-1 rounded hover:bg-slate-500/20"
          >
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
          </button>
          <button onClick={handleCopy} className="p-1 rounded hover:bg-slate-500/20">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-slate-400" />}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-blue-500/20"
          >
            <ExternalLink size={12} className="text-blue-400" />
          </a>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }} 
            className="p-1 rounded hover:bg-slate-500/20"
          >
            <Edit3 size={12} className="text-slate-400" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (confirm('Delete?')) deleteLinkItem(containerId, item.id); }} 
            className="p-1 rounded hover:bg-red-500/20"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </a>
    </div>
  );
}

// ============================================
// SECTION HEADER (Category Divider)
// ============================================
interface SectionHeaderProps {
  container: LinkContainer;
  isDark: boolean;
  onAddLink: () => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function SectionHeader({ container, isDark, onAddLink, onDelete, isExpanded, onToggle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-1 h-5 rounded-full bg-orange-400" />
        <Link2 size={14} style={{ color: '#FF9800' }} />
        <h2 
          className="font-semibold text-sm cursor-pointer hover:text-orange-400 transition-colors"
          style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
          onClick={onToggle}
        >
          {container.title}
        </h2>
        <span 
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{ background: '#FF980015', color: '#FF9800' }}
        >
          {container.subItems.length}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={onAddLink}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition-colors"
          style={{ color: '#FF9800' }}
        >
          <Plus size={12} /> Add
        </button>
        <button 
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// ADD LINK MODAL
// ============================================
interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  containerId: string;
  isDark: boolean;
}

function AddLinkModal({ isOpen, onClose, containerId, isDark }: AddLinkModalProps) {
  const { addLinkItem } = useStore();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fetching, setFetching] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) return;
    
    setFetching(true);
    
    let finalTitle = title;
    let finalDesc = description;
    let favicon: string | undefined;
    
    if (!title) {
      const meta = await fetchLinkMetadata(url);
      finalTitle = meta.title || getDomain(url);
      finalDesc = description || meta.description || '';
      favicon = meta.favicon;
    }
    
    addLinkItem(containerId, {
      url: url.trim(),
      title: finalTitle || getDomain(url),
      description: finalDesc || '',
      favicon: favicon || `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`,
      tags: [],
      isFavorite: false,
    });
    
    setUrl('');
    setTitle('');
    setDescription('');
    setFetching(false);
    onClose();
  };

  if (!isOpen) return null;

  const bg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl w-full max-w-md p-5 shadow-xl"
        style={{ background: bg, border: `1px solid ${border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Add Link</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-500/20">
            <X size={16} style={{ color: isDark ? '#64748b' : '#94a3b8' }} />
          </button>
        </div>
        
        <div className="space-y-3">
          <input
            autoFocus
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
            style={{ background: inputBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <input
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
            style={{ background: inputBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            placeholder="Title (auto-fetched if empty)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
            style={{ background: inputBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-[10px]" style={{ color: '#94a3b8' }}>
            Tip: Just paste URL - title & description will be fetched automatically
          </p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={fetching || !url.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: '#FF9800', color: 'white' }}
          >
            {fetching ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LINKS VIEW
// ============================================
interface Props { folderId: string | null; }

export function LinksView({ folderId }: Props) {
  const { links, addLinkContainer, deleteLinkContainer, updateLinkContainer, searchQuery, isDarkTheme } = useStore();
  const [search, setSearch] = useState('');
  const [addingCollection, setAddingCollection] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Drag & Drop state
  const [dragState, setDragState] = useState<{
    draggingItemId: string | null;
    draggingFromContainerId: string | null;
    dropTargetContainerId: string | null;
    dropIndex: number | null;
  }>({
    draggingItemId: null,
    draggingFromContainerId: null,
    dropTargetContainerId: null,
    dropIndex: null,
  });
  
  // Add link modal state
  const [addLinkModal, setAddLinkModal] = useState<{ isOpen: boolean; containerId: string | null }>({ 
    isOpen: false, 
    containerId: null 
  });

  const filtered = links
    .filter(l => !folderId || l.folderId === folderId)
    .filter(l => l.title.toLowerCase().includes((search || searchQuery).toLowerCase()));

  const handleAddCollection = () => {
    if (newCollectionTitle.trim() && folderId) {
      addLinkContainer({ 
        folderId, 
        title: newCollectionTitle.trim(), 
        subItems: [], 
        tags: [], 
        type: 'links', 
        isExpanded: true 
      });
      setNewCollectionTitle('');
      setAddingCollection(false);
    }
  };

  const toggleSection = (containerId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(containerId)) {
        next.delete(containerId);
      } else {
        next.add(containerId);
      }
      return next;
    });
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string, containerId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragState({
      draggingItemId: itemId,
      draggingFromContainerId: containerId,
      dropTargetContainerId: null,
      dropIndex: null,
    });
  };

  const handleDragOver = (e: React.DragEvent, containerId: string, index: number) => {
    e.preventDefault();
    if (dragState.draggingItemId) {
      setDragState(prev => ({
        ...prev,
        dropTargetContainerId: containerId,
        dropIndex: index,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const { draggingItemId, draggingFromContainerId, dropTargetContainerId, dropIndex } = dragState;
    
    if (!draggingItemId || !draggingFromContainerId || !dropTargetContainerId || dropIndex === null) {
      setDragState({ draggingItemId: null, draggingFromContainerId: null, dropTargetContainerId: null, dropIndex: null });
      return;
    }
    
    // Find source container and item
    const sourceContainer = links.find(l => l.id === draggingFromContainerId);
    const targetContainer = links.find(l => l.id === dropTargetContainerId);
    
    if (!sourceContainer || !targetContainer) return;
    
    const itemToMove = sourceContainer.subItems.find(item => item.id === draggingItemId);
    if (!itemToMove) return;
    
    // Same container reordering
    if (draggingFromContainerId === dropTargetContainerId) {
      const newItems = [...sourceContainer.subItems];
      const fromIndex = newItems.findIndex(item => item.id === draggingItemId);
      
      if (fromIndex !== -1) {
        newItems.splice(fromIndex, 1);
        newItems.splice(dropIndex > fromIndex ? dropIndex - 1 : dropIndex, 0, itemToMove);
        updateLinkContainer(sourceContainer.id, { subItems: newItems });
      }
    } else {
      // Move between containers
      const newSourceItems = sourceContainer.subItems.filter(item => item.id !== draggingItemId);
      const newTargetItems = [...targetContainer.subItems];
      
      // Find proper insertion index
      const insertIndex = Math.min(dropIndex, newTargetItems.length);
      newTargetItems.splice(insertIndex, 0, itemToMove);
      
      updateLinkContainer(sourceContainer.id, { subItems: newSourceItems });
      updateLinkContainer(targetContainer.id, { subItems: newTargetItems });
    }
    
    setDragState({ draggingItemId: null, draggingFromContainerId: null, dropTargetContainerId: null, dropIndex: null });
  };

  const handleDragEnd = () => {
    setDragState({ draggingItemId: null, draggingFromContainerId: null, dropTargetContainerId: null, dropIndex: null });
  };

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  return (
    <div 
      className="flex flex-col h-full" 
      style={{ background: bg }}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b flex items-center gap-3"
        style={{ background: isDarkTheme ? '#111827' : '#fff', borderColor: border }}
      >
        <Link2 size={20} style={{ color: '#FF9800' }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>Links</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            {filtered.reduce((sum, c) => sum + c.subItems.length, 0)} links in {filtered.length} collections
          </p>
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
          onClick={() => setAddingCollection(true)} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" 
          style={{ background: '#FF980020', color: '#FF9800' }}
        >
          <Plus size={15} /> New Collection
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add new collection */}
        {addingCollection && (
          <div 
            className="rounded-xl border p-3 mb-4"
            style={{ borderColor: '#FF980050', background: isDarkTheme ? '#1e293b' : '#fff' }}
          >
            <input 
              autoFocus 
              className="w-full text-sm px-3 py-2 rounded-lg border outline-none mb-2" 
              style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} 
              placeholder="Collection name..." 
              value={newCollectionTitle} 
              onChange={(e) => setNewCollectionTitle(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCollection(); if (e.key === 'Escape') setAddingCollection(false); }} 
            />
            <div className="flex gap-2">
              <button onClick={handleAddCollection} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#FF980015', color: '#FF9800' }}>Create</button>
              <button onClick={() => setAddingCollection(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && !addingCollection && (
          <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: '#94a3b8' }}>
            <Link2 size={48} className="opacity-20" />
            <p className="text-lg font-medium">No link collections</p>
            <p className="text-sm">Select a folder and create your first collection</p>
          </div>
        )}

        {/* Sections */}
        {filtered.map(container => {
          const isExpanded = expandedSections.has(container.id) || container.subItems.length > 0;
          
          return (
            <div key={container.id} className="mb-6">
              {/* Section Header */}
              <SectionHeader
                container={container}
                isDark={isDarkTheme}
                onAddLink={() => setAddLinkModal({ isOpen: true, containerId: container.id })}
                onDelete={() => {
                  if (confirm(`Delete "${container.title}" and all its links?`)) {
                    deleteLinkContainer(container.id);
                  }
                }}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(container.id)}
              />

              {/* Grid of cards */}
              {isExpanded && container.subItems.length > 0 && (
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2"
                >
                  {container.subItems.map((item, index) => (
                    <LinkCard
                      key={item.id}
                      item={item}
                      containerId={container.id}
                      isDark={isDarkTheme}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      index={index}
                      isDragging={dragState.draggingItemId === item.id}
                      isDropTarget={dragState.dropTargetContainerId === container.id}
                      dropIndex={dragState.dropIndex ?? -1}
                    />
                  ))}
                </div>
              )}

              {/* Empty section message */}
              {isExpanded && container.subItems.length === 0 && (
                <div 
                  className="text-center py-6 rounded-xl border-2 border-dashed mt-2"
                  style={{ borderColor: isDarkTheme ? '#334155' : '#e2e8f0' }}
                >
                  <p className="text-xs" style={{ color: '#94a3b8' }}>
                    No links yet. 
                    <button 
                      onClick={() => setAddLinkModal({ isOpen: true, containerId: container.id })}
                      className="text-orange-400 hover:underline ml-1"
                    >
                      Add one
                    </button>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Link Modal */}
      <AddLinkModal
        isOpen={addLinkModal.isOpen}
        onClose={() => setAddLinkModal({ isOpen: false, containerId: null })}
        containerId={addLinkModal.containerId || ''}
        isDark={isDarkTheme}
      />
    </div>
  );
}
