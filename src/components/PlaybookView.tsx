import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store';
import type { PlaybookContainer, PlaybookItem, PlaybookSection } from '../types';
import {
  ChevronDown, ChevronRight, Plus, Copy, Edit3, Trash2, Check,
  Search, Star, BookOpen, FolderPlus, Palette, X
} from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  bash: '#4CAF50', zsh: '#4CAF50', powershell: '#2196F3',
  cmd: '#FF9800', python: '#9C27B0', javascript: '#F7DF1E',
  sql: '#e44d26', yaml: '#f5c518', nginx: '#009639',
};

const LANG_ICONS: Record<string, string> = {
  bash: '>$', zsh: '>%', powershell: 'PS', cmd: '>', python: 'py', javascript: 'JS',
  sql: 'DB', yaml: 'YM', nginx: 'NX',
};

const PLAYBOOK_LANGUAGES = ['bash', 'zsh', 'powershell', 'cmd', 'python', 'javascript', 'sql', 'yaml', 'nginx'] as const;

// Predefined color palette for sections
const SECTION_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
];

// Strip markdown storage metadata (HTML comments and _null_ placeholders) from display text
function stripMdMetadata(text: string): string {
  if (!text) return '';
  return text
    .replace(/<!--\s*(section|cmd|prompt):\s*\{.*?\}\s*-->/g, '')  // Remove metadata comments
    .replace(/_null_/g, '')                                         // Remove _null_ placeholders
    .trim();
}

// Clean description: remove markdown metadata and _null_
function cleanDescription(desc: string | undefined): string | undefined {
  if (!desc) return undefined;
  const cleaned = stripMdMetadata(desc);
  return cleaned || undefined;
}

// Syntax highlighting
function highlightSyntax(code: string): React.ReactElement {
  const keywords = ['git', 'npm', 'docker', 'kubectl', 'cd', 'ls', 'cat', 'echo', 'export', 'import', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'sudo', 'apt', 'brew', 'pip', 'node', 'python', 'ssh', 'scp', 'systemctl', 'nginx', 'psql', 'mysql', 'redis-cli'];
  const parts = code.split(/(\s+|['"][^'"]*['"]|#[^\n]*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) return <span key={i} style={{ color: '#c792ea' }}>{part}</span>;
        if (part.startsWith('#')) return <span key={i} style={{ color: '#546e7a' }}>{part}</span>;
        if (/^['"].*['"]$/.test(part)) return <span key={i} style={{ color: '#c3e88d' }}>{part}</span>;
        if (/^--?[a-zA-Z]/.test(part)) return <span key={i} style={{ color: '#ffcb6b' }}>{part}</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
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

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleAdd = () => {
    if (title.trim()) { onAdd(title.trim()); onClose(); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
    else if (e.key === 'Escape') onClose();
  };

  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const inputBg = isDark ? '#0f172a' : '#ffffff';

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed animate-in fade-in duration-150"
      style={{ background: isDark ? '#1e293b' : '#f8fafc', borderColor: '#00BCD4' }}
      tabIndex={-1}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget) && !title.trim()) onClose(); }}
    >
      <BookOpen size={14} style={{ color: '#00BCD4' }} />
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Section title..."
        className="flex-1 text-sm px-2 py-1 rounded border outline-none focus:border-cyan-400"
        style={{ background: inputBg, borderColor, color: isDark ? '#e2e8f0' : '#1e293b' }}
      />
      <div className="flex items-center gap-1">
        <button onMouseDown={(e) => e.preventDefault()} onClick={handleAdd} disabled={!title.trim()}
          className="p-1 rounded hover:bg-green-500/20 transition-colors disabled:opacity-50" title="Create section (Enter)">
          <Check size={14} className="text-green-400" />
        </button>
        <button onMouseDown={(e) => e.preventDefault()} onClick={onClose}
          className="p-1 rounded hover:bg-red-500/20 transition-colors" title="Cancel (Esc)">
          <X size={14} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// PLAYBOOK ROW COMPONENT
// ============================================
interface PlaybookRowProps {
  item: PlaybookItem;
  containerId: string;
  isDark: boolean;
  index: number;
}

function PlaybookRow({ item, containerId, isDark, index }: PlaybookRowProps) {
  const { updatePlaybookItem, deletePlaybookItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });

  // Clean metadata from display values
  const displayCommand = stripMdMetadata(item.command);
  const displayDescription = cleanDescription(item.description);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updatePlaybookItem(containerId, item.id, editData);
    setEditing(false);
  };

  const border = isDark ? '#1e293b' : '#e2e8f0';
  const codeBg = isDark ? '#0f172a' : '#f1f5f9';
  const langColor = LANG_COLORS[item.language] || '#64748b';

  if (editing) {
    return (
      <tr style={{ background: isDark ? '#1e293b30' : '#f8fafc' }}>
        <td colSpan={5} className="p-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="text-xs px-2 py-1 rounded border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.language}
                onChange={(e) => setEditData({ ...editData, language: e.target.value as PlaybookItem['language'] })}
              >
                {PLAYBOOK_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input
                className="flex-1 font-mono text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: codeBg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.command}
                onChange={(e) => setEditData({ ...editData, command: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description..."
              />
              <input
                className="w-48 text-xs px-2 py-1.5 rounded-lg border outline-none"
                style={{ background: isDark ? '#0f172a' : '#fff', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
                value={editData.tags.join(', ')}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                placeholder="tags..."
              />
              <button onClick={handleSave} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#00BCD420', color: '#00BCD4' }}>Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded text-xs" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="group hover:bg-cyan-500/5 transition-colors" style={{ borderBottom: `1px solid ${border}` }}>
      <td className="px-2 py-2 text-center w-8">
        <span className="text-xs font-mono" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{index + 1}</span>
      </td>
      <td className="px-2 py-2 w-16">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
          style={{ background: `${langColor}20`, color: langColor }}>
          {LANG_ICONS[item.language] || item.language.slice(0, 2).toUpperCase()}
        </span>
      </td>
      <td className="px-2 py-2">
        <div className="font-mono text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-cyan-500/10 transition-colors"
          style={{ background: codeBg, borderLeft: `2px solid ${langColor}` }}
          onClick={handleCopy} title={displayDescription || 'Click to copy'}>
          {highlightSyntax(displayCommand)}
        </div>
      </td>
      <td className="px-2 py-2 min-w-[150px]">
        {displayDescription && <p className="text-xs mb-1 truncate" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{displayDescription}</p>}
        <div className="flex gap-1 flex-wrap">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>{tag}</span>
          ))}
        </div>
      </td>
      <td className="px-2 py-2 w-32">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => updatePlaybookItem(containerId, item.id, { isFavorite: !item.isFavorite })}>
            <Star size={12} className={item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
          </button>
          <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ background: copied ? '#4CAF5020' : 'transparent', color: copied ? '#4CAF50' : '#64748b' }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-slate-500/20">
            <Edit3 size={11} className="text-slate-400" />
          </button>
          <button onClick={() => deletePlaybookItem(containerId, item.id)} className="p-1 rounded hover:bg-red-500/20">
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// PLAYBOOK SECTION CARD COMPONENT
// ============================================
interface PlaybookSectionCardProps {
  section: PlaybookSection;
  items: PlaybookItem[];
  containerId: string;
  isDark: boolean;
  onToggleCollapse: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onColorSection: (sectionId: string) => void;
  onAddItem: (sectionId: string) => void;
}

function PlaybookSectionCard({
  section, items, containerId, isDark,
  onToggleCollapse, onEditSection, onDeleteSection, onColorSection, onAddItem
}: PlaybookSectionCardProps) {
  const isCollapsed = section.collapsed ?? false;
  const border = isDark ? '#1e293b' : '#e2e8f0';
  const bg = isDark ? '#111827' : '#ffffff';
  const headerBg = isDark ? '#1e293b' : '#f8fafc';

  return (
    <div className="rounded-xl border overflow-hidden group transition-all duration-200" style={{ borderColor: border }}>
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-2 cursor-pointer" style={{ background: headerBg }}
        onClick={() => onToggleCollapse(section.id)}>
        <button className="p-0.5 rounded hover:bg-slate-500/20"
          onClick={(e) => { e.stopPropagation(); onToggleCollapse(section.id); }}>
          {isCollapsed
            ? <ChevronRight size={14} style={{ color: section.color || '#00BCD4' }} />
            : <ChevronDown size={14} style={{ color: section.color || '#00BCD4' }} />
          }
        </button>
        {section.color && (
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: section.color }} />
        )}
        <BookOpen size={14} style={{ color: section.color || '#00BCD4' }} />
        <span className="font-medium text-sm flex-1" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
          {section.title}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: section.color ? `${section.color}20` : '#00BCD415', color: section.color || '#00BCD4' }}>
          {items.length} cmds
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onColorSection(section.id); }}
            className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors" title="Change color">
            <Palette size={14} style={{ color: section.color || '#64748b' }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEditSection(section.id); }}
            className="p-1.5 rounded-lg hover:bg-cyan-500/20 transition-colors" title="Rename section">
            <Edit3 size={14} style={{ color: '#00BCD4' }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors" title="Delete section">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddItem(section.id); }}
          className="p-1 rounded hover:bg-cyan-500/20" title="Add command to this section">
          <Plus size={14} style={{ color: '#00BCD4' }} />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="border-t" style={{ borderColor: border, background: bg }}>
          {items.length > 0 ? (
            <table className="w-full">
              <tbody>
                {items.map((item, idx) => (
                  <PlaybookRow key={item.id} item={item} containerId={containerId} isDark={isDark} index={idx} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-xs border-2 border-dashed rounded-lg m-3 transition-colors cursor-pointer hover:border-cyan-400"
              style={{ color: '#94a3b8', borderColor: 'transparent' }}
              onClick={() => onAddItem(section.id)}>
              Click to add a command
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// INLINE ADD PLAYBOOK COMMAND FORM
// ============================================
interface InlineAddCommandProps {
  isDark: boolean;
  onAdd: (data: { command: string; description: string; language: PlaybookItem['language']; tags: string[]; isFavorite: boolean; sectionId?: string }) => void;
  onClose: () => void;
  sectionId?: string;
}

function InlineAddCommand({ isDark, onAdd, onClose, sectionId }: InlineAddCommandProps) {
  const [command, setCommand] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<PlaybookItem['language']>('bash');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleAdd = () => {
    if (command.trim()) {
      onAdd({ command: command.trim(), description: description.trim(), language, tags: [], isFavorite: false, sectionId });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
    else if (e.key === 'Escape') onClose();
  };

  const border = isDark ? '#374151' : '#e5e7eb';
  const bg = isDark ? '#0f172a' : '#ffffff';

  return (
    <div
      className="p-4 border-2 border-dashed rounded-xl space-y-2 animate-in fade-in duration-150"
      style={{ borderColor: '#00BCD4', background: '#00BCD408' }}
      tabIndex={-1}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget) && !command.trim()) onClose(); }}
    >
      <div className="flex gap-2">
        <select
          className="text-xs px-2 py-1.5 rounded border outline-none"
          style={{ background: bg, borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
          value={language}
          onChange={(e) => setLanguage(e.target.value as PlaybookItem['language'])}
        >
          {PLAYBOOK_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input
          ref={inputRef}
          className="flex-1 font-mono text-xs px-3 py-1.5 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
          placeholder="command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 text-xs px-3 py-1.5 rounded-lg border outline-none"
          style={{ background: isDark ? '#0f172a' : '#f8fafc', borderColor: border, color: isDark ? '#e2e8f0' : '#1e293b' }}
          placeholder="description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAdd} disabled={!command.trim()}
          className="px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
          style={{ background: '#00BCD415', color: '#00BCD4' }}>Add</button>
        <button onClick={onClose} className="px-3 py-1 rounded text-xs"
          style={{ background: isDark ? '#334155' : '#f1f5f9', color: '#64748b' }}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================
// MAIN PLAYBOOK VIEW
// ============================================
interface Props {
  container: PlaybookContainer;
}

export function PlaybookView({ container }: Props) {
  const {
    isDarkTheme, addPlaybookItem,
    addPlaybookSection, updatePlaybookSection, deletePlaybookSection,
  } = useStore();

  const [search, setSearch] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [addingToSection, setAddingToSection] = useState<string | undefined>(undefined);

  // Sections sorted by order
  const sections: PlaybookSection[] = useMemo(() => {
    return [...(container.sections || [])].sort((a, b) => a.order - b.order);
  }, [container.sections]);

  // Get items for a specific section
  const getItemsForSection = useCallback((sectionId: string) => {
    return container.subItems.filter(i => i.sectionId === sectionId);
  }, [container.subItems]);

  // Items without section (uncategorized)
  const uncategorizedItems = useMemo(() => {
    return container.subItems.filter(i => !i.sectionId);
  }, [container.subItems]);

  // Filtered items (global search)
  const filteredUncategorized = useMemo(() => {
    if (!search) return uncategorizedItems;
    return uncategorizedItems.filter(i =>
      i.command.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
  }, [uncategorizedItems, search]);

  // Also search by container title (service name)
  const matchesTitle = container.title.toLowerCase().includes(search.toLowerCase());

  const bg = isDarkTheme ? '#0f172a' : '#f1f5f9';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';

  // Section handlers
  const handleToggleCollapse = (sectionId: string) => {
    updatePlaybookSection(container.id, sectionId, {
      collapsed: !sections.find(s => s.id === sectionId)?.collapsed,
    });
  };

  const handleEditSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const newTitle = prompt('Section title:', section.title);
    if (newTitle && newTitle.trim()) {
      updatePlaybookSection(container.id, sectionId, { title: newTitle.trim() });
    }
  };

  const handleColorSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const currentIndex = SECTION_COLORS.indexOf(section.color || '');
    const nextIndex = (currentIndex + 1) % SECTION_COLORS.length;
    updatePlaybookSection(container.id, sectionId, { color: SECTION_COLORS[nextIndex] });
  };

  const handleDeleteSection = (sectionId: string) => {
    const itemsInSection = container.subItems.filter(i => i.sectionId === sectionId);
    if (itemsInSection.length > 0) {
      const result = window.confirm(`This section has ${itemsInSection.length} command(s). Delete section and all its commands?`);
      if (result) {
        const newSubItems = container.subItems.filter(i => i.sectionId !== sectionId);
        const { updatePlaybookContainer } = useStore.getState();
        updatePlaybookContainer(container.id, { subItems: newSubItems });
        deletePlaybookSection(container.id, sectionId);
      }
    } else {
      deletePlaybookSection(container.id, sectionId);
    }
  };

  const handleAddSection = (title: string) => {
    addPlaybookSection(container.id, title);
    setAddingSection(false);
  };

  const handleAddItem = (data: { command: string; description: string; language: PlaybookItem['language']; tags: string[]; isFavorite: boolean; sectionId?: string }) => {
    addPlaybookItem(container.id, data);
  };

  const handleStartAddToSection = (sectionId: string) => {
    setAddingToSection(sectionId);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ background: isDarkTheme ? '#111827' : '#fff', borderColor: border }}>
        <BookOpen size={20} style={{ color: '#00BCD4' }} />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>{container.title}</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{container.subItems.length} commands in {sections.length || 'no'} section{sections.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48"
            style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', borderColor: border, color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
            placeholder="Search service & commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Add Section button */}
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9', color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
        >
          <FolderPlus size={14} style={{ color: '#00BCD4' }} />
          <span className="hidden sm:inline">Section</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Inline Add Section */}
        {addingSection && (
          <InlineAddSection
            isDark={isDarkTheme}
            onAdd={handleAddSection}
            onClose={() => setAddingSection(false)}
          />
        )}

        {/* No sections state */}
        {sections.length === 0 && !addingSection && (
          <div className="text-center py-12">
            <FolderPlus size={48} className="mx-auto mb-4" style={{ color: '#64748b' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
              No sections yet
            </h3>
            <p className="text-sm mb-4" style={{ color: '#64748b' }}>
              Create a section to start organizing your commands
            </p>
            <button
              onClick={() => setAddingSection(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#00BCD4', color: 'white' }}
            >
              Create Section
            </button>
          </div>
        )}

        {/* Sections */}
        {sections.map(section => {
          const sectionItems = getItemsForSection(section.id);
          const filteredItems = search
            ? (matchesTitle
              ? sectionItems // If title matches, show all
              : sectionItems.filter(i =>
                  i.command.toLowerCase().includes(search.toLowerCase()) ||
                  i.description.toLowerCase().includes(search.toLowerCase()) ||
                  i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
                ))
            : sectionItems;

          if (search && !matchesTitle && filteredItems.length === 0) return null;

          return (
            <div key={section.id}>
              <PlaybookSectionCard
                section={section}
                items={filteredItems}
                containerId={container.id}
                isDark={isDarkTheme}
                onToggleCollapse={handleToggleCollapse}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
                onColorSection={handleColorSection}
                onAddItem={handleStartAddToSection}
              />
              {/* Inline add command to section */}
              {addingToSection === section.id && (
                <div className="mt-2">
                  <InlineAddCommand
                    isDark={isDarkTheme}
                    onAdd={handleAddItem}
                    onClose={() => setAddingToSection(undefined)}
                    sectionId={section.id}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized commands (no sectionId) */}
        {uncategorizedItems.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: border, background: isDarkTheme ? '#111827' : '#ffffff' }}>
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc' }}>
              <BookOpen size={14} style={{ color: '#64748b' }} />
              <span className="font-medium text-sm" style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>Uncategorized</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: '#64748b20', color: '#64748b' }}>
                {filteredUncategorized.length} cmds
              </span>
              <button onClick={() => setAddingToSection('__uncategorized__')}
                className="p-1 rounded hover:bg-cyan-500/20 ml-auto" title="Add command">
                <Plus size={14} style={{ color: '#00BCD4' }} />
              </button>
            </div>
            <div className="border-t" style={{ borderColor: border }}>
              {filteredUncategorized.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {filteredUncategorized.map((item, idx) => (
                      <PlaybookRow key={item.id} item={item} containerId={container.id} isDark={isDarkTheme} index={idx} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-xs" style={{ color: '#94a3b8' }}>No commands found</div>
              )}
            </div>
          </div>
        )}

        {/* Inline add command to uncategorized */}
        {addingToSection === '__uncategorized__' && (
          <InlineAddCommand
            isDark={isDarkTheme}
            onAdd={handleAddItem}
            onClose={() => setAddingToSection(undefined)}
          />
        )}
      </div>
    </div>
  );
}
