import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store';
import type { LinkItem, LinkSection } from '../types';
import { Plus, Search, ExternalLink, Trash2, Edit3, Link2, Star, Check, Copy, Globe, RefreshCw, GripVertical, X, ChevronDown, ChevronRight, Palette, LayoutGrid, LayoutList, FolderPlus } from 'lucide-react';

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
// LINK CARD COMPONENT (Grid View)
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
// COMPACT LINK ITEM COMPONENT (Google Drive Style)
// Key: Drag Handle separated from Link Area
// ============================================
interface CompactLinkItemProps {
  item: LinkItem;
  sectionColor?: string;
  isDark: boolean;
  sectionId: string | null;
  isDragging: boolean;
  onUpdateItem: (itemId: string, updates: Partial<LinkItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, itemId: string, sectionId: string | null) => void;
}

// Color palette for link items
const LINK_COLORS = [
  undefined, // No color (default)
  '#ef4444', // red
  '#f97316', // orange  
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

function CompactLinkItem({ 
  item, 
  sectionColor, 
  isDark, 
  sectionId, 
  isDragging,
  onUpdateItem,
  onDeleteItem,
  onDragStart,
}: CompactLinkItemProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editUrl, setEditUrl] = useState(item.url);
  const [editColor, setEditColor] = useState(item.color);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Google Drive style colors
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const hoverBg = isDark ? '#1f2937' : '#f3f4f6';
  const normalBg = isDark ? '#111827' : '#ffffff';
  
  // Priority: item color > section color > default
  const activeColor = item.color || sectionColor;
  
  // Background with subtle tint
  const getTintedBg = () => {
    if (isHovered || isEditing) return hoverBg;
    if (!activeColor) return normalBg;
    return `${activeColor}10`;
  };
  
  // Start editing
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditColor(item.color);
    setIsEditing(true);
  };
  
  // Save edit
  const handleSaveEdit = () => {
    if (editTitle.trim() && editUrl.trim()) {
      onUpdateItem(item.id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        color: editColor,
      });
    }
    setIsEditing(false);
  };
  
  // Cancel edit
  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditColor(item.color);
    setIsEditing(false);
  };
  
  // Handle key down in edit mode
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  // Cycle color
  const handleCycleColor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentIndex = LINK_COLORS.indexOf(item.color);
    const nextIndex = (currentIndex + 1) % LINK_COLORS.length;
    onUpdateItem(item.id, { color: LINK_COLORS[nextIndex] });
  };
  
  // Delete item
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this link?')) {
      onDeleteItem(item.id);
    }
  };
  
  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // ========================================
  // EDITING MODE - Inline form
  // ========================================
  if (isEditing) {
    return (
      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg border-2 transition-all"
        style={{ 
          background: hoverBg,
          borderColor: '#FF9800',
          minWidth: 0,
        }}
        onBlur={(e) => {
          // Save when focus leaves the form (but not when clicking buttons inside)
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleSaveEdit();
          }
        }}
      >
        {/* Color indicator */}
        {activeColor && (
          <div 
            className="w-1 h-8 rounded-full flex-shrink-0"
            style={{ background: activeColor }}
          />
        )}
        
        {/* Edit inputs */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            placeholder="Title"
            className="w-full text-xs px-2 py-1 rounded border outline-none focus:border-orange-400"
            style={{ 
              background: isDark ? '#0f172a' : '#ffffff',
              borderColor: borderColor,
              color: isDark ? '#e5e7eb' : '#1f2937',
            }}
          />
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            onKeyDown={handleEditKeyDown}
            placeholder="URL"
            className="w-full text-[10px] px-2 py-0.5 rounded border outline-none focus:border-orange-400"
            style={{ 
              background: isDark ? '#0f172a' : '#ffffff',
              borderColor: borderColor,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          />
        </div>
        
        {/* Color selector in edit mode */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <select
            value={editColor || ''}
            onChange={(e) => setEditColor(e.target.value || undefined)}
            className="text-[10px] px-1 py-0.5 rounded border outline-none"
            style={{ 
              background: isDark ? '#0f172a' : '#ffffff',
              borderColor: borderColor,
              color: isDark ? '#e5e7eb' : '#1f2937',
            }}
          >
            <option value="">No color</option>
            {LINK_COLORS.filter(c => c).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        {/* Save / Cancel buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur
            onClick={handleSaveEdit}
            className="p-1 rounded hover:bg-green-500/20 transition-colors"
            title="Save (Enter)"
          >
            <Check size={14} className="text-green-400" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur
            onClick={handleCancelEdit}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
            title="Cancel (Esc)"
          >
            <X size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // VIEW MODE - Clickable link + Drag Handle
  // ========================================
  return (
    <div
      className={`
        relative flex items-center gap-1 px-2 py-1.5 rounded-lg
        transition-all duration-150 border group
        ${isDragging ? 'opacity-50 scale-95 ring-2 ring-orange-400' : ''}
      `}
      style={{ 
        background: getTintedBg(),
        borderColor: isHovered ? (isDark ? '#4b5563' : '#d1d5db') : borderColor,
        minWidth: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color indicator bar (left) */}
      {activeColor && (
        <div 
          className="w-1 h-5 rounded-full flex-shrink-0"
          style={{ background: activeColor }}
        />
      )}
      
      {/* DRAG HANDLE - Only this area starts drag */}
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, item.id, sectionId)}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-slate-500/20"
        title="Drag to move"
      >
        <GripVertical size={12} style={{ color: isDark ? '#6b7280' : '#9ca3af' }} />
      </div>
      
      {/* FAVICON */}
      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded overflow-hidden">
        {item.favicon && !faviconError ? (
          <img 
            src={item.favicon} 
            alt="" 
            className="w-4 h-4 object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <Globe size={12} style={{ color: isDark ? '#6b7280' : '#9ca3af' }} />
        )}
      </div>
      
      {/* LINK AREA - Clickable link, no DnD here */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium truncate flex-1 hover:text-orange-400 transition-colors"
        style={{ color: isDark ? '#e5e7eb' : '#1f2937' }}
        title={`${item.title}\n${item.url}`}
      >
        {item.title}
      </a>
      
      {/* Favorite indicator */}
      {item.isFavorite && (
        <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
      )}
      
      {/* Action buttons - show on hover */}
      {isHovered && (
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Color button */}
          <button
            onClick={handleCycleColor}
            className="p-1 rounded hover:bg-slate-500/20 transition-colors"
            title="Change color"
          >
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ 
                background: item.color || 'transparent',
                borderColor: item.color || (isDark ? '#4b5563' : '#d1d5db')
              }}
            />
          </button>
          
          {/* Edit button */}
          <button
            onClick={handleStartEdit}
            className="p-1 rounded hover:bg-blue-500/20 transition-colors"
            title="Edit"
          >
            <Edit3 size={12} style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
          </button>
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// INLINE ADD LINK COMPONENT
// ============================================
interface InlineAddLinkProps {
  isDark: boolean;
  onCreateLink: (url: string, title?: string) => Promise<void>;
  onClose: () => void;
}

function InlineAddLink({ isDark, onCreateLink, onClose }: InlineAddLinkProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleAdd = async () => {
    if (!url.trim()) return;
    
    let finalTitle = title.trim();
    
    if (!finalTitle) {
      setIsFetching(true);
      const meta = await fetchLinkMetadata(url.trim());
      finalTitle = meta.title || getDomain(url.trim());
      setIsFetching(false);
    }
    
    await onCreateLink(url.trim(), finalTitle);
    onClose();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const inputBg = isDark ? '#0f172a' : '#ffffff';
  
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border-2 border-dashed animate-in fade-in duration-150"
      style={{ 
        background: isDark ? '#111827' : '#fafafa',
        borderColor: '#FF9800',
      }}
      tabIndex={-1}
      onBlur={(e) => {
        // Close when focus leaves the form (but not when clicking buttons inside)
        if (!e.currentTarget.contains(e.relatedTarget) && !url.trim()) {
          onClose();
        }
      }}
    >
      {/* URL Input */}
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste URL and press Enter..."
        className="flex-1 text-xs px-2 py-1 rounded border outline-none focus:border-orange-400"
        style={{ 
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? '#e5e7eb' : '#1f2937',
        }}
      />
      
      {/* Title Input (optional) */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Title (auto)"
        className="w-32 text-xs px-2 py-1 rounded border outline-none focus:border-orange-400"
        style={{ 
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? '#e5e7eb' : '#1f2937',
        }}
      />
      
      {/* Add / Cancel buttons */}
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!url.trim() || isFetching}
          className="p-1 rounded hover:bg-green-500/20 transition-colors disabled:opacity-50"
          title="Add link (Enter)"
        >
          {isFetching ? (
            <RefreshCw size={14} className="text-orange-400 animate-spin" />
          ) : (
            <Check size={14} className="text-green-400" />
          )}
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
          title="Cancel (Esc)"
        >
          <X size={14} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// INLINE ADD SECTION COMPONENT
// ============================================
interface InlineAddSectionProps {
  isDark: boolean;
  onAdd: (title: string) => void;
  onClose: () => void;
}

function InlineAddSection({ isDark, onAdd, onClose }: InlineAddSectionProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const inputBg = isDark ? '#0f172a' : '#ffffff';
  
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed animate-in fade-in duration-150"
      style={{ 
        background: isDark ? '#1e293b' : '#f8fafc',
        borderColor: '#FF9800',
      }}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !title.trim()) {
          onClose();
        }
      }}
    >
      <Link2 size={14} style={{ color: '#FF9800' }} />
      
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Section title..."
        className="flex-1 text-sm px-2 py-1 rounded border outline-none focus:border-orange-400"
        style={{ 
          background: inputBg,
          borderColor: borderColor,
          color: isDark ? '#e2e8f0' : '#1e293b',
        }}
      />
      
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="p-1 rounded hover:bg-green-500/20 transition-colors disabled:opacity-50"
          title="Create section (Enter)"
        >
          <Check size={14} className="text-green-400" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
          title="Cancel (Esc)"
        >
          <X size={14} className="text-red-400" />
        </button>
      </div>
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
  viewMode: 'grid' | 'compact';
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
  onColorSection: (sectionId: string) => void;
  // Item actions for compact mode
  onUpdateItem: (itemId: string, updates: Partial<LinkItem>) => void;
  onDeleteItem: (itemId: string) => void;
  // Inline add link state
  addingLinkToSection: string | null;
  onStartAddLink: (sectionId: string | null) => void;
  onCloseAddLink: () => void;
  onCreateLink: (sectionId: string | null, url: string, title?: string) => Promise<void>;
}

// Predefined color palette
const SECTION_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
];

function Section({ 
  section, links, containerId, isDark, viewMode, onDragStart, onDragOver, onDrop,
  dragState, onToggleCollapse, onEditSection, onDeleteSection, onColorSection,
  onUpdateItem, onDeleteItem, addingLinkToSection, onStartAddLink, onCloseAddLink, onCreateLink
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
                <ChevronRight size={14} style={{ color: section.color || '#FF9800' }} />
              ) : (
                <ChevronDown size={14} style={{ color: section.color || '#FF9800' }} />
              )}
            </button>
            {section.color && (
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ background: section.color }}
              />
            )}
            <Link2 size={14} style={{ color: section.color || '#FF9800' }} />
            <span 
              className="font-medium text-sm flex-1"
              style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
            >
              {section.title}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: section.color ? `${section.color}20` : '#FF980015', color: section.color || '#FF9800' }}
            >
              {links.length}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onColorSection(section.id); }}
                className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
                title="Change color"
              >
                <Palette size={14} style={{ color: section.color || '#64748b' }} />
              </button>
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
          onClick={(e) => { e.stopPropagation(); onStartAddLink(sectionId); }}
          className="p-1 rounded hover:bg-orange-500/20"
          title="Add link to this section"
        >
          <Plus size={14} style={{ color: '#FF9800' }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div 
          className={`p-3 min-h-[80px] ${
            viewMode === 'compact' 
              ? 'compact-grid' 
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
          }`}
          style={{ 
            background: bg,
            ...(viewMode === 'compact' ? {
              columnCount: Math.min(Math.max(Math.floor(links.length / 8) + 1, 2), 6),
              columnGap: '6px',
            } : {})
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragState.draggingItemId && dragState.dropSectionId !== sectionId) {
              onDragOver(e, links.length, sectionId);
            }
          }}
          onDrop={onDrop}
        >
          {viewMode === 'compact' ? (
            // Compact view
            <>
              {links.map((item) => (
                <CompactLinkItem
                  key={item.id}
                  item={item}
                  sectionColor={section?.color}
                  isDark={isDark}
                  sectionId={sectionId}
                  isDragging={dragState.draggingItemId === item.id}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onDragStart={onDragStart}
                />
              ))}
              
              {/* Inline Add Link */}
              {addingLinkToSection === sectionId && (
                <InlineAddLink
                  isDark={isDark}
                  onCreateLink={async (url, title) => {
                    await onCreateLink(sectionId, url, title);
                  }}
                  onClose={onCloseAddLink}
                />
              )}
            </>
          ) : (
            // Grid view
            <>
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
            </>
          )}
          
          {links.length === 0 && addingLinkToSection !== sectionId && (
            <div 
              className="text-center py-6 text-xs border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:border-orange-400"
              style={{ 
                color: '#94a3b8', 
                borderColor: dragState.dropSectionId === sectionId ? '#FF9800' : 'transparent',
                background: dragState.dropSectionId === sectionId ? '#FF980010' : 'transparent'
              }}
              onClick={() => onStartAddLink(sectionId)}
            >
              {dragState.draggingItemId ? 'Drop here to move to this section' : 'Click to add a link'}
            </div>
          )}
        </div>
      )}
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
  // Get container directly from store
  const container = useStore(state => state.links.find(l => l.id === containerId));
  const { 
    updateLinkContainer, 
    updateLinkSection,
    deleteLinkSection,
    addLinkSection,
    updateLinkItem,
    deleteLinkItem,
    addLinkItem,
    isDarkTheme 
  } = useStore();
  
  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURN
  const [search, setSearch] = useState('');
  
  // View mode - persists in localStorage
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>(() => {
    const saved = localStorage.getItem('links-viewMode');
    return (saved === 'compact' || saved === 'grid') ? saved : 'grid';
  });
  
  // Save viewMode to localStorage
  const handleSetViewMode = (mode: 'grid' | 'compact') => {
    setViewMode(mode);
    localStorage.setItem('links-viewMode', mode);
  };
  
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
  
  // Inline add states
  const [addingLinkToSection, setAddingLinkToSection] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);

  // Get sections
  const sections: (LinkSection | null)[] = useMemo(() => {
    const existingSections = container?.sections || [];
    if (existingSections.length === 0) {
      return [null];
    }
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
    
    // Reorder logic
    const targetSectionLinks = container.subItems
      .filter(link => (link.sectionId || null) === dropSectionId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
    const newSubItems = container.subItems.map(item => {
      if (item.id === draggingItemId) {
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

  const handleColorSection = (sectionId: string) => {
    if (!container) return;
    const section = sections.find(s => s?.id === sectionId);
    if (!section) return;
    
    const currentIndex = SECTION_COLORS.indexOf(section.color || '');
    const nextIndex = (currentIndex + 1) % SECTION_COLORS.length;
    const newColor = SECTION_COLORS[nextIndex];
    
    updateLinkSection(container.id, sectionId, { color: newColor });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!container) return;
    
    const linksInSection = container.subItems.filter(link => link.sectionId === sectionId);
    
    if (linksInSection.length > 0) {
      const result = window.confirm(`This section has ${linksInSection.length} link(s). Click OK to move them to "Uncategorized", or Cancel to delete them.`);
      if (result) {
        deleteLinkSection(container.id, sectionId);
      } else {
        const newSubItems = container.subItems
          .filter(link => link.sectionId !== sectionId);
        updateLinkContainer(container.id, { subItems: newSubItems });
        deleteLinkSection(container.id, sectionId);
      }
    } else {
      deleteLinkSection(container.id, sectionId);
    }
  };

  // Inline add link
  const handleStartAddLink = (sectionId: string | null) => {
    setAddingLinkToSection(sectionId);
  };

  const handleCloseAddLink = () => {
    setAddingLinkToSection(null);
  };

  // Handle inline link creation with URL and title
  const handleCreateLink = async (sectionId: string | null, url: string, title?: string) => {
    if (!container || !url.trim()) return;
    
    let finalTitle = title;
    let favicon: string | undefined;
    
    if (!finalTitle) {
      const meta = await fetchLinkMetadata(url);
      finalTitle = meta.title || getDomain(url);
      favicon = meta.favicon;
    }
    
    addLinkItem(container.id, {
      url: url.trim(),
      title: finalTitle || getDomain(url),
      favicon: favicon || `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`,
      tags: [],
      isFavorite: false,
      sectionId: sectionId || undefined,
    });
  };

  // Section actions
  const handleAddSection = (title: string) => {
    if (!container) return;
    addLinkSection(container.id, title);
    setAddingSection(false);
  };

  // Item actions (for compact mode)
  const handleUpdateItem = (itemId: string, updates: Partial<LinkItem>) => {
    if (!container) return;
    updateLinkItem(container.id, itemId, updates);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!container) return;
    deleteLinkItem(container.id, itemId);
  };

  // NOW we can do conditional return AFTER all hooks
  if (!container) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: '#64748b' }}>Links container not found</p>
      </div>
    );
  }

  const isDark = isDarkTheme;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
        <Link2 size={18} style={{ color: '#FF9800' }} />
        <h2 className="font-semibold flex-1" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
          {container.title}
        </h2>
        
        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: isDark ? '#1e293b' : '#f1f5f9' }}>
          <button
            onClick={() => handleSetViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-orange-500/20' : ''}`}
            title="Grid View"
          >
            <LayoutGrid size={14} style={{ color: viewMode === 'grid' ? '#FF9800' : (isDark ? '#64748b' : '#94a3b8') }} />
          </button>
          <button
            onClick={() => handleSetViewMode('compact')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'compact' ? 'bg-orange-500/20' : ''}`}
            title="Compact View"
          >
            <LayoutList size={14} style={{ color: viewMode === 'compact' ? '#FF9800' : (isDark ? '#64748b' : '#94a3b8') }} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="pl-9 pr-4 py-1.5 rounded-lg text-sm border outline-none w-48"
            style={{ 
              background: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#e2e8f0' : '#1e293b'
            }}
          />
        </div>
        
        {/* Add Section button */}
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b' }}
        >
          <FolderPlus size={14} style={{ color: '#FF9800' }} />
          <span className="hidden sm:inline">Section</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Inline Add Section */}
        {addingSection && (
          <InlineAddSection
            isDark={isDark}
            onAdd={handleAddSection}
            onClose={() => setAddingSection(false)}
          />
        )}
        
        {/* Sections */}
        {sections.map((section) => {
          const sectionLinks = getLinksForSection(section?.id || null);
          if (section !== null && sectionLinks.length === 0 && search) return null;
          
          return (
            <Section
              key={section?.id || 'uncategorized'}
              section={section}
              links={sectionLinks}
              containerId={container.id}
              isDark={isDark}
              viewMode={viewMode}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dragState={dragState}
              onToggleCollapse={handleToggleCollapse}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              onColorSection={handleColorSection}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              addingLinkToSection={addingLinkToSection}
              onStartAddLink={handleStartAddLink}
              onCloseAddLink={handleCloseAddLink}
              onCreateLink={handleCreateLink}
            />
          );
        })}
        
        {/* Empty state */}
        {container.subItems.length === 0 && (
          <div className="text-center py-12">
            <Link2 size={48} className="mx-auto mb-4" style={{ color: '#64748b' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
              No links yet
            </h3>
            <p className="text-sm mb-4" style={{ color: '#64748b' }}>
              Start by adding your first link
            </p>
            <button
              onClick={() => handleStartAddLink(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#FF9800', color: 'white' }}
            >
              Add Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
