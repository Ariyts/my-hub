import { useState, useEffect } from "react";
import { Save, RotateCcw, Eye, Edit3 } from "lucide-react";
import { useStore } from "../../store";
import type { PlaybookContainer, PlaybookSection, PlaybookItem } from "../../types";
import { generateFullExport, autoDetect, validateParsed } from "../../utils/importExport";

interface Props {
  playbook: PlaybookContainer;
}

/**
 * Markdown View — read/edit the playbook as raw markdown.
 * Syncs changes back to the store on "Save" (with parse + merge).
 */
export function MarkdownView({ playbook }: Props) {
  const { updatePlaybookContainer } = useStore();

  const [markdown, setMarkdown] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Load markdown from playbook on mount / playbook change
  useEffect(() => {
    setMarkdown(generateFullExport(playbook));
    setDirty(false);
    setValidationMsg(null);
  }, [playbook.id]);

  const handleChange = (value: string) => {
    setMarkdown(value);
    setDirty(true);
    setSaveStatus("idle");
  };

  const handleSave = () => {
    try {
      const parsed = autoDetect(markdown);
      const result = validateParsed(parsed);
      if (!result.ok) {
        setValidationMsg(result.errors.join("; "));
        setSaveStatus("error");
        return;
      }

      // Собираем новое состояние целиком и пишем ОДНИМ атомарным апдейтом.
      // Раньше здесь был clear + два вложенных setTimeout(50) с поиском секций
      // по заголовку: хрупко (гонка состояния) и терялись id, а вместе с ними —
      // прогресс чеклиста (он хранится по id команды).
      const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

      const prevSections = playbook.sections || [];
      const prevItems = playbook.subItems || [];
      const prevVars = playbook.variables || [];
      const usedIds = new Set<string>();

      const sections: PlaybookSection[] = [];
      const subItems: PlaybookItem[] = [];

      parsed.sections.forEach((section, sIdx) => {
        const title = section.title || "Untitled";
        // Переиспользуем id прежней секции с тем же заголовком — сохраняем привязки
        const prevSection = prevSections.find((s) => s.title === title && !usedIds.has(s.id));
        const sectionId = prevSection?.id ?? newId("sec");
        usedIds.add(sectionId);

        sections.push({
          id: sectionId,
          title,
          order: sIdx,
          collapsed: prevSection?.collapsed ?? false,
          color: section.color ?? prevSection?.color,
        });

        section.items.forEach((item, iIdx) => {
          // Тот же текст команды в той же секции → тот же id (чеклист уцелеет)
          const prevItem = prevItems.find(
            (p) => p.sectionId === sectionId && p.command === item.command && !usedIds.has(p.id),
          );
          const itemId = prevItem?.id ?? newId("cmd");
          usedIds.add(itemId);

          subItems.push({
            id: itemId,
            command: item.command,
            description: item.description,
            language: item.language,
            tags: item.tags,
            isFavorite: item.isFavorite,
            sectionId,
            order: iIdx,
          });
        });
      });

      updatePlaybookContainer(playbook.id, {
        sections,
        subItems,
        variables: (parsed.variables ?? []).map((v) => ({
          id: prevVars.find((p) => p.name === v.name)?.id ?? newId("var"),
          name: v.name,
          value: v.value,
          description: v.description,
        })),
      });

      setDirty(false);
      setSaveStatus("success");
      setValidationMsg(null);
      // Косметический таймер тоста — не связан с состоянием
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setValidationMsg(`Parse error: ${(err as Error).message}`);
      setSaveStatus("error");
    }
  };

  const handleReset = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setMarkdown(generateFullExport(playbook));
    setDirty(false);
    setValidationMsg(null);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface/40 px-6 py-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isEditing
              ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
              : "border border-border-subtle bg-sunken text-muted hover:bg-sunken"
          }`}
        >
          {isEditing ? <Edit3 size={12} /> : <Eye size={12} />}
          {isEditing ? "Editing" : "Preview"}
        </button>

        <button
          onClick={handleSave}
          disabled={!dirty || !!validationMsg}
          className="flex items-center gap-1.5 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={12} />
          Save
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-sunken px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-sunken"
        >
          <RotateCcw size={12} />
          Reset
        </button>

        {dirty && <span className="ml-2 text-[11px] text-amber-400">● unsaved changes</span>}

        {saveStatus === "success" && (
          <span className="ml-2 text-[11px] text-emerald-400">✓ Saved</span>
        )}

        {saveStatus === "error" && (
          <span className="ml-2 text-[11px] text-red-400">✕ {validationMsg}</span>
        )}

        <div className="flex-1" />

        <span className="text-[10px] text-subtle">
          Edit directly in markdown. Save to sync back to the playbook.
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            value={markdown}
            onChange={(e) => handleChange(e.target.value)}
            spellCheck={false}
            className="h-full w-full resize-none bg-background p-6 font-mono text-xs leading-relaxed text-foreground outline-none"
          />
        ) : (
          <div className="max-w-4xl p-6">
            <MarkdownPreview content={markdown} />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple markdown preview renderer (headings, code blocks, lists)
function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <pre
            key={key++}
            className="my-2 overflow-x-auto rounded-lg border border-border bg-surface p-3"
          >
            <div className="mb-1 text-[10px] tracking-wider text-subtle uppercase">
              {codeLang}
            </div>
            <code className="font-mono text-xs whitespace-pre text-foreground">
              {codeBuffer.join("\n")}
            </code>
          </pre>,
        );
        codeBuffer = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        // Open code block
        codeLang = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="mt-6 mb-3 text-2xl font-bold text-foreground first:mt-0">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mt-5 mb-2 border-b border-border pb-1 text-lg font-bold text-foreground"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("<!--")) {
      // Skip HTML comments
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="my-1.5 text-sm leading-relaxed text-muted">
          {line}
        </p>,
      );
    }
  }

  return <div>{elements}</div>;
}
