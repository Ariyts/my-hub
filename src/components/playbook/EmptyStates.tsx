import { FolderPlus, Search as SearchIcon, Target } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
          <SearchIcon size={26} className="text-slate-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">No matches found</h3>
        <p className="text-sm text-slate-500 mb-5 text-center max-w-sm">
          Try different keywords or adjust the filters above.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
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
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-slate-700/60 flex items-center justify-center backdrop-blur-sm">
            <Target size={34} className="text-cyan-300" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">Build your pentest playbook</h3>
        <p className="text-sm text-slate-400 mb-6 text-center max-w-md leading-relaxed">
          Organize commands into phases — <span className="text-blue-400 font-medium">Recon</span>,{' '}
          <span className="text-orange-400 font-medium">Fuzzing</span>,{' '}
          <span className="text-red-400 font-medium">Exploitation</span>,{' '}
          <span className="text-green-400 font-medium">Post-Exploitation</span> — and have a
          one-click reference during engagements.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <FolderPlus size={15} strokeWidth={2.5} />
            Create first section
          </button>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
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
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-xs font-semibold text-slate-200 mb-0.5">{title}</div>
      <div className="text-[11px] text-slate-500">{desc}</div>
    </div>
  );
}
