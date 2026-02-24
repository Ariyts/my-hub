import { useState } from 'react';
import { useStore } from '../store';
import type { ObjectType, CustomType, BaseDataType } from '../types';
import { Settings, Plus, MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';

// Default types that can't be deleted
const DEFAULT_TYPES: CustomType[] = [
  { id: 'notes', label: 'Notes', icon: '📝', color: '#4CAF50', baseType: 'notes', isDefault: true },
  { id: 'commands', label: 'Commands', icon: '⌘', color: '#2196F3', baseType: 'commands', isDefault: true },
  { id: 'links', label: 'Links', icon: '🔗', color: '#FF9800', baseType: 'links', isDefault: true },
  { id: 'prompts', label: 'Prompts', icon: '💬', color: '#9C27B0', baseType: 'prompts', isDefault: true },
];

const BASE_TYPE_OPTIONS: { value: BaseDataType; label: string }[] = [
  { value: 'notes', label: 'Notes (text content)' },
  { value: 'commands', label: 'Commands (code snippets)' },
  { value: 'links', label: 'Links (URLs)' },
  { value: 'prompts', label: 'Prompts (AI templates)' },
];

const EMOJI_OPTIONS = ['📝', '⌘', '🔗', '💬', '📁', '🏷️', '📌', '🔖', '📋', '📊', '🗂️', '📚', '💡', '🎯', '⭐', '🚀', '💻', '🎨', '🔧', '⚡'];
const COLOR_OPTIONS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4', '#FF5722', '#795548', '#607D8B', '#3F51B5'];

export function Sidebar() {
  const { activeType, setActiveType, setShowSettings, isDarkTheme, settings, setSettings } = useStore();
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState<CustomType | null>(null);
  const [editingType, setEditingType] = useState<Partial<CustomType>>({});
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  
  // Merge default types with custom types from settings
  const allTypes = [...DEFAULT_TYPES, ...(settings.customTypes || [])];

  const handleAddType = (baseType: BaseDataType) => {
    const newType: CustomType = {
      id: `custom_${Date.now()}`,
      label: `New ${baseType}`,
      icon: '📁',
      color: '#6366f1',
      baseType,
      isDefault: false,
    };
    setSettings({ customTypes: [...(settings.customTypes || []), newType] });
    setShowAddMenu(false);
    setActiveType(newType.id);
  };

  const handleEditType = (type: CustomType) => {
    if (!editingType.label?.trim()) return;
    
    const updatedType: CustomType = {
      ...type,
      label: editingType.label || type.label,
      icon: editingType.icon || type.icon,
      color: editingType.color || type.color,
    };
    
    if (type.isDefault) {
      // Can't edit default types
      setShowEditModal(null);
      return;
    }
    
    const newCustomTypes = (settings.customTypes || []).map(t => 
      t.id === type.id ? updatedType : t
    );
    setSettings({ customTypes: newCustomTypes });
    setShowEditModal(null);
    setEditingType({});
  };

  const handleDeleteType = (type: CustomType) => {
    if (type.isDefault) return;
    const newCustomTypes = (settings.customTypes || []).filter(t => t.id !== type.id);
    setSettings({ customTypes: newCustomTypes });
    if (activeType === type.id) {
      setActiveType('notes');
    }
    setContextMenu(null);
  };

  const openEditModal = (type: CustomType) => {
    setEditingType({ ...type });
    setShowEditModal(type);
    setContextMenu(null);
  };

  return (
    <aside
      className="flex flex-col items-center py-3 gap-1 border-r transition-all duration-300 z-20 relative"
      style={{
        width: '72px',
        minWidth: '72px',
        background: isDarkTheme ? '#0f172a' : '#1e293b',
        borderColor: isDarkTheme ? '#1e293b' : '#0f172a',
      }}
    >
      {/* Logo */}
      <div className="mb-4 mt-1 flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          onClick={() => setActiveType('notes')}
        >
          K
        </div>
      </div>

      {/* Type buttons */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2 relative">
        {allTypes.map((type) => {
          const isActive = activeType === type.id;
          return (
            <div key={type.id} className="relative group">
              <button
                onClick={() => setActiveType(type.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ id: type.id, x: e.clientX, y: e.clientY });
                }}
                title={type.label}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full"
                style={{
                  background: isActive ? `${type.color}22` : 'transparent',
                  border: isActive ? `1.5px solid ${type.color}66` : '1.5px solid transparent',
                }}
              >
                <span
                  className="text-xl leading-none transition-transform duration-200 group-hover:scale-110"
                  style={{ filter: isActive ? 'none' : 'grayscale(0.3) opacity(0.7)' }}
                >
                  {type.icon}
                </span>
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider leading-none truncate w-full text-center"
                  style={{ color: isActive ? type.color : '#94a3b8' }}
                >
                  {type.label.length > 6 ? type.label.slice(0, 5) + '.' : type.label}
                </span>
              </button>
              
              {/* Context menu trigger (three dots) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setContextMenu({ id: type.id, x: rect.right, y: rect.top });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700"
              >
                <MoreHorizontal size={12} className="text-slate-400" />
              </button>
            </div>
          );
        })}
        
        {/* Add button */}
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full hover:bg-slate-700 border border-dashed border-slate-600 mt-2"
        >
          <Plus size={18} className="text-slate-400" />
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Add</span>
        </button>
      </nav>

      {/* Add Type Menu */}
      {showAddMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAddMenu(false)} 
          />
          <div 
            className="absolute left-full ml-2 bottom-20 rounded-xl shadow-xl z-50 p-2 min-w-[160px]"
            style={{ background: isDarkTheme ? '#1e293b' : '#fff', border: '1px solid #334155' }}
          >
            <div className="text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Choose base type:</div>
            {BASE_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAddType(option.value)}
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
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setContextMenu(null)} 
          />
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
                const type = allTypes.find(t => t.id === contextMenu.id);
                if (type && !type.isDefault) openEditModal(type);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-700 transition-colors"
              style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
            >
              <Edit2 size={12} /> Edit
            </button>
            {(() => {
              const type = allTypes.find(t => t.id === contextMenu.id);
              return type && !type.isDefault ? (
                <button
                  onClick={() => handleDeleteType(type)}
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
            <h3 className="text-sm font-semibold mb-4" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
              Edit Category
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editingType.label || ''}
                  onChange={(e) => setEditingType({ ...editingType, label: e.target.value })}
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
                      onClick={() => setEditingType({ ...editingType, icon: emoji })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${editingType.icon === emoji ? 'ring-2 ring-indigo-500' : ''}`}
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
                      onClick={() => setEditingType({ ...editingType, color })}
                      className={`w-6 h-6 rounded-full transition-all ${editingType.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
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
                onClick={() => showEditModal && handleEditType(showEditModal)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="flex flex-col gap-1 w-full px-2 mt-auto">
        <div className="h-px bg-slate-700 mx-1 mb-1" />
        <button
          onClick={() => setShowSettings(true)}
          title="Settings"
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full hover:bg-slate-700"
        >
          <Settings size={18} className="text-slate-400" />
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Config</span>
        </button>
      </div>
    </aside>
  );
}
