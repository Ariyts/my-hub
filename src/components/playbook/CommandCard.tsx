import { useState, useRef, useEffect } from "react";
import { Copy, Check, Edit3, Trash2, Star, Circle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { useStore } from "../../store";
import type {
  PlaybookItem,
  PlaybookLanguage,
  PlaybookVariable,
  ChecklistStatus,
} from "../../types";
import { LANG_COLORS, LANG_LABELS, PLAYBOOK_LANGUAGES } from "./constants";
import { stripMdMetadata, cleanDescription, highlightSyntax } from "./utils";
import { highlightRendered } from "./variables";

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
  const [editData, setEditData] = useState({ ...item });
  const editCmdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editCmdRef.current?.focus();
  }, [editing]);

  const template = stripMdMetadata(item.command);
  const description = cleanDescription(item.description);
  const langColor = LANG_COLORS[item.language] || "#64748b";
  const langLabel = LANG_LABELS[item.language] || item.language.toUpperCase();

  // Render command: substitute variables in engagement mode
  const getRenderedText = (): string => {
    if (mode !== "engagement" || variables.length === 0) return template;
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

  const handleSave = () => {
    if (!editData.command.trim()) return;
    updatePlaybookItem(containerId, item.id, editData);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ ...item });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const isDone = checklistStatus === "done";
  const isSkipped = checklistStatus === "skipped";
  const dimmed = isDone || isSkipped;

  // ---------------- EDIT MODE ----------------
  if (editing) {
    return (
      <div className="animate-in space-y-2 rounded-xl border border-cyan-400/40 bg-slate-900/60 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-200 outline-none focus:border-cyan-400"
            value={editData.language}
            onChange={(e) =>
              setEditData({ ...editData, language: e.target.value as PlaybookLanguage })
            }
          >
            {PLAYBOOK_LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {LANG_LABELS[l]}
              </option>
            ))}
          </select>
          <input
            ref={editCmdRef}
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 outline-none focus:border-cyan-400"
            value={editData.command}
            onChange={(e) => setEditData({ ...editData, command: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="command (use $VAR for context variables)..."
          />
        </div>
        <input
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-400"
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          placeholder="description..."
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-400"
          value={editData.tags.join(", ")}
          onChange={(e) =>
            setEditData({
              ...editData,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="tags (comma separated)..."
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-end gap-2">
          <span className="mr-auto text-[10px] text-slate-500">
            ⌘/Ctrl + Enter to save · Esc to cancel
          </span>
          <button
            onClick={handleCancelEdit}
            className="rounded-md px-2.5 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editData.command.trim()}
            className="rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/30 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // ---------------- VIEW MODE ----------------
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-slate-900/40 backdrop-blur-sm",
        "overflow-hidden transition-all duration-200",
        "hover:bg-slate-900/70 hover:shadow-lg hover:shadow-black/20",
        dimmed ? "border-slate-800/60 opacity-60" : "border-slate-800 hover:border-slate-700",
        copiedFlash && "ring-2 ring-emerald-400/60",
        isDone && "border-emerald-500/30",
        isSkipped && "border-slate-700/60",
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
                  ? "border-slate-700 bg-slate-800/40 hover:bg-slate-700/40"
                  : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/40",
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
              <XCircle size={20} className="text-slate-500" />
            ) : (
              <Circle size={20} className="text-slate-600 group-hover:text-slate-400" />
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
                  className="rounded border border-slate-700/50 bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-400"
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
                    : "text-slate-600 hover:text-amber-400",
                )}
              />
            </button>
          </div>

          {/* Code block — click to copy */}
          <button
            onClick={() => handleCopy()}
            className={cn(
              "group/code relative w-full px-3 py-2.5 text-left focus:outline-none",
              isDone && "line-through decoration-slate-600 decoration-1",
            )}
            title={
              mode === "engagement" ? "Click to copy rendered command" : "Click to copy template"
            }
          >
            <div
              className={cn(
                "font-mono text-[12.5px] leading-relaxed break-all whitespace-pre-wrap text-slate-100",
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
                <div className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800/90 px-1.5 py-0.5">
                  <Copy size={10} className="text-slate-400" />
                  <span className="text-[9px] font-medium text-slate-400">
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
                  "text-[11.5px] leading-snug text-slate-400",
                  isDone && "line-through decoration-slate-600",
                )}
              >
                {description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 border-t border-slate-800/70 bg-slate-950/40 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {mode === "engagement" && variables.length > 0 && renderedText !== template && (
              <button
                onClick={() => handleCopy(template)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                title="Copy original template with $VARS"
              >
                <Copy size={11} />
                Template
              </button>
            )}
            <button
              onClick={() => handleCopy()}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors",
                copied
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              )}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : mode === "engagement" ? "Copy Resolved" : "Copy"}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <Edit3 size={11} />
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this command?")) deletePlaybookItem(containerId, item.id);
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
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
