import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store';
import type { NoteItem } from '../types';
import {
  Save, Trash2, Star, StarOff, Eye, Edit3, Maximize2, Minimize2,
  Tag, Bold, Italic, Code, Link, List, Quote, Heading1, Heading2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  note: NoteItem;
}

export function NoteEditor({ note }: Props) {
  const { updateNote, deleteNote, isDarkTheme } = useStore();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [previewMode, setPreviewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const handleSave = useCallback(() => {
    updateNote(note.id, { title, content });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [note.id, title, content, updateNote]);

  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      updateNote(note.id, { title, content });
    }, 3000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [title, content, note.id, updateNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  const insertText = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const addTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      updateNote(note.id, { tags: [...note.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updateNote(note.id, { tags: note.tags.filter(t => t !== tag) });
  };

  const toolbarButtons = [
    { icon: <Heading1 size={14} />, action: () => insertText('# '), title: 'Heading 1' },
    { icon: <Heading2 size={14} />, action: () => insertText('## '), title: 'Heading 2' },
    { icon: <Bold size={14} />, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: <Italic size={14} />, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: <Code size={14} />, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: <Link size={14} />, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: <List size={14} />, action: () => insertText('- '), title: 'List' },
    { icon: <Quote size={14} />, action: () => insertText('> '), title: 'Quote' },
  ];

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';
  const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDarkTheme ? '#64748b' : '#94a3b8';
  const toolbarBg = isDarkTheme ? '#1e293b' : '#f8fafc';

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: bg,
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 100 : 'auto',
      }}
    >
      {/* Title bar */}
      <div className="px-6 pt-5 pb-3 border-b" style={{ borderColor: border }}>
        <div className="flex items-start gap-3 mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-bold bg-transparent outline-none border-none"
            style={{ color: textColor }}
            placeholder="Note title..."
          />
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            <button
              onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {note.isFavorite
                ? <Star size={16} className="text-amber-400 fill-amber-400" />
                : <StarOff size={16} style={{ color: mutedColor }} />
              }
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: saved ? '#4CAF5020' : '#4CAF5015', color: saved ? '#4CAF50' : '#6b7280' }}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 size={16} style={{ color: mutedColor }} /> : <Maximize2 size={16} style={{ color: mutedColor }} />}
            </button>
            <button
              onClick={() => { if (confirm('Delete this note?')) deleteNote(note.id); }}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs" style={{ color: mutedColor }}>
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag size={12} style={{ color: mutedColor }} />
            {note.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:bg-red-50"
                style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9', color: '#64748b' }}
                onClick={() => removeTag(tag)}
                title="Remove tag"
              >
                {tag} ×
              </span>
            ))}
            {showTagInput ? (
              <input
                autoFocus
                className="text-xs px-2 py-0.5 rounded-full border outline-none w-24"
                style={{ borderColor: '#4CAF50', background: 'transparent', color: textColor }}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setShowTagInput(false); }}
                onBlur={() => { addTag(); setShowTagInput(false); }}
                placeholder="tag name..."
              />
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="text-xs px-2 py-0.5 rounded-full border border-dashed hover:border-green-400 transition-colors"
                style={{ borderColor: mutedColor, color: mutedColor }}
              >
                + tag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-1.5 border-b"
        style={{ background: toolbarBg, borderColor: border }}
      >
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            title={btn.title}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            style={{ color: mutedColor }}
          >
            {btn.icon}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: border }}>
          {[
            { mode: 'edit' as const, icon: <Edit3 size={12} />, label: 'Edit' },
            { mode: 'split' as const, icon: <div className="flex gap-0.5"><div className="w-2 h-3 border border-current rounded-sm" /><div className="w-2 h-3 border border-current rounded-sm" /></div>, label: 'Split' },
            { mode: 'preview' as const, icon: <Eye size={12} />, label: 'Preview' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium transition-colors"
              style={{
                background: previewMode === mode ? '#4CAF5020' : 'transparent',
                color: previewMode === mode ? '#4CAF50' : mutedColor,
              }}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden flex">
        {(previewMode === 'edit' || previewMode === 'split') && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-6 resize-none outline-none font-mono text-sm leading-relaxed"
            style={{
              background: bg,
              color: textColor,
              borderRight: previewMode === 'split' ? `1px solid ${border}` : 'none',
              fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
            }}
            placeholder="Write your note in Markdown..."
            spellCheck={false}
          />
        )}
        {(previewMode === 'preview' || previewMode === 'split') && (
          <div
            className="flex-1 overflow-y-auto px-8 py-6"
            style={{ background: bg }}
          >
            <div className="prose prose-sm max-w-none" style={{ color: textColor }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={{ color: textColor, borderBottom: `2px solid ${border}`, paddingBottom: '8px' }} className="text-2xl font-bold mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 style={{ color: textColor }} className="text-xl font-bold mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 style={{ color: textColor }} className="text-lg font-semibold mb-2 mt-5">{children}</h3>,
                  p: ({ children }) => <p style={{ color: textColor }} className="mb-3 leading-relaxed">{children}</p>,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-');
                    return isBlock ? (
                      <code className="block p-4 rounded-lg text-sm font-mono overflow-x-auto" style={{ background: isDarkTheme ? '#1e293b' : '#f8fafc', color: '#4CAF50', border: `1px solid ${border}` }}>
                        {children}
                      </code>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: isDarkTheme ? '#1e293b' : '#f1f5f9', color: '#ef4444' }}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <pre className="mb-4 overflow-x-auto">{children}</pre>,
                  ul: ({ children }) => <ul style={{ color: textColor }} className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol style={{ color: textColor }} className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li style={{ color: textColor }}>{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 pl-4 italic my-3" style={{ borderColor: '#4CAF50', color: mutedColor }}>{children}</blockquote>,
                  a: ({ children, href }) => <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  strong: ({ children }) => <strong style={{ color: textColor }} className="font-bold">{children}</strong>,
                  table: ({ children }) => <table style={{ borderColor: border }} className="w-full border-collapse border mb-4 text-sm">{children}</table>,
                  th: ({ children }) => <th style={{ borderColor: border, background: toolbarBg, color: textColor }} className="border px-3 py-2 text-left font-semibold">{children}</th>,
                  td: ({ children }) => <td style={{ borderColor: border, color: textColor }} className="border px-3 py-2">{children}</td>,
                  input: ({ type, checked }) => type === 'checkbox' ? <input type="checkbox" checked={checked} readOnly className="mr-2" /> : null,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
