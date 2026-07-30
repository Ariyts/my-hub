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
    <div className="animate-in rounded-lg border-2 border-dashed border-playbooks/50 bg-playbooks/5 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-playbooks/20">
          <FolderPlus size={15} className="text-playbooks" />
        </div>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New section title (e.g., Recon, Exploitation, Post-Exploitation)..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-subtle outline-none focus:border-playbooks"
        />
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="rounded-lg bg-success/20 p-2 text-success transition-colors hover:bg-success/30 disabled:cursor-not-allowed disabled:opacity-40"
          title="Create (Enter)"
        >
          <Check size={14} />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-sunken hover:text-foreground"
          title="Cancel (Esc)"
        >
          <X size={14} />
        </button>
      </div>
      <p className="mt-2 pl-10 text-[11px] text-subtle">
        Tip: names like &quot;Recon&quot;, &quot;Fuzzing&quot;, &quot;Exploitation&quot;,
        &quot;Post-Exploitation&quot; get automatic phase badges.
      </p>
    </div>
  );
}
