import { useState } from "react";
import { Copy, Check, Edit3, Trash2, Star, Braces } from "lucide-react";
import { cn } from "../../utils/cn";
import { useStore } from "../../store";
import type { PlaybookItem, PlaybookVariable, ChecklistStatus } from "../../types";
import { LANG_COLORS, LANG_LABELS } from "./constants";
import { stripMdMetadata } from "./utils";
import { CommandEditForm } from "./CommandEditForm";

interface Props {
  item: PlaybookItem;
  containerId: string;
  mode: "reference" | "engagement";
  variables: PlaybookVariable[];
  checklistStatus: ChecklistStatus;
  onChecklistCycle: () => void;
}

/**
 * Compact command row (~36px height) for list view.
 * Uses Tailwind classes to match the existing PlaybookView design.
 */
export function CommandListItem({
  item,
  containerId,
  mode,
  variables,
  checklistStatus,
  onChecklistCycle,
}: Props) {
  const { updatePlaybookItem, deletePlaybookItem } = useStore();
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  // Clean markdown metadata from display
  const template = stripMdMetadata(item.command);
  const langColor = LANG_COLORS[item.language] || "#64748b";
  const langLabel = LANG_LABELS[item.language] || item.language.toUpperCase().slice(0, 2);

  // Render command: substitute variables in engagement mode
  // Считаем подстановку всегда — в reference-режиме нужна для быстрого
  // копирования готовой команды с $VAR (Задача 3.3)
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

  const handleCopy = (e: React.MouseEvent, text: string = copyText) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text).catch(() => {
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
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const isDone = checklistStatus === "done";
  const isSkipped = checklistStatus === "skipped";

  if (editing) {
    return (
      <div className="p-2">
        <CommandEditForm
          item={item}
          containerId={containerId}
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.description || "Click to copy"}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 border-b border-border px-3 py-1.5 transition-colors",
        "hover:bg-sunken",
        isDone && "opacity-50",
        isSkipped && "opacity-40",
      )}
    >
      {/* Engagement mode: checklist indicator */}
      {mode === "engagement" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChecklistCycle();
          }}
          className={cn(
            "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isDone
              ? "border-success/50 bg-success/20"
              : isSkipped
                ? "border-border-subtle bg-sunken"
                : "border-border-subtle hover:border-muted",
          )}
          title={`Status: ${checklistStatus}`}
        >
          {isDone && <Check size={10} className="text-success" />}
          {isSkipped && <span className="h-1.5 w-1.5 rounded-full bg-subtle" />}
        </button>
      )}

      {/* Language badge */}
      <span
        className={cn(
          "flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider",
        )}
        style={{
          background: `${langColor}20`,
          color: langColor,
          border: `1px solid ${langColor}40`,
        }}
      >
        {langLabel}
      </span>

      {/* Code (with truncation) */}
      <div
        className={cn(
          "min-w-0 flex-1 font-mono text-[11.5px] text-foreground",
          "max-h-20 overflow-hidden leading-relaxed break-all whitespace-pre-wrap",
          isDone && "line-through decoration-subtle",
        )}
      >
        {copyText}
      </div>

      {/* Tags (max 2) */}
      <div className="flex max-w-[150px] flex-shrink-0 items-center gap-1 overflow-hidden">
        {(item.tags || []).slice(0, 2).map((tag: string) => (
          <span
            key={tag}
            className="flex-shrink-0 rounded border border-border-subtle bg-sunken px-1.5 py-0.5 text-[9px] text-muted"
          >
            #{tag}
          </span>
        ))}
        {(item.tags || []).length > 2 && (
          <span className="flex-shrink-0 text-[9px] text-subtle">
            +{(item.tags || []).length - 2}
          </span>
        )}
      </div>

      {/* Favorite */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          updatePlaybookItem(containerId, item.id, { isFavorite: !item.isFavorite });
        }}
        className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-amber-400/10"
        title={item.isFavorite ? "Remove favorite" : "Add favorite"}
      >
        <Star
          size={12}
          className={cn(
            "transition-colors",
            item.isFavorite
              ? "fill-amber-400 text-amber-400"
              : "text-subtle hover:text-amber-400",
          )}
        />
      </button>

      {/* Actions (hover) */}
      <div
        className={cn(
          "flex flex-shrink-0 items-center gap-0.5 transition-opacity",
          hovered ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Reference mode: копия с подставленными $VAR (Задача 3.3) */}
        {mode !== "engagement" && renderedText !== template && (
          <button
            onClick={(e) => handleCopy(e, renderedText)}
            className="rounded p-1 text-playbooks transition-colors hover:bg-playbooks/15 hover:text-playbooks"
            title={`Copy with variables substituted:\n${renderedText}`}
          >
            <Braces size={11} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(e);
          }}
          className={cn(
            "rounded p-1 transition-colors",
            copied
              ? "bg-success/20 text-success"
              : "text-subtle hover:bg-sunken hover:text-foreground",
          )}
          title="Copy"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="rounded p-1 text-subtle transition-colors hover:bg-sunken hover:text-playbooks"
          title="Edit"
        >
          <Edit3 size={11} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this command?")) deletePlaybookItem(containerId, item.id);
          }}
          className="rounded p-1 text-subtle transition-colors hover:bg-danger/15 hover:text-danger"
          title="Delete"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 rounded border border-success/40 bg-success/20 px-2 py-0.5 text-[10px] text-success">
          Copied!
        </div>
      )}
    </div>
  );
}
