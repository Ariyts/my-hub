import { useState, useMemo, useCallback } from 'react';
import { useStore } from '../store';
import type { LinkItem, LinkSection } from '../types';
import { Plus, Search, ExternalLink, Trash2, Edit3, Link2, Star, Check, Copy, Globe, RefreshCw, GripVertical, X, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';

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
  sectionId: string | null;
  isDark: boolean;
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string | null) => void;
  onDragOver: (e: React.DragEvent, index: number, sectionId: string | null) => void;
  onDrop: (e: React.DragEvent) => void;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  dropIndex: number;
  dropSectionId: string | null;
}

function LinkCard({ 
  item, containerId, sectionId, isDark, onDragStart, onDragOver, onDrop, 
  index, isDragging, isDropTarget, dropIndex, dropSectionId
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
  const isCurrentDropTarget = isDropTarget && dropIndex === index && dropSectionId === sectionId;

  if (editing) {
    return (
      <div 
        className="rounded-xl p-3 border-2 transition-all col-span-1"
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
      onDragStart={(e) => onDragStart(e, item.id, sectionId)}
      onDragOver={(e) => onDragOver(e, index, sectionId)}
      onDrop={onDrop}
      className={`rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing group relative ${isDragging ? 'opacity-50 scale-95' : ''}`}
      style={{ 
        background: bg, 
        borderColor: isCurrentDropTarget ? '#FF9800' : border,
        boxShadow: isCurrentDropTarget ? '0 0 0 2px #FF980040' : 'none'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isCurrentDropTarget && (
        <div className="absolute -top-1 left-2 right-2 h-0.5 bg-orange-400 rounded z-10" />
      )}
      
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

        {item.description && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#64748b' }}>
            {item.description}
          </p>
        )}

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
// SECTION COMPONENT
// ============================================
interface SectionProps {
  section: LinkSection | null; // null = uncategorized
  links: LinkItem[];
  containerId: string;
  isDark: boolean;
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string | null) => void;
  onDragOver: (e: React.DragEvent, index: number, sectionId: string | null) => void;
  onDrop: (e: React.DragEvent) => void;
  dragState: {
    draggingItemId: string | null;
    draggingSectionId: string | null;
    dropIndex: number | null;
    dropSectionId: string | null;
  };
  onToggleCollapse: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddLink: (sectionId: string | null) => void;
}

function Section({ 
  section, links, containerId, isDark, onDragStart, onDragOver, onDrop,
  dragState, onToggleCollapse, onEditSection, onDeleteSection, onAddLink
}: SectionProps) {
  const sectionId = section?.id || null;
  const isCollapsed = section?.collapsed ?? false;
  const isDragging = dragState.draggingSectionId === sectionId;
  
  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headerBg = isDark ? '#1e293b' : '#f8fafc';

  return (
    <div 
      className="rounded-xl border overflow-hidden group"
      style={{ borderColor: isDragging ? '#FF9800' : border }}
    >
      {/* Section Header */}
      <div 
        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
        style={{ background: headerBg }}
        onClick={() => section && onToggleCollapse(section.id)}
      >
        {section ? (
          <>
            <button 
              className="p-0.5 rounded hover:bg-slate-500/20"
              onClick={(e) => { e.stopPropagation(); onToggleCollapse(section.id); }}
            >
              {isCollapsed ? (
                <ChevronRight size={14} style={{ color: '#FF9800' }} />
              ) : (
                <ChevronDown size={14} style={{ color: '#FF9800' }} />
              )}
            </button>
            <Link2 size={14} style={{ color: '#FF9800' }} />
            <span 
              className="font-medium text-sm flex-1"
              style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
            >
              {section.title}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#FF980015', color: '#FF9800' }}
            >
              {links.length}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEditSection(section.id); }}
                className="p-1.5 rounded-lg hover:bg-orange-500/20 transition-colors"
                title="Rename section"
              >
                <Edit3 size={14} style={{ color: '#FF9800' }} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Delete section"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link2 size={14} style={{ color: '#94a3b8' }} />
            <span 
              className="font-medium text-sm flex-1"
              style={{ color: '#94a3b8' }}
            >
              Uncategorized
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}
            >
              {links.length}
            </span>
          </>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAddLink(sectionId); }}
          className="p-1 rounded hover:bg-orange-500/20"
          title="Add link to this section"
        >
          <Plus size={14} style={{ color: '#FF9800' }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div 
          className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          style={{ background: bg }}
        >
          {links.map((item, index) => (
            <LinkCard
              key={item.id}
              item={item}
              containerId={containerId}
              sectionId={sectionId}
              isDark={isDark}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              index={index}
              isDragging={dragState.draggingItemId === item.id}
              isDropTarget={dragState.dropIndex !== null}
              dropIndex={dragState.dropIndex ?? -1}
              dropSectionId={dragState.dropSectionId}
            />
          ))}
          
          {links.length === 0 && (
            <div className="col-span-full text-center py-6 text-xs" style={{ color: '#94a3b8' }}>
              No links in this section
              <button 
                onClick={() => onAddLink(sectionId)}
                className="text-orange-400 hover:underline ml-1"
              >
                Add one
              </button>
            </div>
          )}
        </div>
      )}
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
  sectionId: string | null;
  isDark: boolean;
}

function AddLinkModal({ isOpen, onClose, containerId, sectionId, isDark }: AddLinkModalProps) {
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
      sectionId: sectionId || undefined,
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
          <h3 className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
            Add Link {sectionId ? `to section` : ''}
          </h3>
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
// ADD SECTION MODAL
// ============================================
interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
  isDark: boolean;
}

function AddSectionModal({ isOpen, onClose, onAdd, isDark }: AddSectionModalProps) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      onClose();
    }
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
        className="rounded-2xl w-full max-w-sm p-5 shadow-xl"
        style={{ background: bg, border: `1px solid ${border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>New Section</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-500/20">
            <X size={16} style={{ color: isDark ? '#64748b' : '#94a3b8' }} />
          </button>
        </div>
        
        <input
          autoFocus
          className="w-full text-sm px-3 py-2 rounded-lg border outline-none mb-4"
          style={{ background: inputBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
          placeholder="Section title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        />
        
        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: '#FF9800', color: 'white' }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LINKS VIEW
// ============================================
interface Props { 
  containerId: string;
}

export function LinksView({ containerId }: Props) {
  // Get container directly from store to ensure re-renders on updates
  const container = useStore(state => state.links.find(l => l.id === containerId));
  const { 
    updateLinkContainer, 
    updateLinkSection,
    deleteLinkSection,
    addLinkSection,
    isDarkTheme 
  } = useStore();
  
  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURN
  const [search, setSearch] = useState('');
  
  // Drag & Drop state
  const [dragState, setDragState] = useState<{
    draggingItemId: string | null;
    draggingSectionId: string | null;
    dropIndex: number | null;
    dropSectionId: string | null;
  }>({
    draggingItemId: null,
    draggingSectionId: null,
    dropIndex: null,
    dropSectionId: null,
  });
  
  // Modals
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [addLinkToSection, setAddLinkToSection] = useState<string | null>(null);

  // Get sections (or create a default one if no sections)
  const sections: (LinkSection | null)[] = useMemo(() => {
    const existingSections = container?.sections || [];
    if (existingSections.length === 0) {
      // No sections - return null for uncategorized
      return [null];
    }
    // Return sections sorted by order, plus null for uncategorized at the end
    return [...existingSections.sort((a, b) => a.order - b.order), null];
  }, [container?.sections]);

  // Get links for a section
  const getLinksForSection = useCallback((sectionId: string | null) => {
    if (!container) return [];
    return container.subItems
      .filter(link => (link.sectionId || null) === sectionId)
      .filter(link =>
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        link.url.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [container, search]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, itemId: string, sectionId: string | null) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragState({
      draggingItemId: itemId,
      draggingSectionId: sectionId,
      dropIndex: null,
      dropSectionId: null,
    });
  };

  const handleDragOver = (e: React.DragEvent, index: number, sectionId: string | null) => {
    e.preventDefault();
    if (dragState.draggingItemId) {
      setDragState(prev => ({
        ...prev,
        dropIndex: index,
        dropSectionId: sectionId,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const { draggingItemId, draggingSectionId, dropIndex, dropSectionId } = dragState;
    
    if (!container || !draggingItemId || dropIndex === null) {
      setDragState({ draggingItemId: null, draggingSectionId: null, dropIndex: null, dropSectionId: null });
      return;
    }
    
    const itemToMove = container.subItems.find(item => item.id === draggingItemId);
    if (!itemToMove) return;
    
    // Get all items in target section
    const targetSectionLinks = container.subItems
      .filter(link => (link.sectionId || null) === dropSectionId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
    // Build new subItems array
    const newSubItems = container.subItems.map(item => {
      if (item.id === draggingItemId) {
        // Update section and order
        const fromIndex = targetSectionLinks.findIndex(i => i.id === draggingItemId);
        const actualDropIndex = dropSectionId === draggingSectionId && fromIndex !== -1 && dropIndex > fromIndex
          ? dropIndex - 1
          : dropIndex;
        
        return { 
          ...item, 
          sectionId: dropSectionId || undefined,
          order: actualDropIndex
        };
      }
      return item;
    });
    
    // Reorder all items in target section
    const reorderedSubItems = newSubItems.map(item => {
      if ((item.sectionId || null) !== dropSectionId) return item;
      if (item.id === draggingItemId) return item;
      
      const currentOrder = item.order ?? 0;
      const isAfterDrop = currentOrder >= dropIndex;
      
      return {
        ...item,
        order: isAfterDrop ? currentOrder + 1 : currentOrder
      };
    });
    
    // Normalize orders
    const normalizedSubItems = reorderedSubItems.map(item => {
      const sectionLinks = reorderedSubItems
        .filter(l => (l.sectionId || null) === (item.sectionId || null))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      
      return {
        ...item,
        order: sectionLinks.findIndex(l => l.id === item.id)
      };
    });
    
    updateLinkContainer(container.id, { subItems: normalizedSubItems });
    setDragState({ draggingItemId: null, draggingSectionId: null, dropIndex: null, dropSectionId: null });
  };

  const handleDragEnd = () => {
    setDragState({ draggingItemId: null, draggingSectionId: null, dropIndex: null, dropSectionId: null });
  };

  // Section handlers
  const handleToggleCollapse = (sectionId: string) => {
    if (!container) return;
    updateLinkSection(container.id, sectionId, { 
      collapsed: !sections.find(s => s?.id === sectionId)?.collapsed 
    });
  };

  const handleEditSection = (sectionId: string) => {
    if (!container) return;
    const section = sections.find(s => s?.id === sectionId);
    if (!section) return;
    
    const newTitle = prompt('Section title:', section.title);
    if (newTitle && newTitle.trim()) {
      updateLinkSection(container.id, sectionId, { title: newTitle.trim() });
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!container) return;
    if (confirm('Delete this section? Links will be moved to "Uncategorized"')) {
      deleteLinkSection(container.id, sectionId);
    }
  };

  const handleAddLink = (sectionId: string | null) => {
    setAddLinkToSection(sectionId);
    setShowAddLinkModal(true);
  };

  const handleAddSection = (title: string) => {
    if (!container) return;
    addLinkSection(container.id, title);
  };

  // NOW we can do conditional return AFTER all hooks
  // If container not found, show placeholder
  if (!container) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: isDarkTheme ? '#0f172a' : '#ffffff' }}>
        <Link2 size={48} className="opacity-20" style={{ color: '#FF9800' }} />
        <p style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>Container not found</p>
      </div>
    );
  }

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  const totalLinks = container.subItems.length;

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
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
            {container.title}
          </h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            {totalLinks} links {container.sections?.length ? `in ${container.sections.length} sections` : ''}
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48" 
            style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} 
            placeholder="Search links..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <button 
          onClick={() => setShowAddSectionModal(true)} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border"
          style={{ background: 'transparent', color: '#FF9800', borderColor: '#FF980040' }}
          title="Add new section"
        >
          <FolderPlus size={15} /> Section
        </button>
        <button 
          onClick={() => { setAddLinkToSection(null); setShowAddLinkModal(true); }} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" 
          style={{ background: '#FF980020', color: '#FF9800' }}
        >
          <Plus size={15} /> Add Link
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {totalLinks === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: '#94a3b8' }}>
            <Link2 size={48} className="opacity-20" />
            <p className="text-lg font-medium">No links yet</p>
            <p className="text-sm">Add your first link to get started</p>
            <button 
              onClick={() => { setAddLinkToSection(null); setShowAddLinkModal(true); }}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#FF980020', color: '#FF9800' }}
            >
              <Plus size={14} className="inline mr-1" /> Add Link
            </button>
          </div>
        )}

        {totalLinks > 0 && sections.map(section => {
          const sectionLinks = getLinksForSection(section?.id || null);
          if (sectionLinks.length === 0 && section !== null) return null;
          
          return (
            <Section
              key={section?.id || 'uncategorized'}
              section={section}
              links={sectionLinks}
              containerId={container.id}
              isDark={isDarkTheme}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dragState={dragState}
              onToggleCollapse={handleToggleCollapse}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              onAddLink={handleAddLink}
            />
          );
        })}
      </div>

      {/* Modals */}
      <AddLinkModal
        isOpen={showAddLinkModal}
        onClose={() => { setShowAddLinkModal(false); setAddLinkToSection(null); }}
        containerId={container.id}
        sectionId={addLinkToSection}
        isDark={isDarkTheme}
      />
      
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAdd={handleAddSection}
        isDark={isDarkTheme}
      />
    </div>
  );
}
