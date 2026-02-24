import { useStore } from '../store';
import type { ObjectType } from '../types';
import { Settings, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const OBJECT_TYPES = [
  { id: 'notes' as ObjectType, icon: '📝', label: 'Notes', color: '#4CAF50' },
  { id: 'commands' as ObjectType, icon: '⌘', label: 'Commands', color: '#2196F3' },
  { id: 'links' as ObjectType, icon: '🔗', label: 'Links', color: '#FF9800' },
  { id: 'prompts' as ObjectType, icon: '💬', label: 'Prompts', color: '#9C27B0' },
];

export function Sidebar() {
  const { activeType, setActiveType, setShowSettings, sidebarCollapsed, setSidebarCollapsed, isDarkTheme } = useStore();

  return (
    <aside
      className="flex flex-col items-center py-3 gap-1 border-r transition-all duration-300 z-20 relative"
      style={{
        width: sidebarCollapsed ? '0px' : '72px',
        minWidth: sidebarCollapsed ? '0px' : '72px',
        overflow: 'hidden',
        background: isDarkTheme ? '#0f172a' : '#1e293b',
        borderColor: isDarkTheme ? '#1e293b' : '#0f172a',
      }}
    >
      {/* Logo */}
      <div className="mb-4 mt-1 flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          K
        </div>
      </div>

      {/* Type buttons */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {OBJECT_TYPES.map((type) => {
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              title={type.label}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full group"
              style={{
                background: isActive ? `${type.color}22` : 'transparent',
                border: isActive ? `1.5px solid ${type.color}66` : '1.5px solid transparent',
              }}
            >
              <span
                className="text-xl leading-none transition-transform duration-200 group-hover:scale-110"
                style={{ filter: isActive ? 'none' : 'grayscale(0.3) opacity(0.7)' }}
              >
                {type.icon}
              </span>
              <span
                className="text-[9px] font-semibold uppercase tracking-wider leading-none"
                style={{ color: isActive ? type.color : '#94a3b8' }}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom buttons */}
      <div className="flex flex-col gap-1 w-full px-2 mt-auto">
        <div className="h-px bg-slate-700 mx-1 mb-1" />
        <button
          onClick={() => setShowSettings(true)}
          title="Settings"
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full hover:bg-slate-700"
        >
          <Settings size={18} className="text-slate-400" />
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Config</span>
        </button>
        <button
          title="Sync Status"
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 w-full hover:bg-slate-700"
        >
          <RefreshCw size={18} className="text-slate-400" />
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Sync</span>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors z-30"
      >
        {sidebarCollapsed
          ? <ChevronRight size={12} className="text-slate-300" />
          : <ChevronLeft size={12} className="text-slate-300" />
        }
      </button>
    </aside>
  );
}
