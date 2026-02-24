import { useState } from 'react';
import { useStore } from '../store';
import type { Category, BaseDataType } from '../types';
import { Settings, Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const BASE_TYPE_OPTIONS: { value: BaseDataType; label: string }[] = [
  { value: 'notes', label: 'Notes (text content)' },
  { value: 'commands', label: 'Commands (code snippets)' },
  { value: 'links', label: 'Links (URLs)' },
  { value: 'prompts', label: 'Prompts (AI templates)' },
];

const EMOJI_OPTIONS = ['📝', '⌘', '🔗', '💬', '📁', '🏷️', '📌', '🔖', '📋', '📊', '🗂️', '📚', '💡', '🎯', '⭐', '🚀', '💻', '🎨', '🔧', '⚡'];
const COLOR_OPTIONS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4', '#FF5722', '#795548', '#607D8B', '#3F51B5'];

export function Sidebar() {
  const { 
    activeWorkspaceId, 
    categories, 
    activeCategoryId, 
    setActiveCategoryId,
    setShowSettings, 
    isDarkTheme, 
    addCategory,
    updateCategory,
    deleteCategory,
    notes,
    commands,
    links,
    prompts
  } = useStore();
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  
  // Filter categories for current workspace
  const workspaceCategories = categories
    .filter(c => c.workspaceId === activeWorkspaceId)
    .sort((a, b) => a.order - b.order);

  const handleAddCategory = (baseType: BaseDataType) => {
    addCategory({
      workspaceId: activeWorkspaceId!,
      name: `New ${baseType}`,
      icon: '📁',
      color: '#6366f1',
      baseType,
      isDefault: false,
    });
    setShowAddMenu(false);
  };

  const handleEditCategory = (category: Category) => {
    if (!editingCategory.name?.trim()) return;
    
    updateCategory(category.id, {
      name: editingCategory.name || category.name,
      icon: editingCategory.icon || category.icon,
      color: editingCategory.color || category.color,
    });
    
    setShowEditModal(null);
    setEditingCategory({});
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) return;
    deleteCategory(category.id);
    setContextMenu(null);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory({ ...category });
    setShowEditModal(category);
    setContextMenu(null);
  };

  // Get item count for a category
  const getItemCount = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 0;
    
    const categoryFolderIds = useStore.getState().folders
      .filter(f => f.categoryId === categoryId)
      .map(f => f.id);
    
    switch (category.baseType) {
      case 'notes': 
        return notes.filter(n => categoryFolderIds.includes(n.folderId)).length;
      case 'commands': 
        return commands.filter(c => categoryFolderIds.includes(c.folderId)).length;
      case 'links': 
        return links.filter(l => categoryFolderIds.includes(l.folderId)).length;
      case 'prompts': 
        return prompts.filter(p => categoryFolderIds.includes(p.folderId)).length;
      default: 
        return 0;
    }
  };

  return (
    <aside
      className="flex flex-col border-r transition-all duration-300 z-20 relative"
      style={{
        width: '200px',
        minWidth: '200px',
        background: isDarkTheme ? '#0f172a' : '#1e293b',
        borderColor: isDarkTheme ? '#1e293b' : '#0f172a',
      }}
    >
      {/* Workspace Switcher */}
      <div className="border-b" style={{ borderColor: isDarkTheme ? '#1e293b' : '#0f172a' }}>
        <WorkspaceSwitcher />
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Categories
          </span>
        </div>
        
        {workspaceCategories.map((category) => {
          const isActive = activeCategoryId === category.id;
          const isDragging = draggedCategoryId === category.id;
          const itemCount = getItemCount(category.id);
          
          return (
            <div 
              key={category.id} 
              className="relative group px-1"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                setDraggedCategoryId(category.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                // Reorder logic could be added here
                setDraggedCategoryId(null);
              }}
              onDragEnd={() => {
                setDraggedCategoryId(null);
              }}
              style={{ opacity: isDragging ? 0.5 : 1 }}
            >
              <button
                onClick={() => setActiveCategoryId(category.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ id: category.id, x: e.clientX, y: e.clientY });
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-200"
                style={{
                  background: isActive ? `${category.color}22` : 'transparent',
                  border: isActive ? `1px solid ${category.color}40` : '1px solid transparent',
                }}
              >
                <span className="text-base">{category.icon}</span>
                <span 
                  className="flex-1 text-sm font-medium text-left truncate"
                  style={{ color: isActive ? category.color : (isDarkTheme ? '#cbd5e1' : '#94a3b8') }}
                >
                  {category.name}
                </span>
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}
                >
                  {itemCount}
                </span>
              </button>
              
              {/* Context menu button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu({ id: category.id, x: e.clientX, y: e.clientY });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700"
              >
                <MoreHorizontal size={12} className="text-slate-400" />
              </button>
            </div>
          );
        })}
        
        {/* Add category button */}
        <div className="px-2 mt-2">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-slate-700 border border-dashed border-slate-600"
            style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}
          >
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        </div>
      </nav>

      {/* Add Category Menu */}
      {showAddMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
          <div 
            className="absolute left-2 bottom-16 rounded-xl shadow-xl z-50 p-2 min-w-[160px]"
            style={{ background: isDarkTheme ? '#1e293b' : '#fff', border: '1px solid #334155' }}
          >
            <div className="text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Choose base type:
            </div>
            {BASE_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAddCategory(option.value)}
                className="w-full text-left px-2 py-2 text-xs rounded-lg hover:bg-slate-700 transition-colors"
                style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div 
            className="fixed z-50 rounded-xl shadow-xl p-1 min-w-[120px]"
            style={{ 
              left: contextMenu.x + 10, 
              top: contextMenu.y,
              background: isDarkTheme ? '#1e293b' : '#fff', 
              border: '1px solid #334155' 
            }}
          >
            <button
              onClick={() => {
                const category = workspaceCategories.find(c => c.id === contextMenu.id);
                if (category) openEditModal(category);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-700 transition-colors"
              style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
            >
              <Edit2 size={12} /> Edit
            </button>
            {(() => {
              const category = workspaceCategories.find(c => c.id === contextMenu.id);
              return category && !category.isDefault ? (
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-red-900/30 transition-colors text-red-400"
                >
                  <Trash2 size={12} /> Delete
                </button>
              ) : null;
            })()}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowEditModal(null)}
        >
          <div 
            className="rounded-2xl p-5 w-full max-w-xs"
            style={{ background: isDarkTheme ? '#1e293b' : '#fff', border: '1px solid #334155' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-1" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
              Edit Category
            </h3>
            {showEditModal?.isDefault && (
              <p className="text-[10px] text-slate-400 mb-3">Default category - cannot delete</p>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ 
                    background: isDarkTheme ? '#0f172a' : '#f1f5f9',
                    color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                    border: '1px solid #334155'
                  }}
                />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditingCategory({ ...editingCategory, icon: emoji })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${editingCategory.icon === emoji ? 'ring-2 ring-indigo-500' : ''}`}
                      style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9' }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Color</label>
                <div className="flex flex-wrap gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                      className={`w-6 h-6 rounded-full transition-all ${editingCategory.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: '#94a3b8' }}
              >
                Cancel
              </button>
              <button
                onClick={() => showEditModal && handleEditCategory(showEditModal)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom - Settings */}
      <div className="p-2 border-t" style={{ borderColor: isDarkTheme ? '#1e293b' : '#0f172a' }}>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-slate-700"
          style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
