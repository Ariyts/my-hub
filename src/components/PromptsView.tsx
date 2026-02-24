import { useState } from 'react';
import { useStore } from '../store';
import type { PromptContainer, PromptItem } from '../types';
import { Plus, Search, Copy, Edit3, Trash2, ChevronDown, ChevronRight, MessageSquare, Star, Check, Variable } from 'lucide-react';

interface PromptCardProps {
  item: PromptItem;
  containerId: string;
  isDark: boolean;
}

function PromptCard({ item, containerId, isDark }: PromptCardProps) {
  const { updatePromptItem, deletePromptItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [showVarModal, setShowVarModal] = useState(false);

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#1e293b' : '#f8fafc';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#64748b' : '#94a3b8';

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

  if (editing) {
    return (
      <div className="rounded-xl border p-4 space-y-2" style={{ background: bg, borderColor: border }}>
        <input className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }} value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} placeholder="Title..." autoFocus />
        <textarea className="w-full text-sm px-3 py-2 rounded-lg border outline-none font-mono resize-y min-h-[120px]" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor, fontFamily: 'monospace' }} value={editData.prompt} onChange={(e) => setEditData({ ...editData, prompt: e.target.value })} placeholder="Prompt text... Use {{variable}} for variables" />
        <input className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }} value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description..." />
        <input className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }} value={editData.tags.join(', ')} onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="tags, comma, separated" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border transition-all duration-150 overflow-hidden" style={{ background: bg, borderColor: border }}>
      <div className="px-4 py-3">
        <div className="flex items-start gap-2 mb-2">
          <h4 className="font-semibold text-sm flex-1" style={{ color: textColor }}>{item.title}</h4>
          <button onClick={() => updatePromptItem(containerId, item.id, { isFavorite: !item.isFavorite })}>
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
          </button>
        </div>
        {item.description && <p className="text-xs mb-2" style={{ color: mutedColor }}>{item.description}</p>}

        {/* Prompt preview */}
        <div
          className="text-sm p-3 rounded-lg mb-3 font-mono leading-relaxed overflow-hidden max-h-32 relative"
          style={{ background: isDark ? '#0f172a' : '#f1f5f9', color: isDark ? '#a5f3fc' : '#0369a1', fontSize: '12px', fontFamily: 'monospace' }}
        >
          {item.prompt}
          <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: `linear-gradient(transparent, ${isDark ? '#0f172a' : '#f1f5f9'})` }} />
        </div>

        {/* Variables */}
        {variables.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Variable size={11} style={{ color: '#9C27B0' }} />
              <span className="text-xs font-medium" style={{ color: '#9C27B0' }}>Variables</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {variables.map(v => (
                <span key={v} className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: '#9C27B015', color: '#9C27B0' }}>{v}</span>
              ))}
            </div>
          </div>
        )}

        {/* Variable inputs when modal open */}
        {showVarModal && variables.length > 0 && (
          <div className="mb-3 p-3 rounded-lg border space-y-2" style={{ borderColor: '#9C27B030', background: '#9C27B008' }}>
            <p className="text-xs font-medium" style={{ color: '#9C27B0' }}>Fill variables before copying:</p>
            {variables.map(v => {
              const key = v.replace(/\{\{|\}\}/g, '');
              return (
                <div key={v} className="flex items-center gap-2">
                  <span className="text-xs font-mono w-24 flex-shrink-0" style={{ color: '#9C27B0' }}>{v}</span>
                  <input
                    className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                    style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: textColor }}
                    value={varValues[key] || ''}
                    onChange={(e) => setVarValues({ ...varValues, [key]: e.target.value })}
                    placeholder={`Enter ${key}...`}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>#{tag}</span>
          ))}
          <div className="flex-1" />
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>
            <Edit3 size={10} /> Edit
          </button>
          {variables.length > 0 && (
            <button onClick={() => setShowVarModal(!showVarModal)} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: showVarModal ? '#9C27B020' : isDark ? '#334155' : '#f1f5f9', color: showVarModal ? '#9C27B0' : '#64748b' }}>
              <Variable size={10} /> Vars
            </button>
          )}
          <button onClick={handleCopy} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium" style={{ background: copied ? '#4CAF5020' : '#9C27B015', color: copied ? '#4CAF50' : '#9C27B0' }}>
            {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={() => deletePromptItem(containerId, item.id)} className="p-1 rounded hover:bg-red-50">
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
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
  const headBg = isDark ? '#1e293b' : '#f8fafc';

  const handleAdd = () => {
    if (newItem.title.trim() && newItem.prompt.trim()) {
      const vars = (newItem.prompt.match(/\{\{([^}]+)\}\}/g) || []);
      addPromptItem(container.id, { ...newItem, variables: [...new Set(vars)] });
      setNewItem({ title: '', prompt: '', description: '', tags: [], isFavorite: false, variables: [] });
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ background: bg, borderColor: border }}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{ background: headBg, borderBottom: localExpanded ? `1px solid ${border}` : 'none' }}
        onClick={() => setLocalExpanded(!localExpanded)}
      >
        <button className="flex-shrink-0">
          {localExpanded ? <ChevronDown size={16} style={{ color: '#9C27B0' }} /> : <ChevronRight size={16} style={{ color: '#9C27B0' }} />}
        </button>
        <MessageSquare size={16} style={{ color: '#9C27B0' }} />
        <span className="flex-1 font-semibold text-sm" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{container.title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>{container.category}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>{container.subItems.length}</span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deletePromptContainer(container.id); }} className="p-1 rounded hover:bg-red-50">
          <Trash2 size={13} className="text-red-400 opacity-0 group-hover:opacity-100" />
        </button>
      </div>
      {localExpanded && (
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none" style={{ background: isDark ? '#1e293b' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }} placeholder="Search prompts..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
            </div>
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>
              <Plus size={14} /> Add
            </button>
          </div>
          {adding && (
            <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: '#9C27B050', background: '#9C27B008' }}>
              <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }} placeholder="Prompt title..." value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
              <textarea className="w-full text-sm px-3 py-2 rounded-lg border outline-none font-mono resize-y min-h-[80px]" style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b', fontFamily: 'monospace' }} placeholder="Prompt text... Use {{variable}} for variables" value={newItem.prompt} onChange={(e) => setNewItem({ ...newItem, prompt: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-3 py-1 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Add</button>
                <button onClick={() => setAdding(false)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
              </div>
            </div>
          )}
          {filtered.length === 0 && !adding && (
            <div className="text-center py-4 text-sm" style={{ color: '#94a3b8' }}>No prompts yet. <button onClick={() => setAdding(true)} className="text-purple-400 hover:underline">Add one</button></div>
          )}
          <div className="space-y-2">
            {filtered.map(item => <PromptCard key={item.id} item={item} containerId={container.id} isDark={isDark} />)}
          </div>
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
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {adding && (
          <div className="rounded-2xl border p-4 space-y-2" style={{ borderColor: '#9C27B050', background: isDarkTheme ? '#1e293b' : '#fff' }}>
            <input autoFocus className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} placeholder="Collection name..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }} />
            <select className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ background: isDarkTheme ? '#0f172a' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }} value={newCat} onChange={(e) => setNewCat(e.target.value)}>
              {['General', 'Coding', 'Writing', 'Analysis', 'Design', 'Research'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#9C27B015', color: '#9C27B0' }}>Create</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: isDarkTheme ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
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
