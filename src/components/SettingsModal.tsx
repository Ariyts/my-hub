import { useState, useEffect } from "react";
import { useStore } from "../store";
import {
  X,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Cloud,
  CloudOff,
  Lock,
  Zap,
  Edit,
  Trash,
  Plus,
  ChevronDown,
  ChevronRight,
  File,
} from "lucide-react";
import { previewSync, getLocalPreview, type SyncPreview } from "../utils/githubSync";

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Tab({ active, onClick, children }: TabProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
      style={{
        background: active ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
        color: active ? "var(--primary)" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}

export function SettingsModal() {
  const {
    setShowSettings,
    settings,
    setSettings,
    isDarkTheme,
    toggleTheme,
    exportData,
    importData,
    clearAllData,
    syncStatus,
    syncMessage,
    canSave,
    dataExportedAt,
    connectGitHub,
    syncToCloud,
    disconnectGitHub,
    workspaces,
    categories,
    folders,
    notes,
    commands,
    links,
    prompts,
    playbooks,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"sync" | "appearance" | "editor" | "data">("sync");
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [preview, setPreview] = useState<SyncPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    new: boolean;
    update: boolean;
    delete: boolean;
    all: boolean;
  }>({
    new: false,
    update: false,
    delete: false,
    all: false,
  });

  // Load preview when tab opens (local preview works without token)
  useEffect(() => {
    if (activeTab === "sync") {
      loadLocalPreview();
      if (canSave && settings.github.token) {
        loadRemotePreview();
      }
    }
  }, [activeTab, canSave]);

  const loadLocalPreview = () => {
    try {
      const result = getLocalPreview({
        workspaces,
        categories,
        folders,
        notes,
        commands,
        links,
        prompts,
        playbooks,
        exportedAt: new Date().toISOString(),
        version: "3.0",
      });
      setPreview(result);
    } catch (e) {
      console.error("Local preview error:", e);
    }
  };

  const loadRemotePreview = async () => {
    setLoadingPreview(true);
    try {
      const result = await previewSync(settings.github, {
        workspaces,
        categories,
        folders,
        notes,
        commands,
        links,
        prompts,
        playbooks,
        exportedAt: new Date().toISOString(),
        version: "3.0",
      });
      setPreview(result);
    } catch (e) {
      console.error("Remote preview error:", e);
    }
    setLoadingPreview(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConnect = async () => {
    if (token.trim()) {
      const success = await connectGitHub(token.trim());
      if (success) {
        setToken("");
        // Load remote preview after connecting
        setTimeout(() => loadRemotePreview(), 500);
      }
    }
  };

  const handleSync = async () => {
    await syncToCloud();
    // Reload preview after sync
    setTimeout(() => loadRemotePreview(), 1000);
  };

  const toggleSection = (section: "new" | "update" | "delete" | "all") => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper to get short filename from path
  const getShortPath = (path: string) => {
    const parts = path.split("/");
    // Show: workspace/category/folder/file.md
    return parts.slice(-4).join("/");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const data = ev.target?.result as string;
          importData(data);
          alert("Data imported!");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const bg = "var(--bg-elevated)";
  const bgSecondary = "var(--bg-sunken)";
  const border = "var(--border)";
  const textColor = "var(--text)";
  const mutedColor = "var(--text-subtle)";

  const inputStyle = {
    background: "var(--bg)",
    borderColor: border,
    color: textColor,
    border: `1px solid ${border}`,
  };

  // Count data
  const dataStats = {
    workspaces: workspaces.length,
    categories: categories.length,
    folders: folders.length,
    notes: notes.length,
    commands: commands.length,
    links: links.length,
    prompts: prompts.length,
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="modal-sheet flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl shadow-2xl"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: border }}
        >
          <h2 className="text-lg font-bold" style={{ color: textColor }}>
            Settings
          </h2>
          <button
            onClick={() => setShowSettings(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-sunken"
          >
            <X size={18} style={{ color: mutedColor }} />
          </button>
        </div>

        <div
          className="flex gap-1 overflow-x-auto border-b px-4 pt-3 pb-1"
          style={{ borderColor: border }}
        >
          <Tab active={activeTab === "sync"} onClick={() => setActiveTab("sync")}>
            🔄 Sync
          </Tab>
          <Tab active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")}>
            🎨 Appearance
          </Tab>
          <Tab active={activeTab === "editor"} onClick={() => setActiveTab("editor")}>
            📝 Editor
          </Tab>
          <Tab active={activeTab === "data"} onClick={() => setActiveTab("data")}>
            💾 Data
          </Tab>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {activeTab === "sync" && (
            <>
              {/* Data Summary */}
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: border, background: bgSecondary }}
              >
                <h4 className="mb-3 text-sm font-medium" style={{ color: textColor }}>
                  📊 Current Data
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Workspaces", value: dataStats.workspaces },
                    { label: "Categories", value: dataStats.categories },
                    { label: "Folders", value: dataStats.folders },
                    { label: "Notes", value: dataStats.notes },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-2"
                      style={{ background: "var(--bg)" }}
                    >
                      <div className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                        {item.value}
                      </div>
                      <div className="text-[10px]" style={{ color: mutedColor }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                {dataStats.commands + dataStats.links + dataStats.prompts > 0 && (
                  <div
                    className="mt-2 flex justify-center gap-4 border-t pt-2 text-xs"
                    style={{ borderColor: border, color: mutedColor }}
                  >
                    <span>Commands: {dataStats.commands}</span>
                    <span>Links: {dataStats.links}</span>
                    <span>Prompts: {dataStats.prompts}</span>
                  </div>
                )}
              </div>

              {/* Info Banner */}
              <div
                className="flex items-center gap-3 rounded-lg p-4"
                style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)" }}
              >
                <Zap size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                    Auto-rebuild enabled
                  </p>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    One commit → site rebuilds (~1 min)
                  </p>
                </div>
              </div>

              {syncMessage && (
                <div
                  className="flex items-center gap-2 rounded-lg p-3 text-sm"
                  style={{
                    background:
                      syncStatus === "error"
                        ? "color-mix(in srgb, var(--danger) 8%, transparent)"
                        : syncStatus === "success"
                          ? "color-mix(in srgb, var(--success) 8%, transparent)"
                          : "color-mix(in srgb, var(--primary) 8%, transparent)",
                    color:
                      syncStatus === "error"
                        ? "var(--danger)"
                        : syncStatus === "success"
                          ? "var(--success)"
                          : "var(--primary)",
                  }}
                >
                  {(syncStatus === "connecting" || syncStatus === "syncing") && (
                    <RefreshCw size={14} className="animate-spin" />
                  )}
                  {syncStatus === "success" && <Check size={14} />}
                  {syncStatus === "error" && <AlertCircle size={14} />}
                  {syncMessage}
                </div>
              )}

              {/* Save Section */}
              <div
                className="rounded-lg border p-5"
                style={{ borderColor: border, background: bgSecondary }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: canSave ? "color-mix(in srgb, var(--success) 8%, transparent)" : "color-mix(in srgb, var(--primary) 8%, transparent)" }}
                  >
                    {canSave ? (
                      <Cloud size={20} style={{ color: "var(--success)" }} />
                    ) : (
                      <Lock size={20} style={{ color: "var(--primary)" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold" style={{ color: textColor }}>
                      {canSave ? "Ready to Save" : "Enable Saving"}
                    </h3>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      {canSave
                        ? `Connected as @${settings.github.username}`
                        : "Enter token to save changes"}
                    </p>
                  </div>
                </div>

                {!canSave ? (
                  <div className="space-y-3">
                    {/* Local Preview - shows changes before token */}
                    {preview && (
                      <div
                        className="rounded-lg p-3 text-xs"
                        style={{ background: "var(--bg)" }}
                      >
                        {/* Has changes */}
                        {preview.filesToCreate.length > 0 ||
                        preview.filesToUpdate.length > 0 ||
                        preview.filesToDelete.length > 0 ? (
                          <>
                            <div className="mb-2 font-medium" style={{ color: textColor }}>
                              Changes to commit:
                            </div>

                            {/* Summary */}
                            <div className="mb-2 grid grid-cols-3 gap-2 text-center">
                              <div
                                className="flex items-center justify-center gap-1"
                                style={{ color: "var(--success)" }}
                              >
                                <Plus size={12} />
                                <span>{preview.filesToCreate.length}</span>
                              </div>
                              <div
                                className="flex items-center justify-center gap-1"
                                style={{ color: "var(--accent-commands)" }}
                              >
                                <Edit size={12} />
                                <span>{preview.filesToUpdate.length}</span>
                              </div>
                              <div
                                className="flex items-center justify-center gap-1"
                                style={{ color: "var(--danger)" }}
                              >
                                <Trash size={12} />
                                <span>{preview.filesToDelete.length}</span>
                              </div>
                            </div>

                            {/* Changed files list */}
                            <div
                              className="max-h-40 space-y-0.5 overflow-y-auto border-t pt-2"
                              style={{ borderColor: border }}
                            >
                              {preview.filesToCreate.map((path, i) => (
                                <div
                                  key={`new-${i}`}
                                  className="flex items-center gap-1.5 py-0.5"
                                  style={{ color: "var(--success)" }}
                                >
                                  <Plus size={9} />
                                  <span className="truncate">{getShortPath(path)}</span>
                                </div>
                              ))}
                              {preview.filesToUpdate.map((path, i) => (
                                <div
                                  key={`upd-${i}`}
                                  className="flex items-center gap-1.5 py-0.5"
                                  style={{ color: "var(--accent-commands)" }}
                                >
                                  <Edit size={9} />
                                  <span className="truncate">{getShortPath(path)}</span>
                                </div>
                              ))}
                              {preview.filesToDelete.map((path, i) => (
                                <div
                                  key={`del-${i}`}
                                  className="flex items-center gap-1.5 py-0.5 line-through opacity-60"
                                  style={{ color: "var(--danger)" }}
                                >
                                  <Trash size={9} />
                                  <span className="truncate">{getShortPath(path)}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          /* No changes */
                          <div className="py-2 text-center">
                            <Check
                              size={20}
                              className="mx-auto mb-1"
                              style={{ color: "var(--success)" }}
                            />
                            <div style={{ color: "var(--success)" }}>No changes to commit</div>
                            <div className="mt-1" style={{ color: mutedColor, fontSize: "10px" }}>
                              All files are in sync
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label
                        className="mb-1.5 block text-xs font-medium"
                        style={{ color: mutedColor }}
                      >
                        GitHub Token (repo scope)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showToken ? "text" : "password"}
                            className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none"
                            style={inputStyle}
                            placeholder="ghp_xxx..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                          />
                          <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-xs"
                            style={{ color: mutedColor }}
                          >
                            {showToken ? "Hide" : "Show"}
                          </button>
                        </div>
                        <button
                          onClick={handleConnect}
                          disabled={!token.trim() || syncStatus === "connecting"}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50"
                          style={{ background: "var(--primary)", color: "white" }}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Remote Preview - with detailed changes */}
                    {preview && (
                      <div
                        className="rounded-lg p-3 text-xs"
                        style={{ background: "var(--bg)" }}
                      >
                        <div className="mb-2 font-medium" style={{ color: textColor }}>
                          Changes to commit:
                        </div>

                        {/* Summary */}
                        <div className="mb-2 grid grid-cols-3 gap-2 text-center">
                          <div
                            className="flex items-center justify-center gap-1"
                            style={{ color: "var(--success)" }}
                          >
                            <Plus size={12} />
                            <span>{preview.filesToCreate.length} new</span>
                          </div>
                          <div
                            className="flex items-center justify-center gap-1"
                            style={{ color: "var(--accent-commands)" }}
                          >
                            <Edit size={12} />
                            <span>{preview.filesToUpdate.length} update</span>
                          </div>
                          <div
                            className="flex items-center justify-center gap-1"
                            style={{ color: "var(--danger)" }}
                          >
                            <Trash size={12} />
                            <span>{preview.filesToDelete.length} delete</span>
                          </div>
                        </div>

                        {/* New files */}
                        {preview.filesToCreate.length > 0 && (
                          <div className="mt-2 border-t pt-2" style={{ borderColor: border }}>
                            <button
                              onClick={() => toggleSection("new")}
                              className="flex w-full items-center gap-1 text-left"
                              style={{ color: "var(--success)" }}
                            >
                              {expandedSections.new ? (
                                <ChevronDown size={12} />
                              ) : (
                                <ChevronRight size={12} />
                              )}
                              <Plus size={10} />
                              <span>New files ({preview.filesToCreate.length})</span>
                            </button>
                            {expandedSections.new && (
                              <div className="mt-1 ml-4 max-h-24 space-y-0.5 overflow-y-auto">
                                {preview.filesToCreate.map((path, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1 py-0.5"
                                    style={{ color: mutedColor }}
                                  >
                                    <File size={9} />
                                    <span className="truncate">{getShortPath(path)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Updated files */}
                        {preview.filesToUpdate.length > 0 && (
                          <div className="mt-2 border-t pt-2" style={{ borderColor: border }}>
                            <button
                              onClick={() => toggleSection("update")}
                              className="flex w-full items-center gap-1 text-left"
                              style={{ color: "var(--accent-commands)" }}
                            >
                              {expandedSections.update ? (
                                <ChevronDown size={12} />
                              ) : (
                                <ChevronRight size={12} />
                              )}
                              <Edit size={10} />
                              <span>Updated ({preview.filesToUpdate.length})</span>
                            </button>
                            {expandedSections.update && (
                              <div className="mt-1 ml-4 max-h-24 space-y-0.5 overflow-y-auto">
                                {preview.filesToUpdate.map((path, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1 py-0.5"
                                    style={{ color: mutedColor }}
                                  >
                                    <File size={9} />
                                    <span className="truncate">{getShortPath(path)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Deleted files */}
                        {preview.filesToDelete.length > 0 && (
                          <div className="mt-2 border-t pt-2" style={{ borderColor: border }}>
                            <button
                              onClick={() => toggleSection("delete")}
                              className="flex w-full items-center gap-1 text-left"
                              style={{ color: "var(--danger)" }}
                            >
                              {expandedSections.delete ? (
                                <ChevronDown size={12} />
                              ) : (
                                <ChevronRight size={12} />
                              )}
                              <Trash size={10} />
                              <span>Deleted ({preview.filesToDelete.length})</span>
                            </button>
                            {expandedSections.delete && (
                              <div className="mt-1 ml-4 max-h-24 space-y-0.5 overflow-y-auto">
                                {preview.filesToDelete.map((path, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1 py-0.5 line-through opacity-60"
                                    style={{ color: mutedColor }}
                                  >
                                    <File size={9} />
                                    <span className="truncate">{getShortPath(path)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* All files (when no remote comparison) */}
                        {preview.filesToCreate.length === 0 &&
                          preview.filesToUpdate.length === 0 &&
                          preview.filesToDelete.length === 0 &&
                          preview.allFiles.length > 0 && (
                            <div className="mt-2 border-t pt-2" style={{ borderColor: border }}>
                              <button
                                onClick={() => toggleSection("all")}
                                className="flex w-full items-center gap-1 text-left"
                                style={{ color: mutedColor }}
                              >
                                {expandedSections.all ? (
                                  <ChevronDown size={12} />
                                ) : (
                                  <ChevronRight size={12} />
                                )}
                                <File size={10} />
                                <span>All files ({preview.allFiles.length})</span>
                              </button>
                              {expandedSections.all && (
                                <div className="mt-1 ml-4 max-h-32 space-y-0.5 overflow-y-auto">
                                  {preview.allFiles.map((path, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-1 py-0.5"
                                      style={{ color: mutedColor }}
                                    >
                                      <File size={9} />
                                      <span className="truncate">{getShortPath(path)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    )}

                    {loadingPreview && (
                      <div
                        className="flex items-center justify-center gap-2 p-2 text-xs"
                        style={{ color: mutedColor }}
                      >
                        <RefreshCw size={12} className="animate-spin" />
                        Loading preview...
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleSync}
                        disabled={syncStatus === "syncing"}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all"
                        style={{
                          background: "var(--success)",
                          color: "white",
                          opacity: syncStatus === "syncing" ? 0.5 : 1,
                        }}
                      >
                        {syncStatus === "syncing" ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Save to GitHub
                          </>
                        )}
                      </button>
                      <button
                        onClick={disconnectGitHub}
                        className="flex items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium"
                        style={{ borderColor: border, color: mutedColor }}
                      >
                        <CloudOff size={16} />
                      </button>
                    </div>
                    {dataExportedAt && (
                      <p className="text-center text-xs" style={{ color: mutedColor }}>
                        Last sync: {new Date(dataExportedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* How it works */}
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: border, background: bgSecondary }}
              >
                <h4 className="mb-2 text-sm font-medium" style={{ color: textColor }}>
                  🔄 How it works
                </h4>
                <div className="space-y-2 text-xs" style={{ color: mutedColor }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                      style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" }}
                    >
                      1
                    </span>
                    <span>Add/edit notes, commands, links, prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                      style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" }}
                    >
                      2
                    </span>
                    <span>Click "Save to GitHub" → ONE commit created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                      style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" }}
                    >
                      3
                    </span>
                    <span>Site auto-rebuilds (~1 min) → refresh to see</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <section>
                <h3 className="mb-3 text-sm font-semibold" style={{ color: textColor }}>
                  Theme
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: <Sun size={18} /> },
                    { value: "dark", label: "Dark", icon: <Moon size={18} /> },
                    {
                      value: "system",
                      label: "System",
                      icon: (
                        <div
                          className="h-4.5 w-4.5 rounded-full border-2 border-current"
                          style={{ background: "linear-gradient(135deg, #fff 50%, #1e293b 50%)" }}
                        />
                      ),
                    },
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSettings({ theme: value as "light" | "dark" | "system" });
                        if (value === "dark" && !isDarkTheme) toggleTheme();
                        if (value === "light" && isDarkTheme) toggleTheme();
                      }}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-all"
                      style={{
                        borderColor: settings.theme === value ? "var(--primary)" : border,
                        background: settings.theme === value ? "color-mix(in srgb, var(--primary) 12%, transparent)" : bgSecondary,
                        color: settings.theme === value ? "var(--primary)" : mutedColor,
                      }}
                    >
                      {icon}
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-sm font-semibold" style={{ color: textColor }}>
                  Font Size
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ fontSize: parseInt(e.target.value) })}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-10 text-center font-mono text-sm" style={{ color: textColor }}>
                    {settings.fontSize}px
                  </span>
                </div>
              </section>
            </>
          )}

          {activeTab === "editor" && (
            <>
              {[
                { key: "autoSave", label: "Auto-save", desc: "Auto-sync changes to the cloud" },
                { key: "spellCheck", label: "Spell Check", desc: "Browser spell checking" },
                { key: "lineNumbers", label: "Line Numbers", desc: "Show line numbers" },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg p-4"
                  style={{ background: bgSecondary }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: textColor }}>
                      {label}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: mutedColor }}>
                      {desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setSettings({ [key]: !settings[key as keyof typeof settings] })}
                    className="relative h-6 w-11 rounded-full transition-colors"
                    style={{
                      background: settings[key as keyof typeof settings] ? "var(--primary)" : border,
                    }}
                  >
                    <div
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: settings[key as keyof typeof settings]
                          ? "translateX(20px)"
                          : "translateX(2px)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </>
          )}

          {activeTab === "data" && (
            <>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-commands"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "color-mix(in srgb, var(--accent-commands) 8%, transparent)" }}
                  >
                    <Download size={20} style={{ color: "var(--accent-commands)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: textColor }}>
                      Export Data
                    </p>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      Download as JSON
                    </p>
                  </div>
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-notes"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "color-mix(in srgb, var(--success) 8%, transparent)" }}
                  >
                    <Upload size={20} style={{ color: "var(--success)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: textColor }}>
                      Import Data
                    </p>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      Import from JSON file
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete ALL data?")) clearAllData();
                  }}
                  className="flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-danger"
                  style={{ borderColor: border, background: bgSecondary }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "color-mix(in srgb, var(--danger) 8%, transparent)" }}
                  >
                    <Trash2 size={20} className="text-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-danger">Clear All Data</p>
                    <p className="text-xs" style={{ color: mutedColor }}>
                      Cannot be undone
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4" style={{ borderColor: border }}>
          <button
            onClick={() => setShowSettings(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ background: bgSecondary, color: mutedColor }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: saved ? "color-mix(in srgb, var(--success) 12%, transparent)" : "color-mix(in srgb, var(--primary) 12%, transparent)",
              color: saved ? "var(--success)" : "var(--primary)",
            }}
          >
            <Save size={14} />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
