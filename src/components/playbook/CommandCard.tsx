import { useState } from "react";
import {
  Copy,
  Check,
  Edit3,
  Trash2,
  Star,
  Circle,
  CheckCircle2,
  XCircle,
  FileCode,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useStore } from "../../store";
import type { PlaybookItem, PlaybookVariable, ChecklistStatus } from "../../types";
import { LANG_COLORS, LANG_LABELS } from "./constants";
import { stripMdMetadata, cleanDescription, highlightSyntax } from "./utils";
import { highlightRendered } from "./variables";
import { CommandEditForm } from "./CommandEditForm";
import { generateItemExport } from "../../utils/importExport";

export type ViewMode = "reference" | "engagement";

interface Props {
  item: PlaybookItem;
  containerId: string;
  mode: ViewMode;
  variables: PlaybookVariable[];
  checklistStatus: ChecklistStatus;
  onChecklistCycle: () => void;
}

export function CommandCard({
  item,
  containerId,
  mode,
  variables,
  checklistStatus,
  onChecklistCycle,
}: Props) {
  const { updatePlaybookItem, deletePlaybookItem } = useStore();

  const [copied, setCopied] = useState(false);
  const [copiedFlash, setCopiedFlash] = useState(false);
  const [editing, setEditing] = useState(false);

  const template = stripMdMetadata(item.command);
  const description = cleanDescription(item.description);
  const langColor = LANG_COLORS[item.language] || "#64748b";
  const langLabel = LANG_LABELS[item.language] || item.language.toUpperCase();

  // Render command: substitute variables in engagement mode
  // Подстановка считается всегда (а не только в engagement) — в reference-режиме
  // она нужна для кнопки «Resolved», чтобы быстро скопировать готовую команду
  // с подставленными $VAR, не запуская чеклист (Задача 3.3)
  const getRenderedText = (): string => {
    if (variables.length === 0) return template;
    let out = template;
    for (const v of variables) {
      if (!v.value) continue;
      const re = new RegExp(`\\$\\{${v.name}\\}|\\$${v.name}\\b`, "g");
      out = out.replace(re, v.value);
    }
    return out;
  };

  const renderedText = getRenderedText();
  const copyText = mode === "engagement" ? renderedText : template;

  const handleCopy = async (textToCopy: string = copyText) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
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
    setCopiedFlash(true);
    setTimeout(() => setCopied(false), 1600);
    setTimeout(() => setCopiedFlash(false), 500);
  };

  const isDone = checklistStatus === "done";
  const isSkipped = checklistStatus === "skipped";
  const dimmed = isDone || isSkipped;

  // ---------------- EDIT MODE ----------------
  if (editing) {
    return (
      <CommandEditForm item={item} containerId={containerId} onDone={() => setEditing(false)} />
    );
  }

  // ---------------- VIEW MODE ----------------
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-surface backdrop-blur-sm",
        "overflow-hidden transition-all duration-200",
        "hover:bg-sunken hover:shadow-lg hover:shadow-black/20",
        dimmed ? "border-border opacity-60" : "border-border hover:border-border-subtle",
        copiedFlash && "ring-2 ring-emerald-400/60",
        isDone && "border-emerald-500/30",
        isSkipped && "border-border-subtle",
      )}
    >
      <div className="flex">
        {/* Engagement mode: checklist column */}
        {mode === "engagement" && (
          <button
            onClick={onChecklistCycle}
            className={cn(
              "flex w-12 flex-shrink-0 items-center justify-center border-r transition-colors",
              isDone
                ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                : isSkipped
                  ? "border-border-subtle bg-sunken hover:bg-sunken"
                  : "border-border bg-surface hover:bg-sunken",
            )}
            title={`Click to cycle: ${checklistStatus} → ${
              checklistStatus === "pending"
                ? "done"
                : checklistStatus === "done"
                  ? "skipped"
                  : "pending"
            }`}
          >
            {isDone ? (
              <CheckCircle2 size={20} className="text-emerald-400" />
            ) : isSkipped ? (
              <XCircle size={20} className="text-subtle" />
            ) : (
              <Circle size={20} className="text-subtle group-hover:text-muted" />
            )}
          </button>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Language accent bar (top) */}
          <div
            className="h-0.5 w-full"
            style={{ background: `linear-gradient(90deg, ${langColor}, transparent)` }}
          />

          {/* Header: lang badge + tags + favorite */}
          <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider"
              style={{
                background: `${langColor}25`,
                color: langColor,
                border: `1px solid ${langColor}40`,
              }}
            >
              {langLabel}
            </span>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              {item.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border-subtle bg-sunken px-1.5 py-0.5 text-[10px] text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {mode === "engagement" && variables.length > 0 && (
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-medium text-cyan-300">
                RESOLVED
              </span>
            )}

            <button
              onClick={() =>
                updatePlaybookItem(containerId, item.id, { isFavorite: !item.isFavorite })
              }
              className="rounded-md p-1 transition-colors hover:bg-amber-400/10"
              title={item.isFavorite ? "Remove from favorites" : "Mark as favorite"}
            >
              <Star
                size={13}
                className={cn(
                  "transition-colors",
                  item.isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-subtle hover:text-amber-400",
                )}
              />
            </button>
          </div>

          {/* Code block — click to copy */}
          <button
            onClick={() => handleCopy()}
            className={cn(
              "group/code relative w-full px-3 py-2.5 text-left focus:outline-none",
              isDone && "line-through decoration-subtle decoration-1",
            )}
            title={
              mode === "engagement" ? "Click to copy rendered command" : "Click to copy template"
            }
          >
            <div
              className={cn(
                "font-mono text-[12.5px] leading-relaxed break-all whitespace-pre-wrap text-foreground",
                "transition-opacity",
                copied && "opacity-40",
              )}
            >
              {mode === "engagement" && variables.length > 0
                ? highlightRendered(template, variables, (seg) => highlightSyntax(seg))
                : highlightSyntax(template)}
            </div>

            {copied && (
              <div className="animate-in absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-[1px]">
                <div className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-1.5">
                  <Check size={14} className="text-emerald-300" />
                  <span className="text-xs font-medium text-emerald-200">Copied</span>
                  <span className="text-[10px] text-emerald-300/70">
                    ({mode === "engagement" ? "rendered" : "template"})
                  </span>
                </div>
              </div>
            )}

            {!copied && (
              <div className="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover/code:opacity-100">
                <div className="flex items-center gap-1 rounded border border-border-subtle bg-sunken px-1.5 py-0.5">
                  <Copy size={10} className="text-muted" />
                  <span className="text-[9px] font-medium text-muted">
                    {mode === "engagement" ? "COPY RESOLVED" : "COPY"}
                  </span>
                </div>
              </div>
            )}
          </button>

          {description && (
            <div className="px-3 pb-2">
              <p
                className={cn(
                  "text-[11.5px] leading-snug text-muted",
                  isDone && "line-through decoration-subtle",
                )}
              >
                {description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 border-t border-border bg-background/40 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {mode === "engagement" && variables.length > 0 && renderedText !== template && (
              <button
                onClick={() => handleCopy(template)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted transition-colors hover:bg-sunken hover:text-foreground"
                title="Copy original template with $VARS"
              >
                <Copy size={11} />
                Template
              </button>
            )}
            {/* Reference mode: быстро скопировать команду с подставленными $VAR */}
            {mode !== "engagement" && renderedText !== template && (
              <button
                onClick={() => handleCopy(renderedText)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-cyan-400 transition-colors hover:bg-cyan-500/15 hover:text-cyan-300"
                title={`Copy with variables substituted:\n${renderedText}`}
              >
                <Copy size={11} />
                Resolved
              </button>
            )}
            <button
              onClick={() => handleCopy()}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors",
                copied
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-muted hover:bg-sunken hover:text-foreground",
              )}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : mode === "engagement" ? "Copy Resolved" : "Copy"}
            </button>
            {/* Экспорт команды как markdown-фрагмента: язык, описание, теги (Задача 3.6) */}
            <button
              onClick={() => handleCopy(generateItemExport(item))}
              className="rounded-md px-1.5 py-1 text-muted transition-colors hover:bg-sunken hover:text-foreground"
              title="Copy as Markdown (with description and tags)"
            >
              <FileCode size={11} />
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted transition-colors hover:bg-sunken hover:text-foreground"
            >
              <Edit3 size={11} />
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this command?")) deletePlaybookItem(containerId, item.id);
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted transition-colors hover:bg-red-500/15 hover:text-red-300"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
