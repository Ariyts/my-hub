import { useState } from 'react';
import { useStore } from '../store';
import type { ObjectType, Folder } from '../types';
import {
  FolderOpen, Plus, Search, ChevronRight,
  ChevronDown, MoreVertical, FileText, Terminal, Link2, MessageSquare, Star
} from 'lucide-react';

const TYPE_COLORS: Record<ObjectType, string> = {
  notes: '#4CAF50',
  commands: '#2196F3',
  links: '#FF9800',
  prompts: '#9C27B0',
};

const TYPE_ICONS = {
  notes: FileText,
  commands: Terminal,
  links: Link2,
  prompts: MessageSquare,
};

interface FolderItemProps {
  folder: Folder;
  depth: number;
  activeItemId: string | null;
  onSelectItem: (id: string) => void;
}

function FolderItem({ folder, depth, activeItemId, onSelectItem }: FolderItemProps) {
  const { activeType, notes, commands, links, prompts, activeFolderId, setActiveFolderId, toggleFolderExpanded, updateFolder, deleteFolder, isDarkTheme } = useStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const getItems = () => {
    switch (activeType) {
      case 'notes': return notes.filter(n => n.folderId === folder.id);
      case 'commands': return commands.filter(c => c.folderId === folder.id);
      case 'links': return links.filter(l => l.folderId === folder.id);
      case 'prompts': return prompts.filter(p => p.folderId === folder.id);
    }
  };

  const items = getItems();
  const isActive = activeFolderId === folder.id;
  const TypeIcon = TYPE_ICONS[activeType];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRename = () => {
    if (newName.trim()) updateFolder(folder.id, { name: newName.trim() });
    setRenaming(false);
    setContextMenu(null);
  };

  return (
    <div>
      {contextMenu && (
        <div
          className="fixed z-50 rounded-lg shadow-xl border py-1 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: isDarkTheme ? '#1e293b' : '#fff',
            borderColor: isDarkTheme ? '#334155' : '#e2e8f0',
          }}
        >
          {[
            { label: 'Rename', action: () => { setRenaming(true); setContextMenu(null); } },
            { label: 'Delete', action: () => { deleteFolder(folder.id); setContextMenu(null); }, danger: true },
          ].map(item => (
            <button
              key={item.label}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              style={{ color: item.danger ? '#ef4444' : isDarkTheme ? '#e2e8f0' : '#1e293b' }}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {contextMenu && <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />}

      <div
        className="group flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg mx-2 transition-all duration-150"
        style={{
          paddingLeft: `${12 + depth * 16}px`,
          background: isActive ? `${TYPE_COLORS[activeType]}18` : 'transparent',
          border: isActive ? `1px solid ${TYPE_COLORS[activeType]}40` : '1px solid transparent',
        }}
        onClick={() => { setActiveFolderId(folder.id); }}
        onContextMenu={handleContextMenu}
      >
        <button
          onClick={(e) => { e.stopPropagation(); toggleFolderExpanded(folder.id); }}
          className="flex-shrink-0"
        >
          {folder.isExpanded ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
        </button>
        <span className="text-sm">{folder.icon || (folder.isExpanded ? '📂' : '📁')}</span>
        {renaming ? (
          <input
            className="flex-1 text-sm bg-transparent border-b outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm font-medium truncate" style={{ color: isActive ? TYPE_COLORS[activeType] : isDarkTheme ? '#cbd5e1' : '#374151' }}>
            {folder.name}
          </span>
        )}
        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>
          {items.length}
        </span>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY }); }}
        >
          <MoreVertical size={13} className="text-slate-400" />
        </button>
      </div>

      {folder.isExpanded && items.map((item) => {
        const isItemActive = activeItemId === item.id;
        return (
          <div
            key={item.id}
            className="flex items-center gap-2 cursor-pointer rounded-lg mx-2 transition-all duration-150 group"
            style={{
              paddingLeft: `${28 + depth * 16}px`,
              paddingRight: '8px',
              paddingTop: '5px',
              paddingBottom: '5px',
              background: isItemActive ? `${TYPE_COLORS[activeType]}22` : 'transparent',
              border: isItemActive ? `1px solid ${TYPE_COLORS[activeType]}50` : '1px solid transparent',
            }}
            onClick={() => onSelectItem(item.id)}
          >
            <TypeIcon size={12} style={{ color: TYPE_COLORS[activeType], flexShrink: 0 }} />
            <span className="flex-1 text-sm truncate" style={{ color: isItemActive ? TYPE_COLORS[activeType] : isDarkTheme ? '#94a3b8' : '#6b7280' }}>
              {item.title}
            </span>
            {'isFavorite' in item && item.isFavorite && <Star size={10} className="text-amber-400 fill-amber-400" />}
          </div>
        );
      })}
    </div>
  );
}

export function FolderPanel() {
  const {
    activeType, folders, searchQuery, setSearchQuery, activeItemId,
    setActiveItemId, addFolder, addNote, addCommandContainer, addLinkContainer,
    addPromptContainer, activeFolderId, isDarkTheme
  } = useStore();

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const typeFolders = folders.filter(f => f.type === activeType && f.parentId === null);

  const typeLabels: Record<ObjectType, string> = {
    notes: 'Notes', commands: 'Commands', links: 'Links', prompts: 'Prompts'
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim(), type: activeType, parentId: null, isExpanded: true });
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleAddItem = () => {
    const folderId = activeFolderId || (typeFolders[0]?.id ?? '');
    if (!folderId) {
      alert('Please create a folder first');
      return;
    }
    switch (activeType) {
      case 'notes':
        addNote({ folderId, title: 'New Note', content: '# New Note\n\nStart writing...', tags: [], isFavorite: false, type: 'notes' });
        break;
      case 'commands':
        addCommandContainer({ folderId, title: 'New Commands', subItems: [], tags: [], type: 'commands', isExpanded: true });
        break;
      case 'links':
        addLinkContainer({ folderId, title: 'New Links', subItems: [], tags: [], type: 'links', isExpanded: true });
        break;
      case 'prompts':
        addPromptContainer({ folderId, title: 'New Prompts', subItems: [], tags: [], category: 'General', type: 'prompts', isExpanded: true });
        break;
    }
  };

  const filteredFolders = typeFolders.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        width: '260px',
        minWidth: '260px',
        background: isDarkTheme ? '#111827' : '#f8fafc',
        borderColor: isDarkTheme ? '#1e293b' : '#e2e8f0',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: isDarkTheme ? '#1e293b' : '#e2e8f0' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: TYPE_COLORS[activeType] }}>
            {typeLabels[activeType]}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={handleAddItem}
              title={`New ${typeLabels[activeType].slice(0, -1)}`}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
              style={{ color: TYPE_COLORS[activeType] }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none transition-all"
            style={{
              background: isDarkTheme ? '#1e293b' : '#fff',
              borderColor: isDarkTheme ? '#334155' : '#e2e8f0',
              color: isDarkTheme ? '#e2e8f0' : '#1e293b',
            }}
          />
        </div>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {filteredFolders.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            No folders yet.<br />
            <button onClick={() => setShowNewFolder(true)} className="text-blue-400 hover:underline mt-1">Create one</button>
          </div>
        )}
        {filteredFolders.map(folder => (
          <FolderItem
            key={folder.id}
            folder={folder}
            depth={0}
            activeItemId={activeItemId}
            onSelectItem={(id) => setActiveItemId(id)}
          />
        ))}
      </div>

      {/* New folder input */}
      {showNewFolder && (
        <div className="px-3 pb-2">
          <input
            autoFocus
            className="w-full px-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{
              background: isDarkTheme ? '#1e293b' : '#fff',
              borderColor: TYPE_COLORS[activeType],
              color: isDarkTheme ? '#e2e8f0' : '#1e293b',
            }}
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
            onBlur={handleAddFolder}
          />
        </div>
      )}

      {/* Footer */}
      <div className="p-2 border-t flex gap-2" style={{ borderColor: isDarkTheme ? '#1e293b' : '#e2e8f0' }}>
        <button
          onClick={() => setShowNewFolder(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9', color: isDarkTheme ? '#94a3b8' : '#6b7280' }}
        >
          <FolderOpen size={13} />
          New Folder
        </button>
        <button
          onClick={handleAddItem}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: `${TYPE_COLORS[activeType]}20`, color: TYPE_COLORS[activeType] }}
        >
          <Plus size={13} />
          New Item
        </button>
      </div>
    </div>
  );
}
