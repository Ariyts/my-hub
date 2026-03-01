import { useStore } from '../store';
import { Trash2, RotateCcw, X, FileText, Code, Link, MessageSquare } from 'lucide-react';
import type { TrashItem } from '../types';

const TYPE_ICONS = {
  note: FileText,
  command: Code,
  link: Link,
  prompt: MessageSquare,
};

const TYPE_COLORS = {
  note: '#4CAF50',
  command: '#2196F3',
  link: '#FF9800',
  prompt: '#9C27B0',
};

export function TrashModal() {
  const { 
    showTrash, 
    setShowTrash, 
    trash, 
    restoreFromTrash, 
    permanentlyDelete, 
    clearTrash,
    isDarkTheme 
  } = useStore();

  if (!showTrash) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRestore = (trashId: string) => {
    restoreFromTrash(trashId);
  };

  const handleDelete = (trashId: string) => {
    if (confirm('Permanently delete this item?')) {
      permanentlyDelete(trashId);
    }
  };

  const handleClearAll = () => {
    if (confirm('Permanently delete all items in trash?')) {
      clearTrash();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={() => setShowTrash(false)}
    >
      <div 
        className="rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        style={{ 
          background: isDarkTheme ? '#1e293b' : '#fff', 
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: isDarkTheme ? '#334155' : '#e2e8f0' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#ef444420' }}
            >
              <Trash2 size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
                Trash
              </h2>
              <p className="text-xs text-slate-400">
                {trash.length} item{trash.length !== 1 ? 's' : ''} deleted
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTrash(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {trash.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Trash2 size={48} className="mb-4 opacity-50" />
              <p>Trash is empty</p>
              <p className="text-xs mt-1">Deleted items will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trash.map((item: TrashItem) => {
                const Icon = TYPE_ICONS[item.type];
                const color = TYPE_COLORS[item.type];
                const title = 'title' in item.item ? item.item.title : 'Untitled';
                
                return (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-700/30"
                    style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc' }}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}20` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
                        {title}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.workspaceName} → {item.categoryName} → {item.folderName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Deleted: {formatDate(item.deletedAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="p-2 rounded-lg hover:bg-green-500/20 transition-colors group"
                        title="Restore"
                      >
                        <RotateCcw size={16} className="text-slate-400 group-hover:text-green-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition-colors group"
                        title="Delete permanently"
                      >
                        <Trash2 size={16} className="text-slate-400 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {trash.length > 0 && (
          <div className="p-4 border-t flex justify-end" style={{ borderColor: isDarkTheme ? '#334155' : '#e2e8f0' }}>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Empty Trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
