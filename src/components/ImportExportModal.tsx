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
  LayoutTemplate,
} from "lucide-react";
import { useStore } from "../store";
import type {
  PlaybookContainer,
  PlaybookSection,
  PlaybookItem,
  PlaybookVariable,
} from "../types";
import {
  generateMarkdownTemplate,
  generateFullExport,
  autoDetect,
  validateParsed,
  type ParsedPlaybook,
  type ValidationResult,
} from "../utils/importExport";
import { PLAYBOOK_TEMPLATES, type PlaybookTemplate } from "../utils/playbookTemplates";

type Tab = "templates" | "template" | "import" | "export";
type MergeMode = "append" | "replace";

interface Props {
  playbook: PlaybookContainer;
  onClose: () => void;
}

export function ImportExportModal({ playbook, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("template");
  const [importText, setImportText] = useState("");
  const [mergeMode, setMergeMode] = useState<MergeMode>("append");
  const [copied, setCopied] = useState(false);
  const [importResult, setImportResult] = useState<ValidationResult | null>(null);
  const [imported, setImported] = useState(false);
  // Templates (Задача 3.7)
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
  const [templateApplied, setTemplateApplied] = useState(false);

  const template = generateMarkdownTemplate(playbook.title);
  const fullExport = generateFullExport(playbook);

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
        stats: { sections: 0, commands: 0 },
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
      applyParsed(parsed, playbook, mergeMode);
      setImported(true);
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    }
  };

  /**
   * Применение встроенного шаблона (Задача 3.7). Шаблон — markdown того же
   * формата, что импорт, поэтому используем ту же пару autoDetect + applyParsed.
   * В непустой плейбук просим подтверждение перед replace, чтобы не затереть.
   */
  const handleApplyTemplate = (mode: MergeMode) => {
    if (!selectedTemplate) return;
    const hasContent = (playbook.sections?.length || 0) > 0 || (playbook.subItems?.length || 0) > 0;
    if (mode === "replace" && hasContent) {
      if (!confirm(`Replace all content of "${playbook.title}" with this template?`)) return;
    }
    try {
      const parsed = autoDetect(selectedTemplate.markdown);
      applyParsed(parsed, playbook, mode);
      setTemplateApplied(true);
    } catch (err) {
      alert(`Failed to apply template: ${(err as Error).message}`);
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
            <FileText size={16} className="text-playbooks" />
            <h2 className="text-base font-semibold text-foreground">Import / Export</h2>
            <span className="text-xs text-subtle">{playbook.title}</span>
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
            active={activeTab === "templates"}
            onClick={() => setActiveTab("templates")}
            icon={<LayoutTemplate size={12} />}
            label="Templates"
          />
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
          {/* =========== TEMPLATES TAB (Задача 3.7) =========== */}
          {activeTab === "templates" && (
            <div className="flex-1 overflow-auto p-5">
              {!selectedTemplate ? (
                <div className="space-y-3">
                  <div className="text-xs text-muted">
                    Готовые заготовки с секциями, командами и переменными — быстрый старт
                    вместо пустого плейбука.
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PLAYBOOK_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplate(tpl);
                          setTemplateApplied(false);
                        }}
                        className="group flex flex-col gap-2 rounded-xl border border-border-subtle bg-background/40 p-4 text-left transition-colors hover:border-playbooks/40 hover:bg-sunken/40"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tpl.icon}</span>
                          <span className="text-sm font-semibold text-foreground group-hover:text-playbooks">
                            {tpl.title}
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug text-muted">{tpl.description}</p>
                        <div className="mt-auto flex items-center gap-3 text-[10px] text-subtle">
                          <span>
                            <b className="text-muted">{tpl.sections}</b> секций
                          </span>
                          <span>
                            <b className="text-muted">{tpl.commands}</b> команд
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setTemplateApplied(false);
                      }}
                      className="rounded-lg border border-border bg-sunken px-2.5 py-1 text-[11px] text-muted hover:bg-border"
                    >
                      ← Все шаблоны
                    </button>
                    <span className="text-lg">{selectedTemplate.icon}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {selectedTemplate.title}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleApplyTemplate("append")}
                      disabled={templateApplied}
                      className="flex items-center gap-1.5 rounded-lg bg-playbooks px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {templateApplied ? <CheckCircle2 size={12} /> : <Upload size={12} />}
                      {templateApplied ? "Добавлено!" : "Добавить к плейбуку"}
                    </button>
                    <button
                      onClick={() => handleApplyTemplate("replace")}
                      disabled={templateApplied}
                      className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <AlertCircle size={12} />
                      Заменить содержимое
                    </button>
                    {templateApplied && (
                      <button
                        onClick={onClose}
                        className="rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground hover:bg-border"
                      >
                        Готово — закрыть
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-subtle">
                    «Добавить» дописывает секции к текущему плейбуку (совпадающие по названию
                    объединяются), «Заменить» — очищает и ставит только шаблон.
                  </div>

                  <textarea
                    value={selectedTemplate.markdown}
                    readOnly
                    className="h-[45vh] w-full resize-none rounded-lg border border-border-subtle bg-background p-3 font-mono text-xs text-foreground outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* =========== TEMPLATE TAB =========== */}
          {activeTab === "template" && (
            <div className="flex-1 space-y-3 overflow-auto p-5">
              <div className="space-y-1 rounded-lg border border-playbooks/30 bg-playbooks/10 p-3 text-xs text-playbooks">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={13} />
                  How it works
                </div>
                <ol className="list-inside list-decimal space-y-1 text-playbooks/80">
                  <li>
                    Click <b>"Copy Template"</b> below
                  </li>
                  <li>
                    Paste into your AI chat with a prompt like:{" "}
                    <i>"Fill this pentest playbook with SSH enumeration commands"</i>
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
                  className="flex items-center gap-1.5 rounded-lg bg-playbooks px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Template"}
                </button>
                <button
                  onClick={() => handleDownload(template, `${playbook.title}-template.md`)}
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
                    accept=".md,.markdown,.txt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-subtle">Supports Markdown and JSON</span>
              </div>

              <textarea
                value={importText}
                onChange={(e) => handleImportTextChange(e.target.value)}
                placeholder={`Paste AI-generated markdown here...\n\nExample:\n# Playbook: SSH\n## Recon\n\`\`\`bash\nnmap -sV -p 22 $TARGET\n\`\`\`\nTags: #nmap`}
                className="h-[30vh] w-full resize-none rounded-lg border border-border-subtle bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-playbooks/50"
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
                      <b className="text-foreground">{importResult.stats.commands}</b> commands
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
                        name="merge"
                        checked={mergeMode === "append"}
                        onChange={() => setMergeMode("append")}
                        className="accent-playbooks"
                      />
                      <span className="text-foreground">Append</span>
                      <span className="text-[10px] text-subtle">(keep existing)</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs transition-colors hover:bg-border">
                      <input
                        type="radio"
                        name="merge"
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
                  className="flex items-center gap-1.5 rounded-lg bg-playbooks px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {imported ? <CheckCircle2 size={12} /> : <Upload size={12} />}
                  {imported ? "Imported!" : "Import into Playbook"}
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
                Full markdown export of <b className="text-foreground">{playbook.title}</b> with all
                sections, commands, tags and variables.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(fullExport)}
                  className="flex items-center gap-1.5 rounded-lg bg-playbooks px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:opacity-90"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>
                <button
                  onClick={() => handleDownload(fullExport, `${playbook.title}.md`)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-sunken px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border"
                >
                  <Download size={12} />
                  Download .md
                </button>
                <button
                  onClick={() =>
                    handleDownload(JSON.stringify(playbook, null, 2), `${playbook.title}.json`)
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
          ? "border border-border bg-sunken text-playbooks"
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

/**
 * Собирает итоговое состояние плейбука и пишет его ОДНИМ атомарным апдейтом.
 *
 * Раньше здесь на каждую секцию заводился setTimeout(10), внутри которого
 * состояние перечитывалось и секция искалась по заголовку (бралась последняя
 * совпавшая) — потому что addPlaybookSection не возвращает id. При нескольких
 * секциях это гонка: таймеры срабатывают вперемешку, команды могли уехать не в
 * ту секцию. Теперь id генерируются заранее, и никаких таймеров не нужно.
 */
function applyParsed(parsed: ParsedPlaybook, playbook: PlaybookContainer, mode: MergeMode) {
  const store = useStore.getState();
  const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  const replace = mode === "replace";

  // В replace начинаем с чистого листа, в append — с текущего содержимого
  const sections: PlaybookSection[] = replace
    ? []
    : (playbook.sections || []).map((s) => ({ ...s }));
  const subItems: PlaybookItem[] = replace ? [] : (playbook.subItems || []).map((i) => ({ ...i }));
  const variables: PlaybookVariable[] = replace
    ? []
    : (playbook.variables || []).map((v) => ({ ...v }));

  // Счётчики порядка команд по секциям
  const orderBySection = new Map<string, number>();
  for (const it of subItems) {
    const key = it.sectionId ?? "";
    orderBySection.set(key, Math.max(orderBySection.get(key) ?? 0, (it.order ?? 0) + 1));
  }

  // Переменные: по имени — обновляем существующую, иначе добавляем
  for (const v of parsed.variables ?? []) {
    const idx = variables.findIndex((x) => x.name === v.name);
    if (idx >= 0) {
      variables[idx] = { ...variables[idx], value: v.value, description: v.description };
    } else {
      variables.push({
        id: newId("var"),
        name: v.name,
        value: v.value,
        description: v.description,
      });
    }
  }

  // Секции и команды
  for (const section of parsed.sections) {
    const title = section.title || "Untitled Section";

    let targetId: string;
    const existingIdx = sections.findIndex((s) => s.title === title);
    if (existingIdx >= 0) {
      targetId = sections[existingIdx].id;
      if (section.color) sections[existingIdx] = { ...sections[existingIdx], color: section.color };
    } else {
      targetId = newId("sec");
      sections.push({
        id: targetId,
        title,
        order: sections.length,
        collapsed: false,
        color: section.color,
      });
    }

    for (const item of section.items) {
      const order = orderBySection.get(targetId) ?? 0;
      orderBySection.set(targetId, order + 1);
      subItems.push({
        id: newId("cmd"),
        command: item.command,
        description: item.description,
        language: item.language,
        tags: item.tags,
        isFavorite: item.isFavorite,
        sectionId: targetId,
        order,
      });
    }
  }

  store.updatePlaybookContainer(playbook.id, { sections, subItems, variables });
}
