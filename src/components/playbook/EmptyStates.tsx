import { FolderPlus, Search as SearchIcon, Target } from "lucide-react";

interface EmptyProps {
  hasSections: boolean;
  isFiltered: boolean;
  onAddSection: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({ hasSections, isFiltered, onAddSection, onClearFilters }: EmptyProps) {
  // No results from filters/search
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-border-subtle bg-sunken">
          <SearchIcon size={26} className="text-subtle" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">No matches found</h3>
        <p className="mb-5 max-w-sm text-center text-sm text-subtle">
          Try different keywords or adjust the filters above.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-lg border border-border-subtle bg-sunken px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sunken"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  // No sections yet
  if (!hasSections) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-playbooks/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-border-subtle bg-gradient-to-br from-playbooks/30 to-primary/30 backdrop-blur-sm">
            <Target size={34} className="text-playbooks" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-foreground">Build your pentest playbook</h3>
        <p className="mb-6 max-w-md text-center text-sm leading-relaxed text-muted">
          Organize commands into phases — <span className="font-medium text-commands">Recon</span>,{" "}
          <span className="font-medium text-warning">Fuzzing</span>,{" "}
          <span className="font-medium text-danger">Exploitation</span>,{" "}
          <span className="font-medium text-success">Post-Exploitation</span> — and have a
          one-click reference during engagements.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 rounded-lg bg-playbooks px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg transition-colors hover:opacity-90"
          >
            <FolderPlus size={15} strokeWidth={2.5} />
            Create first section
          </button>
        </div>
        <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          <TipCard emoji="🔍" title="Recon" desc="nmap, whatweb, gobuster vhost" />
          <TipCard emoji="💥" title="Exploit" desc="sqlmap, msfconsole, burp" />
          <TipCard emoji="🏴" title="Post-Exploit" desc="privesc, pivot, persist" />
        </div>
      </div>
    );
  }

  return null;
}

function TipCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <div className="mb-1 text-xl">{emoji}</div>
      <div className="mb-0.5 text-xs font-semibold text-foreground">{title}</div>
      <div className="text-[11px] text-subtle">{desc}</div>
    </div>
  );
}
