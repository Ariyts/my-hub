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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/60">
          <SearchIcon size={26} className="text-slate-500" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-200">No matches found</h3>
        <p className="mb-5 max-w-sm text-center text-sm text-slate-500">
          Try different keywords or adjust the filters above.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
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
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700/60 bg-gradient-to-br from-cyan-500/30 to-violet-500/30 backdrop-blur-sm">
            <Target size={34} className="text-cyan-300" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-100">Build your pentest playbook</h3>
        <p className="mb-6 max-w-md text-center text-sm leading-relaxed text-slate-400">
          Organize commands into phases — <span className="font-medium text-blue-400">Recon</span>,{" "}
          <span className="font-medium text-orange-400">Fuzzing</span>,{" "}
          <span className="font-medium text-red-400">Exploitation</span>,{" "}
          <span className="font-medium text-green-400">Post-Exploitation</span> — and have a
          one-click reference during engagements.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-400"
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
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div className="mb-1 text-xl">{emoji}</div>
      <div className="mb-0.5 text-xs font-semibold text-slate-200">{title}</div>
      <div className="text-[11px] text-slate-500">{desc}</div>
    </div>
  );
}
