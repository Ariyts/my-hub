import { useState, useRef, useEffect } from 'react';
import { Check, X, FolderPlus } from 'lucide-react';

interface Props {
  onAdd: (title: string) => void;
  onClose: () => void;
}

export function InlineAddSection({ onAdd, onClose }: Props) {
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

  return (
    <div className="animate-in rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-500/5 backdrop-blur-sm p-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <FolderPlus size={15} className="text-cyan-300" />
        </div>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New section title (e.g., Recon, Exploitation, Post-Exploitation)..."
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Create (Enter)"
        >
          <Check size={14} />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          title="Cancel (Esc)"
        >
          <X size={14} />
        </button>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 pl-10">
        Tip: names like &quot;Recon&quot;, &quot;Fuzzing&quot;, &quot;Exploitation&quot;, &quot;Post-Exploitation&quot; get automatic phase badges.
      </p>
    </div>
  );
}
