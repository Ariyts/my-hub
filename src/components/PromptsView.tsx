import { useState } from 'react';
import { useStore } from '../store';
import type { PromptContainer, PromptItem } from '../types';
import { Plus, Search, Copy, Edit3, Trash2, ChevronDown, ChevronRight, MessageSquare, Star, Check, Variable, GripVertical, X } from 'lucide-react';

interface PromptRowProps {
  item: PromptItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function PromptRow({ item, containerId, isDark, index }: PromptRowProps) {
  const { updatePromptItem, deletePromptItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [showVars, setShowVars] = useState(false);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{([^}]+)\}\}/g) || [];
    return [...new Set(matches)];
  };

  const variables = extractVariables(item.prompt);

  const handleCopy = () => {
    let text = item.prompt;
    variables.forEach(v => {
      const key = v.replace(/\{\{|\}\}/g, '');
      if (varValues[key]) text = text.replace(new RegExp(v.replace(/[{}]/g, '\\$&'), 'g'), varValues[key]);
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const vars = extractVariables(editData.prompt);
    updatePromptItem(containerId, item.id, { ...editData, variables: vars });
    setEditing(false);
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#0f172a' : '#f8fafc';
  const codeBg = isDark ? '#1e1e2e' : '#f0f4f8';

  if (editing) {
    return (
      <tr style={{ background: isDark ? '#1e293b30' : '#f8fafc' }}>
        <td colSpan={6} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title..."
                autoFocus
              />
              <input
                className="w-40 text-xs px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
            </div>
            <textarea
              className="w-full text-xs px-3 py-2 rounded-lg border outline-none font-mono resize-none"
              style={{ background: codeBg, borderColor: border, color: isDark ? '#c4b5fd' : '#6b21a8', minHeight: '80px' }}
              value={editData.prompt}
              onChange={(e) => setEditData({ ...editData, prompt: e.target.value })}
              placeholder="Prompt... Use {{variable}} for variables"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr 
        className="group hover:bg-purple-500/5 transition-colors"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        {/* Number */}
        <td className="px-2 py-2 text-center w-8">
          <span className="text-xs font-mono" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{index + 1}</span>
        </td>
        
        {/* Title */}
        <td className="px-2 py-2 min-w-[150px]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{item.title}</span>
            {item.isFavorite && <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
          </div>
          {item.description && (
            <p className="text-[11px] truncate mt-0.5" style={{ color: '#94a3b8' }}>{item.description}</p>
          )}
        </td>
        
        {/* Prompt preview */}
        <td className="px-2 py-2 min-w-[250px]">
          <div 
            className="font-mono text-xs px-3 py-1.5 rounded truncate cursor-pointer hover:bg-purple-500/10"
            style={{ background: codeBg, color: isDark ? '#c4b5fd' : '#7c3aed', maxWidth: '300px' }}
            onClick={handleCopy}
            title="Click to copy"
          >
            {item.prompt.length > 60 ? item.prompt.slice(0, 60) + '...' : item.prompt}
          </div>
        </td>
        
        {/* Variables */}
        <td className="px-2 py-2 w-32 hidden md:table-cell">
          {variables.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {variables.slice(0, 3).map(v => (
                <span key={v} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#9C27B015', color: '#9C27B0' }}>
                  {v.replace(/\{\{|\}\}/g, '')}
                </span>
              ))}
              {variables.length > 3 && (
                <span className="text-[10px]" style={{ color: '#94a3b8' }}>+{variables.length - 3}</span>
              )}
            </div>
          ) : (
            <span className="text-[10px]" style={{ color: '#64748b' }}>—</span>
          )}
        </td>
        
        {/* Tags */}
        <td className="px-2 py-2 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
                #{tag}
              </span>
            ))}
          </div>
        </td>
        
        {/* Actions */}
        <td className="px-2 py-2 w-36">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {variables.length > 0 && (
              <button 
                onClick={() => setShowVars(!showVars)}
                className="p-1 rounded"
                style={{ background: showVars ? '#9C27B020' : 'transparent' }}
              >
                <Variable size={11} style={{ color: showVars ? '#9C27B0' : '#64748b' }} />
              </button>
            )}
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs"
              style={{ background: copied ? '#4CAF5020' : '#9C27B015', color: copied ? '#4CAF50' : '#9C27B0' }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-slate-500/20">
              <Edit3 size={11} className="text-slate-400" />
            </button>
            <button onClick={() => deletePromptItem(containerId, item.id)} className="p-1 rounded hover:bg-red-500/20">
              <Trash2 size={11} className="text-red-400" />
            </button>
          </div>
        </td>
      </tr>
      
      {/* Variable inputs row */}
      {showVars && variables.length > 0 && (
        <tr style={{ background: isDark ? '#1e1b4b30' : '#faf5ff' }}>
          <td colSpan={6} className="px-4 py-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: '#9C27B0' }}>Variables:</span>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {variables.map(v => {
                  const key = v.replace(/\{\{|\}\}/g, '');
                  return (
                    <div key={v} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono w-16 truncate" style={{ color: '#9C27B0' }}>{key}</span>
                      <input
                        className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                        style={{ background: isDark ? '#0f172a' : '#fff', borderColor: '#9C27B050', color: isDark ? '#e2e8f0' : '#1e293b' }}
                        value={varValues[key] || ''}
                        onChange={(e) => setVarValues({ ...varValues, [key]: e.target.value })}
                        placeholder="..."
                      />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setShowVars(false)} className="p-1">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

interface ContainerCardProps {
  container: PromptContainer;
  isDark: boolean;
}

function ContainerCard({ container, isDark }: ContainerCardProps) {
  const { deletePromptContainer, addPromptItem } = useStore();
  const [localExpanded, setLocalExpanded] = useState(container.isExpanded !== false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', prompt: '', description: '', tags: [] as string[], isFavorite: false, variables: [] as string[] });
  const [searchQ, setSearchQ] = useState('');

  const filtered = container.subItems.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.prompt.toLowerCase().includes(searchQ.toLowerCase())
  );

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headBg = isDark ? '#1e1b4b30' : '#faf5ff';

  const handleAdd = () => {
    if (newItem.title.trim() && newItem.prompt.trim()) {
      const vars = (newItem.prompt.match(/\{\{([^}]+)\}\}/g) || []);
      addPromptItem(container.id, { ...newItem, variables: [...new Set(vars)] });
      setNewItem({ title: '', prompt: '', description: '', tags: [], isFavorite: false, variables: [] });
      setAdding(false);
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: bg, borderColor: border }}>
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
        style={{ background: headBg }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        {localExpanded ? <ChevronDown size={14} style={{ color: '#9C27B0' }} /> : <ChevronRight size={14} style={{ color: '#9C27B0' }} />}
        <MessageSquare size={14} style={{ color: '#9C27B0' }} />
        <span className="font-medium text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{container.title}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>{container.category}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto" style={{ background: '#9C27B015', color: '#9C27B0' }}>
          {container.subItems.length}
        </span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deletePromptContainer(container.id); }} className="p-1 rounded hover:bg-red-500/20">
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
                placeholder="Search prompts..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>
              <Plus size={12} /> Add Prompt
            </button>
          </div>

          {/* Add new prompt form */}
          {adding && (
            <div className="p-3 border-b" style={{ borderColor: '#9C27B050', background: '#9C27B008' }}>
              <div className="flex gap-2 mb-2">
                <input
                  autoFocus
                  className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="Prompt title..."
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
                <input
                  className="w-48 text-xs px-3 py-1.5 rounded-lg border outline-none"
                  style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  placeholder="Description..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <textarea
                className="w-full text-xs px-3 py-2 rounded-lg border outline-none font-mono resize-none"
                style={{ background: isDark ? '#1e1e2e' : '#f0f4f8', borderColor: border, color: isDark ? '#c4b5fd' : '#6b21a8', minHeight: '60px' }}
                placeholder="Prompt text... Use {{variable}} for dynamic values"
                value={newItem.prompt}
                onChange={(e) => setNewItem({ ...newItem, prompt: e.target.value })}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleAdd} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Add</button>
                <button onClick={() => setAdding(false)} className="px-3 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Prompts table */}
          {filtered.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b', background: isDark ? '#1e293b50' : '#f8fafc' }}>
                  <th className="px-2 py-1.5 text-center w-8">#</th>
                  <th className="px-2 py-1.5 text-left">Title</th>
                  <th className="px-2 py-1.5 text-left">Prompt</th>
                  <th className="px-2 py-1.5 text-left hidden md:table-cell">Vars</th>
                  <th className="px-2 py-1.5 text-left hidden lg:table-cell">Tags</th>
                  <th className="px-2 py-1.5 w-36"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <PromptRow key={item.id} item={item} containerId={container.id} isDark={isDark} index={idx} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-xs" style={{ color: '#94a3b8' }}>
              No prompts. <button onClick={() => setAdding(true)} className="text-purple-400 hover:underline">Add one</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props { folderId: string | null; }

export function PromptsView({ folderId }: Props) {
  const { prompts, addPromptContainer, searchQuery, isDarkTheme } = useStore();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('General');

  const filtered = prompts
    .filter(p => !folderId || p.folderId === folderId)
    .filter(p => p.title.toLowerCase().includes((search || searchQuery).toLowerCase()));

  const handleAdd = () => {
    if (newTitle.trim() && folderId) {
      addPromptContainer({ folderId, title: newTitle.trim(), subItems: [], tags: [], category: newCat, type: 'prompts', isExpanded: true });
      setNewTitle(''); setAdding(false);
    }
  };

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ background: isDarkTheme ? '#111827' : '#fff', borderColor: border }}>
        <MessageSquare size={20} style={{ color: '#9C27B0' }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>Prompts</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{filtered.length} collections</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48" style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: '#9C27B020', color: '#9C27B0' }}>
          <Plus size={15} /> New Collection
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {adding && (
          <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#9C27B050', background: isDarkTheme ? '#1e293b' : '#fff' }}>
            <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Collection name..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }} />
            <select className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} value={newCat} onChange={(e) => setNewCat(e.target.value)}>
              {['General', 'Coding', 'Writing', 'Analysis', 'Design', 'Research'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        )}
        {filtered.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: '#94a3b8' }}>
            <MessageSquare size={48} className="opacity-20" />
            <p className="text-lg font-medium">No prompt collections</p>
            <p className="text-sm">Select a folder and create your first collection</p>
          </div>
        )}
        {filtered.map(container => <ContainerCard key={container.id} container={container} isDark={isDarkTheme} />)}
      </div>
    </div>
  );
}
