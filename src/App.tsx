import { useEffect, useRef } from "react";
import { useStore } from "./store";
import { useIsMobile } from "./hooks/useIsMobile";
import { Sidebar } from "./components/Sidebar";
import { FolderPanel } from "./components/FolderPanel";
import { NoteEditor } from "./components/NoteEditor";
import { CommandsView } from "./components/CommandsView";
import { LinksView } from "./components/LinksView";
import { PromptsView } from "./components/PromptsView";
import { PlaybookView } from "./components/PlaybookView";
import { SettingsModal } from "./components/SettingsModal";
import { TrashModal } from "./components/TrashModal";
import type { NoteItem, CommandContainer, PromptContainer, PlaybookContainer } from "./types";
import { FileText, Plus, Menu, FolderOpen } from "lucide-react";

function MainArea() {
  const { activeItemId, notes, commands, links, prompts, playbooks, activeCategoryId, categories } =
    useStore();

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const baseType = activeCategory?.baseType || "notes";
  const typeColor = activeCategory?.color || "#4CAF50";

  // Получаем текущий активный файл/контейнер
  const getActiveFile = (): { id: string; title: string; data: any } | null => {
    if (!activeItemId) return null;

    switch (baseType) {
      case "notes": {
        const note = notes.find((n) => n.id === activeItemId);
        return note ? { id: note.id, title: note.title, data: note } : null;
      }
      case "commands": {
        const cmd = commands.find((c) => c.id === activeItemId);
        return cmd ? { id: cmd.id, title: cmd.title, data: cmd } : null;
      }
      case "links": {
        const link = links.find((l) => l.id === activeItemId);
        return link ? { id: link.id, title: link.title, data: link } : null;
      }
      case "prompts": {
        const prompt = prompts.find((p) => p.id === activeItemId);
        return prompt ? { id: prompt.id, title: prompt.title, data: prompt } : null;
      }
      case "playbooks": {
        const playbook = playbooks.find((pb) => pb.id === activeItemId);
        return playbook ? { id: playbook.id, title: playbook.title, data: playbook } : null;
      }
      default:
        return null;
    }
  };

  const activeFile = getActiveFile();

  // Рендерим в зависимости от типа и выбранного файла
  if (baseType === "notes") {
    if (activeFile?.data) {
      return <NoteEditor note={activeFile.data as NoteItem} />;
    }
    // Показываем плейсхолдер когда нет выбранного файла
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface">
          <FileText size={36} style={{ color: typeColor, opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="mb-1 text-lg font-semibold text-foreground">
            No file selected
          </p>
          <p className="text-sm text-muted">
            Select a file from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  if (baseType === "commands") {
    if (activeFile?.data) {
      return <CommandsView container={activeFile.data as CommandContainer} />;
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface">
          <FileText size={36} style={{ color: typeColor, opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="mb-1 text-lg font-semibold text-foreground">
            No command file selected
          </p>
          <p className="text-sm text-muted">
            Select a file from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  if (baseType === "links") {
    if (activeFile?.data) {
      // Передаём ID контейнера для reactive updates
      return <LinksView containerId={activeFile.data.id} />;
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface">
          <FileText size={36} className="text-links opacity-60" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-lg font-semibold text-foreground">
            No link file selected
          </p>
          <p className="text-sm text-muted">
            Select a file from the sidebar to view its links
          </p>
        </div>
      </div>
    );
  }

  if (baseType === "prompts") {
    if (activeFile?.data) {
      return <PromptsView container={activeFile.data as PromptContainer} />;
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface">
          <FileText size={36} className="text-prompts opacity-60" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-lg font-semibold text-foreground">
            No prompt file selected
          </p>
          <p className="text-sm text-muted">
            Select a file from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  if (baseType === "playbooks") {
    if (activeFile?.data) {
      return <PlaybookView container={activeFile.data as PlaybookContainer} />;
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface">
          <FileText size={36} className="text-playbooks opacity-60" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-lg font-semibold text-foreground">
            No playbook selected
          </p>
          <p className="text-sm text-muted">
            Select a service from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Шапка контентной области на мобильном: кнопка вызова панели папок
 * и название текущей категории — чтобы было понятно, где находишься
 */
function MobileTopBar() {
  const {
    categories,
    activeCategoryId,
    isFolderPanelOpen,
    isSidebarOpen,
    toggleFolderPanel,
    toggleSidebar,
  } = useStore();

  const sidebarButtonRef = useRef<HTMLButtonElement>(null);
  const folderButtonRef = useRef<HTMLButtonElement>(null);
  const wasSidebarOpen = useRef(false);
  const wasFolderOpen = useRef(false);

  // Панель закрылась — возвращаем фокус на кнопку, которой её открывали
  useEffect(() => {
    if (wasSidebarOpen.current && !isSidebarOpen) sidebarButtonRef.current?.focus();
    wasSidebarOpen.current = isSidebarOpen;
  }, [isSidebarOpen]);

  useEffect(() => {
    if (wasFolderOpen.current && !isFolderPanelOpen) folderButtonRef.current?.focus();
    wasFolderOpen.current = isFolderPanelOpen;
  }, [isFolderPanelOpen]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  // 44×44 — минимальный размер тач-цели по рекомендациям Apple и Material Design
  const buttonClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700";

  return (
    <div
      className="flex items-center gap-1 border-b border-border bg-background px-2 py-2"
      style={{ paddingTop: "calc(var(--safe-top) + 0.5rem)" }}
    >
      <button
        ref={sidebarButtonRef}
        onClick={toggleSidebar}
        aria-label="Open categories panel"
        aria-expanded={isSidebarOpen}
        title="Categories"
        className={buttonClass}
      >
        <Menu size={22} className="text-foreground" />
      </button>

      <button
        ref={folderButtonRef}
        onClick={toggleFolderPanel}
        aria-label="Open folders panel"
        aria-expanded={isFolderPanelOpen}
        title="Folders"
        className={buttonClass}
        // Без выбранной категории показывать нечего
        disabled={!activeCategoryId}
        style={{ opacity: activeCategoryId ? 1 : 0.4 }}
      >
        <FolderOpen size={20} className="text-foreground" />
      </button>

      <span
        className="truncate text-sm font-bold tracking-wider uppercase"
        style={{ color: activeCategory?.color || "var(--text-muted)" }}
      >
        {activeCategory?.name || "Knowledge Hub"}
      </span>
    </div>
  );
}

export function App() {
  const { isDarkTheme, showSettings, workspaces, activeWorkspaceId, settings } = useStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.style.background = "#0f172a";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.style.background = "#ffffff";
    }
  }, [isDarkTheme]);

  // Пробрасываем настройки шрифта в CSS-токены (--app-font-size / --font-code),
  // чтобы settings.fontSize и settings.codeFont стали рабочими. Компоненты
  // читают токены по мере перевода на дизайн-систему (шаг 0.B.4+).
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-font-size", `${settings.fontSize}px`);
    root.style.setProperty(
      "--font-code",
      `"${settings.codeFont}", "Cascadia Code", "JetBrains Mono", monospace`,
    );
  }, [settings.fontSize, settings.codeFont]);

  // Show workspace selector if no workspace is active
  if (!activeWorkspaceId || workspaces.length === 0) {
    return (
      <div
        className="flex h-dvh items-center justify-center"
        style={{ background: isDarkTheme ? "#0f172a" : "#f8fafc" }}
      >
        <div className="text-center">
          <div className="mb-6 text-6xl">📚</div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Knowledge Hub</h1>
          <p className="mb-6 text-sm text-muted">Create your first workspace to get started</p>
          <button
            onClick={() =>
              useStore
                .getState()
                .addWorkspace({ name: "My Workspace", icon: "🏠", color: "#6366f1" })
            }
            className="rounded-xl px-6 py-3 font-medium transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}
          >
            <Plus size={18} className="mr-2 inline" />
            Create Workspace
          </button>
        </div>
        {showSettings && <SettingsModal />}
      </div>
    );
  }

  return (
    <div className="font-ui flex h-dvh overflow-hidden bg-background">
      {/* Sidebar - Categories */}
      <Sidebar />

      {/* Folder Panel: на мобильном — выдвижная панель поверх контента */}
      <FolderPanel />

      {/* Main Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {isMobile && <MobileTopBar />}
        <div className="min-h-0 flex-1 overflow-hidden">
          <MainArea />
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && <SettingsModal />}

      {/* Trash Modal */}
      <TrashModal />
    </div>
  );
}
