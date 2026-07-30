import { useState, useRef } from "react";
import { useStore } from "../store";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMobileDrawer } from "../hooks/useMobileDrawer";
import { useLongPress } from "../hooks/useLongPress";
import type { Folder, BaseDataType } from "../types";
import {
  FolderOpen,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  FileText,
  Terminal,
  Link2,
  MessageSquare,
  BookOpen,
  Star,
  Edit2,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";

const BASE_TYPE_ICONS: Record<
  BaseDataType,
  React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>
> = {
  notes: FileText,
  commands: Terminal,
  links: Link2,
  prompts: MessageSquare,
  playbooks: BookOpen,
};

interface FolderItemProps {
  folder: Folder;
  depth: number;
  activeItemId: string | null;
  onSelectFile: (id: string) => void;
  onAddFileToFolder: (folderId: string) => void;
  onAddSubfolder: (parentId: string) => void;
}

function FolderItem({
  folder,
  depth,
  activeItemId,
  onSelectFile,
  onAddFileToFolder,
  onAddSubfolder,
}: FolderItemProps) {
  const {
    activeCategoryId,
    categories,
    folders,
    notes,
    commands,
    links,
    prompts,
    playbooks,
    toggleFolderExpanded,
    updateFolder,
    deleteFolder,
    updateNote,
    deleteNote,
    updateCommandContainer,
    deleteCommandContainer,
    updateLinkContainer,
    deleteLinkContainer,
    updatePromptContainer,
    deletePromptContainer,
    updatePlaybookContainer,
    deletePlaybookContainer,
  } = useStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: "folder" | "file";
    itemId?: string;
  } | null>(null);
  const [renaming, setRenaming] = useState<{ type: "folder" | "file"; itemId?: string } | null>(
    null,
  );
  const [newName, setNewName] = useState(folder.name);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const baseType = activeCategory?.baseType || "notes";
  const typeColor = activeCategory?.color || "#4CAF50";
  const TypeIcon = BASE_TYPE_ICONS[baseType];

  // Get child folders
  const childFolders = folders
    .filter((f) => f.parentId === folder.id)
    .sort((a, b) => a.order - b.order);

  // Куда можно перенести файл из этой папки
  const otherFolders = folders
    .filter((f) => f.categoryId === activeCategoryId && f.id !== folder.id)
    .sort((a, b) => a.order - b.order);

  // Get files in this folder (sorted by order)
  const getFiles = () => {
    const sortByOrder = (items: any[]) =>
      [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    switch (baseType) {
      case "notes":
        // Подстраницы (с существующим родителем) в список папки не выводим —
        // к ним попадают через родительскую заметку
        return sortByOrder(
          notes.filter(
            (n) =>
              n.folderId === folder.id &&
              !(n.parentNoteId && notes.some((p) => p.id === n.parentNoteId)),
          ),
        );
      case "commands":
        return sortByOrder(commands.filter((c) => c.folderId === folder.id));
      case "links":
        return sortByOrder(links.filter((l) => l.folderId === folder.id));
      case "prompts":
        return sortByOrder(prompts.filter((p) => p.folderId === folder.id));
      case "playbooks":
        return sortByOrder(playbooks.filter((pb) => pb.folderId === folder.id));
    }
  };

  const files = getFiles();

  const handleContextMenu = (e: React.MouseEvent, type: "folder" | "file", itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, itemId });
  };

  // Какой именно файл удерживают: обработчики общие для всех строк списка
  const longPressFileId = useRef<string | undefined>(undefined);

  // На тач-экранах правого клика нет — те же меню открываются долгим нажатием
  const folderLongPress = useLongPress((x, y) => setContextMenu({ x, y, type: "folder" }));
  const fileLongPress = useLongPress((x, y) =>
    setContextMenu({ x, y, type: "file", itemId: longPressFileId.current }),
  );

  const handleRenameFolder = () => {
    if (newName.trim()) updateFolder(folder.id, { name: newName.trim() });
    setRenaming(null);
    setContextMenu(null);
  };

  const handleRenameFile = (itemId: string) => {
    if (newName.trim()) {
      switch (baseType) {
        case "notes":
          updateNote(itemId, { title: newName.trim() });
          break;
        case "commands":
          updateCommandContainer(itemId, { title: newName.trim() });
          break;
        case "links":
          updateLinkContainer(itemId, { title: newName.trim() });
          break;
        case "prompts":
          updatePromptContainer(itemId, { title: newName.trim() });
          break;
        case "playbooks":
          updatePlaybookContainer(itemId, { title: newName.trim() });
          break;
      }
    }
    setRenaming(null);
    setContextMenu(null);
  };

  const handleDeleteFile = (itemId: string) => {
    switch (baseType) {
      case "notes":
        deleteNote(itemId);
        break;
      case "commands":
        deleteCommandContainer(itemId);
        break;
      case "links":
        deleteLinkContainer(itemId);
        break;
      case "prompts":
        deletePromptContainer(itemId);
        break;
      case "playbooks":
        deletePlaybookContainer(itemId);
        break;
    }
    setContextMenu(null);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, file: any) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: file.id,
        folderId: file.folderId,
        title: file.title,
      }),
    );
  };

  const handleDragOver = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(targetFolderId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  // Перенос файла в другую папку. Мышью — перетаскиванием, пальцем — пунктом меню:
  // HTML5 drag-and-drop на тач-экранах не работает
  const moveFileToFolder = (fileId: string, targetFolderId: string) => {
    switch (baseType) {
      case "notes":
        updateNote(fileId, { folderId: targetFolderId });
        break;
      case "commands":
        updateCommandContainer(fileId, { folderId: targetFolderId });
        break;
      case "links":
        updateLinkContainer(fileId, { folderId: targetFolderId });
        break;
      case "prompts":
        updatePromptContainer(fileId, { folderId: targetFolderId });
        break;
      case "playbooks":
        updatePlaybookContainer(fileId, { folderId: targetFolderId });
        break;
    }
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data && data.folderId !== targetFolderId) {
        moveFileToFolder(data.id, targetFolderId);
      }
    } catch (err) {
      console.error("Drop failed:", err);
    }
    setDropTarget(null);
  };

  const startRenameFile = (itemId: string, currentTitle: string) => {
    setNewName(currentTitle);
    setRenaming({ type: "file", itemId });
    setContextMenu(null);
  };

  return (
    <div
      onDragOver={(e) => handleDragOver(e, folder.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, folder.id)}
      className={dropTarget === folder.id ? "mx-1 rounded-lg bg-primary/10" : ""}
    >
      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 min-w-[140px] rounded-lg border border-border bg-surface py-1 shadow-xl"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            {contextMenu.type === "folder" ? (
              <>
                <button
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-sunken"
                  onClick={() => {
                    setNewName(folder.name);
                    setRenaming({ type: "folder" });
                    setContextMenu(null);
                  }}
                >
                  <Edit2 size={12} /> Rename
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-sunken"
                  onClick={() => {
                    onAddSubfolder(folder.id);
                    setContextMenu(null);
                  }}
                >
                  <Plus size={12} /> Add Subfolder
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
                  onClick={() => {
                    deleteFolder(folder.id);
                    setContextMenu(null);
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-sunken"
                  onClick={() => {
                    const file = files.find((f) => f.id === contextMenu.itemId);
                    if (file) startRenameFile(file.id, file.title);
                  }}
                >
                  <Edit2 size={12} /> Rename
                </button>

                {/* Перенос в другую папку: пальцем файл не перетащишь */}
                {otherFolders.length > 0 && (
                  <>
                    <div className="mt-1 border-t border-border px-3 pt-1.5 pb-1 text-[10px] tracking-wider text-subtle uppercase">
                      Move to folder
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {otherFolders.map((target) => (
                        <button
                          key={target.id}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-sunken"
                          onClick={() => {
                            if (contextMenu.itemId) moveFileToFolder(contextMenu.itemId, target.id);
                            setContextMenu(null);
                          }}
                        >
                          <FolderOpen size={12} className="shrink-0 text-subtle" />
                          <span className="truncate">{target.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 border-t border-border" />
                  </>
                )}

                <button
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
                  onClick={() => contextMenu.itemId && handleDeleteFile(contextMenu.itemId)}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Folder row - КЛИК ТОЛЬКО РАСКРЫВАЕТ/СВОРАЧИВАЕТ */}
      <div
        className="group mx-1 flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 transition-all duration-150"
        style={{
          paddingLeft: `${10 + depth * 14}px`,
        }}
        onClick={() => toggleFolderExpanded(folder.id)} // ИЗМЕНЕНО: только toggle
        onContextMenu={(e) => handleContextMenu(e, "folder")}
        {...folderLongPress}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFolderExpanded(folder.id);
          }}
          className="flex-shrink-0 rounded p-0.5 hover:bg-sunken"
        >
          {folder.isExpanded ? (
            <ChevronDown size={12} className="text-subtle" />
          ) : (
            <ChevronRight size={12} className="text-subtle" />
          )}
        </button>
        <span className="text-sm">{folder.icon || (folder.isExpanded ? "📂" : "📁")}</span>

        {renaming?.type === "folder" ? (
          <input
            className="flex-1 border-b border-border bg-transparent text-sm text-foreground outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRenameFolder}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameFolder();
              if (e.key === "Escape") setRenaming(null);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 truncate text-sm font-medium text-foreground">{folder.name}</span>
        )}

        <span className="rounded-full bg-sunken px-1.5 py-0.5 text-[10px] font-medium text-subtle">
          {files.length}
        </span>

        {/* Add file button */}
        <button
          className="tap-target rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-sunken"
          onClick={(e) => {
            e.stopPropagation();
            onAddFileToFolder(folder.id);
          }}
          title="Add file"
          aria-label="Add file to folder"
        >
          <Plus size={12} style={{ color: typeColor }} />
        </button>

        {/* More options */}
        <button
          className="tap-target rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-sunken"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e, "folder");
          }}
        >
          <MoreVertical size={12} className="text-subtle" />
        </button>
      </div>

      {/* Child folders */}
      {folder.isExpanded &&
        childFolders.map((childFolder) => (
          <FolderItem
            key={childFolder.id}
            folder={childFolder}
            depth={depth + 1}
            activeItemId={activeItemId}
            onSelectFile={onSelectFile}
            onAddFileToFolder={onAddFileToFolder}
            onAddSubfolder={onAddSubfolder}
          />
        ))}

      {/* Files inside folder - КЛИК ОТКРЫВАЕТ ФАЙЛ */}
      {folder.isExpanded &&
        files.map((file) => {
          const isFileActive = activeItemId === file.id;
          const isRenamingThis = renaming?.type === "file" && renaming.itemId === file.id;

          return (
            <div
              key={file.id}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              className="group/file mx-1 flex cursor-pointer items-center gap-1.5 rounded-lg transition-all duration-150"
              style={{
                paddingLeft: `${26 + depth * 14}px`,
                paddingRight: "6px",
                paddingTop: "4px",
                paddingBottom: "4px",
                background: isFileActive ? `${typeColor}22` : "transparent",
                border: isFileActive ? `1px solid ${typeColor}50` : "1px solid transparent",
              }}
              onClick={() => onSelectFile(file.id)} // ИЗМЕНЕНО: открывает файл
              onContextMenu={(e) => handleContextMenu(e, "file", file.id)}
              {...fileLongPress}
              onPointerDown={(e) => {
                longPressFileId.current = file.id;
                fileLongPress.onPointerDown(e);
              }}
            >
              {/* Drag handle */}
              <div className="cursor-grab opacity-0 group-hover/file:opacity-30">
                <GripVertical size={10} className="text-subtle" />
              </div>

              <TypeIcon size={11} style={{ color: typeColor, flexShrink: 0 }} />

              {isRenamingThis ? (
                <input
                  className="flex-1 border-b border-border bg-transparent text-xs text-foreground outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleRenameFile(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameFile(file.id);
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="flex-1 truncate text-xs"
                  style={{ color: isFileActive ? typeColor : "var(--text-muted)" }}
                >
                  {file.title}
                </span>
              )}

              {"isFavorite" in file && file.isFavorite && (
                <Star size={9} className="fill-amber-400 text-amber-400" />
              )}

              {/* Edit/Delete buttons */}
              <button
                className="tap-target rounded p-0.5 opacity-0 transition-opacity group-hover/file:opacity-100 hover:bg-sunken"
                onClick={(e) => {
                  e.stopPropagation();
                  startRenameFile(file.id, file.title);
                }}
                title="Rename"
                aria-label="Rename file"
              >
                <Edit2 size={10} className="text-subtle hover:text-foreground" />
              </button>
              <button
                className="tap-target rounded p-0.5 opacity-0 transition-opacity group-hover/file:opacity-100 hover:bg-danger/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
                title="Delete"
                aria-label="Delete file"
              >
                <Trash2 size={10} className="text-subtle hover:text-danger" />
              </button>
            </div>
          );
        })}
    </div>
  );
}

export function FolderPanel() {
  const {
    activeCategoryId,
    categories,
    folders,
    searchQuery,
    setSearchQuery,
    activeItemId,
    setActiveItemId,
    addFolder,
    addNote,
    addCommandContainer,
    addLinkContainer,
    addPromptContainer,
    addPlaybookContainer,
    isFolderPanelOpen,
    closeMobilePanels,
  } = useStore();

  const isMobile = useIsMobile();

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const isAddingFolderRef = useRef(false);

  // Esc, блокировка прокрутки фона, фокус в панели, закрытие свайпом
  const { panelRef, swipeHandlers } = useMobileDrawer(
    isMobile,
    isFolderPanelOpen,
    closeMobilePanels,
  );

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const baseType = activeCategory?.baseType || "notes";
  const typeColor = activeCategory?.color || "#4CAF50";
  const categoryName = activeCategory?.name || "Select Category";

  // Get root folders for current category
  const categoryFolders = folders
    .filter((f) => f.categoryId === activeCategoryId && f.parentId === null)
    .sort((a, b) => a.order - b.order);

  const handleAddFolder = (parentId: string | null = null) => {
    if (isAddingFolderRef.current) return;
    if (newFolderName.trim()) {
      isAddingFolderRef.current = true;
      addFolder({
        name: newFolderName.trim(),
        categoryId: activeCategoryId!,
        parentId,
        isExpanded: true,
      });
      setNewFolderName("");
      setShowNewFolder(false);
      // Reset guard after event loop completes
      setTimeout(() => {
        isAddingFolderRef.current = false;
      }, 0);
    }
  };

  const handleAddFile = (folderId: string) => {
    switch (baseType) {
      case "notes":
        addNote({
          folderId,
          title: "New Note",
          content: "# New Note\n\nStart writing...",
          tags: [],
          isFavorite: false,
          type: "notes",
        });
        break;
      case "commands":
        addCommandContainer({
          folderId,
          title: "New Commands",
          subItems: [],
          tags: [],
          type: "commands",
          isExpanded: true,
        });
        break;
      case "links":
        addLinkContainer({
          folderId,
          title: "New Links",
          subItems: [],
          tags: [],
          type: "links",
          isExpanded: true,
        });
        break;
      case "prompts":
        addPromptContainer({
          folderId,
          title: "New Prompts",
          subItems: [],
          tags: [],
          category: "General",
          type: "prompts",
          isExpanded: true,
        });
        break;
      case "playbooks":
        addPlaybookContainer({
          folderId,
          title: "New Service",
          description: "",
          subItems: [],
          tags: [],
          type: "playbooks",
          isExpanded: true,
        });
        break;
    }
  };

  // ИЗМЕНЕНО: handleSelectFolder удалён, так как папка только раскрывается
  // handleSelectFile теперь открывает файл на просмотр
  const handleSelectFile = (itemId: string) => {
    setActiveItemId(itemId);
    // Иначе выбранный файл останется за открытой панелью
    if (isMobile) closeMobilePanels();
  };

  const filteredFolders = categoryFolders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Категория не выбрана. На мобильном заглушка-колонка бессмысленна:
  // панели там нет в потоке, и место занимать нечем — пусто место отдаём контенту
  if (!activeCategoryId) {
    if (isMobile) return null;
    return (
      <div
        className="flex h-full flex-col items-center justify-center border-r border-border bg-surface"
        style={{
          width: "260px",
          minWidth: "260px",
        }}
      >
        <div className="mb-3 text-4xl">👈</div>
        <p className="text-sm text-muted">Select a category</p>
      </div>
    );
  }

  // На десктопе — обычная колонка в потоке.
  // На мобильном — выдвижная панель поверх контента (анимация через transform: она
  // идёт на GPU и не дёргается на слабых телефонах, в отличие от анимации width).
  // Цвет фона/границы — через токены (bg-surface / border-border на элементе).
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 40,
        width: "min(85vw, 320px)",
        paddingTop: "var(--safe-top)",
        paddingBottom: "var(--safe-bottom)",
        transform: isFolderPanelOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease-out",
        boxShadow: isFolderPanelOpen ? "0 0 24px rgba(0, 0, 0, 0.35)" : "none",
      }
    : {
        width: "260px",
        minWidth: "260px",
      };

  const isHidden = isMobile && !isFolderPanelOpen;

  return (
    <>
      {/* Затемнение фона: клик по нему закрывает панель */}
      {isMobile && isFolderPanelOpen && (
        <div
          onClick={closeMobilePanels}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/50"
        />
      )}

      <div
        ref={panelRef}
        tabIndex={-1}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile && isFolderPanelOpen ? true : undefined}
        aria-label={isMobile ? "Folders" : undefined}
        aria-hidden={isHidden || undefined}
        {...swipeHandlers}
        className={`flex h-full flex-col border-r border-border bg-surface outline-none ${isHidden ? "pointer-events-none" : ""}`}
        style={panelStyle}
      >
        {/* Header */}
        <div className="border-b border-border px-4 pt-4 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: typeColor }}>
              {categoryName}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (categoryFolders.length > 0) {
                    handleAddFile(categoryFolders[0].id);
                  }
                }}
                title="New File"
                className="rounded-lg p-1.5 transition-colors hover:bg-sunken"
                style={{ background: `${typeColor}15` }}
              >
                <Plus size={16} style={{ color: typeColor }} />
              </button>
              {isMobile && (
                <button
                  onClick={closeMobilePanels}
                  title="Close"
                  aria-label="Close folders panel"
                  className="rounded-lg p-1.5 transition-colors hover:bg-sunken"
                >
                  <X size={18} className="text-subtle" />
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-subtle"
            />
            <input
              type="text"
              placeholder="Search..."
              inputMode="search"
              enterKeyHint="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-sm text-foreground transition-all outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Folder tree */}
        <div className="flex-1 space-y-0.5 overflow-y-auto py-2">
          {filteredFolders.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted">
              No folders yet.
              <br />
              <button
                onClick={() => setShowNewFolder(true)}
                className="mt-1 text-primary hover:underline"
              >
                Create one
              </button>
            </div>
          )}
          {filteredFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              depth={0}
              activeItemId={activeItemId}
              onSelectFile={handleSelectFile}
              onAddFileToFolder={handleAddFile}
              onAddSubfolder={(parentId) => {
                setNewFolderName("");
                addFolder({
                  name: "New Subfolder",
                  categoryId: activeCategoryId!,
                  parentId,
                  isExpanded: true,
                });
              }}
            />
          ))}
        </div>

        {/* New folder input */}
        {showNewFolder && (
          <div className="px-3 pb-2">
            <input
              autoFocus
              className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm text-foreground outline-none"
              style={{
                borderColor: typeColor,
              }}
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFolder(null);
                if (e.key === "Escape") setShowNewFolder(false);
              }}
              onBlur={() => handleAddFolder(null)}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 border-t border-border p-2">
          <button
            onClick={() => setShowNewFolder(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sunken py-1.5 text-xs font-medium text-muted transition-colors hover:opacity-80"
          >
            <FolderOpen size={13} />
            New Folder
          </button>
          <button
            onClick={() => {
              if (categoryFolders.length > 0) {
                handleAddFile(categoryFolders[0].id);
              }
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ background: `${typeColor}20`, color: typeColor }}
          >
            <Plus size={13} />
            New File
          </button>
        </div>
      </div>
    </>
  );
}
