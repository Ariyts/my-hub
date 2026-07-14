import { useState, useRef, useEffect } from "react";
import { Check, X, FolderPlus } from "lucide-react";

interface Props {
  onAdd: (title: string) => void;
  onClose: () => void;
}

export function InlineAddSection({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") onClose();
  };

  return (
    <div className="animate-in rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-500/5 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
          <FolderPlus size={15} className="text-cyan-300" />
        </div>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New section title (e.g., Recon, Exploitation, Post-Exploitation)..."
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 transition-colors hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          title="Create (Enter)"
        >
          <Check size={14} />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          title="Cancel (Esc)"
        >
          <X size={14} />
        </button>
      </div>
      <p className="mt-2 pl-10 text-[11px] text-slate-500">
        Tip: names like &quot;Recon&quot;, &quot;Fuzzing&quot;, &quot;Exploitation&quot;,
        &quot;Post-Exploitation&quot; get automatic phase badges.
      </p>
    </div>
  );
}
