import { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../store";
import type { LinkContainer } from "../types";
import {
  generateMarkdownTemplate,
  generateFullExport,
  autoDetect,
  validateParsed,
  type ParsedLinks,
  type ValidationResult,
} from "../utils/linksImportExport";
import { faviconForDomain } from "../utils/linkMetadata";

type Tab = "template" | "import" | "export";
type MergeMode = "append" | "replace";

interface Props {
  container: LinkContainer;
  onClose: () => void;
}

export function LinksImportExportModal({ container, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("template");
  const [importText, setImportText] = useState("");
  const [mergeMode, setMergeMode] = useState<MergeMode>("append");
  const [copied, setCopied] = useState(false);
  const [importResult, setImportResult] = useState<ValidationResult | null>(null);
  const [imported, setImported] = useState(false);

  const template = generateMarkdownTemplate(container.title);
  const fullExport = generateFullExport(container);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
      validateImport(text);
    };
    reader.readAsText(file);
  };

  const validateImport = (text: string) => {
    try {
      const parsed = autoDetect(text);
      const result = validateParsed(parsed);
      setImportResult(result);
    } catch (err) {
      setImportResult({
        ok: false,
        errors: [`Parse error: ${(err as Error).message}`],
        warnings: [],
        stats: { sections: 0, links: 0 },
      });
    }
  };

  const handleImportTextChange = (text: string) => {
    setImportText(text);
    setImported(false);
    if (text.trim()) validateImport(text);
    else setImportResult(null);
  };

  const handleDoImport = () => {
    if (!importResult?.ok) return;
    try {
      const parsed = autoDetect(importText);
      applyParsed(parsed, container, mergeMode);
      setImported(true);
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-sheet relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-links" />
            <h2 className="text-base font-semibold text-foreground">Import / Export</h2>
            <span className="text-xs text-subtle">{container.title}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-sunken hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-subtle bg-background/40 px-5 py-2">
          <TabButton
            active={activeTab === "template"}
            onClick={() => setActiveTab("template")}
            icon={<Copy size={12} />}
            label="Template for AI"
          />
          <TabButton
            active={activeTab === "import"}
            onClick={() => setActiveTab("import")}
            icon={<Upload size={12} />}
            label="Import"
          />
          <TabButton
            active={activeTab === "export"}
            onClick={() => setActiveTab("export")}
            icon={<Download size={12} />}
            label="Export all"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* =========== TEMPLATE TAB =========== */}
          {activeTab === "template" && (
            <div className="flex-1 space-y-3 overflow-auto p-5">
              <div className="space-y-1 rounded-lg border border-links/30 bg-links/10 p-3 text-xs text-links">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={13} />
                  How it works
                </div>
                <ol className="list-inside list-decimal space-y-1 text-links/80">
                  <li>
                    Click <b>"Copy Template"</b> below
                  </li>
                  <li>
                    Paste into your AI chat with a prompt like:{" "}
                    <i>"Fill this links collection with useful cybersecurity resources"</i>
                  </li>
                  <li>AI returns filled markdown</li>
                  <li>
                    Come back to <b>Import tab</b> and paste the response
                  </li>
                </ol>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(template)}
                  className="flex items-center gap-1.5 rounded-lg bg-links px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Template"}
                </button>
                <button
                  onClick={() => handleDownload(template, `${container.title}-template.md`)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border"
                >
                  <Download size={12} />
                  Download .md
                </button>
              </div>

              <textarea
                value={template}
                readOnly
                className="h-[45vh] w-full resize-none rounded-lg border border-border-subtle bg-background p-3 font-mono text-xs text-foreground outline-none"
              />
            </div>
          )}

          {/* =========== IMPORT TAB =========== */}
          {activeTab === "import" && (
            <div className="flex-1 space-y-3 overflow-auto p-5">
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border">
                  <Upload size={12} />
                  Upload file
                  <input
                    type="file"
                    accept=".md,.markdown,.txt,.json,.html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-subtle">
                  Supports Markdown, JSON and browser bookmarks (.html)
                </span>
              </div>

              <textarea
                value={importText}
                onChange={(e) => handleImportTextChange(e.target.value)}
                placeholder={`Paste AI-generated markdown here...\n\nExample:\n# Links: Resources\n## Docs\n- [MDN](https://developer.mozilla.org/) Web docs\nTags: #docs, #web`}
                className="h-[30vh] w-full resize-none rounded-lg border border-border-subtle bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-links/50"
              />

              {/* Validation result */}
              {importResult && (
                <div
                  className={`space-y-2 rounded-lg border p-3 ${
                    importResult.ok
                      ? "border-success/30 bg-success/10"
                      : "border-danger/30 bg-danger/10"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {importResult.ok ? (
                      <>
                        <CheckCircle2 size={14} className="text-success" />
                        <span className="text-success">Ready to import</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="text-danger" />
                        <span className="text-danger">Cannot import</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted">
                    <span>
                      <b className="text-foreground">{importResult.stats.sections}</b> sections
                    </span>
                    <span>
                      <b className="text-foreground">{importResult.stats.links}</b> links
                    </span>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-1">
                      {importResult.errors.map((e, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-danger">
                          <span className="text-danger">✕</span>
                          {e}
                        </div>
                      ))}
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div className="space-y-1">
                      {importResult.warnings.map((w, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] text-warning"
                        >
                          <span className="text-warning">!</span>
                          {w}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Merge mode */}
              {importResult?.ok && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-muted">Merge strategy:</div>
                  <div className="flex gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs transition-colors hover:bg-border">
                      <input
                        type="radio"
                        name="merge-links"
                        checked={mergeMode === "append"}
                        onChange={() => setMergeMode("append")}
                        className="accent-links"
                      />
                      <span className="text-foreground">Append</span>
                      <span className="text-[10px] text-subtle">(keep existing)</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs transition-colors hover:bg-border">
                      <input
                        type="radio"
                        name="merge-links"
                        checked={mergeMode === "replace"}
                        onChange={() => setMergeMode("replace")}
                        className="accent-danger"
                      />
                      <span className="text-foreground">Replace</span>
                      <span className="text-[10px] text-subtle">(overwrites)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDoImport}
                  disabled={!importResult?.ok || imported}
                  className="flex items-center gap-1.5 rounded-lg bg-links px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {imported ? <CheckCircle2 size={12} /> : <Upload size={12} />}
                  {imported ? "Imported!" : "Import into Links"}
                </button>
                {imported && (
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground hover:bg-border"
                  >
                    Done — Close
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =========== EXPORT TAB =========== */}
          {activeTab === "export" && (
            <div className="flex-1 space-y-3 overflow-auto p-5">
              <div className="text-xs text-muted">
                Full markdown export of <b className="text-foreground">{container.title}</b> with all
                sections and links.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(fullExport)}
                  className="flex items-center gap-1.5 rounded-lg bg-links px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>
                <button
                  onClick={() => handleDownload(fullExport, `${container.title}.md`)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border"
                >
                  <Download size={12} />
                  Download .md
                </button>
                <button
                  onClick={() =>
                    handleDownload(JSON.stringify(container, null, 2), `${container.title}.json`)
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border"
                >
                  <Download size={12} />
                  Download .json
                </button>
              </div>

              <textarea
                value={fullExport}
                readOnly
                className="h-[50vh] w-full resize-none rounded-lg border border-border-subtle bg-background p-3 font-mono text-xs text-foreground outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border border-border bg-sunken text-links"
          : "border border-transparent text-muted hover:bg-sunken/50 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================================================
// APPLY PARSED DATA TO STORE
// ============================================================================

function applyParsed(parsed: ParsedLinks, container: LinkContainer, mode: MergeMode) {
  const store = useStore.getState();

  // Replace mode: clear all existing sections and items
  if (mode === "replace") {
    store.updateLinkContainer(container.id, {
      sections: [],
      subItems: [],
    });
  }

  // Add sections and items
  for (const section of parsed.sections) {
    store.addLinkSection(container.id, section.title || "Untitled Section");

    // addLinkSection doesn't return the section ID.
    // We use a setTimeout to read the latest state and find the newly created section.
    const sectionTitle = section.title || "Untitled Section";
    const itemsToAdd = section.items;
    const sectionColor = section.color;
    const sectionIcon = section.icon;

    setTimeout(() => {
      const currentContainer = useStore.getState().links.find((l) => l.id === container.id);
      if (!currentContainer) return;
      // Find the most recently created section with this title
      const matchingSections = (currentContainer.sections || []).filter(
        (s) => s.title === sectionTitle,
      );
      const targetSection = matchingSections[matchingSections.length - 1];

      // Apply color and icon if specified
      if (targetSection) {
        const updates: Record<string, any> = {};
        if (sectionColor) updates.color = sectionColor;
        if (sectionIcon) updates.icon = sectionIcon;
        if (Object.keys(updates).length > 0) {
          store.updateLinkSection(container.id, targetSection.id, updates);
        }
      }

      for (const item of itemsToAdd) {
        store.addLinkItem(container.id, {
          url: item.url,
          title: item.title,
          description: item.description || undefined,
          tags: item.tags,
          isFavorite: item.isFavorite,
          sectionId: targetSection?.id,
          color: item.color,
          level: item.level,
          favicon: faviconForDomain(getDomain(item.url)),
        });
      }
    }, 10);
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
