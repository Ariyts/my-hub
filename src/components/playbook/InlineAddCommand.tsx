import { useState, useRef, useEffect } from 'react';
import { Check, Terminal } from 'lucide-react';
import type { PlaybookLanguage } from '../../types';
import { LANG_LABELS, PLAYBOOK_LANGUAGES } from './constants';

interface Props {
  onAdd: (data: {
    command: string;
    description: string;
    language: PlaybookLanguage;
    tags: string[];
    isFavorite: boolean;
    sectionId?: string;
  }) => void;
  onClose: () => void;
  sectionId?: string;
}

export function InlineAddCommand({ onAdd, onClose, sectionId }: Props) {
  const [command, setCommand] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState<PlaybookLanguage>('bash');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleAdd = () => {
    if (command.trim()) {
      onAdd({
        command: command.trim(),
        description: description.trim(),
        language,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFavorite: false,
        sectionId,
      });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') onClose();
  };

  return (
    <div className="animate-in rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-500/5 backdrop-blur-sm p-3 space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as PlaybookLanguage)}
          className="text-[11px] font-semibold px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-cyan-400"
        >
          {PLAYBOOK_LANGUAGES.map((l) => (
            <option key={l} value={l}>{LANG_LABELS[l]}</option>
          ))}
        </select>
        <input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="nmap -sV -sC <target> ..."
          className="flex-1 font-mono text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Description — what does this command do?"
          className="flex-1 text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="tags (comma sep.)"
          className="w-40 text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-1">
          <Terminal size={11} />
          <span>⌘/Ctrl+Enter to add · Esc to cancel</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={!command.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={13} strokeWidth={2.5} />
          Add Command
        </button>
      </div>
    </div>
  );
}
