import { useState } from 'react';
import { useStore } from '../store';
import type { Folder, BaseDataType } from '../types';
import {
  FolderOpen, Plus, Search, ChevronRight,
  ChevronDown, MoreVertical, FileText, Terminal, Link2, MessageSquare, Star,
  Edit2, Trash2, GripVertical
} from 'lucide-react';

const BASE_TYPE_COLORS: Record<BaseDataType, string> = {
  notes: '#4CAF50',
  commands: '#2196F3',
  links: '#FF9800',
  prompts: '#9C27B0',
};

const BASE_TYPE_ICONS: Record<BaseDataType, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  notes: FileText,
  commands: Terminal,
  links: Link2,
  prompts: MessageSquare,
};

// Get color for a type (default or custom)
function getTypeColor(type: string, settings: any): string {
  const customType = settings.customTypes?.find((t: any) => t.id === type);
  if (customType) return customType.color;
  if (type in BASE_TYPE_COLORS) return BASE_TYPE_COLORS[type as BaseDataType];
  return '#6366f1';
}

// Get base type for any type
function getBaseType(type: string, settings: any): BaseDataType {
  const customType = settings.customTypes?.find((t: any) => t.id === type);
  if (customType) return customType.baseType;
  if (type in BASE_TYPE_COLORS) return type as BaseDataType;
  return 'notes';
}

interface FolderItemProps {
  folder: Folder;
  depth: number;
  activeItemId: string | null;
  onSelectFolder: (id: string) => void;
  onSelectItem: (id: string) => void;
  onAddItemToFolder: (folderId: string) => void;
}

function FolderItem({ folder, depth, activeItemId, onSelectFolder, onSelectItem, onAddItemToFolder }: FolderItemProps) {
  const { 
    activeType, notes, commands, links, prompts, 
    activeFolderId, toggleFolderExpanded, updateFolder, deleteFolder, 
    isDarkTheme, settings, updateNote, deleteNote, updateCommandContainer, 
    deleteCommandContainer, updateLinkContainer, deleteLinkContainer,
    updatePromptContainer, deletePromptContainer
  } = useStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'folder' | 'item'; itemId?: string } | null>(null);
  const [renaming, setRenaming] = useState<{ type: 'folder' | 'item'; itemId?: string } | null>(null);
  const [newName, setNewName] = useState(folder.name);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const baseType = getBaseType(activeType, settings);
  const typeColor = getTypeColor(activeType, settings);
  const TypeIcon = BASE_TYPE_ICONS[baseType];

  const getItems = () => {
    // Get items based on base type (for custom types)
    const allFolders = useStore.getState().folders.filter(f => f.type === activeType);
    const folderIds = allFolders.map(f => f.id);
    
    switch (baseType) {
      case 'notes': return notes.filter(n => folderIds.includes(n.folderId) && n.folderId === folder.id);
      case 'commands': return commands.filter(c => folderIds.includes(c.folderId) && c.folderId === folder.id);
      case 'links': return links.filter(l => folderIds.includes(l.folderId) && l.folderId === folder.id);
      case 'prompts': return prompts.filter(p => folderIds.includes(p.folderId) && p.folderId === folder.id);
    }
  };

  const items = getItems();
  const isActive = activeFolderId === folder.id;

  const handleContextMenu = (e: React.MouseEvent, type: 'folder' | 'item', itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, itemId });
  };

  const handleRenameFolder = () => {
    if (newName.trim()) updateFolder(folder.id, { name: newName.trim() });
    setRenaming(null);
    setContextMenu(null);
  };

  const handleRenameItem = (itemId: string) => {
    if (newName.trim()) {
      switch (baseType) {
        case 'notes': updateNote(itemId, { title: newName.trim() }); break;
        case 'commands': updateCommandContainer(itemId, { title: newName.trim() }); break;
        case 'links': updateLinkContainer(itemId, { title: newName.trim() }); break;
        case 'prompts': updatePromptContainer(itemId, { title: newName.trim() }); break;
      }
    }
    setRenaming(null);
    setContextMenu(null);
  };

  const handleDeleteItem = (itemId: string) => {
    switch (baseType) {
      case 'notes': deleteNote(itemId); break;
      case 'commands': deleteCommandContainer(itemId); break;
      case 'links': deleteLinkContainer(itemId); break;
      case 'prompts': deletePromptContainer(itemId); break;
    }
    setContextMenu(null);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: item.id,
      folderId: item.folderId,
      title: item.title
    }));
  };

  const handleDragOver = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(targetFolderId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.folderId !== targetFolderId) {
        // Move item to new folder
        switch (baseType) {
          case 'notes': updateNote(data.id, { folderId: targetFolderId }); break;
          case 'commands': updateCommandContainer(data.id, { folderId: targetFolderId }); break;
          case 'links': updateLinkContainer(data.id, { folderId: targetFolderId }); break;
          case 'prompts': updatePromptContainer(data.id, { folderId: targetFolderId }); break;
        }
      }
    } catch (err) {
      console.error('Drop failed:', err);
    }
    setDropTarget(null);
  };

  const startRenameItem = (itemId: string, currentTitle: string) => {
    setNewName(currentTitle);
    setRenaming({ type: 'item', itemId });
    setContextMenu(null);
  };

  return (
    <div
      onDragOver={(e) => handleDragOver(e, folder.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, folder.id)}
      className={dropTarget === folder.id ? 'bg-indigo-500/10 rounded-lg mx-1' : ''}
    >
      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 rounded-lg shadow-xl border py-1 min-w-[140px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              background: isDarkTheme ? '#1e293b' : '#fff',
              borderColor: isDarkTheme ? '#334155' : '#e2e8f0',
            }}
          >
            {contextMenu.type === 'folder' ? (
              <>
                <button
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
                  onClick={() => { setNewName(folder.name); setRenaming({ type: 'folder' }); setContextMenu(null); }}
                >
                  <Edit2 size={12} /> Rename
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-red-900/30"
                  style={{ color: '#ef4444' }}
                  onClick={() => { deleteFolder(folder.id); setContextMenu(null); }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
                  onClick={() => {
                    const item = items.find(i => i.id === contextMenu.itemId);
                    if (item) startRenameItem(item.id, item.title);
                  }}
                >
                  <Edit2 size={12} /> Rename
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-red-900/30"
                  style={{ color: '#ef4444' }}
                  onClick={() => contextMenu.itemId && handleDeleteItem(contextMenu.itemId)}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Folder row */}
      <div
        className="group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer rounded-lg mx-1 transition-all duration-150"
        style={{
          paddingLeft: `${10 + depth * 14}px`,
          background: isActive ? `${typeColor}15` : 'transparent',
          border: isActive ? `1px solid ${typeColor}40` : '1px solid transparent',
        }}
        onClick={() => onSelectFolder(folder.id)}
        onContextMenu={(e) => handleContextMenu(e, 'folder')}
      >
        <button
          onClick={(e) => { e.stopPropagation(); toggleFolderExpanded(folder.id); }}
          className="flex-shrink-0 p-0.5 hover:bg-slate-700 rounded"
        >
          {folder.isExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
        </button>
        <span className="text-sm">{folder.icon || (folder.isExpanded ? '📂' : '📁')}</span>
        
        {renaming?.type === 'folder' ? (
          <input
            className="flex-1 text-sm bg-transparent border-b outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRenameFolder}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFolder(); if (e.key === 'Escape') setRenaming(null); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm font-medium truncate" style={{ color: isActive ? typeColor : isDarkTheme ? '#cbd5e1' : '#374151' }}>
            {folder.name}
          </span>
        )}
        
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>
          {items.length}
        </span>
        
        {/* Add item button */}
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-700 rounded"
          onClick={(e) => { e.stopPropagation(); onAddItemToFolder(folder.id); }}
          title="Add item"
        >
          <Plus size={12} style={{ color: typeColor }} />
        </button>
        
        {/* More options */}
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-700 rounded"
          onClick={(e) => { e.stopPropagation(); handleContextMenu(e, 'folder'); }}
        >
          <MoreVertical size={12} className="text-slate-400" />
        </button>
      </div>

      {/* Items inside folder */}
      {folder.isExpanded && items.map((item) => {
        const isItemActive = activeItemId === item.id;
        const isRenamingThis = renaming?.type === 'item' && renaming.itemId === item.id;
        
        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="group/item flex items-center gap-1.5 cursor-pointer rounded-lg mx-1 transition-all duration-150"
            style={{
              paddingLeft: `${26 + depth * 14}px`,
              paddingRight: '6px',
              paddingTop: '4px',
              paddingBottom: '4px',
              background: isItemActive ? `${typeColor}22` : 'transparent',
              border: isItemActive ? `1px solid ${typeColor}50` : '1px solid transparent',
            }}
            onClick={() => onSelectItem(item.id)}
            onContextMenu={(e) => handleContextMenu(e, 'item', item.id)}
          >
            {/* Drag handle */}
            <div className="opacity-0 group-hover/item:opacity-30 cursor-grab">
              <GripVertical size={10} className="text-slate-400" />
            </div>
            
            <TypeIcon size={11} style={{ color: typeColor, flexShrink: 0 }} />
            
            {isRenamingThis ? (
              <input
                className="flex-1 text-xs bg-transparent border-b outline-none"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleRenameItem(item.id)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameItem(item.id); if (e.key === 'Escape') setRenaming(null); }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-xs truncate" style={{ color: isItemActive ? typeColor : isDarkTheme ? '#94a3b8' : '#6b7280' }}>
                {item.title}
              </span>
            )}
            
            {'isFavorite' in item && item.isFavorite && <Star size={9} className="text-amber-400 fill-amber-400" />}
            
            {/* Edit/Delete buttons */}
            <button
              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 hover:bg-slate-700 rounded"
              onClick={(e) => { e.stopPropagation(); startRenameItem(item.id, item.title); }}
              title="Rename"
            >
              <Edit2 size={10} className="text-slate-400 hover:text-slate-200" />
            </button>
            <button
              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 hover:bg-red-900/30 rounded"
              onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
              title="Delete"
            >
              <Trash2 size={10} className="text-slate-400 hover:text-red-400" />
            </button>
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
    addPromptContainer, setActiveFolderId, isDarkTheme, settings
  } = useStore();

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const typeFolders = folders.filter(f => f.type === activeType && f.parentId === null);
  const baseType = getBaseType(activeType, settings);
  const typeColor = getTypeColor(activeType, settings);

  const typeLabels: Record<BaseDataType, string> = {
    notes: 'Notes', commands: 'Commands', links: 'Links', prompts: 'Prompts'
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim(), type: activeType, parentId: null, isExpanded: true });
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleAddItem = (folderId: string) => {
    switch (baseType) {
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

  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
    // Clear item selection when selecting a folder
    setActiveItemId(null);
  };

  const handleSelectItem = (itemId: string) => {
    setActiveItemId(itemId);
  };

  const filteredFolders = typeFolders.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current type label
  const currentType = settings.customTypes?.find((t: any) => t.id === activeType);
  const typeLabel = currentType?.label || typeLabels[baseType] || 'Items';

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
          <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: typeColor }}>
            {typeLabel}
          </h2>
          <button
            onClick={() => {
              const firstFolder = typeFolders[0];
              if (firstFolder) handleAddItem(firstFolder.id);
            }}
            title={`New ${typeLabel.slice(0, -1)}`}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            style={{ background: `${typeColor}15` }}
          >
            <Plus size={16} style={{ color: typeColor }} />
          </button>
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
            onSelectFolder={handleSelectFolder}
            onSelectItem={handleSelectItem}
            onAddItemToFolder={handleAddItem}
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
              borderColor: typeColor,
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
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9', color: isDarkTheme ? '#94a3b8' : '#6b7280' }}
        >
          <FolderOpen size={13} />
          New Folder
        </button>
        <button
          onClick={() => {
            const firstFolder = typeFolders[0];
            if (firstFolder) handleAddItem(firstFolder.id);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: `${typeColor}20`, color: typeColor }}
        >
          <Plus size={13} />
          New Item
        </button>
      </div>
    </div>
  );
}
