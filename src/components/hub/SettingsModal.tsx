'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Download, Upload, Trash2, Moon, Sun, Monitor } from 'lucide-react';

export function SettingsModal() {
  const { showSettings, setShowSettings, isDarkTheme, toggleTheme, exportData, importData, clearAllData, settings, setSettings } = useStore();
  
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'sync'>('general');
  const [importError, setImportError] = useState<string | null>(null);

  if (!showSettings) return null;

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const cardBg = isDarkTheme ? '#1e293b' : '#f8fafc';
  const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDarkTheme ? '#64748b' : '#94a3b8';
  const border = isDarkTheme ? '#334155' : '#e2e8f0';

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        setImportError(null);
      } catch (err) {
        setImportError('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={() => setShowSettings(false)}
    >
      <div 
        className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ background: bg, border: `1px solid ${border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: border }}>
          <h2 className="text-lg font-semibold" style={{ color: textColor }}>Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={18} style={{ color: mutedColor }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: border }}>
          {[
            { id: 'general', label: 'General' },
            { id: 'data', label: 'Data' },
            { id: 'sync', label: 'Sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex-1 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === tab.id ? '#00BCD4' : mutedColor,
                borderBottom: activeTab === tab.id ? '2px solid #00BCD4' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Theme */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: textColor }}>
                  Theme
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        if (theme.id === 'dark') {
                          if (!isDarkTheme) toggleTheme();
                        } else if (theme.id === 'light') {
                          if (isDarkTheme) toggleTheme();
                        }
                        setSettings({ theme: theme.id as typeof settings.theme });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: (theme.id === 'dark' && isDarkTheme) || (theme.id === 'light' && !isDarkTheme) 
                          ? '#00BCD420' : cardBg,
                        color: (theme.id === 'dark' && isDarkTheme) || (theme.id === 'light' && !isDarkTheme)
                          ? '#00BCD4' : mutedColor,
                        border: `1px solid ${border}`,
                      }}
                    >
                      <theme.icon size={16} />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: textColor }}>
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Editor Settings */}
              <div className="space-y-3">
                <label className="text-sm font-medium block" style={{ color: textColor }}>
                  Editor
                </label>
                {[
                  { key: 'autoSave', label: 'Auto-save' },
                  { key: 'lineNumbers', label: 'Line numbers' },
                  { key: 'spellCheck', label: 'Spell check' },
                ].map((option) => (
                  <label key={option.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm" style={{ color: mutedColor }}>{option.label}</span>
                    <div 
                      className="w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer"
                      style={{ background: settings[option.key as keyof Settings] ? '#00BCD4' : cardBg }}
                      onClick={() => setSettings({ [option.key]: !settings[option.key as keyof Settings] })}
                    >
                      <div 
                        className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                        style={{ transform: settings[option.key as keyof Settings] ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: mutedColor }}>
                Export or import your data as JSON. This includes all your notes, commands, links, prompts, and files.
              </p>

              {importError && (
                <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                  {importError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: '#4CAF5020', color: '#4CAF50' }}
                >
                  <Download size={16} /> Export Data
                </button>
                
                <label 
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  style={{ background: '#2196F320', color: '#2196F3' }}
                >
                  <Upload size={16} /> Import Data
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: border }}>
                <button
                  onClick={handleClearData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={16} /> Clear All Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-5">
              {/* Dropbox Status */}
              <div className="p-4 rounded-xl" style={{ background: cardBg }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ background: '#00BCD420' }}>
                    📦
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: textColor }}>Dropbox</h3>
                    <p className="text-xs" style={{ color: mutedColor }}>File storage and sync</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      Connected
                    </span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: mutedColor }}>
                  Files category uses Dropbox for cloud storage. Upload, preview, and share files directly from your Dropbox account.
                </p>
              </div>

              {/* GitHub Sync */}
              <div className="p-4 rounded-xl" style={{ background: cardBg }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ background: '#6366f120' }}>
                    🔗
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: textColor }}>GitHub Sync</h3>
                    <p className="text-xs" style={{ color: mutedColor }}>Sync data with GitHub</p>
                  </div>
                </div>
                <p className="text-xs mb-3" style={{ color: mutedColor }}>
                  Save your knowledge base to a GitHub repository for backup and sharing.
                </p>
                <input
                  type="password"
                  placeholder="GitHub Personal Access Token"
                  value={settings.github.token}
                  onChange={(e) => setSettings({ github: { ...settings.github, token: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: textColor, border: `1px solid ${border}` }}
                />
              </div>

              {/* Info */}
              <div className="text-xs text-center" style={{ color: mutedColor }}>
                Data is stored locally in your browser. Use export/import for backups.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
