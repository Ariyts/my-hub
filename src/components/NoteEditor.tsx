import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useStore } from "../store";
import { useIsMobile } from "../hooks/useIsMobile";
import type { NoteItem } from "../types";
import {
  Save,
  Trash2,
  Star,
  StarOff,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Tag,
  Bold,
  Italic,
  Code,
  Code2,
  Link,
  List,
  Quote,
  Heading1,
  Heading2,
  Strikethrough,
  CheckSquare,
  Table,
  Minus,
  ListTree,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import hljs from "highlight.js/lib/common";

interface Props {
  note: NoteItem;
}

export function NoteEditor({ note }: Props) {
  const { updateNote, deleteNote, isDarkTheme } = useStore();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [previewMode, setPreviewMode] = useState<"edit" | "split" | "preview">("split");

  const isMobile = useIsMobile();
  // Режим «split» по умолчанию: на телефоне это две колонки по ~180px — читать
  // и редактировать в них невозможно, поэтому там показываем одну панель
  const viewMode = isMobile && previewMode === "split" ? "edit" : previewMode;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const handleSave = useCallback(() => {
    updateNote(note.id, { title, content });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [note.id, title, content, updateNote]);

  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      updateNote(note.id, { title, content });
    }, 3000);
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [title, content, note.id, updateNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  const insertText = (before: string, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const addTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      updateNote(note.id, { tags: [...note.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tag) });
  };

  const toolbarButtons = [
    { icon: <Heading1 size={14} />, action: () => insertText("# "), title: "Heading 1" },
    { icon: <Heading2 size={14} />, action: () => insertText("## "), title: "Heading 2" },
    { icon: <Bold size={14} />, action: () => insertText("**", "**"), title: "Bold (Ctrl+B)" },
    { icon: <Italic size={14} />, action: () => insertText("*", "*"), title: "Italic (Ctrl+I)" },
    { icon: <Strikethrough size={14} />, action: () => insertText("~~", "~~"), title: "Strikethrough" },
    { icon: <Code size={14} />, action: () => insertText("`", "`"), title: "Inline Code" },
    { icon: <Code2 size={14} />, action: () => insertText("```\n", "\n```"), title: "Code block" },
    { icon: <Link size={14} />, action: () => insertText("[", "](url)"), title: "Link" },
    { icon: <List size={14} />, action: () => insertText("- "), title: "List" },
    { icon: <CheckSquare size={14} />, action: () => insertText("- [ ] "), title: "Checklist item" },
    { icon: <Quote size={14} />, action: () => insertText("> "), title: "Quote" },
    {
      icon: <Table size={14} />,
      action: () => insertText("| Column 1 | Column 2 |\n| --- | --- |\n| Cell | Cell |\n"),
      title: "Table",
    },
    { icon: <Minus size={14} />, action: () => insertText("\n---\n"), title: "Divider" },
  ];

  const bg = isDarkTheme ? "#0f172a" : "#ffffff";
  const border = isDarkTheme ? "#1e293b" : "#e2e8f0";
  const textColor = isDarkTheme ? "#e2e8f0" : "#1e293b";
  const mutedColor = isDarkTheme ? "#64748b" : "#94a3b8";
  const toolbarBg = isDarkTheme ? "#1e293b" : "#f8fafc";

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Оглавление (TOC): заголовки #/##/### вне блоков кода
  const headings = useMemo(() => {
    const out: { level: number; text: string; line: number }[] = [];
    let inCode = false;
    content.split("\n").forEach((line, i) => {
      if (line.trim().startsWith("```")) {
        inCode = !inCode;
        return;
      }
      if (inCode) return;
      const m = /^(#{1,3})\s+(.+)$/.exec(line);
      if (m) out.push({ level: m[1].length, text: m[2].trim(), line: i });
    });
    return out;
  }, [content]);

  const goToHeading = (line: number, index: number) => {
    // В режимах с превью — листаем превью к N-му заголовку (порядок совпадает с TOC)
    if (viewMode !== "edit" && previewRef.current) {
      const els = previewRef.current.querySelectorAll("h1, h2, h3");
      els[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Иначе — прокрутка textarea к строке
    const ta = textareaRef.current;
    if (ta) {
      const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 20;
      ta.scrollTop = Math.max(0, (line - 1) * lineHeight);
      const pos = content.split("\n").slice(0, line).join("\n").length + 1;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    }
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: bg,
        position: isFullscreen ? "fixed" : "relative",
        inset: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 100 : "auto",
      }}
    >
      {/* Title bar */}
      <div className="border-b px-3 pt-3 pb-3 sm:px-6 sm:pt-5" style={{ borderColor: border }}>
        <div className="mb-3 flex flex-wrap items-start gap-2 sm:gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent text-xl font-bold outline-none sm:text-2xl"
            style={{ color: textColor }}
            placeholder="Note title..."
          />
          <div className="mt-1 flex shrink-0 items-center gap-2">
            <button
              onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {note.isFavorite ? (
                <Star size={16} className="fill-amber-400 text-amber-400" />
              ) : (
                <StarOff size={16} style={{ color: mutedColor }} />
              )}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: saved ? "#4CAF5020" : "#4CAF5015",
                color: saved ? "#4CAF50" : "#6b7280",
              }}
            >
              <Save size={14} />
              {saved ? "Saved!" : "Save"}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isFullscreen ? (
                <Minimize2 size={16} style={{ color: mutedColor }} />
              ) : (
                <Maximize2 size={16} style={{ color: mutedColor }} />
              )}
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this note?")) deleteNote(note.id);
              }}
              className="rounded-lg p-1.5 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs" style={{ color: mutedColor }}>
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag size={12} style={{ color: mutedColor }} />
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium hover:bg-red-50"
                style={{ background: isDarkTheme ? "#1e293b" : "#f1f5f9", color: "#64748b" }}
                onClick={() => removeTag(tag)}
                title="Remove tag"
              >
                {tag} ×
              </span>
            ))}
            {showTagInput ? (
              <input
                autoFocus
                className="w-24 rounded-full border px-2 py-0.5 text-xs outline-none"
                style={{ borderColor: "#4CAF50", background: "transparent", color: textColor }}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTag();
                  if (e.key === "Escape") setShowTagInput(false);
                }}
                onBlur={() => {
                  addTag();
                  setShowTagInput(false);
                }}
                placeholder="tag name..."
              />
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="rounded-full border border-dashed px-2 py-0.5 text-xs transition-colors hover:border-green-400"
                style={{ borderColor: mutedColor, color: mutedColor }}
              >
                + tag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar. На узком экране кнопки переносятся, а не обрезаются */}
      <div
        className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5 sm:px-4"
        style={{ background: toolbarBg, borderColor: border }}
      >
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            title={btn.title}
            className="rounded p-1.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
            style={{ color: mutedColor }}
          >
            {btn.icon}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowToc((v) => !v)}
          title="Table of contents"
          disabled={headings.length === 0}
          className="mr-1 rounded p-1.5 transition-colors hover:bg-slate-200 disabled:opacity-40 dark:hover:bg-slate-700"
          style={{ color: showToc && headings.length ? "#4CAF50" : mutedColor }}
        >
          <ListTree size={14} />
        </button>
        <span className="mr-2 hidden text-xs whitespace-nowrap sm:inline" style={{ color: mutedColor }}>
          {wordCount} words · {content.length} chars
        </span>
        <div
          className="flex items-center overflow-hidden rounded-lg border"
          style={{ borderColor: border }}
        >
          {[
            { mode: "edit" as const, icon: <Edit3 size={12} />, label: "Edit" },
            {
              mode: "split" as const,
              icon: (
                <div className="flex gap-0.5">
                  <div className="h-3 w-2 rounded-sm border border-current" />
                  <div className="h-3 w-2 rounded-sm border border-current" />
                </div>
              ),
              label: "Split",
            },
            { mode: "preview" as const, icon: <Eye size={12} />, label: "Preview" },
          ]
            // Кнопку «split» на мобильном не показываем: этот режим там всё равно
            // сводится к «edit», и активная, но ничего не меняющая кнопка сбивала бы с толку
            .filter(({ mode }) => !(isMobile && mode === "split"))
            .map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium transition-colors"
                style={{
                  background: viewMode === mode ? "#4CAF5020" : "transparent",
                  color: viewMode === mode ? "#4CAF50" : mutedColor,
                }}
                title={label}
              >
                {icon}
              </button>
            ))}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Оглавление (TOC) — панель слева; на мобильном поверх контента */}
        {showToc && headings.length > 0 && (
          <div
            className="absolute inset-y-0 left-0 z-20 w-56 shrink-0 overflow-y-auto border-r p-2 sm:relative sm:z-auto"
            style={{ borderColor: border, background: toolbarBg }}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase" style={{ color: mutedColor }}>
                Contents
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="rounded p-0.5 hover:bg-slate-500/20"
                title="Close"
              >
                <X size={12} style={{ color: mutedColor }} />
              </button>
            </div>
            <ul className="space-y-0.5">
              {headings.map((h, i) => (
                <li key={i}>
                  <button
                    onClick={() => goToHeading(h.line, i)}
                    className="block w-full truncate rounded px-2 py-1 text-left text-xs transition-colors hover:bg-slate-500/10"
                    style={{
                      paddingLeft: `${(h.level - 1) * 12 + 8}px`,
                      color: h.level === 1 ? textColor : mutedColor,
                    }}
                    title={h.text}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(viewMode === "edit" || viewMode === "split") && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
                const k = e.key.toLowerCase();
                if (k === "b") {
                  e.preventDefault();
                  insertText("**", "**");
                } else if (k === "i") {
                  e.preventDefault();
                  insertText("*", "*");
                }
              }
            }}
            className="flex-1 resize-none p-3 font-mono text-sm leading-relaxed outline-none sm:p-6"
            style={{
              background: bg,
              color: textColor,
              borderRight: viewMode === "split" ? `1px solid ${border}` : "none",
              fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
            }}
            placeholder="Write your note in Markdown..."
            spellCheck={false}
          />
        )}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto px-3 py-4 sm:px-8 sm:py-6"
            style={{ background: bg }}
          >
            <div className="prose prose-sm max-w-none" style={{ color: textColor }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ children }) => (
                    <h1
                      style={{
                        color: textColor,
                        borderBottom: `2px solid ${border}`,
                        paddingBottom: "8px",
                      }}
                      className="mb-4 text-2xl font-bold"
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ color: textColor }} className="mt-6 mb-3 text-xl font-bold">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ color: textColor }} className="mt-5 mb-2 text-lg font-semibold">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ color: textColor }} className="mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      const lang = (className || "").replace(/language-/, "").trim();
                      const raw = String(children).replace(/\n$/, "");
                      let html: string;
                      try {
                        html = hljs.getLanguage(lang)
                          ? hljs.highlight(raw, { language: lang }).value
                          : hljs.highlightAuto(raw).value;
                      } catch {
                        html = hljs.highlightAuto(raw).value;
                      }
                      return (
                        <code
                          className="hljs block overflow-x-auto rounded-lg border p-4 font-mono text-sm"
                          style={{ background: "var(--bg-elevated)", borderColor: border }}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    }
                    return (
                      <code
                        className="rounded px-1.5 py-0.5 font-mono text-sm"
                        style={{
                          background: isDarkTheme ? "#1e293b" : "#f1f5f9",
                          color: "#ef4444",
                        }}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <pre className="mb-4 overflow-x-auto">{children}</pre>,
                  ul: ({ children }) => (
                    <ul style={{ color: textColor }} className="mb-3 list-disc space-y-1 pl-5">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ color: textColor }} className="mb-3 list-decimal space-y-1 pl-5">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li style={{ color: textColor }}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote
                      className="my-3 border-l-4 pl-4 italic"
                      style={{ borderColor: "#4CAF50", color: mutedColor }}
                    >
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ color: textColor }} className="font-bold">
                      {children}
                    </strong>
                  ),
                  table: ({ children }) => (
                    <table
                      style={{ borderColor: border }}
                      className="mb-4 w-full border-collapse border text-sm"
                    >
                      {children}
                    </table>
                  ),
                  th: ({ children }) => (
                    <th
                      style={{ borderColor: border, background: toolbarBg, color: textColor }}
                      className="border px-3 py-2 text-left font-semibold"
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td
                      style={{ borderColor: border, color: textColor }}
                      className="border px-3 py-2"
                    >
                      {children}
                    </td>
                  ),
                  input: ({ type, checked }) =>
                    type === "checkbox" ? (
                      <input type="checkbox" checked={checked} readOnly className="mr-2" />
                    ) : null,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
