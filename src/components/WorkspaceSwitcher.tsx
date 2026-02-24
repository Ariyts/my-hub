import { useState } from 'react';
import { useStore } from '../store';
import type { Workspace } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const EMOJI_OPTIONS = ['🏠', '💼', '🎯', '🚀', '📚', '💡', '🎨', '🔧', '⚡', '🎮', '🏠', '📊'];
const COLOR_OPTIONS = ['#6366f1', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4', '#FF5722'];

export function WorkspaceSwitcher() {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    addWorkspace, 
    updateWorkspace, 
    deleteWorkspace,
    isDarkTheme 
  } = useStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', icon: '🏠', color: '#6366f1' });

  const handleCreate = () => {
    if (newWorkspace.name.trim()) {
      addWorkspace({
        name: newWorkspace.name.trim(),
        icon: newWorkspace.icon,
        color: newWorkspace.color,
      });
      setNewWorkspace({ name: '', icon: '🏠', color: '#6366f1' });
      setShowCreateModal(false);
    }
  };

  const handleEdit = (workspace: Workspace) => {
    if (editingWorkspace && editingWorkspace.name.trim()) {
      updateWorkspace(workspace.id, {
        name: editingWorkspace.name,
        icon: editingWorkspace.icon,
        color: editingWorkspace.color,
      });
      setEditingWorkspace(null);
    }
  };

  const bg = isDarkTheme ? '#1e293b' : '#ffffff';
  const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';

  return (
    <div className="flex items-center gap-1 px-2 py-1.5">
      {/* Workspace list */}
      {workspaces.map((workspace) => {
        const isActive = activeWorkspaceId === workspace.id;
        return (
          <div key={workspace.id} className="relative group">
            <button
              onClick={() => setActiveWorkspaceId(workspace.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200"
              style={{
                background: isActive ? `${workspace.color}22` : 'transparent',
                border: isActive ? `1px solid ${workspace.color}50` : '1px solid transparent',
              }}
            >
              <span className="text-sm">{workspace.icon}</span>
              <span 
                className="text-xs font-medium max-w-[60px] truncate"
                style={{ color: isActive ? workspace.color : (isDarkTheme ? '#94a3b8' : '#64748b') }}
              >
                {workspace.name}
              </span>
            </button>
            
            {/* Edit/Delete buttons on hover */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-transparent via-transparent to-[#1e293b] pr-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingWorkspace(workspace);
                }}
                className="p-0.5 rounded hover:bg-slate-600"
              >
                <Edit2 size={10} className="text-slate-400" />
              </button>
              {workspaces.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete workspace "${workspace.name}"?`)) {
                      deleteWorkspace(workspace.id);
                    }
                  }}
                  className="p-0.5 rounded hover:bg-red-900/30"
                >
                  <Trash2 size={10} className="text-red-400" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Add workspace button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
        title="Add workspace"
      >
        <Plus size={14} className="text-slate-400" />
      </button>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="rounded-2xl p-5 w-full max-w-xs"
            style={{ background: bg, border: '1px solid #334155' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: textColor }}>
              Create Workspace
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  placeholder="My Workspace"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ 
                    background: isDarkTheme ? '#0f172a' : '#f1f5f9',
                    color: textColor,
                    border: '1px solid #334155'
                  }}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewWorkspace({ ...newWorkspace, icon: emoji })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${newWorkspace.icon === emoji ? 'ring-2 ring-indigo-500' : ''}`}
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
                      onClick={() => setNewWorkspace({ ...newWorkspace, color })}
                      className={`w-6 h-6 rounded-full transition-all ${newWorkspace.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: '#94a3b8' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setEditingWorkspace(null)}
        >
          <div 
            className="rounded-2xl p-5 w-full max-w-xs"
            style={{ background: bg, border: '1px solid #334155' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: textColor }}>
              Edit Workspace
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editingWorkspace.name}
                  onChange={(e) => setEditingWorkspace({ ...editingWorkspace, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ 
                    background: isDarkTheme ? '#0f172a' : '#f1f5f9',
                    color: textColor,
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
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, icon: emoji })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${editingWorkspace.icon === emoji ? 'ring-2 ring-indigo-500' : ''}`}
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
                      onClick={() => setEditingWorkspace({ ...editingWorkspace, color })}
                      className={`w-6 h-6 rounded-full transition-all ${editingWorkspace.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditingWorkspace(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: '#94a3b8' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleEdit(editingWorkspace)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
