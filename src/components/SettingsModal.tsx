import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { X, Download, Upload, Trash2, Moon, Sun, Github, Save, RefreshCw, Check, AlertCircle, Cloud, CloudOff, Link } from 'lucide-react';

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Tab({ active, onClick, children }: TabProps) {
  const { isDarkTheme } = useStore();
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
      style={{
        background: active ? '#6366f120' : 'transparent',
        color: active ? '#6366f1' : isDarkTheme ? '#94a3b8' : '#64748b',
      }}
    >
      {children}
    </button>
  );
}

export function SettingsModal() {
  const { 
    setShowSettings, settings, setSettings, isDarkTheme, toggleTheme, 
    exportData, importData, clearAllData,
    syncStatus, syncMessage, isConnected,
    connectGitHub, syncToCloud, disconnectGitHub, autoLoadFromCloud
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'sync' | 'appearance' | 'editor' | 'data'>('sync');
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Auto-load from cloud on mount if connected
  useEffect(() => {
    autoLoadFromCloud();
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConnect = async () => {
    if (token.trim()) {
      const success = await connectGitHub(token.trim());
      if (success) {
        setToken('');
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const data = ev.target?.result as string;
          importData(data);
          alert('Data imported successfully!');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const bg = isDarkTheme ? '#111827' : '#ffffff';
  const bgSecondary = isDarkTheme ? '#1e293b' : '#f8fafc';
  const border = isDarkTheme ? '#334155' : '#e2e8f0';
  const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDarkTheme ? '#64748b' : '#94a3b8';

  const inputStyle = {
    background: isDarkTheme ? '#0f172a' : '#fff',
    borderColor: border,
    color: textColor,
    border: `1px solid ${border}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: border }}>
          <h2 className="text-lg font-bold" style={{ color: textColor }}>Settings</h2>
          <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} style={{ color: mutedColor }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-1 border-b overflow-x-auto" style={{ borderColor: border }}>
          <Tab active={activeTab === 'sync'} onClick={() => setActiveTab('sync')}>🔄 Sync</Tab>
          <Tab active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>🎨 Appearance</Tab>
          <Tab active={activeTab === 'editor'} onClick={() => setActiveTab('editor')}>📝 Editor</Tab>
          <Tab active={activeTab === 'data'} onClick={() => setActiveTab('data')}>💾 Data</Tab>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'sync' && (
            <>
              {/* GitHub Sync - Simplified */}
              <div className="p-5 rounded-xl border" style={{ borderColor: border, background: bgSecondary }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6366f115' }}>
                    <Github size={20} style={{ color: '#6366f1' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm" style={{ color: textColor }}>GitHub Cloud Sync</h3>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      {isConnected 
                        ? `Connected as @${settings.github.username}` 
                        : 'Save your notes to GitHub and access them anywhere'}
                    </p>
                  </div>
                  {isConnected && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: '#4CAF5015', color: '#4CAF50' }}>
                      <Cloud size={12} />
                      Connected
                    </span>
                  )}
                </div>

                {/* Status Message */}
                {syncMessage && (
                  <div 
                    className="flex items-center gap-2 p-3 rounded-lg text-sm mb-4"
                    style={{ 
                      background: syncStatus === 'error' ? '#ef444415' : syncStatus === 'success' ? '#4CAF5015' : '#6366f115',
                      color: syncStatus === 'error' ? '#ef4444' : syncStatus === 'success' ? '#4CAF50' : '#6366f1'
                    }}
                  >
                    {syncStatus === 'connecting' || syncStatus === 'syncing' ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : syncStatus === 'success' ? (
                      <Check size={14} />
                    ) : syncStatus === 'error' ? (
                      <AlertCircle size={14} />
                    ) : null}
                    {syncMessage}
                  </div>
                )}

                {!isConnected ? (
                  /* Connection Form */
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5" style={{ color: mutedColor }}>
                        Personal Access Token
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showToken ? 'text' : 'password'}
                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none pr-10"
                            style={inputStyle}
                            placeholder="ghp_xxxxxxxxxxxx"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                          />
                          <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                            style={{ color: mutedColor }}
                          >
                            {showToken ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <button
                          onClick={handleConnect}
                          disabled={!token.trim() || syncStatus === 'connecting'}
                          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          style={{ background: '#6366f1', color: 'white' }}
                        >
                          {syncStatus === 'connecting' ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            'Connect'
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg" style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9' }}>
                      <p className="text-xs" style={{ color: mutedColor }}>
                        <strong style={{ color: textColor }}>How to get a token:</strong>
                      </p>
                      <ol className="text-xs mt-1 space-y-1 list-decimal list-inside" style={{ color: mutedColor }}>
                        <li>Go to GitHub → Settings → Developer settings</li>
                        <li>Personal access tokens → Tokens (classic)</li>
                        <li>Generate new token with <code className="px-1 rounded" style={{ background: isDarkTheme ? '#1e293b' : '#e2e8f0' }}>repo</code> scope</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  /* Connected State */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9' }}>
                      <div className="flex items-center gap-2">
                        <Link size={14} style={{ color: mutedColor }} />
                        <span className="text-sm font-medium" style={{ color: textColor }}>
                          {settings.github.repo}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#6366f115', color: '#6366f1' }}>
                          {settings.github.branch}
                        </span>
                      </div>
                      {settings.github.lastSync && (
                        <span className="text-xs" style={{ color: mutedColor }}>
                          Last: {new Date(settings.github.lastSync).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={syncToCloud}
                        disabled={syncStatus === 'syncing'}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{ background: '#4CAF50', color: 'white', opacity: syncStatus === 'syncing' ? 0.5 : 1 }}
                      >
                        <Upload size={14} />
                        Save to Cloud
                      </button>
                      <button
                        onClick={disconnectGitHub}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border"
                        style={{ borderColor: border, color: mutedColor }}
                      >
                        <CloudOff size={14} />
                        Disconnect
                      </button>
                    </div>

                    <p className="text-xs text-center" style={{ color: mutedColor }}>
                      Your data loads automatically when you open this page
                    </p>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl border" style={{ borderColor: border, background: bgSecondary }}>
                <h4 className="text-sm font-medium mb-2" style={{ color: textColor }}>💡 How it works</h4>
                <ul className="text-xs space-y-1.5" style={{ color: mutedColor }}>
                  <li>• Connect once with your GitHub token</li>
                  <li>• We automatically create a repository for your data</li>
                  <li>• Your notes sync automatically when you open the page</li>
                  <li>• Click "Save to Cloud" to backup your changes</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: <Sun size={18} /> },
                    { value: 'dark', label: 'Dark', icon: <Moon size={18} /> },
                    { value: 'system', label: 'System', icon: <div className="w-4.5 h-4.5 rounded-full border-2 border-current" style={{ background: 'linear-gradient(135deg, #fff 50%, #1e293b 50%)' }} /> },
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => { setSettings({ theme: value as 'light' | 'dark' | 'system' }); if (value === 'dark' && !isDarkTheme) toggleTheme(); if (value === 'light' && isDarkTheme) toggleTheme(); }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all"
                      style={{
                        borderColor: settings.theme === value ? '#6366f1' : border,
                        background: settings.theme === value ? '#6366f120' : bgSecondary,
                        color: settings.theme === value ? '#6366f1' : mutedColor,
                      }}
                    >
                      {icon}
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Font Size</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="12" max="20" value={settings.fontSize}
                    onChange={(e) => setSettings({ fontSize: parseInt(e.target.value) })}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-sm font-mono w-10 text-center" style={{ color: textColor }}>{settings.fontSize}px</span>
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Editor Width</h3>
                <div className="flex gap-3">
                  {[{ v: 'full', l: 'Full Width' }, { v: 'centered', l: 'Centered' }].map(({ v, l }) => (
                    <button key={v} onClick={() => setSettings({ editorWidth: v as 'full' | 'centered' })}
                      className="flex-1 py-2 rounded-lg border text-sm font-medium transition-all"
                      style={{ borderColor: settings.editorWidth === v ? '#6366f1' : border, background: settings.editorWidth === v ? '#6366f120' : bgSecondary, color: settings.editorWidth === v ? '#6366f1' : mutedColor }}>
                      {l}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: textColor }}>Preview Mode</h3>
                <div className="flex gap-2">
                  {[{ v: 'split', l: 'Split' }, { v: 'tab', l: 'Tab' }, { v: 'off', l: 'Off' }].map(({ v, l }) => (
                    <button key={v} onClick={() => setSettings({ previewMode: v as 'split' | 'tab' | 'off' })}
                      className="flex-1 py-2 rounded-lg border text-sm font-medium transition-all"
                      style={{ borderColor: settings.previewMode === v ? '#6366f1' : border, background: settings.previewMode === v ? '#6366f120' : bgSecondary, color: settings.previewMode === v ? '#6366f1' : mutedColor }}>
                      {l}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'editor' && (
            <>
              {[
                { key: 'autoSave', label: 'Auto-save', desc: 'Save automatically every 30 seconds' },
                { key: 'spellCheck', label: 'Spell Check', desc: 'Enable browser spell checking' },
                { key: 'lineNumbers', label: 'Line Numbers', desc: 'Show line numbers in code blocks' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: bgSecondary }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: textColor }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: mutedColor }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setSettings({ [key]: !settings[key as keyof typeof settings] })}
                    className="relative w-11 h-6 rounded-full transition-colors"
                    style={{ background: settings[key as keyof typeof settings] ? '#6366f1' : border }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: settings[key as keyof typeof settings] ? 'translateX(20px)' : 'translateX(2px)' }}
                    />
                  </button>
                </div>
              ))}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: textColor }}>Code Font</label>
                <select
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  value={settings.codeFont}
                  onChange={(e) => setSettings({ codeFont: e.target.value })}
                >
                  {['Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Source Code Pro', 'Inconsolata', 'monospace'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'data' && (
            <>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-blue-400 text-left"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#2196F315' }}>
                    <Download size={20} style={{ color: '#2196F3' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: textColor }}>Export All Data</p>
                    <p className="text-xs" style={{ color: mutedColor }}>Download all notes, commands, links and prompts as JSON</p>
                  </div>
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-green-400 text-left"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#4CAF5015' }}>
                    <Upload size={20} style={{ color: '#4CAF50' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: textColor }}>Import Data</p>
                    <p className="text-xs" style={{ color: mutedColor }}>Import from a previously exported JSON file</p>
                  </div>
                </button>
                <button
                  onClick={() => { if (confirm('This will delete ALL your data. Are you sure?')) clearAllData(); }}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-red-400 text-left"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ef444415' }}>
                    <Trash2 size={20} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-400">Clear All Data</p>
                    <p className="text-xs" style={{ color: mutedColor }}>Permanently delete all data. Cannot be undone!</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: border }}>
          <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: bgSecondary, color: mutedColor }}>
            Close
          </button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: saved ? '#4CAF5020' : '#6366f120', color: saved ? '#4CAF50' : '#6366f1' }}>
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
